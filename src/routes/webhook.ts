import { Router, Request, Response } from 'express';
import { pool } from '../db';
import { deliveryQueue } from '../queue';
import { getVerifier } from '../verifiers';

const router = Router();

router.post('/:endpointId', async (req: Request, res: Response): Promise<void> => {
    const { body, params, headers, rawBody } = req;
    const { endpointId } = params;

    try {
        // Fetch the full endpoint record.
        // Phase 2 only needed SELECT id — now we need provider_type and secret too.
        const endpointResult = await pool.query<{
            id: string;
            provider_type: string;
            secret: string | null;
        }>(
            'SELECT id, provider_type, secret FROM endpoints WHERE id = $1',
            [endpointId]
        );

        if (endpointResult.rows.length === 0) {
            res.status(404).json({ error: 'Endpoint not found' });
            return;
        }

        const endpoint = endpointResult.rows[0];

        // Signature verification — runs before any data is written.
        // Generic endpoints opt out of verification entirely.
        // All other provider types must pass verification or the request is rejected.
        if (endpoint.provider_type !== 'generic') {
            const verifier = getVerifier(endpoint.provider_type);

            // provider_type is stored in the DB but no verifier is registered for it.
            // This is a server-side configuration gap, not a problem with the request.
            if (!verifier) {
                console.error(`[Webhook] No verifier registered for provider: ${endpoint.provider_type}`);
                res.status(500).json({ error: 'No verifier configured for this provider' });
                return;
            }

            // The endpoint exists but was registered without a secret.
            // A non-generic provider without a secret cannot be verified.
            if (!endpoint.secret) {
                console.error(`[Webhook] Endpoint ${endpointId} missing required secret`);
                res.status(500).json({ error: 'Endpoint is missing a required secret' });
                return;
            }

            // rawBody is set by the verify callback in express.json() in server.ts.
            // It should always be present for POST requests with a body.
            if (!rawBody) {
                res.status(400).json({ error: 'Request body could not be read' });
                return;
            }

            // Express lowercases all header names. Headers passed here are already lowercase.
            // Each verifier knows which lowercase header name to look for.
            const isValid = verifier.verify(
                rawBody,
                headers as Record<string, string>,
                endpoint.secret
            );

            if (!isValid) {
                console.warn(
                    `[Webhook] ✗ Signature verification failed — provider: ${endpoint.provider_type}, endpoint: ${endpointId}`
                );
                res.status(401).json({ error: 'Invalid signature' });
                return;
            }

            console.log(
                `[Webhook] ✓ Signature verified — provider: ${endpoint.provider_type}, endpoint: ${endpointId}`
            );
        }

        // Only reach here if: provider is generic (no verification needed),
        // or verification passed. Write the event to Postgres now.
        const eventResult = await pool.query<{ id: string }>(
            `INSERT INTO events (endpoint_id, payload, headers, status)
       VALUES ($1, $2, $3, 'pending')
       RETURNING id`,
            [endpointId, JSON.stringify(body), JSON.stringify(headers)]
        );

        const eventId = eventResult.rows[0].id;

        await deliveryQueue.add('deliver', { eventId });

        res.status(200).json({ received: true, eventId });
    } catch (err) {
        console.error('[Webhook] Ingestion error:', err);
        if (!res.headersSent) {
            res.status(500).json({ error: 'Failed to process webhook' });
        }
    }
});

export default router;
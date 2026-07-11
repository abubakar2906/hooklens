import { Router, Request, Response } from 'express';
import { pool } from '../db';
import { deliveryQueue, RETRY_CONFIG } from '../queue';
import { getVerifier } from '../verifiers';

const router = Router();

router.post('/:endpointId', async (req: Request, res: Response): Promise<void> => {
    const { body, params, headers, rawBody } = req;
    const { endpointId } = params;

    try {
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

        if (endpoint.provider_type !== 'generic') {
            const verifier = getVerifier(endpoint.provider_type);

            if (!verifier) {
                res.status(500).json({ error: 'No verifier configured for this provider' });
                return;
            }

            if (!endpoint.secret) {
                res.status(500).json({ error: 'Endpoint is missing a required secret' });
                return;
            }

            if (!rawBody) {
                res.status(400).json({ error: 'Request body could not be read' });
                return;
            }

            const isValid = verifier.verify(
                rawBody,
                headers as Record<string, string>,
                endpoint.secret
            );

            if (!isValid) {
                console.warn(`[Webhook] ✗ Signature verification failed — endpoint: ${endpointId}`);
                res.status(401).json({ error: 'Invalid signature' });
                return;
            }

            console.log(`[Webhook] ✓ Signature verified — provider: ${endpoint.provider_type}`);
        }

        const eventResult = await pool.query<{ id: string }>(
            `INSERT INTO events (endpoint_id, payload, headers, status)
       VALUES ($1, $2, $3, 'pending')
       RETURNING id`,
            [endpointId, JSON.stringify(body), JSON.stringify(headers)]
        );

        const eventId = eventResult.rows[0].id;

        // RETRY_CONFIG attaches attempt count and backoff schedule to every job.
        await deliveryQueue.add('deliver', { eventId }, RETRY_CONFIG);

        res.status(200).json({ received: true, eventId });
    } catch (err) {
        console.error('[Webhook] Ingestion error:', err);
        if (!res.headersSent) {
            res.status(500).json({ error: 'Failed to process webhook' });
        }
    }
});

export default router;
import { Router, Request, Response } from 'express';
import { pool } from '../db';
import { deliveryQueue } from '../queue';

const router = Router();

router.post('/:endpointId', async (req: Request, res: Response): Promise<void> => {
    const { body, params, headers } = req;
    const { endpointId } = params;

    try {
        const endpointResult = await pool.query(
            'SELECT id FROM endpoints WHERE id = $1',
            [endpointId]
        );

        if (endpointResult.rows.length === 0) {
            res.status(404).json({ error: 'Endpoint not found' });
            return;
        }

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
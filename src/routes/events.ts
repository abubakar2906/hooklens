import { Router, Request, Response } from 'express';
import { pool } from '../db';
import { deliveryQueue, RETRY_CONFIG } from '../queue';

const router = Router();

// GET /api/events?status=failed
router.get('/', async (req: Request, res: Response): Promise<void> => {
    const { status } = req.query as { status?: string };

    // "retrying" is derived (pending + has delivery attempts), not stored.
    // "pending" in the filter means pure pending — no attempts yet.
    let whereClause = '';
    const params: (string | number)[] = [];

    if (status === 'retrying') {
        whereClause = `WHERE e.status = 'pending' AND EXISTS (
      SELECT 1 FROM deliveries d WHERE d.event_id = e.id
    )`;
    } else if (status === 'pending') {
        whereClause = `WHERE e.status = 'pending' AND NOT EXISTS (
      SELECT 1 FROM deliveries d WHERE d.event_id = e.id
    )`;
    } else if (status && status !== 'all') {
        whereClause = 'WHERE e.status = $1';
        params.push(status);
    }

    params.push(100);
    const limitPlaceholder = `$${params.length}`;

    try {
        const result = await pool.query(
            `SELECT
         e.id,
         e.status,
         e.created_at,
         e.updated_at,
         e.payload,
         e.endpoint_id,
         ep.url           AS destination_url,
         ep.provider_type,
         CASE
           WHEN e.status = 'pending' AND EXISTS (
             SELECT 1 FROM deliveries d WHERE d.event_id = e.id
           ) THEN 'retrying'
           ELSE e.status
         END              AS display_status,
         (SELECT duration_ms FROM deliveries
          WHERE event_id = e.id
          ORDER BY attempt_number DESC LIMIT 1) AS last_duration_ms,
         (SELECT COUNT(*) FROM deliveries WHERE event_id = e.id)::int AS attempt_count
       FROM events e
       JOIN endpoints ep ON ep.id = e.endpoint_id
       ${whereClause}
       ORDER BY e.created_at DESC
       LIMIT ${limitPlaceholder}`,
            params
        );

        res.json(result.rows);
    } catch (err) {
        console.error('[Events] List error:', err);
        res.status(500).json({ error: 'Failed to fetch events' });
    }
});

// GET /api/events/:id
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        const eventResult = await pool.query(
            `SELECT
         e.*,
         ep.url           AS destination_url,
         ep.provider_type,
         CASE
           WHEN e.status = 'pending' AND EXISTS (
             SELECT 1 FROM deliveries d WHERE d.event_id = e.id
           ) THEN 'retrying'
           ELSE e.status
         END              AS display_status
       FROM events e
       JOIN endpoints ep ON ep.id = e.endpoint_id
       WHERE e.id = $1`,
            [id]
        );

        if (eventResult.rows.length === 0) {
            res.status(404).json({ error: 'Event not found' });
            return;
        }

        const [deliveriesResult, diagnosticsResult] = await Promise.all([
            pool.query(
                'SELECT * FROM deliveries WHERE event_id = $1 ORDER BY attempt_number ASC',
                [id]
            ),
            pool.query(
                'SELECT * FROM diagnostics WHERE event_id = $1',
                [id]
            ),
        ]);

        res.json({
            ...eventResult.rows[0],
            deliveries: deliveriesResult.rows,
            diagnosis: diagnosticsResult.rows[0] ?? null,
        });
    } catch (err) {
        console.error('[Events] Detail error:', err);
        res.status(500).json({ error: 'Failed to fetch event' });
    }
});

// POST /api/events/:id/replay
router.post('/:id/replay', async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        const eventResult = await pool.query(
            'SELECT id, status FROM events WHERE id = $1',
            [id]
        );

        if (eventResult.rows.length === 0) {
            res.status(404).json({ error: 'Event not found' });
            return;
        }

        if (eventResult.rows[0].status === 'pending') {
            res.status(400).json({ error: 'Event is already queued for delivery' });
            return;
        }

        await pool.query(
            `UPDATE events SET status = 'pending', updated_at = NOW() WHERE id = $1`,
            [id]
        );

        await deliveryQueue.add('deliver', { eventId: id }, RETRY_CONFIG);

        res.json({ success: true, message: 'Event queued for replay' });
    } catch (err) {
        console.error('[Events] Replay error:', err);
        res.status(500).json({ error: 'Failed to replay event' });
    }
});

export default router;
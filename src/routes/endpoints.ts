import { Router, Request, Response } from 'express';
import { pool } from '../db';

const router = Router();

const VALID_PROVIDERS = ['paystack', 'flutterwave', 'monnify', 'generic'] as const;
type ProviderType = typeof VALID_PROVIDERS[number];

// POST /api/endpoints
router.post('/', async (req: Request, res: Response): Promise<void> => {
    const userId = req.auth.userId;
    if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }

    const { url, provider_type, secret } = req.body as {
        url: string;
        provider_type: ProviderType;
        secret?: string;
    };

    if (!url || !provider_type) {
        res.status(400).json({ error: 'url and provider_type are required' });
        return;
    }

    if (!VALID_PROVIDERS.includes(provider_type)) {
        res.status(400).json({
            error: `provider_type must be one of: ${VALID_PROVIDERS.join(', ')}`,
        });
        return;
    }

    try {
        const result = await pool.query(
            `INSERT INTO endpoints (url, provider_type, secret, user_id)
       VALUES ($1, $2, $3, $4)
       RETURNING id, url, provider_type, created_at`,
            [url, provider_type, secret ?? null, userId]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('[Endpoints] Create error:', err);
        res.status(500).json({ error: 'Failed to create endpoint' });
    }
});

// GET /api/endpoints — includes per-endpoint stats for the dashboard
router.get('/', async (req: Request, res: Response): Promise<void> => {
    const userId = req.auth.userId;
    if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }

    try {
        const result = await pool.query(
            `SELECT
         ep.id,
         ep.url,
         ep.provider_type,
         ep.created_at,
         COUNT(e.id)::int                                                                                AS total_events,
         COUNT(e.id) FILTER (WHERE e.created_at > NOW() - INTERVAL '24 hours')::int                    AS events_today,
         ROUND(
           COUNT(e.id) FILTER (WHERE e.status = 'success' AND e.created_at > NOW() - INTERVAL '24 hours')::numeric /
           NULLIF(COUNT(e.id) FILTER (WHERE e.created_at > NOW() - INTERVAL '24 hours'), 0) * 100, 1
         ) AS success_rate
       FROM endpoints ep
       LEFT JOIN events e ON e.endpoint_id = ep.id
       WHERE ep.user_id = $1
       GROUP BY ep.id
       ORDER BY ep.created_at DESC`,
            [userId]
        );
        res.json(result.rows);
    } catch (err) {
        console.error('[Endpoints] List error:', err);
        res.status(500).json({ error: 'Failed to fetch endpoints' });
    }
});

// GET /api/endpoints/:id/events
router.get('/:id/events', async (req: Request, res: Response): Promise<void> => {
    const userId = req.auth.userId;
    if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    const { id } = req.params;

    try {
        const result = await pool.query(
            `SELECT e.id, e.status, e.created_at, e.updated_at
       FROM events e
       JOIN endpoints ep ON ep.id = e.endpoint_id
       WHERE e.endpoint_id = $1 AND ep.user_id = $2
       ORDER BY e.created_at DESC
       LIMIT 50`,
            [id, userId]
        );
        res.json(result.rows);
    } catch (err) {
        console.error('[Endpoints] Events query error:', err);
        res.status(500).json({ error: 'Failed to fetch events' });
    }
});

export default router;
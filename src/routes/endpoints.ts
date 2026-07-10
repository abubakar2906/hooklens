import { Router, Request, Response } from 'express';
import { pool } from '../db';

const router = Router();

const VALID_PROVIDERS = ['paystack', 'flutterwave', 'monnify', 'generic'] as const;
type ProviderType = typeof VALID_PROVIDERS[number];

router.post('/', async (req: Request, res: Response): Promise<void> => {
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
            `INSERT INTO endpoints (url, provider_type, secret)
       VALUES ($1, $2, $3)
       RETURNING id, url, provider_type, created_at`,
            [url, provider_type, secret ?? null]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('[Endpoints] Create error:', err);
        res.status(500).json({ error: 'Failed to create endpoint' });
    }
});

router.get('/', async (_req: Request, res: Response): Promise<void> => {
    try {
        const result = await pool.query(
            `SELECT id, url, provider_type, created_at
       FROM endpoints
       ORDER BY created_at DESC`
        );
        res.json(result.rows);
    } catch (err) {
        console.error('[Endpoints] List error:', err);
        res.status(500).json({ error: 'Failed to fetch endpoints' });
    }
});

router.get('/:id/events', async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            `SELECT id, status, created_at, updated_at
       FROM events
       WHERE endpoint_id = $1
       ORDER BY created_at DESC
       LIMIT 50`,
            [id]
        );
        res.json(result.rows);
    } catch (err) {
        console.error('[Endpoints] Events query error:', err);
        res.status(500).json({ error: 'Failed to fetch events' });
    }
});

export default router;
import { Router, Request, Response } from 'express';
import { pool } from '../db';

const router = Router();

router.get('/', async (_req: Request, res: Response): Promise<void> => {
    try {
        const [eventStats, latencyStats] = await Promise.all([
            pool.query<{
                events_today: string;
                failed_today: string;
                success_rate: string | null;
            }>(`
        SELECT
          COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '24 hours')                       AS events_today,
          COUNT(*) FILTER (WHERE status = 'failed' AND created_at > NOW() - INTERVAL '24 hours') AS failed_today,
          ROUND(
            COUNT(*) FILTER (WHERE status = 'success' AND created_at > NOW() - INTERVAL '24 hours')::numeric /
            NULLIF(COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '24 hours'), 0) * 100, 1
          ) AS success_rate
        FROM events
      `),
            pool.query<{ avg_latency_ms: string | null }>(`
        SELECT ROUND(AVG(duration_ms)) AS avg_latency_ms
        FROM deliveries
        WHERE created_at > NOW() - INTERVAL '24 hours'
      `),
        ]);

        res.json({
            ...eventStats.rows[0],
            avg_latency_ms: latencyStats.rows[0].avg_latency_ms ?? '0',
        });
    } catch (err) {
        console.error('[Stats] Error:', err);
        res.status(500).json({ error: 'Failed to fetch stats' });
    }
});

export default router;
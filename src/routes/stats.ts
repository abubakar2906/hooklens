import { Router, Request, Response } from 'express';
import { pool } from '../db';

const router = Router();

router.get('/', async (req: Request, res: Response): Promise<void> => {
    const userId = req.auth.userId;
    if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }

    try {
        const [eventStats, latencyStats] = await Promise.all([
            pool.query<{
                events_today: string;
                failed_today: string;
                success_rate: string | null;
            }>(`
        SELECT
          COUNT(e.id) FILTER (WHERE e.created_at > NOW() - INTERVAL '24 hours')                       AS events_today,
          COUNT(e.id) FILTER (WHERE e.status = 'failed' AND e.created_at > NOW() - INTERVAL '24 hours') AS failed_today,
          ROUND(
            COUNT(e.id) FILTER (WHERE e.status = 'success' AND e.created_at > NOW() - INTERVAL '24 hours')::numeric /
            NULLIF(COUNT(e.id) FILTER (WHERE e.created_at > NOW() - INTERVAL '24 hours'), 0) * 100, 1
          ) AS success_rate
        FROM events e
        JOIN endpoints ep ON ep.id = e.endpoint_id
        WHERE ep.user_id = $1
      `, [userId]),
            pool.query<{ avg_latency_ms: string | null }>(`
        SELECT ROUND(AVG(d.duration_ms)) AS avg_latency_ms
        FROM deliveries d
        JOIN events e ON e.id = d.event_id
        JOIN endpoints ep ON ep.id = e.endpoint_id
        WHERE d.created_at > NOW() - INTERVAL '24 hours' AND ep.user_id = $1
      `, [userId]),
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
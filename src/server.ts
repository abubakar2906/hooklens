import 'dotenv/config';
import cors from 'cors';
import express, { Request, Response, NextFunction } from 'express';
import { config } from './config';
import { pool } from './db';
import webhookRoutes from './routes/webhook';
import endpointRoutes from './routes/endpoints';
import eventRoutes from './routes/events';
import statsRoutes from './routes/stats';
import { deliveryWorker } from './workers/delivery';

const app = express();

const allowedOrigins = (process.env.DASHBOARD_URL || 'http://localhost:3001')
    .split(',')
    .map((o) => o.trim());

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (e.g. curl, Render health checks)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            callback(null, origin);
        } else {
            callback(new Error(`CORS: origin '${origin}' not allowed`));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));

app.use(
    express.json({
        verify: (req: Request, _res, buf) => {
            req.rawBody = buf.toString('utf8');
        },
    })
);

import { requireAuth } from './middleware/auth';

app.use('/webhooks', webhookRoutes);
app.use('/api', requireAuth);
app.use('/api/endpoints', endpointRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/stats', statsRoutes);

app.get('/health', (_req, res) => {
    res.json({
        status: 'ok',
        service: 'hooklens-ingestion',
        worker: deliveryWorker.isRunning() ? 'running' : 'stopped',
    });
});

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error('[Server] Unhandled error:', err);
    res.status(err.statusCode || 500).json({ error: err.message || 'Internal server error', details: err });
});

const server = app.listen(config.port, '0.0.0.0', () => {
    console.log(`✓ HookLens ingestion server  → http://localhost:${config.port}`);
    console.log(`✓ Delivery worker            → listening on queue 'webhook-delivery'`);
});

async function shutdown(signal: string): Promise<void> {
    console.log(`\n[Server] Received ${signal}, shutting down gracefully...`);
    server.close(async () => {
        await deliveryWorker.close();
        await pool.end();
        process.exit(0);
    });
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

export default app;
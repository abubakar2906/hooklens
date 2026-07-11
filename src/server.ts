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

app.use(cors({
    origin: process.env.DASHBOARD_URL || 'http://localhost:3001',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
}));

app.use(
    express.json({
        verify: (req: Request, _res, buf) => {
            req.rawBody = buf.toString('utf8');
        },
    })
);

app.use('/webhooks', webhookRoutes);
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

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error('[Server] Unhandled error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

const server = app.listen(config.port, () => {
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
import { Queue } from 'bullmq';
import IORedis from 'ioredis';
import { config } from '../config';

const isTlsRedis = config.redisUrl.startsWith('rediss://');

export const redisConnection = new IORedis(config.redisUrl, {
    maxRetriesPerRequest: null,
    tls: isTlsRedis ? { rejectUnauthorized: false } : undefined,
});

// Single source of truth for retry configuration.
// Imported by both the webhook route (when enqueuing) and the worker
// (when checking if a failure is terminal).
// Formula from PRD: Delay = 60_000 * 2^attemptsMade
// Attempt 1: immediate → Attempt 2: 1min → 3: 2min → 4: 4min → 5: 8min
export const RETRY_CONFIG = {
    attempts: 5,
    backoff: {
        type: 'exponential' as const,
        delay: 60_000,
    },
} as const;

export const deliveryQueue = new Queue('webhook-delivery', {
    connection: redisConnection,
    defaultJobOptions: {
        removeOnComplete: 100,
        removeOnFail: 500,
    },
});

redisConnection.on('error', (err) => {
    console.error('[Redis] Connection error:', err);
});
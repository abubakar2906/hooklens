import { Queue } from 'bullmq';
import { config } from '../config';

const redisUrl = new URL(config.redisUrl);

// Pass connection options to BullMQ instead of constructing an ioredis
// client here. BullMQ ships its own compatible ioredis version, and sharing
// a separately-installed client causes TypeScript and runtime incompatibility.
export const redisConnection = {
    host: redisUrl.hostname,
    port: Number(redisUrl.port || 6379),
    username: redisUrl.username || undefined,
    password: redisUrl.password || undefined,
    db: redisUrl.pathname && redisUrl.pathname !== '/' ? Number(redisUrl.pathname.slice(1)) : undefined,
    maxRetriesPerRequest: null,
    ...(redisUrl.protocol === 'rediss:'
        ? { tls: { rejectUnauthorized: false } }
        : {}),
};

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

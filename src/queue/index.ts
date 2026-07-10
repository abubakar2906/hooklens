import { Queue } from 'bullmq';
import IORedis from 'ioredis';
import { config } from '../config';

const isTlsRedis = config.redisUrl.startsWith('rediss://');

export const redisConnection = new IORedis(config.redisUrl, {
    maxRetriesPerRequest: null,
    tls: isTlsRedis ? { rejectUnauthorized: false } : undefined,
});

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
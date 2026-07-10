import { Worker, Job } from 'bullmq';
import { pool } from '../db';
import { redisConnection } from '../queue';

interface DeliveryJobData {
    eventId: string;
}

async function processDelivery(job: Job<DeliveryJobData>): Promise<void> {
    const { eventId } = job.data;

    console.log(`[Worker] Job ${job.id} → processing event ${eventId}`);

    const result = await pool.query<{
        id: string;
        payload: Record<string, unknown>;
        headers: Record<string, string>;
        status: string;
        destination_url: string;
    }>(
        `SELECT
       e.id,
       e.payload,
       e.headers,
       e.status,
       ep.url AS destination_url
     FROM events e
     JOIN endpoints ep ON ep.id = e.endpoint_id
     WHERE e.id = $1`,
        [eventId]
    );

    if (result.rows.length === 0) {
        throw new Error(`Event ${eventId} not found in database`);
    }

    const event = result.rows[0];

    if (event.status === 'success') {
        console.log(`[Worker] Event ${eventId} already delivered — skipping`);
        return;
    }

    const startTime = Date.now();

    const forwardResponse = await fetch(event.destination_url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-hooklens-forwarded': 'true',
            'x-hooklens-event-id': eventId,
        },
        body: JSON.stringify(event.payload),
    });

    const durationMs = Date.now() - startTime;

    if (forwardResponse.ok) {
        await pool.query(
            `UPDATE events
       SET status = 'success', updated_at = NOW()
       WHERE id = $1`,
            [eventId]
        );

        console.log(
            `[Worker] ✓ Event ${eventId} delivered → HTTP ${forwardResponse.status} (${durationMs}ms)`
        );
    } else {
        await pool.query(
            `UPDATE events
       SET status = 'failed', updated_at = NOW()
       WHERE id = $1`,
            [eventId]
        );

        throw new Error(
            `Destination ${event.destination_url} returned HTTP ${forwardResponse.status}`
        );
    }
}

export const deliveryWorker = new Worker<DeliveryJobData>(
    'webhook-delivery',
    processDelivery,
    {
        connection: redisConnection,
        concurrency: 5,
    }
);

deliveryWorker.on('completed', (job) => {
    console.log(`[Worker] Job ${job.id} completed`);
});

deliveryWorker.on('failed', (job, err) => {
    console.error(`[Worker] Job ${job?.id} failed: ${err.message}`);
});
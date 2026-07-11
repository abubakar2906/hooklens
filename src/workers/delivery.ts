import { Worker, Job } from 'bullmq';
import { pool } from '../db';
import { redisConnection, RETRY_CONFIG } from '../queue';

interface DeliveryJobData {
    eventId: string;
}

async function processDelivery(job: Job<DeliveryJobData>): Promise<void> {
    const { eventId } = job.data;

    // attemptsMade is 0-indexed — it reflects how many attempts happened
    // before this one. Adding 1 gives a human-readable 1-5 attempt number.
    const attemptNumber = job.attemptsMade + 1;

    console.log(
        `[Worker] Job ${job.id} → attempt ${attemptNumber}/${RETRY_CONFIG.attempts} for event ${eventId}`
    );

    const result = await pool.query<{
        id: string;
        payload: Record<string, unknown>;
        status: string;
        destination_url: string;
    }>(
        `SELECT
       e.id,
       e.payload,
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

    // Capture delivery outcome in these variables so we can write the
    // deliveries record regardless of whether the attempt succeeded or failed.
    let statusCode: number | null = null;
    let responseBody: string | null = null;
    let deliveryError: Error | null = null;

    try {
        const forwardResponse = await fetch(event.destination_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-hooklens-forwarded': 'true',
                'x-hooklens-event-id': eventId,
                'x-hooklens-attempt': String(attemptNumber),
            },
            body: JSON.stringify(event.payload),
        });

        statusCode = forwardResponse.status;
        responseBody = await forwardResponse.text();

        if (!forwardResponse.ok) {
            deliveryError = new Error(`Destination returned HTTP ${statusCode}`);
        }
    } catch (err) {
        // Network-level failure — no HTTP response was received at all.
        // Store the error message as the response body so there's a record of why.
        deliveryError = err as Error;
        responseBody = (err as Error).message;
    }

    const durationMs = Date.now() - startTime;

    // Always write a deliveries record — every attempt is persisted whether it
    // succeeded or failed. This gives the dashboard a full audit trail.
    await pool.query(
        `INSERT INTO deliveries (event_id, attempt_number, status_code, response_body, duration_ms)
     VALUES ($1, $2, $3, $4, $5)`,
        [eventId, attemptNumber, statusCode, responseBody, durationMs]
    );

    if (!deliveryError) {
        await pool.query(
            `UPDATE events SET status = 'success', updated_at = NOW() WHERE id = $1`,
            [eventId]
        );
        console.log(
            `[Worker] ✓ Event ${eventId} delivered → HTTP ${statusCode} (${durationMs}ms)`
        );
    } else {
        console.warn(
            `[Worker] ✗ Attempt ${attemptNumber} failed for event ${eventId}: ${deliveryError.message}`
        );
        // Throwing tells BullMQ this attempt failed. BullMQ will schedule
        // the next retry using the exponential backoff config on the job.
        throw deliveryError;
    }
}

// Runs after every failed attempt, including the terminal one.
// We detect terminal failure by comparing attemptsMade to the max.
async function handleTerminalFailure(eventId: string): Promise<void> {
    try {
        await pool.query(
            `UPDATE events SET status = 'failed', updated_at = NOW() WHERE id = $1`,
            [eventId]
        );
        console.error(
            `[Worker] ✗✗ Event ${eventId} permanently failed after ${RETRY_CONFIG.attempts} attempts`
        );
        // Phase 5: AI diagnostic worker fires here.
        // triggerDiagnostic(eventId) — will be wired in next phase.
    } catch (err) {
        console.error(`[Worker] Failed to mark event ${eventId} as failed:`, err);
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

deliveryWorker.on('failed', async (job, err) => {
    if (!job) return;

    console.error(`[Worker] Job ${job.id} failed: ${err.message}`);

    // job.attemptsMade is incremented after each failure. When it equals
    // RETRY_CONFIG.attempts, BullMQ has exhausted all retries — this is terminal.
    const isTerminal = job.attemptsMade >= RETRY_CONFIG.attempts;
    if (isTerminal) {
        await handleTerminalFailure(job.data.eventId);
    }
});
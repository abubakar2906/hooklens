import 'dotenv/config';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { pool } from './index';

async function migrate(): Promise<void> {
    const client = await pool.connect();

    try {
        await client.query(`
      CREATE TABLE IF NOT EXISTS _migrations (
        id        SERIAL PRIMARY KEY,
        filename  VARCHAR NOT NULL UNIQUE,
        run_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);

        const { rows } = await client.query<{ filename: string }>(
            'SELECT filename FROM _migrations'
        );
        const applied = new Set(rows.map((r) => r.filename));

        const migrationsDir = join(__dirname, 'migrations');
        const files = readdirSync(migrationsDir)
            .filter((f) => f.endsWith('.sql'))
            .sort();

        for (const file of files) {
            if (applied.has(file)) {
                console.log(`[Migrate] Skipping  ${file} — already applied`);
                continue;
            }

            console.log(`[Migrate] Applying  ${file}...`);
            const sql = readFileSync(join(migrationsDir, file), 'utf8');

            await client.query('BEGIN');
            try {
                await client.query(sql);
                await client.query(
                    'INSERT INTO _migrations (filename) VALUES ($1)',
                    [file]
                );
                await client.query('COMMIT');
                console.log(`[Migrate] Done      ${file}`);
            } catch (err) {
                await client.query('ROLLBACK');
                throw err;
            }
        }

        console.log('[Migrate] All migrations applied successfully.');
    } finally {
        client.release();
        await pool.end();
    }
}

migrate().catch((err) => {
    console.error('[Migrate] Fatal error:', err);
    process.exit(1);
});
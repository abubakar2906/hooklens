import { Pool } from 'pg';
import { config } from '../config';

const isLocalDatabase = config.databaseUrl.includes('localhost') ||
    config.databaseUrl.includes('127.0.0.1');

export const pool = new Pool({
    connectionString: config.databaseUrl,
    ssl: isLocalDatabase ? false : { rejectUnauthorized: false },
    max: 20,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 2_000,
});

pool.on('error', (err) => {
    console.error('[DB] Unexpected error on idle client:', err);
    process.exit(1);
});
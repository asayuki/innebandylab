import { Pool, types } from 'pg';

// Return DATE columns as plain "YYYY-MM-DD" strings, not JavaScript Date objects.
// pg converts DATE (OID 1082) to Date by default; serialising via res.json() then
// produces "…T00:00:00.000Z" which breaks string-based date helpers on the frontend.
types.setTypeParser(1082, (val: string) => val);

export const db = new Pool({
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT ?? 5432),
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    max: 20,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 5_000,
});

db.on('error', (err) => {
    console.error('Unexpected DB pool error', err);
});

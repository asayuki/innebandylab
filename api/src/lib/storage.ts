import * as Minio from 'minio';

const client = new Minio.Client({
    endPoint: process.env.MINIO_ENDPOINT ?? 'minio',
    port: Number(process.env.MINIO_PORT ?? 9000),
    useSSL: process.env.MINIO_USE_SSL === 'true',
    accessKey: process.env.MINIO_ACCESS_KEY ?? '',
    secretKey: process.env.MINIO_SECRET_KEY ?? '',
});

const BUCKET = process.env.MINIO_BUCKET_NAME ?? 'innebandylab';
const PUBLIC_URL = (process.env.MINIO_PUBLIC_URL ?? 'http://localhost:9000').replace(/\/$/, '');

export async function uploadBuffer(
    objectName: string,
    buffer: Buffer,
    contentType: string,
): Promise<string> {
    await client.putObject(BUCKET, objectName, buffer, buffer.length, {
        'Content-Type': contentType,
    });
    return `${PUBLIC_URL}/${BUCKET}/${objectName}`;
}

export async function deleteObject(objectName: string): Promise<void> {
    try {
        await client.removeObject(BUCKET, objectName);
    } catch {
        // best-effort
    }
}

export function objectNameFromUrl(url: string): string | null {
    const prefix = `${PUBLIC_URL}/${BUCKET}/`;
    return url.startsWith(prefix) ? url.slice(prefix.length) : null;
}

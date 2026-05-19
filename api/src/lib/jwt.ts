import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;
const ACCESS_EXPIRY = process.env.JWT_ACCESS_EXPIRATION ?? '15m';
const REFRESH_EXPIRY = process.env.JWT_REFRESH_EXPIRATION ?? '7d';

export interface AccessPayload {
    sub: string;
    email: string;
    role: string;
    tier: string;
}

export interface RefreshPayload {
    sub: string;
    jti: string;
}

export const signAccessToken = (payload: AccessPayload): string =>
    jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRY } as jwt.SignOptions);

export const signRefreshToken = (payload: RefreshPayload): string =>
    jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRY } as jwt.SignOptions);

export const verifyAccessToken = (token: string): AccessPayload =>
    jwt.verify(token, ACCESS_SECRET) as AccessPayload;

export const verifyRefreshToken = (token: string): RefreshPayload =>
    jwt.verify(token, REFRESH_SECRET) as RefreshPayload;

export const hashToken = (token: string): string =>
    crypto.createHash('sha256').update(token).digest('hex');

export const generateRefreshJti = (): string =>
    crypto.randomBytes(32).toString('hex');

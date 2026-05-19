import type { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, type AccessPayload } from '../lib/jwt';
import { AppError } from './error';

declare global {
    namespace Express {
        interface Request {
            user?: AccessPayload;
        }
    }
}

const extractToken = (req: Request): string | null => {
    const auth = req.headers.authorization;
    if (auth?.startsWith('Bearer ')) return auth.slice(7);
    return null;
};

export const requireAuth = (req: Request, _res: Response, next: NextFunction): void => {
    const token = extractToken(req);
    if (!token) {
        next(new AppError(401, 'Authentication required'));
        return;
    }
    try {
        req.user = verifyAccessToken(token);
        next();
    } catch {
        next(new AppError(401, 'Invalid or expired token'));
    }
};

export const optionalAuth = (req: Request, _res: Response, next: NextFunction): void => {
    const token = extractToken(req);
    if (token) {
        try {
            req.user = verifyAccessToken(token);
        } catch {
            // Token was provided but is expired/invalid — tell the client to refresh rather
            // than silently falling back to "unauthenticated" (which would hide private data).
            next(new AppError(401, 'Token expired'));
            return;
        }
    }
    next();
};

const TIER_RANK: Record<string, number> = { free: 0, pro: 1, club: 2 };

export const requireSubscription = (minTier: 'pro' | 'club') =>
    (req: Request, _res: Response, next: NextFunction): void => {
        if (!req.user) {
            next(new AppError(401, 'Authentication required'));
            return;
        }
        const userRank = TIER_RANK[req.user.tier] ?? 0;
        if (userRank < (TIER_RANK[minTier] ?? 0)) {
            next(new AppError(403, `${minTier.charAt(0).toUpperCase() + minTier.slice(1)} subscription required`));
            return;
        }
        next();
    };

import type { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
    constructor(
        public statusCode: number,
        message: string,
    ) {
        super(message);
        this.name = 'AppError';
    }
}

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    _next: NextFunction,
): void => {
    if (err instanceof AppError) {
        console.error(`[${req.method} ${req.path}] ${err.statusCode} ${err.message}`);
        res.status(err.statusCode).json({ error: { code: 'APP_ERROR', message: err.message } });
        return;
    }
    console.error(`[${req.method} ${req.path}] 500`, err);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } });
};

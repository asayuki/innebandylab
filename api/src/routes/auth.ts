import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { db } from '../db/client';
import {
    signAccessToken,
    signRefreshToken,
    verifyRefreshToken,
    hashToken,
    generateRefreshJti,
} from '../lib/jwt';
import { requireAuth } from '../middleware/auth';
import { AppError } from '../middleware/error';

const router = Router();

const RegisterSchema = z.object({
    email: z.email(),
    name: z.string().min(1).max(100),
    password: z.string().min(8).max(72),
});

const LoginSchema = z.object({
    email: z.email(),
    password: z.string().min(1),
});

const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS ?? 12);

router.post('/register', async (req, res, next) => {
    try {
        const body = RegisterSchema.safeParse(req.body);
        if (!body.success) {
            throw new AppError(400, body.error.issues[0]?.message ?? 'Invalid input');
        }
        const { email, name, password } = body.data;

        const existing = await db.query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()]);
        if (existing.rows.length > 0) {
            throw new AppError(409, 'Email already in use');
        }

        const hash = await bcrypt.hash(password, saltRounds);
        const { rows } = await db.query<{ id: string; email: string; name: string; role: string; tier: string }>(
            'INSERT INTO users (email, name, password) VALUES ($1, $2, $3) RETURNING id, email, name, role, tier',
            [email.toLowerCase(), name, hash],
        );
        const user = rows[0]!;

        const jti = generateRefreshJti();
        const refreshToken = signRefreshToken({ sub: user.id, jti });
        const tokenHash = hashToken(refreshToken);
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        await db.query(
            'INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES ($1, $2, $3)',
            [user.id, tokenHash, expiresAt],
        );

        const accessToken = signAccessToken({
            sub: user.id,
            email: user.email,
            role: user.role,
            tier: user.tier,
        });

        res.status(201).json({ accessToken, refreshToken, user: { id: user.id, email: user.email, name: user.name, role: user.role, tier: user.tier } });
    } catch (err) {
        next(err);
    }
});

router.post('/login', async (req, res, next) => {
    try {
        const body = LoginSchema.safeParse(req.body);
        if (!body.success) {
            throw new AppError(400, body.error.issues[0]?.message ?? 'Invalid input');
        }
        const { email, password } = body.data;

        const { rows } = await db.query<{ id: string; email: string; name: string; password: string; role: string; tier: string }>(
            'SELECT id, email, name, password, role, tier FROM users WHERE email = $1',
            [email.toLowerCase()],
        );
        const user = rows[0];
        if (!user) {
            throw new AppError(401, 'Invalid email or password');
        }

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            throw new AppError(401, 'Invalid email or password');
        }

        const jti = generateRefreshJti();
        const refreshToken = signRefreshToken({ sub: user.id, jti });
        const tokenHash = hashToken(refreshToken);
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        await db.query(
            'INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES ($1, $2, $3)',
            [user.id, tokenHash, expiresAt],
        );

        const accessToken = signAccessToken({
            sub: user.id,
            email: user.email,
            role: user.role,
            tier: user.tier,
        });

        res.json({ accessToken, refreshToken, user: { id: user.id, email: user.email, name: user.name, role: user.role, tier: user.tier } });
    } catch (err) {
        next(err);
    }
});

router.post('/refresh', async (req, res, next) => {
    try {
        const { refreshToken } = req.body ?? {};
        if (!refreshToken || typeof refreshToken !== 'string') {
            throw new AppError(400, 'refreshToken is required');
        }

        let payload;
        try {
            payload = verifyRefreshToken(refreshToken);
        } catch {
            throw new AppError(401, 'Invalid or expired refresh token');
        }

        const tokenHash = hashToken(refreshToken);
        const { rows } = await db.query<{ id: string; user_id: string; revoked: boolean; expires_at: Date }>(
            'SELECT id, user_id, revoked, expires_at FROM refresh_tokens WHERE token_hash = $1',
            [tokenHash],
        );
        const stored = rows[0];
        if (!stored || stored.revoked || stored.expires_at < new Date()) {
            throw new AppError(401, 'Refresh token is invalid or revoked');
        }

        // Rotate: revoke old, issue new
        await db.query('UPDATE refresh_tokens SET revoked = TRUE WHERE id = $1', [stored.id]);

        const { rows: userRows } = await db.query<{ id: string; email: string; role: string; tier: string }>(
            'SELECT id, email, role, tier FROM users WHERE id = $1',
            [payload.sub],
        );
        const user = userRows[0];
        if (!user) {
            throw new AppError(401, 'User not found');
        }

        const jti = generateRefreshJti();
        const newRefreshToken = signRefreshToken({ sub: user.id, jti });
        const newHash = hashToken(newRefreshToken);
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        await db.query(
            'INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES ($1, $2, $3)',
            [user.id, newHash, expiresAt],
        );

        const accessToken = signAccessToken({ sub: user.id, email: user.email, role: user.role, tier: user.tier });

        res.json({ accessToken, refreshToken: newRefreshToken });
    } catch (err) {
        next(err);
    }
});

// GET /auth/me
router.get('/me', requireAuth, async (req, res, next) => {
    try {
        const { rows } = await db.query<{ id: string; email: string; name: string; role: string; tier: string }>(
            'SELECT id, email, name, role, tier FROM users WHERE id = $1',
            [req.user!.sub],
        );
        if (!rows[0]) throw new AppError(404, 'User not found');
        res.json(rows[0]);
    } catch (err) { next(err); }
});

// PATCH /auth/me
router.patch('/me', requireAuth, async (req, res, next) => {
    try {
        const body = z.object({
            name: z.string().min(1).max(100).optional(),
            email: z.email().optional(),
            currentPassword: z.string().optional(),
            newPassword: z.string().min(8).max(72).optional(),
        }).safeParse(req.body);
        if (!body.success) throw new AppError(400, body.error.issues[0]?.message ?? 'Invalid input');

        const { name, email, currentPassword, newPassword } = body.data;
        const needsPasswordCheck = email || newPassword;

        const { rows } = await db.query<{ id: string; email: string; name: string; role: string; tier: string; password: string }>(
            'SELECT id, email, name, role, tier, password FROM users WHERE id = $1',
            [req.user!.sub],
        );
        const user = rows[0];
        if (!user) throw new AppError(404, 'User not found');

        if (needsPasswordCheck) {
            if (!currentPassword) throw new AppError(400, 'Current password required');
            const valid = await bcrypt.compare(currentPassword, user.password);
            if (!valid) throw new AppError(401, 'Incorrect current password');
        }

        const updates: string[] = [];
        const params: unknown[] = [];

        if (name !== undefined) { params.push(name); updates.push(`name = $${params.length}`); }
        if (email !== undefined) {
            const exists = await db.query('SELECT id FROM users WHERE email = $1 AND id != $2', [email.toLowerCase(), user.id]);
            if (exists.rows.length > 0) throw new AppError(409, 'Email already in use');
            params.push(email.toLowerCase()); updates.push(`email = $${params.length}`);
        }
        if (newPassword) {
            const hash = await bcrypt.hash(newPassword, saltRounds);
            params.push(hash); updates.push(`password = $${params.length}`);
        }

        if (updates.length === 0) throw new AppError(400, 'Nothing to update');

        params.push(user.id);
        const { rows: updated } = await db.query<{ id: string; email: string; name: string; role: string; tier: string }>(
            `UPDATE users SET ${updates.join(', ')}, updated_at = NOW() WHERE id = $${params.length} RETURNING id, email, name, role, tier`,
            params,
        );
        res.json(updated[0]);
    } catch (err) { next(err); }
});

router.post('/logout', requireAuth, async (req, res, next) => {
    try {
        const { refreshToken } = req.body ?? {};
        if (refreshToken && typeof refreshToken === 'string') {
            const tokenHash = hashToken(refreshToken);
            await db.query('UPDATE refresh_tokens SET revoked = TRUE WHERE token_hash = $1', [tokenHash]);
        }
        res.status(204).end();
    } catch (err) {
        next(err);
    }
});

export default router;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerController = registerController;
exports.loginController = loginController;
exports.logoutController = logoutController;
exports.refreshController = refreshController;
exports.getMeController = getMeController;
exports.updateOnboardingController = updateOnboardingController;
const prisma_js_1 = require("../lib/prisma.js");
const password_js_1 = require("../auth/password.js");
const jwt_js_1 = require("../auth/jwt.js");
const auth_js_1 = require("../validators/auth.js");
async function registerController(req, res, next) {
    try {
        const data = auth_js_1.RegisterSchema.parse(req.body);
        const existingUser = await prisma_js_1.prisma.user.findUnique({ where: { email: data.email } });
        if (existingUser) {
            res.status(400).json({ error: 'Email address already registered' });
            return;
        }
        const hashedPassword = await (0, password_js_1.hashPassword)(data.password);
        const referralCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        let referredById;
        if (data.referralCode) {
            const referrer = await prisma_js_1.prisma.user.findUnique({ where: { referralCode: data.referralCode } });
            if (referrer) {
                referredById = referrer.id;
            }
        }
        const user = await prisma_js_1.prisma.user.create({
            data: {
                email: data.email,
                password: hashedPassword,
                name: data.name,
                referralCode,
                referredById,
            },
        });
        // Create initial usage tracker
        const today = new Date().toISOString().split('T')[0];
        await prisma_js_1.prisma.usage.create({
            data: {
                userId: user.id,
                requestsUsed: 0,
                lastResetDate: today,
            },
        });
        const jwtPayload = { userId: user.id, email: user.email, plan: user.plan };
        const accessToken = (0, jwt_js_1.generateAccessToken)(jwtPayload);
        const refreshToken = (0, jwt_js_1.generateRefreshToken)(jwtPayload);
        // Save refresh session
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        await prisma_js_1.prisma.session.create({
            data: {
                userId: user.id,
                refreshToken,
                expiresAt,
            },
        });
        (0, jwt_js_1.setAuthCookies)(res, accessToken, refreshToken);
        res.status(201).json({
            message: 'Registration successful',
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                plan: user.plan,
                referralCode: user.referralCode,
                onboardingCompleted: user.onboardingCompleted,
            },
        });
    }
    catch (err) {
        next(err);
    }
}
async function loginController(req, res, next) {
    try {
        const data = auth_js_1.LoginSchema.parse(req.body);
        const user = await prisma_js_1.prisma.user.findUnique({ where: { email: data.email } });
        if (!user) {
            res.status(401).json({ error: 'Invalid email or password' });
            return;
        }
        const validPassword = await (0, password_js_1.verifyPassword)(user.password, data.password);
        if (!validPassword) {
            res.status(401).json({ error: 'Invalid email or password' });
            return;
        }
        const jwtPayload = { userId: user.id, email: user.email, plan: user.plan };
        const accessToken = (0, jwt_js_1.generateAccessToken)(jwtPayload);
        const refreshToken = (0, jwt_js_1.generateRefreshToken)(jwtPayload);
        // Create session
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        await prisma_js_1.prisma.session.create({
            data: {
                userId: user.id,
                refreshToken,
                expiresAt,
            },
        });
        (0, jwt_js_1.setAuthCookies)(res, accessToken, refreshToken);
        res.json({
            message: 'Login successful',
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                plan: user.plan,
                referralCode: user.referralCode,
                onboardingCompleted: user.onboardingCompleted,
            },
        });
    }
    catch (err) {
        next(err);
    }
}
async function logoutController(req, res, next) {
    try {
        const refreshToken = req.cookies?.refreshToken;
        if (refreshToken) {
            await prisma_js_1.prisma.session.updateMany({
                where: { refreshToken },
                data: { isRevoked: true },
            });
        }
        (0, jwt_js_1.clearAuthCookies)(res);
        res.json({ message: 'Logged out successfully' });
    }
    catch (err) {
        next(err);
    }
}
async function refreshController(req, res, next) {
    try {
        const refreshToken = req.cookies?.refreshToken;
        if (!refreshToken) {
            res.status(401).json({ error: 'Refresh token required' });
            return;
        }
        const session = await prisma_js_1.prisma.session.findUnique({ where: { refreshToken } });
        if (!session || session.isRevoked || session.expiresAt < new Date()) {
            (0, jwt_js_1.clearAuthCookies)(res);
            res.status(401).json({ error: 'Session expired or revoked' });
            return;
        }
        const decoded = (0, jwt_js_1.verifyRefreshToken)(refreshToken);
        const user = await prisma_js_1.prisma.user.findUnique({ where: { id: decoded.userId } });
        if (!user) {
            (0, jwt_js_1.clearAuthCookies)(res);
            res.status(401).json({ error: 'User no longer exists' });
            return;
        }
        // Revoke old session and issue new tokens (Refresh Token Rotation)
        await prisma_js_1.prisma.session.update({
            where: { id: session.id },
            data: { isRevoked: true },
        });
        const jwtPayload = { userId: user.id, email: user.email, plan: user.plan };
        const newAccessToken = (0, jwt_js_1.generateAccessToken)(jwtPayload);
        const newRefreshToken = (0, jwt_js_1.generateRefreshToken)(jwtPayload);
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        await prisma_js_1.prisma.session.create({
            data: {
                userId: user.id,
                refreshToken: newRefreshToken,
                expiresAt,
            },
        });
        (0, jwt_js_1.setAuthCookies)(res, newAccessToken, newRefreshToken);
        res.json({
            message: 'Token refreshed',
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                plan: user.plan,
                referralCode: user.referralCode,
                onboardingCompleted: user.onboardingCompleted,
            },
        });
    }
    catch (err) {
        (0, jwt_js_1.clearAuthCookies)(res);
        res.status(401).json({ error: 'Invalid refresh token' });
    }
}
async function getMeController(req, res, next) {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const user = await prisma_js_1.prisma.user.findUnique({
            where: { id: req.user.userId },
            select: {
                id: true,
                email: true,
                name: true,
                plan: true,
                referralCode: true,
                onboardingCompleted: true,
                createdAt: true,
            },
        });
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        res.json({ user });
    }
    catch (err) {
        next(err);
    }
}
async function updateOnboardingController(req, res, next) {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        await prisma_js_1.prisma.user.update({
            where: { id: req.user.userId },
            data: { onboardingCompleted: true },
        });
        res.json({ message: 'Onboarding completed' });
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=auth.js.map
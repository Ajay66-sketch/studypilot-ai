import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma.js';
import { hashPassword, verifyPassword } from '../auth/password.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken, setAuthCookies, clearAuthCookies } from '../auth/jwt.js';
import { RegisterSchema, LoginSchema } from '../validators/auth.js';

export async function registerController(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = RegisterSchema.parse(req.body);

    const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
    if (existingUser) {
      res.status(400).json({ error: 'Email address already registered' });
      return;
    }

    const hashedPassword = await hashPassword(data.password);
    const referralCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    let referredById: string | undefined;
    if (data.referralCode) {
      const referrer = await prisma.user.findUnique({ where: { referralCode: data.referralCode } });
      if (referrer) {
        referredById = referrer.id;
      }
    }

    const user = await prisma.user.create({
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
    await prisma.usage.create({
      data: {
        userId: user.id,
        requestsUsed: 0,
        lastResetDate: today,
      },
    });

    const jwtPayload = { userId: user.id, email: user.email, plan: user.plan };
    const accessToken = generateAccessToken(jwtPayload);
    const refreshToken = generateRefreshToken(jwtPayload);

    // Save refresh session
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await prisma.session.create({
      data: {
        userId: user.id,
        refreshToken,
        expiresAt,
      },
    });

    setAuthCookies(res, accessToken, refreshToken);

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
  } catch (err) {
    next(err);
  }
}

export async function loginController(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = LoginSchema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const validPassword = await verifyPassword(user.password, data.password);
    if (!validPassword) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const jwtPayload = { userId: user.id, email: user.email, plan: user.plan };
    const accessToken = generateAccessToken(jwtPayload);
    const refreshToken = generateRefreshToken(jwtPayload);

    // Create session
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await prisma.session.create({
      data: {
        userId: user.id,
        refreshToken,
        expiresAt,
      },
    });

    setAuthCookies(res, accessToken, refreshToken);

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
  } catch (err) {
    next(err);
  }
}

export async function logoutController(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (refreshToken) {
      await prisma.session.updateMany({
        where: { refreshToken },
        data: { isRevoked: true },
      });
    }

    clearAuthCookies(res);
    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
}

export async function refreshController(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      res.status(401).json({ error: 'Refresh token required' });
      return;
    }

    const session = await prisma.session.findUnique({ where: { refreshToken } });
    if (!session || session.isRevoked || session.expiresAt < new Date()) {
      clearAuthCookies(res);
      res.status(401).json({ error: 'Session expired or revoked' });
      return;
    }

    const decoded = verifyRefreshToken(refreshToken);
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });

    if (!user) {
      clearAuthCookies(res);
      res.status(401).json({ error: 'User no longer exists' });
      return;
    }

    // Revoke old session and issue new tokens (Refresh Token Rotation)
    await prisma.session.update({
      where: { id: session.id },
      data: { isRevoked: true },
    });

    const jwtPayload = { userId: user.id, email: user.email, plan: user.plan };
    const newAccessToken = generateAccessToken(jwtPayload);
    const newRefreshToken = generateRefreshToken(jwtPayload);

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await prisma.session.create({
      data: {
        userId: user.id,
        refreshToken: newRefreshToken,
        expiresAt,
      },
    });

    setAuthCookies(res, newAccessToken, newRefreshToken);

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
  } catch (err) {
    clearAuthCookies(res);
    res.status(401).json({ error: 'Invalid refresh token' });
  }
}

export async function getMeController(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const user = await prisma.user.findUnique({
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
  } catch (err) {
    next(err);
  }
}

export async function updateOnboardingController(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    await prisma.user.update({
      where: { id: req.user.userId },
      data: { onboardingCompleted: true },
    });

    res.json({ message: 'Onboarding completed' });
  } catch (err) {
    next(err);
  }
}

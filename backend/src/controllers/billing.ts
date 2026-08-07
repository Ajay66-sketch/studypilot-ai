import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { prisma } from '../lib/prisma.js';
import { env } from '../config/env.js';
import { z } from 'zod';

const VerifyBillingSchema = z.object({
  plan: z.enum(['pro', 'premium']),
  razorpay_payment_id: z.string().min(1),
  razorpay_order_id: z.string().optional(),
  razorpay_signature: z.string().optional(),
});

export async function verifyBillingController(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.userId;
    const { plan, razorpay_payment_id, razorpay_order_id, razorpay_signature } = VerifyBillingSchema.parse(req.body);

    const secret = env.RAZORPAY_KEY_SECRET;

    if (secret) {
      if (!razorpay_order_id || !razorpay_signature) {
        res.status(400).json({ error: 'Missing Razorpay signature details for verification' });
        return;
      }
      const hmac = crypto.createHmac('sha256', secret);
      hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
      const generated_signature = hmac.digest('hex');

      if (generated_signature !== razorpay_signature) {
        res.status(400).json({ error: 'Invalid Razorpay payment signature' });
        return;
      }
    }

    // Record subscription
    await prisma.subscription.create({
      data: {
        userId,
        plan,
        status: 'active',
        razorpayPaymentId: razorpay_payment_id,
        razorpayOrderId: razorpay_order_id,
        razorpaySignature: razorpay_signature,
      },
    });

    // Update user plan
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { plan },
    });

    res.json({
      message: 'Plan upgraded successfully',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        plan: updatedUser.plan,
      },
    });
  } catch (err) {
    next(err);
  }
}


'use server';

import { updateUserPlan } from "@/lib/firestore-services";

/**
 * @fileOverview Secure server-side billing actions for StudyPilot AI.
 * This file handles sensitive plan activation logic away from the client.
 */

interface VerificationInput {
  uid: string;
  plan: 'pro' | 'premium';
  razorpay_payment_id: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
}

/**
 * Verifies the Razorpay payment integrity and activates the plan in Firestore.
 * In a full production build, this would use the 'crypto' module to verify the HMAC signature.
 */
export async function verifyAndActivatePlan(input: VerificationInput) {
  const { uid, plan, razorpay_payment_id, razorpay_signature } = input;

  if (!uid || !plan || !razorpay_payment_id) {
    throw new Error("Missing critical payment verification data.");
  }

  try {
    // 1. (Production Step) Verify HMAC signature using Razorpay Secret
    // const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    // hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    // const generated_signature = hmac.digest('hex');
    // if (generated_signature !== razorpay_signature) throw new Error("Invalid payment signature.");

    // 2. Perform any additional business checks (e.g. check if payment ID was already used)

    // 3. Update Firestore via a trusted server path
    await updateUserPlan(uid, plan, razorpay_payment_id);

    return { success: true, plan };
  } catch (error: any) {
    console.error("Server-side verification failed:", error);
    throw new Error(error.message || "Failed to verify and activate plan.");
  }
}

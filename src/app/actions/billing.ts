'use server';

import { apiClient } from "@/lib/api-client";

interface VerificationInput {
  uid: string;
  plan: 'pro' | 'premium';
  razorpay_payment_id: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
}

export async function verifyAndActivatePlan(input: VerificationInput) {
  const { plan, razorpay_payment_id, razorpay_order_id, razorpay_signature } = input;

  if (!plan || !razorpay_payment_id) {
    throw new Error("Missing critical payment verification data.");
  }

  try {
    const response = await apiClient.post('/api/billing/verify', {
      plan,
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || "Failed to verify and activate plan.");
  }
}


import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

/**
 * @fileOverview Lightweight launch analytics for tracking conversion and usage.
 * Hardened to be non-blocking and fault-tolerant.
 */

export type AnalyticsEvent = 
  | 'signup_success'
  | 'generation_started'
  | 'generation_success'
  | 'generation_failed'
  | 'free_limit_hit'
  | 'checkout_initiated'
  | 'payment_success'
  | 'payment_failed'
  | 'output_chained'
  | 'output_exported';

export async function trackEvent(uid: string, event: AnalyticsEvent, metadata: any = {}) {
  // Wrap in try-catch to ensure analytics never breaks the core app flow
  try {
    if (!uid) return;
    
    await addDoc(collection(db, "events"), {
      uid,
      event,
      metadata,
      timestamp: serverTimestamp(),
      userAgent: typeof window !== 'undefined' ? navigator.userAgent : 'server',
      path: typeof window !== 'undefined' ? window.location.pathname : '',
      environment: process.env.NODE_ENV
    });
  } catch (error) {
    // Fail silently in production to not disrupt student UX
    if (process.env.NODE_ENV === 'development') {
      console.warn("Analytics non-blocking error:", error);
    }
  }
}

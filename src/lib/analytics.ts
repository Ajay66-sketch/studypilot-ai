
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

/**
 * @fileOverview Lightweight launch analytics for tracking conversion and usage.
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
  try {
    await addDoc(collection(db, "events"), {
      uid,
      event,
      metadata,
      timestamp: serverTimestamp(),
      userAgent: typeof window !== 'undefined' ? navigator.userAgent : 'server',
      path: typeof window !== 'undefined' ? window.location.pathname : ''
    });
  } catch (error) {
    // Fail silently to not disrupt UX
    console.warn("Analytics error:", error);
  }
}

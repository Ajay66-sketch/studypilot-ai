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
    if (!uid) return;
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[ANALYTICS] User ${uid} -> ${event}:`, metadata);
    }
  } catch (error) {
    // Non-blocking
  }
}

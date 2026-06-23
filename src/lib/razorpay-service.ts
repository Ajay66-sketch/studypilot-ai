
'use client';

/**
 * @fileOverview Razorpay Integration Service for StudyPilot AI.
 */

export const loadRazorpay = () => {
  return new Promise((resolve) => {
    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

interface PaymentResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface PaymentOptions {
  amount: number; // in paise (e.g., 9900 for ₹99)
  planName: string;
  userName: string;
  userEmail: string;
  onSuccess: (response: PaymentResponse) => void;
  onFailure: (error: any) => void;
}

export const initiateCheckout = async (options: PaymentOptions) => {
  const res = await loadRazorpay();

  if (!res) {
    alert('Razorpay SDK failed to load. Are you online?');
    return;
  }

  const razorpayOptions = {
    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_dummy_key',
    amount: options.amount,
    currency: 'INR',
    name: 'StudyPilot AI',
    description: `Subscription for ${options.planName} Plan`,
    image: 'https://picsum.photos/seed/pilot/200/200',
    // We explicitly request the order_id and signature in production
    // For this MVP, we capture the result and pass it to a server action for verification
    handler: function (response: any) {
      options.onSuccess({
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_order_id: response.razorpay_order_id || 'manual_order',
        razorpay_signature: response.razorpay_signature || 'manual_signature'
      });
    },
    prefill: {
      name: options.userName,
      email: options.userEmail,
    },
    notes: {
      plan: options.planName,
    },
    theme: {
      color: '#4F46E5', // primary color
    },
    modal: {
      ondismiss: function() {
        options.onFailure({ description: "Payment cancelled by user." });
      }
    }
  };

  const paymentObject = new (window as any).Razorpay(razorpayOptions);
  paymentObject.on('payment.failed', function (response: any) {
    options.onFailure(response.error);
  });
  paymentObject.open();
};

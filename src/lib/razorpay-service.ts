
'use client';

/**
 * @fileOverview Razorpay Integration Service for StudyPilot AI.
 */

export const loadRazorpay = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

interface PaymentOptions {
  amount: number; // in paise (e.g., 9900 for ₹99)
  planName: string;
  userName: string;
  userEmail: string;
  onSuccess: (paymentId: string) => void;
  onFailure: (error: any) => void;
}

export const initiateCheckout = async (options: PaymentOptions) => {
  const res = await loadRazorpay();

  if (!res) {
    alert('Razorpay SDK failed to load. Are you online?');
    return;
  }

  const razorpayOptions = {
    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_dummy_key', // Replace with your key in .env
    amount: options.amount,
    currency: 'INR',
    name: 'StudyPilot AI',
    description: `Subscription for ${options.planName} Plan`,
    image: 'https://picsum.photos/seed/pilot/200/200',
    handler: function (response: any) {
      options.onSuccess(response.razorpay_payment_id);
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
  };

  const paymentObject = new (window as any).Razorpay(razorpayOptions);
  paymentObject.on('payment.failed', function (response: any) {
    options.onFailure(response.error);
  });
  paymentObject.open();
};

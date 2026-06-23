
"use client";

import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { CheckCircle2, Star, Zap, Infinity, Share2, Award, ShieldCheck, CreditCard } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

export default function BillingPage() {
  const { userData } = useAuth();
  const { toast } = useToast();
  const isPro = userData?.plan === "pro";
  const isPremium = userData?.plan === "premium";

  const handleUpgrade = (plan: string) => {
    toast({
      title: "Checkout Securely",
      description: `Redirecting to Razorpay test environment for ${plan} upgrade...`,
    });
    // This is where Razorpay integration would be triggered
    setTimeout(() => {
      alert("Payment gateway integration (Razorpay) is coming soon. In a live environment, this would open the payment popup.");
    }, 1500);
  };

  const copyReferral = () => {
    navigator.clipboard.writeText(`Join StudyPilot AI with my code: ${userData?.referralCode || '...'}`);
    toast({ title: "Copied!", description: "Share this code with your friends." });
  };

  return (
    <div className="space-y-12 max-w-5xl mx-auto pb-20">
      <div className="text-center space-y-3">
        <h1 className="text-5xl font-black font-headline tracking-tighter text-slate-900">Choose Your Plan</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-medium">Invest in your academic success. All plans include priority support and India-first pricing.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
        {/* Free Plan */}
        <Card className={`relative flex flex-col rounded-3xl border-2 transition-all ${!isPro && !isPremium ? 'border-primary shadow-xl shadow-primary/5' : 'border-slate-100 opacity-80'}`}>
          {!isPro && !isPremium && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-black uppercase px-4 py-1 rounded-full">
              Current Plan
            </div>
          )}
          <CardHeader className="pb-8">
            <CardTitle className="text-xl font-black font-headline">Student Starter</CardTitle>
            <CardDescription className="font-bold">Perfect for light study prep.</CardDescription>
            <div className="pt-6">
              <span className="text-5xl font-black">₹0</span>
              <span className="text-muted-foreground font-bold">/month</span>
            </div>
          </CardHeader>
          <CardContent className="flex-1 space-y-4">
            <ul className="space-y-4 text-sm font-medium">
              <li className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-primary" /> 5 requests per day</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-primary" /> Basic AI quality</li>
              <li className="flex items-center gap-3 opacity-30"><CheckCircle2 className="h-5 w-5 text-slate-300" /> Priority processing</li>
              <li className="flex items-center gap-3 opacity-30"><CheckCircle2 className="h-5 w-5 text-slate-300" /> Premium Export</li>
            </ul>
          </CardContent>
          <CardFooter className="pt-6">
            <Button variant="outline" className="w-full h-12 rounded-2xl font-bold border-2" disabled={!isPro && !isPremium}>
              {(!isPro && !isPremium) ? "Active" : "Downgrade"}
            </Button>
          </CardFooter>
        </Card>

        {/* Pro Plan */}
        <Card className={`relative flex flex-col rounded-3xl border-2 overflow-hidden transition-all ${isPro ? 'border-primary shadow-xl shadow-primary/5 scale-105 z-10' : 'border-slate-200'}`}>
          <div className="bg-primary text-primary-foreground py-2 px-4 text-center text-[10px] font-black uppercase tracking-widest">
            Best Value
          </div>
          {isPro && (
            <div className="absolute top-8 right-6 bg-primary text-white text-[10px] font-black uppercase px-4 py-1 rounded-full">
              Current
            </div>
          )}
          <CardHeader className="pb-8">
            <CardTitle className="text-xl font-black font-headline flex items-center gap-2">
              Study Pro <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
            </CardTitle>
            <CardDescription className="font-bold">Unlimited power for exam success.</CardDescription>
            <div className="pt-6">
              <span className="text-5xl font-black">₹99</span>
              <span className="text-muted-foreground font-bold">/month</span>
            </div>
          </CardHeader>
          <CardContent className="flex-1 space-y-4">
            <ul className="space-y-4 text-sm font-medium">
              <li className="flex items-center gap-3 text-primary font-bold"><Zap className="h-5 w-5" /> Unlimited requests</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-primary" /> Gemini 2.5 Flash High Speed</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-primary" /> Instant response times</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-primary" /> Clean PDF Exports</li>
            </ul>
          </CardContent>
          <CardFooter className="pt-6">
            <Button className="w-full h-12 rounded-2xl font-bold shadow-lg shadow-primary/20" onClick={() => handleUpgrade('Pro')} disabled={isPro}>
              {isPro ? "Active Plan" : "Upgrade to Pro"}
            </Button>
          </CardFooter>
        </Card>

        {/* Premium Plan */}
        <Card className={`relative flex flex-col rounded-3xl border-2 transition-all ${isPremium ? 'border-primary shadow-xl shadow-primary/5 scale-105 z-10' : 'border-slate-200'}`}>
          {isPremium && (
            <div className="absolute top-6 right-6 bg-primary text-white text-[10px] font-black uppercase px-4 py-1 rounded-full">
              Current
            </div>
          )}
          <CardHeader className="pb-8 pt-10">
            <CardTitle className="text-xl font-black font-headline flex items-center gap-2">
              Elite Access <Award className="h-6 w-6 text-primary" />
            </CardTitle>
            <CardDescription className="font-bold">Future-proof your learning.</CardDescription>
            <div className="pt-6">
              <span className="text-5xl font-black">₹199</span>
              <span className="text-muted-foreground font-bold">/month</span>
            </div>
          </CardHeader>
          <CardContent className="flex-1 space-y-4">
            <ul className="space-y-4 text-sm font-medium">
              <li className="flex items-center gap-3 font-bold text-primary"><Infinity className="h-5 w-5" /> Everything in Pro</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-primary" /> Early Access to New Tools</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-primary" /> Premium Study Templates</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-primary" /> Multi-device Sync</li>
            </ul>
          </CardContent>
          <CardFooter className="pt-6">
            <Button variant="outline" className="w-full h-12 rounded-2xl font-bold border-2" onClick={() => handleUpgrade('Premium')} disabled={isPremium}>
              {isPremium ? "Active" : "Upgrade Elite"}
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="mt-16 bg-gradient-to-br from-primary to-primary/80 rounded-[2.5rem] p-12 text-white shadow-2xl shadow-primary/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-10">
          <Share2 className="h-64 w-64 rotate-12" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="space-y-4 text-center md:text-left">
            <h2 className="text-4xl font-black font-headline tracking-tight">
              Get Pro for Free!
            </h2>
            <p className="text-primary-foreground/90 max-w-lg text-lg font-medium leading-relaxed">
              Invite 3 friends to join StudyPilot AI and get 7 days of full Pro access. No credit card required.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Badge className="bg-white/20 text-white border-none px-4 py-2 text-sm font-bold backdrop-blur-md">
                Referral Code: {userData?.referralCode || '...'}
              </Badge>
            </div>
          </div>
          <Button 
            variant="secondary" 
            className="gap-3 px-10 h-14 rounded-2xl font-black text-primary shadow-xl hover:scale-105 transition-transform"
            onClick={copyReferral}
          >
            <Share2 className="h-5 w-5" /> Copy Invite Link
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-10 text-center">
        <div className="space-y-2">
          <div className="p-3 bg-slate-50 w-fit mx-auto rounded-2xl mb-4">
            <ShieldCheck className="h-8 w-8 text-primary" />
          </div>
          <h3 className="font-black">Secure Payments</h3>
          <p className="text-sm text-muted-foreground font-medium">All transactions are secured via Razorpay SSL encryption.</p>
        </div>
        <div className="space-y-2">
          <div className="p-3 bg-slate-50 w-fit mx-auto rounded-2xl mb-4">
            <CreditCard className="h-8 w-8 text-primary" />
          </div>
          <h3 className="font-black">UPI & Cards</h3>
          <p className="text-sm text-muted-foreground font-medium">Pay via GPay, PhonePe, Paytm or any Indian credit/debit card.</p>
        </div>
        <div className="space-y-2">
          <div className="p-3 bg-slate-50 w-fit mx-auto rounded-2xl mb-4">
            <Zap className="h-8 w-8 text-primary" />
          </div>
          <h3 className="font-black">Instant Upgrade</h3>
          <p className="text-sm text-muted-foreground font-medium">Your account features are unlocked immediately after payment.</p>
        </div>
      </div>
    </div>
  );
}

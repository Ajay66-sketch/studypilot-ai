
"use client";

import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { CheckCircle2, Star, Zap, Share2, Award, ShieldCheck, CreditCard, Rocket } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

export default function BillingPage() {
  const { userData } = useAuth();
  const { toast } = useToast();
  const isPro = userData?.plan === "pro";
  const isElite = userData?.plan === "premium";

  const handleUpgrade = (plan: string) => {
    toast({
      title: "Checkout Securely",
      description: `Redirecting to Secure Razorpay Gateway...`,
    });
    // This is where Razorpay integration would be triggered
    setTimeout(() => {
      alert(`Integration Info:\n\nYou selected the ${plan} plan. In a production environment, this would trigger the Razorpay standard payment modal for ₹${plan === 'Pro' ? '99' : '199'}.\n\nNext Step: Implement Razorpay Webhook to update Firestore user plan to "${plan.toLowerCase()}".`);
    }, 1200);
  };

  const copyReferral = () => {
    navigator.clipboard.writeText(userData?.referralCode || "");
    toast({ title: "Copied!", description: "Share this code with your friends." });
  };

  return (
    <div className="space-y-12 max-w-5xl mx-auto pb-20">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-4">
          <Rocket className="h-3 w-3" /> Invest in your future
        </div>
        <h1 className="text-5xl font-black font-headline tracking-tighter text-slate-900 leading-tight">Choose Your Prep Plan</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-medium">All plans include university marking-scheme optimizations and India-first pricing.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 items-center">
        {/* Free Plan */}
        <Card className={`relative flex flex-col rounded-[2.5rem] border-2 transition-all h-full ${!isPro && !isElite ? 'border-primary shadow-xl shadow-primary/5 bg-primary/[0.02]' : 'border-slate-100 opacity-80'}`}>
          {!isPro && !isElite && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-black uppercase px-6 py-1.5 rounded-full shadow-lg">
              Active Plan
            </div>
          )}
          <CardHeader className="pb-8 pt-10">
            <CardTitle className="text-xl font-black font-headline">Starter Pilot</CardTitle>
            <CardDescription className="font-bold">Light study sessions.</CardDescription>
            <div className="pt-6">
              <span className="text-5xl font-black">₹0</span>
              <span className="text-muted-foreground font-black text-xs uppercase tracking-widest ml-1">/mo</span>
            </div>
          </CardHeader>
          <CardContent className="flex-1 space-y-4">
            <ul className="space-y-4 text-sm font-bold text-slate-600">
              <li className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-primary shrink-0" /> 5 generations / day</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-primary shrink-0" /> Standard AI accuracy</li>
              <li className="flex items-center gap-3 opacity-30"><CheckCircle2 className="h-5 w-5 text-slate-300 shrink-0" /> Premium exports</li>
              <li className="flex items-center gap-3 opacity-30"><CheckCircle2 className="h-5 w-5 text-slate-300 shrink-0" /> Booster Mode</li>
            </ul>
          </CardContent>
          <CardFooter className="pb-10 pt-6">
            <Button variant="outline" className="w-full h-14 rounded-2xl font-black border-2 text-sm" disabled={!isPro && !isElite}>
              {(!isPro && !isElite) ? "Current Active" : "Downgrade"}
            </Button>
          </CardFooter>
        </Card>

        {/* Pro Plan */}
        <Card className={`relative flex flex-col rounded-[2.8rem] border-4 overflow-hidden transition-all h-[110%] ${isPro ? 'border-primary shadow-2xl bg-primary/[0.02] z-20' : 'border-primary/20 shadow-xl'}`}>
          <div className="bg-primary text-white py-3 px-6 text-center text-[10px] font-black uppercase tracking-[0.3em]">
            Most Popular Choice
          </div>
          <CardHeader className="pb-8 pt-12 text-center">
            <CardTitle className="text-2xl font-black font-headline flex items-center justify-center gap-2">
              Study Pro <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
            </CardTitle>
            <CardDescription className="font-bold">Ultimate semester prep power.</CardDescription>
            <div className="pt-8">
              <span className="text-7xl font-black text-primary">₹99</span>
              <span className="text-slate-400 font-black text-xs uppercase tracking-widest ml-1">/mo</span>
            </div>
          </CardHeader>
          <CardContent className="flex-1 space-y-5 px-10">
            <ul className="space-y-4 text-sm font-bold text-slate-700">
              <li className="flex items-center gap-3 text-primary font-black"><Zap className="h-5 w-5 shrink-0" /> Unlimited daily generations</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-primary shrink-0" /> High-speed responses</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-primary shrink-0" /> Watermark-free PDFs</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-primary shrink-0" /> Advanced tool chaining</li>
            </ul>
          </CardContent>
          <CardFooter className="pb-12 pt-8 px-10">
            <Button className="w-full h-16 rounded-2xl font-black text-lg shadow-2xl shadow-primary/30" onClick={() => handleUpgrade('Pro')} disabled={isPro}>
              {isPro ? "Plan Active" : "Go Pro Now"}
            </Button>
          </CardFooter>
        </Card>

        {/* Elite Plan */}
        <Card className={`relative flex flex-col rounded-[2.5rem] border-2 transition-all h-full ${isElite ? 'border-primary shadow-xl shadow-primary/5 bg-primary/[0.02]' : 'border-slate-200'}`}>
          <CardHeader className="pb-8 pt-10">
            <CardTitle className="text-xl font-black font-headline flex items-center gap-2">
              Elite Prep <Award className="h-6 w-6 text-primary" />
            </CardTitle>
            <CardDescription className="font-bold">Future-proof exam success.</CardDescription>
            <div className="pt-6">
              <span className="text-5xl font-black">₹199</span>
              <span className="text-muted-foreground font-black text-xs uppercase tracking-widest ml-1">/mo</span>
            </div>
          </CardHeader>
          <CardContent className="flex-1 space-y-4">
            <ul className="space-y-4 text-sm font-bold text-slate-600">
              <li className="flex items-center gap-3 text-primary"><CheckCircle2 className="h-5 w-5 shrink-0" /> Everything in Pro</li>
              <li className="flex items-center gap-3 text-primary"><CheckCircle2 className="h-5 w-5 shrink-0" /> Exam Booster Mode</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-primary shrink-0" /> Custom answer tone</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-primary shrink-0" /> Batch PDF processing</li>
            </ul>
          </CardContent>
          <CardFooter className="pb-10 pt-6">
            <Button variant="outline" className="w-full h-14 rounded-2xl font-black border-2 text-sm" onClick={() => handleUpgrade('Elite')} disabled={isElite}>
              {isElite ? "Plan Active" : "Get Elite Prep"}
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="mt-20 bg-slate-900 rounded-[3rem] p-10 md:p-16 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-10 opacity-5">
          <Share2 className="h-64 w-64 rotate-12" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="space-y-6 text-center md:text-left">
            <h2 className="text-4xl font-black font-headline tracking-tight">
              Get Pro for <span className="text-primary">FREE</span>
            </h2>
            <p className="text-slate-400 max-w-lg text-lg font-medium leading-relaxed">
              Invite 3 friends to join StudyPilot AI and get 7 days of full Pro access rewarded to your account instantly.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Badge className="bg-white/10 text-white border-none px-6 py-2 text-xs font-black tracking-widest backdrop-blur-md uppercase">
                Code: {userData?.referralCode || '...'}
              </Badge>
            </div>
          </div>
          <Button 
            variant="secondary" 
            className="gap-3 px-12 h-16 rounded-2xl font-black text-lg shadow-2xl hover:scale-105 transition-transform"
            onClick={copyReferral}
          >
            <Share2 className="h-5 w-5" /> Copy Invite Link
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pt-10 text-center">
        <div className="space-y-4">
          <div className="p-4 bg-slate-50 w-fit mx-auto rounded-2xl mb-2">
            <ShieldCheck className="h-7 w-7 text-primary" />
          </div>
          <h3 className="font-black text-lg">Secure Razorpay</h3>
          <p className="text-sm text-muted-foreground font-medium px-4">All transactions are encrypted and secured via Razorpay India.</p>
        </div>
        <div className="space-y-4">
          <div className="p-4 bg-slate-50 w-fit mx-auto rounded-2xl mb-2">
            <CreditCard className="h-7 w-7 text-primary" />
          </div>
          <h3 className="font-black text-lg">UPI & Cards</h3>
          <p className="text-sm text-muted-foreground font-medium px-4">Pay instantly via Google Pay, PhonePe, Paytm or NetBanking.</p>
        </div>
        <div className="space-y-4">
          <div className="p-4 bg-slate-50 w-fit mx-auto rounded-2xl mb-2">
            <Zap className="h-7 w-7 text-primary" />
          </div>
          <h3 className="font-black text-lg">Instant Activation</h3>
          <p className="text-sm text-muted-foreground font-medium px-4">Your premium features are unlocked the second payment succeeds.</p>
        </div>
      </div>
    </div>
  );
}


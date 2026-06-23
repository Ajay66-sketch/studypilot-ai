
"use client";

import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Mail, CreditCard, Share2, Award, LogOut, CheckCircle2, History, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { checkUsageLimit } from "@/lib/usage";

export default function AccountPage() {
  const { user, userData, logout } = useAuth();
  const { toast } = useToast();
  const [usage, setUsage] = useState({ used: 0, total: 5 });

  useEffect(() => {
    async function fetchUsage() {
      if (user) {
        const u = await checkUsageLimit(user.uid, userData?.plan || 'free');
        setUsage({ used: 5 - u.remaining, total: 5 });
      }
    }
    fetchUsage();
  }, [user, userData]);

  const copyReferral = () => {
    navigator.clipboard.writeText(userData?.referralCode || "");
    toast({ title: "Copied!", description: "Share this code with your friends." });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20">
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <h1 className="text-4xl font-black font-headline tracking-tight">Your Account</h1>
          <p className="text-muted-foreground font-medium">Manage your plan and profile settings.</p>
        </div>
        <Button variant="outline" className="rounded-xl font-bold gap-2 text-destructive border-destructive/20 hover:bg-destructive/5" onClick={logout}>
          <LogOut className="h-4 w-4" /> Sign Out
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 rounded-[2rem] border-2 border-slate-100 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-black font-headline flex items-center gap-2">
              <User className="h-5 w-5 text-primary" /> Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Name</p>
                <p className="font-bold text-lg">{user?.displayName || "Student"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Address</p>
                <div className="flex items-center gap-2 font-bold text-lg">
                  <Mail className="h-4 w-4 text-slate-300" />
                  {user?.email}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Plan Type</p>
                <Badge className="bg-primary/10 text-primary border-none font-black uppercase tracking-widest text-[10px] mt-1">
                   {userData?.plan || "Free"} Pilot
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Joined Date</p>
                <p className="font-bold text-lg">{userData?.createdAt?.toDate().toLocaleDateString() || "..."}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] border-2 border-slate-100 shadow-sm bg-primary/5 border-none">
          <CardHeader>
            <CardTitle className="text-xl font-black font-headline flex items-center gap-2 text-primary">
              <Zap className="h-5 w-5" /> Usage Snap
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="p-4 bg-white rounded-2xl border-2 border-primary/5 text-center">
                <p className="text-3xl font-black text-primary">{usage.used}</p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Requests Used Today</p>
             </div>
             <p className="text-xs text-muted-foreground font-medium leading-relaxed px-2">
               {userData?.plan === 'free' 
                 ? "You are on the free plan with a daily limit of 5 generations." 
                 : "You have unlimited generations as a Pro user."}
             </p>
             {userData?.plan === 'free' && (
               <Button className="w-full rounded-xl font-bold h-11 shadow-lg shadow-primary/20" asChild>
                 <a href="/dashboard/billing">Upgrade for Unlimited</a>
               </Button>
             )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="rounded-[2rem] border-2 border-slate-100 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-black font-headline flex items-center gap-2">
              <Share2 className="h-5 w-5 text-primary" /> Referral Rewards
            </CardTitle>
            <CardDescription className="font-bold text-slate-500">Invite friends and unlock premium days.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-6 bg-slate-50 rounded-2xl flex justify-between items-center border-2 border-slate-100">
               <div className="space-y-1">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Your Code</p>
                 <p className="font-black text-2xl tracking-tighter text-primary">{userData?.referralCode || "..."}</p>
               </div>
               <Button variant="secondary" className="rounded-xl font-bold px-6" onClick={copyReferral}>Copy Link</Button>
            </div>
            <div className="flex gap-4 items-start p-4 bg-primary/5 rounded-2xl">
               <Award className="h-6 w-6 text-primary shrink-0" />
               <p className="text-sm font-bold text-slate-700 leading-relaxed">
                 Invite 3 friends to sign up and get 7 days of full Pro access rewarded to your account.
               </p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] border-2 border-slate-100 shadow-sm overflow-hidden flex flex-col">
          <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
             <div className="space-y-1">
               <p className="text-sm font-black opacity-50 uppercase tracking-widest">Current Plan</p>
               <h3 className="text-2xl font-black font-headline tracking-tight capitalize">{userData?.plan || "Free"} Pilot</h3>
             </div>
             <CreditCard className="h-10 w-10 opacity-20" />
          </div>
          <CardContent className="pt-8 flex-1">
             <ul className="space-y-3">
                <li className="flex items-center gap-2 text-sm font-bold text-slate-600">
                  <CheckCircle2 className="h-4 w-4 text-primary" /> 
                  {userData?.plan === 'free' ? "5 daily generations" : "Unlimited daily generations"}
                </li>
                <li className="flex items-center gap-2 text-sm font-bold text-slate-600">
                  <CheckCircle2 className="h-4 w-4 text-primary" /> Standard study tools
                </li>
                {userData?.plan !== 'free' && (
                  <>
                    <li className="flex items-center gap-2 text-sm font-bold text-slate-600">
                      <CheckCircle2 className="h-4 w-4 text-primary" /> Premium PDF Exports
                    </li>
                    <li className="flex items-center gap-2 text-sm font-bold text-slate-600">
                      <CheckCircle2 className="h-4 w-4 text-primary" /> Exam Booster Mode
                    </li>
                  </>
                )}
             </ul>
          </CardContent>
          <CardFooter className="bg-slate-50 p-6 border-t">
             <Button variant={userData?.plan === 'free' ? "default" : "outline"} className="w-full rounded-xl font-bold h-11" asChild>
                <a href="/dashboard/billing">{userData?.plan === 'free' ? "Upgrade Plan" : "View Billing Details"}</a>
             </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}


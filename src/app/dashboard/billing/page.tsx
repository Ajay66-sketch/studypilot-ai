"use client";

import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { CheckCircle2, Star, Zap, Infinity, Share2, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function BillingPage() {
  const { userData } = useAuth();
  const isPremium = userData?.plan === "premium";

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold font-headline">Subscription Plan</h1>
        <p className="text-muted-foreground">Manage your subscription and upgrade for more features.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
        <Card className={`relative flex flex-col ${!isPremium ? 'border-2 border-primary' : 'border'}`}>
          {!isPremium && (
            <div className="absolute top-0 right-0 p-2">
              <Badge className="bg-primary text-white">Current Plan</Badge>
            </div>
          )}
          <CardHeader>
            <CardTitle className="text-2xl font-headline">Free Plan</CardTitle>
            <CardDescription>Perfect for trial and light usage.</CardDescription>
            <div className="pt-4">
              <span className="text-4xl font-bold">₹0</span>
              <span className="text-muted-foreground">/month</span>
            </div>
          </CardHeader>
          <CardContent className="flex-1 space-y-4">
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-primary" /> 5 requests per day</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-primary" /> Standard AI quality</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-primary" /> Mobile dashboard</li>
              <li className="flex items-center gap-3 opacity-50"><CheckCircle2 className="h-5 w-5 text-slate-300" /> Priority processing</li>
              <li className="flex items-center gap-3 opacity-50"><CheckCircle2 className="h-5 w-5 text-slate-300" /> Export to PDF</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" disabled={!isPremium}>
              {isPremium ? "Switch to Free" : "Current Plan"}
            </Button>
          </CardFooter>
        </Card>

        <Card className={`relative flex flex-col overflow-hidden ${isPremium ? 'border-2 border-primary shadow-xl' : 'border shadow-lg'}`}>
          {isPremium && (
            <div className="absolute top-0 right-0 p-2">
              <Badge className="bg-primary text-white">Current Plan</Badge>
            </div>
          )}
          <div className="bg-primary text-primary-foreground py-1 px-4 text-center text-xs font-bold uppercase tracking-wider">
            Most Popular
          </div>
          <CardHeader>
            <CardTitle className="text-2xl font-headline flex items-center gap-2">
              Pro Plan <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
            </CardTitle>
            <CardDescription>Everything you need for academic success.</CardDescription>
            <div className="pt-4">
              <span className="text-4xl font-bold">₹99</span>
              <span className="text-muted-foreground">/month</span>
            </div>
          </CardHeader>
          <CardContent className="flex-1 space-y-4">
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-3"><Zap className="h-5 w-5 text-primary" /> Unlimited requests</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-primary" /> Premium AI (Gemini 2.5 Flash)</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-primary" /> Instant response times</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-primary" /> Watermark-free exports</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-primary" /> Referral rewards</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full" disabled={isPremium}>
              {isPremium ? "Active" : "Upgrade to Pro"}
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="mt-12 bg-white rounded-3xl p-8 border shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-2 text-center md:text-left">
          <h2 className="text-2xl font-bold font-headline flex items-center gap-2 justify-center md:justify-start">
            <Award className="h-6 w-6 text-primary" />
            StudyPilot Referral Program
          </h2>
          <p className="text-muted-foreground max-w-md">
            Invite 3 friends to join StudyPilot AI and get 7 days of Premium access for absolutely free!
          </p>
        </div>
        <Button variant="secondary" className="gap-2 px-8 h-12 rounded-full">
          <Share2 className="h-4 w-4" /> Share Referral Link
        </Button>
      </div>
    </div>
  );
}
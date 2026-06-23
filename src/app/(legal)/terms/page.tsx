
"use client";

import { GraduationCap, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <header className="h-20 bg-white border-b flex items-center px-4 md:px-12">
        <Link className="flex items-center gap-2" href="/">
          <GraduationCap className="h-6 w-6 text-primary" />
          <span className="font-black tracking-tighter text-xl">StudyPilot AI</span>
        </Link>
        <Button variant="ghost" className="ml-auto font-bold gap-2" asChild>
          <Link href="/"><ArrowLeft className="h-4 w-4" /> Back to Home</Link>
        </Button>
      </header>

      <main className="max-w-3xl mx-auto mt-12 px-6 bg-white p-10 md:p-16 rounded-[2.5rem] shadow-sm">
        <h1 className="text-4xl font-black font-headline tracking-tight mb-8">Terms of Service</h1>
        <p className="text-slate-400 font-bold mb-10 italic text-sm">Last Updated: July 2024</p>
        
        <div className="space-y-8 text-slate-600 leading-relaxed font-medium">
          <section className="space-y-4">
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-widest text-[10px]">1. Acceptance of Terms</h2>
            <p>By using StudyPilot AI, you agree to these terms. Our service provides AI-generated study material for academic assistance.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-widest text-[10px]">2. User Conduct</h2>
            <p>You agree not to use StudyPilot AI for plagiarism or unethical academic behavior. The tool is intended for study aid and revision, not for direct submission as original work where prohibited by your institution.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-widest text-[10px]">3. Subscription & Billing</h2>
            <p>Subscriptions (Pro and Elite) are billed monthly. You can cancel your subscription at any time through your account settings. Payments are processed in INR through Razorpay.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-widest text-[10px]">4. Limitation of Liability</h2>
            <p>AI-generated content may occasionally contain inaccuracies. StudyPilot AI is not responsible for any grades, exam results, or academic outcomes resulting from the use of our service.</p>
          </section>
        </div>
      </main>
    </div>
  );
}

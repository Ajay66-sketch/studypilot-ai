
"use client";

import { GraduationCap, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function RefundPage() {
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
        <h1 className="text-4xl font-black font-headline tracking-tight mb-8">Refund Policy</h1>
        <p className="text-slate-400 font-bold mb-10 italic text-sm">Last Updated: July 2024</p>
        
        <div className="space-y-8 text-slate-600 leading-relaxed font-medium">
          <section className="space-y-4">
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-widest text-[10px]">1. General Policy</h2>
            <p>We offer a 5-generation free trial to all users. Once a paid subscription is active and has been utilized, we generally do not offer refunds as the AI processing costs are incurred instantly.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-widest text-[10px]">2. Refund Eligibility</h2>
            <p>Refund requests are considered on a case-by-case basis under the following circumstances:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Duplicate payment due to a technical error in the Razorpay gateway.</li>
              <li>Unauthorized transaction reported within 24 hours.</li>
              <li>Verified technical failure of the platform where the user was unable to generate any material after payment.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-widest text-[10px]">3. Contact for Refunds</h2>
            <p>For refund requests, please contact us at <strong>support@studypilotai.in</strong> with your payment ID and registered email address.</p>
          </section>
        </div>
      </main>
    </div>
  );
}

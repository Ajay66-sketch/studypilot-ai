
"use client";

import { GraduationCap, ArrowLeft, Mail, MessageSquare, Clock } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function ContactPage() {
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

      <main className="max-w-4xl mx-auto mt-12 px-6">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl font-black font-headline tracking-tight">Need Help, Student?</h1>
          <p className="text-slate-500 font-bold">We're here to help you get back to studying.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="rounded-[2rem] border-none shadow-sm p-8">
            <CardContent className="space-y-6 pt-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-xl text-primary">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-black text-lg">Email Support</h3>
                  <p className="text-slate-500 font-bold text-sm">support@studypilotai.in</p>
                  <p className="text-xs text-slate-400 mt-2 font-medium">Response within 24 hours.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-amber-100 rounded-xl text-amber-600">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-black text-lg">Business Hours</h3>
                  <p className="text-slate-500 font-bold text-sm">Mon - Fri: 10 AM - 6 PM IST</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[2rem] border-none shadow-sm bg-slate-900 text-white p-8">
            <CardContent className="space-y-6 pt-6">
              <h3 className="text-2xl font-black font-headline tracking-tight">Technical Issues?</h3>
              <p className="text-slate-400 font-medium leading-relaxed">If you face issues with generation or plan activation, please include your registered email and a screenshot of the error.</p>
              <Button className="w-full h-14 rounded-xl font-black bg-primary" asChild>
                <a href="mailto:support@studypilotai.in">Send Email Now</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

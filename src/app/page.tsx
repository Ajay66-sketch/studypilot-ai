
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle2, GraduationCap, Zap, BookOpen, 
  ArrowRight, ShieldCheck, Sparkles, Star, 
  Layers, Rocket, AlertCircle, FileText,
  Smartphone, Trophy, Heart, ShieldQuestion
} from "lucide-react";

import { useAuth } from "@/components/auth-provider";

export default function LandingPage() {
  const { user } = useAuth();
  
  return (
    <div className="flex flex-col min-h-screen selection:bg-primary/20 selection:text-primary bg-white overflow-x-hidden">
      <header className="px-4 lg:px-12 h-20 flex items-center border-b bg-white/80 backdrop-blur-xl sticky top-0 z-50">
        <Link className="flex items-center justify-center space-x-2" href="/">
          <div className="p-1.5 bg-primary rounded-lg shadow-lg shadow-primary/20">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <span className="font-headline font-black text-xl tracking-tighter text-slate-900">StudyPilot AI</span>
        </Link>
        <nav className="ml-auto flex gap-4 md:gap-8 items-center">
          <Link className="hidden lg:block text-sm font-bold text-slate-600 hover:text-primary transition-colors" href={user ? "/dashboard/billing" : "/login?next=/dashboard/billing"}>Pricing</Link>
          <div className="flex items-center gap-2">
            {user ? (
              <Button asChild className="rounded-xl font-black shadow-xl shadow-primary/20 px-6 h-10 bg-primary hover:bg-primary/90 text-sm">
                <Link href="/dashboard">Go to Workspace</Link>
              </Button>
            ) : (
              <>
                <Button asChild variant="ghost" className="font-black text-slate-700 hover:bg-slate-50 text-sm px-4">
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild className="rounded-xl font-black shadow-xl shadow-primary/20 px-6 h-10 bg-primary hover:bg-primary/90 text-sm">
                  <Link href="/login">Join Free</Link>
                </Button>
              </>
            )}
          </div>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-16 md:py-32 bg-gradient-to-b from-slate-50/50 to-white relative">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full" />
          
          <div className="container px-4 md:px-6 mx-auto text-center relative">
            <div className="space-y-8 max-w-5xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em]">
                <Rocket className="h-3 w-3" /> Built for Indian Semester Exams
              </div>
              <h1 className="text-4xl sm:text-6xl md:text-8xl font-headline font-black tracking-tighter leading-[1] text-slate-900">
                Notes into <span className="text-primary italic">Exam Answers</span> <br /> In Seconds.
              </h1>
              <p className="mx-auto max-w-2xl text-slate-500 text-base md:text-xl font-medium leading-relaxed">
                StudyPilot transforms messy textbooks into structured model answers and revision packs instantly. Stop manual note-making.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button asChild size="lg" className="h-14 px-10 text-lg font-black rounded-2xl shadow-2xl shadow-primary/20 hover:scale-105 transition-all group bg-primary">
                  <Link href={user ? "/dashboard" : "/login"}>
                    Start Prep Free <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="h-14 px-10 text-lg font-black rounded-2xl border-2 hover:bg-slate-50 shadow-sm" asChild>
                  <Link href={user ? "/dashboard/billing" : "/login?next=/dashboard/billing"}>View India Pricing</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="w-full py-24 bg-white border-y">
           <div className="container px-4 mx-auto max-w-5xl">
              <div className="text-center mb-16 space-y-4">
                <h2 className="text-3xl md:text-5xl font-black font-headline">The 3-Step Success</h2>
                <p className="text-slate-500 font-bold italic">Go from "I'm lost" to "I'm ready" in minutes.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                 <div className="space-y-4">
                    <div className="h-16 w-16 bg-primary text-white rounded-2xl flex items-center justify-center font-black text-2xl mx-auto shadow-lg">1</div>
                    <h3 className="font-black text-xl">Paste Notes</h3>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed">Paste raw textbook text or upload a simple PDF of your topic.</p>
                 </div>
                 <div className="space-y-4">
                    <div className="h-16 w-16 bg-primary text-white rounded-2xl flex items-center justify-center font-black text-2xl mx-auto shadow-lg">2</div>
                    <h3 className="font-black text-xl">Select Tool</h3>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed">Choose Model Answers, Summaries, or Probable Questions.</p>
                 </div>
                 <div className="space-y-4">
                    <div className="h-16 w-16 bg-primary text-white rounded-2xl flex items-center justify-center font-black text-2xl mx-auto shadow-lg">3</div>
                    <h3 className="font-black text-xl">Ace the Exam</h3>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed">Get structured, high-scoring material tailored for university marking schemes.</p>
                 </div>
              </div>
           </div>
        </section>

        {/* Feature Grid */}
        <section className="w-full py-20 bg-slate-50">
          <div className="container px-4 mx-auto">
            <div className="text-center space-y-3 mb-16">
              <h2 className="text-3xl md:text-6xl font-black tracking-tighter font-headline">The Study Suite.</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: "Summarizer", icon: Zap, desc: "Dense notes into high-impact scoring points." },
                { title: "Exam Answers", icon: BookOpen, desc: "Model answers structured for 2/5/10 mark questions." },
                { title: "Important Qs", icon: AlertCircle, desc: "Predicted probable questions for targeted last-day prep." },
                { title: "Revision Sheets", icon: FileText, desc: "One-page rapid packs with recall mnemonics." }
              ].map((feature, i) => (
                <Card key={i} className="border-none shadow-md hover:shadow-xl transition-all rounded-[2rem] p-8 group bg-white">
                  <div className="p-4 w-fit rounded-xl bg-primary/5 text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-headline font-black text-lg tracking-tight mb-2">{feature.title}</h3>
                  <p className="text-slate-500 text-sm font-medium leading-relaxed">{feature.desc}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Comparison */}
        <section className="w-full py-24 bg-white border-b">
           <div className="container px-4 mx-auto max-w-4xl">
              <div className="text-center mb-12">
                 <h2 className="text-3xl md:text-5xl font-black font-headline">Better than ChatGPT</h2>
                 <p className="text-slate-400 font-bold mt-2">Specialized for semester exam architectures.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <Card className="p-8 rounded-[2rem] bg-slate-50/50 border-none opacity-60">
                    <h3 className="text-center font-black text-slate-400 mb-6 uppercase tracking-widest text-sm">Generic AI</h3>
                    <ul className="space-y-4">
                       <li className="flex gap-2 text-xs font-bold text-slate-500"><ShieldQuestion className="h-4 w-4 shrink-0" /> Walls of generic text</li>
                       <li className="flex gap-2 text-xs font-bold text-slate-500"><ShieldQuestion className="h-4 w-4 shrink-0" /> No mark-based structure</li>
                       <li className="flex gap-2 text-xs font-bold text-slate-500"><ShieldQuestion className="h-4 w-4 shrink-0" /> Requires complex prompts</li>
                    </ul>
                 </Card>
                 <Card className="p-8 rounded-[2rem] bg-primary/[0.03] border-4 border-primary relative overflow-hidden">
                    <Zap className="absolute -top-4 -right-4 h-24 w-24 text-primary/10" />
                    <h3 className="text-center font-black text-primary mb-6 uppercase tracking-widest text-sm">StudyPilot AI</h3>
                    <ul className="space-y-4">
                       <li className="flex gap-2 text-xs font-black text-slate-900"><CheckCircle2 className="h-4 w-4 text-primary shrink-0" /> Structured 2/5/10 Mark answers</li>
                       <li className="flex gap-2 text-xs font-black text-slate-900"><CheckCircle2 className="h-4 w-4 text-primary shrink-0" /> Predicted probable questions</li>
                       <li className="flex gap-2 text-xs font-black text-slate-900"><CheckCircle2 className="h-4 w-4 text-primary shrink-0" /> Zero prompting needed</li>
                    </ul>
                 </Card>
              </div>
           </div>
        </section>
      </main>

      <footer className="border-t py-12 bg-white px-4">
        <div className="container flex flex-col items-center justify-between gap-8 md:flex-row mx-auto">
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-primary rounded-lg text-white">
                <GraduationCap className="h-5 w-5" />
              </div>
              <span className="font-headline font-black text-xl tracking-tighter">StudyPilot AI</span>
            </div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Built for university success. © 2024</p>
          </div>
          <div className="flex gap-12 text-center md:text-left">
            <div className="space-y-4">
               <p className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-400">Legal</p>
               <ul className="space-y-2 font-bold text-slate-600 text-[10px]">
                 <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                 <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                 <li><Link href="/refund" className="hover:text-primary transition-colors">Refund Policy</Link></li>
               </ul>
            </div>
            <div className="space-y-4">
               <p className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-400">Support</p>
               <ul className="space-y-2 font-bold text-slate-600 text-[10px]">
                 <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
                 <li><Link href={user ? "/dashboard" : "/login"} className="hover:text-primary transition-colors">Dashboard</Link></li>
               </ul>
            </div>
          </div>
        </div>
        <div className="mt-12 text-center">
           <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest flex items-center justify-center gap-1.5">
             <Heart className="h-3 w-3 text-rose-400 fill-rose-400" /> Made for students in India
           </p>
        </div>
      </footer>
    </div>
  );
}

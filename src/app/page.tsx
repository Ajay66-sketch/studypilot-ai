
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle2, GraduationCap, Zap, BookOpen, 
  ArrowRight, ShieldCheck, Sparkles, Star, 
  Layers, Rocket, AlertCircle, FileText,
  Smartphone, ShieldQuestion, Heart, Trophy, MessageSquare
} from "lucide-react";

export default function LandingPage() {
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
          <Link className="hidden lg:block text-sm font-bold text-slate-600 hover:text-primary transition-colors" href="#how-it-works">Process</Link>
          <Link className="hidden lg:block text-sm font-bold text-slate-600 hover:text-primary transition-colors" href="#pricing">Pricing</Link>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" className="font-black text-slate-700 hover:bg-slate-50 text-sm px-4">
              <Link href="/dashboard">Login</Link>
            </Button>
            <Button asChild className="rounded-xl font-black shadow-xl shadow-primary/20 px-6 h-10 bg-primary hover:bg-primary/90 text-sm">
              <Link href="/dashboard">Join Free</Link>
            </Button>
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
                Stop wasting hours manual note-making. StudyPilot transforms messy textbook content into high-scoring model answers and revision packs instantly.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button asChild size="lg" className="h-14 px-10 text-lg font-black rounded-2xl shadow-2xl shadow-primary/20 hover:scale-105 transition-all group bg-primary">
                  <Link href="/dashboard">
                    Start Prep Free <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="h-14 px-10 text-lg font-black rounded-2xl border-2 hover:bg-slate-50 shadow-sm" asChild>
                  <Link href="#pricing">View India Pricing</Link>
                </Button>
              </div>

              <div className="pt-16 flex flex-wrap justify-center gap-8 opacity-40 grayscale pointer-events-none">
                 <div className="font-bold text-sm tracking-tight flex items-center gap-2"><Smartphone className="h-4 w-4" /> Android Friendly</div>
                 <div className="font-bold text-sm tracking-tight flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> 100% Secure</div>
                 <div className="font-bold text-sm tracking-tight flex items-center gap-2"><Trophy className="h-4 w-4" /> Result Focused</div>
              </div>
            </div>
          </div>
        </section>

        {/* How it Works Section */}
        <section id="how-it-works" className="w-full py-20 bg-slate-950 text-white relative">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center space-y-4 mb-16">
               <Badge className="bg-primary/20 text-primary border-none font-black text-[10px] uppercase tracking-[0.3em] px-4 py-1.5 rounded-full">The Workflow</Badge>
              <h2 className="text-3xl md:text-5xl font-black tracking-tighter font-headline">From Messy to Exam Ready.</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { step: "01", title: "Drop Your Notes", desc: "Paste raw textbook text, lecture notes, or upload a chapter PDF.", icon: Zap },
                { step: "02", title: "Pick Your Tool", icon: Layers, desc: "Select Summarizer, Model Answers, Questions, or Revision Pack." },
                { step: "03", title: "Ace Your Prep", icon: GraduationCap, desc: "Get structured, high-value material optimized for Indian marking schemes." }
              ].map((item, i) => (
                <div key={i} className="relative space-y-6 p-8 bg-white/5 rounded-[2rem] border border-white/10 group hover:bg-white/10 transition-colors">
                  <div className="h-12 w-12 bg-primary rounded-xl flex items-center justify-center text-white shadow-xl shadow-primary/20 mb-4">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-xl font-black font-headline tracking-tight">{item.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed font-medium">{item.desc}</p>
                  </div>
                  <div className="text-4xl font-black text-white/5 absolute bottom-4 right-6">{item.step}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Comparison Section */}
        <section className="w-full py-20 bg-white overflow-hidden">
          <div className="container px-4 md:px-6 mx-auto">
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div className="space-y-8">
                   <h2 className="text-3xl md:text-5xl font-black font-headline tracking-tight leading-[1.1]">Why StudyPilot AI <br /><span className="text-primary text-xl md:text-3xl">Instead of ChatGPT?</span></h2>
                   <p className="text-base md:text-lg text-slate-500 font-medium leading-relaxed max-w-lg">ChatGPT is generic. StudyPilot is a specialized study architect that understands university standards and student memory patterns.</p>
                   <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        "Structured for Semester Patterns",
                        "Intro-Body-Conclusion Models",
                        "Predicted 2, 5, 10 Mark Qs",
                        "Exam Hall Checklists",
                        "Instant Mnemonics",
                        "One-Click Revision Packs"
                      ].map((item, i) => (
                        <li key={i} className="flex gap-3 items-center font-bold text-slate-700 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-primary shrink-0" /> {item}
                        </li>
                      ))}
                   </ul>
                </div>
                <div className="relative">
                   <div className="absolute -inset-4 bg-primary/5 rounded-[2.5rem] blur-3xl opacity-50" />
                   <Card className="relative border-2 border-slate-100 shadow-2xl rounded-[2.5rem] p-6 space-y-6 bg-white max-w-md mx-auto">
                      <div className="flex gap-3 items-center border-b pb-4">
                         <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center text-white"><Rocket className="h-4 w-4" /></div>
                         <div className="space-y-0.5">
                            <p className="font-black text-[10px] text-slate-400 uppercase tracking-widest">Target Score: 95%</p>
                            <p className="font-black text-sm text-slate-900 tracking-tight">University Model Answer</p>
                         </div>
                      </div>
                      <div className="space-y-4">
                         <div className="space-y-2">
                           <div className="h-3 w-1/3 bg-primary/20 rounded-full" />
                           <div className="h-2 w-full bg-slate-50 rounded-full" />
                           <div className="h-2 w-[90%] bg-slate-50 rounded-full" />
                         </div>
                         <div className="p-4 bg-slate-50 rounded-xl space-y-2">
                            <div className="h-2 w-1/4 bg-primary/10 rounded-full" />
                            <div className="h-2 w-full bg-white rounded-full" />
                            <div className="h-2 w-full bg-white rounded-full" />
                         </div>
                      </div>
                      <div className="pt-2 flex justify-center">
                         <Badge className="bg-primary/5 text-primary border-none font-black px-4 py-1 rounded-full text-[9px] uppercase tracking-widest">Optimized Output</Badge>
                      </div>
                   </Card>
                </div>
             </div>
          </div>
        </section>

        {/* Feature Grid */}
        <section id="features" className="w-full py-20 bg-slate-50">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center space-y-3 mb-16">
              <h2 className="text-3xl md:text-6xl font-black tracking-tighter font-headline">The Smart Study Suite.</h2>
              <p className="text-sm md:text-base text-slate-500 font-medium max-w-xl mx-auto">Engineered for internally-conducted exams and semester patterns.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: "Summarizer", icon: Zap, desc: "Quick summaries, bullet points, and key concepts for fast internal reading." },
                { title: "Exam Answers", icon: BookOpen, desc: "Structured answers optimized for scoring maximum university marks." },
                { title: "Important Qs", icon: AlertCircle, desc: "Predicted 2, 5, and 10 mark questions for targeted last-day prep." },
                { title: "Revision Sheets", icon: Layers, desc: "Dense revision packs with memory mnemonics and hall checklists." }
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

        {/* Pricing Section */}
        <section id="pricing" className="w-full py-20 bg-white">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center space-y-3 mb-16">
              <h2 className="text-3xl md:text-6xl font-black tracking-tighter font-headline">Budget Friendly.</h2>
              <p className="text-sm md:text-base text-slate-500 font-medium">Invest in your results for the price of a coffee.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto items-center">
              {/* Starter */}
              <Card className="p-8 rounded-[2rem] border-2 border-slate-100 bg-white flex flex-col h-full hover:shadow-lg transition-shadow">
                <div className="mb-6">
                  <Badge variant="outline" className="mb-2 font-black border-slate-100 text-[10px]">PILOT</Badge>
                  <div className="text-4xl font-black text-slate-900">₹0<span className="text-xs text-slate-400 font-bold ml-1">/mo</span></div>
                </div>
                <ul className="space-y-3 flex-1 font-bold text-slate-500 text-sm mb-8">
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> 5 generations / day</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Standard outputs</li>
                  <li className="flex items-center gap-2 text-slate-300"><CheckCircle2 className="h-4 w-4" /> No Premium Mode</li>
                </ul>
                <Button variant="outline" className="w-full rounded-xl h-12 font-black border-2" asChild>
                  <Link href="/dashboard">Get Started</Link>
                </Button>
              </Card>

              {/* Pro */}
              <Card className="p-10 rounded-[2.5rem] border-4 border-primary bg-white flex flex-col h-full shadow-2xl relative scale-105 z-10 overflow-hidden">
                <div className="absolute top-0 right-0 bg-primary text-white px-5 py-2 text-[8px] font-black rounded-bl-xl uppercase tracking-widest">BEST VALUE</div>
                <div className="mb-8">
                  <Badge className="mb-2 font-black bg-primary/10 text-primary border-none text-[10px]">STUDY PRO</Badge>
                  <div className="text-5xl font-black text-primary">₹99<span className="text-xs text-slate-400 font-bold ml-1">/mo</span></div>
                </div>
                <ul className="space-y-4 flex-1 font-bold text-slate-700 mb-10 text-sm">
                  <li className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-primary" /> Unlimited generations</li>
                  <li className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-primary" /> Advanced Chaining</li>
                  <li className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-primary" /> Premium Exports</li>
                </ul>
                <Button className="w-full rounded-2xl h-14 bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 font-black text-base" asChild>
                  <Link href="/dashboard/billing">Go Pro Now</Link>
                </Button>
              </Card>

              {/* Elite */}
              <Card className="p-8 rounded-[2rem] border-2 border-slate-100 bg-white flex flex-col h-full hover:shadow-lg transition-shadow">
                <div className="mb-6">
                  <Badge variant="outline" className="mb-2 font-black border-slate-100 text-[10px]">ELITE PREP</Badge>
                  <div className="text-4xl font-black text-slate-900">₹199<span className="text-xs text-slate-400 font-bold ml-1">/mo</span></div>
                </div>
                <ul className="space-y-3 flex-1 font-bold text-slate-500 text-sm mb-8">
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Everything in Pro</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Exam Booster Mode</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Priority Tools</li>
                </ul>
                <Button variant="outline" className="w-full rounded-xl h-12 font-black border-2" asChild>
                  <Link href="/dashboard/billing">Get Elite</Link>
                </Button>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="w-full py-20 bg-slate-50">
          <div className="container px-4 md:px-6 mx-auto max-w-3xl">
            <div className="text-center space-y-2 mb-12">
               <h2 className="text-3xl font-black font-headline tracking-tight">Got Questions?</h2>
               <p className="text-slate-500 font-bold">Everything you need to know about StudyPilot.</p>
            </div>
            <div className="space-y-4">
               {[
                 { q: "How is this better than ChatGPT?", a: "StudyPilot uses specialized academic frameworks designed for Indian semester patterns. It doesn't just chat; it builds structured study packs that are ready for the exam hall." },
                 { q: "Can I upload my own PDF notes?", a: "Yes! You can upload textbook chapters or handwritten scans (as PDFs) and we'll extract the core material for you instantly." },
                 { q: "Is the free plan really free?", a: "Yes, you get 5 generations every single day forever. No credit card required to start your prep." },
                 { q: "What is Exam Booster Mode?", a: "It's an Elite-only feature that applies university marking-scheme logic to your answers, adding probable scores and extra 'must-write' technical points." }
               ].map((item, i) => (
                 <div key={i} className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100 group hover:border-primary/20 transition-colors">
                   <h4 className="font-black font-headline mb-2 text-slate-900 flex gap-3"><ShieldQuestion className="h-5 w-5 text-primary shrink-0" /> {item.q}</h4>
                   <p className="text-slate-600 font-medium text-sm leading-relaxed pl-8">{item.a}</p>
                 </div>
               ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="w-full py-24 bg-primary text-white text-center relative overflow-hidden">
          <div className="container px-4 md:px-6 mx-auto relative z-10 space-y-10">
            <h2 className="text-4xl md:text-7xl font-black tracking-tighter font-headline leading-[1]">Prepare Smarter. <br />Score Higher.</h2>
            <p className="text-lg md:text-xl font-bold opacity-90 max-w-xl mx-auto">Join thousands of students who have stopped manual note-making and started scoring better.</p>
            <Button asChild size="lg" className="h-16 px-12 text-lg font-black rounded-2xl bg-white text-primary hover:bg-slate-50 shadow-2xl hover:scale-105 transition-transform">
              <Link href="/dashboard">Join StudyPilot Free</Link>
            </Button>
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
                 <li><Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                 <li><Link href="#" className="hover:text-primary transition-colors">Terms of Use</Link></li>
                 <li><Link href="#" className="hover:text-primary transition-colors">Refund Policy</Link></li>
               </ul>
            </div>
            <div className="space-y-4">
               <p className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-400">Support</p>
               <ul className="space-y-2 font-bold text-slate-600 text-[10px]">
                 <li><Link href="#" className="hover:text-primary transition-colors">Help Center</Link></li>
                 <li><Link href="#" className="hover:text-primary transition-colors">Contact Us</Link></li>
                 <li><Link href="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link></li>
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

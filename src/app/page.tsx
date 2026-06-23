
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle2, GraduationCap, Zap, BookOpen, 
  Users, ArrowRight, ShieldCheck, Sparkles, Star, 
  Layers, Rocket, AlertCircle, FileText, LayoutDashboard,
  ShieldQuestion, Smartphone
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen selection:bg-primary/20 selection:text-primary bg-white">
      <header className="px-6 lg:px-12 h-20 flex items-center border-b bg-white/80 backdrop-blur-xl sticky top-0 z-50">
        <Link className="flex items-center justify-center space-x-3" href="/">
          <div className="p-2 bg-primary rounded-xl shadow-lg shadow-primary/20">
            <GraduationCap className="h-7 w-7 text-white" />
          </div>
          <span className="font-headline font-black text-2xl tracking-tighter text-slate-900">StudyPilot AI</span>
        </Link>
        <nav className="ml-auto flex gap-6 md:gap-8 items-center">
          <Link className="hidden lg:block text-sm font-bold text-slate-600 hover:text-primary transition-colors" href="#how-it-works">How it works</Link>
          <Link className="hidden lg:block text-sm font-bold text-slate-600 hover:text-primary transition-colors" href="#pricing">Pricing</Link>
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" className="font-black text-slate-700 hover:bg-slate-50">
              <Link href="/dashboard">Login</Link>
            </Button>
            <Button asChild className="rounded-xl font-black shadow-xl shadow-primary/20 px-8 h-11 bg-primary hover:bg-primary/90">
              <Link href="/dashboard">Get Started Free</Link>
            </Button>
          </div>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-20 md:py-32 bg-gradient-to-b from-slate-50/50 to-white overflow-hidden relative">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full" />
          
          <div className="container px-4 md:px-6 mx-auto text-center relative">
            <div className="space-y-10 max-w-5xl mx-auto">
              <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-[0.2em] animate-in fade-in slide-in-from-top-4 duration-1000">
                <Rocket className="h-3.5 w-3.5" /> Your AI Semester Exam Assistant
              </div>
              <h1 className="text-5xl font-headline font-black tracking-tighter sm:text-7xl md:text-8xl leading-[0.95] text-slate-900">
                Notes into <span className="text-primary italic">Exam Answers</span> In Seconds.
              </h1>
              <p className="mx-auto max-w-3xl text-slate-500 text-lg md:text-xl font-medium leading-relaxed">
                Stop wasting hours making manual notes. StudyPilot transforms raw textbook content into structured exam answers, predicted questions, and revision sheets designed for university success.
              </p>
              <div className="flex flex-col sm:flex-row gap-5 justify-center pt-8">
                <Button asChild size="lg" className="h-16 px-10 text-lg font-black rounded-2xl shadow-2xl shadow-primary/20 hover:scale-105 transition-all group bg-primary">
                  <Link href="/dashboard">
                    Start Free Prep <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="h-16 px-10 text-lg font-black rounded-2xl border-2 hover:bg-slate-50 shadow-sm" asChild>
                  <Link href="#pricing">View Indian Pricing</Link>
                </Button>
              </div>

              <div className="pt-20 flex flex-wrap justify-center gap-10 opacity-50 grayscale pointer-events-none">
                 <div className="font-bold text-xl tracking-tight flex items-center gap-2"><Smartphone className="h-5 w-5" /> Mobile Ready</div>
                 <div className="font-bold text-xl tracking-tight flex items-center gap-2"><ShieldCheck className="h-5 w-5" /> 100% Secure</div>
                 <div className="font-bold text-xl tracking-tight flex items-center gap-2"><GraduationCap className="h-5 w-5" /> Built for Students</div>
              </div>
            </div>
          </div>
        </section>

        {/* How it Works Section */}
        <section id="how-it-works" className="w-full py-24 bg-slate-900 text-white relative">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center space-y-6 mb-20">
               <Badge className="bg-primary/20 text-primary border-none font-black text-[10px] uppercase tracking-[0.3em] px-4 py-1.5 rounded-full">The Process</Badge>
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter font-headline">From Raw Notes to Exam Ready.</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {[
                { step: "01", title: "Paste or Upload", desc: "Drop your textbook notes or raw chapter content into the workspace.", icon: Zap },
                { step: "02", title: "Select Study Tool", icon: Layers, desc: "Choose a Summary, Exam Answer, Questions, or Revision Sheet." },
                { step: "03", title: "Ace Your Semester", icon: GraduationCap, desc: "Get high-scoring material optimized for Indian university marking schemes." }
              ].map((item, i) => (
                <div key={i} className="relative space-y-8 p-10 bg-white/5 rounded-[2.5rem] border border-white/10 backdrop-blur-sm group hover:bg-white/10 transition-colors">
                  <div className="h-14 w-14 bg-primary rounded-xl flex items-center justify-center text-white shadow-xl shadow-primary/20 mb-6">
                    <item.icon className="h-7 w-7" />
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-2xl font-black font-headline tracking-tight">{item.title}</h3>
                    <p className="text-slate-400 leading-relaxed font-medium">{item.desc}</p>
                  </div>
                  <div className="text-5xl font-black text-white/5 absolute bottom-6 right-8">{item.step}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why not ChatGPT Section */}
        <section className="w-full py-24 bg-white overflow-hidden">
          <div className="container px-4 md:px-6 mx-auto">
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                <div className="space-y-10">
                   <h2 className="text-4xl md:text-6xl font-black font-headline tracking-tight leading-[1]">Why use StudyPilot <br /><span className="text-primary text-2xl md:text-4xl">instead of ChatGPT?</span></h2>
                   <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-lg">ChatGPT is a generic writer. StudyPilot is a specialized study architect that understands university standards and student memory patterns.</p>
                   <ul className="space-y-5">
                      {[
                        "Structured specifically for Indian Semester Patterns",
                        "Intro-Body-Conclusion model answers",
                        "Predicted 2, 5, and 10 Mark Questions",
                        "One-Click Mnemonics for Revision",
                        "Academic tone tailored by subject"
                      ].map((item, i) => (
                        <li key={i} className="flex gap-4 items-center font-bold text-slate-700">
                          <div className="p-1 bg-primary/10 rounded-full"><CheckCircle2 className="h-5 w-5 text-primary shrink-0" /></div> {item}
                        </li>
                      ))}
                   </ul>
                </div>
                <div className="relative">
                   <div className="absolute -inset-4 bg-primary/5 rounded-[3rem] blur-3xl opacity-50" />
                   <Card className="relative border-4 border-slate-50 shadow-2xl rounded-[3rem] p-8 space-y-6 overflow-hidden bg-white">
                      <div className="flex gap-3 items-center border-b pb-4">
                         <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center text-white"><Rocket className="h-5 w-5" /></div>
                         <div className="space-y-0.5">
                            <p className="font-black text-sm text-slate-900">StudyPilot AI Output</p>
                            <p className="text-[10px] text-primary uppercase tracking-widest font-black">University Ready</p>
                         </div>
                      </div>
                      <div className="space-y-3">
                         <div className="h-3 w-1/3 bg-primary/10 rounded-full" />
                         <div className="space-y-2">
                           <div className="h-3 w-full bg-slate-50 rounded-full" />
                           <div className="h-3 w-[90%] bg-slate-50 rounded-full" />
                         </div>
                         <div className="grid grid-cols-2 gap-2 pt-4">
                            <div className="h-8 bg-primary/5 rounded-lg border border-primary/10" />
                            <div className="h-8 bg-primary/5 rounded-lg border border-primary/10" />
                         </div>
                      </div>
                      <div className="pt-4 flex justify-center">
                         <Badge className="bg-primary/10 text-primary border-none font-black px-4 py-1.5 rounded-full text-[10px]">99% SCORING PROBABILITY</Badge>
                      </div>
                   </Card>
                </div>
             </div>
          </div>
        </section>

        {/* Feature Grid */}
        <section id="features" className="w-full py-24 bg-slate-50">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-4xl md:text-7xl font-black tracking-tighter font-headline">The Study Suite.</h2>
              <p className="text-lg text-slate-500 font-medium max-w-xl mx-auto">Tools built specifically for semester exams.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: "Summarizer", icon: Zap, desc: "Quick summaries, bullet points, and key concepts for fast reading." },
                { title: "Exam Answers", icon: BookOpen, desc: "Structured answers optimized for scoring maximum university marks." },
                { title: "Important Qs", icon: AlertCircle, desc: "Predicted 2, 5, and 10 mark questions for targeted preparation." },
                { title: "Revision Sheets", icon: Layers, desc: "Dense revision packs with memory mnemonics and hall checklists." }
              ].map((feature, i) => (
                <Card key={i} className="border-none shadow-sm hover:shadow-xl transition-all rounded-[2.5rem] p-8 group bg-white">
                  <div className="p-5 w-fit rounded-2xl bg-primary/10 text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                    <feature.icon className="h-8 w-8" />
                  </div>
                  <h3 className="font-headline font-black text-xl tracking-tight mb-3">{feature.title}</h3>
                  <p className="text-slate-500 font-medium leading-relaxed">{feature.desc}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Preview */}
        <section id="pricing" className="w-full py-24 bg-white">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-4xl md:text-7xl font-black tracking-tighter font-headline">Budget Friendly.</h2>
              <p className="text-lg text-slate-500 font-medium">Invest in your grades for the price of a coffee.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto items-center">
              <Card className="p-8 rounded-[2rem] border-2 border-slate-100 bg-slate-50/50 flex flex-col h-full">
                <div className="mb-8">
                  <Badge variant="outline" className="mb-2 font-black border-slate-200">STARTER</Badge>
                  <div className="text-4xl font-black">₹0<span className="text-sm text-slate-400 font-bold ml-1">/mo</span></div>
                </div>
                <ul className="space-y-3 flex-1 font-bold text-slate-500 text-sm mb-8">
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> 5 generations / day</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Standard outputs</li>
                </ul>
                <Button variant="outline" className="w-full rounded-xl h-12 font-black border-2" asChild>
                  <Link href="/dashboard">Get Started</Link>
                </Button>
              </Card>

              <Card className="p-10 rounded-[2.5rem] border-4 border-primary bg-white flex flex-col h-full shadow-2xl relative scale-105 z-10 overflow-hidden">
                <div className="absolute top-0 right-0 bg-primary text-white px-6 py-2 text-[10px] font-black rounded-bl-2xl uppercase tracking-widest">BEST VALUE</div>
                <div className="mb-8">
                  <Badge className="mb-2 font-black bg-primary/10 text-primary border-none">STUDY PRO</Badge>
                  <div className="text-5xl font-black text-primary">₹99<span className="text-sm text-slate-400 font-bold ml-1">/mo</span></div>
                </div>
                <ul className="space-y-4 flex-1 font-bold text-slate-700 mb-10">
                  <li className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-primary" /> Unlimited generations</li>
                  <li className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-primary" /> Advanced Chaining</li>
                  <li className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-primary" /> Premium PDF Exports</li>
                </ul>
                <Button className="w-full rounded-2xl h-14 bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 font-black text-lg" asChild>
                  <Link href="/dashboard/billing">Upgrade to Pro</Link>
                </Button>
              </Card>

              <Card className="p-8 rounded-[2rem] border-2 border-slate-100 bg-slate-50/50 flex flex-col h-full">
                <div className="mb-8">
                  <Badge variant="outline" className="mb-2 font-black border-slate-200">ELITE PREP</Badge>
                  <div className="text-4xl font-black">₹199<span className="text-sm text-slate-400 font-bold ml-1">/mo</span></div>
                </div>
                <ul className="space-y-3 flex-1 font-bold text-slate-500 text-sm mb-8">
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Everything in Pro</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Exam Booster Mode</li>
                </ul>
                <Button variant="outline" className="w-full rounded-xl h-12 font-black border-2" asChild>
                  <Link href="/dashboard/billing">Upgrade Elite</Link>
                </Button>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="w-full py-24 bg-slate-50">
          <div className="container px-4 md:px-6 mx-auto max-w-3xl">
            <h2 className="text-3xl font-black font-headline text-center mb-12">Frequently Asked</h2>
            <div className="space-y-4">
               {[
                 { q: "How is this different from ChatGPT?", a: "StudyPilot uses specialized academic frameworks for Indian university exams. It doesn't just chat; it builds structured study packs that are ready for the exam hall." },
                 { q: "Can I upload PDF notes?", a: "Yes! You can upload textbook scans or lecture notes as PDFs, and we'll extract the core study material for you." },
                 { q: "Is the free plan really free?", a: "Yes, you get 5 generations every day forever. No credit card required to start." },
                 { q: "What is Exam Booster Mode?", a: "It's a premium feature that applies marking-scheme optimization to your answers, adding probable scores and extra 'must-write' points for university exams." }
               ].map((item, i) => (
                 <div key={i} className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
                   <h4 className="font-black font-headline mb-2">{item.q}</h4>
                   <p className="text-slate-600 font-medium text-sm leading-relaxed">{item.a}</p>
                 </div>
               ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="w-full py-24 bg-primary text-white text-center relative overflow-hidden">
          <div className="container px-4 md:px-6 mx-auto relative z-10 space-y-8">
            <h2 className="text-4xl md:text-7xl font-black tracking-tighter font-headline leading-tight">Prepare Smarter. <br />Score Higher.</h2>
            <p className="text-lg md:text-xl font-bold opacity-80 max-w-2xl mx-auto">Join thousands of students who have stopped making manual notes and started scoring better.</p>
            <Button asChild size="lg" className="h-16 px-12 text-lg font-black rounded-2xl bg-white text-primary hover:bg-slate-50 shadow-2xl">
              <Link href="/dashboard">Join StudyPilot AI Free</Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t py-12 bg-white">
        <div className="container flex flex-col items-center justify-between gap-8 md:flex-row mx-auto px-6">
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-primary rounded-lg text-white">
                <GraduationCap className="h-5 w-5" />
              </div>
              <span className="font-headline font-black text-xl tracking-tighter">StudyPilot AI</span>
            </div>
            <p className="text-sm text-slate-500 font-bold">University Exam Prep Assistant. © 2024</p>
          </div>
          <div className="flex gap-10">
            <div className="space-y-3">
               <p className="font-black text-xs uppercase tracking-widest text-slate-400">Legal</p>
               <ul className="space-y-2 font-bold text-slate-600 text-xs">
                 <li><Link href="#" className="hover:text-primary transition-colors">Privacy</Link></li>
                 <li><Link href="#" className="hover:text-primary transition-colors">Terms</Link></li>
               </ul>
            </div>
            <div className="space-y-3">
               <p className="font-black text-xs uppercase tracking-widest text-slate-400">Product</p>
               <ul className="space-y-2 font-bold text-slate-600 text-xs">
                 <li><Link href="#pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
                 <li><Link href="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link></li>
               </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}



"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle2, GraduationCap, Zap, BookOpen, Clock, 
  Users, ArrowRight, ShieldCheck, Sparkles, Star, 
  TrendingUp, Layers, MousePointer2, Award, Rocket,
  AlertCircle
} from "lucide-react";
import Image from "next/image";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen selection:bg-primary/20 selection:text-primary bg-white">
      <header className="px-6 lg:px-12 h-20 flex items-center border-b bg-white/80 backdrop-blur-xl sticky top-0 z-50">
        <Link className="flex items-center justify-center space-x-3" href="/">
          <div className="p-2 bg-primary rounded-xl shadow-lg shadow-primary/20">
            <GraduationCap className="h-8 w-8 text-white" />
          </div>
          <span className="font-headline font-black text-2xl tracking-tighter text-slate-900">StudyPilot AI</span>
        </Link>
        <nav className="ml-auto flex gap-6 md:gap-8 items-center">
          <Link className="hidden lg:block text-sm font-bold text-slate-600 hover:text-primary transition-colors" href="#how-it-works">Process</Link>
          <Link className="hidden lg:block text-sm font-bold text-slate-600 hover:text-primary transition-colors" href="#features">Tools</Link>
          <Link className="hidden lg:block text-sm font-bold text-slate-600 hover:text-primary transition-colors" href="#pricing">Pricing</Link>
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" className="font-black text-slate-700 hover:bg-slate-50">
              <Link href="/dashboard">Login</Link>
            </Button>
            <Button asChild className="rounded-xl font-black shadow-xl shadow-primary/20 px-8 h-11 bg-primary hover:bg-primary/90">
              <Link href="/dashboard">Start Free</Link>
            </Button>
          </div>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-24 md:py-40 bg-gradient-to-b from-slate-50/50 to-white overflow-hidden relative">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full" />
          <div className="absolute bottom-0 right-0 w-[30%] h-[30%] bg-accent/5 blur-[100px] rounded-full" />
          
          <div className="container px-4 md:px-6 mx-auto text-center relative">
            <div className="space-y-10 max-w-6xl mx-auto">
              <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-[0.2em] animate-in fade-in slide-in-from-top-4 duration-1000">
                <Rocket className="h-3.5 w-3.5" /> Your AI Semester Exam Prep Assistant
              </div>
              <h1 className="text-6xl font-headline font-black tracking-tighter sm:text-7xl md:text-8xl lg:text-9xl leading-[0.9] text-slate-900">
                Notes into <span className="text-primary italic">Exam Answers</span> In Seconds.
              </h1>
              <p className="mx-auto max-w-3xl text-slate-500 text-lg md:text-2xl font-medium leading-relaxed">
                Stop wasting hours making notes manually. StudyPilot transforms raw content into structured exam answers, important questions, and revision sheets instantly.
              </p>
              <div className="flex flex-col sm:flex-row gap-5 justify-center pt-8">
                <Button asChild size="lg" className="h-18 px-12 text-xl font-black rounded-2xl shadow-2xl shadow-primary/20 hover:scale-105 transition-all group bg-primary">
                  <Link href="/dashboard">
                    Try For Free <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="h-18 px-12 text-xl font-black rounded-2xl border-2 hover:bg-slate-50 shadow-sm" asChild>
                  <Link href="#pricing">View Pricing</Link>
                </Button>
              </div>

              <div className="pt-20 flex flex-wrap justify-center gap-12 opacity-40 grayscale pointer-events-none">
                 <div className="font-black text-2xl tracking-tighter flex items-center gap-2"><Layers className="h-6 w-6" /> 10K+ Study Packs</div>
                 <div className="font-black text-2xl tracking-tighter flex items-center gap-2"><Users className="h-6 w-6" /> 5,000+ Active Students</div>
                 <div className="font-black text-2xl tracking-tighter flex items-center gap-2"><ShieldCheck className="h-6 w-6" /> University-Ready Outputs</div>
              </div>
            </div>
          </div>
        </section>

        {/* How it Works Section */}
        <section id="how-it-works" className="w-full py-32 bg-slate-900 text-white relative">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center space-y-6 mb-24">
               <Badge className="bg-primary/20 text-primary border-none font-black text-xs uppercase tracking-[0.3em] px-4 py-1">The Study Cycle</Badge>
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter font-headline">From Raw to Ready.</h2>
              <p className="text-slate-400 text-xl font-medium max-w-2xl mx-auto">One tool for your entire exam preparation journey.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative">
              <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-white/5 hidden md:block" />
              {[
                { step: "01", title: "Paste or Upload", desc: "Drop your raw textbook notes or PDF scans into the workspace.", icon: Zap },
                { step: "02", title: "Select Prep Tool", icon: Layers, desc: "Choose whether you need a Summary, Exam Answer, Questions, or Revision Sheet." },
                { step: "03", title: "Ace Your Exam", icon: GraduationCap, desc: "Get formatted, high-scoring material designed for Indian university standards." }
              ].map((item, i) => (
                <div key={i} className="relative space-y-8 p-12 bg-white/5 rounded-[3rem] border border-white/10 backdrop-blur-sm group hover:bg-white/10 transition-colors">
                  <div className="h-16 w-16 bg-primary rounded-2xl flex items-center justify-center text-white shadow-xl shadow-primary/20 mb-6">
                    <item.icon className="h-8 w-8" />
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-3xl font-black font-headline tracking-tight">{item.title}</h3>
                    <p className="text-slate-400 leading-relaxed text-lg font-medium">{item.desc}</p>
                  </div>
                  <div className="text-6xl font-black text-white/5 absolute bottom-8 right-8">{item.step}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Comparison Section */}
        <section className="w-full py-32 bg-white overflow-hidden">
          <div className="container px-4 md:px-6 mx-auto">
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                <div className="space-y-10">
                   <h2 className="text-5xl md:text-7xl font-black font-headline tracking-tight leading-[0.9]">Why StudyPilot <br /><span className="text-primary">over ChatGPT?</span></h2>
                   <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-lg">ChatGPT is a generic writer. StudyPilot is a specialized study assistant that understands university marking schemes and student memory patterns.</p>
                   <ul className="space-y-6">
                      {[
                        "Structured for Indian Semester Patterns",
                        "Automatic Exam Answer Formatting",
                        "Predicted 2, 5, and 10 Mark Questions",
                        "One-Click Revision Mnemonics",
                        "Subject-Specific Academic Tone"
                      ].map((item, i) => (
                        <li key={i} className="flex gap-4 items-center text-lg font-bold text-slate-700">
                          <CheckCircle2 className="h-6 w-6 text-primary shrink-0" /> {item}
                        </li>
                      ))}
                   </ul>
                </div>
                <div className="relative">
                   <div className="absolute -inset-4 bg-primary/10 rounded-[3rem] blur-3xl opacity-30" />
                   <div className="relative bg-slate-50 border-8 border-white shadow-2xl rounded-[3rem] p-10 space-y-8">
                      <div className="flex gap-3 items-center border-b pb-6">
                         <div className="h-10 w-10 bg-primary rounded-xl" />
                         <div className="space-y-0.5">
                            <p className="font-black text-sm">StudyPilot Output</p>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">University Grade</p>
                         </div>
                      </div>
                      <div className="space-y-4">
                         <div className="h-3 w-1/2 bg-slate-200 rounded-full" />
                         <div className="h-20 w-full bg-slate-100 rounded-2xl" />
                         <div className="grid grid-cols-3 gap-2">
                            <div className="h-10 bg-primary/10 rounded-xl" />
                            <div className="h-10 bg-primary/10 rounded-xl" />
                            <div className="h-10 bg-primary/10 rounded-xl" />
                         </div>
                      </div>
                      <div className="pt-4 flex justify-center">
                         <Badge className="bg-primary text-white font-black px-6 py-2 rounded-full">99% Student Satisfaction</Badge>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </section>

        {/* Feature Grid */}
        <section id="features" className="w-full py-32 bg-slate-50">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center space-y-6 mb-24">
              <h2 className="text-5xl md:text-8xl font-black tracking-tighter font-headline">The Prep Suite.</h2>
              <p className="text-xl text-slate-500 font-medium max-w-xl mx-auto">Four tools specifically designed to save you hours of manual work every semester.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { title: "Summarizer", icon: Zap, desc: "Quick summaries, exam notes, and key terms for fast comprehension." },
                { title: "Exam Answers", icon: BookOpen, desc: "Intro-Body-Conclusion format optimized for scoring university marks." },
                { title: "Important Qs", icon: AlertCircle, desc: "Predicted 2, 5, and 10 mark questions with viva/oral prep." },
                { title: "Revision Sheets", icon: Layers, desc: "One-page dense revision packs with memory mnemonics and checklists." }
              ].map((feature, i) => (
                <Card key={i} className="border-none shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all rounded-[3rem] p-8 group bg-white">
                  <div className="p-6 w-fit rounded-[2rem] bg-primary/10 text-primary mb-8 group-hover:bg-primary group-hover:text-white transition-colors">
                    <feature.icon className="h-10 w-10" />
                  </div>
                  <h3 className="font-headline font-black text-2xl tracking-tight mb-4">{feature.title}</h3>
                  <p className="text-slate-500 font-medium leading-relaxed text-lg">{feature.desc}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="w-full py-32 bg-white">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center space-y-6 mb-24">
              <h2 className="text-5xl md:text-8xl font-black tracking-tighter font-headline leading-[0.9]">Study Smarter, <br /><span className="text-primary">Not Harder.</span></h2>
              <p className="text-xl text-slate-500 font-medium">Affordable pricing for students. India-focused value.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
              {/* Free */}
              <Card className="flex flex-col border-2 border-slate-50 bg-slate-50/50 rounded-[3rem] p-10 text-slate-900">
                <div className="space-y-4 mb-10">
                  <Badge className="bg-slate-200 text-slate-600 border-none font-black text-[10px] tracking-widest px-4 py-1">STARTER</Badge>
                  <div className="flex items-baseline gap-1">
                    <span className="text-6xl font-black tracking-tight">₹0</span>
                    <span className="text-slate-400 font-bold text-lg">/mo</span>
                  </div>
                </div>
                <ul className="flex-1 space-y-4 font-bold text-slate-500 text-sm">
                  <li className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-primary" /> 5 generations / day</li>
                  <li className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-primary" /> Basic tools access</li>
                  <li className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-primary" /> Standard formatting</li>
                </ul>
                <Button variant="outline" className="w-full h-16 rounded-2xl border-2 font-black text-lg mt-10" asChild>
                  <Link href="/dashboard">Start Studying</Link>
                </Button>
              </Card>

              {/* Pro */}
              <Card className="flex flex-col border-4 border-primary bg-white rounded-[3.5rem] p-12 text-slate-900 shadow-2xl relative scale-105 z-10 overflow-hidden">
                <div className="absolute top-0 right-0 bg-primary text-white px-10 py-3 text-xs font-black rounded-bl-[2rem] uppercase tracking-[0.2em]">MOST POPULAR</div>
                <div className="space-y-4 mb-10">
                  <Badge className="bg-primary/10 text-primary border-none font-black text-[10px] tracking-widest px-4 py-1">PRO PACK</Badge>
                  <div className="flex items-baseline gap-1">
                    <span className="text-7xl font-black tracking-tight text-primary">₹99</span>
                    <span className="text-slate-400 font-bold text-xl">/mo</span>
                  </div>
                </div>
                <ul className="flex-1 space-y-5 font-bold text-slate-700">
                  <li className="flex items-center gap-3"><CheckCircle2 className="h-6 w-6 text-primary" /> Unlimited generations</li>
                  <li className="flex items-center gap-3"><CheckCircle2 className="h-6 w-6 text-primary" /> Advanced Chaining Tools</li>
                  <li className="flex items-center gap-3"><CheckCircle2 className="h-6 w-6 text-primary" /> Clean Watermark-free PDFs</li>
                  <li className="flex items-center gap-3"><CheckCircle2 className="h-6 w-6 text-primary" /> Priority Study Support</li>
                </ul>
                <Button className="w-full h-20 rounded-[1.8rem] bg-primary hover:bg-primary/90 shadow-2xl shadow-primary/20 font-black text-xl mt-12" asChild>
                  <Link href="/dashboard/billing">Go Pro Now</Link>
                </Button>
              </Card>

              {/* Premium */}
              <Card className="flex flex-col border-2 border-slate-50 bg-slate-50/50 rounded-[3rem] p-10 text-slate-900">
                <div className="space-y-4 mb-10">
                  <Badge className="bg-amber-100 text-amber-600 border-none font-black text-[10px] tracking-widest px-4 py-1">ELITE PREP</Badge>
                  <div className="flex items-baseline gap-1">
                    <span className="text-6xl font-black tracking-tight">₹199</span>
                    <span className="text-slate-400 font-bold text-lg">/mo</span>
                  </div>
                </div>
                <ul className="flex-1 space-y-4 font-bold text-slate-500 text-sm">
                  <li className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-primary" /> Everything in Pro</li>
                  <li className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-primary" /> Exam Booster Mode</li>
                  <li className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-primary" /> Future Batch Uploads</li>
                  <li className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-primary" /> Priority Beta Features</li>
                </ul>
                <Button variant="outline" className="w-full h-16 rounded-2xl border-2 font-black text-lg mt-10" asChild>
                  <Link href="/dashboard/billing">Get Elite</Link>
                </Button>
              </Card>
            </div>
            <p className="text-center mt-12 text-slate-400 font-bold flex items-center justify-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" /> Secure Payments. No hidden charges. Cancel anytime.
            </p>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="w-full py-32 bg-slate-50">
          <div className="container px-4 md:px-6 mx-auto max-w-4xl">
            <h2 className="text-5xl font-black font-headline tracking-tighter text-center mb-20">Frequently Asked</h2>
            <div className="space-y-6">
               {[
                 { q: "Is it actually better than asking AI directly?", a: "Yes. StudyPilot uses specialized academic prompting frameworks that understand Indian university structures. You get structured exam material, not just text." },
                 { q: "Can I upload my hand-written notes?", a: "You can upload high-quality PDF scans. For best results, ensure the text is readable and clear." },
                 { q: "Is the free plan really free?", a: "Yes. You get 5 generations every single day for free. No credit card required." },
                 { q: "What happens after I pay?", a: "Your account is immediately upgraded to Pro. You get unlimited generations and unlock advanced study features instantly." }
               ].map((item, i) => (
                 <div key={i} className="p-8 bg-white rounded-[2.5rem] shadow-sm space-y-3">
                   <h4 className="text-xl font-black font-headline">{item.q}</h4>
                   <p className="text-slate-600 font-medium leading-relaxed">{item.a}</p>
                 </div>
               ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="w-full py-32 bg-primary text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-slate-900/10 pointer-events-none" />
          <div className="container px-4 md:px-6 mx-auto relative z-10 space-y-10">
            <h2 className="text-5xl md:text-8xl font-black tracking-tighter font-headline leading-tight">Prepare for Your <br />Exams Smarter.</h2>
            <p className="text-xl md:text-2xl font-bold opacity-80 max-w-2xl mx-auto">Join thousands of students who have stopped making manual notes and started scoring better.</p>
            <div className="flex flex-col sm:flex-row gap-5 justify-center">
               <Button asChild size="lg" className="h-20 px-16 text-2xl font-black rounded-3xl bg-white text-primary hover:bg-slate-50 shadow-2xl">
                 <Link href="/dashboard">Get Started Free</Link>
               </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-20 bg-white">
        <div className="container flex flex-col items-center justify-between gap-12 md:flex-row mx-auto px-6">
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary rounded-xl">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <span className="font-headline font-black text-xl tracking-tighter">StudyPilot AI</span>
            </div>
            <p className="text-sm text-slate-500 font-bold max-w-xs text-center md:text-left">The ultimate study assistant for Indian university students. © 2024</p>
          </div>
          <div className="flex flex-wrap justify-center gap-12">
            <div className="space-y-4">
               <p className="font-black text-sm uppercase tracking-widest text-slate-400">Legal</p>
               <ul className="space-y-2 font-bold text-slate-600 text-sm">
                 <li><Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                 <li><Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                 <li><Link href="#" className="hover:text-primary transition-colors">Refunds</Link></li>
               </ul>
            </div>
            <div className="space-y-4">
               <p className="font-black text-sm uppercase tracking-widest text-slate-400">Product</p>
               <ul className="space-y-2 font-bold text-slate-600 text-sm">
                 <li><Link href="#pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
                 <li><Link href="#features" className="hover:text-primary transition-colors">Tools</Link></li>
                 <li><Link href="/dashboard" className="hover:text-primary transition-colors">Workspace</Link></li>
               </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}


import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, GraduationCap, Zap, BookOpen, Clock, Users, ArrowRight, ShieldCheck, Sparkles, Star, TrendingUp, Layers } from "lucide-react";
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
                <TrendingUp className="h-3.5 w-3.5" /> Built for Indian Semester Exams
              </div>
              <h1 className="text-6xl font-headline font-black tracking-tighter sm:text-7xl md:text-8xl lg:text-9xl leading-[0.9] text-slate-900">
                Notes into <span className="text-primary italic">Exam Answers</span> In Seconds.
              </h1>
              <p className="mx-auto max-w-3xl text-slate-500 text-lg md:text-2xl font-medium leading-relaxed">
                The ultimate AI-powered study companion. Generate structured answers, revision sheets, and probable exam questions from your raw notes instantly.
              </p>
              <div className="flex flex-col sm:flex-row gap-5 justify-center pt-8">
                <Button asChild size="lg" className="h-18 px-12 text-xl font-black rounded-2xl shadow-2xl shadow-primary/20 hover:scale-105 transition-all group bg-primary">
                  <Link href="/dashboard">
                    Get Started Free <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="h-18 px-12 text-xl font-black rounded-2xl border-2 hover:bg-slate-50 shadow-sm">
                  <Link href="#pricing">View Pricing</Link>
                </Button>
              </div>

              <div className="pt-20 flex flex-wrap justify-center gap-12 opacity-40 grayscale pointer-events-none">
                 <div className="font-black text-2xl tracking-tighter flex items-center gap-2"><Layers className="h-6 w-6" /> 10K+ Generates</div>
                 <div className="font-black text-2xl tracking-tighter flex items-center gap-2"><Users className="h-6 w-6" /> 500+ Students</div>
                 <div className="font-black text-2xl tracking-tighter flex items-center gap-2"><Zap className="h-6 w-6" /> 99% Accuracy</div>
              </div>
            </div>
          </div>
        </section>

        {/* How it Works Section */}
        <section id="how-it-works" className="w-full py-32 bg-slate-900 text-white relative">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center space-y-6 mb-24">
               <Badge className="bg-primary/20 text-primary border-none font-black text-xs uppercase tracking-[0.3em] px-4 py-1">The Process</Badge>
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter font-headline">From Raw to Ready.</h2>
              <p className="text-slate-400 text-xl font-medium max-w-2xl mx-auto">Stop wasting hours summarizing. Focus on understanding while StudyPilot handles the structure.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative">
              <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-white/5 hidden md:block" />
              {[
                { step: "01", title: "Paste or Upload", desc: "Drop your textbook notes, PDFs, or raw paragraphs into the Pilot Workspace.", icon: Zap },
                { step: "02", title: "Select Study Tool", icon: Layers, desc: "Choose whether you need a Summary, Exam Answer, Questions, or a Revision Sheet." },
                { step: "03", title: "Ace the Exam", icon: GraduationCap, desc: "Get formatted, high-quality material specifically designed for quick memorization." }
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

        {/* Core Tools Grid */}
        <section id="features" className="w-full py-32 bg-white">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-24">
              <div className="space-y-6 text-center md:text-left">
                <h2 className="text-5xl md:text-8xl font-black tracking-tighter font-headline leading-[0.9]">Built for Your <br /><span className="text-primary">Semester Prep.</span></h2>
              </div>
              <p className="max-w-md text-slate-500 text-xl font-medium md:pb-4 text-center md:text-left">A suite of AI tools designed specifically for the way Indian college students study.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { title: "Smart Summary", icon: Zap, desc: "Condense long chapters into 3-line summaries and clear bullet points." },
                { title: "Exam Answers", icon: BookOpen, desc: "Intro-Body-Conclusion format optimized for scoring 10/10 marks." },
                { title: "Predict Questions", icon: Clock, desc: "Probable 2-mark, 5-mark, and 10-mark questions based on your notes." },
                { title: "Revision Sheets", icon: Layers, desc: "One-page dense revision notes with mnemonics for last-minute cramming." }
              ].map((feature, i) => (
                <Card key={i} className="border-2 border-slate-50 shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all rounded-[2.5rem] p-6 group">
                  <CardHeader className="p-0 mb-6">
                    <div className="p-5 w-fit rounded-[1.5rem] bg-primary/10 text-primary mb-4 shadow-sm group-hover:bg-primary group-hover:text-white transition-colors">
                      <feature.icon className="h-10 w-10" />
                    </div>
                    <CardTitle className="font-headline font-black text-2xl tracking-tight">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <p className="text-slate-500 font-medium leading-relaxed text-lg">{feature.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Preview */}
        <section id="pricing" className="w-full py-32 bg-slate-50 relative overflow-hidden">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center space-y-6 mb-24">
              <h2 className="text-5xl md:text-8xl font-black tracking-tighter font-headline">Pricing for <br />Every Student.</h2>
              <p className="max-w-xl mx-auto text-slate-500 text-xl font-medium">No hidden fees. Cancel anytime. Indian student pricing.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
              {/* Free */}
              <Card className="flex flex-col border-2 border-white bg-white/70 backdrop-blur-md rounded-[2.5rem] p-8 text-slate-900 shadow-xl shadow-slate-200/50">
                <CardHeader className="space-y-4">
                  <CardTitle className="text-2xl font-black font-headline">Free Plan</CardTitle>
                  <div className="flex items-baseline gap-1 pt-4">
                    <span className="text-6xl font-black tracking-tight">₹0</span>
                    <span className="text-slate-400 font-bold text-lg">/mo</span>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 space-y-6 pt-10">
                  <ul className="space-y-4 font-bold text-slate-500">
                    <li className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-primary" /> 5 generations / day</li>
                    <li className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-primary" /> Basic tools access</li>
                    <li className="flex items-center gap-3 opacity-30"><CheckCircle2 className="h-5 w-5" /> Export as PDF</li>
                  </ul>
                </CardContent>
                <Button variant="outline" className="w-full h-16 rounded-2xl border-2 font-black text-lg mt-10 hover:bg-slate-50" asChild>
                  <Link href="/dashboard">Start Studying</Link>
                </Button>
              </Card>

              {/* Pro */}
              <Card className="flex flex-col border-4 border-primary bg-white rounded-[3rem] p-10 text-slate-900 shadow-2xl shadow-primary/10 relative scale-110 z-10 overflow-hidden">
                <div className="absolute top-0 right-0 bg-primary text-white px-8 py-2 text-xs font-black rounded-bl-[1.5rem] uppercase tracking-[0.2em]">MOST POPULAR</div>
                <CardHeader className="space-y-4">
                  <CardTitle className="text-3xl font-black font-headline text-primary flex items-center gap-2">Study Pro <Star className="h-6 w-6 fill-primary" /></CardTitle>
                  <div className="flex items-baseline gap-1 pt-4">
                    <span className="text-7xl font-black tracking-tight">₹99</span>
                    <span className="text-slate-400 font-bold text-xl">/mo</span>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 space-y-6 pt-10">
                  <ul className="space-y-4 font-bold text-slate-700">
                    <li className="flex items-center gap-3"><CheckCircle2 className="h-6 w-6 text-primary" /> Unlimited generations</li>
                    <li className="flex items-center gap-3"><CheckCircle2 className="h-6 w-6 text-primary" /> Watermark-free PDFs</li>
                    <li className="flex items-center gap-3"><CheckCircle2 className="h-6 w-6 text-primary" /> Advanced Formatting</li>
                    <li className="flex items-center gap-3"><CheckCircle2 className="h-6 w-6 text-primary" /> Subject Awareness</li>
                  </ul>
                </CardContent>
                <Button className="w-full h-18 rounded-2xl bg-primary hover:bg-primary/90 shadow-2xl shadow-primary/20 font-black text-xl mt-10" asChild>
                  <Link href="/dashboard/billing">Go Pro Now</Link>
                </Button>
              </Card>

              {/* Premium */}
              <Card className="flex flex-col border-2 border-white bg-white/70 backdrop-blur-md rounded-[2.5rem] p-8 text-slate-900 shadow-xl shadow-slate-200/50">
                <CardHeader className="space-y-4">
                  <CardTitle className="text-2xl font-black font-headline">Elite Prep</CardTitle>
                  <div className="flex items-baseline gap-1 pt-4">
                    <span className="text-6xl font-black tracking-tight">₹199</span>
                    <span className="text-slate-400 font-bold text-lg">/mo</span>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 space-y-6 pt-10">
                  <ul className="space-y-4 font-bold text-slate-500">
                    <li className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-primary" /> Everything in Pro</li>
                    <li className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-primary" /> Exam Booster Mode</li>
                    <li className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-primary" /> 24/7 Priority Prep</li>
                  </ul>
                </CardContent>
                <Button variant="outline" className="w-full h-16 rounded-2xl border-2 font-black text-lg mt-10 hover:bg-slate-50" asChild>
                  <Link href="/dashboard/billing">Get Elite</Link>
                </Button>
              </Card>
            </div>
            
            <div className="mt-24 text-center space-y-4">
               <p className="text-slate-500 font-bold flex items-center justify-center gap-2">
                 <ShieldCheck className="h-5 w-5 text-primary" /> Secure Payments via Razorpay
               </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="w-full py-32 bg-white">
          <div className="container px-4 md:px-6 mx-auto max-w-4xl">
            <h2 className="text-5xl font-black font-headline tracking-tighter text-center mb-20">Common Questions</h2>
            <div className="space-y-8">
               {[
                 { q: "Is there a truly free plan?", a: "Yes, our free plan includes 5 generations per day, resetting at midnight IST. No credit card required." },
                 { q: "Can I upload PDF textbooks?", a: "Absolutely. You can upload PDFs or text files, and our AI will extract the core concepts for processing." },
                 { q: "Is this useful for semester exams?", a: "Specifically built for it. The Exam Answer generator uses an academic structure that teachers love to grade." },
                 { q: "Can I cancel my subscription?", a: "Yes, any time. Your Pro features will remain active until the end of your billing cycle." }
               ].map((item, i) => (
                 <div key={i} className="p-8 bg-slate-50 rounded-[2rem] space-y-3">
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
            <h2 className="text-5xl md:text-8xl font-black tracking-tighter font-headline leading-tight">Ready to Ace Your <br />Semester?</h2>
            <p className="text-xl md:text-2xl font-bold opacity-80 max-w-2xl mx-auto">Join 500+ students transforming their study habits with StudyPilot AI.</p>
            <div className="flex flex-col sm:flex-row gap-5 justify-center">
               <Button asChild size="lg" className="h-20 px-16 text-2xl font-black rounded-3xl bg-white text-primary hover:bg-slate-50 shadow-2xl">
                 <Link href="/dashboard">Create Account Free</Link>
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
            <p className="text-sm text-slate-500 font-bold max-w-xs text-center md:text-left">Building the future of academic success for students across India. © 2024</p>
          </div>
          <div className="flex flex-wrap justify-center gap-12">
            <div className="space-y-4">
               <p className="font-black text-sm uppercase tracking-widest text-slate-400">Legal</p>
               <ul className="space-y-2 font-bold text-slate-600 text-sm">
                 <li><Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                 <li><Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                 <li><Link href="#" className="hover:text-primary transition-colors">Refund Policy</Link></li>
               </ul>
            </div>
            <div className="space-y-4">
               <p className="font-black text-sm uppercase tracking-widest text-slate-400">Support</p>
               <ul className="space-y-2 font-bold text-slate-600 text-sm">
                 <li><Link href="#" className="hover:text-primary transition-colors">Contact Us</Link></li>
                 <li><Link href="#" className="hover:text-primary transition-colors">Help Center</Link></li>
               </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

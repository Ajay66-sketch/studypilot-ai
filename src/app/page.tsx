
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, GraduationCap, Zap, BookOpen, Clock, Users, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import Image from "next/image";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen selection:bg-primary/20 selection:text-primary">
      <header className="px-6 lg:px-12 h-20 flex items-center border-b bg-white/70 backdrop-blur-xl sticky top-0 z-50">
        <Link className="flex items-center justify-center space-x-3" href="/">
          <div className="p-2 bg-primary rounded-xl shadow-lg shadow-primary/20">
            <GraduationCap className="h-8 w-8 text-white" />
          </div>
          <span className="font-headline font-black text-2xl tracking-tighter text-slate-900">StudyPilot AI</span>
        </Link>
        <nav className="ml-auto flex gap-6 md:gap-8 items-center">
          <Link className="hidden md:block text-sm font-bold text-slate-600 hover:text-primary transition-colors" href="#features">Features</Link>
          <Link className="hidden md:block text-sm font-bold text-slate-600 hover:text-primary transition-colors" href="#how-it-works">How it works</Link>
          <Link className="hidden md:block text-sm font-bold text-slate-600 hover:text-primary transition-colors" href="#pricing">Pricing</Link>
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" className="font-bold text-slate-700">
              <Link href="/dashboard">Login</Link>
            </Button>
            <Button asChild className="rounded-xl font-bold shadow-lg shadow-primary/20 px-6">
              <Link href="/dashboard">Get Started</Link>
            </Button>
          </div>
        </nav>
      </header>

      <main className="flex-1">
        <section className="w-full py-20 md:py-32 lg:py-44 bg-gradient-to-b from-slate-50 to-white overflow-hidden">
          <div className="container px-4 md:px-6 mx-auto text-center relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/5 blur-[120px] rounded-full -z-10" />
            
            <div className="space-y-8 max-w-5xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-black uppercase tracking-widest animate-in fade-in slide-in-from-top-4 duration-1000">
                <Sparkles className="h-4 w-4" /> Built for Indian Students
              </div>
              <h1 className="text-5xl font-headline font-black tracking-tight sm:text-6xl md:text-7xl lg:text-8xl leading-[1.1] text-slate-900">
                Turn Notes Into <span className="text-primary italic">Exam Answers</span> in Seconds
              </h1>
              <p className="mx-auto max-w-2xl text-slate-500 md:text-xl font-medium leading-relaxed">
                The ultimate AI-powered study companion. Generate revision sheets, summaries, and probable exam questions from your raw notes instantly.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                <Button asChild size="lg" className="h-16 px-10 text-lg font-black rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 transition-transform group">
                  <Link href="/dashboard">
                    Try for Free <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="h-16 px-10 text-lg font-black rounded-2xl border-2 hover:bg-slate-50">
                  <Link href="#how-it-works">How it works</Link>
                </Button>
              </div>
            </div>
            <div className="mt-20 relative mx-auto max-w-6xl rounded-[2.5rem] border-4 border-white shadow-2xl overflow-hidden bg-white ring-1 ring-slate-200">
              <Image 
                src="https://picsum.photos/seed/studydash/1400/800" 
                alt="StudyPilot Dashboard Preview" 
                width={1400} 
                height={800}
                className="w-full h-auto"
                data-ai-hint="dashboard study"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/10 to-transparent" />
            </div>
          </div>
        </section>

        <section id="how-it-works" className="w-full py-24 bg-slate-50">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center space-y-4 mb-20">
              <h2 className="text-4xl md:text-5xl font-black tracking-tight font-headline">How it Works</h2>
              <p className="text-slate-500 text-lg font-medium">Ace your exams in 3 simple steps.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                { step: "01", title: "Paste or Upload", desc: "Drop your textbook notes, raw paragraphs, or even a PDF/TXT file into the workspace." },
                { step: "02", title: "Select a Tool", desc: "Choose whether you need a Summary, Exam Answers, Probable Questions, or a Revision Sheet." },
                { step: "03", title: "Master the Topic", desc: "Get AI-generated, high-quality material formatted specifically for quick learning and memorization." }
              ].map((item, i) => (
                <div key={i} className="relative space-y-4 p-8 bg-white rounded-[2rem] shadow-sm border border-slate-100">
                  <div className="text-5xl font-black text-primary/10 font-headline mb-4">{item.step}</div>
                  <h3 className="text-2xl font-black font-headline">{item.title}</h3>
                  <p className="text-slate-500 leading-relaxed font-medium">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-24 md:py-32 bg-white">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center space-y-4 mb-20">
              <h2 className="text-4xl font-black tracking-tight sm:text-5xl md:text-6xl font-headline">Built for College Students</h2>
              <p className="max-w-2xl mx-auto text-slate-500 md:text-xl font-medium">Stop wasting hours summarizing. Focus on understanding the concepts while Pilot handles the structure.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { title: "Smart Summary", icon: Zap, desc: "Condense long paragraphs into concise bullet points and key concepts." },
                { title: "Exam Answers", icon: BookOpen, desc: "Transform any topic into a structured exam-ready answer with intro and conclusion." },
                { title: "Probable Questions", icon: Clock, desc: "Get AI-generated 2-mark, 5-mark, and 10-mark questions based on your notes." },
                { title: "Revision Sheets", icon: Users, desc: "Create one-page revision sheets for last-minute cramming sessions." }
              ].map((feature, i) => (
                <Card key={i} className="border-2 border-slate-50 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all rounded-3xl p-4">
                  <CardHeader>
                    <div className="p-4 w-fit rounded-2xl bg-primary/10 text-primary mb-2 shadow-sm">
                      <feature.icon className="h-8 w-8" />
                    </div>
                    <CardTitle className="font-headline font-black text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-500 font-medium leading-relaxed">{feature.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="w-full py-24 md:py-32 bg-slate-900 text-white">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center space-y-4 mb-20">
              <h2 className="text-4xl md:text-5xl font-black tracking-tight font-headline">Unbeatable Pricing</h2>
              <p className="max-w-[600px] mx-auto text-slate-400 text-lg font-medium">Specifically priced for the Indian student budget.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Card className="flex flex-col border-2 border-white/10 bg-white/5 rounded-[2.5rem] p-4 text-white">
                <CardHeader>
                  <CardTitle className="text-2xl font-black font-headline">Free Plan</CardTitle>
                  <div className="flex items-baseline gap-1 pt-6">
                    <span className="text-6xl font-black">₹0</span>
                    <span className="text-slate-400 font-bold">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 space-y-4 pt-6">
                  <ul className="space-y-4 font-medium text-slate-300">
                    <li className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-primary" /> 5 requests per day</li>
                    <li className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-primary" /> Basic AI models</li>
                    <li className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-primary" /> Mobile access</li>
                  </ul>
                </CardContent>
                <div className="p-6 pt-0 mt-auto">
                  <Button variant="outline" className="w-full h-14 rounded-2xl border-white/20 text-white hover:bg-white hover:text-black font-black" asChild>
                    <Link href="/dashboard">Get Started Free</Link>
                  </Button>
                </div>
              </Card>
              <Card className="flex flex-col border-2 border-primary bg-primary/10 relative overflow-hidden rounded-[2.5rem] p-4 text-white">
                <div className="absolute top-0 right-0 bg-primary text-white px-6 py-2 text-xs font-black rounded-bl-3xl uppercase tracking-widest">MOST POPULAR</div>
                <CardHeader>
                  <CardTitle className="text-2xl font-black font-headline">Pro Monthly</CardTitle>
                  <div className="flex items-baseline gap-1 pt-6">
                    <span className="text-6xl font-black">₹99</span>
                    <span className="text-primary font-bold">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 space-y-4 pt-6">
                  <ul className="space-y-4 font-medium">
                    <li className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-primary" /> Unlimited usage</li>
                    <li className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-primary" /> Gemini 2.5 Flash Speed</li>
                    <li className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-primary" /> Premium AI models</li>
                    <li className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-primary" /> High-quality Exports</li>
                  </ul>
                </CardContent>
                <div className="p-6 pt-0 mt-auto">
                  <Button className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 font-black text-white" asChild>
                    <Link href="/dashboard">Upgrade to Pro</Link>
                  </Button>
                </div>
              </Card>
            </div>
            
            <div className="mt-20 text-center flex flex-col items-center gap-4">
              <div className="flex items-center gap-2 text-slate-400 font-bold">
                <ShieldCheck className="h-5 w-5 text-primary" />
                Payments processed via Razorpay Secure
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-12 bg-white">
        <div className="container flex flex-col items-center justify-between gap-8 md:flex-row mx-auto px-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-xl">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <p className="text-sm text-slate-500 font-bold">© 2024 StudyPilot AI. Made for students in India.</p>
          </div>
          <div className="flex gap-8">
            <Link className="text-sm font-bold text-slate-600 hover:text-primary" href="#">Terms</Link>
            <Link className="text-sm font-bold text-slate-600 hover:text-primary" href="#">Privacy</Link>
            <Link className="text-sm font-bold text-slate-600 hover:text-primary" href="#">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

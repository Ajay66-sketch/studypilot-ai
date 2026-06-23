import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, GraduationCap, Zap, BookOpen, Clock, Users } from "lucide-react";
import Image from "next/image";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <Link className="flex items-center justify-center space-x-2" href="/">
          <GraduationCap className="h-8 w-8 text-primary" />
          <span className="font-headline font-bold text-xl tracking-tight">StudyPilot AI</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
          <Link className="text-sm font-medium hover:text-primary transition-colors" href="#features">Features</Link>
          <Link className="text-sm font-medium hover:text-primary transition-colors" href="#pricing">Pricing</Link>
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard">Login</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/dashboard">Get Started</Link>
          </Button>
        </nav>
      </header>

      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-white to-slate-50">
          <div className="container px-4 md:px-6 mx-auto text-center">
            <div className="space-y-4 max-w-3xl mx-auto">
              <h1 className="text-4xl font-headline font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                Turn Your Notes Into <span className="text-primary">Exam Answers</span> in Seconds
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl font-body">
                The ultimate AI-powered study companion. Generate revision sheets, summaries, and probable exam questions from your raw notes instantly.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                <Button asChild size="lg" className="h-12 px-8 text-lg rounded-full">
                  <Link href="/dashboard">Try for Free</Link>
                </Button>
                <Button variant="outline" size="lg" className="h-12 px-8 text-lg rounded-full">
                  <Link href="#demo">See how it works</Link>
                </Button>
              </div>
            </div>
            <div className="mt-16 relative mx-auto max-w-5xl rounded-2xl border shadow-2xl overflow-hidden bg-white">
              <Image 
                src="https://picsum.photos/seed/studydash/1200/675" 
                alt="StudyPilot Dashboard Preview" 
                width={1200} 
                height={675}
                className="w-full h-auto"
                data-ai-hint="dashboard workspace"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline">Built for Busy Students</h2>
              <p className="max-w-[800px] mx-auto text-muted-foreground md:text-xl">Study Pilot handles the heavy lifting of summarization and prep, so you can focus on learning.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { title: "Smart Summary", icon: Zap, desc: "Condense long paragraphs into concise bullet points and key concepts." },
                { title: "Exam Answers", icon: BookOpen, desc: "Transform any topic into a structured exam-ready answer with intro and conclusion." },
                { title: "Probable Questions", icon: Clock, desc: "Get AI-generated 2-mark, 5-mark, and 10-mark questions based on your notes." },
                { title: "Revision Sheets", icon: Users, desc: "Create one-page revision sheets for last-minute cramming sessions." }
              ].map((feature, i) => (
                <Card key={i} className="border-none shadow-md hover:shadow-lg transition-all bg-slate-50">
                  <CardHeader>
                    <div className="p-3 w-fit rounded-xl bg-primary/10 text-primary mb-2">
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="font-headline">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="w-full py-12 md:py-24 lg:py-32 bg-slate-50">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline">Simple Pricing</h2>
              <p className="max-w-[600px] mx-auto text-muted-foreground md:text-xl">Start for free, upgrade when you need more power.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Card className="flex flex-col border-2 border-transparent">
                <CardHeader>
                  <CardTitle className="text-xl">Free Plan</CardTitle>
                  <div className="flex items-baseline gap-1 pt-4">
                    <span className="text-4xl font-bold">₹0</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 space-y-4">
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> 5 requests per day</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Basic AI models</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Mobile access</li>
                  </ul>
                </CardContent>
                <div className="p-6 pt-0 mt-auto">
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/dashboard">Current Plan</Link>
                  </Button>
                </div>
              </Card>
              <Card className="flex flex-col border-2 border-primary relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-bold rounded-bl-lg">POPULAR</div>
                <CardHeader>
                  <CardTitle className="text-xl">Pro Plan</CardTitle>
                  <div className="flex items-baseline gap-1 pt-4">
                    <span className="text-4xl font-bold">₹99</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 space-y-4">
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Unlimited usage</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Faster response times</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Premium AI models</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Watermark-free exports</li>
                  </ul>
                </CardContent>
                <div className="p-6 pt-0 mt-auto">
                  <Button className="w-full" asChild>
                    <Link href="/dashboard?upgrade=true">Upgrade to Pro</Link>
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-6 md:py-0 bg-white">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row mx-auto px-4 md:px-6">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-primary" />
            <p className="text-sm text-muted-foreground font-medium">© 2024 StudyPilot AI. All rights reserved.</p>
          </div>
          <div className="flex gap-4 sm:gap-6">
            <Link className="text-sm hover:underline underline-offset-4" href="#">Terms</Link>
            <Link className="text-sm hover:underline underline-offset-4" href="#">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

function LoginForm() {
  const { user, loading, loginWithGoogle, loginWithEmail, registerWithEmail } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  const nextParam = searchParams.get("next");
  const isSafeNext = nextParam && nextParam.startsWith("/") && !nextParam.startsWith("//") && !nextParam.startsWith("/\\");
  const next = (isSafeNext && nextParam !== "/login") ? nextParam : "/dashboard";

  // Redirect if already logged in
  useEffect(() => {
    if (!loading && user) {
      router.push(next);
    }
  }, [user, loading, next, router]);

  const handleGoogleLogin = async () => {
    toast({
      title: "Email Auth Active",
      description: "Please sign in or register with your email address below.",
    });
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (isSignUp && !name)) {
      toast({
        title: "Missing fields",
        description: "Please fill out all required fields.",
        variant: "destructive",
      });
      return;
    }

    setAuthLoading(true);
    try {
      if (isSignUp) {
        await registerWithEmail(email, password, name);
        toast({ title: "Account Created", description: "Welcome to StudyPilot AI!" });
      } else {
        await loginWithEmail(email, password);
        toast({ title: "Welcome Back", description: "Successfully logged in." });
      }
    } catch (err: any) {
      toast({
        title: "Authentication Failed",
        description: err.message || "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    } finally {
      setAuthLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen w-screen flex flex-col items-center justify-center bg-slate-50 space-y-4">
        <div className="relative">
          <div className="h-16 w-16 border-4 border-primary/10 border-t-primary rounded-full animate-spin" />
          <GraduationCap className="h-6 w-6 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] animate-pulse">
          Securing session...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-white px-4 py-8">
      <Link className="flex items-center gap-2 mb-8" href="/">
        <div className="p-1.5 bg-primary rounded-lg shadow-lg shadow-primary/20">
          <GraduationCap className="h-6 w-6 text-white" />
        </div>
        <span className="font-headline font-black text-2xl tracking-tighter text-slate-900">StudyPilot AI</span>
      </Link>

      <Card className="w-full max-w-md rounded-[2.5rem] border-2 border-slate-100 shadow-xl bg-white p-4">
        <CardHeader className="space-y-2 text-center pb-6">
          <CardTitle className="text-3xl font-black font-headline tracking-tight text-slate-900">
            {isSignUp ? "Create Account" : "Welcome Back"}
          </CardTitle>
          <CardDescription className="font-bold text-slate-500 text-sm">
            {isSignUp ? "Sign up to start transforming your study notes" : "Sign in to access your study workspace"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Google SSO Button */}
          <Button
            type="button"
            variant="outline"
            className="w-full h-12 rounded-xl border-2 border-slate-100 hover:border-slate-200 font-black text-slate-700 gap-3 text-sm shadow-sm"
            onClick={handleGoogleLogin}
            disabled={authLoading}
          >
            <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </Button>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-slate-100"></div>
            <span className="flex-shrink mx-4 text-xs font-black text-slate-300 uppercase tracking-widest">or</span>
            <div className="flex-grow border-t border-slate-100"></div>
          </div>

          {/* Email Password Form */}
          <form onSubmit={handleEmailAuth} className="space-y-4">
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="name" className="font-black text-[9px] text-slate-400 uppercase tracking-widest">Your Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="e.g. Alan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="rounded-xl border-slate-100 h-11 font-bold text-sm shadow-sm"
                  disabled={authLoading}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="font-black text-[9px] text-slate-400 uppercase tracking-widest">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-11 rounded-xl border-slate-100 h-11 font-bold text-sm shadow-sm"
                  disabled={authLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pass" className="font-black text-[9px] text-slate-400 uppercase tracking-widest">Password</Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                <Input
                  id="pass"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-11 rounded-xl border-slate-100 h-11 font-bold text-sm shadow-sm"
                  disabled={authLoading}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 font-black text-sm shadow-lg shadow-primary/20 gap-2 mt-4"
              disabled={authLoading}
            >
              {authLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  {isSignUp ? "Register" : "Sign In"} <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center border-t border-slate-50 pt-6 mt-2">
          <p className="text-xs text-slate-500 font-bold">
            {isSignUp ? "Already have an account?" : "New to StudyPilot AI?"}{" "}
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-primary hover:underline font-black"
            >
              {isSignUp ? "Sign In" : "Create Account"}
            </button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen w-screen flex flex-col items-center justify-center bg-slate-50 space-y-4">
        <div className="relative">
          <div className="h-16 w-16 border-4 border-primary/10 border-t-primary rounded-full animate-spin" />
          <GraduationCap className="h-6 w-6 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] animate-pulse">
          Initializing login...
        </p>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}

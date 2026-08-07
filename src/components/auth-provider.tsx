"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { getMeApi, loginApi, registerApi, logoutApi, User } from "@/services/auth-service";
import { useRouter, usePathname } from "next/navigation";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  userData: User | null;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  registerWithEmail: (email: string, pass: string, name: string, referralCode?: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const fetchUser = async () => {
    try {
      const me = await getMeApi();
      setUser(me);
      if (!me && pathname.startsWith('/dashboard')) {
        router.push(`/login?next=${encodeURIComponent(pathname)}`);
      }
    } catch {
      setUser(null);
      if (pathname.startsWith('/dashboard')) {
        router.push(`/login?next=${encodeURIComponent(pathname)}`);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [pathname]);

  const loginWithGoogle = async () => {
    throw new Error("Google SSO is not configured in traditional full-stack mode. Use email authentication.");
  };

  const loginWithEmail = async (email: string, pass: string) => {
    const loggedInUser = await loginApi({ email, password: pass });
    setUser(loggedInUser);
    const searchParams = new URLSearchParams(window.location.search);
    const nextParam = searchParams.get('next');
    const isSafeNext = nextParam && nextParam.startsWith('/') && !nextParam.startsWith('//') && !nextParam.startsWith('/\\');
    const next = (isSafeNext && nextParam !== '/login') ? nextParam : '/dashboard';
    router.push(next);
  };

  const registerWithEmail = async (email: string, pass: string, name: string, referralCode?: string) => {
    const registeredUser = await registerApi({ email, password: pass, name, referralCode });
    setUser(registeredUser);
    const searchParams = new URLSearchParams(window.location.search);
    const nextParam = searchParams.get('next');
    const isSafeNext = nextParam && nextParam.startsWith('/') && !nextParam.startsWith('//') && !nextParam.startsWith('/\\');
    const next = (isSafeNext && nextParam !== '/login') ? nextParam : '/dashboard';
    router.push(next);
  };

  const logout = async () => {
    try {
      await logoutApi();
      setUser(null);
      router.push('/');
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, userData: user, loginWithGoogle, loginWithEmail, registerWithEmail, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

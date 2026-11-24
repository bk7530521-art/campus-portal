"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  GraduationCap,
  Mail,
  Lock,
  ArrowRight,
  Shield,
  Loader2,
  Sparkles,
  Info,
} from "lucide-react";
import { useCampus } from "@/context/CampusContext";
import { useToast } from "@/components/ui/Toast";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/dashboard";

  const { signIn, loginAsDemo, isSupabaseConnected } = useCampus();
  const { success, error } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      error("Please provide both email and password.");
      return;
    }

    setLoading(true);
    const res = await signIn(email, password);
    setLoading(false);

    if (res.error) {
      error(res.error, "Sign In Failed");
    } else {
      success(`Welcome back! Logged in as ${email}`, "Authenticated");
      const isAdmin =
        email.toLowerCase().includes("admin") ||
        email === "sarah.vance@campus.edu";
      router.push(isAdmin ? "/admin" : redirectPath);
    }
  };

  const handleQuickDemo = (role: "student" | "admin") => {
    loginAsDemo(role);
    success(
      role === "admin"
        ? "Logged in as Dean Sarah Vance (Admin)"
        : "Logged in as Alex Rivers (Student)",
      "Instant Demo Access"
    );
    router.push(role === "admin" ? "/admin" : redirectPath);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-slate-900/80 border border-slate-800 backdrop-blur-xl py-8 px-6 sm:px-10 shadow-2xl rounded-3xl"
    >
      {/* Quick 1-Click Demo Buttons */}
      <div className="mb-6 p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            Quick 1-Click Demo Mode
          </span>
          <span className="text-[10px] text-slate-500 font-mono">
            {isSupabaseConnected ? "Supabase Live" : "Local Mock"}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            type="button"
            onClick={() => handleQuickDemo("student")}
            className="py-2 px-3 rounded-xl bg-indigo-950/50 border border-indigo-800/60 hover:bg-indigo-900/60 text-xs font-medium text-indigo-200 transition-colors flex items-center justify-center gap-1.5"
          >
            <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
            Demo Student
          </button>
          <button
            type="button"
            onClick={() => handleQuickDemo("admin")}
            className="py-2 px-3 rounded-xl bg-emerald-950/50 border border-emerald-800/60 hover:bg-emerald-900/60 text-xs font-medium text-emerald-200 transition-colors flex items-center justify-center gap-1.5"
          >
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            Demo Admin
          </button>
        </div>
      </div>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-800" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-slate-900 px-2 text-slate-500 uppercase tracking-wider">
            Or sign in with email
          </span>
        </div>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="email"
            className="block text-xs font-semibold text-slate-300 mb-1.5"
          >
            Institutional Email
          </label>
          <div className="relative rounded-xl shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Mail className="h-4 w-4" />
            </div>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="student@campus.edu"
              className="block w-full pl-10 pr-3 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-xs font-semibold text-slate-300 mb-1.5"
          >
            Password
          </label>
          <div className="relative rounded-xl shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Lock className="h-4 w-4" />
            </div>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="block w-full pl-10 pr-3 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div className="flex items-center justify-between text-xs">
          <label className="flex items-center text-slate-400 select-none cursor-pointer">
            <input
              type="checkbox"
              defaultChecked
              className="rounded border-slate-700 bg-slate-900 text-indigo-500 focus:ring-indigo-500 mr-2"
            />
            Remember me
          </label>
          <span className="text-indigo-400 hover:text-indigo-300 cursor-pointer">
            Forgot password?
          </span>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-lg shadow-indigo-600/25 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all disabled:opacity-50 cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Authenticating...</span>
            </>
          ) : (
            <>
              <span>Sign In to Portal</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className="mt-6 text-center text-xs text-slate-400">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          Create student or admin profile
        </Link>
      </div>
    </motion.div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-indigo-600/20 via-emerald-600/10 to-transparent blur-[120px] rounded-full pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <Link href="/" className="flex items-center justify-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-emerald-500 p-0.5 shadow-lg shadow-indigo-600/20 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-indigo-400" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white tracking-tight">
              Campus<span className="text-emerald-400">OS</span>
            </div>
            <div className="text-xs text-slate-400">Academic Student Portal</div>
          </div>
        </Link>

        <h2 className="text-center text-2xl font-bold tracking-tight text-white">
          Sign in to your academic account
        </h2>
        <p className="mt-2 text-center text-xs text-slate-400">
          Enter your institutional credentials or use instant demo access
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <Suspense
          fallback={
            <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 text-center text-slate-400 text-xs">
              Loading login portal...
            </div>
          }
        >
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  GraduationCap,
  Shield,
  Mail,
  Lock,
  User,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { useCampus } from "@/context/CampusContext";
import { useToast } from "@/components/ui/Toast";
import { UserRole } from "@/types/database";

const AVAILABLE_PROGRAMS = [
  "B.Tech in Artificial Intelligence & Data Science",
  "M.Sc. Cybersecurity & Cloud Defense Systems",
  "Full Stack Web & Distributed Systems Diploma",
  "Executive Diploma in DevOps & SRE Cloud Infra",
  "B.Sc. Computer Engineering & Systems",
];

export default function SignupPage() {
  const router = useRouter();
  const { signUp } = useCampus();
  const { success, error } = useToast();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("student");
  const [courseName, setCourseName] = useState(AVAILABLE_PROGRAMS[0]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password) {
      error("Please fill in all required fields.");
      return;
    }

    if (password.length < 6) {
      error("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    const res = await signUp(
      email,
      password,
      fullName,
      role,
      role === "student" ? courseName : "Campus Administration"
    );
    setLoading(false);

    if (res.error) {
      error(res.error, "Registration Failed");
    } else {
      success(
        `Welcome to CampusOS, ${fullName}! Your ${role} account is ready.`,
        "Account Registered"
      );
      router.push(role === "admin" ? "/admin" : "/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-indigo-600/20 via-emerald-600/10 to-transparent blur-[130px] rounded-full pointer-events-none" />

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
            <div className="text-xs text-slate-400">New Account Registration</div>
          </div>
        </Link>

        <h2 className="text-center text-2xl font-bold tracking-tight text-white">
          Create your Campus Profile
        </h2>
        <p className="mt-2 text-center text-xs text-slate-400">
          Select your institutional role to personalize your academic dashboard
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-slate-900/80 border border-slate-800 backdrop-blur-xl py-8 px-6 sm:px-10 shadow-2xl rounded-3xl"
        >
          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Role Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Choose Institutional Role
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole("student")}
                  className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                    role === "student"
                      ? "bg-indigo-950/60 border-indigo-500 shadow-md shadow-indigo-500/10 text-white"
                      : "bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <GraduationCap
                      className={`w-5 h-5 ${
                        role === "student" ? "text-indigo-400" : "text-slate-500"
                      }`}
                    />
                    {role === "student" && (
                      <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-semibold">Student</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      Courses, attendance & notes
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setRole("admin")}
                  className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                    role === "admin"
                      ? "bg-emerald-950/60 border-emerald-500 shadow-md shadow-emerald-500/10 text-white"
                      : "bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Shield
                      className={`w-5 h-5 ${
                        role === "admin" ? "text-emerald-400" : "text-slate-500"
                      }`}
                    />
                    {role === "admin" && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-semibold">Campus Admin</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      Publish notices & courses
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label
                htmlFor="fullName"
                className="block text-xs font-semibold text-slate-300 mb-1.5"
              >
                Full Name
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="h-4 w-4" />
                </div>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Alex Rivers"
                  className="block w-full pl-10 pr-3 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Institutional Email */}
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
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@campus.edu"
                  className="block w-full pl-10 pr-3 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Course Program (if Student) */}
            {role === "student" && (
              <div>
                <label
                  htmlFor="course"
                  className="block text-xs font-semibold text-slate-300 mb-1.5"
                >
                  Enrolled Degree / Diploma Program
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <BookOpen className="h-4 w-4" />
                  </div>
                  <select
                    id="course"
                    value={courseName}
                    onChange={(e) => setCourseName(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all appearance-none cursor-pointer"
                  >
                    {AVAILABLE_PROGRAMS.map((prog) => (
                      <option key={prog} value={prog} className="bg-slate-900">
                        {prog}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold text-slate-300 mb-1.5"
              >
                Password (min 6 characters)
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="block w-full pl-10 pr-3 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-lg shadow-indigo-600/25 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Registering Profile...</span>
                </>
              ) : (
                <>
                  <span>Create {role === "admin" ? "Admin" : "Student"} Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-400">
            Already registered?{" "}
            <Link
              href="/login"
              className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Sign in to your portal
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

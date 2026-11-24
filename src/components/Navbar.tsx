"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap,
  Sparkles,
  Menu,
  X,
  Shield,
  User,
  ArrowRight,
  LogOut,
  Calendar,
  Bell,
  BookOpen,
  LayoutDashboard,
} from "lucide-react";
import { useCampus } from "@/context/CampusContext";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, signOut, loginAsDemo, isSupabaseConnected } = useCampus();

  const navLinks = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/courses", label: "Courses", icon: BookOpen },
    { href: "/dashboard/notices", label: "Notices", icon: Bell },
    { href: "/dashboard/events", label: "Events", icon: Calendar },
    { href: "/admin", label: "Admin Panel", icon: Shield, adminOnly: true },
  ];

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="sticky top-0 z-50 w-full backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/80 px-4 sm:px-8 py-3"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <motion.div
            whileHover={{ scale: 1.05, rotate: 6 }}
            className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-400 p-0.5 shadow-lg shadow-indigo-500/20 flex items-center justify-center cursor-pointer"
          >
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-indigo-400 group-hover:text-emerald-400 transition-colors" />
            </div>
          </motion.div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-white">
                Campus<span className="text-emerald-400">OS</span>
              </span>
              <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 tracking-wider">
                Academic Portal
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Higher Education & Student Management
            </p>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-xl border border-slate-800/70 text-sm">
          <Link
            href="/"
            className={`px-3 py-1.5 rounded-lg transition-all ${
              pathname === "/"
                ? "bg-indigo-600 text-white font-medium shadow-sm"
                : "text-slate-300 hover:text-white hover:bg-slate-800/50"
            }`}
          >
            Home
          </Link>
          <Link
            href="/dashboard"
            className={`px-3 py-1.5 rounded-lg transition-all ${
              pathname === "/dashboard"
                ? "bg-indigo-600 text-white font-medium shadow-sm"
                : "text-slate-300 hover:text-white hover:bg-slate-800/50"
            }`}
          >
            Student Portal
          </Link>
          <Link
            href="/dashboard/courses"
            className={`px-3 py-1.5 rounded-lg transition-all ${
              pathname === "/dashboard/courses"
                ? "bg-indigo-600 text-white font-medium shadow-sm"
                : "text-slate-300 hover:text-white hover:bg-slate-800/50"
            }`}
          >
            Courses
          </Link>
          <Link
            href="/dashboard/notices"
            className={`px-3 py-1.5 rounded-lg transition-all ${
              pathname === "/dashboard/notices"
                ? "bg-indigo-600 text-white font-medium shadow-sm"
                : "text-slate-300 hover:text-white hover:bg-slate-800/50"
            }`}
          >
            Notices
          </Link>
          <Link
            href="/dashboard/events"
            className={`px-3 py-1.5 rounded-lg transition-all ${
              pathname === "/dashboard/events"
                ? "bg-indigo-600 text-white font-medium shadow-sm"
                : "text-slate-300 hover:text-white hover:bg-slate-800/50"
            }`}
          >
            Events
          </Link>
          <Link
            href="/admin"
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              pathname.startsWith("/admin")
                ? "bg-emerald-600 text-white font-medium shadow-sm"
                : "text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950/30"
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            Admin
          </Link>
        </nav>

        {/* Right CTA / User Status */}
        <div className="hidden sm:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="flex items-center gap-2.5 p-1.5 pr-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-xs font-semibold text-indigo-300">
                  {user.full_name?.charAt(0) || "U"}
                </div>
                <div className="text-left">
                  <div className="text-xs font-semibold text-white truncate max-w-[120px]">
                    {user.full_name}
                  </div>
                  <div className="text-[10px] text-emerald-400 font-mono capitalize">
                    {user.role}
                  </div>
                </div>
              </Link>
              <button
                onClick={() => signOut()}
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-900/50 transition-colors"
                title="Log out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-3.5 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-900 rounded-lg transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 text-white shadow-md shadow-indigo-600/20 transition-all flex items-center gap-1.5"
              >
                <span>Register</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? (
            <X className="w-5 h-5 text-white" />
          ) : (
            <Menu className="w-5 h-5 text-white" />
          )}
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden overflow-hidden border-t border-slate-800/80 mt-3 pt-3 pb-4"
          >
            <div className="flex flex-col gap-2">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-slate-200 hover:bg-slate-900"
              >
                Home
              </Link>
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-slate-200 hover:bg-slate-900"
              >
                <LayoutDashboard className="w-4 h-4 text-indigo-400" />
                Student Dashboard
              </Link>
              <Link
                href="/dashboard/courses"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-slate-200 hover:bg-slate-900"
              >
                <BookOpen className="w-4 h-4 text-indigo-400" />
                Courses & Notes
              </Link>
              <Link
                href="/dashboard/notices"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-slate-200 hover:bg-slate-900"
              >
                <Bell className="w-4 h-4 text-indigo-400" />
                Campus Notices
              </Link>
              <Link
                href="/dashboard/events"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-slate-200 hover:bg-slate-900"
              >
                <Calendar className="w-4 h-4 text-indigo-400" />
                Campus Events & RSVP
              </Link>
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-emerald-400 bg-emerald-950/20 border border-emerald-900/40"
              >
                <Shield className="w-4 h-4 text-emerald-400" />
                Admin Panel
              </Link>

              <div className="pt-3 border-t border-slate-800/80 flex flex-col gap-2">
                {user ? (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900">
                    <div>
                      <div className="text-sm font-semibold text-white">
                        {user.full_name}
                      </div>
                      <div className="text-xs text-slate-400 capitalize">
                        {user.role} • {user.student_id}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        signOut();
                        setMobileMenuOpen(false);
                      }}
                      className="px-3 py-1.5 text-xs text-rose-400 bg-rose-950/40 rounded-lg border border-rose-900/40"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="py-2.5 text-center text-xs font-semibold rounded-lg bg-slate-900 border border-slate-800 text-slate-200"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/signup"
                      onClick={() => setMobileMenuOpen(false)}
                      className="py-2.5 text-center text-xs font-semibold rounded-lg bg-indigo-600 text-white"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

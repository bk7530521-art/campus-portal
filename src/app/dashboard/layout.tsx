"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap,
  LayoutDashboard,
  BookOpen,
  Bell,
  Calendar,
  Shield,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Sparkles,
  UserCheck,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { useCampus } from "@/context/CampusContext";
import { useToast } from "@/components/ui/Toast";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  adminOnly?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/courses", label: "Courses & Notes", icon: BookOpen },
  { href: "/dashboard/notices", label: "Notice Board", icon: Bell, badge: "New" },
  { href: "/dashboard/events", label: "Events & RSVP", icon: Calendar },
  { href: "/admin", label: "Admin Portal", icon: Shield, adminOnly: true },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut, loginAsDemo, isSupabaseConnected, notices } = useCampus();
  const { info } = useToast();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const urgentNoticesCount = notices.filter((n) => n.category === "Urgent").length;

  const handleRoleToggle = () => {
    const nextRole = user?.role === "admin" ? "student" : "admin";
    loginAsDemo(nextRole);
    info(
      `Switched to ${nextRole === "admin" ? "Admin" : "Student"} view`,
      "Demo Account Switch"
    );
    if (nextRole === "admin") {
      router.push("/admin");
    } else if (pathname === "/admin") {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col lg:flex-row">
      {/* =========================================================================
          DESKTOP FIXED SIDEBAR
      ========================================================================== */}
      <aside className="hidden lg:flex flex-col w-72 bg-slate-950/90 border-r border-slate-800/80 p-5 sticky top-0 h-screen z-40 backdrop-blur-xl">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 pb-6 border-b border-slate-800/80 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-400 p-0.5 shadow-lg shadow-indigo-600/20 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-indigo-400 group-hover:text-emerald-400 transition-colors" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight text-white">
                Campus<span className="text-emerald-400">OS</span>
              </span>
              <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                v2.0
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Student & Campus Portal</p>
          </div>
        </Link>

        {/* User Card */}
        <div className="mt-5 p-3 rounded-2xl bg-slate-900/70 border border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white shadow-md">
              {user?.full_name ? user.full_name.charAt(0) : "A"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-white truncate">
                {user?.full_name || "Alex Rivers"}
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span
                  className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${
                    user?.role === "admin"
                      ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30"
                      : "bg-indigo-500/10 text-indigo-300 border border-indigo-500/30"
                  }`}
                >
                  {user?.role || "student"}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  {user?.student_id || "STU-884210"}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Demo Switcher Button */}
          <button
            onClick={handleRoleToggle}
            className="mt-3 w-full flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-slate-950/70 border border-slate-800 hover:border-slate-700 text-[11px] text-slate-400 hover:text-slate-200 transition-colors"
            title="Switch between student and admin accounts in demo"
          >
            <RefreshCw className="w-3 h-3 text-emerald-400" />
            <span>
              Switch to {user?.role === "admin" ? "Student" : "Admin"} View
            </span>
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="mt-6 flex-1 space-y-1 overflow-y-auto">
          <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 px-3 mb-2">
            Academic Navigation
          </div>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  isActive
                    ? "text-white"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active-pill"
                    className="absolute inset-0 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-600/30 -z-10"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive
                        ? "text-white"
                        : "text-slate-400 group-hover:text-white"
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.href === "/dashboard/notices" && urgentNoticesCount > 0 && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      isActive
                        ? "bg-white text-indigo-700"
                        : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                    }`}
                  >
                    {urgentNoticesCount} alert
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section: Database Status & Logout */}
        <div className="pt-4 border-t border-slate-800/80 space-y-3">
          <div className="flex items-center justify-between px-2 text-xs">
            <span className="text-slate-400">Database</span>
            <span
              className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                isSupabaseConnected
                  ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/20"
                  : "bg-indigo-500/10 text-indigo-300 border-indigo-500/20"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isSupabaseConnected ? "bg-emerald-400" : "bg-indigo-400"
                }`}
              />
              {isSupabaseConnected ? "Supabase Live" : "Demo State"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="flex-1 py-2 px-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-medium text-center transition-colors"
            >
              Back to Home
            </Link>
            <button
              onClick={() => {
                signOut();
                router.push("/login");
              }}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* =========================================================================
          MOBILE TOPBAR
      ========================================================================== */}
      <div className="lg:hidden sticky top-0 z-40 bg-slate-950/90 border-b border-slate-800/80 px-4 py-3 backdrop-blur-xl flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
            <GraduationCap className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-base text-white">
            Campus<span className="text-emerald-400">OS</span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 capitalize">
            {user?.role || "student"}
          </span>
          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300"
            aria-label="Toggle Navigation"
          >
            {mobileNavOpen ? (
              <X className="w-5 h-5 text-white" />
            ) : (
              <Menu className="w-5 h-5 text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileNavOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-b border-slate-800 bg-slate-950/95 px-4 py-4 space-y-2"
          >
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileNavOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium ${
                    isActive
                      ? "bg-indigo-600 text-white"
                      : "text-slate-300 hover:bg-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-50" />
                </Link>
              );
            })}

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
              <button
                onClick={handleRoleToggle}
                className="flex-1 py-2 text-xs bg-slate-900 border border-slate-800 rounded-lg text-slate-300 flex items-center justify-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
                Switch to {user?.role === "admin" ? "Student" : "Admin"}
              </button>
              <button
                onClick={() => {
                  signOut();
                  router.push("/login");
                }}
                className="py-2 px-3 text-xs bg-rose-950/40 border border-rose-900/40 rounded-lg text-rose-300"
              >
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          MAIN CONTENT AREA
      ========================================================================== */}
      <main className="flex-1 min-w-0 flex flex-col bg-slate-950">
        <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

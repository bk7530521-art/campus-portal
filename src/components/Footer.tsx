"use client";

import Link from "next/link";
import { GraduationCap, Shield, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-800/80 bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-400">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
            <GraduationCap className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <div className="font-semibold text-slate-200 text-sm">
              CampusOS Portal
            </div>
            <div className="text-[11px] text-slate-500">
              Modern Academic Management & Student Portal System
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-slate-400">
          <Link href="/dashboard" className="hover:text-emerald-400 transition-colors">
            Student Dashboard
          </Link>
          <Link href="/dashboard/courses" className="hover:text-emerald-400 transition-colors">
            Courses & Syllabus
          </Link>
          <Link href="/dashboard/notices" className="hover:text-emerald-400 transition-colors">
            Notice Board
          </Link>
          <Link href="/dashboard/events" className="hover:text-emerald-400 transition-colors">
            Events & RSVP
          </Link>
          <Link href="/admin" className="hover:text-emerald-400 transition-colors flex items-center gap-1">
            <Shield className="w-3 h-3" />
            Admin Panel
          </Link>
        </div>

        <div className="flex items-center gap-1 text-slate-500">
          <span>CampusOS v2.0 • Built with Next.js & Supabase</span>
        </div>
      </div>
    </footer>
  );
}

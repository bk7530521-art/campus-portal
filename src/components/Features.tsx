"use client";

import Link from "next/link";
import {
  BookOpen,
  Bell,
  Clock,
  FileText,
  ArrowRight,
  ShieldAlert,
  Award,
  CheckCircle,
  ExternalLink,
} from "lucide-react";
import { FadeIn } from "@/components/motion/FadeIn";
import { StaggerContainer } from "@/components/motion/StaggerContainer";
import { StaggerItem } from "@/components/motion/StaggerItem";

export default function Features() {
  const coreFeatures = [
    {
      icon: BookOpen,
      title: "Courses & Batches",
      badge: "Curriculum Engine",
      description:
        "Access enrolled diploma and degree programs, semester breakdowns, course credit totals, and real-time completion progress meters.",
      highlights: [
        "Syllabus tracking & progress bars",
        "Faculty profiles & office hours",
        "Credit hour & prerequisite checks",
      ],
      link: "/dashboard/courses",
      color: "from-indigo-600/20 via-indigo-500/10 to-transparent",
      borderColor: "border-indigo-500/30",
      accent: "text-indigo-400",
      btnText: "Explore Courses",
    },
    {
      icon: Bell,
      title: "Notices & Events",
      badge: "Real-time Broadcast",
      description:
        "Official campus announcements categorized into Exams, Events, Holidays, and Urgent Alerts with one-click RSVP functionality.",
      highlights: [
        "Color-coded category filtering",
        "Pinned priority dean notices",
        "Instant calendar reservation & seat count",
      ],
      link: "/dashboard/notices",
      color: "from-amber-600/20 via-amber-500/10 to-transparent",
      borderColor: "border-amber-500/30",
      accent: "text-amber-400",
      btnText: "View Notice Board",
    },
    {
      icon: Clock,
      title: "Fee & Attendance Tracker",
      badge: "Financial & Metrics",
      description:
        "Transparent real-time attendance percentages, class absence allowances, fee payment status receipts, and digital admit cards.",
      highlights: [
        "Visual 85% attendance minimum radar",
        "Pending fee alerts & digital invoices",
        "Admit card generation & barcode access",
      ],
      link: "/dashboard",
      color: "from-emerald-600/20 via-emerald-500/10 to-transparent",
      borderColor: "border-emerald-500/30",
      accent: "text-emerald-400",
      btnText: "Check Student Portal",
    },
    {
      icon: FileText,
      title: "Study Materials & Notes",
      badge: "Academic Repository",
      description:
        "Downloadable course syllabi, lecture presentations, code repositories, past exam papers, and supplementary digital readings.",
      highlights: [
        "Verified PDF & archive downloads",
        "Module-by-module lecture decks",
        "Faculty-curated lab assignments",
      ],
      link: "/dashboard/courses",
      color: "from-cyan-600/20 via-cyan-500/10 to-transparent",
      borderColor: "border-cyan-500/30",
      accent: "text-cyan-400",
      btnText: "Browse Study Notes",
    },
  ];

  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <FadeIn direction="up" className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-950/60 border border-indigo-800/60 text-xs font-semibold text-indigo-300 uppercase tracking-wider mb-4">
          Integrated Campus Architecture
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Four Pillars of Campus Management
        </h2>
        <p className="mt-4 text-base sm:text-lg text-slate-400 leading-relaxed">
          Designed specifically for university students, educators, and campus
          administrators to streamline communication and academic tracking.
        </p>
      </FadeIn>

      {/* Feature Grid with Framer Motion Stagger */}
      <StaggerContainer
        staggerDelay={0.12}
        className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20"
      >
        {coreFeatures.map((feat) => {
          const Icon = feat.icon;
          return (
            <StaggerItem key={feat.title}>
              <div
                className={`h-full p-8 rounded-3xl bg-slate-900/60 border ${feat.borderColor} bg-gradient-to-br ${feat.color} backdrop-blur-md shadow-xl flex flex-col justify-between transition-all hover:translate-y-[-4px] hover:border-slate-600`}
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div
                      className={`p-3.5 rounded-2xl bg-slate-950/90 border border-slate-800 shadow-inner ${feat.accent}`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-950/80 text-slate-300 border border-slate-800">
                      {feat.badge}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-3">
                    {feat.title}
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed mb-6">
                    {feat.description}
                  </p>

                  <div className="space-y-2.5 mb-8">
                    {feat.highlights.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2.5 text-xs text-slate-300"
                      >
                        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Link
                  href={feat.link}
                  className="inline-flex items-center justify-between px-5 py-3 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 text-sm font-semibold text-white group transition-colors"
                >
                  <span>{feat.btnText}</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-emerald-400 transition-all" />
                </Link>
              </div>
            </StaggerItem>
          );
        })}
      </StaggerContainer>

      {/* Supabase & Architecture Highlight Banner */}
      <FadeIn direction="up">
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/20 shadow-2xl relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-1/4 -translate-y-1/4 w-96 h-96 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <div className="lg:col-span-2">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2">
                <Award className="w-4 h-4" />
                Enterprise Grade Foundation
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                Powered by PostgreSQL, Supabase RLS & Next.js Turbopack
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Role-level security isolates student data while granting campus
                deans administrative publishing control. Schema triggers
                auto-provision student profiles on sign-up.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 justify-end">
              <Link
                href="/login"
                className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm text-center shadow-lg shadow-indigo-600/30 transition-all"
              >
                Access Student Portal
              </Link>
              <Link
                href="/admin"
                className="px-6 py-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white font-medium text-sm text-center transition-all"
              >
                Open Admin Panel
              </Link>
            </div>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}

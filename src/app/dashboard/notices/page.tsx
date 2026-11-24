"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Search,
  Pin,
  Calendar,
  AlertTriangle,
  GraduationCap,
  Sparkles,
  Share2,
  Bookmark,
  CheckCircle2,
  Clock,
  Filter,
} from "lucide-react";
import { useCampus } from "@/context/CampusContext";
import { useToast } from "@/components/ui/Toast";
import { FadeIn } from "@/components/motion/FadeIn";
import { StaggerContainer } from "@/components/motion/StaggerContainer";
import { StaggerItem } from "@/components/motion/StaggerItem";
import { NoticeCategory } from "@/types/database";

const CATEGORIES: ("All" | NoticeCategory)[] = [
  "All",
  "Urgent",
  "Exams",
  "Events",
  "Holidays",
];

export default function NoticesPage() {
  const { notices } = useCampus();
  const { success, info } = useToast();
  const [activeCategory, setActiveCategory] = useState<"All" | NoticeCategory>("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);

  const filteredNotices = notices.filter((notice) => {
    const matchesCategory =
      activeCategory === "All" || notice.category === activeCategory;
    const matchesSearch =
      notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notice.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notice.author_name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleBookmark = (id: string, title: string) => {
    if (bookmarkedIds.includes(id)) {
      setBookmarkedIds((prev) => prev.filter((i) => i !== id));
      info(`Notice removed from saved items.`, "Bookmark Removed");
    } else {
      setBookmarkedIds((prev) => [...prev, id]);
      success(`"${title.substring(0, 32)}..." saved to your bookmarks.`, "Notice Saved");
    }
  };

  const handleShare = (title: string) => {
    navigator.clipboard?.writeText(window.location.href);
    success("Notice link copied to clipboard.", "Link Copied");
  };

  const getCategoryBadge = (category: NoticeCategory) => {
    switch (category) {
      case "Urgent":
        return {
          bg: "bg-rose-950/70 text-rose-300 border-rose-500/40",
          icon: AlertTriangle,
        };
      case "Exams":
        return {
          bg: "bg-indigo-950/70 text-indigo-300 border-indigo-500/40",
          icon: GraduationCap,
        };
      case "Events":
        return {
          bg: "bg-amber-950/70 text-amber-300 border-amber-500/40",
          icon: Sparkles,
        };
      case "Holidays":
        return {
          bg: "bg-emerald-950/70 text-emerald-300 border-emerald-500/40",
          icon: Calendar,
        };
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <FadeIn direction="up">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-300 mb-2">
              <Bell className="w-3.5 h-3.5" />
              Real-time Campus Announcements
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Official Campus Notice Board
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Verified circulars, exam notifications, and campus bulletins from the Dean&apos;s Office
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search circulars..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>
        </div>
      </FadeIn>

      {/* Interactive Category Filter Tabs (Framer Motion layoutId) */}
      <FadeIn direction="up">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <div className="p-1 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex items-center gap-1">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`relative px-4 py-2 rounded-xl text-xs font-semibold transition-colors shrink-0 ${
                    isActive ? "text-white" : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="notice-category-active"
                      className="absolute inset-0 bg-indigo-600 rounded-xl shadow-md shadow-indigo-600/30"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1.5">
                    {cat === "Urgent" && (
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
                    )}
                    {cat}
                  </span>
                </button>
              );
            })}
          </div>

          <span className="text-xs text-slate-400 ml-3">
            Showing <strong className="text-white">{filteredNotices.length}</strong> bulletins
          </span>
        </div>
      </FadeIn>

      {/* Notices Feed */}
      <StaggerContainer staggerDelay={0.07} className="space-y-4">
        {filteredNotices.length === 0 ? (
          <div className="p-12 rounded-3xl bg-slate-900/40 border border-slate-800 text-center">
            <Bell className="w-8 h-8 text-slate-500 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-white">No notices found</h3>
            <p className="text-xs text-slate-400 mt-1">
              Try adjusting your category filter or search keywords
            </p>
          </div>
        ) : (
          filteredNotices.map((notice) => {
            const badge = getCategoryBadge(notice.category);
            const CategoryIcon = badge.icon;
            const isBookmarked = bookmarkedIds.includes(notice.id);

            return (
              <StaggerItem key={notice.id}>
                <div
                  className={`p-6 sm:p-7 rounded-3xl bg-slate-900/70 border backdrop-blur-md transition-all hover:border-slate-600 shadow-xl relative overflow-hidden ${
                    notice.is_pinned
                      ? "border-amber-500/40 bg-gradient-to-r from-amber-950/20 via-slate-900/80 to-slate-900/70"
                      : "border-slate-800/80"
                  }`}
                >
                  {/* Top Bar: Category, Pin, Date */}
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border ${badge.bg}`}
                      >
                        <CategoryIcon className="w-3.5 h-3.5" />
                        {notice.category}
                      </span>

                      {notice.is_pinned && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300">
                          <Pin className="w-3 h-3 fill-amber-300" />
                          Pinned by Dean
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        {new Date(notice.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => toggleBookmark(notice.id, notice.title)}
                          className={`p-1.5 rounded-lg border transition-colors ${
                            isBookmarked
                              ? "bg-indigo-600/20 border-indigo-500/40 text-indigo-300"
                              : "bg-slate-950/80 border-slate-800 text-slate-400 hover:text-white"
                          }`}
                          title="Bookmark notice"
                        >
                          <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? "fill-indigo-300" : ""}`} />
                        </button>
                        <button
                          onClick={() => handleShare(notice.title)}
                          className="p-1.5 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-400 hover:text-white transition-colors"
                          title="Share announcement link"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Title & Content */}
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2 leading-snug">
                    {notice.title}
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed mb-5 whitespace-pre-line">
                    {notice.content}
                  </p>

                  {/* Author / Department Footer */}
                  <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      Issued by: <strong className="text-slate-300">{notice.author_name}</strong>
                    </span>
                    <span className="font-mono text-[11px] text-slate-400">Ref: #{notice.id.substring(0, 8)}</span>
                  </div>
                </div>
              </StaggerItem>
            );
          })
        )}
      </StaggerContainer>
    </div>
  );
}

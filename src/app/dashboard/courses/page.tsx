"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Download,
  FileText,
  Search,
  CheckCircle2,
  ExternalLink,
  Users,
  GraduationCap,
  Sparkles,
  Layers,
  FileCode,
  FolderDown,
  X,
} from "lucide-react";
import { useCampus } from "@/context/CampusContext";
import { useToast } from "@/components/ui/Toast";
import { FadeIn } from "@/components/motion/FadeIn";
import { StaggerContainer } from "@/components/motion/StaggerContainer";
import { StaggerItem } from "@/components/motion/StaggerItem";
import { Course } from "@/types/database";

export default function CoursesPage() {
  const { courses } = useCampus();
  const { success, info } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const filteredCourses = courses.filter(
    (c) =>
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.instructor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDownload = (materialName: string, courseTitle: string) => {
    success(
      `Downloading ${materialName} for ${courseTitle}...`,
      "Download Started"
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <FadeIn direction="up">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-300 mb-2">
              <BookOpen className="w-3.5 h-3.5" />
              Academic Curriculum & Digital Notes
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Enrolled Courses & Study Materials
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Access your degree syllabi, downloadable lecture presentations, and track semester completion
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search course or professor..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>
        </div>
      </FadeIn>

      {/* Courses Grid */}
      <StaggerContainer
        staggerDelay={0.08}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {filteredCourses.map((course) => {
          const progress = course.progress || 70;
          return (
            <StaggerItem key={course.id}>
              <div className="h-full p-6 sm:p-7 rounded-3xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-md flex flex-col justify-between hover:border-indigo-500/30 transition-all shadow-xl group">
                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-950/70 text-indigo-300 border border-indigo-800/60">
                      {course.duration}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {course.credits} Credits Total
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">
                    {course.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-5 line-clamp-3">
                    {course.description}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-slate-400 mb-6">
                    <div className="flex items-center gap-1.5">
                      <GraduationCap className="w-4 h-4 text-slate-500" />
                      <span>{course.instructor}</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-slate-500" />
                      <span>{course.enrolled_count} Students</span>
                    </div>
                  </div>

                  {/* Syllabus Progress Bar */}
                  <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-2 mb-6">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-300">
                        Syllabus Progress
                      </span>
                      <span className="font-mono text-emerald-400 font-bold">
                        {progress}% Completed
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${progress}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="bg-gradient-to-r from-indigo-500 via-teal-400 to-emerald-400 h-2.5 rounded-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Downloadable Study Material Links */}
                <div className="space-y-2.5 pt-4 border-t border-slate-800/80">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Course Resources & Downloads
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleDownload("Official Syllabus (PDF)", course.title)}
                      className="py-2.5 px-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500/40 text-xs font-medium text-slate-200 hover:text-white transition-colors flex items-center justify-between"
                    >
                      <span className="flex items-center gap-1.5 truncate">
                        <FileText className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                        <span className="truncate">Syllabus PDF</span>
                      </span>
                      <Download className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    </button>

                    <button
                      onClick={() => handleDownload("Lecture Slide Deck #1-12", course.title)}
                      className="py-2.5 px-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/40 text-xs font-medium text-slate-200 hover:text-white transition-colors flex items-center justify-between"
                    >
                      <span className="flex items-center gap-1.5 truncate">
                        <Layers className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="truncate">Slides Deck</span>
                      </span>
                      <Download className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    </button>

                    <button
                      onClick={() => handleDownload("Lab Code Repository (ZIP)", course.title)}
                      className="py-2.5 px-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/40 text-xs font-medium text-slate-200 hover:text-white transition-colors flex items-center justify-between"
                    >
                      <span className="flex items-center gap-1.5 truncate">
                        <FileCode className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span className="truncate">Code Repos</span>
                      </span>
                      <Download className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    </button>

                    <button
                      onClick={() => setSelectedCourse(course)}
                      className="py-2.5 px-3 rounded-xl bg-indigo-600/20 border border-indigo-500/40 hover:bg-indigo-600/30 text-xs font-medium text-indigo-200 transition-colors flex items-center justify-between"
                    >
                      <span className="truncate">View Modules</span>
                      <ExternalLink className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    </button>
                  </div>
                </div>
              </div>
            </StaggerItem>
          );
        })}
      </StaggerContainer>

      {/* Module Curriculum Details Modal */}
      <AnimatePresence>
        {selectedCourse && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-2xl p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl text-white max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setSelectedCourse(null)}
                className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800/60 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="mb-6">
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800">
                  {selectedCourse.duration}
                </span>
                <h3 className="text-2xl font-bold text-white mt-3 mb-1">
                  {selectedCourse.title}
                </h3>
                <p className="text-xs text-slate-400">
                  Faculty: {selectedCourse.instructor} • {selectedCourse.credits} Academic Credits
                </p>
              </div>

              <div className="space-y-4 mb-6">
                <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
                  Detailed Syllabus Modules
                </h4>

                {[
                  {
                    module: "Module 1",
                    title: "Foundations & Architectural Core",
                    weeks: "Weeks 1-4",
                    status: "Completed (100%)",
                  },
                  {
                    module: "Module 2",
                    title: "Advanced Protocols & System Modeling",
                    weeks: "Weeks 5-8",
                    status: "In Progress (75%)",
                  },
                  {
                    module: "Module 3",
                    title: "Distributed Pipelines & Practical Labs",
                    weeks: "Weeks 9-12",
                    status: "Upcoming",
                  },
                  {
                    module: "Module 4",
                    title: "Capstone Project, Code Audit & Defense",
                    weeks: "Weeks 13-16",
                    status: "Upcoming",
                  },
                ].map((mod, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs font-bold text-indigo-400">
                        {mod.module} • {mod.weeks}
                      </div>
                      <div className="text-sm font-semibold text-white mt-0.5">
                        {mod.title}
                      </div>
                    </div>
                    <span className="text-xs font-medium text-emerald-400">
                      {mod.status}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    handleDownload("Comprehensive Course Pack (ZIP)", selectedCourse.title);
                    setSelectedCourse(null);
                  }}
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 text-xs font-semibold text-white transition-all flex items-center justify-center gap-2"
                >
                  <FolderDown className="w-4 h-4" />
                  <span>Download Complete Course Pack (ZIP)</span>
                </button>
                <button
                  onClick={() => setSelectedCourse(null)}
                  className="py-3 px-5 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

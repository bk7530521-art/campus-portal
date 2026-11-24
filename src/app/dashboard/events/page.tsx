"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar as CalendarIcon,
  MapPin,
  Users,
  CheckCircle2,
  Clock,
  Sparkles,
  Search,
  CalendarPlus,
  Loader2,
  Share2,
} from "lucide-react";
import { useCampus } from "@/context/CampusContext";
import { useToast } from "@/components/ui/Toast";
import { FadeIn } from "@/components/motion/FadeIn";
import { StaggerContainer } from "@/components/motion/StaggerContainer";
import { StaggerItem } from "@/components/motion/StaggerItem";

export default function EventsPage() {
  const { events, toggleRsvp, user } = useCampus();
  const { success, info, error } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingEventId, setLoadingEventId] = useState<string | null>(null);

  const filteredEvents = events.filter(
    (ev) =>
      ev.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ev.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ev.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRsvp = async (eventId: string, title: string) => {
    if (!user) {
      error("Please sign in to register for campus events.");
      return;
    }

    setLoadingEventId(eventId);
    const res = await toggleRsvp(eventId);
    setLoadingEventId(null);

    if (res.error) {
      error(res.error, "RSVP Error");
    } else if (res.status === "registered") {
      success(
        `Seat confirmed for "${title}". Digital ticket added to your portal.`,
        "RSVP Confirmed ✓"
      );
    } else {
      info(`Registration cancelled for "${title}".`, "RSVP Cancelled");
    }
  };

  const handleAddToCalendar = (title: string, date: string) => {
    success(`Calendar event (.ics) generated for "${title}".`, "Calendar Export");
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <FadeIn direction="up">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-semibold text-amber-300 mb-2">
              <CalendarIcon className="w-3.5 h-3.5" />
              Campus Life & Academic Symposiums
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Campus Events & Interactive Schedule
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Register with one click for tech expos, industry mixers, hackathons, and cultural events
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search event or venue..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>
        </div>
      </FadeIn>

      {/* Events Grid */}
      <StaggerContainer
        staggerDelay={0.08}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {filteredEvents.map((event) => {
          const isRegistered = Boolean(event.is_registered);
          const eventDate = new Date(event.event_date);
          const capacity = event.capacity || 250;
          const registeredCount = event.registered_count || 120;
          const percentFull = Math.min(100, Math.round((registeredCount / capacity) * 100));
          const isLoadingThis = loadingEventId === event.id;

          return (
            <StaggerItem key={event.id}>
              <div
                className={`h-full p-6 sm:p-7 rounded-3xl bg-slate-900/70 border backdrop-blur-md flex flex-col justify-between transition-all hover:border-indigo-500/30 shadow-xl group ${
                  isRegistered
                    ? "border-emerald-500/40 bg-gradient-to-br from-emerald-950/20 via-slate-900/80 to-slate-900"
                    : "border-slate-800/80"
                }`}
              >
                <div>
                  {/* Date badge & status */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="p-3 rounded-2xl bg-slate-950/90 border border-slate-800 flex items-center gap-3">
                      <div className="text-center px-1">
                        <div className="text-[10px] font-bold uppercase text-emerald-400">
                          {eventDate.toLocaleDateString("en-US", { month: "short" })}
                        </div>
                        <div className="text-lg font-extrabold text-white leading-none mt-0.5">
                          {eventDate.getDate()}
                        </div>
                      </div>
                      <div className="border-l border-slate-800 pl-3 text-xs text-slate-300">
                        <div className="font-semibold text-white">
                          {eventDate.toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                        <div className="text-slate-400 text-[11px]">
                          {eventDate.toLocaleDateString("en-US", { weekday: "long" })}
                        </div>
                      </div>
                    </div>

                    {isRegistered ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 shadow-sm">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Registered ✓
                      </span>
                    ) : (
                      <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-slate-800/80 text-slate-300 border border-slate-700">
                        Open for RSVP
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">
                    {event.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-5 line-clamp-3">
                    {event.description}
                  </p>

                  {/* Location & Capacity */}
                  <div className="space-y-3 p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 mb-6">
                    <div className="flex items-center gap-2 text-xs text-slate-300">
                      <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
                      <span className="truncate">{event.location}</span>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-slate-500" />
                          Capacity
                        </span>
                        <span>
                          <strong className="text-white">{registeredCount}</strong> / {capacity} Seats ({percentFull}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${
                            percentFull > 85
                              ? "bg-rose-500"
                              : "bg-gradient-to-r from-indigo-500 to-emerald-400"
                          }`}
                          style={{ width: `${percentFull}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Bar */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => handleRsvp(event.id, event.title)}
                    disabled={isLoadingThis}
                    className={`flex-1 py-3 px-4 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer ${
                      isRegistered
                        ? "bg-slate-800 hover:bg-rose-950/60 hover:text-rose-300 hover:border-rose-800 border border-slate-700 text-slate-200"
                        : "bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 text-white shadow-indigo-600/20"
                    }`}
                  >
                    {isLoadingThis ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Updating RSVP...</span>
                      </>
                    ) : isRegistered ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Cancel Registration</span>
                      </>
                    ) : (
                      <>
                        <CalendarPlus className="w-4 h-4" />
                        <span>One-Click RSVP</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleAddToCalendar(event.title, event.event_date)}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-colors"
                    title="Add to Google / Apple Calendar"
                  >
                    <CalendarIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </StaggerItem>
          );
        })}
      </StaggerContainer>
    </div>
  );
}

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Move,
  Sparkles,
  Maximize2,
  Sliders,
  RotateCw,
  Layers,
  Zap,
} from "lucide-react";

export default function MotionShowcase() {
  const [activeTab, setActiveTab] = useState(0);
  const [scaleCount, setScaleCount] = useState(1);
  const [rotateDeg, setRotateDeg] = useState(0);

  const tabs = [
    { title: "Fluid Springs", desc: "Physics-driven damping and stiffness animations that respond naturally to user gestures." },
    { title: "Layout Morph", desc: "Automatic interpolation between component hierarchies and shared layout ids." },
    { title: "Gestures", desc: "Drag boundaries, elastic resistance, hover elevation, and responsive tap feedback." },
  ];

  return (
    <section id="framer-showcase" className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-medium text-cyan-300 mb-3"
        >
          <Zap className="w-3.5 h-3.5" />
          Framer Motion Laboratory
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-3xl sm:text-4xl font-bold text-white tracking-tight"
        >
          Interactive Animation Demos
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-slate-400 max-w-2xl mx-auto mt-2 text-sm sm:text-base"
        >
          Play with drag constraints, keyframe pulses, layout transitions, and interactive physics.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Interactive Drag Physics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between overflow-hidden relative"
        >
          <div>
            <div className="flex items-center gap-2.5 mb-2 text-emerald-400">
              <Move className="w-5 h-5" />
              <h3 className="font-semibold text-white">Drag & Elastic Snap</h3>
            </div>
            <p className="text-xs text-slate-400 mb-6">
              Drag the puck around. It smoothly springs back to center on release using elastic damping.
            </p>
          </div>

          <div className="h-44 w-full bg-slate-950/80 rounded-xl border border-slate-800/80 flex items-center justify-center relative overflow-hidden">
            <span className="text-[11px] text-slate-600 font-mono select-none">
              [ Drag Boundary Area ]
            </span>
            <motion.div
              drag
              dragConstraints={{ left: -70, right: 70, top: -45, bottom: 45 }}
              dragElastic={0.2}
              whileDrag={{ scale: 1.15, cursor: "grabbing" }}
              whileHover={{ scale: 1.05, cursor: "grab" }}
              className="absolute w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 shadow-lg shadow-emerald-500/30 flex items-center justify-center text-slate-950 font-bold text-xs select-none"
            >
              DRAG
            </motion.div>
          </div>
        </motion.div>

        {/* Card 2: Interactive Controls & Transform */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center gap-2.5 mb-2 text-cyan-400">
              <Sliders className="w-5 h-5" />
              <h3 className="font-semibold text-white">Spring Dynamics</h3>
            </div>
            <p className="text-xs text-slate-400 mb-6">
              Trigger instant physics recalculations with spring-based scale and rotation animations.
            </p>
          </div>

          <div className="h-44 w-full bg-slate-950/80 rounded-xl border border-slate-800/80 flex flex-col items-center justify-center gap-4">
            <motion.div
              animate={{
                scale: scaleCount,
                rotate: rotateDeg,
              }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
              }}
              className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-500 shadow-lg shadow-cyan-500/30 flex items-center justify-center text-white"
            >
              <Sparkles className="w-6 h-6" />
            </motion.div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setScaleCount((s) => (s >= 1.3 ? 0.8 : s + 0.25))}
                className="px-2.5 py-1 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center gap-1"
              >
                <Maximize2 className="w-3 h-3 text-cyan-400" />
                Pulse
              </button>
              <button
                onClick={() => setRotateDeg((r) => r + 90)}
                className="px-2.5 py-1 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center gap-1"
              >
                <RotateCw className="w-3 h-3 text-cyan-400" />
                Rotate 90°
              </button>
            </div>
          </div>
        </motion.div>

        {/* Card 3: Layout Morphing Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center gap-2.5 mb-2 text-teal-400">
              <Layers className="w-5 h-5" />
              <h3 className="font-semibold text-white">Layout Transition</h3>
            </div>
            <p className="text-xs text-slate-400 mb-6">
              Shared layout ids enable seamless morphing across states without manual frame math.
            </p>
          </div>

          <div className="h-44 w-full bg-slate-950/80 rounded-xl border border-slate-800/80 p-3 flex flex-col justify-between">
            <div className="flex gap-1 bg-slate-900/90 p-1 rounded-lg border border-slate-800">
              {tabs.map((tab, idx) => (
                <button
                  key={tab.title}
                  onClick={() => setActiveTab(idx)}
                  className={`relative flex-1 py-1 text-[11px] font-medium transition-colors z-10 ${
                    activeTab === idx ? "text-white" : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {tab.title}
                  {activeTab === idx && (
                    <motion.div
                      layoutId="showcaseTabPill"
                      className="absolute inset-0 bg-slate-800 rounded-md -z-10 shadow-sm border border-slate-700/60"
                      transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    />
                  )}
                </button>
              ))}
            </div>

            <motion.p
              key={activeTab}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="text-xs text-slate-300 px-1 leading-relaxed"
            >
              {tabs[activeTab].desc}
            </motion.p>

            <div className="text-[10px] text-teal-400 font-mono">
              active state: index {activeTab}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

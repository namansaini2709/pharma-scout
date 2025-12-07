"use client";

import { Sparkles, ArrowRight, Activity, Globe, ShieldCheck, Zap, Database, Brain } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Link from "next/link";
import React, { useRef } from "react";

// --- Tilt Card Component (Reused) ---
function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateY, rotateX, transformStyle: "preserve-3d" }}
      className={`relative w-full h-full ${className}`}
    >
      {children}
    </motion.div>
  );
}

export default function FeaturesPage() {
  return (
    <div className="relative min-h-screen flex flex-col overflow-x-hidden">
      
      {/* --- Navbar (Handled by Layout) --- */}

      {/* --- Content --- */}
      <main className="relative z-10 pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6"
          >
            The Engine <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-200 to-zinc-500">Under the Hood.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-zinc-400 max-w-3xl mx-auto"
          >
            Our platform combines five specialized AI agents to deliver the most comprehensive due diligence reports in the industry.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature Cards */}
            {[
                { icon: Activity, title: "Clinical Trials Agent", desc: "Monitors ClinicalTrials.gov in real-time. Detects recruitment stalls, safety amendments, and phase transitions.", color: "text-primary", bg: "bg-primary/10" },
                { icon: Globe, title: "Market Scout", desc: "Aggregates pricing data, epidemiology studies, and competitor pipelines via open web search.", color: "text-secondary", bg: "bg-secondary/10" },
                { icon: ShieldCheck, title: "IP Guardian", desc: "Scans for patent cliffs, FTO risks, and litigation history. Visualizes exclusivity timelines.", color: "text-accent", bg: "bg-accent/10" },
                { icon: Database, title: "Supply Chain", desc: "Analyzes API sourcing risks, manufacturing bottlenecks, and geopolitical dependencies for key ingredients.", color: "text-zinc-400", bg: "bg-zinc-800" },
                { icon: Brain, title: "Literature Synth", desc: "Reads thousands of PubMed articles to summarize mechanism of action, efficacy signals, and KOL sentiment.", color: "text-pink-500", bg: "bg-pink-500/10" },
                { icon: Zap, title: "Real-Time Scoring", desc: "Our proprietary engine normalizes all data into a 0-100 Opportunity Score, updated instantly as new data arrives.", color: "text-yellow-500", bg: "bg-yellow-500/10" }
            ].map((feature, i) => (
                <div key={i} className="h-[350px]">
                    <TiltCard className="group h-full p-8 rounded-3xl border border-white/10 bg-black/40 hover:bg-white/[0.03] transition-colors flex flex-col relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                        
                        <div className="transform transition-transform duration-300 group-hover:translate-z-10" style={{ transformStyle: "preserve-3d", transform: "translateZ(20px)" }}>
                            <div className={`w-14 h-14 ${feature.bg} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
                                <feature.icon className={`w-7 h-7 ${feature.color}`} />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
                            <p className="text-zinc-400 leading-relaxed">{feature.desc}</p>
                        </div>
                    </TiltCard>
                </div>
            ))}
        </div>
      </main>
    </div>
  );
}

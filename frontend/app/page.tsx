"use client";

import { Search, Sparkles, TrendingUp, FlaskConical, ScrollText, ArrowRight, Activity, Globe, ShieldCheck, Menu } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Link from "next/link";
import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";

// --- Tilt Card Component ---
function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["17.5deg", "-17.5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-17.5deg", "17.5deg"]);

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
      style={{
        rotateY,
        rotateX,
        transformStyle: "preserve-3d",
      }}
      className={`relative w-full h-full ${className}`}
    >
      <div
        style={{
          transform: "translateZ(75px)",
          transformStyle: "preserve-3d",
        }}
        className="absolute inset-4 grid place-content-center rounded-xl bg-transparent shadow-lg"
      >
        {/* Content Layer */}
      </div>
      {children}
    </motion.div>
  );
}

export default function Home() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    if (!query.trim()) return;
    router.push(`/dashboard?q=${encodeURIComponent(query)}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col overflow-x-hidden selection:bg-primary/30">
      
      {/* --- Ambient Background Glow --- */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full mix-blend-screen filter blur-[120px] animate-blob" />
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[60%] bg-secondary/10 rounded-full mix-blend-screen filter blur-[120px] animate-blob animation-delay-2000" />
        <div className="absolute bottom-[-20%] left-[20%] w-[60%] h-[40%] bg-accent/10 rounded-full mix-blend-screen filter blur-[120px] animate-blob animation-delay-4000" />
      </div>
      
      <div className="fixed inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] z-0 opacity-10" />

      {/* --- Navbar Removed (Handled by Layout) --- */}

      <main className="relative z-10 flex-grow flex flex-col">
        
        {/* --- Hero Section --- */}
        <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-4 pt-32 pb-20">
          
          {/* Hero Content */}
          <div className="text-center max-w-5xl mx-auto perspective-[2000px]">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center px-3 py-1 mb-8 rounded-full border border-white/10 bg-white/5 text-xs font-medium text-primary backdrop-blur-sm shadow-[0_0_20px_rgba(16,185,129,0.15)]"
            >
              <span className="flex w-2 h-2 bg-primary rounded-full mr-2 animate-pulse" />
              v1.0 Now Live: Intelligence at the Speed of Thought
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, scale: 0.9, rotateX: 20 }}
              animate={{ opacity: 1, scale: 1, rotateX: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-6xl md:text-8xl font-bold tracking-tight text-white mb-8 leading-[1.1] drop-shadow-2xl"
            >
              The Command Center <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-200 via-white to-zinc-500">
                for Drug Discovery.
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl md:text-2xl text-zinc-400 mb-12 max-w-3xl mx-auto leading-relaxed font-light"
            >
              Stop stitching together PDFs. 
              <span className="text-white font-normal"> Pharma Scout </span> 
              synthesizes global signals to score viability in seconds.
            </motion.p>

            {/* Command Center Input */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="relative max-w-2xl mx-auto group z-20"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-primary via-secondary to-accent rounded-2xl blur opacity-20 group-hover:opacity-50 transition duration-1000 animate-pulse" />
              
              <div className="relative flex items-center bg-[#0a0a0a]/90 backdrop-blur-xl border border-white/10 rounded-xl p-2 shadow-2xl ring-1 ring-white/5">
                <Search className="w-6 h-6 text-zinc-500 ml-4" />
                <input
                  type="text"
                  placeholder="Analyze 'Metformin' or 'NASH Market'..."
                  className="w-full bg-transparent border-none text-lg text-white placeholder-zinc-600 px-4 py-4 focus:outline-none focus:ring-0"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <button 
                  onClick={handleSearch}
                  className="bg-white text-black font-semibold px-8 py-3 rounded-lg hover:bg-zinc-200 transition-all flex items-center shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                >
                  Scout <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* --- 3D Feature Cards (Tilt Effect) --- */}
        <section id="features" className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-20 text-center">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Full Spectrum Intelligence.</h2>
              <p className="text-xl text-zinc-400 max-w-2xl mx-auto">We don't just search. We synthesize.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
              
              {/* Card 1: Clinical */}
              <div className="h-[400px] w-full">
                <TiltCard className="rounded-3xl bg-gradient-to-br from-zinc-900 to-black border border-white/10 p-8 flex flex-col justify-end group">
                   <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
                   
                   <div className="relative z-10 transform transition-transform duration-300 group-hover:translate-z-12">
                     <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center mb-6 text-primary shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                        <FlaskConical className="w-7 h-7" />
                     </div>
                     <h3 className="text-3xl font-bold text-white mb-4">Clinical<br/>Deep-Dive</h3>
                     <p className="text-zinc-400 leading-relaxed">
                        Real-time analysis of Phase I-IV trials. Identify enrollment delays and safety signals instantly.
                     </p>
                   </div>
                </TiltCard>
              </div>

              {/* Card 2: Market */}
              <div className="h-[400px] w-full">
                <TiltCard className="rounded-3xl bg-gradient-to-br from-zinc-900 to-black border border-white/10 p-8 flex flex-col justify-end group">
                   <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
                   
                   <div className="relative z-10 transform transition-transform duration-300 group-hover:translate-z-12">
                     <div className="w-14 h-14 rounded-2xl bg-secondary/20 flex items-center justify-center mb-6 text-secondary shadow-[0_0_30px_rgba(59,130,246,0.2)]">
                        <TrendingUp className="w-7 h-7" />
                     </div>
                     <h3 className="text-3xl font-bold text-white mb-4">Market<br/>Viability</h3>
                     <p className="text-zinc-400 leading-relaxed">
                        Predictive TAM modeling. Scrape competitor pricing and reimbursement data to forecast revenue.
                     </p>
                   </div>
                </TiltCard>
              </div>

              {/* Card 3: IP */}
              <div className="h-[400px] w-full">
                <TiltCard className="rounded-3xl bg-gradient-to-br from-zinc-900 to-black border border-white/10 p-8 flex flex-col justify-end group">
                   <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
                   
                   <div className="relative z-10 transform transition-transform duration-300 group-hover:translate-z-12">
                     <div className="w-14 h-14 rounded-2xl bg-accent/20 flex items-center justify-center mb-6 text-accent shadow-[0_0_30px_rgba(168,85,247,0.2)]">
                        <ScrollText className="w-7 h-7" />
                     </div>
                     <h3 className="text-3xl font-bold text-white mb-4">Patent<br/>Intelligence</h3>
                     <p className="text-zinc-400 leading-relaxed">
                        Visualize patent cliffs. Map the landscape to identify white space and infringement risks.
                     </p>
                   </div>
                </TiltCard>
              </div>

            </div>
          </div>
        </section>

        {/* --- Interactive Demo Section --- */}
        <section className="py-32 px-6 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/5 pointer-events-none" />
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1">
              <h2 className="text-4xl font-bold text-white mb-6">See the Matrix.</h2>
              <p className="text-lg text-zinc-400 mb-8">
                Our proprietary <span className="text-white font-medium">Signal Scoring Engine™</span> turns chaos into a single, board-ready "Opportunity Score".
              </p>
              
              <div className="space-y-6">
                {[
                  { label: "Scientific Fit", score: 88, color: "bg-primary" },
                  { label: "Commercial Potential", score: 92, color: "bg-secondary" },
                  { label: "IP Risk Profile", score: 45, color: "bg-warning" },
                ].map((item, i) => (
                  <div key={i} className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
                    <div className="flex justify-between text-sm font-medium text-zinc-300 mb-2">
                      <span>{item.label}</span>
                      <span>{item.score}/100</span>
                    </div>
                    <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: `${item.score}%` }}
                        transition={{ duration: 1, delay: i * 0.2 }}
                        className={`h-full ${item.color}`} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex-1 relative perspective-[1000px]">
               {/* Abstract UI Mockup */}
               <motion.div 
                 initial={{ rotateY: -10, rotateX: 5 }}
                 whileHover={{ rotateY: 0, rotateX: 0 }}
                 transition={{ duration: 0.5 }}
                 className="relative z-10 bg-[#0f0f0f] border border-white/10 rounded-2xl p-6 shadow-2xl"
               >
                 <div className="flex items-center space-x-4 mb-8 border-b border-white/5 pb-4">
                   <div className="w-3 h-3 rounded-full bg-red-500/50" />
                   <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                   <div className="w-3 h-3 rounded-full bg-green-500/50" />
                   <div className="ml-auto text-xs text-zinc-500 font-mono">CONFIDENTIAL REPORT</div>
                 </div>
                 <div className="space-y-4">
                   <div className="h-4 bg-zinc-800 rounded w-3/4 animate-pulse" />
                   <div className="h-4 bg-zinc-800 rounded w-1/2 animate-pulse" />
                   <div className="h-32 bg-zinc-800/50 rounded mt-8 border border-white/5" />
                 </div>
               </motion.div>
               
               {/* Decorative Elements behind mockup */}
               <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl animate-pulse" />
               <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-secondary/20 rounded-full blur-3xl animate-pulse" />
            </div>
          </div>
        </section>

      </main>

      <footer className="py-12 px-6 border-t border-white/5 bg-black text-center text-zinc-600 text-sm">
        <p>© 2025 Pharma Scout Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}

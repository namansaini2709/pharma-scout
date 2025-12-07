"use client";

import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function MethodologyPage() {
  return (
    <div className="relative min-h-screen flex flex-col overflow-x-hidden">
       <div className="fixed inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-5 z-0" />
       
      {/* --- Content --- */}
      <main className="relative z-10 pt-32 pb-20 px-6 max-w-4xl mx-auto text-zinc-300 leading-relaxed">
        
        <div className="text-center mb-16">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-block px-4 py-1 mb-4 rounded-full border border-white/10 bg-white/5 text-xs font-medium text-primary backdrop-blur-sm"
            >
              Transparent Algorithms
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-6xl font-bold text-white mb-6"
            >
              Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Methodology</span>
            </motion.h1>
            <p className="text-xl text-zinc-400">
                Pharma Scout does not rely on "black box" AI. We use a deterministic scoring model backed by verifiable citations.
            </p>
        </div>
        
        <div className="relative">
            {/* Connecting Line */}
            <div className="absolute left-[27px] top-4 bottom-0 w-0.5 bg-gradient-to-b from-primary via-secondary to-transparent" />

            <div className="space-y-16">
                {[
                    { title: "Scientific Fit", percent: "35%", desc: "Calculated based on the strength of clinical evidence. We analyze trial phases, p-values, sample sizes, and MoA clarity.", color: "text-primary", border: "border-primary" },
                    { title: "Commercial Potential", percent: "30%", desc: "Derived from TAM modeling. We factor in patient population size, pricing, and apply a 'Competition Penalty' based on asset density.", color: "text-secondary", border: "border-secondary" },
                    { title: "IP & Legal Risk", percent: "20%", desc: "An inverse risk score. We look for unexpired key patents (composition of matter), FTO density, and active litigation.", color: "text-accent", border: "border-accent" },
                    { title: "Supply & Manufacturing", percent: "15%", desc: "Assesses the complexity of the molecule (small molecule vs. biologic) and GMP supplier availability.", color: "text-zinc-400", border: "border-zinc-500" }
                ].map((step, i) => (
                    <motion.div 
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: i * 0.1 }}
                        className="relative pl-20"
                    >
                        {/* Dot */}
                        <div className={`absolute left-0 top-0 w-14 h-14 rounded-full bg-black border-2 ${step.border} flex items-center justify-center font-bold text-white z-10 shadow-[0_0_20px_rgba(0,0,0,0.5)]`}>
                            {i + 1}
                        </div>
                        
                        <div className="p-8 bg-white/[0.03] border border-white/5 rounded-2xl backdrop-blur-sm hover:bg-white/[0.05] transition-colors">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className={`text-2xl font-bold text-white ${step.color}`}>{step.title}</h3>
                                <div className="text-2xl font-bold text-white/20">{step.percent}</div>
                            </div>
                            <p className="text-lg text-zinc-400">
                                {step.desc}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>

      </main>
    </div>
  );
}

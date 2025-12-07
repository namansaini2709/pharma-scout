"use client";

import { Sparkles, Brain, Clock, Shield, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <div className="relative min-h-screen flex flex-col overflow-x-hidden selection:bg-primary/30">
       <div className="fixed inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-5 z-0" />
       
      {/* --- Content --- */}
      <main className="relative z-10 pt-32 pb-20 px-6 max-w-5xl mx-auto text-zinc-300 leading-relaxed">
        
        {/* Header */}
        <div className="text-center mb-20">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-5xl md:text-7xl font-bold text-white mb-6"
            >
              What is <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Pharma Scout?</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl md:text-2xl text-zinc-400 max-w-3xl mx-auto"
            >
                Put simply: We help drug hunters find the next big breakthrough, <span className="text-white font-medium">faster.</span>
            </motion.p>
        </div>

        {/* The Problem (Glass Card with Danger Glow) */}
        <motion.section 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-20 bg-gradient-to-br from-red-500/5 to-transparent border border-red-500/20 rounded-3xl p-10 backdrop-blur-sm relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 p-12 bg-red-500/10 blur-[100px] rounded-full" />
            
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
              <span className="w-2 h-8 bg-red-500 rounded-full mr-4" />
              The Problem: "The Data Wall"
            </h2>
            <div className="grid md:grid-cols-2 gap-10">
              <div>
                <p className="mb-6 text-lg">
                    Imagine you want to know if a specific drug (like "Metformin") is a good business opportunity. Today, that means hitting a wall of boring homework:
                </p>
                <ul className="space-y-4">
                    <li className="flex items-center text-zinc-400"><span className="w-2 h-2 bg-red-500 rounded-full mr-3" /> Searching ClinicalTrials.gov manually.</li>
                    <li className="flex items-center text-zinc-400"><span className="w-2 h-2 bg-red-500 rounded-full mr-3" /> Reading 1,000+ scientific PDFs.</li>
                    <li className="flex items-center text-zinc-400"><span className="w-2 h-2 bg-red-500 rounded-full mr-3" /> Digging through patent filings.</li>
                </ul>
              </div>
              <div className="bg-black/40 rounded-xl p-6 border border-white/5 flex items-center justify-center italic text-zinc-500">
                "It's messy, slow, and expensive. Most potential cures sit on the shelf because it takes too long to evaluate them."
              </div>
            </div>
        </motion.section>

        {/* The Solution (Interactive Cards) */}
        <section className="mb-20">
            <h2 className="text-3xl font-bold text-white mb-12 text-center">Our Solution: An AI Copilot</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { icon: Brain, title: "It Reads Everything", desc: "Our AI reads millions of documents in seconds—trials, patents, and news—so you don't have to.", color: "text-primary", bg: "bg-primary/10", border: "border-primary/20" },
                  { icon: Shield, title: "It Connects the Dots", desc: "It doesn't just give you links. It gives you a Score (0-100) and a recommendation: GO or NO-GO.", color: "text-secondary", bg: "bg-secondary/10", border: "border-secondary/20" },
                  { icon: Clock, title: "It Saves Months", desc: "What used to take a team of analysts 4 weeks, Pharma Scout does in 30 seconds.", color: "text-accent", bg: "bg-accent/10", border: "border-accent/20" }
                ].map((item, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    whileHover={{ y: -5 }}
                    className={`p-8 bg-black/40 border ${item.border} rounded-3xl backdrop-blur-md hover:bg-white/[0.03] transition-colors`}
                  >
                      <div className={`w-14 h-14 ${item.bg} rounded-2xl flex items-center justify-center mb-6`}>
                        <item.icon className={`w-7 h-7 ${item.color}`} />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                      <p className="text-zinc-400 leading-relaxed">{item.desc}</p>
                  </motion.div>
                ))}
            </div>
        </section>

        {/* The Vision */}
        <motion.section 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="text-center border-t border-white/10 pt-16"
        >
            <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
            <p className="max-w-2xl mx-auto text-zinc-400 text-lg">
                We believe that by removing the friction from due diligence, we can accelerate the development of life-saving medicines. We aren't just building software; we are building a compass for the future of healthcare.
            </p>
        </motion.section>

      </main>
    </div>
  );
}

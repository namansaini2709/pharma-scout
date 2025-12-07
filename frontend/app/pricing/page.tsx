"use client";

import { Sparkles, Check } from "lucide-react";
import { motion } from "framer-motion";

export default function PricingPage() {
  return (
    <div className="relative min-h-screen flex flex-col overflow-x-hidden">
       <div className="fixed inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-5 z-0" />
       
      {/* --- Content --- */}
      <main className="relative z-10 pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-bold text-white mb-6"
          >
            Simple, Transparent <span className="text-primary">Pricing.</span>
          </motion.h1>
          <p className="text-xl text-zinc-400">Stop paying for five different databases.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
            
            {/* Starter */}
            <motion.div 
                whileHover={{ y: -10 }}
                className="p-8 rounded-3xl border border-white/10 bg-black/40 backdrop-blur-sm"
            >
                <h3 className="text-lg font-medium text-zinc-400 mb-2">Researcher</h3>
                <div className="text-4xl font-bold text-white mb-6">$499<span className="text-lg text-zinc-600 font-normal">/mo</span></div>
                <ul className="space-y-4 mb-8 text-zinc-300">
                    <li className="flex items-center"><Check className="w-4 h-4 text-zinc-500 mr-3" /> 10 Reports / month</li>
                    <li className="flex items-center"><Check className="w-4 h-4 text-zinc-500 mr-3" /> Basic Signal Scoring</li>
                    <li className="flex items-center"><Check className="w-4 h-4 text-zinc-500 mr-3" /> Clinical & Market Agents</li>
                </ul>
                <button className="w-full py-3 rounded-xl border border-white/20 hover:bg-white/10 transition-colors text-white font-medium">Start Trial</button>
            </motion.div>

            {/* Pro (Venture) */}
            <motion.div 
                initial={{ scale: 0.95 }}
                animate={{ scale: 1.05 }}
                whileHover={{ scale: 1.08 }}
                className="p-10 rounded-3xl border border-primary/50 bg-gradient-to-b from-primary/10 to-black/60 backdrop-blur-md relative shadow-[0_0_40px_rgba(16,185,129,0.15)] z-10"
            >
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary text-black text-xs font-bold px-4 py-1 rounded-full shadow-lg">MOST POPULAR</div>
                <h3 className="text-xl font-bold text-primary mb-2">Venture</h3>
                <div className="text-5xl font-bold text-white mb-6">$1,999<span className="text-lg text-zinc-600 font-normal">/mo</span></div>
                <ul className="space-y-4 mb-10 text-white">
                    <li className="flex items-center"><Check className="w-5 h-5 text-primary mr-3" /> Unlimited Reports</li>
                    <li className="flex items-center"><Check className="w-5 h-5 text-primary mr-3" /> Full Signal Engine Access</li>
                    <li className="flex items-center"><Check className="w-5 h-5 text-primary mr-3" /> All 5 Scout Agents</li>
                    <li className="flex items-center"><Check className="w-5 h-5 text-primary mr-3" /> PDF Export</li>
                </ul>
                <button className="w-full py-4 rounded-xl bg-primary text-black font-bold text-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">Get Started</button>
            </motion.div>

            {/* Enterprise */}
            <motion.div 
                whileHover={{ y: -10 }}
                className="p-8 rounded-3xl border border-white/10 bg-black/40 backdrop-blur-sm"
            >
                <h3 className="text-lg font-medium text-zinc-400 mb-2">Enterprise</h3>
                <div className="text-4xl font-bold text-white mb-6">Custom</div>
                <ul className="space-y-4 mb-8 text-zinc-300">
                    <li className="flex items-center"><Check className="w-4 h-4 text-white mr-3" /> API Access</li>
                    <li className="flex items-center"><Check className="w-4 h-4 text-white mr-3" /> Custom Data Integration</li>
                    <li className="flex items-center"><Check className="w-4 h-4 text-white mr-3" /> Dedicated Analyst Support</li>
                    <li className="flex items-center"><Check className="w-4 h-4 text-white mr-3" /> SSO & Security Compliance</li>
                </ul>
                <button className="w-full py-3 rounded-xl border border-white/20 hover:bg-white/10 transition-colors text-white font-medium">Contact Sales</button>
            </motion.div>

        </div>
      </main>
    </div>
  );
}

"use client";

import { Sparkles, ArrowRight, User, Building, Mail, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { auth } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); // Added password field
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await auth.register(email, password, firstName, lastName);
      // Automatically login after registration and redirect to portfolio
      await auth.login(email, password);
      router.push("/dashboard/portfolio"); 
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden selection:bg-primary/30">
      
      {/* --- Background Effects --- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-accent/5 rounded-full mix-blend-screen filter blur-[120px] animate-blob" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary/5 rounded-full mix-blend-screen filter blur-[120px] animate-blob animation-delay-2000" />
      </div>
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10" />

      {/* --- Signup Card --- */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-lg"
      >
        <div className="glass rounded-2xl p-8 border border-white/10 shadow-2xl backdrop-blur-xl bg-black/40">
          
          {/* Header */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-accent/20 to-primary/20 mb-4 group hover:scale-105 transition-transform">
              <Sparkles className="w-6 h-6 text-white group-hover:text-accent transition-colors" />
            </Link>
            <h1 className="text-2xl font-bold text-white mb-2">Request Early Access</h1>
            <p className="text-zinc-400 text-sm">Join the top pharma teams using Pharma Scout.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSignup} className="space-y-4">
            {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider ml-1">First Name</label>
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-zinc-500 group-focus-within:text-white transition-colors" />
                    </div>
                    <input 
                    type="text" 
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white placeholder-zinc-600 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all"
                    placeholder="Jane"
                    />
                </div>
                </div>
                <div className="space-y-2">
                <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider ml-1">Last Name</label>
                <div className="relative group">
                    <input 
                    type="text" 
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-white placeholder-zinc-600 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all"
                    placeholder="Doe"
                    />
                </div>
                </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider ml-1">Work Email</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-zinc-500 group-focus-within:text-white transition-colors" />
                </div>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white placeholder-zinc-600 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider ml-1">Password</label>
              <div className="relative group">
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-white placeholder-zinc-600 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-zinc-200 transition-colors flex items-center justify-center group mt-6 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                  <>Create Account <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" /></>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center text-sm text-zinc-500">
            Already have an account?{" "}
            <Link href="/login" className="text-white hover:text-accent transition-colors font-medium">
              Sign In
            </Link>
          </div>

        </div>
      </motion.div>
    </div>
  );
}

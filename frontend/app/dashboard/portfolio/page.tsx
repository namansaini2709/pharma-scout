"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FileText, Calendar, ArrowRight, Loader2, Search, TrendingUp, PieChart, User } from "lucide-react";
import { motion } from "framer-motion";

interface SavedReport {
  job_id: string;
  query: string;
  status: string;
  scores: {
    overall_score: number;
  };
  narrative: {
    recommendation: string;
    summary: string;
  };
}

interface UserProfile {
    first_name: string;
    last_name: string;
    email: string;
}

export default function PortfolioPage() {
  const router = useRouter();
  const [reports, setReports] = useState<SavedReport[]>([]);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = auth.getToken();
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchData = async () => {
      try {
        // 1. Fetch Reports
        const reportsRes = await fetch("http://localhost:8000/users/me/reports", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        
        // 2. Fetch User Profile
        const userRes = await fetch("http://localhost:8000/users/me", {
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (reportsRes.ok) {
          const reportsData = await reportsRes.json();
          setReports(reportsData.reverse());
        } else {
            console.error("Reports fetch failed", reportsRes.status);
        }

        if (userRes.ok) {
            const userData = await userRes.json();
            setUser(userData);
        } else {
            console.error("User fetch failed", userRes.status);
        }

      } catch (e) {
        console.error("Failed to fetch data", e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  // Stats Calculation
  const totalReports = reports.length;
  const highPotential = reports.filter(r => r.scores.overall_score > 75).length;
  // Simple heuristic for "Top Area" (just finding most common word in queries for now)
  const topArea = reports.length > 0 ? "Metabolic" : "N/A"; // Placeholder logic

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-white">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20 overflow-x-hidden selection:bg-primary/30 pt-24">
       <div className="fixed inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-5 z-0" />
       
       {/* Floating Top Left: New Search */}
       <Link href="/" className="fixed top-28 left-6 z-40 flex items-center space-x-2 px-4 py-2 rounded-full border border-white/10 bg-black/60 backdrop-blur-xl shadow-lg hover:bg-white/10 transition-colors">
            <Search className="w-4 h-4 text-zinc-400" />
            <span className="text-sm font-medium text-zinc-400">New Search</span>
       </Link>

       {/* Floating Top Right: User Profile */}
       <div className="fixed top-28 right-6 z-40 flex items-center space-x-2 px-4 py-2 rounded-full border border-white/10 bg-black/60 backdrop-blur-xl shadow-lg">
            <div className="w-6 h-6 bg-zinc-800 rounded-full flex items-center justify-center text-xs font-bold text-zinc-400 border border-white/10">
                {user?.first_name?.[0]}{user?.last_name?.[0]}
            </div>
            <span className="text-sm font-medium text-white">
                {user?.first_name} {user?.last_name}
            </span>
       </div>

      <main className="relative z-10 max-w-5xl mx-auto px-6 pt-32"> {/* Increased pt to make space for floating tabs */}
        
        {/* Header & Stats */}
        <div className="mb-12">
            <h1 className="text-4xl font-bold text-white mb-2">
                Welcome back, <span className="text-primary">{user?.first_name || "Scout"}</span>.
            </h1>
            <p className="text-zinc-400 mb-8">Here is the status of your intelligence portfolio.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-zinc-400 text-sm font-medium uppercase tracking-wider">Total Analyses</span>
                        <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div className="text-4xl font-bold text-white">{totalReports}</div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-zinc-400 text-sm font-medium uppercase tracking-wider">High Potential</span>
                        <TrendingUp className="w-5 h-5 text-secondary" />
                    </div>
                    <div className="text-4xl font-bold text-white">{highPotential}</div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-zinc-400 text-sm font-medium uppercase tracking-wider">Top Area</span>
                        <PieChart className="w-5 h-5 text-accent" />
                    </div>
                    <div className="text-2xl font-bold text-white mt-2">{topArea}</div>
                </div>
            </div>
        </div>

        <h2 className="text-xl font-bold text-white mb-6 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-zinc-500" /> Recent Activity
        </h2>

        {reports.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-white/10 rounded-3xl">
                <p className="text-zinc-500 mb-4">No reports found.</p>
                <Link href="/" className="text-primary hover:underline">Start your first analysis</Link>
            </div>
        ) : (
            <div className="grid grid-cols-1 gap-4">
                {reports.map((report, i) => (
                    <motion.div 
                        key={report.job_id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="group bg-white/5 border border-white/10 hover:bg-white/10 rounded-2xl p-6 transition-all cursor-pointer flex flex-col md:flex-row items-start md:items-center justify-between"
                        onClick={() => {
                            router.push(`/dashboard?q=${encodeURIComponent(report.query)}`);
                        }}
                    >
                        <div className="flex items-start space-x-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold ${
                                report.scores.overall_score > 75 ? "bg-primary/20 text-primary" : 
                                report.scores.overall_score < 40 ? "bg-red-500/20 text-red-500" : "bg-yellow-500/20 text-yellow-500"
                            }`}>
                                {report.scores.overall_score}
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white capitalize mb-1 group-hover:text-primary transition-colors">{report.query}</h3>
                                <p className="text-sm text-zinc-400 max-w-xl line-clamp-1">{report.narrative.summary}</p>
                                <div className="flex items-center mt-2 space-x-4 text-xs text-zinc-500">
                                    <span className="font-mono text-zinc-600">ID: {report.job_id.slice(0,8)}</span>
                                    <span className={`font-bold ${
                                        report.narrative.recommendation === "GO" ? "text-primary" : "text-zinc-400"
                                    }`}>{report.narrative.recommendation.replace("_", " ")}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="mt-4 md:mt-0">
                            <button className="p-2 rounded-full border border-white/10 hover:bg-white/20 text-white transition-colors">
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        )}

      </main>
    </div>
  );
}
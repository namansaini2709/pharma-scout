"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Activity, Globe, ShieldCheck, Database, FileText, ArrowLeft, Loader2, Download, Share2 } from "lucide-react";
import Link from "next/link";
import dynamicLoader from "next/dynamic";
import { ReportDocument } from "@/components/ReportPDF";
import { auth } from "@/lib/auth";

const PDFDownloadLink = dynamicLoader(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  {
    ssr: false,
    loading: () => <button className="flex items-center text-sm font-bold bg-zinc-200 text-zinc-400 px-4 py-2 rounded-lg cursor-not-allowed">Loading PDF...</button>,
  }
);

interface ScoreCard {
  scientific_fit: number;
  commercial_potential: number;
  ip_risk: number;
  supply_feasibility: number;
  overall_score: number;
}

interface Narrative {
  summary: string;
  recommendation: string;
  rationale: { [key: string]: string };
  risks: string[];
  next_steps: string[];
}

interface AgentSummary {
  agent_name: string;
  status: string;
  summary: string;
  key_findings: string[];
}

interface JobResult {
  job_id: string;
  query: string;
  status: string;
  scores: ScoreCard;
  narrative: Narrative;
  agent_details: AgentSummary[];
}

export default function DashboardClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  
  const [data, setData] = useState<JobResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState("");

  const loadingSteps = [
      "Connecting to ClinicalTrials.gov API...",
      "Scanning PubMed for recent literature...",
      "Analyzing Market & IP Landscape...",
      "Synthesizing Opportunity Score...",
      "Finalizing Report..."
  ];

  useEffect(() => {
    if (loading) {
        const interval = setInterval(() => {
            setLoadingStep((prev) => (prev + 1) % loadingSteps.length);
        }, 2500);
        return () => clearInterval(interval);
    }
  }, [loading]);

  useEffect(() => {
    const token = auth.getToken();
    if (!token) {
        router.push("/login");
        return;
    }

    if (!query) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setLoadingStep(0);
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/evaluate`, {
          method: "POST",
          headers: { 
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}` 
          },
          body: JSON.stringify({ query: query }),
        });

        if (res.status === 401) {
            auth.logout();
            return;
        }

        if (!res.ok) throw new Error("Failed to fetch intelligence");
        
        const result = await res.json();
        setData(result);
      } catch (err) {
        setError("Failed to generate report. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [query, router]);

  if (loading || !query) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-white overflow-hidden relative">
        <div className="fixed inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10 z-0" />
        
        <div className="relative z-10 flex flex-col items-center">
            <div className="relative w-24 h-24 mb-8">
                <div className="absolute inset-0 border-4 border-white/10 rounded-full" />
                <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin" />
                <Activity className="absolute inset-0 m-auto w-8 h-8 text-primary animate-pulse" />
            </div>
            
            <motion.h2 
                key={loadingStep}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-2xl font-bold text-center min-h-[40px]"
            >
                {loadingSteps[loadingStep]}
            </motion.h2>
            
            <div className="flex space-x-2 mt-4">
                {loadingSteps.map((_, i) => (
                    <div 
                        key={i} 
                        className={`w-2 h-2 rounded-full transition-colors duration-500 ${i === loadingStep ? "bg-primary" : "bg-white/10"}`} 
                    />
                ))}
            </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-white">
        <div className="text-center">
            <h2 className="text-xl text-red-500 mb-4">{error}</h2>
            <Link href="/" className="text-zinc-400 hover:text-white underline">Return Home</Link>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="min-h-screen bg-background pb-20 overflow-x-hidden selection:bg-primary/30 pt-24">
       <div className="fixed inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-5 z-0" />
      
      <div className="sticky top-24 z-40 border border-white/10 bg-black/40 backdrop-blur-xl px-6 py-4 flex items-center justify-between rounded-2xl mx-6 shadow-lg">
        <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center text-zinc-400 hover:text-white transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Search
            </Link>
            <Link href="/dashboard/portfolio" className="flex items-center text-sm font-medium text-zinc-400 hover:text-white transition-colors">
                <FileText className="w-4 h-4 mr-2" /> My Portfolio
            </Link>
        </div>
        <div className="flex items-center space-x-4">
            <button className="flex items-center text-sm font-medium text-zinc-400 hover:text-white transition-colors">
                <Share2 className="w-4 h-4 mr-2" /> Share
            </button>
            {data && (
              <PDFDownloadLink
                document={<ReportDocument data={data} />}
                fileName={`PharmaScout_Report_${data.query}.pdf`}
              >
                {/* @ts-ignore */}
                {({ blob, url, loading, error }) => (
                  <button className="flex items-center text-sm font-bold bg-white text-black px-4 py-2 rounded-lg hover:bg-zinc-200 transition-colors">
                    <Download className="w-4 h-4 mr-2" /> 
                    {loading ? 'Preparing...' : 'Export PDF'}
                  </button>
                )}
              </PDFDownloadLink>
            )}
        </div>
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12">
            <div>
                <div className="text-sm font-medium text-primary mb-2 uppercase tracking-widest">Opportunity Analysis Report</div>
                <h1 className="text-4xl md:text-5xl font-bold text-white capitalize">{data.query}</h1>
                <p className="text-zinc-400 mt-2 max-w-2xl">{data.narrative.summary}</p>
            </div>
            <div className="mt-8 md:mt-0 flex items-center bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                <div className="relative w-24 h-24 flex items-center justify-center mr-6">
                    <svg className="absolute w-full h-full transform -rotate-90">
                        <circle cx="48" cy="48" r="40" stroke="#333" strokeWidth="8" fill="none" />
                        <circle 
                            cx="48" cy="48" r="40" 
                            stroke={data.scores.overall_score > 75 ? "#10b981" : data.scores.overall_score > 50 ? "#facc15" : "#ef4444"} 
                            strokeWidth="8" 
                            fill="none" 
                            strokeDasharray="251.2" 
                            strokeDashoffset={251.2 - (251.2 * data.scores.overall_score) / 100}
                            className="transition-all duration-1000 ease-out"
                        />
                    </svg>
                    <span className="text-3xl font-bold text-white">{data.scores.overall_score}</span>
                </div>
                <div>
                    <div className="text-sm text-zinc-400 uppercase tracking-wider font-semibold">Overall Score</div>
                    <div className={`text-xl font-bold ${
                        data.narrative.recommendation === "GO" ? "text-primary" : 
                        data.narrative.recommendation === "NO_GO" ? "text-red-500" : "text-yellow-500"
                    }`}>
                        {data.narrative.recommendation.replace("_", " ")}
                    </div>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
                <section className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                        <FileText className="w-5 h-5 mr-3 text-primary" /> Executive Rationale
                    </h2>
                    <div className="space-y-6">
                        <div className="p-4 bg-black/40 rounded-xl border border-white/5">
                            <h3 className="text-primary font-semibold mb-2 text-sm uppercase">Scientific Fit</h3>
                            <p className="text-zinc-300 leading-relaxed">{data.narrative.rationale.scientific}</p>
                        </div>
                        <div className="p-4 bg-black/40 rounded-xl border border-white/5">
                            <h3 className="text-secondary font-semibold mb-2 text-sm uppercase">Commercial Potential</h3>
                            <p className="text-zinc-300 leading-relaxed">{data.narrative.rationale.commercial}</p>
                        </div>
                        <div className="p-4 bg-black/40 rounded-xl border border-white/5">
                            <h3 className="text-accent font-semibold mb-2 text-sm uppercase">IP & Legal</h3>
                            <p className="text-zinc-300 leading-relaxed">{data.narrative.rationale.ip}</p>
                        </div>
                    </div>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <section className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm">
                        <h2 className="text-xl font-bold text-white mb-4 text-red-400">Key Risks</h2>
                        <ul className="space-y-3">
                            {data.narrative.risks.map((risk, i) => (
                                <li key={i} className="flex items-start text-zinc-300 text-sm">
                                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5 mr-3 flex-shrink-0" />
                                    {risk}
                                </li>
                            ))}
                        </ul>
                    </section>
                    <section className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm">
                        <h2 className="text-xl font-bold text-white mb-4 text-primary">Strategic Next Steps</h2>
                         <ul className="space-y-3">
                            {data.narrative.next_steps.map((step, i) => (
                                <li key={i} className="flex items-start text-zinc-300 text-sm">
                                    <span className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 mr-3 flex-shrink-0" />
                                    {step}
                                </li>
                            ))}
                        </ul>
                    </section>
                </div>
            </div>

            <div className="space-y-8">
                <section className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm">
                     <h2 className="text-xl font-bold text-white mb-6">Score Breakdown</h2>
                     <div className="space-y-5">
                        {[
                            { label: "Scientific Fit", score: data.scores.scientific_fit, color: "bg-primary", icon: Activity },
                            { label: "Commercial", score: data.scores.commercial_potential, color: "bg-secondary", icon: Globe },
                            { label: "IP Risk (Inverse)", score: 100 - data.scores.ip_risk, color: "bg-accent", icon: ShieldCheck },
                            { label: "Supply Chain", score: data.scores.supply_feasibility, color: "bg-zinc-500", icon: Database },
                        ].map((item, i) => (
                            <div key={i}>
                                <div className="flex justify-between text-sm font-medium text-zinc-300 mb-2">
                                    <div className="flex items-center">
                                        <item.icon className="w-4 h-4 mr-2 opacity-70" />
                                        {item.label}
                                    </div>
                                    <span>{item.score}/100</span>
                                </div>
                                <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${item.score}%` }}
                                        transition={{ duration: 1, delay: 0.5 + (i * 0.1) }}
                                        className={`h-full ${item.color}`} 
                                    />
                                </div>
                            </div>
                        ))}
                     </div>
                </section>

                <section className="bg-black border border-white/10 rounded-3xl p-6 font-mono text-xs overflow-hidden">
                     <h2 className="text-sm font-bold text-zinc-500 mb-4 uppercase tracking-widest border-b border-zinc-800 pb-2">Agent Telemetry</h2>
                     <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        {data.agent_details.map((agent, i) => (
                            <div key={i} className="mb-4">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-primary font-bold">[{agent.agent_name}]</span>
                                    <span className="text-zinc-600">{agent.status}</span>
                                </div>
                                <p className="text-zinc-400 mb-2">&gt; {agent.summary}</p>
                                <div className="pl-2 border-l border-zinc-800 space-y-1">
                                    {agent.key_findings.map((k, j) => (
                                        <div key={j} className="text-zinc-500 truncate">• {k}</div>
                                    ))}
                                </div>
                            </div>
                        ))}
                     </div>
                </section>
            </div>
        </div>
      </main>
    </div>
  );
}

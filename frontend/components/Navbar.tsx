"use client";

import { Sparkles } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  // Don't show navbar on login/signup pages if you prefer a clean look there
  // if (pathname === "/login" || pathname === "/signup") return null;

  return (
    <div className="fixed top-6 inset-x-0 z-50 flex justify-center px-4 pointer-events-none">
      <nav className="pointer-events-auto flex items-center justify-between w-full max-w-2xl px-6 py-3 rounded-full border border-white/10 bg-black/60 backdrop-blur-xl shadow-2xl ring-1 ring-white/5">
        
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.3)] group-hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] transition-shadow">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white hidden sm:block">Pharma Scout</span>
        </Link>
        
        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-6 text-sm font-medium text-zinc-400">
          <Link 
            href="/about" 
            className={`hover:text-white transition-colors ${pathname === '/about' ? 'text-white' : ''}`}
          >
            About
          </Link>
          <Link 
            href="/features" 
            className={`hover:text-white transition-colors ${pathname === '/features' ? 'text-white' : ''}`}
          >
            Features
          </Link>
          <Link 
            href="/methodology" 
            className={`hover:text-white transition-colors ${pathname === '/methodology' ? 'text-white' : ''}`}
          >
            Engine
          </Link>
          <Link 
            href="/pricing" 
            className={`hover:text-white transition-colors ${pathname === '/pricing' ? 'text-white' : ''}`}
          >
            Pricing
          </Link>
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center space-x-3">
            <Link href="/login" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors px-2">
              Login
            </Link>
            <Link href="/signup" className="text-xs font-semibold bg-white text-black px-4 py-2 rounded-full hover:bg-zinc-200 transition-colors shadow-lg shadow-white/10">
              Get Started
            </Link>
        </div>
      </nav>
    </div>
  );
}

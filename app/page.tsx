"use client";
import React, { useState, useEffect } from "react";
import ApplyModal, { LoginModal } from "@/components/ApplyModal";
import { Twitter, Linkedin, Github, Mail, Activity, Star, Globe } from "lucide-react";
import { Footer } from "@/components/ui/modem-animated-footer";
import DownloadButton from "@/components/DownloadButton";
import FeatureGrid from "@/components/FeatureGrid";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function Home() {
  const [showApply, setShowApply] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [appStars, setAppStars] = useState<number | null>(null);
  const [webStars, setWebStars] = useState<number | null>(null);
  const { user, isLoading } = useAuth();
  const router = useRouter();

  // Auto-redirect logged-in users to dashboard
  useEffect(() => {
    if (!isLoading && user) {
      router.replace("/dashboard");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    const fetchAppStars = async () => {
      try {
        const res = await fetch("https://api.github.com/repos/Sahnik0/callu", {
          headers: { Accept: "application/vnd.github.v3+json" },
          next: { revalidate: 60 },
        } as RequestInit);
        if (res.ok) {
          const data = await res.json();
          setAppStars(data.stargazers_count);
        }
      } catch (e) {
        console.error("Failed to fetch App GitHub stars", e);
      }
    };
    
    const fetchWebStars = async () => {
      try {
        const res = await fetch("https://api.github.com/repos/sanks011/callu", {
          headers: { Accept: "application/vnd.github.v3+json" },
          next: { revalidate: 60 },
        } as RequestInit);
        if (res.ok) {
          const data = await res.json();
          setWebStars(data.stargazers_count);
        }
      } catch (e) {
        console.error("Failed to fetch Web GitHub stars", e);
      }
    };

    fetchAppStars();
    fetchWebStars();
    const interval = setInterval(() => {
      fetchAppStars();
      fetchWebStars();
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden flex flex-col items-center selection:bg-emerald-500/30">
      
      {/* Premium Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        {/* Subtle grid mesh */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        
        {/* Glowing orbs */}
        <div className="absolute top-[-10%] right-[10%] w-[600px] h-[600px] bg-emerald-900/20 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-zinc-800/30 rounded-full blur-[150px]" />
        
        {/* Vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black pointer-events-none" />
      </div>

      <nav className="relative z-50 flex justify-between items-center px-6 md:px-12 py-8 w-full max-w-[90rem]">
        <div className="flex items-center gap-1.5 group cursor-pointer">
           <h1 className="text-2xl font-bold tracking-tight text-white flex items-center">
             CALLU
             <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full ml-1 mb-0.5 transition-all duration-500 group-hover:scale-150 group-hover:shadow-[0_0_12px_rgba(16,185,129,0.8)]"></span>
           </h1>
        </div>
        
        <div className="flex items-center gap-6 md:gap-8">
          <div className="hidden md:flex items-center gap-6">
            <a
              href="https://github.com/Sahnik0/callu"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm font-medium"
            >
              <Github size={16} />
              <span>App</span>
              <div className="flex items-center gap-1 text-zinc-500 group-hover:text-emerald-400 bg-white/5 px-2 py-0.5 rounded-full border border-white/5 transition-all">
                <Star size={12} className="fill-current" />
                <span className="tabular-nums text-xs">{appStars !== null ? appStars : '-'}</span>
              </div>
            </a>
            
            <a
              href="https://github.com/sanks011/callu"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm font-medium"
            >
              <Globe size={16} />
              <span>Web</span>
              <div className="flex items-center gap-1 text-zinc-500 group-hover:text-emerald-400 bg-white/5 px-2 py-0.5 rounded-full border border-white/5 transition-all">
                <Star size={12} className="fill-current" />
                <span className="tabular-nums text-xs">{webStars !== null ? webStars : '-'}</span>
              </div>
            </a>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowLogin(true)}
              className="px-6 py-2.5 text-sm font-semibold text-zinc-300 hover:text-white border border-white/10 hover:border-white/20 hover:bg-white/5 rounded-full transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.05)]"
            >
              Sign In
            </button>
          </div>
        </div>
      </nav>

      <div className="relative z-10 flex flex-col items-center justify-center px-4 text-center w-full max-w-6xl pt-20 md:pt-32 pb-24 flex-1">

        {/* Social Proof Removed */}

        <h2 className="hero-fade-1 text-5xl md:text-6xl font-medium tracking-tighter mb-6 max-w-4xl text-pretty leading-[0.95] select-none text-center">
          The curated community <br className="hidden md:block" /> for <span className="font-playfair bg-gradient-to-b from-emerald-300 via-emerald-100 to-white bg-clip-text text-transparent italic px-2 py-1 box-decoration-clone leading-tight">meaningful connections.</span>
        </h2>

        <p className="hero-fade-2 font-dm text-lg md:text-xl text-zinc-400/90 max-w-2xl mb-12 font-light leading-relaxed text-center">
            A private space for professionals, creators, and visionaries. 
            Connect through voice, video, and serendipity.
        </p>

        {/* CTA: Primary */}
        <div className="hero-fade-4 flex items-center justify-center mb-10 w-full">
          <button
            onClick={() => setShowApply(true)}
            className="group relative flex items-center gap-2 px-8 py-4 rounded-full bg-emerald-600/90 hover:bg-emerald-500 text-white font-medium text-sm md:text-base transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_28px_rgba(16,185,129,0.4)] active:scale-[0.97] shadow-[0_0_20px_rgba(16,185,129,0.2)] overflow-hidden"
          >
            {/* Shimmer sweep effect on hover */}
            <span className="absolute inset-0 w-full h-full rounded-full overflow-hidden pointer-events-none">
               <span className="absolute top-0 -left-[100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 group-hover:animate-sweep" />
            </span>
            {/* Live dot */}
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
            </span>
            Get Started
            {/* Arrow */}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-all duration-300">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px w-10 bg-zinc-800" />
          <span className="text-zinc-500 text-[10px] uppercase tracking-[0.15em] font-medium">or get the desktop app</span>
          <div className="h-px w-10 bg-zinc-800" />
        </div>

        {/* Download buttons */}
        <div className="hero-fade-5 flex items-center justify-center gap-3 mb-16 md:mb-20">
          <DownloadButton href="/Callu-Setup-2.0.0.exe" os="windows" />
          <DownloadButton href="/callu-desktop_2.0.0_amd64.deb" os="linux" />
        </div>

      </div>

      <FeatureGrid />

      <div className="w-full relative z-10">
        <Footer
          brandName="CALLU"
          brandDescription="The curated community for meaningful connections."
          socialLinks={[
            { icon: <Twitter className="w-5 h-5" />, href: "#", label: "Twitter" },
            { icon: <Linkedin className="w-5 h-5" />, href: "#", label: "LinkedIn" },
            { icon: <Github className="w-5 h-5" />, href: "#", label: "GitHub" },
            { icon: <Mail className="w-5 h-5" />, href: "#", label: "Email" },
          ]}
          navLinks={[
            { label: "Manifesto", href: "#" },
            { label: "Community", href: "#" },
            { label: "Privacy", href: "#" },
            { label: "Terms", href: "#" },
          ]}
          brandIcon={<Activity className="w-8 h-8 text-emerald-500" />}
        />
      </div>

      {showApply && <ApplyModal onClose={() => setShowApply(false)} />}
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </main>
  );
}

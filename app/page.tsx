"use client";
import React, { useState, useEffect } from "react";
import ApplyModal, { LoginModal } from "@/components/ApplyModal";
import { Mic, Shield, Lock, Zap, Twitter, Linkedin, Github, Mail, Activity, Star, Globe, Monitor } from "lucide-react";
import { Footer } from "@/components/ui/modem-animated-footer";
import DownloadButton from "@/components/DownloadButton";

export default function Home() {
  const [showApply, setShowApply] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [appStars, setAppStars] = useState<number | null>(null);
  const [webStars, setWebStars] = useState<number | null>(null);

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
    <main className="min-h-screen bg-black text-white relative overflow-hidden flex flex-col items-center">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-emerald-900/10 rounded-full blur-[128px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-zinc-800/20 rounded-full blur-[128px]" />
      </div>

      <nav className="relative z-10 flex justify-between items-center px-8 py-8 w-full max-w-7xl">
        <div className="flex items-center gap-1 group cursor-default">
           <h1 className="text-3xl font-black tracking-tighter text-white">CALLU</h1>
           <div className="w-2 h-2 bg-emerald-500 rounded-full mt-3 transition-all duration-500 group-hover:scale-125 group-hover:shadow-[0_0_12px_rgba(16,185,129,0.8)]"></div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-5 mr-2">
            <a
              href="https://github.com/Sahnik0/callu"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-1.5 text-zinc-400 hover:text-white transition-all text-sm font-medium"
            >
              <Github size={16} />
              <span>App</span>
              <div className="flex items-center gap-0.5 ml-1 text-zinc-500 group-hover:text-emerald-400">
                <Star size={12} className="fill-current" />
                <span className="tabular-nums">{appStars !== null ? appStars : '-'}</span>
              </div>
            </a>
            
            <a
              href="https://github.com/sanks011/callu"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-1.5 text-zinc-400 hover:text-white transition-all text-sm font-medium"
            >
              <Globe size={16} />
              <span>Web</span>
              <div className="flex items-center gap-0.5 ml-1 text-zinc-500 group-hover:text-emerald-400">
                <Star size={12} className="fill-current" />
                <span className="tabular-nums">{webStars !== null ? webStars : '-'}</span>
              </div>
            </a>
          </div>

          <button
            onClick={() => setShowLogin(true)}
            className="px-5 py-2 text-sm font-medium text-zinc-300 hover:text-white border border-zinc-700/70 hover:border-zinc-500 rounded-full transition-all duration-200 hover:bg-zinc-800/60 backdrop-blur-sm"
          >
            Login
          </button>
        </div>
      </nav>

      <div className="relative z-10 flex flex-col items-center justify-center px-4 text-center w-full max-w-5xl pt-16 md:pt-24 pb-12">

        {/* Social Proof Removed */}

        <h2 className="hero-fade-1 text-5xl md:text-6xl font-medium tracking-tighter mb-6 max-w-4xl text-pretty leading-[0.95] select-none">
          The curated community <br className="hidden md:block" /> for <span className="font-playfair bg-gradient-to-b from-emerald-300 via-emerald-100 to-white bg-clip-text text-transparent italic px-2 py-1 box-decoration-clone leading-tight">meaningful connections.</span>
        </h2>

        <p className="hero-fade-2 font-dm text-lg md:text-xl text-zinc-400/90 max-w-2xl mb-12 font-light leading-relaxed">
            A private space for professionals, creators, and visionaries. 
            Connect through voice, video, and serendipity.
        </p>

        {/* CTA: Primary */}
        <div className="hero-fade-4 mb-6">
          <button
            onClick={() => setShowLogin(true)}
            className="group relative flex items-center gap-2 px-7 py-3 md:px-8 md:py-3.5 rounded-full border border-emerald-500/30 bg-zinc-950/80 hover:border-emerald-500/70 hover:bg-zinc-900/90 text-white font-medium text-sm md:text-base transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_24px_rgba(16,185,129,0.15)] active:scale-[0.97] backdrop-blur-sm shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] overflow-hidden"
          >
            {/* Shimmer sweep effect on hover */}
            <span className="absolute inset-0 w-full h-full rounded-full overflow-hidden pointer-events-none">
               <span className="absolute top-0 -left-[100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 group-hover:animate-sweep" />
            </span>
            {/* Live dot */}
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            Try Browser Version
            {/* Arrow */}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all duration-300">
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

        {/* Bento Grid Teaser */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl px-4 pb-24 text-left">
             
             {/* Card 1: Exclusive Access */}
             <div className="group relative overflow-hidden bg-zinc-900/30 border border-zinc-800/60 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:bg-zinc-900/50 hover:border-emerald-500/30 hover:shadow-[0_8px_24px_-12px_rgba(16,185,129,0.15)]">
                   <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                   <div className="relative z-10">
                     <div className="flex items-center gap-3 mb-3">
                       <div className="p-2.5 rounded-xl bg-zinc-800/50 border border-zinc-700/50 group-hover:border-emerald-500/30 group-hover:bg-emerald-500/10 transition-all duration-300">
                         <Lock className="text-zinc-400 group-hover:text-emerald-400 transition-all duration-300 group-hover:scale-110" size={18} />
                       </div>
                       <h3 className="text-lg md:text-xl font-medium text-zinc-100 group-hover:text-white transition-colors">Exclusive Access</h3>
                     </div>
                     <p className="text-zinc-400 text-sm font-light leading-relaxed group-hover:text-zinc-300 transition-colors">
                       Manual curation ensures a high-trust environment. We accept less than 1% of applicants.
                     </p>
                   </div>
             </div>
             
             {/* Card 2: Instant Connect */}
             <div className="group relative overflow-hidden bg-zinc-900/30 border border-zinc-800/60 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:bg-zinc-900/50 hover:border-emerald-500/30 hover:shadow-[0_8px_24px_-12px_rgba(16,185,129,0.15)]">
                   <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                   <div className="relative z-10">
                     <div className="flex items-center gap-3 mb-3">
                       <div className="p-2.5 rounded-xl bg-zinc-800/50 border border-zinc-700/50 group-hover:border-emerald-500/30 group-hover:bg-emerald-500/10 transition-all duration-300">
                         <Zap className="text-zinc-400 group-hover:text-emerald-400 transition-all duration-300 group-hover:scale-110" size={18} />
                       </div>
                       <h3 className="text-lg md:text-xl font-medium text-zinc-100 group-hover:text-white transition-colors">Instant Connect</h3>
                     </div>
                     <p className="text-zinc-400 text-sm font-light leading-relaxed group-hover:text-zinc-300 transition-colors">
                       See who&apos;s online and jump right into serendipitous conversations effortlessly.
                     </p>
                   </div>
             </div>

             {/* Card 3: Privacy */}
             <div className="group relative overflow-hidden bg-zinc-900/30 border border-zinc-800/60 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:bg-zinc-900/50 hover:border-emerald-500/30 hover:shadow-[0_8px_24px_-12px_rgba(16,185,129,0.15)]">
                   <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                   <div className="relative z-10">
                     <div className="flex items-center gap-3 mb-3">
                       <div className="p-2.5 rounded-xl bg-zinc-800/50 border border-zinc-700/50 group-hover:border-emerald-500/30 group-hover:bg-emerald-500/10 transition-all duration-300">
                         <Shield className="text-zinc-400 group-hover:text-emerald-400 transition-all duration-300 group-hover:scale-110" size={18} />
                       </div>
                       <h3 className="text-lg md:text-xl font-medium text-zinc-100 group-hover:text-white transition-colors">Private by Design</h3>
                     </div>
                     <p className="text-zinc-400 text-sm font-light leading-relaxed group-hover:text-zinc-300 transition-colors">
                       Your data is yours. Experience end-to-end encrypted signals and complete privacy.
                     </p>
                   </div>
             </div>

             {/* Card 4: Crystal Voice */}
             <div className="group relative overflow-hidden bg-zinc-900/30 border border-zinc-800/60 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:bg-zinc-900/50 hover:border-emerald-500/30 hover:shadow-[0_8px_24px_-12px_rgba(16,185,129,0.15)]">
                   <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                   <div className="relative z-10">
                     <div className="flex items-center gap-3 mb-3">
                       <div className="p-2.5 rounded-xl bg-zinc-800/50 border border-zinc-700/50 group-hover:border-emerald-500/30 group-hover:bg-emerald-500/10 transition-all duration-300">
                         <Mic className="text-zinc-400 group-hover:text-emerald-400 transition-all duration-300 group-hover:scale-110" size={18} />
                       </div>
                       <h3 className="text-lg md:text-xl font-medium text-zinc-100 group-hover:text-white transition-colors">Crystal Clear Audio</h3>
                     </div>
                     <p className="text-zinc-400 text-sm font-light leading-relaxed group-hover:text-zinc-300 transition-colors">
                       Experience high-fidelity, lag-free voice conversations that feel natural.
                     </p>
                   </div>
             </div>

        </div>

      </div>

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

      {showApply && <ApplyModal onClose={() => setShowApply(false)} />}
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </main>
  );
}

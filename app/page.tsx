"use client";
import React, { useState, useEffect } from "react";
import ApplyModal, { LoginModal } from "@/components/ApplyModal";
import { Mic, Shield, Lock, Zap, Twitter, Linkedin, Github, Mail, Activity, Star, Globe, Monitor } from "lucide-react";
import { Footer } from "@/components/ui/modem-animated-footer";
import DownloadButton from "@/components/DownloadButton";

export default function Home() {
  const [showApply, setShowApply] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [githubStars, setGithubStars] = useState<number | null>(null);

  useEffect(() => {
    const fetchStars = async () => {
      try {
        const res = await fetch("https://api.github.com/repos/Sahnik0/callu", {
          headers: { Accept: "application/vnd.github.v3+json" },
          next: { revalidate: 60 },
        } as RequestInit);
        if (res.ok) {
          const data = await res.json();
          setGithubStars(data.stargazers_count);
        }
      } catch (e) {
        console.error("Failed to fetch GitHub stars", e);
      }
    };
    fetchStars();
    const interval = setInterval(fetchStars, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden flex flex-col items-center">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[128px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[128px]" />
      </div>

      <nav className="relative z-10 flex justify-between items-center px-8 py-8 w-full max-w-7xl">
        <div className="flex items-center gap-1">
           <h1 className="text-3xl font-black tracking-tighter text-white">CALLU</h1>
           <div className="w-2 h-2 bg-emerald-500 rounded-full mt-3"></div>
        </div>
        <button
          onClick={() => setShowLogin(true)}
          className="px-5 py-2 text-sm font-medium text-zinc-300 hover:text-white border border-zinc-700/70 hover:border-zinc-500 rounded-full transition-all duration-200 hover:bg-zinc-800/60 backdrop-blur-sm"
        >
          Login
        </button>
      </nav>

      <div className="relative z-10 flex flex-col items-center justify-center px-4 text-center w-full max-w-5xl pt-2">

        <h2 className="hero-fade-1 text-5xl md:text-7xl font-medium tracking-tighter mb-5 max-w-5xl text-pretty leading-[0.95] select-none">
          The curated community <br className="hidden md:block" /> for <span className="font-playfair bg-gradient-to-b from-white via-zinc-200 to-zinc-600 bg-clip-text text-transparent italic px-2 py-1 box-decoration-clone">meaningful connections.</span>
        </h2>

        <p className="hero-fade-2 font-dm text-lg md:text-xl text-zinc-400/90 max-w-2xl mb-6 font-light leading-relaxed">
            A private space for professionals, creators, and visionaries. 
            Connect through voice, video, and serendipity.
        </p>
        
        {/* GitHub Stars Badge — floats gently */}
        <a
          href="https://github.com/Sahnik0/callu"
          target="_blank"
          rel="noopener noreferrer"
          className="hero-fade-3 badge-float group inline-flex items-center gap-2 mb-5 px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/25 hover:border-amber-400/60 transition-all duration-300 cursor-pointer"
        >
          <Star size={13} className="text-amber-400 fill-amber-400 group-hover:scale-125 transition-transform duration-300" />
          <span className="text-amber-300 text-sm font-medium tracking-wide">
            {githubStars !== null ? (
              <span className="tabular-nums">{githubStars.toLocaleString()}</span>
            ) : (
              <span className="inline-block w-6 h-3.5 bg-amber-900/40 rounded animate-pulse align-middle" />
            )}
            {" "}stars on GitHub
          </span>
          <Github size={13} className="text-amber-400/60 group-hover:text-amber-300 transition-colors" />
        </a>

        {/* CTA: Primary */}
        <div className="hero-fade-4 mb-4">
          <button
            onClick={() => setShowLogin(true)}
            className="group relative flex items-center gap-3 px-7 py-3.5 rounded-full border border-emerald-500/25 bg-zinc-950/80 hover:border-emerald-500/60 hover:bg-zinc-900/90 text-white font-medium text-sm transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_24px_rgba(16,185,129,0.12)] active:scale-[0.97] backdrop-blur-sm"
          >
            {/* Live dot */}
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            Try Browser Version
            {/* Arrow */}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all duration-300">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-4">
          <div className="h-px w-10 bg-zinc-800" />
          <span className="text-zinc-700 text-[10px] uppercase tracking-[0.15em] font-medium">or get the desktop app</span>
          <div className="h-px w-10 bg-zinc-800" />
        </div>

        {/* Download buttons */}
        <div className="hero-fade-4 flex items-center justify-center gap-3 mb-6">
          <DownloadButton href="/Callu-Setup-2.0.0.exe" os="windows" />
          <DownloadButton href="/callu-desktop_2.0.0_amd64.deb" os="linux" />
        </div>

        {/* Bento Grid Teaser */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-6 gap-6 w-full max-w-6xl px-4 pb-24">
             
             {/* Card 1: Exclusive Access (Large) */}
             <div className="group col-span-1 md:col-span-4 bg-zinc-900/40 backdrop-blur-md border border-zinc-800/50 rounded-4xl py-8 pr-8 pl-6 hover:bg-zinc-800/60 hover:border-zinc-700 transition-all duration-500 hover:-translate-y-1 cursor-default relative overflow-hidden min-h-[320px] flex flex-col justify-between text-left">
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px] -mr-16 -mt-16 transition-opacity opacity-50 group-hover:opacity-100" />
                <div className="z-10">
                   <div className="w-14 h-14 bg-zinc-800/80 rounded-2xl flex items-center justify-center mb-6 border border-zinc-700/50 group-hover:border-zinc-600 transition-colors">
                     <Lock className="text-zinc-400 group-hover:text-white transition-colors" size={24} />
                   </div>
                   <h3 className="text-3xl font-medium text-white mb-4">Exclusive Access</h3>
                   <p className="text-zinc-400 text-lg font-light max-w-md">Our community is manually curated. We accept less than 1% of applicants to ensure meaningful connections and a high-trust environment.</p>
                </div>
                {/* Visual Ornament */}
                <div className="absolute bottom-0 right-0 translate-x-12 translate-y-12 opacity-30 group-hover:opacity-50 transition-all duration-700">
                    <div className="w-48 h-48 border border-zinc-700 rounded-full flex items-center justify-center">
                        <div className="w-32 h-32 border border-zinc-600 rounded-full flex items-center justify-center">
                           <div className="w-16 h-16 bg-zinc-800 rounded-full"></div>
                        </div>
                    </div>
                </div>
             </div>
             
             {/* Card 2: Instant Connect (Small) */}
             <div className="group col-span-1 md:col-span-2 bg-zinc-900/40 backdrop-blur-md border border-zinc-800/50 rounded-4xl p-8 hover:bg-zinc-800/60 hover:border-zinc-700 transition-all duration-500 hover:-translate-y-1 cursor-default relative overflow-hidden min-h-[320px] flex flex-col justify-between">
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-emerald-500/10 rounded-full blur-[60px] -ml-10 -mb-10 transition-opacity opacity-50 group-hover:opacity-100" />
                <div className="z-10">
                   <div className="w-14 h-14 bg-zinc-800/80 rounded-2xl flex items-center justify-center mb-6 border border-zinc-700/50 group-hover:border-zinc-600 transition-colors">
                      <Zap className="text-zinc-400 group-hover:text-white transition-colors" size={24} />
                   </div>
                   <h3 className="text-2xl font-medium text-white mb-2">Instant Connect</h3>
                   <p className="text-zinc-400 font-light">See who&apos;s online and jump into serendipitous conversations.</p>
                </div>
                <div className="flex gap-2 mt-4 ml-2">
                   <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                   <div className="w-2 h-2 rounded-full bg-emerald-500/50"></div>
                   <div className="w-2 h-2 rounded-full bg-emerald-500/20"></div>
                </div>
             </div>

             {/* Card 3: Privacy (Small) */}
             <div className="group col-span-1 md:col-span-2 bg-zinc-900/40 backdrop-blur-md border border-zinc-800/50 rounded-4xl p-8 hover:bg-zinc-800/60 hover:border-zinc-700 transition-all duration-500 hover:-translate-y-1 cursor-default relative overflow-hidden min-h-[320px] flex flex-col justify-between">
                <div className="absolute top-0 right-0 w-40 h-40 bg-rose-500/10 rounded-full blur-[60px] -mr-10 -mt-10 transition-opacity opacity-50 group-hover:opacity-100" />
                <div className="z-10">
                   <div className="w-14 h-14 bg-zinc-800/80 rounded-2xl flex items-center justify-center mb-6 border border-zinc-700/50 group-hover:border-zinc-600 transition-colors">
                      <Shield className="text-zinc-400 group-hover:text-white transition-colors" size={24} />
                   </div>
                   <h3 className="text-2xl font-medium text-white mb-2">Private by Design</h3>
                   <p className="text-zinc-400 font-light">Your data is yours. End-to-end encrypted signals.</p>
                </div>
                {/* Visual Ornament */}
                <div className="mt-4 flex gap-1 items-center opacity-50">
                    <div className="h-1 w-8 bg-zinc-700 rounded-full"></div>
                    <div className="h-1 w-4 bg-zinc-700 rounded-full"></div>
                    <div className="h-1 w-12 bg-zinc-700 rounded-full"></div>
                </div>
             </div>

             {/* Card 4: Crystal Voice (Large) */}
             <div className="group col-span-1 md:col-span-4 bg-zinc-900/40 backdrop-blur-md border border-zinc-800/50 rounded-4xl p-8 hover:bg-zinc-800/60 hover:border-zinc-700 transition-all duration-500 hover:-translate-y-1 cursor-default relative overflow-hidden min-h-[320px] flex flex-col justify-between">
                <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] transition-opacity opacity-50 group-hover:opacity-100" />
                <div className="relative z-10">
                   <div className="w-14 h-14 bg-zinc-800/80 rounded-2xl flex items-center justify-center mb-6 border border-zinc-700/50 group-hover:border-zinc-600 transition-colors">
                     <Mic className="text-zinc-400 group-hover:text-white transition-colors" size={24} />
                   </div>
                   <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                       <div>
                           <h3 className="text-3xl font-medium text-white mb-4">Crystal Clear Audio</h3>
                           <p className="text-zinc-400 text-lg font-light max-w-md">Experience high-fidelity voice conversations that feel like you&apos;re in the same room. No lag, no noise, just pure connection.</p>
                       </div>
                       
                       {/* Audio Wave Visual */}
                       <div className="flex items-center gap-1 h-12 mb-2 opacity-60 group-hover:opacity-100 transition-opacity">
                            {[40, 60, 30, 80, 50, 90, 40, 60, 30, 50, 40, 80, 60, 30, 40].map((h, i) => (
                                <div key={i} className="w-1 bg-blue-500/80 rounded-full animate-[pulse_1s_ease-in-out_infinite]" style={{ height: `${h}%`, animationDelay: `${i * 0.1}s` }} />
                            ))}
                       </div>
                   </div>
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

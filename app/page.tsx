"use client";
import React, { useState } from "react";
import ApplyModal, { LoginModal } from "@/components/ApplyModal";
import { Mic, Shield, Lock, Zap } from "lucide-react";

export default function Home() {
  const [showApply, setShowApply] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden flex flex-col items-center">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[128px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[128px]" />
      </div>

      <nav className="relative z-10 flex justify-between items-center px-8 py-6 w-full max-w-7xl">
        <h1 className="text-2xl font-bold tracking-tighter">CALLU.</h1>
        <button onClick={() => setShowLogin(true)} className="text-sm font-medium text-zinc-400 hover:text-white transition-colors cursor-pointer">
            Member Area
        </button>
      </nav>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] px-4 text-center w-full max-w-5xl">
        
        <div className="mb-8 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/50 border border-zinc-800 text-xs text-zinc-400">
           <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
           Accepting Applications
        </div>

        <h2 className="text-5xl md:text-7xl font-sans font-medium tracking-tight mb-8 max-w-4xl text-pretty leading-tight">
          The curated community for <span className="text-zinc-500">meaningful connections.</span>
        </h2>

        <p className="text-lg md:text-xl text-zinc-400 max-w-xl mb-12">
            A private space for professionals, creators, and visionaries. 
            Connect through voice, video, and serendipity.
        </p>
        
        <button 
          onClick={() => setShowApply(true)}
          className="bg-white text-black text-lg font-medium px-10 py-5 rounded-full hover:scale-105 transition-transform duration-300 cursor-pointer"
        >
            Apply to Join Community
        </button>

        {/* Bento Grid Teaser */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-7xl opacity-0 animate-[fadeIn_1s_ease-out_0.5s_forwards] px-4">
             <div className="group bg-zinc-900/40 backdrop-blur-md border border-zinc-800/50 p-8 rounded-3xl hover:bg-zinc-800/60 hover:border-zinc-700 transition-all duration-500 hover:-translate-y-1 cursor-default relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -mr-16 -mt-16 transition-opacity opacity-0 group-hover:opacity-100" />
                <div className="w-14 h-14 bg-zinc-800/50 rounded-2xl flex items-center justify-center mb-6 border border-zinc-700/50 group-hover:border-zinc-600 transition-colors">
                  <Lock className="text-zinc-400 group-hover:text-white transition-colors" size={24} />
                </div>
                <h3 className="text-xl font-medium text-white mb-3">Exclusive Access</h3>
                <p className="text-sm text-zinc-500 leading-relaxed font-light">Manually verified community ensures high-quality connections and privacy.</p>
             </div>
             
             <div className="group bg-zinc-900/40 backdrop-blur-md border border-zinc-800/50 p-8 rounded-3xl hover:bg-zinc-800/60 hover:border-zinc-700 transition-all duration-500 hover:-translate-y-1 cursor-default relative overflow-hidden lg:translate-y-8">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16 transition-opacity opacity-0 group-hover:opacity-100" />
                <div className="w-14 h-14 bg-zinc-800/50 rounded-2xl flex items-center justify-center mb-6 border border-zinc-700/50 group-hover:border-zinc-600 transition-colors">
                  <Mic className="text-zinc-400 group-hover:text-white transition-colors" size={24} />
                </div>
                <h3 className="text-xl font-medium text-white mb-3">Crystal Voice</h3>
                <p className="text-sm text-zinc-500 leading-relaxed font-light">High-fidelity audio streaming for conversations that feel like you&apos;re in the same room.</p>
             </div>

             <div className="group bg-zinc-900/40 backdrop-blur-md border border-zinc-800/50 p-8 rounded-3xl hover:bg-zinc-800/60 hover:border-zinc-700 transition-all duration-500 hover:-translate-y-1 cursor-default relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-16 -mt-16 transition-opacity opacity-0 group-hover:opacity-100" />
                <div className="w-14 h-14 bg-zinc-800/50 rounded-2xl flex items-center justify-center mb-6 border border-zinc-700/50 group-hover:border-zinc-600 transition-colors">
                   <Zap className="text-zinc-400 group-hover:text-white transition-colors" size={24} />
                </div>
                <h3 className="text-xl font-medium text-white mb-3">Instant Connect</h3>
                <p className="text-sm text-zinc-500 leading-relaxed font-light">Real-time presence and instant serendipitous connections with online members.</p>
             </div>

             <div className="group bg-zinc-900/40 backdrop-blur-md border border-zinc-800/50 p-8 rounded-3xl hover:bg-zinc-800/60 hover:border-zinc-700 transition-all duration-500 hover:-translate-y-1 cursor-default relative overflow-hidden lg:translate-y-8">
                <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-3xl -mr-16 -mt-16 transition-opacity opacity-0 group-hover:opacity-100" />
                <div className="w-14 h-14 bg-zinc-800/50 rounded-2xl flex items-center justify-center mb-6 border border-zinc-700/50 group-hover:border-zinc-600 transition-colors">
                   <Shield className="text-zinc-400 group-hover:text-white transition-colors" size={24} />
                </div>
                <h3 className="text-xl font-medium text-white mb-3">Private by Default</h3>
                <p className="text-sm text-zinc-500 leading-relaxed font-light">Your data remains yours. End-to-end encrypted signals for total peace of mind.</p>
             </div>
        </div>

      </div>

      {showApply && <ApplyModal onClose={() => setShowApply(false)} />}
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </main>
  );
}

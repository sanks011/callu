"use client";
import React, { useState } from "react";
import { AuthModal } from "@/components/ApplyModal";
import { useAuth } from "@/context/AuthContext";
import { ArrowRight, LogOut, CheckCircle2 } from "lucide-react";

export default function DesktopLoginPage() {
  const { user, logout, isLoading } = useAuth();
  const [redirecting, setRedirecting] = useState(false);

  const handleContinue = () => {
    setRedirecting(true);
    const storedSession = localStorage.getItem("callu_session");
    if (storedSession) {
      try {
        const parsed = JSON.parse(storedSession);
        if (parsed.token) {
          // Redirect to the desktop app
          window.location.href = `callu://auth?token=${parsed.token}`;
          
          // Show a message in case the redirect doesn't close the browser tab
          document.body.innerHTML = `
            <style>
              @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap');
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body { background: #000; font-family: 'Inter', sans-serif; }
              @keyframes fadeIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
              @keyframes ping { 0% { transform: scale(1); opacity: 0.8; } 100% { transform: scale(1.8); opacity: 0; } }
              @keyframes checkDraw { from { stroke-dashoffset: 60; } to { stroke-dashoffset: 0; } }
            </style>
            <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 16px; background: radial-gradient(ellipse at 70% 10%, rgba(16,185,129,0.06) 0%, transparent 60%), radial-gradient(ellipse at 20% 80%, rgba(39,39,42,0.4) 0%, transparent 60%), #000;">
              <div style="width: 100%; max-width: 420px; background: rgba(9,9,11,0.85); border: 1px solid rgba(39,39,42,0.8); border-radius: 28px; padding: 48px 40px; position: relative; backdrop-filter: blur(24px); box-shadow: 0 32px 64px rgba(0,0,0,0.6); animation: fadeIn 0.4s ease forwards; overflow: hidden; text-align: center;">
                
                <!-- Top shimmer line -->
                <div style="position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent, rgba(16,185,129,0.5), transparent);"></div>
                <!-- Ambient glow -->
                <div style="position: absolute; top: -60px; right: -60px; width: 200px; height: 200px; background: rgba(16,185,129,0.07); border-radius: 50%; filter: blur(60px); pointer-events: none;"></div>
                
                <!-- Logo -->
                <div style="display: flex; align-items: center; justify-content: center; gap: 6px; margin-bottom: 36px;">
                  <span style="font-size: 22px; font-weight: 900; letter-spacing: -0.05em; color: #fff;">CALLU</span>
                  <div style="width: 7px; height: 7px; background: #10b981; border-radius: 50%; margin-top: 4px; position: relative;">
                    <div style="position: absolute; inset: 0; background: #10b981; border-radius: 50%; animation: ping 1.4s ease-out infinite;"></div>
                  </div>
                </div>

                <!-- Check icon -->
                <div style="width: 76px; height: 76px; background: rgba(16,185,129,0.08); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; border: 1px solid rgba(16,185,129,0.2); box-shadow: 0 0 32px rgba(16,185,129,0.15);">
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#34d399" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="stroke-dasharray: 60; stroke-dashoffset: 60; animation: checkDraw 0.5s ease 0.2s forwards;">
                    <path d="M20 6L9 17l-5-5"/>
                  </svg>
                </div>

                <!-- Text -->
                <h2 style="font-size: 26px; font-weight: 600; color: #fff; margin-bottom: 10px; letter-spacing: -0.02em;">Login Successful!</h2>
                <p style="font-size: 14px; color: #71717a; line-height: 1.6; margin-bottom: 32px; max-width: 280px; margin-left: auto; margin-right: auto; margin-bottom: 32px;">
                  You're now signed in. Return to the <strong style="color: #a1a1aa;">Callu desktop app</strong> and close this tab.
                </p>

                <!-- Button -->
                <button onclick="window.close()" style="width: 100%; background: #fff; color: #000; border: none; padding: 14px 24px; border-radius: 12px; font-size: 14px; font-weight: 700; cursor: pointer; letter-spacing: 0.01em; transition: opacity 0.2s;" onmouseover="this.style.opacity='0.88'" onmouseout="this.style.opacity='1'">
                  Close This Tab
                </button>
                
                <!-- Bottom text -->
                <p style="font-size: 11px; color: #3f3f46; margin-top: 20px; text-transform: uppercase; letter-spacing: 0.1em;">Secure · Private · Encrypted</p>
              </div>
            </div>
          `;
        }
      } catch (e) {
        console.error(e);
        setRedirecting(false);
      }
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin"></div>
      </main>
    );
  }

  if (user && user.status === 'approved') {
    return (
      <main className="min-h-screen bg-black text-white relative flex flex-col items-center justify-center p-4 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-900/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-zinc-800/20 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="w-full max-w-md bg-zinc-950/80 border border-zinc-800/70 rounded-3xl p-8 sm:p-10 relative backdrop-blur-3xl shadow-2xl text-center animate-in zoom-in-95 duration-300">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
          
          {/* Callu Logo */}
          <div className="flex items-center justify-center gap-1.5 mb-8">
            <span className="text-2xl font-black tracking-tighter text-white" style={{ letterSpacing: '-0.05em' }}>CALLU</span>
            <span className="relative flex h-2.5 w-2.5 mt-1">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-70" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
          </div>

          <div className="w-20 h-20 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/20 shadow-[0_0_32px_rgba(16,185,129,0.25)]">
            <CheckCircle2 size={36} />
          </div>
          
          <h2 className="text-3xl font-medium text-white font-playfair italic mb-3">
            Welcome back, {user.name}
          </h2>
          <p className="text-zinc-400 text-sm mb-10 leading-relaxed px-4">
            You are securely signed in to Callu. Click below to return to the desktop app.
          </p>

          <div className="space-y-3">
            <button
              onClick={handleContinue}
              disabled={redirecting}
              className="w-full px-6 py-4 bg-gradient-to-br from-emerald-500/20 to-transparent hover:from-emerald-500/30 hover:to-emerald-900/20 text-white border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.15)] hover:shadow-[0_0_20px_rgba(16,185,129,0.25)] font-medium rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer active:scale-[0.99]"
            >
              {redirecting ? "Redirecting..." : "Continue to Desktop App"}
              {!redirecting && <ArrowRight size={18} />}
            </button>
            
            <button
              onClick={logout}
              disabled={redirecting}
              className="w-full bg-transparent border border-zinc-800 text-zinc-400 font-medium py-3.5 rounded-xl hover:bg-zinc-900 hover:text-white transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              <LogOut size={16} />
              Not you? Switch Account
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden flex flex-col items-center justify-center">
      <AuthModal onClose={() => {}} defaultTab="signin" />
    </main>
  );
}

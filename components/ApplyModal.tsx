"use client";
import React, { useState } from "react";
import { X, ArrowRight, Loader2, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

/* ── Shake keyframe ── */
const shakeStyle = `
@keyframes shake {
  0%,100%{transform:translateX(0)}
  15%{transform:translateX(-6px)}
  30%{transform:translateX(6px)}
  45%{transform:translateX(-5px)}
  60%{transform:translateX(5px)}
  75%{transform:translateX(-3px)}
  90%{transform:translateX(3px)}
}
.shake { animation: shake 0.45s ease; }
`;

/* ── Password strength ── */
function getStrength(pw: string) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score;
}
const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"];
const strengthColor = ["", "#ef4444", "#f97316", "#eab308", "#22c55e"];

/* ── Shared modal shell ── */
function ModalShell({ onClose, children }: { onClose: () => void; children: React.ReactNode }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-300"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <style>{shakeStyle}</style>
      <div className="w-full max-w-md bg-zinc-950/90 border border-zinc-800/70 rounded-3xl relative backdrop-blur-3xl shadow-2xl overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-900/20 rounded-full blur-[80px] -mr-16 -mt-16 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-zinc-800/20 rounded-full blur-[60px] -ml-10 -mb-10 pointer-events-none" />
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-zinc-500 hover:text-white transition-all duration-200 cursor-pointer bg-zinc-900/60 rounded-full hover:bg-zinc-800 z-20 hover:rotate-90"
        >
          <X size={16} />
        </button>
        {children}
      </div>
    </div>
  );
}

/* ── Tab bar ── */
function TabBar({ tab, setTab }: { tab: "signin" | "signup"; setTab: (t: "signin" | "signup") => void }) {
  return (
    <div className="flex p-1 bg-zinc-900/80 rounded-xl border border-zinc-800/50 mb-7">
      {(["signin", "signup"] as const).map((t) => (
        <button
          key={t}
          onClick={() => setTab(t)}
          className={`flex-1 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all duration-300 cursor-pointer ${tab === t
              ? "bg-zinc-800 text-white shadow-lg shadow-black/30 scale-[1.02]"
              : "text-zinc-500 hover:text-zinc-300"
            }`}
        >
          {t === "signin" ? "Sign In" : "Sign Up"}
        </button>
      ))}
    </div>
  );
}

/* ── Floating label input ── */
function FloatingInput({
  label, value, onChange, type = "text", placeholder, autoComplete, required, rightSlot,
}: {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; placeholder?: string; autoComplete?: string;
  required?: boolean; rightSlot?: React.ReactNode;
}) {
  const [focused, setFocused] = useState(false);
  const active = focused || value.length > 0;
  return (
    <div className="relative">
      <label
        className={`absolute left-4 pointer-events-none transition-all duration-200 z-10 ${active
            ? "top-2 translate-y-0 text-[10px] text-emerald-400 font-bold uppercase tracking-widest"
            : "top-1/2 -translate-y-1/2 text-sm text-zinc-600"
          }`}
      >
        {label}
      </label>
      <input
        required={required}
        type={type}
        autoComplete={autoComplete}
        placeholder={focused ? placeholder : ""}
        value={value}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full bg-zinc-900/60 border rounded-xl px-4 pt-6 pb-2.5 ${rightSlot ? "pr-12" : "pr-4"} text-zinc-200 text-sm focus:outline-none transition-all duration-200 placeholder:text-zinc-700 ${focused
            ? "border-emerald-500/60 bg-zinc-900 ring-2 ring-emerald-500/15 shadow-[0_0_16px_rgba(16,185,129,0.08)]"
            : "border-zinc-800/80 hover:border-zinc-700"
          }`}
      />
      {rightSlot && (
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2">{rightSlot}</div>
      )}
    </div>
  );
}

/* ── Sign-In form ── */
function SignInForm({ onSuccess, redirectOnSuccess = true }: { onSuccess: () => void; redirectOnSuccess?: boolean }) {
  const { login } = useAuth();
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shaking, setShaking] = useState(false);

  const triggerShake = () => {
    setShaking(true);
    setTimeout(() => setShaking(false), 500);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const success = await login(identifier, password, false);
    setLoading(false);
    if (success) {
      if (redirectOnSuccess) {
        const stored = JSON.parse(localStorage.getItem("callu_user") || "{}");
        if (stored.role === "admin") router.push("/admin");
        else router.push("/dashboard");
      }
      onSuccess();
    } else {
      triggerShake();
    }
  };

  return (
    <form onSubmit={handleLogin} className={`space-y-4 animate-in slide-in-from-left-3 duration-300 ${shaking ? "shake" : ""}`}>
      <FloatingInput
        label="Email"
        value={identifier}
        onChange={setIdentifier}
        type="email"
        placeholder="you@example.com"
        autoComplete="email"
        required
      />
      <FloatingInput
        label="Password"
        value={password}
        onChange={setPassword}
        type={showPw ? "text" : "password"}
        placeholder="••••••••"
        autoComplete="current-password"
        required
        rightSlot={
          <button type="button" onClick={() => setShowPw((v) => !v)} className="text-zinc-600 hover:text-zinc-300 transition-colors">
            {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        }
      />
      <button
        disabled={loading}
        type="submit"
        className="w-full mt-2 bg-white text-black font-bold py-3.5 rounded-xl hover:bg-zinc-100 active:scale-[0.97] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_24px_rgba(255,255,255,0.08)] hover:shadow-[0_0_32px_rgba(255,255,255,0.15)] text-sm tracking-wide disabled:opacity-60 relative overflow-hidden group"
      >
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out pointer-events-none" />
        {loading ? (
          <Loader2 className="animate-spin" size={18} />
        ) : (
          <>
            Sign In
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-200" />
          </>
        )}
      </button>
    </form>
  );
}

/* ── Sign-Up form ── */
function SignUpForm({ onSuccess, redirectOnSuccess = true }: { onSuccess: () => void; redirectOnSuccess?: boolean }) {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [shaking, setShaking] = useState(false);

  const triggerShake = () => {
    setShaking(true);
    setTimeout(() => setShaking(false), 500);
  };

  const pwStrength = getStrength(formData.password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters");
      triggerShake();
      return;
    }
    if (confirmPassword && confirmPassword !== formData.password) {
      toast.error("Passwords do not match");
      triggerShake();
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formData.name, email: formData.email, password: formData.password }),
      });
      const data = await res.json();
      if (res.ok) {
        setDone(true);
      } else {
        toast.error(data.message);
        triggerShake();
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="flex flex-col items-center text-center py-6 animate-in zoom-in-75 duration-500">
        <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mb-5 border border-emerald-500/20 shadow-[0_0_32px_rgba(16,185,129,0.25)] animate-pulse">
          <CheckCircle2 size={28} />
        </div>
        <h3 className="text-2xl text-white font-playfair italic mb-2">Account Created!</h3>
        <p className="text-zinc-400 text-sm leading-relaxed mb-6 max-w-xs">
          Your account is ready. Sign in with your email to continue.
        </p>
        <button
          onClick={onSuccess}
          className="bg-white text-black px-8 py-2.5 rounded-full font-bold text-sm hover:bg-zinc-100 active:scale-95 transition-all shadow-lg cursor-pointer"
        >
          Go to Sign In
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 animate-in slide-in-from-right-3 duration-300 ${shaking ? "shake" : ""}`}>
      {/* Name */}
      <div>
        <FloatingInput
          label="Your Name"
          value={formData.name}
          onChange={(v) => setFormData({ ...formData, name: v })}
          placeholder="John Doe"
          autoComplete="name"
          required
        />
        <div className="flex justify-between mt-1.5 px-0.5">
          <p className="text-[10px] text-zinc-600 uppercase tracking-wide">Letters, numbers, spaces allowed</p>
          <p className={`text-[10px] tabular-nums ${formData.name.length > 36 ? "text-orange-400" : "text-zinc-600"}`}>
            {formData.name.length}/40
          </p>
        </div>
      </div>

      {/* Email */}
      <FloatingInput
        label="Email"
        value={formData.email}
        onChange={(v) => setFormData({ ...formData, email: v })}
        type="email"
        placeholder="you@example.com"
        autoComplete="email"
        required
      />

      {/* Password */}
      <div>
        <FloatingInput
          label="Password"
          value={formData.password}
          onChange={(v) => setFormData({ ...formData, password: v })}
          type={showPw ? "text" : "password"}
          placeholder="Min. 8 characters"
          autoComplete="new-password"
          required
          rightSlot={
            <button type="button" onClick={() => setShowPw((v) => !v)} className="text-zinc-600 hover:text-zinc-300 transition-colors">
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          }
        />
        {formData.password.length > 0 && (
          <div className="mt-2 px-0.5 animate-in fade-in duration-200">
            <div className="flex gap-1 mb-1">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-1 flex-1 rounded-full transition-all duration-300"
                  style={{ backgroundColor: i <= pwStrength ? strengthColor[pwStrength] : "#27272a" }}
                />
              ))}
            </div>
            <p className="text-[10px] uppercase tracking-widest" style={{ color: strengthColor[pwStrength] }}>
              {strengthLabel[pwStrength]}
            </p>
          </div>
        )}
      </div>

      {/* Confirm Password */}
      <div>
        <FloatingInput
          label="Confirm Password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          type={showConfirmPw ? "text" : "password"}
          placeholder="Repeat your password"
          autoComplete="new-password"
          rightSlot={
            <button type="button" onClick={() => setShowConfirmPw((v) => !v)} className="text-zinc-600 hover:text-zinc-300 transition-colors">
              {showConfirmPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          }
        />
        {confirmPassword.length > 0 && (
          <p className={`text-[10px] uppercase tracking-widest mt-1.5 px-0.5 animate-in fade-in duration-200 ${confirmPassword === formData.password ? "text-emerald-400" : "text-red-400"
            }`}>
            {confirmPassword === formData.password ? "✓ Passwords match" : "✗ Passwords don't match"}
          </p>
        )}
      </div>

      <button
        disabled={loading}
        type="submit"
        className="w-full mt-2 bg-gradient-to-b from-emerald-500 to-emerald-600 text-white font-bold py-3.5 rounded-xl hover:from-emerald-400 hover:to-emerald-500 active:scale-[0.97] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_24px_rgba(16,185,129,0.25)] hover:shadow-[0_0_32px_rgba(16,185,129,0.4)] text-sm tracking-wide disabled:opacity-60 relative overflow-hidden group"
      >
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out pointer-events-none" />
        {loading ? (
          <Loader2 className="animate-spin" size={18} />
        ) : (
          <>
            Create Account
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-200" />
          </>
        )}
      </button>

      <p className="text-center text-[10px] text-zinc-600 uppercase tracking-widest pt-1">
        Secure · Private · Encrypted
      </p>
    </form>
  );
}

/* ── Combined Auth Modal ── */
export function AuthModal({
  onClose,
  defaultTab = "signin",
  redirectOnSuccess = true,
}: {
  onClose: () => void;
  defaultTab?: "signin" | "signup";
  redirectOnSuccess?: boolean;
}) {
  const [tab, setTab] = useState<"signin" | "signup">(defaultTab);

  return (
    <ModalShell onClose={onClose}>
      <div className="p-7 sm:p-9 relative z-10">
        <div className="flex items-center gap-2 mb-1">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-70" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-emerald-500 text-[10px] font-bold uppercase tracking-widest">CALLU</span>
        </div>

        <h2 className="text-3xl font-medium text-white font-playfair italic mb-1">
          {tab === "signin" ? "Welcome." : "Join the network."}
        </h2>
        <p className="text-zinc-500 text-xs mb-7 font-dm leading-relaxed">
          {tab === "signin"
            ? "Sign in to enter your private space."
            : "Create your account to get started."}
        </p>

        <TabBar tab={tab} setTab={setTab} />

        {tab === "signin" ? (
          <SignInForm onSuccess={onClose} redirectOnSuccess={redirectOnSuccess} />
        ) : (
          <SignUpForm onSuccess={() => setTab("signin")} redirectOnSuccess={redirectOnSuccess} />
        )}
      </div>
    </ModalShell>
  );
}

export function LoginModal({ onClose, redirectOnSuccess = true }: { onClose: () => void; redirectOnSuccess?: boolean }) {
  return <AuthModal onClose={onClose} defaultTab="signin" redirectOnSuccess={redirectOnSuccess} />;
}

export default function ApplyModal({ onClose, redirectOnSuccess = true }: { onClose: () => void; redirectOnSuccess?: boolean }) {
  return <AuthModal onClose={onClose} defaultTab="signup" redirectOnSuccess={redirectOnSuccess} />;
}

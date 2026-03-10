"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";
import { Eye, EyeOff, ArrowRight, ShieldCheck, Check, Home, Compass } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) { toast.error(error.message); } 
      else if (data.session) {
        toast.success("Identity Confirmed");
        router.push("/admin/dashboard");
      }
    } catch (error) { toast.error("Auth Failure"); } 
    finally { setIsLoading(false); }
  };

  return (
    <div className="min-h-screen w-full bg-[#0a0a0a] flex items-center justify-center px-4 sm:px-6 relative overflow-hidden font-sans selection:bg-[#bc6c4d]/30">
      
      {/* --- REFINED AMBIENT BACKGROUND --- */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(188,108,77,0.04)_0%,transparent_80%)]" />
        <div className="absolute inset-0 opacity-[0.2] bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[380px] relative z-10"
      >
        {/* REFINED HEADER ICON */}
        <div className="flex justify-center mb-12">
          <div className="relative">
            <div className="w-16 h-16 bg-zinc-900/80 backdrop-blur-md border border-zinc-800 rounded-3xl flex items-center justify-center shadow-2xl transition-all duration-500 hover:border-[#bc6c4d]/40 group">
              <Compass className="text-[#bc6c4d] transition-transform duration-700 group-hover:rotate-180" size={30} strokeWidth={1} />
            </div>
            {/* Visual Balance Dot */}
            <div className="absolute -top-1 -left-1 w-2 h-2 bg-[#bc6c4d]/40 rounded-full blur-[2px]" />
          </div>
        </div>

        {/* --- PRECISION-ENGINEERED CARD --- */}
        <div className="relative group">
          {/* Decorative Corner Brackets */}
          <div className="absolute -top-2 -left-2 w-6 h-6 border-t border-l border-[#bc6c4d]/30 rounded-tl-lg pointer-events-none" />
          <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b border-r border-[#bc6c4d]/30 rounded-br-lg pointer-events-none" />

          <div className="bg-zinc-900/40 backdrop-blur-3xl rounded-[2.5rem] border border-white/5 p-9 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] relative overflow-hidden">
            
            {/* Beveled Top Glow */}
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            <div className="text-center mb-10">
              <h1 className="text-[13px] font-black uppercase tracking-[0.5em] text-white">
                Admin <span className="text-[#bc6c4d]">Access</span>
              </h1>
              <div className="flex items-center justify-center gap-2 mt-3 opacity-30">
                <span className="w-8 h-[1px] bg-zinc-500" />
                <span className="text-[7px] font-bold uppercase tracking-[0.2em] text-zinc-400">Verified Management</span>
                <span className="w-8 h-[1px] bg-zinc-500" />
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">Account</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-black/40 border border-zinc-800/80 py-4 px-5 rounded-2xl text-sm focus:outline-none focus:border-[#bc6c4d]/40 transition-all text-zinc-100 placeholder:text-zinc-800 appearance-none font-medium"
                  placeholder="admin@access"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">Passcode</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-black/40 border border-zinc-800/80 py-4 px-5 rounded-2xl text-sm focus:outline-none focus:border-[#bc6c4d]/40 transition-all text-zinc-100 placeholder:text-zinc-800 appearance-none font-medium"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 p-2 hover:text-[#bc6c4d] transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="pt-4">
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  disabled={isLoading}
                  className="group relative w-full py-4.5 bg-zinc-100 text-zinc-900 font-black text-[11px] uppercase tracking-[0.4em] overflow-hidden rounded-2xl shadow-xl transition-all duration-500"
                >
                  <span className="relative z-10 flex items-center justify-center gap-3 group-hover:text-white transition-colors duration-500">
                    {isLoading ? "Validating" : "Enter"}
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                  {/* Terracotta Liquid Fill */}
                  <div className="absolute inset-0 bg-[#bc6c4d] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[0.23,1,0.32,1]" />
                </motion.button>
              </div>
            </form>

            {/* --- IMPROVED RETURN NAVIGATION --- */}
            <div className="mt-10 flex justify-center border-t border-white/5 pt-8">
              <Link href="/" className="w-full group">
                <motion.div 
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center justify-center gap-3 py-3 px-4 rounded-xl text-[10px] font-black text-zinc-500 group-hover:text-zinc-200 transition-all uppercase tracking-[0.2em]"
                >
                  <Home size={14} className="text-[#bc6c4d]/60 group-hover:text-[#bc6c4d] transition-colors" />
                  <span>Return to Site</span>
                </motion.div>
              </Link>
            </div>
          </div>
        </div>

        {/* REFINED TRUST BAR */}
        <div className="mt-10 flex items-center justify-center gap-8 opacity-40">
           <div className="flex items-center gap-2">
             <ShieldCheck size={12} className="text-[#bc6c4d]" />
             <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500">Security Encrypted</span>
           </div>
           <div className="w-[1px] h-3 bg-zinc-800" />
           <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500 italic">2026 Admin</span>
        </div>
      </motion.div>
    </div>
  );
}
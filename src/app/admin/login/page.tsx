"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useNotification } from "@/lib/useNotification";
import {
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Home,
  Lock,
  Square,
} from "lucide-react";
import { motion } from "framer-motion";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const notification = useNotification();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        notification.error(error.message);
      } else if (data.session) {
        notification.success("Identity Confirmed");
        router.push("/admin/dashboard");
      }
    } catch (error) {
      notification.error("Auth Failure");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-[#0f1115] flex items-center justify-center px-4 relative overflow-hidden font-sans">
      {/* Soft Ambient Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/5 blur-[120px] rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-[400px] relative z-10"
      >
        {/* Simple Brand Logo */}
        <div className="flex justify-center mb-8">
          <div className="w-12 h-12 bg-white dark:bg-[#16191f] border border-slate-200 dark:border-white/10 rounded-2xl flex items-center justify-center shadow-sm">
            <Square
              className="text-indigo-600 dark:text-indigo-400 fill-indigo-600/10"
              size={24}
            />
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-white dark:bg-[#16191f] rounded-[2rem] border border-slate-200 dark:border-white/5 p-8 md:p-10 shadow-xl shadow-indigo-500/5">
          <div className="text-center mb-8">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              Welcome Back
            </h1>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">
              Core Admin Access
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 py-3 px-4 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-900 dark:text-slate-100 placeholder:text-slate-300"
                placeholder="admin@example.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 py-3 px-4 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-900 dark:text-slate-100 placeholder:text-slate-300"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 p-1 hover:text-indigo-500 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <motion.button
                whileTap={{ scale: 0.98 }}
                disabled={isLoading}
                className="w-full py-3.5 bg-indigo-600 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </motion.button>
            </div>
          </form>

          {/* Footer Navigation */}
          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-white/5">
            <Link
              href="/"
              className="flex items-center justify-center gap-2 text-xs font-bold text-slate-400 hover:text-indigo-500 transition-colors uppercase tracking-widest"
            >
              <Home size={14} />
              <span>Back to Website</span>
            </Link>
          </div>
        </div>

        {/* Security Footer */}
        <div className="mt-8 flex items-center justify-center gap-4 opacity-50">
          <div className="flex items-center gap-1.5">
            <ShieldCheck
              size={14}
              className="text-indigo-600 dark:text-indigo-400"
            />
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
              Secure Access
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

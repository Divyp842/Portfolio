"use client";

import { useState, useEffect } from "react";
// 1. Added Variants type here
import { motion, Variants } from "framer-motion";
import {
  Mail,
  Github,
  Linkedin,
  Send,
  Sparkles,
  Loader2,
  Code2,
  Check,
} from "lucide-react";
import { Profile } from "@/types";
import toast from "react-hot-toast";

// 2. Applied Variants type to fix red squiggles
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 15 },
  },
};

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Added effect to trigger the reveal animation after a brief loading state
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("/api/profile");
        const data = await response.json();
        setProfile(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
    const timer = setTimeout(() => setIsInitialLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Message sent! I'll get back to you soon.");
        setFormData({ name: "", email: "", message: "" });
      } else {
        console.error("API Error:", data);
        toast.error(data.error || "Failed to send. Please try again.");
      }
    } catch (err) {
      console.error("Request error:", err);
      toast.error("Something went wrong. Check console for details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmailClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    if (profile?.email) {
      navigator.clipboard
        .writeText(profile.email)
        .then(() => {
          setCopiedEmail(true);
          toast.success(`Email copied: ${profile.email}`);

          setTimeout(() => setCopiedEmail(false), 2000);
        })
        .catch(() => {
          toast.error("Failed to copy email");
        });
    } else {
      toast.error("Email not available");
    }
  };

  // Consistent loader from Skills page
  if (isInitialLoading)
    return (
      <div className="h-screen flex items-center justify-center bg-white dark:bg-[#050505]">
        <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
      </div>
    );

  return (
    <motion.div
      initial={{ opacity: 0, clipPath: "inset(0 100% 0 0)" }}
      animate={{ opacity: 1, clipPath: "inset(0 0% 0 0)" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-screen bg-[#fafafa] dark:bg-[#050505] text-zinc-900 dark:text-zinc-100 transition-colors duration-500 relative overflow-hidden"
    >
      {/* Background Ambience */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/5 dark:bg-cyan-500/10 blur-[120px] rounded-full" />
      </div>

      <motion.main
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative z-10 max-w-4xl mx-auto px-6 pt-32 pb-20 md:pt-48 md:pb-32 flex flex-col items-center"
      >
        <header className="text-center mb-16 space-y-4">
          <motion.div
            variants={itemVariants}
            className="flex items-center justify-center gap-2 text-cyan-600 dark:text-cyan-400 font-bold"
          >
            <Sparkles size={18} />
            <span className="text-[10px] uppercase tracking-[0.3em]">
              Available for projects
            </span>
          </motion.div>
          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-7xl font-bold tracking-tighter leading-none"
          >
            Let&apos;s{" "}
            <span className="text-zinc-400 dark:text-zinc-600 italic font-medium text-4xl md:text-6xl">
              Connect.
            </span>
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="text-zinc-500 dark:text-zinc-400 max-w-md mx-auto text-sm md:text-base"
          >
            Have an idea or just want to chat? Drop me a message and let&apos;s
            build something great.
          </motion.p>
        </header>

        {/* Form Container */}
        <motion.div variants={itemVariants} className="w-full max-w-2xl group">
          <div className="relative p-1 bg-gradient-to-br from-zinc-200 to-zinc-100 dark:from-zinc-800 dark:to-zinc-900 rounded-[2.5rem] shadow-2xl transition-all duration-500 group-hover:shadow-cyan-500/5">
            <div className="bg-white dark:bg-zinc-950 rounded-[2.3rem] p-8 md:p-12">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 ml-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Jane Doe"
                      className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-5 py-4 outline-none focus:ring-2 ring-cyan-500/20 focus:border-cyan-500/50 transition-all text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 ml-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="jane@example.com"
                      className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-5 py-4 outline-none focus:ring-2 ring-cyan-500/20 focus:border-cyan-500/50 transition-all text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 ml-1">
                    Your Message
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell me about your vision..."
                    className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-5 py-4 outline-none focus:ring-2 ring-cyan-500/20 focus:border-cyan-500/50 transition-all text-sm resize-none"
                  />
                </div>

                <button
                  disabled={isSubmitting}
                  className="w-full group/btn relative flex items-center justify-center gap-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 py-4 rounded-2xl font-bold overflow-hidden transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <>
                      <span>Send Message</span>
                      <Send
                        size={18}
                        className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform"
                      />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
          <p className="mt-8 text-center text-[10px] text-zinc-400 font-mono uppercase tracking-widest">
            Reply time: ~24 hours
          </p>
        </motion.div>

        {/* Social Dock */}
        {/* <motion.footer
          variants={itemVariants}
          className="mt-20 w-full max-w-lg"
        >
          <div className="flex items-center justify-center gap-4 flex-wrap">
            {[
              {
                icon: Github,
                href: profile?.github || "#",
                label: "GitHub",
                isEmail: false,
              },
              {
                icon: Linkedin,
                href: profile?.linkedin || "#",
                label: "LinkedIn",
                isEmail: false,
              },
              {
                icon: Mail,
                href: "#",
                label: "Email",
                isEmail: true,
              },
              {
                icon: Code2,
                href: profile?.leetcode || "#",
                label: "LeetCode",
                isEmail: false,
              },
            ].map((link, i) => (
              <a
                key={i}
                href={link.href}
                onClick={link.isEmail ? handleEmailClick : undefined}
                target={!link.isEmail ? "_blank" : undefined}
                rel={!link.isEmail ? "noopener noreferrer" : undefined}
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:border-cyan-500/50 transition-all text-xs font-bold shadow-sm"
              >
                {link.isEmail && copiedEmail ? (
                  <Check size={16} className="text-emerald-500 animate-pulse" />
                ) : (
                  <link.icon size={16} />
                )}
                <span className="hidden sm:inline">
                  {link.isEmail && copiedEmail ? "Copied!" : link.label}
                </span>
              </a>
            ))}
          </div>
          <p className="mt-8 text-center text-[10px] text-zinc-400 font-mono uppercase tracking-widest">
            Reply time: ~24 hours
          </p>
        </motion.footer> */}
      </motion.main>
    </motion.div>
  );
}

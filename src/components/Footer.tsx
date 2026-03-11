"use client";

import Link from "next/link";
import {
  Github,
  Linkedin,
  Mail,
  Code2,
  ArrowUpRight,
  Command,
  Check,
} from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Profile } from "@/types";
import toast from "react-hot-toast";

export function Footer() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const currentYear = new Date().getFullYear();

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
  }, []);

  const handleEmailClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    if (profile?.email) {
      // Copy email to clipboard
      navigator.clipboard
        .writeText(profile.email)
        .then(() => {
          setCopiedEmail(true);
          toast.success(`Email copied: ${profile.email}`);

          // Reset the icon after 2 seconds
          setTimeout(() => setCopiedEmail(false), 2000);
        })
        .catch(() => {
          toast.error("Failed to copy email");
        });
    } else {
      toast.error("Email not available");
    }
  };

  const socialLinks = [
    {
      icon: Github,
      href: profile?.github || "",
      label: "GitHub",
      isEmail: false,
    },
    {
      icon: Linkedin,
      href: profile?.linkedin || "",
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
      href: profile?.leetcode || "",
      label: "LeetCode",
      isEmail: false,
    },
  ];

  return (
    <footer className="relative border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-[#050505] overflow-hidden">
      {/* Subtle Background Pattern to match your Mobile Nav */}
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03] pointer-events-none bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:40px_40px]" />

      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10 relative z-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Identity Section */}
          <div className="lg:col-span-5 space-y-6">
            <Link href="/" className="group flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 transition-transform group-hover:rotate-12">
                <Command size={20} />
              </div>
              <span className="text-xl font-black uppercase tracking-tighter">
                {profile?.name?.split(" ")[0] || "PORTFOLIO"}
              </span>
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-zinc-500 dark:text-zinc-400 font-medium">
              A developer focused on crafting high-performance digital
              interfaces. Always pushing the boundaries of web aesthetics and
              clean architecture.
            </p>
            <div className="flex items-center gap-3 p-3 w-fit rounded-2xl bg-zinc-50 dark:bg-white/5 border border-zinc-100 dark:border-white/5">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-zinc-600 dark:text-zinc-300">
                Available for New Projects
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-3">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500 mb-6">
              Sitemap
            </h3>
            {/* grid-cols-2: Two columns on mobile 
      sm:grid-cols-1: Back to one column for tablet/desktop where there's more horizontal space 
  */}
            <ul className="grid grid-cols-2 sm:grid-cols-1 gap-y-4 gap-x-8">
              {["About", "Projects", "Blog", "Contact"].map((item) => (
                <li key={item}>
                  <Link
                    href={`/${item.toLowerCase()}`}
                    className="group flex items-center gap-2 text-sm font-bold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors w-fit"
                  >
                    <span className="relative">
                      {item}
                      {/* The underline effect still works perfectly here */}
                      <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-zinc-900 dark:bg-white transition-all group-hover:w-full" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Grid */}
          <div className="lg:col-span-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500 mb-6">
              Connect
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                const isDisabled = !social.href && !social.isEmail;

                return (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    onClick={social.isEmail ? handleEmailClick : undefined}
                    target={!social.isEmail ? "_blank" : undefined}
                    rel={!social.isEmail ? "noopener noreferrer" : undefined}
                    whileHover={!isDisabled ? { scale: 1.02 } : {}}
                    whileTap={!isDisabled ? { scale: 0.98 } : {}}
                    className={`flex items-center justify-between p-3 rounded-xl transition-all group ${
                      isDisabled
                        ? "bg-zinc-100 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/[0.05] cursor-not-allowed opacity-50"
                        : "bg-zinc-50 dark:bg-white/5 border border-zinc-100 dark:border-white/5 hover:bg-white dark:hover:bg-white/10"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {social.isEmail && copiedEmail ? (
                        <Check
                          size={16}
                          className="text-emerald-500 animate-pulse"
                        />
                      ) : (
                        <Icon
                          size={16}
                          className="text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white"
                        />
                      )}
                      <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white">
                        {social.isEmail && copiedEmail
                          ? "Copied!"
                          : social.label}
                      </span>
                    </div>
                    <ArrowUpRight
                      size={14}
                      className="text-zinc-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                    />
                  </motion.a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-20 pt-8 border-t border-zinc-100 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
            © {currentYear} — DESIGNED & BUILT BY {profile?.name || "YOUR NAME"}
          </p>
        </div>
      </div>
    </footer>
  );
}

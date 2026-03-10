"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Briefcase,
  Zap,
  MessageSquare,
  BookOpen,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  Clock,
  Sparkles,
} from "lucide-react";
import { motion, Variants } from "framer-motion";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    projects: 0,
    skills: 0,
    messages: 0,
    posts: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [projectRes, skillRes, messageRes, postRes] = await Promise.all([
          fetch("/api/projects"),
          fetch("/api/skills"),
          fetch("/api/messages"),
          fetch("/api/blog"),
        ]);

        const projects = await projectRes.json();
        const skills = await skillRes.json();
        const messages = await messageRes.json();
        const posts = await postRes.json();

        setStats({
          projects: projects.length || 0,
          skills: skills.length || 0,
          messages: messages.length || 0,
          posts: posts.length || 0,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Projects",
      value: stats.projects,
      icon: Briefcase,
      href: "/admin/projects",
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 dark:from-blue-950/30 to-cyan-50 dark:to-cyan-950/30",
    },
    {
      title: "Skills",
      value: stats.skills,
      icon: Zap,
      href: "/admin/skills",
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-50 dark:from-purple-950/30 to-pink-50 dark:to-pink-950/30",
    },
    {
      title: "Messages",
      value: stats.messages,
      icon: MessageSquare,
      href: "/admin/messages",
      gradient: "from-emerald-500 to-teal-500",
      bgGradient: "from-emerald-50 dark:from-emerald-950/30 to-teal-50 dark:to-teal-950/30",
    },
    {
      title: "Blog Posts",
      value: stats.posts,
      icon: BookOpen,
      href: "/admin/blog",
      gradient: "from-amber-500 to-orange-500",
      bgGradient: "from-amber-50 dark:from-amber-950/30 to-orange-50 dark:to-orange-950/30",
    },
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Header Section */}
      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        className="space-y-2"
      >
        <div className="flex items-center gap-2">
          <Sparkles size={24} className="text-blue-600 dark:text-blue-400" />
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Welcome Back!
          </h1>
        </div>
        <p className="text-slate-600 dark:text-slate-400 text-lg">
          Here's an overview of your portfolio activity and quick access to management tools.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
      >
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div key={i} variants={itemVariants}>
              <Link href={card.href}>
                <motion.div
                  whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
                  className={`h-full p-6 bg-gradient-to-br ${card.bgGradient} border border-white/20 dark:border-slate-700/50 rounded-2xl backdrop-blur-sm hover:border-white/40 dark:hover:border-slate-600 transition-all duration-300 cursor-pointer group`}
                >
                  <div className="flex items-start justify-between mb-6">
                    <span className="text-sm font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                      {card.title}
                    </span>
                    <motion.div
                      className={`p-3 rounded-xl bg-gradient-to-br ${card.gradient} shadow-lg`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 200 }}
                    >
                      <Icon size={22} className="text-white" />
                    </motion.div>
                  </div>
                  {isLoading ? (
                    <motion.div
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="h-12 bg-white/20 dark:bg-white/10 rounded-lg w-24 mb-4"
                    />
                  ) : (
                    <div className="mb-4">
                      <motion.p
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl font-black text-slate-900 dark:text-white"
                      >
                        {card.value}
                      </motion.p>
                    </div>
                  )}
                  <div className="flex items-center text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 group-hover:translate-x-1 transition-transform">
                    <span>View Details</span>
                    <ArrowRight size={14} className="ml-1" />
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        className="bg-gradient-to-br from-white/50 dark:from-slate-800/50 via-white/30 dark:via-slate-800/30 to-blue-50/50 dark:to-blue-950/20 backdrop-blur-xl border border-white/30 dark:border-slate-700/50 rounded-2xl overflow-hidden shadow-xl"
      >
        <div className="p-6 border-b border-white/20 dark:border-slate-700/50">
          <div className="flex items-center gap-2">
            <TrendingUp size={24} className="text-blue-600 dark:text-blue-400" />
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              Quick Actions
            </h2>
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
            Access your portfolio management tools instantly
          </p>
        </div>
        <div className="p-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                href: "/admin/projects",
                label: "Manage Projects",
                icon: Briefcase,
                color: "from-blue-500 to-cyan-500",
              },
              {
                href: "/admin/skills",
                label: "Update Skills",
                icon: Zap,
                color: "from-purple-500 to-pink-500",
              },
              {
                href: "/admin/blog",
                label: "Write Blog Post",
                icon: BookOpen,
                color: "from-amber-500 to-orange-500",
              },
            ].map((action) => {
              const ActionIcon = action.icon;
              return (
                <Link key={action.href} href={action.href}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-full p-4 bg-gradient-to-r ${action.color} hover:shadow-lg text-white font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group shadow-md`}
                  >
                    <ActionIcon size={20} className="group-hover:rotate-12 transition-transform" />
                    <span>{action.label}</span>
                  </motion.button>
                </Link>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Info Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid gap-6 md:grid-cols-2"
      >
        {/* Getting Started */}
        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-br from-white/50 dark:from-slate-800/50 via-white/30 dark:via-slate-800/30 to-blue-50/50 dark:to-blue-950/20 backdrop-blur-xl border border-white/30 dark:border-slate-700/50 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
        >
          <div className="p-6 border-b border-white/20 dark:border-slate-700/50 bg-gradient-to-r from-blue-500/10 to-purple-500/10">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={20} className="text-blue-600 dark:text-blue-400" />
              <h3 className="font-bold text-slate-900 dark:text-white">
                Getting Started
              </h3>
            </div>
          </div>
          <div className="p-6">
            <ul className="space-y-4">
              {[
                "Add your first project to showcase your work",
                "List all your technical skills by category",
                "Share your knowledge through blog posts",
              ].map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <span className="font-black text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5 text-lg">
                    {i + 1}.
                  </span>
                  <span className="text-slate-700 dark:text-slate-300 font-medium">
                    {item}
                  </span>
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* Portfolio Summary */}
        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-br from-white/50 dark:from-slate-800/50 via-white/30 dark:via-slate-800/30 to-purple-50/50 dark:to-purple-950/20 backdrop-blur-xl border border-white/30 dark:border-slate-700/50 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
        >
          <div className="p-6 border-b border-white/20 dark:border-slate-700/50 bg-gradient-to-r from-purple-500/10 to-pink-500/10">
            <div className="flex items-center gap-2">
              <Clock size={20} className="text-purple-600 dark:text-purple-400" />
              <h3 className="font-bold text-slate-900 dark:text-white">
                Portfolio Summary
              </h3>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {[
                { label: "Total Projects", value: stats.projects },
                { label: "Total Skills", value: stats.skills },
                { label: "Messages", value: stats.messages },
                { label: "Blog Posts", value: stats.posts },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex justify-between items-center pb-4 border-b border-slate-200 dark:border-slate-700 last:border-b-0 last:pb-0"
                >
                  <span className="text-slate-700 dark:text-slate-300 font-medium">
                    {item.label}
                  </span>
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3 + i * 0.15 }}
                    className="font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"
                  >
                    {item.value}
                  </motion.span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Floating Action Hint */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="text-center p-4 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50"
      >
        <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
          💡 <span className="font-bold">Tip:</span> Use the sidebar navigation to access all management features
        </p>
      </motion.div>
    </motion.div>
  );
}

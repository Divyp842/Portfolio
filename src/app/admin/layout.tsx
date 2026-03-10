"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  LogOut,
  Menu,
  X,
  LayoutDashboard,
  Gauge,
  User,
  BookOpen,
  Briefcase,
  Zap,
  MessageSquare,
  Award,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";

const adminLinks = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/profile", label: "Profile", icon: User },
  { href: "/admin/about", label: "About", icon: Gauge },
  { href: "/admin/projects", label: "Projects", icon: Briefcase },
  { href: "/admin/skills", label: "Skills", icon: Zap },
  { href: "/admin/certificates", label: "Certificates", icon: Award },
  { href: "/admin/blog", label: "Blog Posts", icon: BookOpen },
  { href: "/admin/messages", label: "Messages", icon: MessageSquare },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Check if we're on the login page
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    // Check screen size
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    // Skip auth check for login page - just render it directly
    if (isLoginPage) {
      setIsLoading(false);
      return;
    }

    const checkAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          router.push("/admin/login");
        } else {
          setUser(session.user);
        }
      } catch (error) {
        console.error("Auth error:", error);
        router.push("/admin/login");
      }
      setIsLoading(false);
    };

    checkAuth();

    // Subscribe to auth changes
    try {
      const { data } = supabase.auth.onAuthStateChange(
        (_event: any, session: any) => {
          if (session) {
            setUser(session.user);
          } else {
            if (!isLoginPage) {
              router.push("/admin/login");
            }
          }
        },
      );

      return () => {
        if (data?.subscription) {
          data.subscription.unsubscribe();
        }
      };
    } catch (error) {
      console.error("Auth subscription error:", error);
    }
  }, [router, isLoginPage]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const isActiveLink = (href: string) => pathname === href;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-950 dark:to-slate-900">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-12 h-12 border-3 border-blue-500/30 border-t-blue-500 rounded-full"
        />
      </div>
    );
  }

  // Allow login page to render without authentication
  if (isLoginPage) {
    return children;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 dark:from-slate-950 via-slate-50 dark:via-slate-900 to-blue-50/50 dark:to-blue-950/20 overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-30 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: isLargeScreen ? 0 : isSidebarOpen ? 0 : -256,
        }}
        transition={{ duration: 0.3 }}
        className={`h-screen w-64 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-r border-slate-200 dark:border-slate-800 flex flex-col fixed left-0 top-0 z-40 lg:static`}
      >
        {/* Logo Section */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-blue-500/10 to-purple-500/10"
        >
          <Link
            href="/"
            className="flex items-center gap-3 font-black text-lg text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-105 transition-transform"
            onClick={() => setIsSidebarOpen(false)}
          >
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white">
              <LayoutDashboard size={18} />
            </div>
            Admin
          </Link>
        </motion.div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
          {adminLinks.map((link, i) => {
            const Icon = link.icon;
            const isActive = isActiveLink(link.href);
            return (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  href={link.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`relative flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 group ${
                    isActive
                      ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-700 dark:text-blue-400 border-l-2 border-blue-600"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50 border-l-2 border-transparent group-hover:border-blue-500/50"
                  }`}
                >
                  <Icon
                    size={18}
                    className={
                      isActive
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200"
                    }
                  />
                  <span>{link.label}</span>
                  {isActive && (
                    <ChevronRight
                      size={16}
                      className="ml-auto text-blue-600 dark:text-blue-400"
                    />
                  )}
                </Link>
              </motion.div>
            );
          })}
        </nav>

        {/* Visit Portfolio Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="border-y border-slate-200 dark:border-slate-800 px-3 py-3"
        >
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-300 bg-gradient-to-r from-blue-500/10 to-purple-500/10 hover:from-blue-500/20 hover:to-purple-500/20 border border-blue-200/50 dark:border-blue-900/50 hover:border-blue-300/50 dark:hover:border-blue-800/50 transition-all duration-200 group w-full"
          >
            <ExternalLink
              size={18}
              className="text-blue-600 dark:text-blue-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
            />
            <span>Visit Portfolio</span>
          </Link>
        </motion.div>

        {/* User Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="border-t border-slate-200 dark:border-slate-800 p-4 space-y-4 bg-gradient-to-t from-slate-50 dark:from-slate-800/50 to-transparent"
        >
          <div className="px-2">
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
              Account
            </p>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                {user?.email?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                  {user?.email?.split("@")[0]}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 dark:from-red-600 dark:to-red-700 dark:hover:from-red-700 dark:hover:to-red-800 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </motion.button>
        </motion.div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <motion.header
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="h-16 bg-white/50 dark:bg-slate-900/50 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800 flex items-center px-6 gap-4 shadow-sm"
        >
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden inline-flex items-center justify-center p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div className="flex-1">
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-2xl font-black text-slate-900 dark:text-white tracking-tight"
            >
              {adminLinks.find((l) => l.href === pathname)?.label ||
                "Dashboard"}
            </motion.h1>
          </div>
        </motion.header>

        {/* Page Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex-1 overflow-auto"
        >
          <div className="p-6 max-w-7xl mx-auto w-full">{children}</div>
        </motion.div>
      </main>
    </div>
  );
}

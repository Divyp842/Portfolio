"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Command, ArrowRight } from "lucide-react";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/skills", label: "Skills" },
  { href: "/certificates", label: "Certificates" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
      className={`fixed top-0 left-0 right-0 z-[110] w-full transition-all duration-500 ${
        // MOBILE FIX: If menu is open, background MUST be solid and high contrast
        scrolled || isOpen
          ? "py-4 bg-white dark:bg-[#050505] border-b border-zinc-200 dark:border-zinc-800 shadow-xl"
          : "py-6 bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="group flex items-center gap-2 relative z-[120]"
          >
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 transition-transform group-hover:rotate-[10deg]">
              <Command size={22} />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-base sm:text-lg font-black tracking-tighter uppercase">
                Portfolio
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 p-1 rounded-full border border-zinc-200/50 dark:border-zinc-800/50 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative px-5 py-2 group rounded-full"
                >
                  {/* Text: Tiny vertical 'pop' when it becomes active */}
                  <motion.span
                    animate={{ y: active ? -1 : 0 }}
                    className={`relative z-10 block text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-500 ${
                      active
                        ? "text-zinc-900 dark:text-white"
                        : "text-zinc-400 group-hover:text-zinc-900 dark:hover:text-zinc-100"
                    }`}
                  >
                    {link.label}
                  </motion.span>

                  {active && (
                    <motion.div
                      layoutId="nav-active"
                      // The Design: Works perfectly in Light (Zinc tint) and Dark (White glass)
                      className="absolute inset-0 z-0 rounded-full 
                       bg-zinc-900/5 border border-zinc-900/10 shadow-sm
                       dark:bg-white/10 dark:border-white/10 dark:backdrop-blur-md dark:shadow-none"
                      // THE GOOEY STRETCH PHYSICS
                      transition={{
                        type: "spring",
                        stiffness: 350, // Tension of the "rubber band"
                        damping: 25, // Controls the "snap" back to shape
                        mass: 0.5, // Lower mass makes it stretch more during travel
                      }}
                    >
                      {/* Glossy Reflection for both modes */}
                      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/20 to-transparent dark:from-white/5 opacity-50" />

                      {/* The "Snap" Accent line at the bottom */}
                      <motion.div
                        layoutId="nav-accent-line"
                        className="absolute bottom-1 left-1/2 -translate-x-1/2 w-4 h-[1.5px] bg-zinc-900/20 dark:bg-white/30 rounded-full"
                      />
                    </motion.div>
                  )}
                </Link>
              );
            })}
          </nav>
          <div className="flex items-center gap-3 relative z-[120]">
            <ThemeSwitcher />

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 lg:hidden hover:scale-105 transition-all"
            >
              <AnimatePresence mode="wait">
                {isOpen ? <X size={20} key="x" /> : <Menu size={20} key="m" />}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 200,
              duration: 0.3,
            }}
            className="fixed inset-0 z-[105] flex flex-col bg-white dark:bg-[#050505] p-6 lg:hidden pt-28 h-screen w-screen"
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:40px_40px]" />

            {/* Links Container */}
            <div className="relative z-10 flex flex-col justify-start space-y-4">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="group flex items-end justify-between border-b border-zinc-100 dark:border-zinc-900 pb-3"
                  >
                    <span
                      className={`text-2xl sm:text-3xl font-black uppercase tracking-tighter transition-all ${
                        isActive(link.href)
                          ? "text-blue-600"
                          : "text-zinc-300 dark:text-zinc-800 group-hover:text-zinc-900 dark:group-hover:text-zinc-100"
                      }`}
                    >
                      {link.label}
                    </span>
                    <ArrowRight
                      className={`mb-2 transition-transform group-hover:translate-x-2 ${isActive(link.href) ? "text-blue-600" : "text-zinc-300"}`}
                      size={20}
                    />
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Footer info for mobile menu */}
            {/* Removed email section for cleaner mobile nav */}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
// ADD THIS LINE AT THE BOTTOM
export default Navbar;

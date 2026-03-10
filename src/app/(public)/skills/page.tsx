"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Skill } from "@/types";
import { Loader2, Activity, Star } from "lucide-react";

const categories = ["frontend", "backend", "database", "tools"] as const;

const getIconSlug = (name: string) => {
  const map: Record<string, string> = {
    "js": "javascript", "javascript": "javascript", "ts": "typescript", "typescript": "typescript",
    "react": "react", "next": "nextdotjs", "nextjs": "nextdotjs", "node": "nodedotjs",
    "mongodb": "mongodb", "postgresql": "postgresql", "mysql": "mysql", "html": "html5",
    "css": "css3", "tailwind": "tailwindcss", "git": "git", "docker": "docker",
  };
  const normalized = name.toLowerCase().trim();
  return map[normalized] || normalized.replace(/\s+/g, '');
};

export default function Skills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [activeCat, setActiveCat] = useState<string>("frontend");
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/skills")
      .then((res) => res.json())
      .then((data) => {
        setSkills(data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (window.innerWidth > 1024) {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 10,
        y: (e.clientY / window.innerHeight - 0.5) * 10
      });
    }
  }, []);

  const filteredSkills = skills.filter((s) => s.category === activeCat);

  if (isLoading) return (
    <div className="h-screen flex items-center justify-center bg-white dark:bg-[#050505]">
      <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, clipPath: "inset(0 100% 0 0)" }}
      animate={{ opacity: 1, clipPath: "inset(0 0% 0 0)" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={handleMouseMove}
      className="min-h-screen transition-colors duration-500 bg-slate-50 dark:bg-[#050505] text-zinc-900 dark:text-zinc-100 pt-32 p-4 sm:p-10 lg:pt-44 lg:p-24 overflow-x-hidden font-sans relative"
    >
      {/* --- PREMIUM BACKGROUND ENGINE - MATCHES OTHER PAGES --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <motion.div 
          animate={{ x: mousePos.x * 3, y: mousePos.y * 3 }}
          className="absolute top-[-15%] right-[-5%] w-[600px] h-[600px] bg-blue-500/5 dark:bg-blue-600/5 rounded-full blur-[120px]" 
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* --- DYNAMIC KINETIC HEADER --- */}
        <header className="mb-16 md:mb-24">
          <motion.div 
             initial={{ x: -20, opacity: 0 }}
             animate={{ x: 0, opacity: 1 }}
             transition={{ delay: 0.4 }}
             className="space-y-4 text-center md:text-left"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50">
              <Star size={14} className="text-blue-600 fill-blue-600" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">
                Tech.Stack
              </span>
            </div>
            
            <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-none uppercase">
              My <br className="md:hidden" />
              <span className="text-zinc-300 dark:text-zinc-800 italic font-medium">Capabilities.</span>
            </h1>
            
            <p className="text-zinc-500 dark:text-zinc-400 max-w-md mx-auto md:mx-0 text-base md:text-lg font-light">
              A curated collection of technologies and frameworks I use to bridge the gap between complex logic and elegant design.
            </p>
          </motion.div>
        </header>

        <div className="flex flex-col lg:grid lg:grid-cols-[200px_1fr] gap-12 items-start">
          {/* --- SIDEBAR NAV - FIXED RESPONSIVENESS --- */}
          <motion.nav 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="flex lg:flex-col w-full gap-2 overflow-x-auto lg:overflow-visible no-scrollbar pb-2 lg:pb-0 px-1"
          >
            {categories.map((cat) => (
              <button
                key={cat}
                onMouseEnter={() => { if(window.innerWidth > 1024) setActiveCat(cat) }}
                onClick={() => setActiveCat(cat)}
                className="group relative flex-shrink-0 lg:w-full text-left py-3 md:py-4 px-5 rounded-xl transition-all"
              >
                <div className="relative z-10 flex items-center justify-between gap-4">
                  <span className={`text-[10px] md:text-[11px] uppercase tracking-[0.2em] font-black transition-all ${
                    activeCat === cat ? "text-blue-600" : "text-zinc-400 dark:text-zinc-600 group-hover:text-zinc-900 dark:group-hover:text-zinc-200"
                  }`}>
                    {cat}
                  </span>
                  <Activity size={10} className={`hidden lg:block transition-all ${activeCat === cat ? "text-blue-600 opacity-100" : "opacity-0 -translate-x-2"}`} />
                </div>
                {activeCat === cat && (
                  <motion.div layoutId="nav-pill" className="absolute inset-0 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl rounded-xl" />
                )}
              </button>
            ))}
          </motion.nav>

          {/* --- COMPACT GRID --- */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            style={{ rotateY: mousePos.x / 6, rotateX: -mousePos.y / 6, perspective: "1200px" }}
            className="w-full"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCat}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6"
              >
                {filteredSkills.map((skill) => (
                  <motion.div
                    key={skill.id}
                    whileHover={{ y: -5, translateZ: 20 }}
                    className="group relative p-5 rounded-[2rem] border border-zinc-200/50 dark:border-zinc-800/50 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-2xl transition-all duration-300 hover:border-blue-500/40 overflow-hidden"
                  >
                    <div className="relative z-10 flex flex-col gap-5">
                      <div className="flex justify-between items-start">
                        <div className="w-10 h-10 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center p-2.5 transition-transform group-hover:rotate-6">
                          <img 
                            src={`https://cdn.simpleicons.org/${getIconSlug(skill.name)}`}
                            alt={skill.name}
                            className="w-full h-full object-contain dark:brightness-200"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              const parent = e.currentTarget.parentElement;
                              if (parent) parent.innerHTML = `<span class="text-[10px] font-bold opacity-30 uppercase">${skill.name.charAt(0)}</span>`;
                            }}
                          />
                        </div>
                        <div className="flex gap-[2px]">
                          {[1, 2, 3].map((dot) => (
                            <div 
                              key={dot}
                              className={`h-1 w-2 md:w-2.5 rounded-full ${
                                dot <= (skill.level === 'advanced' ? 3 : skill.level === 'intermediate' ? 2 : 1)
                                ? "bg-blue-600 shadow-[0_0_8px_rgba(59,130,246,0.4)]" : "bg-zinc-200 dark:border-zinc-800"
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-[10px] md:text-xs font-black uppercase tracking-tighter text-zinc-900 dark:text-zinc-100 truncate">
                          {skill.name}
                        </h3>
                        <div className="flex items-center gap-1.5 mt-1">
                          <div className="w-1 h-1 rounded-full bg-blue-600 animate-pulse" />
                          <span className="text-[9px] font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest">{skill.level}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* --- TELEMETRY FOOTER --- */}
      <footer className="fixed bottom-8 right-8 hidden md:flex items-center gap-4 text-[9px] font-mono text-zinc-400 uppercase tracking-[0.3em] opacity-30 z-20">
        <div className="h-px w-8 bg-zinc-400" />
        <span>System_Online // Node.js_Environment</span>
      </footer>
    </motion.div>
  );
}
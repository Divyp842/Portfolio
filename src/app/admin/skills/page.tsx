"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { Skill } from "@/types";
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Check,
  Code2,
  Server,
  Database,
  Wrench,
} from "lucide-react";
import { useNotification } from "@/lib/useNotification";
import { useDeleteModal } from "@/lib/deleteModal";

type Category = "frontend" | "backend" | "database" | "tools";
type Level = "beginner" | "intermediate" | "advanced";

const CATEGORY_CONFIG: Record<
  Category,
  {
    label: string;
    color: string;
    bg: string;
    border: string;
    icon: React.ElementType;
  }
> = {
  frontend: {
    label: "Frontend",
    color: "text-indigo-600 dark:text-indigo-400",
    bg: "bg-indigo-50/50 dark:bg-indigo-500/10",
    border: "border-indigo-100 dark:border-indigo-500/20",
    icon: Code2,
  },
  backend: {
    label: "Backend",
    color: "text-slate-600 dark:text-slate-400",
    bg: "bg-slate-100/50 dark:bg-white/5",
    border: "border-slate-200 dark:border-white/10",
    icon: Server,
  },
  database: {
    label: "Database",
    color: "text-indigo-600 dark:text-indigo-400",
    bg: "bg-indigo-50/50 dark:bg-indigo-500/10",
    border: "border-indigo-100 dark:border-indigo-500/20",
    icon: Database,
  },
  tools: {
    label: "Tools",
    color: "text-slate-600 dark:text-slate-400",
    bg: "bg-slate-100/50 dark:bg-white/5",
    border: "border-slate-200 dark:border-white/10",
    icon: Wrench,
  },
};

const LEVEL_CONFIG: Record<
  Level,
  { label: string; width: string; color: string }
> = {
  beginner: {
    label: "Beginner",
    width: "33%",
    color: "bg-slate-300 dark:bg-slate-600",
  },
  intermediate: { label: "Intermediate", width: "66%", color: "bg-indigo-400" },
  advanced: { label: "Advanced", width: "100%", color: "bg-indigo-600" },
};

const CATEGORIES = Object.keys(CATEGORY_CONFIG) as Category[];
const LEVELS = Object.keys(LEVEL_CONFIG) as Level[];

function SkillIcon({ name }: { name: string }) {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .replace("js", "javascript")
    .replace("ts", "typescript");
  return (
    <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-white/5 overflow-hidden flex-shrink-0 shadow-sm">
      <img
        src={`https://cdn.simpleicons.org/${slug}/6366f1`}
        alt={name}
        width={24}
        height={24}
        className="grayscale group-hover:grayscale-0 transition-all duration-300"
        onError={(e) => {
          const t = e.currentTarget;
          t.style.display = "none";
          if (t.parentElement) {
            t.parentElement.innerHTML = `<span class="text-xs font-black text-indigo-500">${name.slice(0, 2).toUpperCase()}</span>`;
          }
        }}
      />
    </div>
  );
}

export default function AdminSkills() {
  const notification = useNotification();
  const deleteModal = useDeleteModal();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Category | "all">("all");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "frontend" as Category,
    level: "intermediate" as Level,
  });

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const { data, error } = await supabase
        .from("skills")
        .select("*")
        .order("category")
        .order("name");
      if (error) throw new Error(error.message);
      setSkills(data || []);
    } catch (err) {
      notification.error(
        err instanceof Error ? err.message : "Failed to fetch skills",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      notification.error("Skill name is required");
      return;
    }
    setSaving(true);
    try {
      if (editingId) {
        const { error } = await supabase
          .from("skills")
          .update(formData)
          .eq("id", editingId);
        if (error) throw error;
        notification.success("Skill updated!");
      } else {
        const { error } = await supabase.from("skills").insert([formData]);
        if (error) throw error;
        notification.success("Skill added!");
      }
      resetForm();
      await fetchSkills();
    } catch (err) {
      notification.error(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (
      !(await deleteModal.confirm(
        "Are you sure you want to permanently delete this skill?",
      ))
    )
      return;
    try {
      const { error } = await supabase.from("skills").delete().eq("id", id);
      if (error) throw error;
      notification.success("Skill deleted!");
      await fetchSkills();
    } catch (err) {
      notification.error("Failed to delete skill");
    }
  };

  const startEdit = (skill: Skill) => {
    setFormData({
      name: skill.name,
      category: skill.category as Category,
      level: (skill.level || "intermediate") as Level,
    });
    setEditingId(skill.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setFormData({ name: "", category: "frontend", level: "intermediate" });
    setEditingId(null);
    setShowForm(false);
  };

  const filteredSkills =
    activeTab === "all"
      ? skills
      : skills.filter((s) => s.category === activeTab);

  const inputClass =
    "w-full px-4 py-3 rounded-xl text-sm border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all text-slate-900 dark:text-slate-100";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-10 max-w-6xl mx-auto pb-20"
    >
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 px-1">
        <div className="space-y-1 text-center sm:text-left">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white uppercase tracking-tighter">
            Expertise
          </h1>
          <p className="text-slate-500 text-sm font-medium">
            Manage {skills.length} technical skills in your portfolio.
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 text-white text-sm font-bold shadow-lg shadow-indigo-500/20 active:scale-95 transition-all w-full sm:w-auto"
        >
          <Plus size={20} />
          <span>New Expertise</span>
        </button>
      </div>

      {/* Summary Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {CATEGORIES.map((cat) => {
          const cfg = CATEGORY_CONFIG[cat];
          const count = skills.filter((s) => s.category === cat).length;
          return (
            <div
              key={cat}
              className="relative overflow-hidden p-4 md:p-5 rounded-3xl bg-white dark:bg-[#16191f] border border-slate-200 dark:border-white/5 shadow-sm"
            >
              <div
                className={`absolute top-0 left-0 w-1 h-full ${cfg.bg.replace("/50", "")} opacity-40`}
              />
              <div className="flex justify-between items-center">
                <div className={`p-2 rounded-xl ${cfg.bg} ${cfg.color}`}>
                  <cfg.icon size={18} />
                </div>
                <span className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">
                  {count}
                </span>
              </div>
              <p className="mt-3 text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                {cfg.label}
              </p>
            </div>
          );
        })}
      </div>

      {/* Form Container */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white dark:bg-[#16191f] rounded-[2.5rem] border border-slate-200 dark:border-white/5 p-6 md:p-8 shadow-xl"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {editingId ? "Update Skill" : "New Skill Entry"}
              </h2>
              <button
                onClick={resetForm}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 text-slate-400"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                    Skill Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    autoFocus
                    required
                    className={inputClass}
                    placeholder="e.g. Next.js"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        category: e.target.value as Category,
                      })
                    }
                    className={inputClass}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {CATEGORY_CONFIG[c].label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                    Proficiency
                  </label>
                  <select
                    value={formData.level}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        level: e.target.value as Level,
                      })
                    }
                    className={inputClass}
                  >
                    {LEVELS.map((l) => (
                      <option key={l} value={l}>
                        {LEVEL_CONFIG[l].label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2.5 text-sm font-bold text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-10 py-3 rounded-2xl bg-indigo-600 text-white text-sm font-bold shadow-lg shadow-indigo-500/20 active:scale-95 transition-all"
                >
                  {saving
                    ? "Saving..."
                    : editingId
                      ? "Save Changes"
                      : "Create Skill"}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main List */}
      <div className="space-y-6">
        <div className="flex overflow-x-auto pb-2 scrollbar-hide px-1 gap-2">
          {(["all", ...CATEGORIES] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.15em] transition-all border shrink-0 ${activeTab === tab ? "bg-indigo-600 border-indigo-600 text-white shadow-md" : "bg-white dark:bg-[#16191f] border-slate-200 dark:border-white/5 text-slate-400"}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-28 rounded-[2rem] bg-slate-100 dark:bg-white/5 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {filteredSkills.map((skill) => {
              const level =
                LEVEL_CONFIG[(skill.level || "intermediate") as Level];
              return (
                <motion.div
                  key={skill.id}
                  layout
                  className="group relative bg-white dark:bg-[#16191f] rounded-[2rem] border border-slate-200 dark:border-white/5 p-5 md:p-6 transition-all duration-300"
                >
                  <div className="flex items-center gap-4">
                    <SkillIcon name={skill.name} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm md:text-base font-bold text-slate-900 dark:text-white truncate pr-2">
                          {skill.name}
                        </h3>

                        {/* Mobile Actions: Always visible on small screens */}
                        <div className="flex gap-1 md:hidden">
                          <button
                            onClick={() => startEdit(skill)}
                            className="p-1.5 text-slate-400"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(skill.id)}
                            className="p-1.5 text-red-400"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                      <p className="text-[9px] font-black text-indigo-500 uppercase tracking-widest mt-0.5">
                        {skill.category}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 space-y-1.5">
                    <div className="flex justify-between items-center text-[9px] font-black text-slate-400 uppercase">
                      <span>{level.label}</span>
                      <span>{level.width}</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: level.width }}
                        className={`h-full ${level.color} rounded-full`}
                      />
                    </div>
                  </div>

                  {/* Desktop Actions: Hover only */}
                  <div className="absolute top-4 right-4 hidden md:flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => startEdit(skill)}
                      className="p-2 rounded-xl bg-slate-50 dark:bg-white/5 text-slate-400 hover:text-indigo-500 transition-colors"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(skill.id)}
                      className="p-2 rounded-xl bg-slate-50 dark:bg-white/5 text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
}

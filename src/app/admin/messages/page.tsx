"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ContactMessage } from "@/types";
import {
  Trash2,
  Mail,
  MailOpen,
  ChevronDown,
  Reply,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { useNotification } from "@/lib/useNotification";
import { useDeleteModal } from "@/lib/deleteModal";
import { useBrowserNotification } from "@/lib/useBrowserNotification";

export default function AdminMessages() {
  const notification = useNotification();
  const deleteModal = useDeleteModal();
  const browserNotif = useBrowserNotification();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const previousUnreadCountRef = useRef(0);

  const fetchMessages = useCallback(async () => {
    try {
      const response = await fetch("/api/messages");
      if (!response.ok) throw new Error("Failed to fetch messages");
      const data = await response.json();

      // Check for new unread messages
      const currentUnreadCount = data.filter(
        (m: ContactMessage) => !m.read,
      ).length;
      if (
        previousUnreadCountRef.current > 0 &&
        currentUnreadCount > previousUnreadCountRef.current
      ) {
        // New message(s) arrived - show notification
        const newUnreadMessages = data.filter((m: ContactMessage) => !m.read);
        if (newUnreadMessages.length > 0) {
          const latestMessage = newUnreadMessages[0];
          browserNotif.showNewMessageNotification(
            latestMessage.name,
            latestMessage.message,
          );
        }
      }
      previousUnreadCountRef.current = currentUnreadCount;

      setMessages(data);
    } catch {
      console.error("Error fetching messages");
      notification.error("Inbound feed failure");
    } finally {
      setIsLoading(false);
    }
  }, [notification]);

  useEffect(() => {
    // Request notification permission on mount (don't wait for it)
    browserNotif.requestPermission().catch(() => {
      // Silently fail if permission request fails
    });

    // Fetch messages immediately
    fetchMessages();

    // Set up polling for new messages every 30 seconds
    pollingIntervalRef.current = setInterval(() => {
      fetchMessages();
    }, 30000);

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
    // Only run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMarkRead = async (id: string, read: boolean) => {
    try {
      const response = await fetch(`/api/messages/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: !read }),
      });

      if (!response.ok) throw new Error("Failed to update status");
      notification.success(read ? "Marked as unread" : "Marked as read");
      fetchMessages();
    } catch {
      notification.error("Status update failure");
    }
  };

  const handleDelete = async (id: string) => {
    if (
      !(await deleteModal.confirm(
        "Are you sure you want to permanently delete this message?",
      ))
    )
      return;

    try {
      const response = await fetch(`/api/messages/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete");
      notification.success("Entry removed");
      fetchMessages();
    } catch {
      notification.error("Deletion failure");
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="h-10 w-64 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-24 rounded-[2rem] bg-slate-100 dark:bg-slate-800 animate-pulse"
          />
        ))}
      </div>
    );
  }

  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-5xl mx-auto space-y-10 pb-20"
    >
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 px-1">
        <div className="space-y-1 text-center sm:text-left">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white uppercase tracking-tighter">
            Inbound
          </h1>
          <p className="text-sm font-medium text-slate-500">
            {unreadCount > 0 ? (
              <>
                You have{" "}
                <span className="text-indigo-600 dark:text-indigo-400 font-black uppercase tracking-widest">
                  {unreadCount} Pending
                </span>{" "}
                inquiries.
              </>
            ) : (
              "Secure feed synchronized. No unread entries."
            )}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {unreadCount > 0 && (
            <div className="px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-indigo-100 dark:bg-indigo-500/20 border border-indigo-200 dark:border-indigo-500/30 text-indigo-700 dark:text-indigo-300 flex items-center gap-2">
              📬 {unreadCount} Unread
            </div>
          )}
          <div className="px-5 py-2 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-center">
            Vault Size: {messages.length}
          </div>
        </div>
      </div>

      {/* Messages List */}
      {messages.length === 0 ? (
        <div className="text-center py-24 bg-white dark:bg-[#16191f] rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-white/5">
          <Mail size={40} className="mx-auto mb-4 text-slate-300 opacity-50" />
          <p className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">
            No Communication Logged
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              layout
              className={`group rounded-[2rem] border transition-all duration-300 bg-white dark:bg-[#16191f] overflow-hidden ${
                !message.read
                  ? "border-indigo-200 dark:border-indigo-500/30 shadow-xl shadow-indigo-500/5"
                  : "border-slate-200 dark:border-white/5 shadow-sm"
              }`}
            >
              {/* Header (Clickable) */}
              <div
                className="flex flex-col md:flex-row md:items-center gap-4 p-6 cursor-pointer hover:bg-slate-50/50 dark:hover:bg-white/[0.01]"
                onClick={() =>
                  setExpandedId(expandedId === message.id ? null : message.id)
                }
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 border transition-all ${
                    !message.read
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-500/20"
                      : "bg-slate-50 dark:bg-white/5 text-slate-400 border-slate-100 dark:border-white/5"
                  }`}
                >
                  {message.read ? <MailOpen size={20} /> : <Mail size={20} />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3
                      className={`text-base font-black tracking-tight truncate ${!message.read ? "text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-400"}`}
                    >
                      {message.name}
                    </h3>
                    {!message.read && (
                      <span className="px-2 py-0.5 rounded-md bg-indigo-500 text-[8px] font-black text-white uppercase tracking-widest animate-pulse">
                        New Inbound
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <span className="truncate">{message.email}</span>
                    <span className="text-slate-200 dark:text-slate-800">
                      •
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={10} />{" "}
                      {new Date(message.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-2 pt-4 md:pt-0 border-t md:border-t-0 border-slate-50 dark:border-white/5">
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMarkRead(message.id, message.read);
                      }}
                      className={`p-3 rounded-xl transition-all ${
                        message.read
                          ? "text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10"
                          : "text-indigo-600 bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20"
                      }`}
                      title={message.read ? "Mark unread" : "Mark read"}
                    >
                      {message.read ? (
                        <Mail size={16} />
                      ) : (
                        <MailOpen size={16} />
                      )}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(message.id);
                      }}
                      className="p-3 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div
                    className={`transition-transform duration-500 text-slate-300 ml-2 ${expandedId === message.id ? "rotate-180 text-indigo-500" : ""}`}
                  >
                    <ChevronDown size={22} />
                  </div>
                </div>
              </div>

              {/* Message Body */}
              <AnimatePresence>
                {expandedId === message.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-slate-100 dark:border-white/5"
                  >
                    <div className="p-6 md:p-10">
                      <div className="bg-slate-50 dark:bg-white/[0.02] p-6 md:p-8 rounded-[1.5rem] border border-slate-100 dark:border-white/5 relative">
                        <div className="absolute -top-3 left-6 px-3 py-1 bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/10 rounded-full flex items-center gap-2">
                          <ShieldCheck size={12} className="text-indigo-500" />
                          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
                            Verified Message Body
                          </span>
                        </div>
                        <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed font-medium">
                          {message.message}
                        </p>
                      </div>

                      <div className="mt-8 flex justify-center md:justify-end">
                        <a
                          href={`mailto:${message.email}`}
                          className="flex items-center justify-center gap-3 w-full md:w-auto px-10 py-4 rounded-2xl bg-indigo-600 text-white text-xs font-black uppercase tracking-[0.2em] hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-500/20 active:scale-95"
                        >
                          <Reply size={16} />
                          Secure Reply
                        </a>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

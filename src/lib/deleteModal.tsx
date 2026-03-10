"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, X } from "lucide-react";

interface DeleteModalContextType {
  confirm: (message: string) => Promise<boolean>;
}

const DeleteModalContext = createContext<DeleteModalContextType | null>(null);

export function DeleteModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [resolver, setResolver] = useState<((value: boolean) => void) | null>(
    null,
  );

  const confirm = useCallback((msg: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setMessage(msg);
      setResolver(() => resolve);
      setIsOpen(true);
    });
  }, []);

  const handleConfirm = () => {
    resolver?.(true);
    setIsOpen(false);
  };

  const handleCancel = () => {
    resolver?.(false);
    setIsOpen(false);
  };

  return (
    <DeleteModalContext.Provider value={{ confirm }}>
      {children}
      <DeleteModal
        isOpen={isOpen}
        message={message}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </DeleteModalContext.Provider>
  );
}

export function useDeleteModal() {
  const context = useContext(DeleteModalContext);
  if (!context) {
    throw new Error("useDeleteModal must be used within DeleteModalProvider");
  }
  return context;
}

interface DeleteModalProps {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

function DeleteModal({
  isOpen,
  message,
  onConfirm,
  onCancel,
}: DeleteModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="fixed inset-0 bg-black/50 dark:bg-black/70 z-[9998]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[9999]"
          >
            <div className="bg-white dark:bg-[#16191f] rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 w-[90vw] max-w-md overflow-hidden">
              {/* Header */}
              <div className="px-6 py-5 border-b border-slate-100 dark:border-white/5 bg-red-50/50 dark:bg-red-500/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-500/20 flex items-center justify-center">
                    <Trash2
                      size={20}
                      className="text-red-600 dark:text-red-400"
                    />
                  </div>
                  <h2 className="font-bold text-slate-900 dark:text-white text-lg">
                    Delete Item
                  </h2>
                </div>
                <button
                  onClick={onCancel}
                  className="p-1 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-colors"
                >
                  <X size={20} className="text-slate-500" />
                </button>
              </div>

              {/* Content */}
              <div className="px-6 py-6">
                <p className="text-slate-700 dark:text-slate-300 text-center font-medium">
                  {message ||
                    "Are you sure you want to delete this item? This action cannot be undone."}
                </p>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02] flex gap-3 justify-end">
                <button
                  onClick={onCancel}
                  className="px-5 py-2.5 rounded-lg border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-100 dark:hover:bg-white/5 transition-all active:scale-95"
                >
                  Cancel
                </button>
                <button
                  onClick={onConfirm}
                  className="px-5 py-2.5 rounded-lg bg-red-600 dark:bg-red-500 text-white font-semibold hover:bg-red-700 dark:hover:bg-red-600 transition-all shadow-lg shadow-red-500/20 active:scale-95"
                >
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

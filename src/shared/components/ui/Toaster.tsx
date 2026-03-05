import { AnimatePresence, motion } from 'framer-motion';
import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type ToastVariant = 'error' | 'success';

interface Toast {
  id: string;
  message: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  showToast: (message: string, variant?: ToastVariant) => void;
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------
const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------
const DISMISS_AFTER_MS = 4000;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, variant: ToastVariant = 'error') => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, message, variant }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, DISMISS_AFTER_MS);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Toaster toasts={toasts} />
    </ToastContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Toaster — renders the active toasts
// ---------------------------------------------------------------------------
function Toaster({ toasts }: { toasts: Toast[] }) {
  return (
    <div className="fixed bottom-6 right-4 z-50 flex flex-col gap-2 sm:right-6">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.95 }}
            transition={{ type: 'spring' as const, stiffness: 320, damping: 28 }}
            className="flex items-center gap-3 rounded-2xl border border-nbt-border bg-nbt-surface px-4 py-3 shadow-xl"
          >
            {toast.variant === 'error' && (
              <span className="text-red-400 text-sm">✕</span>
            )}
            {toast.variant === 'success' && (
              <span className="text-emerald-400 text-sm">✓</span>
            )}
            <p className="text-sm text-nbt-text">{toast.message}</p>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

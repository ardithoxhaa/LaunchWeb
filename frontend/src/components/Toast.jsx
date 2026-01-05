/**
 * Toast Notification System
 * Provides global toast notifications for success, error, warning, and info messages
 */

import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const ToastContext = createContext(null);

// Toast types with their styles
const toastStyles = {
  success: {
    bg: 'bg-green-500/20 border-green-500/40',
    icon: '✓',
    iconBg: 'bg-green-500',
  },
  error: {
    bg: 'bg-red-500/20 border-red-500/40',
    icon: '✕',
    iconBg: 'bg-red-500',
  },
  warning: {
    bg: 'bg-yellow-500/20 border-yellow-500/40',
    icon: '⚠',
    iconBg: 'bg-yellow-500',
  },
  info: {
    bg: 'bg-blue-500/20 border-blue-500/40',
    icon: 'ℹ',
    iconBg: 'bg-blue-500',
  },
};

function ToastItem({ toast, onDismiss }) {
  const style = toastStyles[toast.type] || toastStyles.info;

  useEffect(() => {
    if (toast.duration !== Infinity) {
      const timer = setTimeout(() => {
        onDismiss(toast.id);
      }, toast.duration || 4000);
      return () => clearTimeout(timer);
    }
  }, [toast.id, toast.duration, onDismiss]);

  return (
    <div
      className={`flex items-start gap-3 rounded-xl border p-4 shadow-lg backdrop-blur-sm transition-all duration-300 ${style.bg}`}
      style={{ minWidth: '320px', maxWidth: '420px' }}
    >
      <div className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${style.iconBg}`}>
        {style.icon}
      </div>
      <div className="flex-1 min-w-0">
        {toast.title && (
          <div className="font-semibold text-white text-sm">{toast.title}</div>
        )}
        <div className={`text-sm text-white/80 ${toast.title ? 'mt-1' : ''}`}>
          {toast.message}
        </div>
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="flex-shrink-0 text-white/60 hover:text-white transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((toast) => {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setToasts((prev) => [...prev, { ...toast, id }]);
    return id;
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const dismissAll = useCallback(() => {
    setToasts([]);
  }, []);

  const toast = useCallback({
    success: (message, options = {}) => addToast({ type: 'success', message, ...options }),
    error: (message, options = {}) => addToast({ type: 'error', message, ...options }),
    warning: (message, options = {}) => addToast({ type: 'warning', message, ...options }),
    info: (message, options = {}) => addToast({ type: 'info', message, ...options }),
    dismiss: dismissToast,
    dismissAll,
  }, [addToast, dismissToast, dismissAll]);

  return (
    <ToastContext.Provider value={toast}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={dismissToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

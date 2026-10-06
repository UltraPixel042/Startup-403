import { useState, useEffect } from 'react';

export default function Toast({ message, type = 'success', onClose }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300);
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgMap = {
    success: 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-300',
    error: 'bg-red-500/20 border border-red-500/30 text-red-300',
    info: 'bg-cyan-500/20 border border-cyan-500/30 text-cyan-300',
    warning: 'bg-amber-500/20 border border-amber-500/30 text-amber-300',
  };

  const iconMap = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
    warning: '⚠',
  };

  return (
    <div
      className={`toast ${bgMap[type]} ${visible ? 'animate-slide-up' : 'opacity-0 transition-opacity'}`}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-center gap-3">
        <span className="text-lg" aria-hidden="true">{iconMap[type]}</span>
        <p className="text-sm font-medium">{message}</p>
      </div>
    </div>
  );
}

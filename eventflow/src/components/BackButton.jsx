import React from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft } from 'lucide-react';

export default function BackButton({ label = 'Back', fallbackPage = null, onClick = null, className = '' }) {
  const { goBack, navigate } = useApp();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (fallbackPage) {
      navigate(fallbackPage);
    } else {
      goBack();
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50/50 shadow-2xs transition-all active:scale-95 ${className}`}
    >
      <ArrowLeft size={15} />
      <span>{label}</span>
    </button>
  );
}

import React from 'react';
import { useApp } from '../context/AppContext';
import { Bell, X, ArrowRight } from 'lucide-react';

export default function NotificationToast() {
  const { activeToast, setActiveToast, navigate } = useApp();

  if (!activeToast) return null;

  return (
    <div className="fixed top-20 right-6 z-50 max-w-md w-full animate-bounce-short">
      <div className="bg-slate-900 text-white rounded-2xl shadow-2xl p-4 border border-indigo-500/40 backdrop-blur-lg flex items-start gap-3.5">
        <div className="text-2xl p-2 bg-indigo-500/20 rounded-xl border border-indigo-500/30 flex-shrink-0">
          {activeToast.icon || '🔔'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-sm text-indigo-300 uppercase tracking-wide">
              {activeToast.title}
            </h4>
            <button
              onClick={() => setActiveToast(null)}
              className="text-slate-400 hover:text-white p-1 rounded-lg transition"
            >
              <X size={16} />
            </button>
          </div>
          <p className="text-sm text-slate-200 mt-1 leading-snug">
            {activeToast.message}
          </p>
          <div className="mt-2.5 flex items-center gap-3">
            <button
              onClick={() => {
                navigate('notifications');
                setActiveToast(null);
              }}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition"
            >
              View in Notifications <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

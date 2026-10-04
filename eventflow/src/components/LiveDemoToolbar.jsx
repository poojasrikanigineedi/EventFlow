import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  RefreshCw,
  Shuffle,
  QrCode,
  Bell,
  ChevronDown,
  ChevronUp,
  MapPin,
  ShieldAlert
} from 'lucide-react';

export default function LiveDemoToolbar({ onOpenScanner }) {
  const {
    currentUser,
    switchRole,
    updateSessionVenue,
    sessions,
    venues,
    resetDemoData,
    currentPage,
    navigate
  } = useApp();

  const [isExpanded, setIsExpanded] = useState(true);

  // Helper to trigger Section 21 Live Schedule Change
  const handleTriggerSection21 = () => {
    // Find Coding Round session (sess-cs-3)
    const codingSession = sessions.find(s => s.id === 'sess-cs-3') || sessions[2];
    if (!codingSession) return;

    // Toggle between venue-block-b-lab1 and venue-block-b-lab2
    const targetVenueId =
      codingSession.venueId === 'venue-block-b-lab1'
        ? 'venue-block-b-lab2'
        : 'venue-block-b-lab1';

    updateSessionVenue(codingSession.id, targetVenueId);
  };

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-40 max-w-4xl w-[95%]">
      <div className="bg-slate-900/95 backdrop-blur-md text-white rounded-2xl shadow-2xl border border-indigo-500/30 overflow-hidden">
        {/* Header / Minimizer */}
        <div className="px-4 py-2 bg-gradient-to-r from-indigo-900/80 via-slate-900 to-purple-900/80 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-bold text-indigo-300 tracking-wider uppercase flex items-center gap-1.5">
              <Sparkles size={13} className="text-amber-400" />
              EventFlow Interactive Test Lab
            </span>
            <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-500/30">
              Active: {currentUser.role === 'organizer' ? '🏢 Organizer' : '🎓 Attendee (Teju)'}
            </span>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 text-slate-400 hover:text-white rounded transition"
            title={isExpanded ? 'Minimize Test Toolbar' : 'Expand Test Toolbar'}
          >
            {isExpanded ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
          </button>
        </div>

        {/* Content buttons */}
        {isExpanded && (
          <div className="p-3 flex flex-wrap items-center justify-between gap-2.5 text-xs">
            {/* Role switch toggle */}
            <div className="flex items-center gap-1.5 bg-slate-800 p-1 rounded-xl border border-slate-700">
              <button
                onClick={() => switchRole('student')}
                className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1 ${
                  currentUser.role === 'student'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                🎓 Student
              </button>
              <button
                onClick={() => switchRole('organizer')}
                className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1 ${
                  currentUser.role === 'organizer'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                🏢 Organizer
              </button>
            </div>

            {/* Feature shortcuts */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Trigger Section 21 Schedule Change */}
              <button
                onClick={handleTriggerSection21}
                className="bg-amber-600 hover:bg-amber-500 text-white font-bold px-3 py-1.5 rounded-xl shadow transition flex items-center gap-1.5 active:scale-95"
                title="Organizer changes session venue -> notifies all registered attendees"
              >
                <Shuffle size={14} />
                <span>Simulate Venue Shift (Sec 21)</span>
              </button>

              {/* Trigger QR Scanner Check-in (Section 18 & 22) */}
              <button
                onClick={onOpenScanner}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-3 py-1.5 rounded-xl shadow transition flex items-center gap-1.5 active:scale-95"
              >
                <QrCode size={14} />
                <span>Scan Venue QR (Sec 18/22)</span>
              </button>

              {/* View Campus Map */}
              <button
                onClick={() => navigate('campus-map')}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium px-3 py-1.5 rounded-xl border border-slate-700 transition flex items-center gap-1.5"
              >
                <MapPin size={14} className="text-emerald-400" />
                <span>Campus GPS</span>
              </button>

              {/* Reset Data */}
              <button
                onClick={resetDemoData}
                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg transition"
                title="Reset all demo data to initial state"
              >
                <RefreshCw size={15} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

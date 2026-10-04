import React from 'react';
import { useApp } from '../context/AppContext';
import { Compass, Heart, ExternalLink } from 'lucide-react';

export default function Footer() {
  const { navigate } = useApp();

  return (
    <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800 text-xs mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2 text-white font-bold text-lg">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
                <Compass size={18} />
              </div>
              <span>EventFlow</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Navigate. Participate. Celebrate. A smart platform to discover, register, navigate and stay updated with college events.
            </p>
          </div>

          {/* Attendee Links */}
          <div className="space-y-2">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">Attendee Hub</h4>
            <ul className="space-y-1.5">
              <li>
                <button onClick={() => navigate('browse-events')} className="hover:text-white transition">
                  Browse All Events
                </button>
              </li>
              <li>
                <button onClick={() => navigate('my-schedule')} className="hover:text-white transition">
                  Personal Schedule
                </button>
              </li>
              <li>
                <button onClick={() => navigate('campus-map')} className="hover:text-white transition">
                  Campus GPS &amp; Indoor Map
                </button>
              </li>
              <li>
                <button onClick={() => navigate('live-crowd-attendee')} className="hover:text-white transition">
                  Live Crowd Status
                </button>
              </li>
            </ul>
          </div>

          {/* Organizer Links */}
          <div className="space-y-2">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">Organizer Suite</h4>
            <ul className="space-y-1.5">
              <li>
                <button onClick={() => navigate('organizer-dashboard')} className="hover:text-white transition">
                  Organizer Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => navigate('create-event')} className="hover:text-white transition">
                  Create Campus Event
                </button>
              </li>
              <li>
                <button onClick={() => navigate('qr-generate')} className="hover:text-white transition">
                  Venue QR Generation
                </button>
              </li>
              <li>
                <button onClick={() => navigate('qr-tracking')} className="hover:text-white transition">
                  Duplicate Prevention &amp; Check-in
                </button>
              </li>
            </ul>
          </div>

          {/* System Specs */}
          <div className="space-y-2">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">Architecture</h4>
            <p className="text-[11px] leading-relaxed">
              EventFlow incorporates full real-time synchronization between Attendee and Organizer modules, reactive schedule shift detection, and strict zero-duplicate QR verification.
            </p>
            <div className="pt-2 text-[10px] text-indigo-400 font-mono">
              Status: All 22 Modules Operational
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <div>&copy; {new Date().getFullYear()} EventFlow. VVI University Campus Systems.</div>
          <div className="flex items-center gap-1">
            <span>Built with care for seamless campus life</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

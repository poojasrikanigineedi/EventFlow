import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Compass,
  ArrowRight,
  ShieldCheck,
  MapPin,
  Users,
  Calendar,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export default function WelcomePage() {
  const { navigate, setSelectedRole } = useApp();

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-between bg-gradient-to-b from-slate-50 via-white to-indigo-50/20">
      {/* Hero Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-16 text-center">
        {/* Top Announcement Pill */}
        <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-200/80 px-4 py-1.5 rounded-full text-xs font-semibold text-indigo-700 mb-8 shadow-2xs">
          <Sparkles size={14} className="text-amber-500" />
          <span>Complete College Event Management Lifecycle</span>
        </div>

        {/* Logo and App Title */}
        <div className="flex flex-col items-center justify-center mb-6">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-purple-600 flex items-center justify-center text-white shadow-xl shadow-indigo-600/30 mb-4 animate-bounce-short">
            <Compass size={44} className="animate-spin-slow" />
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight">
            Event<span className="text-indigo-600">Flow</span>
          </h1>
          <p className="text-xs sm:text-sm font-bold text-indigo-600 tracking-widest uppercase mt-1">
            Navigate • Participate • Celebrate
          </p>
        </div>

        {/* Description as specified */}
        <div className="max-w-2xl mx-auto mb-10 space-y-3">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800">
            “Discover Events. Participate. Stay Connected.”
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            A unified smart platform connecting college event organizers and attendees. Manage event creation, customized registration, venue wayfinding, zero-duplicate QR attendance, live crowd congestion tracking, and automated schedule updates.
          </p>
        </div>

        {/* Action Buttons (Section 3 Requirement) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
          <button
            onClick={() => navigate('role-select')}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <span>Get Started</span>
            <ArrowRight size={18} />
          </button>

          <button
            onClick={() => navigate('role-select')}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-base border-2 border-slate-200 hover:border-slate-300 shadow-sm flex items-center justify-center gap-2 transition"
          >
            <span>Login / Sign Up</span>
          </button>
        </div>

        {/* Pillars of EventFlow */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 text-left mt-8">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
              <Calendar size={20} />
            </div>
            <h3 className="font-bold text-slate-900 text-sm mb-1">Lifecycle Management</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Create, publish, and schedule multiple sessions with custom registration questions.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
              <MapPin size={20} />
            </div>
            <h3 className="font-bold text-slate-900 text-sm mb-1">Campus Wayfinding</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Visual route guidance and room floorplans to navigate directly to assigned blocks and labs.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
              <ShieldCheck size={20} />
            </div>
            <h3 className="font-bold text-slate-900 text-sm mb-1">Zero-Duplicate Check-in</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Strict database-enforced unique verification so duplicate scans never inflate crowd counts.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
              <Users size={20} />
            </div>
            <h3 className="font-bold text-slate-900 text-sm mb-1">Live Crowd Meters</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Real-time room capacity calculation shared synchronously between attendees and organizers.
            </p>
          </div>
        </div>
      </div>

      {/* Footer stripe */}
      <div className="border-t border-slate-200 py-4 bg-white text-center text-xs text-slate-500">
        EventFlow System • Clean Initial State (0 Events, 0 Check-ins, 0 Registrations)
      </div>
    </div>
  );
}

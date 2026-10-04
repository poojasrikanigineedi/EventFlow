import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import BackButton from '../components/BackButton';
import {
  CheckCircle,
  Calendar,
  Clock,
  MapPin,
  QrCode,
  Layers,
  Compass,
  FileText,
  BookmarkCheck,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function RegistrationSuccessPage() {
  const { latestRegistration, navigate } = useApp();

  useEffect(() => {
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 }
    });
  }, []);

  if (!latestRegistration) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center space-y-4">
        <BackButton fallbackPage="browse-events" label="Back to Events" />
        <div className="bg-white rounded-3xl p-8 border text-center space-y-2">
          <h3 className="font-bold text-slate-800">No active registration session found</h3>
          <p className="text-xs text-slate-500">Please choose an event to register.</p>
        </div>
      </div>
    );
  }

  const reg = latestRegistration;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in text-center">
      {/* Back Button (Section 25 Requirement: Back -> Registration Form) */}
      <div className="flex items-center justify-between text-left">
        <BackButton fallbackPage="register-form" label="Back to Registration Form" />
      </div>

      {/* Success Badge */}
      <div className="flex flex-col items-center justify-center space-y-2">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 mb-1">
          <CheckCircle size={36} className="animate-bounce-short" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Registration Successful!
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md">
          Your participation has been saved in the database.
        </p>
      </div>

      {/* Ticket Pass Card (Section 10 Requirement) */}
      <div className="bg-white rounded-3xl border-2 border-slate-200 overflow-hidden shadow-xl text-left">
        <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 text-white p-6 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full">
              Official Entry Pass
            </span>
            <h2 className="text-xl sm:text-2xl font-black mt-1">
              {reg.eventName}
            </h2>
          </div>

          <div className="text-right">
            <span className="text-[11px] text-indigo-200 block">Status</span>
            <span className="text-xs font-bold bg-emerald-400 text-slate-950 px-2.5 py-0.5 rounded-full inline-block mt-0.5">
              🟢 Confirmed
            </span>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-400 uppercase tracking-wider font-bold">
                Registration Code
              </span>
              <div className="text-xl font-mono font-black text-indigo-700">
                {reg.registrationCode}
              </div>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-slate-400 block font-bold uppercase">Date Registered</span>
              <span className="text-xs font-semibold text-slate-700">
                {new Date(reg.registrationDate).toLocaleDateString([], {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Event Date</span>
              <span className="font-bold text-slate-800">{reg.eventDate}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Timing</span>
              <span className="font-bold text-slate-800">{reg.startTime} – {reg.endTime}</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 text-center pt-2 border-t">
            ✅ Automatically synchronized with your personalized schedule and Campus GPS.
          </p>
        </div>
      </div>

      {/* Buttons (Section 10 Requirement: My Registered Events, View Schedule, View Location) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
        <button
          onClick={() => navigate('my-registered-events')}
          className="p-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-md text-xs flex items-center justify-center gap-1.5 transition"
        >
          <BookmarkCheck size={16} />
          <span>My Registered Events</span>
        </button>

        <button
          onClick={() => navigate('my-schedule')}
          className="p-3.5 bg-white hover:bg-slate-50 text-slate-800 font-bold rounded-2xl border-2 border-slate-200 text-xs flex items-center justify-center gap-1.5 transition"
        >
          <Layers size={16} className="text-purple-600" />
          <span>View Schedule</span>
        </button>

        <button
          onClick={() => navigate('campus-map')}
          className="p-3.5 bg-white hover:bg-slate-50 text-indigo-600 font-bold rounded-2xl border-2 border-indigo-200 text-xs flex items-center justify-center gap-1.5 transition"
        >
          <Compass size={16} />
          <span>View Location</span>
        </button>
      </div>
    </div>
  );
}

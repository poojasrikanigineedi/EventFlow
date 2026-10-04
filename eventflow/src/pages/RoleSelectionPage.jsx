import React from 'react';
import { useApp } from '../context/AppContext';
import BackButton from '../components/BackButton';
import {
  GraduationCap,
  Building2,
  ArrowRight,
  CheckCircle,
  Compass,
  Sparkles
} from 'lucide-react';

export default function RoleSelectionPage() {
  const { setSelectedRole, navigate } = useApp();

  const handleSelectRole = (role) => {
    setSelectedRole(role);
    navigate('login');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center py-10 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 to-indigo-50/20">
      <div className="max-w-3xl w-full">
        {/* Back Button (Section 25 Requirement) */}
        <div className="mb-6">
          <BackButton fallbackPage="welcome" label="Back to Welcome Page" />
        </div>

        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
            Step 1 • Role Selection
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            How would you like to continue?
          </h1>
          <p className="text-sm text-slate-500 max-w-md mx-auto mt-2">
            Select your account type to proceed to the unified login and sign-up portal.
          </p>
        </div>

        {/* The Two Large Cards (Section 4 Requirement) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Student / Attendee Card */}
          <div
            onClick={() => handleSelectRole('student')}
            className="group bg-white rounded-3xl border-2 border-slate-200 hover:border-indigo-600 p-8 shadow-xs hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
                🎓
              </div>

              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition">
                  Student / Attendee
                </h3>
                <span className="text-xs font-bold bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full">
                  Attendee
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-2">
                Browse events, view event details, register, view personalized schedules, navigate to venues, check live crowd counts, and receive notifications.
              </p>

              <ul className="mt-6 space-y-2 text-xs text-slate-500 border-t pt-4">
                <li className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-emerald-500" />
                  <span>Personalized timeline schedule</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-emerald-500" />
                  <span>Campus GPS &amp; room floorplans</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-emerald-500" />
                  <span>Live venue crowd telemetry</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-4">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectRole('student');
                }}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-md shadow-indigo-600/25 flex items-center justify-center gap-2 text-xs sm:text-sm transition"
              >
                <span>Continue as Student / Attendee</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* Organizer Card */}
          <div
            onClick={() => handleSelectRole('organizer')}
            className="group bg-white rounded-3xl border-2 border-slate-200 hover:border-purple-600 p-8 shadow-xs hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-16 h-16 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
                🏢
              </div>

              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-purple-600 transition">
                  Organizer
                </h3>
                <span className="text-xs font-bold bg-purple-50 text-purple-700 px-2.5 py-0.5 rounded-full">
                  Admin &amp; Host
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-2">
                Create events, configure schedules, assign venues, manage registrations, generate QR codes, track check-ins, and broadcast notifications.
              </p>

              <ul className="mt-6 space-y-2 text-xs text-slate-500 border-t pt-4">
                <li className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-emerald-500" />
                  <span>Session builder &amp; venue allocator</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-emerald-500" />
                  <span>Dynamic Venue QR code generation</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-emerald-500" />
                  <span>Duplicate-free attendance verification</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-4">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectRole('organizer');
                }}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-md shadow-purple-600/25 flex items-center justify-center gap-2 text-xs sm:text-sm transition"
              >
                <span>Continue as Organizer</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

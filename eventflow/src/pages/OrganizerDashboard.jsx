import React from 'react';
import { useApp } from '../context/AppContext';
import BackButton from '../components/BackButton';
import {
  Calendar,
  Users,
  PlusCircle,
  QrCode,
  ShieldCheck,
  BarChart3,
  Layers,
  MapPin,
  Bell,
  User,
  LogOut,
  ArrowRight,
  Inbox,
  BookmarkCheck
} from 'lucide-react';

export default function OrganizerDashboard() {
  const {
    currentUser,
    events,
    venues,
    registrations,
    qrTracking,
    navigate,
    logout,
    setSelectedEventId
  } = useApp();

  // Real statistics calculated strictly from database records (Initially 0)
  const totalEvents = events.length;
  const totalRegistrations = registrations.length;
  const totalCheckIns = qrTracking?.checkIns?.length || 0;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Top Bar with Console Badge & Profile / Logout */}
      <div className="flex items-center justify-between">
        <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 font-bold text-xs px-3 py-1.5 rounded-xl border border-indigo-200 shadow-2xs">
          <span>🏢</span>
          <span>Organizer Command Center</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('profile')}
            className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:text-indigo-600 transition flex items-center gap-1.5 shadow-2xs"
          >
            <User size={14} /> Profile Information
          </button>
          <button
            onClick={logout}
            className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-rose-600 hover:bg-rose-50 transition flex items-center gap-1.5 shadow-2xs"
          >
            <LogOut size={14} /> Logout
          </button>
        </div>
      </div>

      {/* Organizer Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 bg-indigo-500/20 px-3 py-1 rounded-full text-xs font-semibold border border-indigo-500/30 text-indigo-300">
            <span>🏢</span>
            <span className="uppercase tracking-wider">Identified As: Organizer / Event Chair</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Hello, {currentUser?.name || 'Organizer'} 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-lg">
            Master command console for publishing campus events, building multi-session schedules, generating QR codes, and tracking live crowd check-ins.
          </p>
        </div>

        <div>
          <button
            onClick={() => navigate('create-event')}
            className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl shadow-lg shadow-indigo-600/30 flex items-center gap-2 text-xs sm:text-sm transition transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <PlusCircle size={18} />
            <span>+ Create Event</span>
          </button>
        </div>
      </div>

      {/* Real Statistics Cards (Section 15: Initially Events = 0, Registrations = 0, Check-ins = 0) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Events Created</div>
            <div className="text-3xl font-black text-slate-900 mt-1">{totalEvents}</div>
            <div className="text-[11px] text-indigo-600 font-semibold mt-0.5">Your Active Catalog</div>
          </div>
          <div className="p-3.5 bg-indigo-50 text-indigo-600 rounded-2xl">
            <Calendar size={24} />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Registrations</div>
            <div className="text-3xl font-black text-slate-900 mt-1">{totalRegistrations}</div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">Verified Participants</div>
          </div>
          <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-2xl">
            <Users size={24} />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Valid Check-ins</div>
            <div className="text-3xl font-black text-slate-900 mt-1">{totalCheckIns}</div>
            <div className="text-[11px] text-purple-600 font-semibold mt-0.5">Unique Venue Scans</div>
          </div>
          <div className="p-3.5 bg-purple-50 text-purple-600 rounded-2xl">
            <ShieldCheck size={24} />
          </div>
        </div>
      </div>

      {/* Organizer Navigation Hub (Section 15 Requirements) */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
          Organizer Hub Navigation
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          <button
            onClick={() => navigate('create-event')}
            className="p-3.5 bg-white hover:bg-indigo-50/50 rounded-2xl border border-slate-200 hover:border-indigo-300 transition text-left shadow-2xs"
          >
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl w-fit mb-2">
              <PlusCircle size={16} />
            </div>
            <div className="text-xs font-bold text-slate-800">Create Event</div>
          </button>

          <button
            onClick={() => navigate('assign-venue')}
            className="p-3.5 bg-white hover:bg-sky-50/50 rounded-2xl border border-slate-200 hover:border-sky-300 transition text-left shadow-2xs"
          >
            <div className="p-2 bg-sky-50 text-sky-600 rounded-xl w-fit mb-2">
              <MapPin size={16} />
            </div>
            <div className="text-xs font-bold text-slate-800">Assign Venues</div>
          </button>

          <button
            onClick={() => navigate('create-schedule')}
            className="p-3.5 bg-white hover:bg-purple-50/50 rounded-2xl border border-slate-200 hover:border-purple-300 transition text-left shadow-2xs"
          >
            <div className="p-2 bg-purple-50 text-purple-600 rounded-xl w-fit mb-2">
              <Layers size={16} />
            </div>
            <div className="text-xs font-bold text-slate-800">Schedules</div>
          </button>

          <button
            onClick={() => navigate('registration-management')}
            className="p-3.5 bg-white hover:bg-emerald-50/50 rounded-2xl border border-slate-200 hover:border-emerald-300 transition text-left shadow-2xs"
          >
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl w-fit mb-2">
              <BookmarkCheck size={16} />
            </div>
            <div className="text-xs font-bold text-slate-800">Registrations</div>
          </button>

          <button
            onClick={() => navigate('qr-generate')}
            className="p-3.5 bg-white hover:bg-amber-50/50 rounded-2xl border border-slate-200 hover:border-amber-300 transition text-left shadow-2xs"
          >
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl w-fit mb-2">
              <QrCode size={16} />
            </div>
            <div className="text-xs font-bold text-slate-800">Generate QR</div>
          </button>

          <button
            onClick={() => navigate('qr-tracking')}
            className="p-3.5 bg-white hover:bg-cyan-50/50 rounded-2xl border border-slate-200 hover:border-cyan-300 transition text-left shadow-2xs"
          >
            <div className="p-2 bg-cyan-50 text-cyan-600 rounded-xl w-fit mb-2">
              <ShieldCheck size={16} />
            </div>
            <div className="text-xs font-bold text-slate-800">QR Tracking</div>
          </button>

          <button
            onClick={() => navigate('live-crowd-organizer')}
            className="p-3.5 bg-white hover:bg-rose-50/50 rounded-2xl border border-slate-200 hover:border-rose-300 transition text-left shadow-2xs"
          >
            <div className="p-2 bg-rose-50 text-rose-600 rounded-xl w-fit mb-2">
              <BarChart3 size={16} />
            </div>
            <div className="text-xs font-bold text-slate-800">Live Crowd</div>
          </button>
        </div>
      </div>

      {/* Managed Events Directory or True Empty State (Section 15 Requirement) */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-5 shadow-xs">
        <div className="flex items-center justify-between border-b pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              My Created Events
            </h2>
            <p className="text-xs text-slate-500">
              Events published and managed by your organizer account.
            </p>
          </div>
          <button
            onClick={() => navigate('create-event')}
            className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
          >
            + Create New Event
          </button>
        </div>

        {events.length === 0 ? (
          /* True Empty State as required */
          <div className="p-10 text-center space-y-3 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
              <Inbox size={24} />
            </div>
            <h3 className="font-bold text-slate-800 text-sm">
              No events created yet.
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Get started by creating your first college hackathon, symposium, or workshop.
            </p>
            <button
              onClick={() => navigate('create-event')}
              className="mt-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md transition"
            >
              + Create First Event
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {events.map((evt) => (
              <div
                key={evt.id}
                className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-slate-50 p-3 rounded-2xl transition"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                      {evt.category}
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        evt.status === 'Published'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {evt.status}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900">{evt.name}</h4>
                  <div className="text-xs text-slate-500 mt-0.5">
                    📅 {evt.eventDate} ({evt.startTime} – {evt.endTime}) • 👥 {evt.registrationsCount || 0} Registrations • ⏱️ {evt.sessionsCount || 0} Sessions
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (setSelectedEventId) setSelectedEventId(evt.id);
                      navigate('create-schedule', { eventId: evt.id });
                    }}
                    className="px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-xl text-xs font-bold transition"
                  >
                    Manage Schedule
                  </button>
                  <button
                    onClick={() => navigate('qr-generate')}
                    className="px-3 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl text-xs font-bold transition flex items-center gap-1"
                  >
                    <QrCode size={13} /> QR
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

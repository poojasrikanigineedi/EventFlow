import React from 'react';
import { useApp } from '../context/AppContext';
import BackButton from '../components/BackButton';
import {
  BookmarkCheck,
  Calendar,
  Clock,
  Layers,
  MapPin,
  Users,
  FileText,
  Inbox,
  ArrowRight
} from 'lucide-react';

export default function MyRegisteredEventsPage() {
  const { registrations, navigate } = useApp();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in">
      {/* Back Button (Section 25 Requirement: Back -> Attendee Dashboard) */}
      <div className="flex items-center justify-between">
        <BackButton fallbackPage="attendee-dashboard" label="Back to Attendee Dashboard" />
      </div>

      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          My Registered Events
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Confirmed campus event registrations linked to your attendee ID.
        </p>
      </div>

      {/* Registered Events List or True Empty State (Section 11 Requirement) */}
      {registrations.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
            <Inbox size={32} />
          </div>
          <h3 className="font-bold text-slate-800 text-base">
            You have not registered for any events yet.
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Once you register for an open event, your entry credentials and schedule will appear here automatically.
          </p>
          <button
            onClick={() => navigate('browse-events')}
            className="mt-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md transition"
          >
            Browse Events Catalog
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {registrations.map((reg) => (
            <div
              key={reg.id}
              className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-200">
                      {reg.registrationCode}
                    </span>
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                      Confirmed
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">
                    {reg.eventName}
                  </h3>
                </div>

                <div className="text-xs text-slate-400">
                  Registered: {new Date(reg.registrationDate).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
                <div className="flex items-center gap-1.5">
                  <Calendar size={14} className="text-indigo-600" />
                  <span>{reg.eventDate}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock size={14} className="text-purple-600" />
                  <span>{reg.startTime} – {reg.endTime}</span>
                </div>
              </div>

              {/* 4 Action Buttons as requested in Section 11: View Details, Schedule, Location, Live Crowd */}
              <div className="pt-3 border-t grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <button
                  onClick={() => navigate('event-details', { eventId: reg.eventId })}
                  className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl font-bold text-slate-700 flex items-center justify-center gap-1.5 transition"
                >
                  <FileText size={14} /> View Details
                </button>

                <button
                  onClick={() => navigate('my-schedule')}
                  className="p-2.5 bg-indigo-50 hover:bg-indigo-100 rounded-xl font-bold text-indigo-700 flex items-center justify-center gap-1.5 transition"
                >
                  <Layers size={14} /> Schedule
                </button>

                <button
                  onClick={() => navigate('campus-map')}
                  className="p-2.5 bg-purple-50 hover:bg-purple-100 rounded-xl font-bold text-purple-700 flex items-center justify-center gap-1.5 transition"
                >
                  <MapPin size={14} /> Location
                </button>

                <button
                  onClick={() => navigate('live-crowd-attendee')}
                  className="p-2.5 bg-emerald-50 hover:bg-emerald-100 rounded-xl font-bold text-emerald-700 flex items-center justify-center gap-1.5 transition"
                >
                  <Users size={14} /> Live Crowd
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

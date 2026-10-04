import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import BackButton from '../components/BackButton';
import {
  Calendar,
  Layers,
  MapPin,
  Users,
  Bell,
  User,
  LogOut,
  ArrowRight,
  Compass,
  BookmarkCheck,
  Sparkles,
  Inbox,
  Search,
  Clock,
  CheckCircle
} from 'lucide-react';

export default function AttendeeDashboard() {
  const {
    currentUser,
    events,
    registrations,
    schedule,
    notifications,
    navigate,
    logout
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');

  const registeredEventIds = new Set(registrations.map(r => r.eventId));

  const filteredUpcomingEvents = events.filter((evt) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      evt.name.toLowerCase().includes(q) ||
      evt.category.toLowerCase().includes(q) ||
      evt.shortDescription?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Top Bar with Attendee Status & Profile / Logout */}
      <div className="flex items-center justify-between">
        <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 font-bold text-xs px-3 py-1.5 rounded-xl border border-indigo-200 shadow-2xs">
          <span>🎓</span>
          <span>Attendee Event Portal</span>
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

      {/* Greeting Banner */}
      <div className="bg-gradient-to-r from-indigo-700 via-indigo-800 to-purple-800 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 bg-white/15 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-xs border border-white/20">
            <span>🎓</span>
            <span className="uppercase tracking-wider">Identified As: Attendee</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Hello, {currentUser?.name || 'Attendee'} 👋
          </h1>
          <p className="text-xs sm:text-sm text-indigo-100 max-w-xl">
            {currentUser?.department ? `${currentUser.department} • ` : ''}{currentUser?.college || 'VVI University'}
          </p>
        </div>
      </div>

      {/* Quick Navigation Hub */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <button
          onClick={() => navigate('browse-events')}
          className="p-4 bg-white hover:bg-indigo-50/50 rounded-2xl border border-slate-200 hover:border-indigo-300 transition text-left group shadow-2xs"
        >
          <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl w-fit mb-2 group-hover:scale-110 transition-transform">
            <Calendar size={18} />
          </div>
          <div className="text-xs font-bold text-slate-800">Browse Events</div>
          <div className="text-[10px] text-slate-400 mt-0.5">{events.length} Available</div>
        </button>

        <button
          onClick={() => navigate('my-registered-events')}
          className="p-4 bg-white hover:bg-emerald-50/50 rounded-2xl border border-slate-200 hover:border-emerald-300 transition text-left group shadow-2xs"
        >
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl w-fit mb-2 group-hover:scale-110 transition-transform">
            <BookmarkCheck size={18} />
          </div>
          <div className="text-xs font-bold text-slate-800">My Registrations</div>
          <div className="text-[10px] text-slate-400 mt-0.5">{registrations.length} Active</div>
        </button>

        <button
          onClick={() => navigate('my-schedule')}
          className="p-4 bg-white hover:bg-purple-50/50 rounded-2xl border border-slate-200 hover:border-purple-300 transition text-left group shadow-2xs"
        >
          <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl w-fit mb-2 group-hover:scale-110 transition-transform">
            <Layers size={18} />
          </div>
          <div className="text-xs font-bold text-slate-800">My Schedule</div>
          <div className="text-[10px] text-slate-400 mt-0.5">{schedule.length} Sessions</div>
        </button>

        <button
          onClick={() => navigate('campus-map')}
          className="p-4 bg-white hover:bg-sky-50/50 rounded-2xl border border-slate-200 hover:border-sky-300 transition text-left group shadow-2xs"
        >
          <div className="p-2.5 bg-sky-50 text-sky-600 rounded-xl w-fit mb-2 group-hover:scale-110 transition-transform">
            <MapPin size={18} />
          </div>
          <div className="text-xs font-bold text-slate-800">Campus GPS</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Venues &amp; Map</div>
        </button>

        <button
          onClick={() => navigate('live-crowd-attendee')}
          className="p-4 bg-white hover:bg-amber-50/50 rounded-2xl border border-slate-200 hover:border-amber-300 transition text-left group shadow-2xs"
        >
          <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl w-fit mb-2 group-hover:scale-110 transition-transform">
            <Users size={18} />
          </div>
          <div className="text-xs font-bold text-slate-800">Live Crowd</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Capacity Meters</div>
        </button>

        <button
          onClick={() => navigate('notifications')}
          className="p-4 bg-white hover:bg-rose-50/50 rounded-2xl border border-slate-200 hover:border-rose-300 transition text-left group shadow-2xs"
        >
          <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl w-fit mb-2 group-hover:scale-110 transition-transform">
            <Bell size={18} />
          </div>
          <div className="text-xs font-bold text-slate-800">Notifications</div>
          <div className="text-[10px] text-slate-400 mt-0.5">{notifications.length} Alerts</div>
        </button>
      </div>

      {/* SECTION: UPCOMING CAMPUS EVENTS TO CHECK & PARTICIPATE */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-indigo-600" />
              <h2 className="text-lg sm:text-xl font-black text-slate-900">
                Upcoming Events to Discover
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Check out published events, review their details, and register to reserve your ticket.
            </p>
          </div>

          {/* Quick Search */}
          <div className="relative min-w-[240px]">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search events..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {filteredUpcomingEvents.length === 0 ? (
          <div className="p-10 text-center space-y-3 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
              <Calendar size={24} />
            </div>
            <h3 className="font-bold text-slate-800 text-sm">
              {events.length === 0 ? 'No events published yet' : 'No matching events found'}
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {events.length === 0
                ? 'When organizers create and publish campus events, they will appear here for you to check details and register.'
                : 'Try adjusting your search query.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredUpcomingEvents.map((evt) => {
              const isRegistered = registeredEventIds.has(evt.id);

              return (
                <div
                  key={evt.id}
                  onClick={() => navigate('event-details', { eventId: evt.id })}
                  className="group bg-white rounded-3xl border border-slate-200 hover:border-indigo-400 p-5 shadow-2xs hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                        {evt.category}
                      </span>

                      {isRegistered ? (
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                          <CheckCircle size={11} /> Registered
                        </span>
                      ) : evt.registrationOpen ? (
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500 text-white shadow-2xs">
                          🟢 Open
                        </span>
                      ) : (
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                          🔴 Closed
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="font-bold text-slate-900 text-base group-hover:text-indigo-600 transition leading-snug">
                        {evt.name}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                        {evt.shortDescription || evt.detailedDescription || 'Campus event.'}
                      </p>
                    </div>

                    <div className="space-y-1 text-xs text-slate-600 pt-2 border-t border-slate-100">
                      <div className="flex items-center gap-2">
                        <Calendar size={13} className="text-indigo-600" />
                        <span>{evt.eventDate}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={13} className="text-purple-600" />
                        <span>{evt.startTime} – {evt.endTime}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">
                      {evt.registrationsCount || 0} registered
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate('event-details', { eventId: evt.id });
                      }}
                      className="px-3.5 py-1.5 bg-indigo-50 hover:bg-indigo-600 hover:text-white text-indigo-700 rounded-xl text-xs font-bold transition flex items-center gap-1"
                    >
                      <span>View Details</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* SECTION: MY REGISTERED EVENTS */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-5 shadow-xs">
        <div className="flex items-center justify-between border-b pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              My Registered Events
            </h2>
            <p className="text-xs text-slate-500">
              Events you have officially signed up for.
            </p>
          </div>
          <button
            onClick={() => navigate('browse-events')}
            className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
          >
            <span>Browse Full Catalog</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {registrations.length === 0 ? (
          <div className="p-8 text-center space-y-2 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <p className="text-xs text-slate-500">
              You haven't registered for any events yet. Check out the upcoming events above and click "View Details" to register!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {registrations.map((reg) => (
              <div
                key={reg.id}
                className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-indigo-300 shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
                      {reg.registrationCode}
                    </span>
                    <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      Confirmed
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-base">
                    {reg.eventName}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    📅 {reg.eventDate} • ⏰ {reg.startTime}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <button
                    onClick={() => navigate('my-schedule')}
                    className="font-bold text-indigo-600 hover:underline"
                  >
                    View Schedule
                  </button>
                  <button
                    onClick={() => navigate('campus-map')}
                    className="font-bold text-purple-600 hover:underline"
                  >
                    Campus GPS &rarr;
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

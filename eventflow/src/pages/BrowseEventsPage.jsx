import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import BackButton from '../components/BackButton';
import {
  Search,
  Filter,
  Calendar,
  Clock,
  MapPin,
  CheckCircle,
  ArrowRight,
  Inbox,
  Sparkles
} from 'lucide-react';

export default function BrowseEventsPage() {
  const { events, registrations, navigate, setSelectedEventId } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const categories = [
    'ALL',
    'Hackathon',
    'Workshop',
    'Technical Event',
    'Fest',
    'Competition',
    'Seminar',
    'Other'
  ];

  const registeredEventIds = new Set(registrations.map(r => r.eventId));

  const filteredEvents = events.filter((evt) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      evt.name.toLowerCase().includes(q) ||
      evt.category.toLowerCase().includes(q) ||
      evt.shortDescription?.toLowerCase().includes(q);

    const matchesCategory =
      selectedCategory === 'ALL' ||
      evt.category.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  const handleCardClick = (eventId) => {
    navigate('event-details', { eventId });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in">
      {/* Back Button (Section 25 Requirement: Back -> Attendee Dashboard) */}
      <div className="flex items-center justify-between">
        <BackButton fallbackPage="attendee-dashboard" label="Back to Attendee Dashboard" />
      </div>

      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Browse Events
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Explore published campus events available for participant registration.
        </p>
      </div>

      {/* Search and Category Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search published events by name or keyword..."
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-medium text-slate-800 shadow-2xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1 flex items-center gap-1">
            <Filter size={12} /> Filters:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Event Cards Grid or True Empty State (Section 7 Requirement) */}
      {filteredEvents.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
            <Inbox size={32} />
          </div>
          <h3 className="font-bold text-slate-800 text-base">
            No events available at the moment.
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Organizers have not published any events yet. When an organizer creates and opens an event for registration, it will automatically appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredEvents.map((evt) => {
            const isRegistered = registeredEventIds.has(evt.id);

            return (
              <div
                key={evt.id}
                onClick={() => handleCardClick(evt.id)}
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
                    <h3 className="font-bold text-slate-900 text-lg group-hover:text-indigo-600 transition leading-snug">
                      {evt.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                      {evt.shortDescription || evt.detailedDescription || 'Campus event.'}
                    </p>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <Calendar size={13} className="text-indigo-600" />
                      <span>{evt.eventDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={13} className="text-purple-600" />
                      <span>{evt.startTime} – {evt.endTime}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 pt-1">
                      Registration Deadline: <span className="font-semibold text-slate-600">{evt.registrationDeadline}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400">
                    {evt.registrationsCount || 0} registered
                  </span>
                  <span className="font-bold text-indigo-600 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    View Details &rarr;
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

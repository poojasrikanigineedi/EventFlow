import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import BackButton from '../components/BackButton';
import GoogleMapsModal from '../components/GoogleMapsModal';
import { api } from '../api/client';
import {
  Calendar,
  Clock,
  MapPin,
  Building,
  Users,
  CheckCircle,
  FileText,
  ShieldAlert,
  ArrowRight,
  Compass,
  AlertTriangle,
  BookmarkCheck,
  Layers,
  Sparkles,
  Phone,
  HelpCircle,
  ChevronRight
} from 'lucide-react';

export default function EventDetailsPage() {
  const { currentEventId, registrations, currentUser, navigate } = useApp();

  const [eventData, setEventData] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isMapModalOpen, setIsMapModalOpen] = useState(false);

  useEffect(() => {
    async function fetchEventDetails() {
      if (!currentEventId) return;
      setIsLoading(true);
      try {
        const res = await api.getEvent(currentEventId);
        setEventData(res.event);
        setSessions(res.sessions || []);
        setQuestions(res.questions || []);
      } catch (err) {
        setError(err.message || 'Failed to load event details.');
      } finally {
        setIsLoading(false);
      }
    }
    fetchEventDetails();
  }, [currentEventId]);

  const registrationRecord = registrations.find(r => r.eventId === currentEventId);
  const isAlreadyRegistered = Boolean(registrationRecord);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center text-xs text-slate-500">
        Loading event details from database...
      </div>
    );
  }

  if (error || !eventData) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-4">
        <BackButton fallbackPage="browse-events" label="Back to Events" />
        <div className="p-8 bg-white rounded-3xl border text-center space-y-2">
          <AlertTriangle size={32} className="text-amber-500 mx-auto" />
          <h3 className="font-bold text-slate-800">Event Not Found</h3>
          <p className="text-xs text-slate-500">{error || 'The requested event could not be found.'}</p>
        </div>
      </div>
    );
  }

  const isClosed = !eventData.registrationOpen || eventData.status === 'Closed';
  const hasPassedDeadline = eventData.registrationDeadline && new Date(eventData.registrationDeadline) < new Date();
  const primaryVenue = sessions[0]?.venueName;

  const primaryVenueObj = sessions[0]?.venueId ? {
    id: sessions[0].venueId,
    name: sessions[0].venueName,
    building: sessions[0].venueBuilding,
    block: sessions[0].venueBlock,
    floor: sessions[0].venueFloor,
    room: sessions[0].venueRoom,
    capacity: sessions[0].venueCapacity,
    address: sessions[0].venueAddress,
    googleMapsUrl: sessions[0].venueGoogleMapsUrl,
    latitude: sessions[0].venueLatitude,
    longitude: sessions[0].venueLongitude
  } : null;

  const handleRegisterClick = () => {
    if (!currentUser) {
      navigate('login');
      return;
    }
    navigate('register-form', { eventId: eventData.id });
  };

  const handleViewMap = () => {
    if (sessions[0]?.venueId) {
      navigate('campus-map', { venueId: sessions[0].venueId });
    } else {
      alert('Location not available yet. The organizer has not assigned a venue to this session.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in">
      {/* Back Button */}
      <div className="flex items-center justify-between">
        <BackButton fallbackPage="attendee-dashboard" label="Back to Dashboard" />
        <span className="text-xs font-bold text-slate-400">
          Event Overview &amp; Registration
        </span>
      </div>

      {/* Main Event Card Going Through All Details Created by Organizer */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b pb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                {eventData.category}
              </span>
              <span className="text-xs text-slate-400">
                Organized by {eventData.organizerName} • {eventData.organizerCollege}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {eventData.name}
            </h1>

            {eventData.shortDescription && (
              <p className="text-sm text-slate-600 font-medium">
                {eventData.shortDescription}
              </p>
            )}
          </div>

          <div>
            {isAlreadyRegistered ? (
              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-right space-y-1">
                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 justify-end">
                  <CheckCircle size={14} /> Already Registered
                </span>
                <span className="font-mono text-xs font-bold text-emerald-800 block">
                  {registrationRecord?.registrationCode}
                </span>
              </div>
            ) : isClosed || hasPassedDeadline ? (
              <span className="px-4 py-2 bg-rose-50 text-rose-700 text-xs font-bold rounded-xl border border-rose-200 inline-block">
                🔴 Registration Closed
              </span>
            ) : (
              <button
                onClick={handleRegisterClick}
                className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition"
              >
                <span>Register Now</span>
                <ArrowRight size={15} />
              </button>
            )}
          </div>
        </div>

        {/* Event Schedule & Venue Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-100">
          <div>
            <span className="text-slate-400 block text-[11px] font-bold uppercase">Date &amp; Time</span>
            <div className="font-bold text-slate-800 mt-0.5">
              📅 {eventData.eventDate} ({eventData.startTime} – {eventData.endTime})
            </div>
          </div>

          <div>
            <span className="text-slate-400 block text-[11px] font-bold uppercase">Venue Location</span>
            {primaryVenueObj ? (
              <button
                type="button"
                onClick={() => setIsMapModalOpen(true)}
                className="font-bold text-indigo-700 hover:text-indigo-900 mt-0.5 truncate text-left flex items-center gap-1 group transition"
                title="Click to view Google Maps & GPS Navigation"
              >
                <MapPin size={13} className="text-rose-500 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <span className="underline decoration-indigo-300 underline-offset-2 truncate">
                  {primaryVenueObj.name} ({primaryVenueObj.room})
                </span>
              </button>
            ) : (
              <div className="font-bold text-slate-800 mt-0.5 truncate">
                📍 {primaryVenue || 'Location not available yet'}
              </div>
            )}
          </div>

          <div>
            <span className="text-slate-400 block text-[11px] font-bold uppercase">Registration Closes</span>
            <div className="font-bold text-rose-600 mt-0.5">
              ⏰ {eventData.registrationDeadline}
            </div>
          </div>
        </div>

        {/* Detailed Description */}
        {eventData.detailedDescription && (
          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <FileText size={16} className="text-indigo-600" />
              Detailed Description
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
              {eventData.detailedDescription}
            </p>
          </div>
        )}

        {/* Eligibility, Team Size, Requirements, Contact Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-4 border-t">
          {eventData.eligibility && (
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="font-bold text-slate-800 block mb-1">Eligibility Criteria:</span>
              <p className="text-slate-600">{eventData.eligibility}</p>
            </div>
          )}

          {eventData.teamSize && (
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="font-bold text-slate-800 block mb-1">Team Size:</span>
              <p className="text-slate-600">{eventData.teamSize} participant(s)</p>
            </div>
          )}

          {eventData.requirements && (
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="font-bold text-slate-800 block mb-1">Prerequisites &amp; Requirements:</span>
              <p className="text-slate-600">{eventData.requirements}</p>
            </div>
          )}

          {eventData.contactInformation && (
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="font-bold text-slate-800 block mb-1">Organizer Contact:</span>
              <p className="text-slate-600">{eventData.contactInformation}</p>
            </div>
          )}
        </div>

        {/* Rules & Guidelines */}
        {eventData.rules && (
          <div className="space-y-2 pt-2 border-t text-xs">
            <span className="font-bold text-slate-800 flex items-center gap-1.5">
              <ShieldAlert size={15} className="text-amber-500" />
              Rules &amp; Guidelines:
            </span>
            <p className="text-slate-600 whitespace-pre-line leading-relaxed bg-amber-50/40 p-4 rounded-2xl border border-amber-100">
              {eventData.rules}
            </p>
          </div>
        )}

        {/* Organizer's Scheduled Sessions Breakdown */}
        {sessions.length > 0 && (
          <div className="space-y-3 pt-3 border-t">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <Layers size={16} className="text-purple-600" />
              Event Schedule &amp; Assigned Venues
            </h3>
            <div className="space-y-2">
              {sessions.map((sess, idx) => (
                <div
                  key={sess.id}
                  className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center flex-shrink-0 text-[11px]">
                      {idx + 1}
                    </span>
                    <div>
                      <h4 className="font-bold text-slate-900">{sess.name}</h4>
                      {sess.description && (
                        <p className="text-slate-500 text-[11px] mt-0.5">{sess.description}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-slate-600 text-[11px] pl-8 sm:pl-0">
                    <span className="font-semibold">⏱️ {sess.startTime} – {sess.endTime}</span>
                    {sess.venueName && (
                      <span className="font-bold text-indigo-600 flex items-center gap-1">
                        <MapPin size={12} />
                        {sess.venueName} ({sess.venueRoom})
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Google Maps Actions Strip */}
        <div className="pt-2 border-t flex flex-wrap items-center gap-2">
          {primaryVenueObj && (
            <button
              onClick={() => setIsMapModalOpen(true)}
              className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-2xs"
            >
              <Compass size={14} className="text-indigo-600" />
              <span>View Venue on Google Maps &amp; GPS Navigation</span>
            </button>
          )}

          <button
            onClick={handleViewMap}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition"
          >
            <span>{primaryVenue ? 'Campus Spatial Map' : 'Location Not Set'}</span>
          </button>
        </div>
      </div>

      {/* REQUIREMENT: ASK FOR REGISTER BELOW TO FILL REGISTRATION FORM */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-indigo-900/60 flex flex-col md:flex-row md:items-center justify-between gap-6 animate-fade-in">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 bg-indigo-500/20 px-3 py-1 rounded-full text-xs font-semibold border border-indigo-500/30 text-indigo-300">
            <Sparkles size={13} className="text-amber-400" />
            <span className="uppercase tracking-wider">Registration Step</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            {isAlreadyRegistered
              ? 'You are Registered for this Event'
              : 'Ready to participate? Register below to fill the registration form'}
          </h3>

          <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            {isAlreadyRegistered
              ? `Your registration pass (${registrationRecord?.registrationCode}) is active. Access your schedule, directions, and live venue attendance.`
              : 'Review your attendee credentials and answer organizer-specific questions to secure your ticket and receive your digital entry code.'}
          </p>
        </div>

        <div className="flex-shrink-0">
          {isAlreadyRegistered ? (
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => navigate('my-registered-events')}
                className="px-5 py-3 bg-white hover:bg-slate-100 text-slate-900 font-bold rounded-2xl text-xs transition shadow-md flex items-center justify-center gap-1.5"
              >
                <BookmarkCheck size={15} className="text-emerald-600" />
                <span>View Registration Pass</span>
              </button>
              <button
                onClick={() => navigate('my-schedule')}
                className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl text-xs transition shadow-md flex items-center justify-center gap-1.5"
              >
                <Layers size={15} />
                <span>My Schedule</span>
              </button>
            </div>
          ) : isClosed || hasPassedDeadline ? (
            <div className="px-6 py-3.5 bg-rose-500/20 border border-rose-500/40 text-rose-200 rounded-2xl text-xs font-bold text-center">
              🔴 Registration is Closed
            </div>
          ) : (
            <button
              onClick={handleRegisterClick}
              className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-sm rounded-2xl shadow-xl shadow-indigo-600/40 flex items-center justify-center gap-2 transition transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>Fill Registration Form &rarr;</span>
              <ArrowRight size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Google Maps Wayfinding Modal */}
      {primaryVenueObj && (
        <GoogleMapsModal
          isOpen={isMapModalOpen}
          onClose={() => setIsMapModalOpen(false)}
          venue={primaryVenueObj}
        />
      )}
    </div>
  );
}

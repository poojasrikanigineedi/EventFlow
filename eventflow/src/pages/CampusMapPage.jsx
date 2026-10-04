import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import BackButton from '../components/BackButton';
import GoogleMapsModal from '../components/GoogleMapsModal';
import {
  MapPin,
  Navigation,
  Compass,
  Layers,
  Inbox,
  ArrowRight,
  Building,
  Users,
  Locate,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';

export default function CampusMapPage() {
  const { schedule, venues, currentVenueId, setCurrentVenueId } = useApp();

  const activeVenues = venues.filter(v => v.id);

  const [selectedVenueIdState, setSelectedVenueIdState] = useState(
    currentVenueId || activeVenues[0]?.id || null
  );

  const [modalVenue, setModalVenue] = useState(null);

  // Student's Current GPS Position
  const [userLocation, setUserLocation] = useState({
    lat: null,
    lng: null,
    accuracy: null,
    status: 'detecting', // 'detecting' | 'detected' | 'fallback'
    label: 'Detecting your device GPS...'
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            accuracy: Math.round(pos.coords.accuracy),
            status: 'detected',
            label: `Live GPS: ${pos.coords.latitude.toFixed(5)}° N, ${pos.coords.longitude.toFixed(5)}° E (±${Math.round(pos.coords.accuracy)}m)`
          });
        },
        (err) => {
          console.warn('Geolocation fallback:', err.message);
          setUserLocation({
            lat: 12.9716,
            lng: 77.5946,
            accuracy: 15,
            status: 'fallback',
            label: 'Campus Quadrangle (12.9716° N, 77.5946° E)'
          });
        },
        { enableHighAccuracy: true, timeout: 6000 }
      );
    } else {
      setUserLocation({
        lat: 12.9716,
        lng: 77.5946,
        accuracy: 15,
        status: 'fallback',
        label: 'Campus Quadrangle (12.9716° N, 77.5946° E)'
      });
    }
  }, []);

  const targetVenue = activeVenues.find(v => v.id === (currentVenueId || selectedVenueIdState)) || activeVenues[0];

  // Venue location query
  const venueLocationQuery = targetVenue
    ? (targetVenue.address || `${targetVenue.name}, Room ${targetVenue.room}, ${targetVenue.building}, VVI University`)
    : '';

  const venueCoordinates = targetVenue && targetVenue.latitude && targetVenue.longitude
    ? `${targetVenue.latitude},${targetVenue.longitude}`
    : encodeURIComponent(venueLocationQuery);

  const googleDirectionsUrl = userLocation.lat && userLocation.lng
    ? `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${venueCoordinates}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venueLocationQuery)}`;

  const embedMapUrl = userLocation.lat && userLocation.lng && targetVenue
    ? `https://maps.google.com/maps?saddr=${userLocation.lat},${userLocation.lng}&daddr=${encodeURIComponent(venueLocationQuery)}&output=embed`
    : `https://maps.google.com/maps?q=${encodeURIComponent(venueLocationQuery)}&output=embed`;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in">
      {/* Back Button */}
      <div className="flex items-center justify-between">
        <BackButton fallbackPage="attendee-dashboard" label="Back to Dashboard" />
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Campus Wayfinding &amp; Google Maps
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time navigation displaying your current location and organizer-designated event venues.
          </p>
        </div>

        {/* Live Location Status Indicator */}
        <div className="inline-flex items-center gap-2 bg-sky-50 text-sky-800 border border-sky-200 px-3.5 py-1.5 rounded-2xl text-xs font-semibold self-start sm:self-auto shadow-2xs">
          <Locate size={14} className="text-sky-600 animate-pulse" />
          <span className="truncate max-w-xs">{userLocation.label}</span>
        </div>
      </div>

      {activeVenues.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
            <Inbox size={32} />
          </div>
          <h3 className="font-bold text-slate-800 text-base">
            No venue locations available yet.
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Venues registered with Google Maps by event organizers will appear here automatically.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Active Target Venue Details Bar */}
          {targetVenue && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
                <div>
                  <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200 uppercase tracking-wider">
                    {targetVenue.block} • {targetVenue.floor}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                    {targetVenue.name}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Room {targetVenue.room} • {targetVenue.building} ({targetVenue.venueType})
                  </p>
                  {targetVenue.address && (
                    <div className="text-xs text-indigo-700 font-semibold mt-1 flex items-center gap-1">
                      <MapPin size={13} className="text-indigo-600 flex-shrink-0" />
                      <span>{targetVenue.address}</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setModalVenue(targetVenue)}
                    className="px-4 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                  >
                    <Compass size={14} />
                    <span>Open Fullscreen Map</span>
                  </button>

                  <a
                    href={googleDirectionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/25 transition flex items-center gap-1.5"
                  >
                    <Navigation size={14} />
                    <span>Turn-by-Turn GPS</span>
                  </a>
                </div>
              </div>

              {/* Dual Location Pill */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-sky-50 rounded-2xl border border-sky-100 flex items-center gap-3">
                  <div className="p-2 bg-sky-600 text-white rounded-xl">
                    <Locate size={15} />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700 block">
                      Your Origin
                    </span>
                    <span className="font-bold text-slate-800">{userLocation.label}</span>
                  </div>
                </div>

                <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-100 flex items-center gap-3">
                  <div className="p-2 bg-indigo-600 text-white rounded-xl">
                    <MapPin size={15} />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 block">
                      Target Destination
                    </span>
                    <span className="font-bold text-slate-900 truncate block">
                      {targetVenue.name} ({targetVenue.building})
                    </span>
                  </div>
                </div>
              </div>

              {/* Embedded Interactive Google Map */}
              <div className="rounded-2xl overflow-hidden border-2 border-slate-200 aspect-video max-h-[380px] w-full bg-slate-100 shadow-inner">
                <iframe
                  title={`Google Maps Direction - ${targetVenue.name}`}
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  src={embedMapUrl}
                  loading="lazy"
                  allowFullScreen
                />
              </div>
            </div>
          )}

          {/* Venue Selection Selector */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              All Available Campus Venues (Click to Map)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {activeVenues.map((v) => {
                const isSelected = v.id === targetVenue?.id;
                return (
                  <div
                    key={v.id}
                    onClick={() => {
                      setSelectedVenueIdState(v.id);
                      if (setCurrentVenueId) setCurrentVenueId(v.id);
                    }}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-md ring-2 ring-indigo-400/50'
                        : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800 shadow-2xs'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          isSelected ? 'bg-white/20 text-white' : 'bg-indigo-50 text-indigo-700'
                        }`}>
                          {v.block} • {v.floor}
                        </span>
                        <span className={`text-[11px] font-semibold ${isSelected ? 'text-indigo-100' : 'text-slate-400'}`}>
                          Cap: {v.capacity}
                        </span>
                      </div>
                      <div className="font-bold text-sm leading-snug">{v.name}</div>
                      <div className={`text-xs mt-1 truncate ${isSelected ? 'text-indigo-100' : 'text-slate-500'}`}>
                        Room {v.room} • {v.building}
                      </div>
                      {v.address && (
                        <div className={`text-[11px] mt-1 truncate ${isSelected ? 'text-indigo-200' : 'text-slate-400'}`}>
                          📍 {v.address}
                        </div>
                      )}
                    </div>

                    <div className="mt-3 pt-2 border-t border-white/20 flex items-center justify-between text-xs">
                      <span className={`text-[11px] font-bold ${isSelected ? 'text-white' : 'text-indigo-600'}`}>
                        {isSelected ? '✓ Selected Destination' : 'Select Destination'}
                      </span>
                      <Navigation size={13} className={isSelected ? 'text-white' : 'text-slate-400'} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {modalVenue && (
        <GoogleMapsModal
          isOpen={!!modalVenue}
          onClose={() => setModalVenue(null)}
          venue={modalVenue}
        />
      )}
    </div>
  );
}

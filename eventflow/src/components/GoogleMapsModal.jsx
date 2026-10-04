import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Navigation,
  ExternalLink,
  X,
  Compass,
  Locate,
  Building,
  CheckCircle,
  AlertCircle,
  Footprints
} from 'lucide-react';

export default function GoogleMapsModal({ isOpen, onClose, venue }) {
  const [currentPosition, setCurrentPosition] = useState({
    lat: null,
    lng: null,
    accuracy: null,
    status: 'detecting', // 'detecting' | 'detected' | 'fallback'
    address: 'Campus Main Entrance / Central Quad'
  });

  useEffect(() => {
    if (!isOpen) return;

    // Detect browser geolocation for student's real current position
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCurrentPosition({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            accuracy: Math.round(pos.coords.accuracy),
            status: 'detected',
            address: `Lat: ${pos.coords.latitude.toFixed(5)}, Lng: ${pos.coords.longitude.toFixed(5)} (±${Math.round(pos.coords.accuracy)}m)`
          });
        },
        (err) => {
          console.warn('Geolocation unavailable or denied:', err.message);
          // Simulated campus default coordinates for prototype demonstration
          setCurrentPosition({
            lat: 12.9716,
            lng: 77.5946,
            accuracy: 15,
            status: 'fallback',
            address: 'Campus Center & Quadrangle (12.9716° N, 77.5946° E)'
          });
        },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
      );
    } else {
      setCurrentPosition({
        lat: 12.9716,
        lng: 77.5946,
        accuracy: 15,
        status: 'fallback',
        address: 'Campus Center & Quadrangle (12.9716° N, 77.5946° E)'
      });
    }
  }, [isOpen, venue]);

  if (!isOpen || !venue) return null;

  // Venue location string (Address or Name + Room + Building + College)
  const venueLocationQuery = venue.address ||
    `${venue.name}, Room ${venue.room}, ${venue.building}, ${venue.block || ''}, VVI University`;

  // Venue coordinates if provided, else query string
  const venueCoordinates = (venue.latitude && venue.longitude)
    ? `${venue.latitude},${venue.longitude}`
    : encodeURIComponent(venueLocationQuery);

  // Direction URL from student current location to venue location
  const directNavigationUrl = currentPosition.lat && currentPosition.lng
    ? `https://www.google.com/maps/dir/?api=1&origin=${currentPosition.lat},${currentPosition.lng}&destination=${venueCoordinates}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venueLocationQuery)}`;

  // Direct venue map URL
  const venueMapUrl = venue.googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${venueCoordinates}`;

  // Iframe Embed URL for Google Maps
  const embedMapUrl = currentPosition.lat && currentPosition.lng
    ? `https://maps.google.com/maps?saddr=${currentPosition.lat},${currentPosition.lng}&daddr=${encodeURIComponent(venueLocationQuery)}&output=embed`
    : `https://maps.google.com/maps?q=${encodeURIComponent(venueLocationQuery)}&output=embed`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-700 via-indigo-800 to-purple-800 text-white px-5 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <Compass size={20} className="text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-base leading-tight">
                Live Google Maps Venue Wayfinding
              </h3>
              <p className="text-[11px] text-indigo-200">
                Connected GPS Directions • Current Location to {venue.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-white/20 rounded-full transition text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          {/* Dual Location Status Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* 1. Student Current Location Card */}
            <div className="p-3.5 bg-sky-50/80 rounded-2xl border border-sky-200/80 flex items-start gap-3">
              <div className="p-2 bg-sky-600 text-white rounded-xl flex-shrink-0 mt-0.5 shadow-xs">
                <Locate size={16} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700">
                    Your Current Location
                  </span>
                  {currentPosition.status === 'detected' && (
                    <span className="text-[9px] bg-sky-200/70 text-sky-800 px-1.5 py-0.2 rounded font-bold">
                      GPS Live
                    </span>
                  )}
                </div>
                <div className="font-bold text-slate-800 text-xs mt-0.5 truncate">
                  {currentPosition.status === 'detecting'
                    ? 'Detecting current GPS coordinates...'
                    : currentPosition.address}
                </div>
                {currentPosition.accuracy && (
                  <div className="text-[10px] text-sky-700 mt-0.5">
                    Estimated GPS Accuracy: ±{currentPosition.accuracy} meters
                  </div>
                )}
              </div>
            </div>

            {/* 2. Venue Destination Card */}
            <div className="p-3.5 bg-indigo-50/80 rounded-2xl border border-indigo-200/80 flex items-start gap-3">
              <div className="p-2 bg-indigo-600 text-white rounded-xl flex-shrink-0 mt-0.5 shadow-xs">
                <MapPin size={16} />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700">
                  Target Venue Destination
                </span>
                <div className="font-bold text-slate-900 text-xs mt-0.5 truncate">
                  {venue.name}
                </div>
                <div className="text-[11px] text-slate-600 truncate mt-0.5">
                  Room {venue.room} • {venue.building} ({venue.block || 'Campus Block'})
                </div>
                {venue.address && (
                  <div className="text-[10px] text-indigo-700 truncate mt-0.5 font-medium">
                    📍 {venue.address}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Interactive Google Map Preview Window */}
          <div className="rounded-2xl overflow-hidden border-2 border-slate-200 shadow-sm relative bg-slate-100 aspect-video sm:h-72 w-full">
            <iframe
              title={`Google Map - ${venue.name}`}
              width="100%"
              height="100%"
              frameBorder="0"
              style={{ border: 0 }}
              src={embedMapUrl}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          {/* Location details card */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="font-bold text-slate-800">Venue Capacity: </span>
              <span className="text-slate-600">{venue.capacity || 100} attendees</span>
              {venue.latitude && venue.longitude && (
                <span className="ml-3 font-mono text-[11px] text-slate-500">
                  Coordinates: {venue.latitude}, {venue.longitude}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 bg-white text-slate-600 hover:text-slate-800 border border-slate-200 rounded-xl text-xs font-bold transition"
          >
            Close Map
          </button>

          <div className="w-full sm:w-auto flex items-center gap-2">
            <a
              href={venueMapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial px-4 py-2.5 bg-white text-slate-800 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
            >
              <ExternalLink size={14} />
              <span>Open in Google Maps</span>
            </a>

            <a
              href={directNavigationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/30 transition flex items-center justify-center gap-1.5"
            >
              <Navigation size={14} />
              <span>Turn-by-Turn GPS</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

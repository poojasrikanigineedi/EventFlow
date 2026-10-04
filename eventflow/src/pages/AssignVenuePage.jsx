import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import BackButton from '../components/BackButton';
import GoogleMapsModal from '../components/GoogleMapsModal';
import {
  MapPin,
  Building,
  Plus,
  Trash2,
  Users,
  Compass,
  ArrowRight,
  Inbox,
  AlertCircle,
  ExternalLink,
  Locate,
  Search,
  CheckCircle
} from 'lucide-react';

export default function AssignVenuePage() {
  const { venues, createVenue, navigate, currentEventId } = useApp();

  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [building, setBuilding] = useState('');
  const [block, setBlock] = useState('Block A');
  const [floor, setFloor] = useState('1st Floor');
  const [room, setRoom] = useState('');
  const [venueType, setVenueType] = useState('Lab');
  const [capacity, setCapacity] = useState('100');

  // Google Maps Location Fields (Replaces Indoor Walking Directions)
  const [address, setAddress] = useState('');
  const [googleMapsUrl, setGoogleMapsUrl] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  // Selected Venue for Google Maps Modal preview
  const [activeModalVenue, setActiveModalVenue] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Handle GPS detection
  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setIsDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(pos.coords.latitude.toFixed(6));
        setLongitude(pos.coords.longitude.toFixed(6));
        if (!address) {
          setAddress(`VVI University Campus (${pos.coords.latitude.toFixed(4)}° N, ${pos.coords.longitude.toFixed(4)}° E)`);
        }
        setIsDetectingLocation(false);
      },
      (err) => {
        alert('Could not retrieve GPS coordinates. Defaulting to campus center.');
        setLatitude('12.9716');
        setLongitude('77.5946');
        setIsDetectingLocation(false);
      },
      { timeout: 8000 }
    );
  };

  const handleOpenGoogleMapsSearch = () => {
    const query = address.trim() || `${name.trim() || 'College Venue'}, ${building.trim() || 'Campus'}, VVI University`;
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`, '_blank');
  };

  const handleCreateVenue = async (e) => {
    e.preventDefault();
    if (!name.trim() || !building.trim() || !room.trim()) return;

    setIsLoading(true);
    setErrorMessage('');
    try {
      await createVenue({
        name: name.trim(),
        building: building.trim(),
        block: block.trim(),
        floor,
        room: room.trim(),
        venueType,
        capacity: parseInt(capacity, 10) || 100,
        address: address.trim() || `${building.trim()} - Room ${room.trim()}, VVI University Campus`,
        googleMapsUrl: googleMapsUrl.trim() || (latitude && longitude ? `https://www.google.com/maps?q=${latitude},${longitude}` : null),
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null
      });

      // Reset
      setName('');
      setBuilding('');
      setRoom('');
      setAddress('');
      setGoogleMapsUrl('');
      setLatitude('');
      setLongitude('');
      setShowAddForm(false);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to create venue.');
    } finally {
      setIsLoading(false);
    }
  };

  // Construct map preview URL for the form
  const previewMapQuery = address.trim() || (latitude && longitude ? `${latitude},${longitude}` : `${building || 'Technology Block'}, VVI University`);
  const previewEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(previewMapQuery)}&output=embed`;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in">
      {/* Back Button (Requirement: Venues comes BEFORE Scheduling) */}
      <div className="flex items-center justify-between">
        <BackButton fallbackPage="create-event" label="Back to Event Creator" />
        <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
          Step 2 of 3 • Add Campus Venues
        </span>
      </div>

      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Campus Venues &amp; Google Maps
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure campus rooms, labs, and auditoriums with precise Google Maps locations before scheduling event sessions.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/25 flex items-center gap-1.5 transition self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>Add Campus Venue</span>
        </button>
      </div>

      {/* Add Venue Form */}
      {showAddForm && (
        <form onSubmit={handleCreateVenue} className="bg-indigo-50/70 p-6 rounded-3xl border border-indigo-200 space-y-4 animate-fade-in">
          <div className="flex items-center justify-between border-b border-indigo-200/80 pb-3">
            <h3 className="font-extrabold text-sm text-indigo-950 flex items-center gap-2">
              <MapPin size={18} className="text-indigo-600" />
              Register New Campus Location with Google Maps
            </h3>
            <span className="text-[11px] font-semibold text-indigo-700">Physical Venue Record</span>
          </div>

          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle size={15} />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">Venue Display Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Block B – Lab 1 (AI Systems)"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Venue Type</label>
              <select
                value={venueType}
                onChange={(e) => setVenueType(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-medium"
              >
                <option>Lab</option>
                <option>Auditorium</option>
                <option>Seminar Hall</option>
                <option>Classroom</option>
                <option>Open Grounds</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Building Name *</label>
              <input
                type="text"
                required
                value={building}
                onChange={(e) => setBuilding(e.target.value)}
                placeholder="e.g. Technology Block"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Block Code</label>
              <input
                type="text"
                value={block}
                onChange={(e) => setBlock(e.target.value)}
                placeholder="e.g. Block B"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Floor</label>
              <select
                value={floor}
                onChange={(e) => setFloor(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-medium"
              >
                <option>Ground Floor</option>
                <option>1st Floor</option>
                <option>2nd Floor</option>
                <option>3rd Floor</option>
                <option>4th Floor</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Room / Lab No *</label>
              <input
                type="text"
                required
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                placeholder="e.g. Room 204"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Room Capacity *</label>
              <input
                type="number"
                required
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                placeholder="e.g. 100"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Direct Google Maps Venue Location Section */}
          <div className="pt-3 border-t border-indigo-200 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="text-xs font-bold text-indigo-950 flex items-center gap-1.5 uppercase tracking-wider">
                <MapPin size={15} className="text-indigo-600" />
                Google Maps Venue Location &amp; Coordinates
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDetectGPS}
                  disabled={isDetectingLocation}
                  className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-[11px] font-bold flex items-center gap-1 shadow-2xs"
                >
                  <Locate size={13} className="text-indigo-600" />
                  <span>{isDetectingLocation ? 'Detecting GPS...' : '📍 Use Current GPS'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleOpenGoogleMapsSearch}
                  className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-[11px] font-bold flex items-center gap-1 shadow-2xs"
                >
                  <Search size={13} className="text-sky-600" />
                  <span>Search on Maps</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Google Maps Campus Address / Landmark
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. Tech Block, VVI University Main Campus, Bangalore"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Google Maps URL / Share Link (Optional)
                </label>
                <input
                  type="url"
                  value={googleMapsUrl}
                  onChange={(e) => setGoogleMapsUrl(e.target.value)}
                  placeholder="e.g. https://maps.app.goo.gl/... or https://maps.google.com/?q=..."
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Latitude (e.g. 12.9716)
                </label>
                <input
                  type="number"
                  step="any"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  placeholder="e.g. 12.971598"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Longitude (e.g. 77.5946)
                </label>
                <input
                  type="number"
                  step="any"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  placeholder="e.g. 77.594562"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-mono"
                />
              </div>
            </div>

            {/* Live Map Embed Preview */}
            <div className="rounded-xl overflow-hidden border border-indigo-200 aspect-video max-h-48 w-full bg-slate-100">
              <iframe
                title="Google Maps Location Preview"
                width="100%"
                height="100%"
                frameBorder="0"
                src={previewEmbedUrl}
                loading="lazy"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-indigo-200">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 bg-white text-slate-600 rounded-xl text-xs font-bold border"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md"
            >
              {isLoading ? 'Saving...' : 'Register Venue with Google Maps'}
            </button>
          </div>
        </form>
      )}

      {/* Venues List or True Empty State */}
      {venues.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
            <Inbox size={32} />
          </div>
          <h3 className="font-bold text-slate-800 text-base">
            No venues registered yet.
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Click "+ Add Campus Venue" to configure your first event room or auditorium with Google Maps.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {venues.map((v) => (
            <div
              key={v.id}
              className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-3 flex flex-col justify-between hover:border-indigo-300 transition"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                    {v.block} • {v.floor}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    Capacity: {v.capacity}
                  </span>
                </div>

                <h4 className="font-bold text-slate-900 text-base">{v.name}</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Room {v.room} • {v.building} ({v.venueType})
                </p>

                {/* Google Maps Location Pill */}
                <div className="mt-3 p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs space-y-1.5">
                  <div className="flex items-center gap-1.5 text-indigo-700 font-semibold truncate">
                    <MapPin size={14} className="flex-shrink-0" />
                    <span className="truncate">{v.address || `${v.building}, VVI University`}</span>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
                    <button
                      type="button"
                      onClick={() => setActiveModalVenue(v)}
                      className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                    >
                      <Compass size={13} />
                      <span>View on Google Maps</span>
                    </button>

                    <a
                      href={v.googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(v.address || v.name)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1"
                    >
                      <ExternalLink size={12} />
                      <span>Open App</span>
                    </a>
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 pt-2 border-t flex items-center justify-between">
                <span>Check-ins: <strong className="text-slate-700">{v.currentCrowd || 0}</strong></span>
                <span className="text-emerald-600 font-bold">Active Venue</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Step Navigation: Proceed to Schedule Sessions (Requirement: Venues comes BEFORE Scheduling) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t">
        <button
          onClick={() => navigate('create-event')}
          className="w-full sm:w-auto px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl text-xs transition"
        >
          &larr; Back to Event Creator
        </button>

        <button
          onClick={() => navigate('create-schedule', { eventId: currentEventId })}
          className="w-full sm:w-auto px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-600/30 text-xs flex items-center justify-center gap-2 transition"
        >
          <span>Next &rarr; Build Event Schedule &amp; Assign Venues</span>
          <ArrowRight size={16} />
        </button>
      </div>

      {/* Google Maps Wayfinding Modal */}
      {activeModalVenue && (
        <GoogleMapsModal
          isOpen={!!activeModalVenue}
          onClose={() => setActiveModalVenue(null)}
          venue={activeModalVenue}
        />
      )}
    </div>
  );
}

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import BackButton from '../components/BackButton';
import GoogleMapsModal from '../components/GoogleMapsModal';
import {
  Clock,
  MapPin,
  Calendar,
  Layers,
  Compass,
  ArrowRight,
  Inbox,
  QrCode,
  Navigation
} from 'lucide-react';

export default function MySchedulePage({ onOpenScanner }) {
  const { schedule, navigate, setMapDestinationVenueId } = useApp();
  const [selectedMapVenue, setSelectedMapVenue] = useState(null);

  const handleNavigateVenue = (venueId) => {
    if (!venueId) {
      alert('Venue has not been assigned to this session yet.');
      return;
    }
    setMapDestinationVenueId(venueId);
    navigate('campus-map', { venueId });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in">
      {/* Back Button (Section 25 Requirement: Back -> My Registered Events) */}
      <div className="flex items-center justify-between">
        <BackButton fallbackPage="my-registered-events" label="Back to My Registered Events" />
        {onOpenScanner && (
          <button
            onClick={onOpenScanner}
            className="px-3.5 py-1.5 bg-indigo-50 text-indigo-700 rounded-xl text-xs font-bold border border-indigo-200 hover:bg-indigo-100 transition flex items-center gap-1.5"
          >
            <QrCode size={14} /> Scan Venue QR
          </button>
        )}
      </div>

      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Personalized Event Schedule
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Chronological session progression assembled dynamically from your registered events.
        </p>
      </div>

      {/* Schedule Content or True Empty State (Section 12 Requirement) */}
      {schedule.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
            <Inbox size={32} />
          </div>
          <h3 className="font-bold text-slate-800 text-base">
            No events in your schedule.
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            When you register for an event, its scheduled sessions and room allocations will appear here.
          </p>
          <button
            onClick={() => navigate('browse-events')}
            className="mt-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md transition"
          >
            Find Events to Join
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative border-l-2 border-indigo-200 ml-4 sm:ml-6 pl-6 sm:pl-8 space-y-6">
            {schedule.map((session, index) => (
              <div key={session.id} className="relative group">
                {/* Index pin */}
                <div className="absolute -left-[35px] sm:-left-[43px] top-1 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white text-indigo-600 border-2 border-indigo-600 font-bold text-xs flex items-center justify-center shadow-xs">
                  {index + 1}
                </div>

                <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs hover:border-indigo-300 transition space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md w-fit">
                      {session.eventName} ({session.eventCategory})
                    </span>

                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-xl w-fit">
                      <Clock size={13} className="text-indigo-600" />
                      <span>{session.startTime} – {session.endTime}</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      {session.name}
                    </h3>
                    {session.description && (
                      <p className="text-xs text-slate-500 mt-0.5">
                        {session.description}
                      </p>
                    )}
                  </div>

                  {/* Venue location information */}
                  <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 text-slate-700">
                      <MapPin size={15} className="text-rose-500 flex-shrink-0" />
                      {session.venueName ? (
                        <span className="font-bold">
                          {session.venueName} ({session.venueBlock} • {session.venueFloor} • {session.venueRoom})
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">
                          Location not assigned yet
                        </span>
                      )}
                    </div>

                    {session.venueId && (
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setSelectedMapVenue({
                            id: session.venueId,
                            name: session.venueName,
                            building: session.venueBuilding,
                            block: session.venueBlock,
                            floor: session.venueFloor,
                            room: session.venueRoom,
                            capacity: session.venueCapacity,
                            address: session.venueAddress,
                            googleMapsUrl: session.venueGoogleMapsUrl,
                            latitude: session.venueLatitude,
                            longitude: session.venueLongitude
                          })}
                          className="px-3.5 py-1.5 bg-indigo-50 hover:bg-indigo-600 hover:text-white text-indigo-700 font-bold rounded-xl transition flex items-center gap-1 text-xs shadow-2xs"
                        >
                          <Navigation size={13} />
                          <span>Google Maps &amp; GPS</span>
                        </button>

                        <button
                          onClick={() => handleNavigateVenue(session.venueId)}
                          className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition text-xs"
                          title="Spatial Map"
                        >
                          <Compass size={13} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Google Maps Wayfinding Modal */}
      {selectedMapVenue && (
        <GoogleMapsModal
          isOpen={!!selectedMapVenue}
          onClose={() => setSelectedMapVenue(null)}
          venue={selectedMapVenue}
        />
      )}
    </div>
  );
}

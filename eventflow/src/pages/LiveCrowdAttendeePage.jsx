import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import BackButton from '../components/BackButton';
import {
  Users,
  RefreshCw,
  QrCode,
  MapPin,
  TrendingUp,
  Inbox
} from 'lucide-react';

export default function LiveCrowdAttendeePage({ onOpenScanner }) {
  const { crowdVenues, refreshData, navigate } = useApp();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshData();
    setTimeout(() => setIsRefreshing(false), 300);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in">
      {/* Back Button (Section 25 Requirement: Back to previous page) */}
      <div className="flex items-center justify-between">
        <BackButton label="Back" />
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="px-3.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition flex items-center gap-1.5 shadow-2xs"
          >
            <RefreshCw size={13} className={isRefreshing ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
          {onOpenScanner && (
            <button
              onClick={onOpenScanner}
              className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/25 transition flex items-center gap-1.5"
            >
              <QrCode size={14} />
              <span>Scan Venue QR</span>
            </button>
          )}
        </div>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Live Venue Crowd Information
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Real-time occupancy calculated strictly from verified first-time QR scans.
        </p>
      </div>

      {crowdVenues.length === 0 ? (
        /* True Empty State (Section 14: Initially 0 venues, 0 crowd) */
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
            <Inbox size={32} />
          </div>
          <h3 className="font-bold text-slate-800 text-base">
            No venues registered yet.
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Live crowd telemetry will begin reporting occupancy metrics once organizers create campus venues.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {crowdVenues.map((venue) => {
            const currentCrowd = venue.currentCrowd || 0;
            const capacity = venue.capacity || 100;
            const occupancy = Math.round((currentCrowd / capacity) * 100);
            const remaining = Math.max(0, capacity - currentCrowd);

            let statusColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';
            let barColor = 'bg-emerald-500';
            let statusText = 'Normal';

            if (occupancy >= 90) {
              statusColor = 'text-rose-700 bg-rose-50 border-rose-200';
              barColor = 'bg-rose-500';
              statusText = 'Nearly Full';
            } else if (occupancy >= 70) {
              statusColor = 'text-amber-700 bg-amber-50 border-amber-200';
              barColor = 'bg-amber-500';
              statusText = 'Busy';
            }

            return (
              <div
                key={venue.id}
                className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition space-y-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-lg">
                      {venue.block} • {venue.floor}
                    </span>
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${statusColor}`}>
                      {statusText}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-lg">
                    {venue.name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Room {venue.room} • {venue.building}
                  </p>

                  {/* Meter Bar */}
                  <div className="mt-5 space-y-1.5">
                    <div className="flex justify-between items-baseline text-xs">
                      <span className="text-2xl font-black text-slate-900">
                        {currentCrowd}
                        <span className="text-xs font-semibold text-slate-400"> / {capacity}</span>
                      </span>
                      <span className="font-bold text-slate-700">
                        {occupancy}% Used
                      </span>
                    </div>

                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden p-0.5 border">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                        style={{ width: `${Math.min(100, occupancy)}%` }}
                      />
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Remaining</span>
                      <span className="font-bold text-emerald-600">{remaining} seats</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Venue Type</span>
                      <span className="font-bold text-slate-700">{venue.venueType || 'Lab'}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <button
                    onClick={() => navigate('campus-map', { venueId: venue.id })}
                    className="font-bold text-indigo-600 hover:underline flex items-center gap-1"
                  >
                    <MapPin size={13} /> Navigate
                  </button>

                  {onOpenScanner && (
                    <button
                      onClick={onOpenScanner}
                      className="font-bold text-purple-600 hover:underline flex items-center gap-1"
                    >
                      <QrCode size={13} /> Check-in
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

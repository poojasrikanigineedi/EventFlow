import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import BackButton from '../components/BackButton';
import {
  BarChart3,
  RefreshCw,
  ShieldCheck,
  Users,
  AlertTriangle,
  ArrowRight,
  Inbox
} from 'lucide-react';

export default function LiveCrowdOrganizerPage({ onOpenScanner }) {
  const { crowdVenues, refreshData, navigate } = useApp();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshData();
    setTimeout(() => setIsRefreshing(false), 300);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in">
      {/* Back Button (Section 25 Requirement: Back -> Organizer Dashboard) */}
      <div className="flex items-center justify-between">
        <BackButton fallbackPage="organizer-dashboard" label="Back to Organizer Dashboard" />
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="px-3.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition flex items-center gap-1.5 shadow-2xs"
          >
            <RefreshCw size={13} className={isRefreshing ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
          <button
            onClick={() => navigate('qr-tracking')}
            className="px-3.5 py-1.5 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-xl text-xs font-bold hover:bg-indigo-100 transition flex items-center gap-1.5"
          >
            <ShieldCheck size={14} />
            <span>View Check-in Ledger</span>
          </button>
        </div>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Live Venue Crowd Dashboard
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Real-time occupancy metrics calculated strictly from verified first-time check-ins.
        </p>
      </div>

      {crowdVenues.length === 0 ? (
        /* True Empty State (Section 22 Requirement) */
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
            <Inbox size={32} />
          </div>
          <h3 className="font-bold text-slate-800 text-base">
            No venues registered yet.
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Register your campus buildings and rooms in Venue Assignment to monitor physical crowd throughput.
          </p>
          <button
            onClick={() => navigate('assign-venue')}
            className="mt-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md transition"
          >
            Go to Venue Assignment
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {crowdVenues.map((venue) => {
              const currentCrowd = venue.currentCrowd || 0;
              const capacity = venue.capacity || 100;
              const occupancy = Math.round((currentCrowd / capacity) * 100);
              const remaining = Math.max(0, capacity - currentCrowd);
              const duplicates = venue.duplicateAttempts || 0;
              const totalScans = (venue.currentCrowd || 0) + duplicates;

              let statusColor = 'bg-emerald-500';
              let badgeText = 'Normal';

              if (occupancy >= 90) {
                statusColor = 'bg-rose-500';
                badgeText = 'Near Capacity';
              } else if (occupancy >= 70) {
                statusColor = 'bg-amber-500';
                badgeText = 'Busy';
              }

              return (
                <div
                  key={venue.id}
                  className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition space-y-5"
                >
                  <div className="flex items-center justify-between border-b pb-3">
                    <div>
                      <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100 uppercase">
                        {venue.block} • {venue.floor}
                      </span>
                      <h3 className="text-lg font-black text-slate-900 mt-1">
                        {venue.name}
                      </h3>
                      <p className="text-xs text-slate-500">
                        Room {venue.room} • {venue.building}
                      </p>
                    </div>

                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                      {badgeText}
                    </span>
                  </div>

                  {/* Meter */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-baseline text-xs">
                      <span className="text-3xl font-black text-slate-900">
                        {currentCrowd}
                        <span className="text-xs font-semibold text-slate-400"> / {capacity}</span>
                      </span>
                      <span className="font-bold text-slate-700">
                        {occupancy}% Used
                      </span>
                    </div>

                    <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden p-0.5 border">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${statusColor}`}
                        style={{ width: `${Math.min(100, occupancy)}%` }}
                      />
                    </div>
                  </div>

                  {/* 4 Stats Grid (Section 22: Capacity, Available, Valid Check-ins, Duplicate Attempts) */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Available Space</span>
                      <span className="text-base font-bold text-emerald-600">{remaining}</span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Max Capacity</span>
                      <span className="text-base font-bold text-slate-700">{capacity}</span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Valid Check-ins</span>
                      <span className="text-base font-bold text-indigo-600">{currentCrowd}</span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Duplicates Rejected</span>
                      <span className="text-base font-bold text-amber-600">{duplicates}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t flex justify-end">
                    <button
                      onClick={() => navigate('qr-tracking')}
                      className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
                    >
                      <span>View Check-in Stream</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

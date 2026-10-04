import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import BackButton from '../components/BackButton';
import { api } from '../api/client';
import {
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  Clock,
  Smartphone,
  RefreshCw,
  QrCode,
  Users,
  Inbox
} from 'lucide-react';

export default function QRScanTrackingPage({ onOpenScanner }) {
  const { qrTracking, refreshData, navigate } = useApp();

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshData();
    setTimeout(() => setIsRefreshing(false), 300);
  };

  const checkIns = qrTracking?.checkIns || [];
  const duplicates = qrTracking?.duplicates || [];

  const totalScans = checkIns.length + duplicates.length;
  const validCheckIns = checkIns.length;
  const duplicateAttempts = duplicates.length;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in">
      {/* Back Button (Section 25 Requirement: Back -> QR Generation) */}
      <div className="flex items-center justify-between">
        <BackButton fallbackPage="qr-generate" label="Back to QR Generation" />
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="px-3.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition flex items-center gap-1.5 shadow-2xs"
          >
            <RefreshCw size={13} className={isRefreshing ? 'animate-spin' : ''} />
            <span>Refresh Telemetry</span>
          </button>
        </div>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          QR Check-in &amp; Duplicate Tracking
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Real-time scan logs enforced by database uniqueness on attendee ID + event ID + session ID + venue ID.
        </p>
      </div>

      {/* Metrics Row (Initially 0) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Physical Scans</div>
          <div className="text-3xl font-black text-slate-900 mt-1">{totalScans}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Total scan requests received</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">Valid Check-ins (+1 Crowd)</div>
          <div className="text-3xl font-black text-emerald-600 mt-1">{validCheckIns}</div>
          <div className="text-[11px] text-emerald-700 mt-0.5 font-medium">Unique verified attendees</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">Duplicate Scans (Rejected)</div>
          <div className="text-3xl font-black text-amber-600 mt-1">{duplicateAttempts}</div>
          <div className="text-[11px] text-amber-700 mt-0.5 font-medium">Crowd remained unchanged</div>
        </div>
      </div>

      {/* Audit Log Table or True Empty State (Section 21 Requirement) */}
      {checkIns.length === 0 && duplicates.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
            <Inbox size={32} />
          </div>
          <h3 className="font-bold text-slate-800 text-base">
            No check-ins yet.
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            When attendees scan your generated venue QR codes, real-time verified check-ins and duplicate attempts will be tracked here.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 bg-slate-50 border-b flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              Live Check-in &amp; Duplicate Audit Stream
            </h3>
            <span className="text-xs text-slate-500">{totalScans} Total Requests</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/70 text-slate-600 font-bold uppercase tracking-wider text-[11px] border-b">
                <tr>
                  <th className="py-3 px-5">Time</th>
                  <th className="py-3 px-5">Attendee</th>
                  <th className="py-3 px-5">Session</th>
                  <th className="py-3 px-5">Venue</th>
                  <th className="py-3 px-5 text-right">Verification Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {checkIns.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition">
                    <td className="py-3.5 px-5 font-mono text-slate-400 whitespace-nowrap">
                      {new Date(item.checkedInAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </td>
                    <td className="py-3.5 px-5 font-bold text-slate-900">
                      <div>{item.attendeeName}</div>
                      <div className="text-[10px] text-slate-400 font-normal">{item.attendeeRoll || item.attendeeEmail}</div>
                    </td>
                    <td className="py-3.5 px-5">{item.sessionName}</td>
                    <td className="py-3.5 px-5 font-medium text-slate-800">📍 {item.venueName}</td>
                    <td className="py-3.5 px-5 text-right">
                      <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full text-[11px]">
                        <CheckCircle size={11} /> Valid Check-in (+1)
                      </span>
                    </td>
                  </tr>
                ))}

                {duplicates.map((dup) => (
                  <tr key={dup.id} className="hover:bg-amber-50/40 transition">
                    <td className="py-3.5 px-5 font-mono text-slate-400 whitespace-nowrap">
                      {new Date(dup.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </td>
                    <td className="py-3.5 px-5 font-bold text-slate-900">
                      <div>{dup.attendeeName}</div>
                      <div className="text-[10px] text-amber-600 font-normal">Repeated Scan from Device</div>
                    </td>
                    <td className="py-3.5 px-5">{dup.sessionName}</td>
                    <td className="py-3.5 px-5 font-medium text-slate-800">📍 {dup.venueName}</td>
                    <td className="py-3.5 px-5 text-right">
                      <span className="inline-flex items-center gap-1 font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full text-[11px]">
                        <AlertTriangle size={11} /> Duplicate (Rejected)
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

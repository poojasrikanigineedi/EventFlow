import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import BackButton from '../components/BackButton';
import { api } from '../api/client';
import {
  QrCode,
  Download,
  Printer,
  Sparkles,
  Inbox,
  ArrowRight,
  ShieldCheck,
  Smartphone
} from 'lucide-react';

export default function QRCodeGenerationPage({ onOpenScanner }) {
  const { events, venues, generateQR, qrCodes, navigate } = useApp();

  const [selectedEventId, setSelectedEventId] = useState(events[0]?.id || '');
  const [sessions, setSessions] = useState([]);
  const [selectedSessionId, setSelectedSessionId] = useState('');
  const [selectedVenueId, setSelectedVenueId] = useState(venues[0]?.id || '');

  const [generatedQR, setGeneratedQR] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // When selected event changes, load its sessions
  useEffect(() => {
    async function loadEventSessions() {
      if (!selectedEventId) {
        setSessions([]);
        setSelectedSessionId('');
        return;
      }
      try {
        const res = await api.getEvent(selectedEventId);
        setSessions(res.sessions || []);
        if (res.sessions?.length > 0) {
          setSelectedSessionId(res.sessions[0].id);
          if (res.sessions[0].venueId) {
            setSelectedVenueId(res.sessions[0].venueId);
          }
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadEventSessions();
  }, [selectedEventId]);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!selectedEventId || !selectedSessionId || !selectedVenueId) {
      alert('Please select an event, session, and venue.');
      return;
    }

    setIsGenerating(true);
    try {
      const qr = await generateQR(selectedEventId, selectedSessionId, selectedVenueId);
      setGeneratedQR(qr);
    } catch (err) {
      alert(err.message || 'Failed to generate QR code.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const selectedEvent = events.find(e => e.id === selectedEventId);
  const selectedSession = sessions.find(s => s.id === selectedSessionId);
  const selectedVenue = venues.find(v => v.id === selectedVenueId);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in">
      {/* Back Button (Section 25 Requirement: Back -> Organizer Dashboard) */}
      <div className="flex items-center justify-between">
        <BackButton fallbackPage="organizer-dashboard" label="Back to Organizer Dashboard" />
      </div>

      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Venue QR Code Generation
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Generate encrypted physical access QR codes tied to Event ID + Session ID + Venue ID.
        </p>
      </div>

      {events.length === 0 || venues.length === 0 ? (
        /* True Empty State (Section 20 Requirement) */
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
            <Inbox size={32} />
          </div>
          <h3 className="font-bold text-slate-800 text-base">
            Cannot generate QR code yet.
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You need at least one created event with sessions and at least one registered campus venue.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={() => navigate('create-event')}
              className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold"
            >
              Create Event First
            </button>
            <button
              onClick={() => navigate('assign-venue')}
              className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold"
            >
              Create Venue First
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Configuration Form */}
          <div className="lg:col-span-5 space-y-4">
            <form onSubmit={handleGenerate} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-sm font-bold text-slate-900 border-b pb-3">
                Target Parameters
              </h2>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  1. Select Event *
                </label>
                <select
                  value={selectedEventId}
                  onChange={(e) => setSelectedEventId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                >
                  {events.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  2. Select Session *
                </label>
                {sessions.length === 0 ? (
                  <div className="text-xs text-amber-600 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                    No sessions for this event. <button type="button" onClick={() => navigate('create-schedule', { eventId: selectedEventId })} className="underline font-bold">Add sessions &rarr;</button>
                  </div>
                ) : (
                  <select
                    value={selectedSessionId}
                    onChange={(e) => setSelectedSessionId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                  >
                    {sessions.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.startTime})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  3. Select Physical Venue *
                </label>
                <select
                  value={selectedVenueId}
                  onChange={(e) => setSelectedVenueId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                >
                  {venues.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name} ({v.block} • {v.room})
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={isGenerating || sessions.length === 0}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/25 transition disabled:opacity-50"
              >
                {isGenerating ? 'Generating...' : 'Generate Venue QR Code'}
              </button>
            </form>
          </div>

          {/* QR Display Card (Section 20 Requirement) */}
          <div className="lg:col-span-7 flex flex-col items-center">
            {generatedQR ? (
              <div className="w-full bg-white rounded-3xl border-2 border-slate-300 p-8 shadow-2xl text-center space-y-5 animate-fade-in">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
                    Venue Station Pass
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 pt-2">
                    {selectedEvent?.name}
                  </h3>
                  <div className="text-sm font-bold text-indigo-700">
                    {generatedQR.sessionName}
                  </div>
                  <div className="text-xs font-semibold text-slate-500">
                    📍 {generatedQR.venueName}
                  </div>
                </div>

                <div className="inline-block p-4 bg-white rounded-2xl border-4 border-slate-900 shadow-lg">
                  <img
                    src={generatedQR.dataUrl}
                    alt="Venue Check-in QR"
                    className="w-56 h-56 object-contain mx-auto"
                  />
                </div>

                <div className="text-[11px] font-mono text-slate-400">
                  Token: {generatedQR.token}
                </div>

                <div className="pt-3 border-t flex flex-wrap items-center justify-center gap-2">
                  <a
                    href={generatedQR.dataUrl}
                    download={`EventFlow-${generatedQR.venueName}.png`}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                  >
                    <Download size={14} /> Download PNG
                  </a>
                  <button
                    onClick={handlePrint}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                  >
                    <Printer size={14} /> Print Poster
                  </button>
                </div>
              </div>
            ) : (
              <div className="w-full bg-white rounded-3xl border border-slate-200 p-12 text-center text-xs text-slate-400 space-y-2">
                <QrCode size={40} className="mx-auto text-slate-300" />
                <p className="font-semibold text-slate-600">No QR code generated yet</p>
                <p>Select event parameters and click "Generate Venue QR Code".</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

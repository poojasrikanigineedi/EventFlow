import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import BackButton from '../components/BackButton';
import { api } from '../api/client';
import {
  Layers,
  Plus,
  Trash2,
  Edit2,
  Clock,
  MapPin,
  CheckCircle,
  ArrowRight,
  Inbox,
  AlertCircle
} from 'lucide-react';

export default function EventScheduleCreationPage() {
  const {
    currentEventId,
    events,
    venues,
    createSession,
    updateSession,
    deleteSession,
    navigate
  } = useApp();

  const [selectedEventId, setSelectedEventId] = useState(
    currentEventId || events[0]?.id || null
  );

  const [sessions, setSessions] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSessionId, setEditingSessionId] = useState(null);

  // Form fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('2026-10-15');
  const [startTime, setStartTime] = useState('09:00 AM');
  const [endTime, setEndTime] = useState('10:30 AM');
  const [venueId, setVenueId] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  // Load sessions whenever selectedEventId changes
  useEffect(() => {
    async function loadSessions() {
      if (!selectedEventId) return;
      try {
        const res = await api.getEvent(selectedEventId);
        setSessions(res.sessions || []);
      } catch (err) {
        console.error(err);
      }
    }
    loadSessions();
  }, [selectedEventId]);

  const targetEvent = events.find(e => e.id === selectedEventId) || events[0];

  const handleSaveSession = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsLoading(true);
    try {
      if (editingSessionId) {
        await updateSession(editingSessionId, {
          name: name.trim(),
          description: description.trim(),
          date,
          startTime,
          endTime,
          venueId: venueId || null
        });
        setEditingSessionId(null);
      } else {
        await createSession(selectedEventId, {
          name: name.trim(),
          description: description.trim(),
          date,
          startTime,
          endTime,
          venueId: venueId || null,
          orderIndex: sessions.length + 1
        });
      }

      // Reload
      const res = await api.getEvent(selectedEventId);
      setSessions(res.sessions || []);

      // Reset form
      setName('');
      setDescription('');
      setShowAddForm(false);
    } catch (err) {
      alert(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartEdit = (session) => {
    setEditingSessionId(session.id);
    setName(session.name);
    setDescription(session.description || '');
    setDate(session.date);
    setStartTime(session.startTime);
    setEndTime(session.endTime);
    setVenueId(session.venueId || '');
    setShowAddForm(true);
  };

  const handleDelete = async (sessionId) => {
    if (!window.confirm('Are you sure you want to delete this session?')) return;
    try {
      await deleteSession(sessionId);
      const res = await api.getEvent(selectedEventId);
      setSessions(res.sessions || []);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in">
      {/* Back Button (Requirement: Venues comes BEFORE Scheduling) */}
      <div className="flex items-center justify-between">
        <BackButton fallbackPage="assign-venue" label="Back to Campus Venues" />
        <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
          Step 3 of 3 • Session Architecture &amp; Schedule
        </span>
      </div>

      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Event Schedule &amp; Sessions
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Divide your event into multiple structured sessions, rounds, or keynotes.
          </p>
        </div>

        {targetEvent && (
          <button
            onClick={() => {
              setEditingSessionId(null);
              setName('');
              setDescription('');
              setShowAddForm(!showAddForm);
            }}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/25 flex items-center gap-1.5 transition self-start sm:self-auto"
          >
            <Plus size={16} />
            <span>Add Session</span>
          </button>
        )}
      </div>

      {/* Event Selector if organizer has multiple events */}
      {events.length > 1 && (
        <div className="p-4 bg-white rounded-2xl border flex items-center justify-between text-xs">
          <span className="font-bold text-slate-700">Select Event to Manage:</span>
          <select
            value={selectedEventId || ''}
            onChange={(e) => setSelectedEventId(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border rounded-xl font-semibold"
          >
            {events.map((e) => (
              <option key={e.id} value={e.id}>
                {e.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Add / Edit Session Form */}
      {showAddForm && (
        <form onSubmit={handleSaveSession} className="bg-indigo-50/70 p-6 rounded-3xl border border-indigo-200 space-y-4 animate-fade-in">
          <h3 className="font-bold text-sm text-indigo-950">
            {editingSessionId ? 'Edit Session (Notifies Attendees if Venue/Time Changes)' : 'Add New Session'}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">Session Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Opening Ceremony / Coding Round 1"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Date *</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Start Time *</label>
              <input
                type="text"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">End Time *</label>
              <input
                type="text"
                required
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Assigned Venue</label>
              <select
                value={venueId}
                onChange={(e) => setVenueId(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-medium"
              >
                <option value="">-- No Venue Yet --</option>
                {venues.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name} ({v.block} • {v.room})
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-3">
              <label className="block font-bold text-slate-700 mb-1">Description / Instructions</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional activity details"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-medium"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
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
              className="px-5 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-md"
            >
              {isLoading ? 'Saving...' : editingSessionId ? 'Update & Notify' : 'Save Session'}
            </button>
          </div>
        </form>
      )}

      {/* Sessions List or True Empty State (Section 17 Requirement) */}
      {sessions.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
            <Inbox size={32} />
          </div>
          <h3 className="font-bold text-slate-800 text-base">
            No sessions created yet.
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Click "+ Add Session" above to configure your event schedule.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map((sess, idx) => (
            <div
              key={sess.id}
              className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-base">{sess.name}</h4>
                  <div className="text-xs text-slate-500 mt-0.5">
                    ⏱️ {sess.startTime} – {sess.endTime} ({sess.date})
                  </div>
                  <div className="text-xs font-semibold text-indigo-600 mt-1 flex items-center gap-1">
                    <MapPin size={13} />
                    <span>{sess.venueName ? `${sess.venueName} (${sess.venueBlock} • ${sess.venueRoom})` : 'No venue assigned'}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  onClick={() => handleStartEdit(sess)}
                  className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition"
                  title="Edit Session & Venue"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => handleDelete(sess.id)}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                  title="Delete Session"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Navigation to QR Generation (Section 19) */}
      <div className="flex justify-end pt-4">
        <button
          onClick={() => navigate('qr-generate')}
          className="w-full sm:w-auto px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-600/30 text-xs flex items-center justify-center gap-2 transition"
        >
          <span>Next &rarr; Generate Venue QR Codes</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}

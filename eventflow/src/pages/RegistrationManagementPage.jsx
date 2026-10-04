import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import BackButton from '../components/BackButton';
import {
  BookmarkCheck,
  Search,
  Filter,
  User,
  Calendar,
  Inbox,
  FileText,
  X
} from 'lucide-react';

export default function RegistrationManagementPage() {
  const { registrations, navigate } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReg, setSelectedReg] = useState(null);

  const filtered = registrations.filter((r) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      r.attendeeName?.toLowerCase().includes(q) ||
      r.registrationCode?.toLowerCase().includes(q) ||
      r.eventName?.toLowerCase().includes(q) ||
      r.attendeeEmail?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in">
      {/* Back Button (Section 25 Requirement: Back -> Organizer Dashboard) */}
      <div className="flex items-center justify-between">
        <BackButton fallbackPage="organizer-dashboard" label="Back to Organizer Dashboard" />
      </div>

      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Registration Management
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Review participant sign-ups, attendee details, and custom registration question responses.
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by attendee name, email, roll number, or registration code..."
          className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-medium text-slate-800 shadow-2xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Registrations List or True Empty State (Section 19 Requirement) */}
      {registrations.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
            <Inbox size={32} />
          </div>
          <h3 className="font-bold text-slate-800 text-base">
            No registrations yet.
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            When attendees register for your published events, their profiles and submitted answers will appear here in real time.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider text-[11px] border-b">
                <tr>
                  <th className="py-3 px-5">Reg Code</th>
                  <th className="py-3 px-5">Attendee</th>
                  <th className="py-3 px-5">Event</th>
                  <th className="py-3 px-5">Department / Roll</th>
                  <th className="py-3 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50 transition">
                    <td className="py-3.5 px-5 font-mono font-bold text-indigo-700">
                      {r.registrationCode}
                    </td>
                    <td className="py-3.5 px-5 font-bold text-slate-900">
                      <div>{r.attendeeName}</div>
                      <div className="text-[10px] text-slate-400 font-normal">{r.attendeeEmail}</div>
                    </td>
                    <td className="py-3.5 px-5">
                      {r.eventName}
                    </td>
                    <td className="py-3.5 px-5 text-slate-500">
                      {r.attendeeDept || 'Academic'} • {r.attendeeRoll || 'N/A'}
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <button
                        onClick={() => setSelectedReg(r)}
                        className="px-3 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg font-bold text-xs transition"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Registration Details Modal */}
      {selectedReg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                  {selectedReg.registrationCode}
                </span>
                <h3 className="font-bold text-slate-900 text-lg mt-1">
                  {selectedReg.attendeeName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedReg(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-2xl">
                <div>
                  <span className="text-slate-400 block text-[10px] font-bold uppercase">Event</span>
                  <span className="font-bold text-slate-800">{selectedReg.eventName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] font-bold uppercase">Status</span>
                  <span className="font-bold text-emerald-600">Confirmed</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] font-bold uppercase">Email</span>
                  <span className="font-bold text-slate-800">{selectedReg.attendeeEmail}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] font-bold uppercase">Registration Date</span>
                  <span className="font-bold text-slate-800">{new Date(selectedReg.registrationDate).toLocaleDateString()}</span>
                </div>
              </div>

              {selectedReg.responses && (
                <div className="space-y-2 pt-2">
                  <span className="font-bold text-slate-800 block text-xs">Event-Specific Answers:</span>
                  <pre className="p-3 bg-slate-100 rounded-xl text-[11px] font-mono text-slate-700 overflow-x-auto whitespace-pre-wrap">
                    {typeof selectedReg.responses === 'string'
                      ? JSON.stringify(JSON.parse(selectedReg.responses), null, 2)
                      : JSON.stringify(selectedReg.responses, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            <div className="pt-2">
              <button
                onClick={() => setSelectedReg(null)}
                className="w-full py-2.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

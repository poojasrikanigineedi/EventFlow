import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import BackButton from '../components/BackButton';
import { api } from '../api/client';
import {
  FileText,
  User,
  Mail,
  Phone,
  School,
  IdCard,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  X
} from 'lucide-react';

export default function RegistrationFormPage() {
  const { currentEventId, currentUser, registerForEvent, navigate, goBack } = useApp();

  const [eventData, setEventData] = useState(null);
  const [customQuestions, setCustomQuestions] = useState([]);
  const [responses, setResponses] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    async function loadData() {
      if (!currentEventId) return;
      setIsLoading(true);
      try {
        const res = await api.getEvent(currentEventId);
        setEventData(res.event);
        setCustomQuestions(res.questions || []);
      } catch (err) {
        setErrorMessage(err.message || 'Could not load event.');
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [currentEventId]);

  const handleResponseChange = (questionId, value) => {
    setResponses(prev => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      // Validate custom required questions
      for (const q of customQuestions) {
        if (q.required && (!responses[q.id] || !responses[q.id].trim())) {
          throw new Error(`Please answer the required question: "${q.question}"`);
        }
      }

      await registerForEvent(eventData.id, responses);
    } catch (err) {
      setErrorMessage(err.message || 'Registration failed.');
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('event-details', { eventId: currentEventId });
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center text-xs text-slate-500">
        Loading registration parameters...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in">
      {/* Back Button (Section 25 Requirement: Back -> Event Details) */}
      <div className="flex items-center justify-between">
        <BackButton fallbackPage="event-details" label="Back to Event Details" />
        <button
          type="button"
          onClick={handleCancel}
          className="text-xs font-bold text-slate-400 hover:text-slate-700 transition"
        >
          Cancel
        </button>
      </div>

      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
          Official Event Registration Form
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
          {eventData?.name}
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Date: <span className="font-semibold text-slate-700">{eventData?.eventDate}</span> • Category: <span className="font-semibold text-slate-700">{eventData?.category}</span>
        </p>
      </div>

      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-2xl flex items-center gap-2">
          <AlertCircle size={16} className="text-rose-600 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Attendee Profile Info (Pre-filled from authenticated profile) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b pb-3 flex items-center gap-2">
            <User size={16} className="text-indigo-600" />
            1. Authenticated Attendee Profile
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-400 block text-[11px] font-bold uppercase">Name</span>
              <span className="font-bold text-slate-800">{currentUser?.name}</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-400 block text-[11px] font-bold uppercase">Email</span>
              <span className="font-bold text-slate-800">{currentUser?.email}</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-400 block text-[11px] font-bold uppercase">Department</span>
              <span className="font-bold text-slate-800">{currentUser?.department || 'General Academic'}</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-400 block text-[11px] font-bold uppercase">Student ID / Roll No</span>
              <span className="font-bold text-slate-800">{currentUser?.studentId || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Dynamic Event-Specific Registration Questions (Section 9 Requirement) */}
        {customQuestions.length > 0 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-900 border-b pb-3 flex items-center gap-2">
              <HelpCircle size={16} className="text-purple-600" />
              2. Event-Specific Questions
            </h2>

            <div className="space-y-4">
              {customQuestions.map((q) => (
                <div key={q.id}>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    {q.question} {q.required ? <span className="text-rose-500">*</span> : <span className="text-slate-400 text-[10px]">(Optional)</span>}
                  </label>

                  {q.fieldType === 'textarea' ? (
                    <textarea
                      required={Boolean(q.required)}
                      value={responses[q.id] || ''}
                      onChange={(e) => handleResponseChange(q.id, e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  ) : (
                    <input
                      type="text"
                      required={Boolean(q.required)}
                      value={responses[q.id] || ''}
                      onChange={(e) => handleResponseChange(q.id, e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Verification and Submission */}
        <div className="bg-indigo-50/60 rounded-3xl p-6 border border-indigo-200 space-y-4">
          <p className="text-xs text-indigo-900 leading-relaxed font-semibold">
            By submitting this registration, this event will be officially linked to your account, generating your entry ticket pass and personalized session schedule.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleCancel}
              className="w-full sm:w-auto px-5 py-3 bg-white text-slate-700 rounded-xl text-xs font-bold border border-slate-200 hover:bg-slate-100 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              <CheckCircle2 size={16} />
              <span>{isSubmitting ? 'Registering...' : 'Submit Registration'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

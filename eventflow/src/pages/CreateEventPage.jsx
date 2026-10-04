import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import BackButton from '../components/BackButton';
import {
  Calendar,
  Clock,
  FileText,
  Users,
  ShieldAlert,
  ArrowRight,
  Plus,
  Trash2,
  HelpCircle,
  AlertCircle
} from 'lucide-react';

export default function CreateEventPage() {
  const { createEvent, navigate } = useApp();

  const [name, setName] = useState('');
  const [category, setCategory] = useState('Hackathon');
  const [shortDescription, setShortDescription] = useState('');
  const [detailedDescription, setDetailedDescription] = useState('');
  const [eligibility, setEligibility] = useState('Open to all registered university students');
  const [teamSize, setTeamSize] = useState('1 to 4');
  const [requirements, setRequirements] = useState('Personal laptop, chargers, and university identity badge');
  const [rules, setRules] = useState('1. Respect campus lab equipment.\n2. Original work only.\n3. Complete verified check-in at venue.');
  const [contactInformation, setContactInformation] = useState('organizer@vvi.edu.in');

  const [eventDate, setEventDate] = useState('2026-10-15');
  const [startTime, setStartTime] = useState('09:00 AM');
  const [endTime, setEndTime] = useState('05:00 PM');
  const [registrationDeadline, setRegistrationDeadline] = useState('2026-10-14 23:59');
  const [publishImmediately, setPublishImmediately] = useState(true);

  // Custom Event-Specific Registration Questions Builder (Section 16 Requirement)
  const [questions, setQuestions] = useState([
    { question: 'Team Name (if participating as a group)', fieldType: 'text', required: false },
    { question: 'Primary Technical Skill / Domain Interest', fieldType: 'text', required: true }
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleAddQuestion = () => {
    setQuestions(prev => [
      ...prev,
      { question: '', fieldType: 'text', required: false }
    ]);
  };

  const handleRemoveQuestion = (idx) => {
    setQuestions(prev => prev.filter((_, i) => i !== idx));
  };

  const handleQuestionChange = (idx, field, value) => {
    setQuestions(prev => {
      const copy = [...prev];
      copy[idx][field] = value;
      return copy;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      const payload = {
        name: name.trim(),
        category,
        shortDescription: shortDescription.trim(),
        detailedDescription: detailedDescription.trim(),
        eligibility: eligibility.trim(),
        teamSize: teamSize.trim(),
        requirements: requirements.trim(),
        rules: rules.trim(),
        contactInformation: contactInformation.trim(),
        eventDate,
        startTime,
        endTime,
        registrationDeadline,
        status: publishImmediately ? 'Published' : 'Draft',
        questions: questions.filter(q => q.question && q.question.trim())
      };

      const createdEvent = await createEvent(payload);
      navigate('assign-venue', { eventId: createdEvent.id });
    } catch (err) {
      setErrorMessage(err.message || 'Could not save event.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in">
      {/* Back Button (Section 25 Requirement: Back -> Organizer Dashboard) */}
      <div className="flex items-center justify-between">
        <BackButton fallbackPage="organizer-dashboard" label="Back to Dashboard" />
        <button
          type="button"
          onClick={() => navigate('organizer-dashboard')}
          className="text-xs font-bold text-slate-400 hover:text-slate-700 transition"
        >
          Cancel
        </button>
      </div>

      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
          Step 1 of 3 • Event Creator
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
          Create New Event
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Define event description, timings, guidelines, and custom registration questions.
        </p>
      </div>

      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-2xl flex items-center gap-2">
          <AlertCircle size={16} className="text-rose-600 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Event Info */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b pb-3 flex items-center gap-2">
            <FileText size={16} className="text-indigo-600" />
            1. Event Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Event Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. CodeSprint 2026 Annual Hackathon"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option>Hackathon</option>
                <option>Workshop</option>
                <option>Technical Event</option>
                <option>Fest</option>
                <option>Competition</option>
                <option>Seminar</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Contact Information
              </label>
              <input
                type="text"
                value={contactInformation}
                onChange={(e) => setContactInformation(e.target.value)}
                placeholder="Email or phone for attendee inquiries"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Short Description / Tagline
              </label>
              <input
                type="text"
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                placeholder="Brief summary displayed on browse cards"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Detailed Description
              </label>
              <textarea
                rows={3}
                value={detailedDescription}
                onChange={(e) => setDetailedDescription(e.target.value)}
                placeholder="Complete event details, round breakdown, keynote mentors..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Date and Time */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b pb-3 flex items-center gap-2">
            <Calendar size={16} className="text-purple-600" />
            2. Schedule &amp; Deadlines
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Event Date *
              </label>
              <input
                type="date"
                required
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Start Time *
              </label>
              <input
                type="text"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                End Time *
              </label>
              <input
                type="text"
                required
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Registration Deadline *
              </label>
              <input
                type="text"
                required
                value={registrationDeadline}
                onChange={(e) => setRegistrationDeadline(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              />
            </div>
          </div>
        </div>

        {/* Eligibility, Team Size, Rules */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b pb-3 flex items-center gap-2">
            <Users size={16} className="text-emerald-600" />
            3. Eligibility, Requirements &amp; Rules
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Eligibility
              </label>
              <input
                type="text"
                value={eligibility}
                onChange={(e) => setEligibility(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Team Size
              </label>
              <input
                type="text"
                value={teamSize}
                onChange={(e) => setTeamSize(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Requirements
              </label>
              <input
                type="text"
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Rules &amp; Guidelines (One per line)
              </label>
              <textarea
                rows={3}
                value={rules}
                onChange={(e) => setRules(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Event-Specific Registration Questions Builder (Section 16 Requirement) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <HelpCircle size={16} className="text-purple-600" />
              4. Event-Specific Registration Questions
            </h2>
            <button
              type="button"
              onClick={handleAddQuestion}
              className="px-3 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold transition flex items-center gap-1"
            >
              <Plus size={14} /> Add Question
            </button>
          </div>

          <div className="space-y-3">
            {questions.map((q, idx) => (
              <div key={idx} className="p-3 bg-slate-50 rounded-2xl border flex items-center gap-3 text-xs">
                <input
                  type="text"
                  placeholder="Enter custom question for attendee..."
                  value={q.question}
                  onChange={(e) => handleQuestionChange(idx, 'question', e.target.value)}
                  className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-xl"
                />

                <label className="flex items-center gap-1.5 select-none font-semibold text-slate-600">
                  <input
                    type="checkbox"
                    checked={q.required}
                    onChange={(e) => handleQuestionChange(idx, 'required', e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded"
                  />
                  <span>Required</span>
                </label>

                <button
                  type="button"
                  onClick={() => handleRemoveQuestion(idx)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Publishing Option */}
        <div className="bg-slate-50 p-5 rounded-2xl border flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-800">Publish Immediately</div>
            <div className="text-[11px] text-slate-500">Make this event immediately visible in Browse Events for attendees.</div>
          </div>
          <input
            type="checkbox"
            checked={publishImmediately}
            onChange={(e) => setPublishImmediately(e.target.checked)}
            className="w-5 h-5 text-indigo-600 rounded"
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate('organizer-dashboard')}
            className="px-6 py-3 bg-white text-slate-700 rounded-xl text-xs font-bold border border-slate-200 hover:bg-slate-50 transition"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition disabled:opacity-50"
          >
            <span>{isSubmitting ? 'Saving...' : 'Next → Create Schedule'}</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </form>
    </div>
  );
}

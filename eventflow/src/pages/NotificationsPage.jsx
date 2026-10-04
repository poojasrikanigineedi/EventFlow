import React from 'react';
import { useApp } from '../context/AppContext';
import BackButton from '../components/BackButton';
import {
  Bell,
  CheckCircle,
  AlertTriangle,
  Clock,
  MapPin,
  Calendar,
  Layers,
  ArrowRight,
  CheckCheck,
  Inbox
} from 'lucide-react';

export default function NotificationsPage() {
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    currentUser,
    navigate
  } = useApp();

  const handleNotificationClick = (notif) => {
    markNotificationRead(notif.id);

    if (notif.type === 'VENUE_CHANGE' || notif.type === 'SCHEDULE_UPDATE') {
      navigate(currentUser?.role === 'organizer' ? 'create-schedule' : 'my-schedule');
    } else if (notif.type === 'REGISTRATION') {
      navigate(currentUser?.role === 'organizer' ? 'registration-management' : 'my-registered-events');
    } else if (notif.type === 'CROWD_ALERT') {
      navigate(currentUser?.role === 'organizer' ? 'live-crowd-organizer' : 'live-crowd-attendee');
    }
  };

  const dashboardPage = currentUser?.role === 'organizer' ? 'organizer-dashboard' : 'attendee-dashboard';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in">
      {/* Back Button (Section 25 Requirement: Back -> Dashboard) */}
      <div className="flex items-center justify-between">
        <BackButton fallbackPage={dashboardPage} label="Back to Dashboard" />
        {notifications.length > 0 && (
          <button
            onClick={markAllNotificationsRead}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 bg-indigo-50 px-3 py-1.5 rounded-xl transition"
          >
            <CheckCheck size={15} /> Mark all as read
          </button>
        )}
      </div>

      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Notifications &amp; Alerts
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Automated schedule change broadcasts, venue shift alerts, and registration updates.
        </p>
      </div>

      {/* Notifications List or True Empty State (Section 23 Requirement) */}
      {notifications.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
            <Inbox size={32} />
          </div>
          <h3 className="font-bold text-slate-800 text-base">
            No notifications yet.
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            When you register for an event, or when an organizer shifts venue or timing for your sessions, alerts will be dispatched here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => {
            const isUnread = !n.read;
            const isVenueChange = n.type === 'VENUE_CHANGE';

            return (
              <div
                key={n.id}
                onClick={() => handleNotificationClick(n)}
                className={`p-5 rounded-3xl border transition-all cursor-pointer flex items-start gap-4 ${
                  isUnread
                    ? 'bg-white border-indigo-300 ring-2 ring-indigo-50 shadow-xs'
                    : 'bg-white/70 border-slate-200 hover:bg-white'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center text-lg flex-shrink-0 ${
                    isVenueChange
                      ? 'bg-amber-50 text-amber-600 border border-amber-200'
                      : 'bg-indigo-50 text-indigo-600 border border-indigo-200'
                  }`}
                >
                  {isVenueChange ? '🔔' : '📢'}
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <span>{n.title}</span>
                      {isUnread && (
                        <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
                      )}
                    </h4>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {n.message}
                  </p>

                  <div className="pt-1.5 flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:underline">
                    <span>View Details</span>
                    <ArrowRight size={12} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

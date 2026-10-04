import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Compass,
  Calendar,
  Layers,
  MapPin,
  Users,
  Bell,
  PlusCircle,
  QrCode,
  ShieldCheck,
  BarChart3,
  BookmarkCheck,
  User,
  LogOut,
  Menu,
  X,
  RotateCcw,
  CheckCircle,
  Building,
  Phone,
  Mail
} from 'lucide-react';

export default function Navbar({ onOpenScanner }) {
  const {
    currentUser,
    currentPage,
    navigate,
    logout,
    unreadCount,
    resetDatabase
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const isOrganizer = currentUser?.role === 'organizer';
  const isAttendee = currentUser?.role === 'student';

  const attendeeNav = [
    { id: 'attendee-dashboard', label: 'Dashboard', icon: Compass },
    { id: 'browse-events', label: 'Browse Events', icon: Calendar },
    { id: 'my-registered-events', label: 'My Registrations', icon: BookmarkCheck },
    { id: 'my-schedule', label: 'Schedule', icon: Layers },
    { id: 'campus-map', label: 'Campus GPS', icon: MapPin },
    { id: 'live-crowd-attendee', label: 'Live Crowd', icon: Users },
  ];

  // Organizer Navigation: Venues comes BEFORE Scheduling (Requirement 3)
  const organizerNav = [
    { id: 'organizer-dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'create-event', label: 'Create Event', icon: PlusCircle },
    { id: 'assign-venue', label: 'Venues', icon: MapPin },
    { id: 'create-schedule', label: 'Schedule', icon: Layers },
    { id: 'registration-management', label: 'Registrations', icon: BookmarkCheck },
    { id: 'qr-generate', label: 'QR Generator', icon: QrCode },
    { id: 'qr-tracking', label: 'QR Tracking', icon: ShieldCheck },
    { id: 'live-crowd-organizer', label: 'Live Crowd', icon: Users },
  ];

  const currentNav = isOrganizer ? organizerNav : isAttendee ? attendeeNav : [];

  const handleNavClick = (id) => {
    navigate(id);
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div
            onClick={() => navigate(currentUser ? (isOrganizer ? 'organizer-dashboard' : 'attendee-dashboard') : 'welcome')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30 group-hover:scale-105 transition-transform">
              <Compass size={20} className="animate-spin-slow" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight text-slate-900 group-hover:text-indigo-600 transition">
                Event<span className="text-indigo-600">Flow</span>
              </span>
              <span className="ml-1.5 text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full border border-slate-200">
                Prototype
              </span>
            </div>
          </div>

          {/* Desktop Nav Items */}
          {currentUser && (
            <nav className="hidden xl:flex items-center gap-1">
              {currentNav.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-700 font-bold shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <Icon size={14} className={isActive ? 'text-indigo-600' : 'text-slate-400'} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          )}

          {/* Right Header Controls */}
          <div className="flex items-center gap-2">
            {currentUser ? (
              <>
                {/* QR Scanner trigger - ONLY visible for students/attendees (Requirement 5) */}
                {onOpenScanner && isAttendee && (
                  <button
                    onClick={onOpenScanner}
                    className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition border border-transparent hover:border-indigo-100 hidden sm:flex items-center gap-1.5 text-xs font-semibold"
                    title="Scan Venue QR"
                  >
                    <QrCode size={16} className="text-indigo-600" />
                    <span className="hidden md:inline">Scan QR</span>
                  </button>
                )}

                {/* Notifications Bell */}
                <button
                  onClick={() => navigate('notifications')}
                  className="relative p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition"
                  title="Notifications"
                >
                  <Bell size={18} />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* User Profile Button with Instant Profile Info Dropdown (Requirement 2) */}
                <div className="relative">
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-2 pl-2 border-l border-slate-200 hover:opacity-85 transition focus:outline-none"
                    title="View Profile Information"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                      {currentUser.name ? currentUser.name[0] : 'U'}
                    </div>
                    <div className="hidden sm:block text-left">
                      <div className="text-xs font-bold text-slate-800 leading-tight">
                        {currentUser.name}
                      </div>
                      <div className="text-[10px] text-slate-400 capitalize">
                        {currentUser.role === 'student' ? 'Attendee' : 'Organizer'}
                      </div>
                    </div>
                  </button>

                  {/* Profile Information Popover Card */}
                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-3xl border border-slate-200 shadow-2xl p-5 z-50 animate-fade-in space-y-4">
                      <div className="flex items-center justify-between border-b pb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-black text-lg flex items-center justify-center shadow-md shadow-indigo-600/25">
                            {currentUser.name ? currentUser.name[0] : 'U'}
                          </div>
                          <div>
                            <h4 className="font-extrabold text-sm text-slate-900 leading-tight">
                              {currentUser.name}
                            </h4>
                            <span className="inline-block text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full capitalize mt-0.5 border border-indigo-100">
                              {currentUser.role === 'student' ? '🎓 Attendee / Student' : '🏢 Event Organizer'}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => setProfileDropdownOpen(false)}
                          className="text-slate-400 hover:text-slate-600 p-1"
                        >
                          <X size={16} />
                        </button>
                      </div>

                      <div className="space-y-2 text-xs">
                        <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Email Address</span>
                          <span className="font-semibold text-slate-800">{currentUser.email}</span>
                        </div>

                        {currentUser.college && (
                          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">College / University</span>
                            <span className="font-semibold text-slate-800">{currentUser.college}</span>
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-2">
                          {currentUser.department && (
                            <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Department</span>
                              <span className="font-semibold text-slate-800 truncate block">{currentUser.department}</span>
                            </div>
                          )}

                          {currentUser.studentId && (
                            <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                                {currentUser.role === 'student' ? 'Student ID' : 'Office Code'}
                              </span>
                              <span className="font-semibold text-slate-800 truncate block">{currentUser.studentId}</span>
                            </div>
                          )}
                        </div>

                        {currentUser.phone && (
                          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Phone</span>
                            <span className="font-semibold text-slate-800">{currentUser.phone}</span>
                          </div>
                        )}
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
                        <button
                          onClick={() => {
                            navigate('profile');
                            setProfileDropdownOpen(false);
                          }}
                          className="w-full py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
                        >
                          <User size={14} />
                          <span>Edit Full Profile Information</span>
                        </button>

                        <button
                          onClick={() => {
                            logout();
                            setProfileDropdownOpen(false);
                          }}
                          className="w-full py-2 bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
                        >
                          <LogOut size={14} />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Reset System to Zero Data */}
                <button
                  onClick={() => {
                    if (window.confirm('Reset database to completely empty state (0 events, 0 registrations)?')) {
                      resetDatabase();
                    }
                  }}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                  title="Reset to 0 events/data"
                >
                  <RotateCcw size={16} />
                </button>

                {/* Mobile Drawer Button */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="xl:hidden p-2 text-slate-600 rounded-xl hover:bg-slate-100"
                >
                  {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate('role-select')}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 transition"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && currentUser && (
        <div className="xl:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-5 space-y-2 shadow-lg animate-fade-in">
          <div className="grid grid-cols-2 gap-2">
            {currentNav.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 transition ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t flex items-center justify-between">
            {/* Scan QR in mobile only for student */}
            {isAttendee && (
              <button
                onClick={() => {
                  onOpenScanner();
                  setMobileMenuOpen(false);
                }}
                className="text-xs font-bold text-indigo-600 flex items-center gap-1.5"
              >
                <QrCode size={16} /> Scan Venue QR
              </button>
            )}

            <button
              onClick={() => {
                navigate('profile');
                setMobileMenuOpen(false);
              }}
              className="text-xs font-bold text-slate-700 flex items-center gap-1"
            >
              <User size={15} /> Profile Info
            </button>

            <button
              onClick={() => {
                logout();
                setMobileMenuOpen(false);
              }}
              className="text-xs font-bold text-rose-600 flex items-center gap-1"
            >
              <LogOut size={15} /> Logout
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

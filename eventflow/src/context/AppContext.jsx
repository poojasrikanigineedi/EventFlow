import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../api/client';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // Authentication State
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('ef_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [selectedRole, setSelectedRole] = useState(() => {
    return localStorage.getItem('ef_selected_role') || 'student';
  });

  // Current page & history stack for precise "Back" button routing
  // Landing requirement: Welcome page with "Get Started" is always visible first
  const [currentPage, setCurrentPage] = useState('welcome');

  const [historyStack, setHistoryStack] = useState([]);
  const [currentEventId, setCurrentEventId] = useState(null);
  const [currentVenueId, setCurrentVenueId] = useState(null);
  const [latestRegistration, setLatestRegistration] = useState(null);

  // Core Data Entities (STRICTLY EMPTY INITIALLY: Events = 0, Venues = 0, Registrations = 0, etc.)
  const [events, setEvents] = useState([]);
  const [venues, setVenues] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [qrCodes, setQrCodes] = useState([]);
  const [qrTracking, setQrTracking] = useState({ checkIns: [], duplicates: [] });
  const [crowdVenues, setCrowdVenues] = useState([]);

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [activeToast, setActiveToast] = useState(null);

  // Toast alert trigger
  const triggerToast = (title, message, type = 'info', icon = '🔔') => {
    setActiveToast({ id: Date.now(), title, message, type, icon });
    setTimeout(() => {
      setActiveToast(prev => (prev?.title === title ? null : prev));
    }, 5000);
  };

  // Sync user state to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('ef_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('ef_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('ef_selected_role', selectedRole);
  }, [selectedRole]);

  // Navigate function maintaining accurate history stack (Section 25)
  const navigate = useCallback((page, params = {}) => {
    setHistoryStack(prev => [...prev, currentPage]);
    if (params.eventId) setCurrentEventId(params.eventId);
    if (params.venueId) setCurrentVenueId(params.venueId);
    if (params.registration) setLatestRegistration(params.registration);
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  // Back button function (Section 25 Requirement)
  const goBack = useCallback(() => {
    if (historyStack.length > 0) {
      const prevPage = historyStack[historyStack.length - 1];
      setHistoryStack(prev => prev.slice(0, -1));
      setCurrentPage(prevPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Default fallback based on role
      if (currentUser?.role === 'organizer') {
        setCurrentPage('organizer-dashboard');
      } else if (currentUser?.role === 'student') {
        setCurrentPage('attendee-dashboard');
      } else {
        setCurrentPage('welcome');
      }
    }
  }, [historyStack, currentUser]);

  // Refresh all connected data from backend
  const refreshData = useCallback(async () => {
    try {
      // Load venues
      const venuesRes = await api.getVenues();
      setVenues(venuesRes.venues || []);

      // Load events
      const eventsRes = await api.getEvents();
      setEvents(eventsRes.events || []);

      // Load crowd data
      const crowdRes = await api.getCrowd();
      setCrowdVenues(crowdRes.venues || []);

      if (currentUser) {
        // Load notifications
        const notifRes = await api.getNotifications();
        setNotifications(notifRes.notifications || []);

        if (currentUser.role === 'student') {
          // Attendee registrations & personalized schedule
          const regRes = await api.getRegistrations();
          setRegistrations(regRes.registrations || []);

          const schedRes = await api.getSchedule();
          setSchedule(schedRes.schedule || []);

          // Load active stations for student QR scanner
          try {
            const activeStationsRes = await api.getActiveStations();
            setQrCodes(activeStationsRes.qrCodes || []);
          } catch {}
        } else if (currentUser.role === 'organizer') {
          // Organizer registrations, QR codes, scan tracking
          const regRes = await api.getRegistrations();
          setRegistrations(regRes.registrations || []);

          const qrRes = await api.getQRCodes();
          setQrCodes(qrRes.qrCodes || []);

          const trackRes = await api.getQRTracking();
          setQrTracking(trackRes || { checkIns: [], duplicates: [] });
        }
      }
    } catch (err) {
      console.warn('Data sync notice:', err.message);
    }
  }, [currentUser]);

  // Initial data load on mount or user change
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Periodic subtle polling to keep crowd & notifications synchronized in real-time
  useEffect(() => {
    const interval = setInterval(() => {
      refreshData();
    }, 4000);
    return () => clearInterval(interval);
  }, [refreshData]);

  // Authentication Handlers
  const login = async (email, password, role) => {
    setIsLoading(true);
    try {
      const res = await api.login(email, password, role);
      setCurrentUser(res.user);
      setSelectedRole(res.user.role);
      triggerToast('Welcome Back!', `Signed in as ${res.user.name} (${res.user.role})`, 'success', '👋');
      if (res.user.role === 'organizer') {
        navigate('organizer-dashboard');
      } else {
        navigate('attendee-dashboard');
      }
      return { success: true };
    } catch (err) {
      triggerToast('Login Failed', err.message, 'error', '⚠️');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (userData) => {
    setIsLoading(true);
    try {
      const res = await api.signup(userData);
      setCurrentUser(res.user);
      setSelectedRole(res.user.role);
      triggerToast('Account Created!', `Welcome to EventFlow, ${res.user.name}!`, 'success', '🎉');
      if (res.user.role === 'organizer') {
        navigate('organizer-dashboard');
      } else {
        navigate('attendee-dashboard');
      }
      return { success: true };
    } catch (err) {
      triggerToast('Sign Up Failed', err.message, 'error', '⚠️');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setRegistrations([]);
    setSchedule([]);
    setNotifications([]);
    setQrCodes([]);
    setHistoryStack([]);
    navigate('welcome');
    triggerToast('Logged Out', 'You have been safely signed out.', 'info', '👋');
  };

  // Event & Session Handlers
  const createEvent = async (eventData) => {
    setIsLoading(true);
    try {
      const res = await api.createEvent(eventData);
      await refreshData();
      triggerToast('Event Created', `${res.event.name} has been created.`, 'success', '📅');
      return res.event;
    } catch (err) {
      triggerToast('Error', err.message, 'error', '⚠️');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const publishEvent = async (eventId) => {
    try {
      const res = await api.publishEvent(eventId);
      await refreshData();
      triggerToast('Published!', `${res.event.name} is now open for registration.`, 'success', '🚀');
      return res.event;
    } catch (err) {
      triggerToast('Publish Failed', err.message, 'error', '⚠️');
      throw err;
    }
  };

  const createSession = async (eventId, sessionData) => {
    try {
      const res = await api.createSession(eventId, sessionData);
      await refreshData();
      triggerToast('Session Added', `${res.session.name} added to schedule.`, 'success', '⏱️');
      return res.session;
    } catch (err) {
      triggerToast('Error', err.message, 'error', '⚠️');
      throw err;
    }
  };

  const updateSession = async (sessionId, sessionData) => {
    try {
      const res = await api.updateSession(sessionId, sessionData);
      await refreshData();
      if (res.venueChanged) {
        triggerToast('Venue Shift Dispatched', 'Affected registered attendees have been automatically notified.', 'warning', '🔔');
      } else if (res.timeChanged) {
        triggerToast('Schedule Updated', 'Session timing update notified to attendees.', 'info', '⏱️');
      } else {
        triggerToast('Session Saved', 'Changes successfully updated.', 'success', '✅');
      }
      return res.session;
    } catch (err) {
      triggerToast('Update Failed', err.message, 'error', '⚠️');
      throw err;
    }
  };

  const deleteSession = async (sessionId) => {
    try {
      await api.deleteSession(sessionId);
      await refreshData();
      triggerToast('Deleted', 'Session removed from schedule.', 'info', '🗑️');
    } catch (err) {
      triggerToast('Error', err.message, 'error', '⚠️');
      throw err;
    }
  };

  // Venue Handlers
  const createVenue = async (venueData) => {
    try {
      const res = await api.createVenue(venueData);
      await refreshData();
      triggerToast('Venue Created', `${res.venue.name} registered on campus.`, 'success', '🏢');
      return res.venue;
    } catch (err) {
      triggerToast('Error', err.message, 'error', '⚠️');
      throw err;
    }
  };

  // Registration Handler (Section 8 & 9)
  const registerForEvent = async (eventId, responses) => {
    setIsLoading(true);
    try {
      const res = await api.createRegistration(eventId, responses);
      setLatestRegistration(res.registration);
      await refreshData();
      triggerToast('Registration Successful', `ID: ${res.registration.registrationCode}`, 'success', '🎉');
      navigate('register-confirmation', { registration: res.registration });
      return res.registration;
    } catch (err) {
      triggerToast('Registration Failed', err.message, 'error', '⚠️');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // QR Generation (Section 20)
  const generateQR = async (eventId, sessionId, venueId) => {
    try {
      const res = await api.generateQR(eventId, sessionId, venueId);
      await refreshData();
      triggerToast('QR Code Generated', `Encrypted QR generated for ${res.qr.venueName}.`, 'success', '📲');
      return res.qr;
    } catch (err) {
      triggerToast('Error', err.message, 'error', '⚠️');
      throw err;
    }
  };

  // QR Check-in Scan with Strict Duplicate Prevention (Section 21 & 22)
  const checkInQR = async (payload) => {
    try {
      const res = await api.checkInQR(payload);
      await refreshData();
      triggerToast('Check-in Successful', res.message, 'success', '✅');
      return res;
    } catch (err) {
      // Duplicate rejection or invalid QR
      triggerToast('Scan Notice', err.message, 'warning', '⚠️');
      await refreshData();
      throw err;
    }
  };

  // Notification actions
  const markNotificationRead = async (id) => {
    try {
      await api.markNotificationRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: 1 } : n));
    } catch (err) {
      console.error(err);
    }
  };

  const markAllNotificationsRead = async () => {
    try {
      await api.markAllNotificationsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: 1 })));
    } catch (err) {
      console.error(err);
    }
  };

  // System Clean Reset (Empty Database)
  const resetDatabase = async () => {
    try {
      await api.resetSystem();
      setCurrentUser(null);
      setEvents([]);
      setVenues([]);
      setRegistrations([]);
      setSchedule([]);
      setNotifications([]);
      setQrCodes([]);
      setQrTracking({ checkIns: [], duplicates: [] });
      setCrowdVenues([]);
      localStorage.clear();
      navigate('welcome');
      triggerToast('Clean State Restored', 'Database completely emptied. 0 events, 0 registrations.', 'info', '🔄');
    } catch (err) {
      triggerToast('Reset Error', err.message, 'error', '⚠️');
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <AppContext.Provider
      value={{
        currentUser,
        selectedRole,
        setSelectedRole,
        currentPage,
        historyStack,
        navigate,
        goBack,
        currentEventId,
        setCurrentEventId,
        currentVenueId,
        setCurrentVenueId,
        latestRegistration,
        setLatestRegistration,
        events,
        venues,
        registrations,
        schedule,
        notifications,
        qrCodes,
        qrTracking,
        crowdVenues,
        isLoading,
        activeToast,
        setActiveToast,
        triggerToast,
        unreadCount,
        refreshData,
        login,
        signup,
        logout,
        createEvent,
        publishEvent,
        createSession,
        updateSession,
        deleteSession,
        createVenue,
        registerForEvent,
        generateQR,
        checkInQR,
        markNotificationRead,
        markAllNotificationsRead,
        resetDatabase
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

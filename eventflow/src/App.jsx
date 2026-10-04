import React, { useState } from 'react';
import { useApp } from './context/AppContext';

// Layout & Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import NotificationToast from './components/NotificationToast';
import QRScannerModal from './components/QRScannerModal';

// Pages
import WelcomePage from './pages/WelcomePage';
import RoleSelectionPage from './pages/RoleSelectionPage';
import LoginPage from './pages/LoginPage';
import AttendeeDashboard from './pages/AttendeeDashboard';
import BrowseEventsPage from './pages/BrowseEventsPage';
import EventDetailsPage from './pages/EventDetailsPage';
import RegistrationFormPage from './pages/RegistrationFormPage';
import RegistrationSuccessPage from './pages/RegistrationSuccessPage';
import MyRegisteredEventsPage from './pages/MyRegisteredEventsPage';
import MySchedulePage from './pages/MySchedulePage';
import CampusMapPage from './pages/CampusMapPage';
import LiveCrowdAttendeePage from './pages/LiveCrowdAttendeePage';
import OrganizerDashboard from './pages/OrganizerDashboard';
import CreateEventPage from './pages/CreateEventPage';
import EventScheduleCreationPage from './pages/EventScheduleCreationPage';
import AssignVenuePage from './pages/AssignVenuePage';
import RegistrationManagementPage from './pages/RegistrationManagementPage';
import QRCodeGenerationPage from './pages/QRCodeGenerationPage';
import QRScanTrackingPage from './pages/QRScanTrackingPage';
import LiveCrowdOrganizerPage from './pages/LiveCrowdOrganizerPage';
import NotificationsPage from './pages/NotificationsPage';
import ProfilePage from './pages/ProfilePage';

export default function App() {
  const { currentPage } = useApp();
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'welcome':
        return <WelcomePage />;
      case 'role-select':
        return <RoleSelectionPage />;
      case 'login':
        return <LoginPage />;
      case 'attendee-dashboard':
        return <AttendeeDashboard />;
      case 'browse-events':
        return <BrowseEventsPage />;
      case 'event-details':
        return <EventDetailsPage />;
      case 'register-form':
        return <RegistrationFormPage />;
      case 'register-confirmation':
        return <RegistrationSuccessPage />;
      case 'my-registered-events':
        return <MyRegisteredEventsPage />;
      case 'my-schedule':
        return <MySchedulePage onOpenScanner={() => setIsScannerOpen(true)} />;
      case 'campus-map':
        return <CampusMapPage />;
      case 'live-crowd-attendee':
        return <LiveCrowdAttendeePage onOpenScanner={() => setIsScannerOpen(true)} />;
      case 'organizer-dashboard':
        return <OrganizerDashboard />;
      case 'create-event':
        return <CreateEventPage />;
      case 'create-schedule':
        return <EventScheduleCreationPage />;
      case 'assign-venue':
        return <AssignVenuePage />;
      case 'registration-management':
        return <RegistrationManagementPage />;
      case 'qr-generate':
        return <QRCodeGenerationPage />;
      case 'qr-tracking':
        return <QRScanTrackingPage />;
      case 'live-crowd-organizer':
        return <LiveCrowdOrganizerPage />;
      case 'notifications':
        return <NotificationsPage />;
      case 'profile':
        return <ProfilePage />;
      default:
        return <WelcomePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-indigo-600 selection:text-white">
      {/* Toast Alert */}
      <NotificationToast />

      {/* Top Navbar */}
      <Navbar onOpenScanner={() => setIsScannerOpen(true)} />

      {/* Main Routed Page */}
      <main className="flex-1">
        {renderCurrentPage()}
      </main>

      {/* Attendee QR Scanner Modal */}
      <QRScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { User } from './types';
import { store } from './services/store';
import { ToastProvider } from './context/ToastContext';
import { PublicHeader } from './components/public/PublicHeader';
import { PublicHero } from './components/public/PublicHero';
import { PublicBookingWizard } from './components/public/PublicBookingWizard';
import { PublicInfoAndContact } from './components/public/PublicInfoAndContact';
import { LoginModal } from './components/auth/LoginModal';
import { AdminLayout } from './components/admin/AdminLayout';

export function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(() => store.getCurrentUser());
  const [isAdminMode, setIsAdminMode] = useState<boolean>(Boolean(currentUser));
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

  // Synchronized store data for public view
  const [settings, setSettings] = useState(() => store.getSettings());
  const [courts, setCourts] = useState(() => store.getCourts());
  const [timeSlots, setTimeSlots] = useState(() => store.getTimeSlots());
  const [bookings, setBookings] = useState(() => store.getBookings());

  // Function to refresh state when bookings are made or updated
  const refreshPublicData = () => {
    setSettings(store.getSettings());
    setCourts(store.getCourts());
    setTimeSlots(store.getTimeSlots());
    setBookings(store.getBookings());
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setIsAdminMode(true);
    refreshPublicData();
  };

  const handleLogout = () => {
    store.setCurrentUser(null);
    setCurrentUser(null);
    setIsAdminMode(false);
  };

  const scrollToSection = (sectionId: string) => {
    if (sectionId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    let targetElement: HTMLElement | null = null;
    if (sectionId === 'booking') {
      targetElement = document.getElementById('booking-section');
    } else if (sectionId === 'informasi') {
      targetElement = document.getElementById('informasi-section');
    } else if (sectionId === 'kontak') {
      targetElement = document.getElementById('kontak-section');
    }

    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <ToastProvider>
      {/* If User is Logged In and Admin Mode is Active -> Render Admin Panel */}
      {isAdminMode && currentUser ? (
        <AdminLayout
          currentUser={currentUser}
          onLogout={handleLogout}
          onSwitchToPublic={() => {
            setIsAdminMode(false);
            refreshPublicData();
          }}
        />
      ) : (
        /* Otherwise Render Public Website */
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
          {/* Public Header with Top Navigation and Admin Portal Access */}
          <PublicHeader
            settings={settings}
            onNavigate={scrollToSection}
            onOpenLogin={() => {
              if (currentUser) {
                setIsAdminMode(true);
              } else {
                setIsLoginModalOpen(true);
              }
            }}
          />

          {/* Quick banner if user is logged in as staff */}
          {currentUser && (
            <div className="bg-slate-900 text-white px-4 py-2 text-xs flex items-center justify-between">
              <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
                <span>
                  Login sebagai: <strong className="text-emerald-400">{currentUser.name}</strong> ({currentUser.role.toUpperCase()})
                </span>
                <button
                  onClick={() => setIsAdminMode(true)}
                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-[11px] transition-colors"
                >
                  Buka Panel Admin &rarr;
                </button>
              </div>
            </div>
          )}

          {/* Main Content */}
          <main className="flex-1">
            {/* Hero Section */}
            <PublicHero
              settings={settings}
              onCtaClick={() => scrollToSection('booking')}
            />

            {/* Public Booking Wizard (Matriks Ketersediaan & Booking WA) */}
            <div id="booking-section" className="scroll-mt-20">
              <PublicBookingWizard
                settings={settings}
                courts={courts}
                timeSlots={timeSlots}
                bookings={bookings}
                onBookingSubmitted={refreshPublicData}
              />
            </div>

            {/* Public Facilities, Rules & Contact Info */}
            <div id="informasi-section" className="scroll-mt-20">
              <PublicInfoAndContact settings={settings} />
            </div>
          </main>

          {/* Public Footer */}
          <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 text-xs py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
              <div>
                <p className="font-extrabold text-white text-sm">
                  {settings.name}
                </p>
                <p className="text-slate-500 mt-0.5">
                  Sistem Manajemen Rental Lapangan Badminton Profesional
                </p>
              </div>

              <div className="flex items-center gap-4 text-slate-400">
                <button
                  onClick={() => scrollToSection('home')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Kembali ke Atas
                </button>
                <span>•</span>
                <button
                  onClick={() => {
                    if (currentUser) {
                      setIsAdminMode(true);
                    } else {
                      setIsLoginModalOpen(true);
                    }
                  }}
                  className="text-emerald-400 hover:text-emerald-300 font-bold transition-colors"
                >
                  Portal Masuk Staf
                </button>
              </div>
            </div>
          </footer>

          {/* Login Modal */}
          <LoginModal
            isOpen={isLoginModalOpen}
            onClose={() => setIsLoginModalOpen(false)}
            onLoginSuccess={handleLoginSuccess}
          />
        </div>
      )}
    </ToastProvider>
  );
}

export default App;

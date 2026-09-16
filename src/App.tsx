import React, { useState, useEffect } from 'react';
import { User } from './types';
import { store, getTodayString } from './services/store';
import { ToastProvider } from './context/ToastContext';
import { PublicHeader } from './components/public/PublicHeader';
import { PublicHero } from './components/public/PublicHero';
import { PublicQuickBooking } from './components/public/PublicQuickBooking';
import { PublicAvailabilityGrid } from './components/public/PublicAvailabilityGrid';
import { PublicCourtCards } from './components/public/PublicCourtCards';
import { PublicFacilities } from './components/public/PublicFacilities';
import { PublicAbout } from './components/public/PublicAbout';
import { PublicLocation } from './components/public/PublicLocation';
import { PublicBookingRules } from './components/public/PublicBookingRules';
import { PublicTestimonials } from './components/public/PublicTestimonials';
import { PublicFaq } from './components/public/PublicFaq';
import { PublicFinalCta } from './components/public/PublicFinalCta';
import { PublicFooter } from './components/public/PublicFooter';
import { PublicBookingModal } from './components/public/PublicBookingModal';
import { LoginModal } from './components/auth/LoginModal';
import { AdminLayout } from './components/admin/AdminLayout';

export function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(() => store.getCurrentUser());
  const [isAdminMode, setIsAdminMode] = useState<boolean>(Boolean(currentUser));
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

  // Synchronized store data for public & admin views
  const [settings, setSettings] = useState(() => store.getSettings());
  const [courts, setCourts] = useState(() => store.getCourts());
  const [timeSlots, setTimeSlots] = useState(() => store.getTimeSlots());
  const [bookings, setBookings] = useState(() => store.getBookings());

  // Public interactive states
  const [selectedDate, setSelectedDate] = useState<string>(getTodayString(0));
  const [selectedCourtId, setSelectedCourtId] = useState<string>('ALL');

  // Booking Modal State
  const [isBookingModalOpen, setIsBookingModalOpen] = useState<boolean>(false);
  const [modalInitialParams, setModalInitialParams] = useState<{
    date?: string;
    courtId?: string;
    slotId?: string;
  }>({});

  // Function to refresh state across the app
  const refreshPublicData = () => {
    setSettings(store.getSettings());
    setCourts(store.getCourts());
    setTimeSlots(store.getTimeSlots());
    setBookings(store.getBookings());
  };

  // Synchronize on store changes across components & tabs
  useEffect(() => {
    const handleDataChanged = () => {
      refreshPublicData();
      const current = store.getCurrentUser();
      if (current) {
        setCurrentUser(current);
      }
    };
    window.addEventListener('gor_data_changed', handleDataChanged);
    return () => {
      window.removeEventListener('gor_data_changed', handleDataChanged);
    };
  }, []);

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

  const handleOpenBookingModal = (params?: {
    initialDate?: string;
    initialCourtId?: string;
    initialSlotId?: string;
  }) => {
    setModalInitialParams({
      date: params?.initialDate || selectedDate,
      courtId: params?.initialCourtId || (selectedCourtId !== 'ALL' ? selectedCourtId : undefined),
      slotId: params?.initialSlotId,
    });
    setIsBookingModalOpen(true);
  };

  const scrollToSection = (sectionId: string) => {
    if (sectionId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const sectionMap: Record<string, string> = {
      jadwal: 'jadwal-section',
      lapangan: 'lapangan-section',
      fasilitas: 'fasilitas-section',
      tentang: 'tentang-section',
      aturan: 'aturan-section',
      lokasi: 'lokasi-section',
      faq: 'faq-section',
      booking: 'jadwal-section',
      informasi: 'fasilitas-section',
      kontak: 'lokasi-section',
    };

    const targetId = sectionMap[sectionId] || `${sectionId}-section`;
    const targetElement = document.getElementById(targetId);

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
          onUserUpdated={(u) => setCurrentUser(u)}
          onSwitchToPublic={() => {
            setIsAdminMode(false);
            refreshPublicData();
          }}
        />
      ) : (
        /* Otherwise Render Genspark Public Website */
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
          {/* Public Header with Genspark Design */}
          <PublicHeader
            settings={settings}
            onNavigate={scrollToSection}
            onOpenBookingModal={() => handleOpenBookingModal()}
            onOpenLogin={() => {
              if (currentUser) {
                setIsAdminMode(true);
              } else {
                setIsLoginModalOpen(true);
              }
            }}
          />

          {/* Quick bar if staff is already logged in */}
          {currentUser && (
            <div className="bg-emerald-950/80 border-b border-emerald-800/40 text-white px-4 py-2 text-xs">
              <div className="max-w-7xl mx-auto flex items-center justify-between">
                <span>
                  Sesi login aktif: <strong className="text-emerald-400">{currentUser.name}</strong> ({currentUser.role.toUpperCase()})
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsAdminMode(true)}
                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black rounded-lg text-[11px] transition-colors cursor-pointer"
                  >
                    Kembali ke Panel Manajemen &rarr;
                  </button>
                  <button
                    onClick={handleLogout}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white font-bold rounded-lg text-[11px] transition-colors cursor-pointer"
                  >
                    Keluar Sesi
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Main Landing Page Content */}
          <main className="flex-1">
            {/* 1. Hero Section */}
            <PublicHero
              settings={settings}
              courts={courts}
              onOpenBooking={() => handleOpenBookingModal()}
              onScrollToAvailability={() => scrollToSection('jadwal')}
            />

            {/* 2. Quick Booking Bar & Horizontal Date Strip */}
            <PublicQuickBooking
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              selectedCourtId={selectedCourtId}
              onSelectCourtId={setSelectedCourtId}
              courts={courts}
              timeSlots={timeSlots}
              bookings={bookings}
              onOpenBookingModal={() => handleOpenBookingModal({ initialDate: selectedDate })}
            />

            {/* 3. Real-Time Availability Matrix */}
            <PublicAvailabilityGrid
              selectedDate={selectedDate}
              selectedCourtId={selectedCourtId}
              courts={courts}
              timeSlots={timeSlots}
              bookings={bookings}
              onSelectSlotToBook={(courtId, timeSlotId) =>
                handleOpenBookingModal({
                  initialDate: selectedDate,
                  initialCourtId: courtId,
                  initialSlotId: timeSlotId,
                })
              }
            />

            {/* 4. Court Showcase Cards */}
            <PublicCourtCards
              courts={courts}
              onSelectCourt={(courtId) =>
                handleOpenBookingModal({
                  initialDate: selectedDate,
                  initialCourtId: courtId,
                })
              }
            />

            {/* 5. Facilities Section */}
            <PublicFacilities settings={settings} />

            {/* 6. About Section */}
            <PublicAbout settings={settings} />

            {/* 7. Booking Rules & Terms Section */}
            <PublicBookingRules settings={settings} />

            {/* 8. Location & Operating Hours Section */}
            <PublicLocation settings={settings} />

            {/* 9. Player Testimonials */}
            <PublicTestimonials />

            {/* 10. FAQ Section */}
            <PublicFaq />

            {/* 11. Final Call To Action */}
            <PublicFinalCta
              settings={settings}
              onOpenBooking={() => handleOpenBookingModal()}
            />
          </main>

          {/* 12. Public Footer */}
          <PublicFooter
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

          {/* Genspark Booking Modal (Real-time Database Validation & Anti Double Booking) */}
          <PublicBookingModal
            isOpen={isBookingModalOpen}
            onClose={() => setIsBookingModalOpen(false)}
            settings={settings}
            courts={courts}
            timeSlots={timeSlots}
            bookings={bookings}
            initialDate={modalInitialParams.date}
            initialCourtId={modalInitialParams.courtId}
            initialSlotId={modalInitialParams.slotId}
            onBookingSubmitted={refreshPublicData}
          />

          {/* Login Modal for Staff & Owner */}
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

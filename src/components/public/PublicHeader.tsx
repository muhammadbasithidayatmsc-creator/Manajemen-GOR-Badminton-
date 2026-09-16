import React, { useState } from 'react';
import {
  Shield,
  Menu,
  X,
  Calendar,
  Phone,
  Sparkles,
  Grid,
  Info,
  Layers,
  MapPin,
  HelpCircle,
  Clock,
} from 'lucide-react';
import { BusinessSettings } from '../../types';

interface PublicHeaderProps {
  settings: BusinessSettings;
  onNavigate: (sectionId: string) => void;
  onOpenBookingModal: () => void;
  onOpenLogin: () => void;
}

export const PublicHeader: React.FC<PublicHeaderProps> = ({
  settings,
  onNavigate,
  onOpenBookingModal,
  onOpenLogin,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  const gorName = settings.gorName || settings.name || 'GOR Badminton Arena';

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-emerald-950/50 shadow-lg text-white">
      {/* Top micro bar with real-time operating hours and phone */}
      <div className="hidden sm:block bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 border-b border-emerald-900/30 text-[11px] py-1.5 px-4 text-emerald-200/80">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-emerald-300 font-semibold">Buka Operasional:</span> {settings.operatingHours}
            </span>
            <span className="text-slate-500">|</span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3 h-3 text-emerald-400" />
              <span className="truncate max-w-sm">{settings.address}</span>
            </span>
          </div>
          <div className="flex items-center gap-3 font-mono text-emerald-300">
            <Phone className="w-3 h-3 text-emerald-400" />
            <span>WA Center: +{settings.adminWhatsApp}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Brand Logo & Tagline */}
          <div
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-600/30 group-hover:scale-105 transition-transform shrink-0">
              {/* Badminton Shuttlecock Icon */}
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" opacity="0.15" />
                <path d="M12 3a9 9 0 0 0-9 9c0 4.97 4.03 9 9 9s9-4.03 9-9a9 9 0 0 0-9-9zm0 2c3.86 0 7 3.14 7 7 0 1.54-.5 2.97-1.35 4.14L14 12.5V11a2 2 0 0 0-2-2h-1V7h-2v2H8.5L5.8 7.3A7 7 0 0 1 12 5z" />
              </svg>
            </div>
            <div className="min-w-0">
              <span className="text-base sm:text-lg font-black tracking-tight text-white block leading-tight truncate">
                {gorName}
              </span>
              <span className="text-[10px] sm:text-xs font-bold text-emerald-400 tracking-wider uppercase flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Badminton Arena &bull; BWF Vinyl Standard
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-bold tracking-wide uppercase">
            <button
              onClick={() => handleNavClick('home')}
              className="text-slate-300 hover:text-emerald-400 transition-colors cursor-pointer py-1"
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('jadwal')}
              className="text-slate-300 hover:text-emerald-400 transition-colors cursor-pointer flex items-center gap-1 py-1"
            >
              <Grid className="w-3.5 h-3.5 text-emerald-400" />
              <span>Jadwal Lapangan</span>
            </button>
            <button
              onClick={() => handleNavClick('lapangan')}
              className="text-slate-300 hover:text-emerald-400 transition-colors cursor-pointer flex items-center gap-1 py-1"
            >
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
              <span>Lapangan</span>
            </button>
            <button
              onClick={() => handleNavClick('fasilitas')}
              className="text-slate-300 hover:text-emerald-400 transition-colors cursor-pointer flex items-center gap-1 py-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Fasilitas</span>
            </button>
            <button
              onClick={() => handleNavClick('lokasi')}
              className="text-slate-300 hover:text-emerald-400 transition-colors cursor-pointer flex items-center gap-1 py-1"
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>Lokasi</span>
            </button>
            <button
              onClick={() => handleNavClick('faq')}
              className="text-slate-300 hover:text-emerald-400 transition-colors cursor-pointer flex items-center gap-1 py-1"
            >
              <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>FAQ</span>
            </button>
          </nav>

          {/* Right Actions: Booking Button & Discreet Portal Link */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Primary CTA: Booking Sekarang */}
            <button
              onClick={onOpenBookingModal}
              className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Booking Sekarang</span>
            </button>

            {/* Portal Admin / Owner access - Protected & Discreet, NO credentials displayed */}
            <button
              onClick={onOpenLogin}
              title="Akses Portal Staf & Manajemen"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer"
            >
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Portal Staf</span>
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-900 border border-slate-800 focus:outline-hidden"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-950 border-b border-emerald-950/80 px-4 pt-3 pb-6 space-y-2.5 shadow-2xl">
          <div className="p-3 bg-emerald-950/40 rounded-xl border border-emerald-900/40 text-xs text-emerald-300 flex items-center justify-between mb-3">
            <span className="flex items-center gap-2 font-medium">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span>{settings.operatingHours}</span>
            </span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
              Buka
            </span>
          </div>

          <button
            onClick={() => handleNavClick('home')}
            className="w-full text-left py-2.5 px-3 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-200 hover:bg-emerald-950/50 hover:text-emerald-400 transition-colors"
          >
            Home
          </button>
          <button
            onClick={() => handleNavClick('jadwal')}
            className="w-full text-left py-2.5 px-3 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-200 hover:bg-emerald-950/50 hover:text-emerald-400 transition-colors flex items-center gap-2"
          >
            <Grid className="w-4 h-4 text-emerald-400" />
            <span>Jadwal & Ketersediaan Lapangan</span>
          </button>
          <button
            onClick={() => handleNavClick('lapangan')}
            className="w-full text-left py-2.5 px-3 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-200 hover:bg-emerald-950/50 hover:text-emerald-400 transition-colors flex items-center gap-2"
          >
            <Layers className="w-4 h-4 text-emerald-400" />
            <span>Pilihan Lapangan</span>
          </button>
          <button
            onClick={() => handleNavClick('fasilitas')}
            className="w-full text-left py-2.5 px-3 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-200 hover:bg-emerald-950/50 hover:text-emerald-400 transition-colors flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Fasilitas GOR</span>
          </button>
          <button
            onClick={() => handleNavClick('tentang')}
            className="w-full text-left py-2.5 px-3 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-200 hover:bg-emerald-950/50 hover:text-emerald-400 transition-colors flex items-center gap-2"
          >
            <Info className="w-4 h-4 text-emerald-400" />
            <span>Tentang Kami</span>
          </button>
          <button
            onClick={() => handleNavClick('aturan')}
            className="w-full text-left py-2.5 px-3 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-200 hover:bg-emerald-950/50 hover:text-emerald-400 transition-colors flex items-center gap-2"
          >
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>Tata Tertib & Aturan Main</span>
          </button>
          <button
            onClick={() => handleNavClick('lokasi')}
            className="w-full text-left py-2.5 px-3 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-200 hover:bg-emerald-950/50 hover:text-emerald-400 transition-colors flex items-center gap-2"
          >
            <MapPin className="w-4 h-4 text-emerald-400" />
            <span>Lokasi & Petunjuk Arah</span>
          </button>
          <button
            onClick={() => handleNavClick('faq')}
            className="w-full text-left py-2.5 px-3 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-200 hover:bg-emerald-950/50 hover:text-emerald-400 transition-colors flex items-center gap-2"
          >
            <HelpCircle className="w-4 h-4 text-emerald-400" />
            <span>FAQ / Pertanyaan Umum</span>
          </button>

          <div className="pt-3 border-t border-slate-800 space-y-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBookingModal();
              }}
              className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider text-center flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Booking Lapangan Sekarang</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenLogin();
              }}
              className="w-full py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-bold uppercase tracking-wider text-center flex items-center justify-center gap-2"
            >
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>Masuk Portal Staf / Owner</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

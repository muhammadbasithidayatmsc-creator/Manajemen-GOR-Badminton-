import React, { useState, useEffect } from 'react';
import {
  Menu,
  X,
  Calendar,
  Phone,
  Sparkles,
  Grid,
  Layers,
  MapPin,
  Clock,
  Shield,
  ArrowRight,
  Info,
} from 'lucide-react';
import { BusinessSettings, User } from '../../types';

interface PublicHeaderProps {
  settings: BusinessSettings;
  onNavigate: (sectionId: string) => void;
  onOpenBookingModal: () => void;
  onOpenLogin: () => void;
  currentUser?: User | null;
}

export const PublicHeader: React.FC<PublicHeaderProps> = ({
  settings,
  onNavigate,
  onOpenBookingModal,
  onOpenLogin,
  currentUser,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  const gorName = settings.gorName || settings.name || 'GOR Badminton Arena';

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#030712]/90 backdrop-blur-xl border-b border-white/10 shadow-2xl shadow-slate-950/80'
          : 'bg-[#030712]/75 backdrop-blur-lg border-b border-white/5'
      }`}
    >
      {/* Top Micro Information Bar */}
      <div className="hidden sm:block bg-gradient-to-r from-slate-950 via-blue-950/40 to-slate-950 border-b border-white/5 text-[11px] py-1.5 px-4 text-slate-400">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-xs shadow-emerald-400"></span>
              <span className="text-slate-200 font-semibold">Jam Operasional:</span> {settings.operatingHours}
            </span>
            <span className="text-slate-600">|</span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <MapPin className="w-3 h-3 text-blue-400" />
              <span className="truncate max-w-sm">{settings.address}</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href={`https://wa.me/${settings.adminWhatsApp}?text=Halo%20Admin%20${encodeURIComponent(gorName)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 font-mono transition-colors"
            >
              <Phone className="w-3 h-3" />
              <span>+{settings.adminWhatsApp}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo & Title */}
          <div
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3.5 cursor-pointer group select-none"
          >
            {/* 3D Shuttlecock Badge Logo */}
            <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 p-0.5 shadow-lg shadow-blue-500/25 group-hover:shadow-blue-500/40 group-hover:scale-105 transition-all duration-300">
              <div className="w-full h-full rounded-[14px] bg-slate-950 flex items-center justify-center text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20"></div>
                {/* 3D Shuttlecock vector icon */}
                <svg
                  className="w-6 h-6 text-blue-400 drop-shadow-[0_2px_8px_rgba(59,130,246,0.6)]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2a4 4 0 0 0-4 4c0 1.25.57 2.37 1.46 3.11L5 18l3 3 8.89-4.46A4 4 0 0 0 16 6a4 4 0 0 0-4-4z" />
                  <path d="M9 14l6-6" />
                  <circle cx="12" cy="5" r="1.5" fill="currentColor" />
                </svg>
              </div>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-lg sm:text-xl font-black tracking-tight text-white block leading-tight">
                  {gorName}
                </span>
                <span className="px-1.5 py-0.5 rounded-sm bg-blue-500/20 border border-blue-500/30 text-[9px] font-extrabold uppercase tracking-widest text-blue-400">
                  PRO
                </span>
              </div>
              <span className="text-[11px] font-semibold text-slate-400 tracking-wide flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                Badminton Arena &bull; BWF Vinyl System
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-xs font-bold tracking-wider uppercase">
            <button
              onClick={() => handleNavClick('home')}
              className="text-slate-300 hover:text-white transition-colors cursor-pointer py-1.5 relative group"
            >
              Home
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 group-hover:w-full transition-all duration-300 rounded-full"></span>
            </button>
            <button
              onClick={() => handleNavClick('jadwal')}
              className="text-slate-300 hover:text-white transition-colors cursor-pointer py-1.5 relative group"
            >
              Jadwal
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 group-hover:w-full transition-all duration-300 rounded-full"></span>
            </button>
            <button
              onClick={() => handleNavClick('lapangan')}
              className="text-slate-300 hover:text-white transition-colors cursor-pointer py-1.5 relative group"
            >
              Lapangan
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 group-hover:w-full transition-all duration-300 rounded-full"></span>
            </button>
            <button
              onClick={() => handleNavClick('fasilitas')}
              className="text-slate-300 hover:text-white transition-colors cursor-pointer py-1.5 relative group"
            >
              Fasilitas
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 group-hover:w-full transition-all duration-300 rounded-full"></span>
            </button>
            <button
              onClick={() => handleNavClick('tentang')}
              className="text-slate-300 hover:text-white transition-colors cursor-pointer py-1.5 relative group"
            >
              Tentang
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 group-hover:w-full transition-all duration-300 rounded-full"></span>
            </button>
            <button
              onClick={() => handleNavClick('lokasi')}
              className="text-slate-300 hover:text-white transition-colors cursor-pointer py-1.5 relative group"
            >
              Lokasi
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 group-hover:w-full transition-all duration-300 rounded-full"></span>
            </button>
          </nav>

          {/* Right Action CTAs */}
          <div className="flex items-center gap-3">
            {/* Staff / Owner Portal Entrance */}
            <button
              onClick={onOpenLogin}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-bold tracking-wide border border-white/10 hover:border-blue-500/40 transition-all cursor-pointer shadow-xs"
              title="Akses Portal Manajemen Staf & Owner"
            >
              <Shield className="w-3.5 h-3.5 text-blue-400" />
              <span>{currentUser ? 'Panel Admin' : 'Portal Staf'}</span>
            </button>

            {/* Primary CTA: BOOKING SEKARANG */}
            <button
              onClick={onOpenBookingModal}
              className="relative inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 hover:from-blue-500 hover:via-indigo-500 hover:to-blue-500 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-blue-600/30 hover:shadow-blue-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer overflow-hidden group"
            >
              <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></span>
              <Calendar className="w-3.5 h-3.5 text-blue-200" />
              <span>Booking Sekarang</span>
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-950/95 backdrop-blur-2xl border-b border-white/10 px-4 pt-3 pb-6 space-y-2 animate-in fade-in slide-in-from-top-3 duration-200">
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-white/10 text-xs font-bold uppercase">
            <button
              onClick={() => handleNavClick('home')}
              className="p-3 rounded-xl bg-slate-900/80 border border-white/5 text-left text-slate-200 hover:text-blue-400 flex items-center justify-between"
            >
              <span>Home</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
            </button>
            <button
              onClick={() => handleNavClick('jadwal')}
              className="p-3 rounded-xl bg-slate-900/80 border border-white/5 text-left text-slate-200 hover:text-blue-400 flex items-center justify-between"
            >
              <span>Jadwal Live</span>
              <Grid className="w-3.5 h-3.5 text-blue-400" />
            </button>
            <button
              onClick={() => handleNavClick('lapangan')}
              className="p-3 rounded-xl bg-slate-900/80 border border-white/5 text-left text-slate-200 hover:text-blue-400 flex items-center justify-between"
            >
              <span>Lapangan</span>
              <Layers className="w-3.5 h-3.5 text-blue-400" />
            </button>
            <button
              onClick={() => handleNavClick('fasilitas')}
              className="p-3 rounded-xl bg-slate-900/80 border border-white/5 text-left text-slate-200 hover:text-blue-400 flex items-center justify-between"
            >
              <span>Fasilitas</span>
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            </button>
            <button
              onClick={() => handleNavClick('tentang')}
              className="p-3 rounded-xl bg-slate-900/80 border border-white/5 text-left text-slate-200 hover:text-blue-400 flex items-center justify-between"
            >
              <span>Tentang GOR</span>
              <Info className="w-3.5 h-3.5 text-slate-500" />
            </button>
            <button
              onClick={() => handleNavClick('lokasi')}
              className="p-3 rounded-xl bg-slate-900/80 border border-white/5 text-left text-slate-200 hover:text-blue-400 flex items-center justify-between"
            >
              <span>Lokasi & Peta</span>
              <MapPin className="w-3.5 h-3.5 text-blue-400" />
            </button>
          </div>

          <div className="pt-2 flex flex-col gap-2.5">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBookingModal();
              }}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30"
            >
              <Calendar className="w-4 h-4" />
              <span>Booking Sekarang</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenLogin();
              }}
              className="w-full py-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-300 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <Shield className="w-3.5 h-3.5 text-blue-400" />
              <span>{currentUser ? 'Masuk ke Panel Manajemen' : 'Login Staf / Owner'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

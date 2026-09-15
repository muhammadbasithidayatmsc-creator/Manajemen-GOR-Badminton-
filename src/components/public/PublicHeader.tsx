import React, { useState } from 'react';
import { Shield, Menu, X, Activity, Phone, Info, Calendar } from 'lucide-react';
import { BusinessSettings } from '../../types';

interface PublicHeaderProps {
  settings: BusinessSettings;
  onNavigate: (sectionId: string) => void;
  onOpenLogin: () => void;
}

export const PublicHeader: React.FC<PublicHeaderProps> = ({
  settings,
  onNavigate,
  onOpenLogin,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo & Brand */}
          <div
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900 block leading-tight">
                {settings.name}
              </span>
              <span className="text-xs font-semibold text-emerald-600 tracking-wider uppercase">
                Badminton Arena
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={() => handleNavClick('home')}
              className="text-sm font-semibold text-slate-700 hover:text-emerald-600 transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('booking')}
              className="text-sm font-semibold text-slate-700 hover:text-emerald-600 transition-colors flex items-center gap-1.5"
            >
              <Calendar className="w-4 h-4 text-emerald-600" />
              Booking
            </button>
            <button
              onClick={() => handleNavClick('informasi')}
              className="text-sm font-semibold text-slate-700 hover:text-emerald-600 transition-colors flex items-center gap-1.5"
            >
              <Info className="w-4 h-4 text-emerald-600" />
              Informasi
            </button>
            <button
              onClick={() => handleNavClick('kontak')}
              className="text-sm font-semibold text-slate-700 hover:text-emerald-600 transition-colors flex items-center gap-1.5"
            >
              <Phone className="w-4 h-4 text-emerald-600" />
              Kontak
            </button>
          </nav>

          {/* Right Action: Admin Portal Login */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenLogin}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-700 bg-slate-100 hover:bg-slate-200/80 border border-slate-200 transition-all hover:border-slate-300 shadow-xs"
            >
              <Shield className="w-4 h-4 text-emerald-700" />
              <span>Portal Admin</span>
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-5 space-y-2 shadow-xl">
          <button
            onClick={() => handleNavClick('home')}
            className="w-full text-left py-2.5 px-3 rounded-lg text-sm font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
          >
            Home
          </button>
          <button
            onClick={() => handleNavClick('booking')}
            className="w-full text-left py-2.5 px-3 rounded-lg text-sm font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 flex items-center gap-2"
          >
            <Calendar className="w-4 h-4 text-emerald-600" />
            Booking Lapangan
          </button>
          <button
            onClick={() => handleNavClick('informasi')}
            className="w-full text-left py-2.5 px-3 rounded-lg text-sm font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 flex items-center gap-2"
          >
            <Info className="w-4 h-4 text-emerald-600" />
            Informasi & Fasilitas
          </button>
          <button
            onClick={() => handleNavClick('kontak')}
            className="w-full text-left py-2.5 px-3 rounded-lg text-sm font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 flex items-center gap-2"
          >
            <Phone className="w-4 h-4 text-emerald-600" />
            Kontak & Lokasi
          </button>
        </div>
      )}
    </header>
  );
};

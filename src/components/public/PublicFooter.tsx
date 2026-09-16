import React from 'react';
import { Phone, MapPin, Sparkles, ArrowUp } from 'lucide-react';
import { BusinessSettings } from '../../types';

interface PublicFooterProps {
  settings: BusinessSettings;
  onNavigate: (sectionId: string) => void;
  onOpenLogin: () => void;
}

export const PublicFooter: React.FC<PublicFooterProps> = ({
  settings,
  onNavigate,
  onOpenLogin,
}) => {
  const currentYear = new Date().getFullYear();
  const gorName = settings.gorName || settings.name || 'GOR Badminton Arena';

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#02050D] text-white border-t border-white/10 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-white/10">
          {/* Logo & Info */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black shadow-md shadow-blue-500/30">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2a4 4 0 0 0-4 4c0 1.25.57 2.37 1.46 3.11L5 18l3 3 8.89-4.46A4 4 0 0 0 16 6a4 4 0 0 0-4-4z" />
                </svg>
              </div>
              <span className="text-xl font-black uppercase tracking-tight text-white">
                {gorName}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 max-w-sm leading-relaxed">
              Arena badminton profesional berstandar BWF dengan sistem booking real-time, pencahayaan LED turnamen, dan fasilitas lengkap.
            </p>

            <div className="text-xs text-slate-400 space-y-2 pt-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>{settings.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <a
                  href={`https://wa.me/${settings.adminWhatsApp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-300 font-mono transition-colors"
                >
                  +{settings.adminWhatsApp}
                </a>
              </div>
            </div>
          </div>

          {/* Nav Menu */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Navigasi Cepat
            </h4>
            <ul className="space-y-2 text-xs text-slate-400 font-semibold">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-blue-400 transition-colors cursor-pointer"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('jadwal')}
                  className="hover:text-blue-400 transition-colors cursor-pointer"
                >
                  Jadwal & Ketersediaan
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('lapangan')}
                  className="hover:text-blue-400 transition-colors cursor-pointer"
                >
                  Pilihan Lapangan
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('fasilitas')}
                  className="hover:text-blue-400 transition-colors cursor-pointer"
                >
                  Fasilitas GOR
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('tentang')}
                  className="hover:text-blue-400 transition-colors cursor-pointer"
                >
                  Tentang Kami
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('lokasi')}
                  className="hover:text-blue-400 transition-colors cursor-pointer"
                >
                  Lokasi & Peta
                </button>
              </li>
            </ul>
          </div>

          {/* Staf / Management Access */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Portal Manajemen
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Khusus pengelola, staf admin, dan owner untuk mengelola reservasi, transaksi, dan laporan.
            </p>
            <button
              type="button"
              onClick={onOpenLogin}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white font-bold text-xs uppercase tracking-wider border border-white/10 hover:border-blue-500/50 transition-all inline-flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <span>Masuk Portal Manajemen</span>
            </button>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Back to Top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            &copy; {currentYear} {gorName}. All rights reserved. Professional Badminton Venue Management.
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
          >
            <span>Kembali ke Atas</span>
            <ArrowUp className="w-3.5 h-3.5 text-blue-400" />
          </button>
        </div>
      </div>
    </footer>
  );
};

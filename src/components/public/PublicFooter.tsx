import React from 'react';
import {
  Shield,
  Phone,
  MapPin,
  Clock,
  Sparkles,
  CreditCard,
  ChevronRight,
} from 'lucide-react';
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
  const gorName = settings.gorName || settings.name || 'GOR Badminton Arena';

  return (
    <footer className="bg-slate-950 border-t border-emerald-950 text-white pt-14 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pb-10 border-b border-slate-900">
          {/* Col 1: Brand & About */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-600/30">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-lg font-black tracking-tight text-white block">
                  {gorName}
                </span>
                <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider">
                  Badminton Management System
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              {settings.tagline || 'Pusat rental lapangan badminton standar turnamen internasional BWF dengan pelayanan profesional dan jadwal real-time.'}
            </p>

            <div className="pt-2 text-xs text-slate-400 space-y-2">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{settings.operatingHours}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-mono">+{settings.adminWhatsApp}</span>
              </div>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-emerald-400">
              Navigasi Cepat
            </h4>
            <ul className="space-y-2 text-xs font-semibold text-slate-300">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-emerald-500" />
                  <span>Beranda</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('jadwal')}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-emerald-500" />
                  <span>Jadwal & Ketersediaan</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('lapangan')}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-emerald-500" />
                  <span>Daftar Lapangan</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('fasilitas')}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-emerald-500" />
                  <span>Fasilitas GOR</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('aturan')}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-emerald-500" />
                  <span>Tata Tertib & Aturan</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('faq')}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-emerald-500" />
                  <span>FAQ</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Payment Info & Accounts */}
          <div className="lg:col-span-5 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <CreditCard className="w-4 h-4" />
              <span>Pembayaran & Rekening Resmi</span>
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Pembayaran uang muka (DP) manual ditransfer langsung ke rekening terverifikasi berikut:
            </p>

            <div className="space-y-2">
              {settings.bankAccounts && settings.bankAccounts.length > 0 ? (
                settings.bankAccounts.map((acc, i) => (
                  <div key={i} className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <span className="font-extrabold text-white mr-2">{acc.bankName}</span>
                      <span className="font-mono text-emerald-300 font-bold">{acc.accountNumber}</span>
                    </div>
                    <span className="text-slate-400 text-[11px] truncate max-w-[140px]">
                      a/n {acc.accountHolder}
                    </span>
                  </div>
                ))
              ) : (
                <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl text-xs text-slate-300">
                  {settings.bankInfo}
                </div>
              )}
            </div>

            <div className="text-[11px] text-slate-500 pt-1">
              Pelunasan di lokasi dapat dilakukan via Tunai atau QRIS Statis di kasir.
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Discreet Protected Staff Portal Access */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            &copy; {new Date().getFullYear()} {gorName}. All rights reserved.
          </div>

          {/* Protected portal link with NO hardcoded credentials */}
          <div className="flex items-center gap-3">
            <span className="text-slate-600">|</span>
            <button
              onClick={onOpenLogin}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-emerald-400 transition-colors py-1 cursor-pointer"
            >
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>Portal Staf & Manajemen</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

import React from 'react';
import {
  CheckCircle,
  MapPin,
  Clock,
  Phone,
  Shield,
  Award,
  Sparkles,
  MessageSquare,
} from 'lucide-react';
import { BusinessSettings } from '../../types';

interface PublicInfoAndContactProps {
  settings: BusinessSettings;
}

export const PublicInfoAndContact: React.FC<PublicInfoAndContactProps> = ({ settings }) => {
  // Format WhatsApp Link
  let cleanAdminNumber = settings.adminWhatsApp.replace(/[^0-9]/g, '');
  if (cleanAdminNumber.startsWith('0')) {
    cleanAdminNumber = '62' + cleanAdminNumber.substring(1);
  } else if (!cleanAdminNumber.startsWith('62')) {
    cleanAdminNumber = '62' + cleanAdminNumber;
  }

  const generalInquiryText = `Halo Admin ${settings.name}, saya ingin menanyakan informasi operasional dan jadwal lapangan.`;
  const directWaUrl = `https://wa.me/${cleanAdminNumber}?text=${encodeURIComponent(generalInquiryText)}`;

  return (
    <div className="space-y-16 py-12">
      {/* SECTION INFORMASI GOR & FASILITAS */}
      <section id="informasi-section" className="scroll-mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-4 border border-emerald-500/30">
              <Award className="w-4 h-4 text-emerald-400" />
              <span>Standar BWF & Kenyamanan Maksimal</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Fasilitas & Keunggulan {settings.name}
            </h2>
            <p className="mt-4 text-slate-300 text-sm sm:text-base leading-relaxed">
              {settings.aboutText}
            </p>
          </div>

          {/* Facilities Grid */}
          <div className="relative z-10 mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {settings.facilities.map((facility, index) => (
              <div
                key={index}
                className="flex items-start gap-3 bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-xs"
              >
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <span className="text-sm font-semibold text-slate-200 leading-snug">
                  {facility}
                </span>
              </div>
            ))}
          </div>

          {/* Booking Rules Card */}
          <div className="relative z-10 mt-10 bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8">
            <div className="flex items-center gap-2.5 mb-4 text-emerald-400">
              <Shield className="w-5 h-5" />
              <h3 className="text-base sm:text-lg font-bold text-white uppercase tracking-wider">
                Ketentuan & Tata Tertib Bermain
              </h3>
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs sm:text-sm text-slate-300">
              {settings.bookingRules.map((rule, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* SECTION KONTAK & LOKASI */}
      <section id="kontak-section" className="scroll-mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-xl">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Bantuan & Hubungi Kami</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Kontak & Lokasi GOR
            </h2>
            <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
              Ada pertanyaan terkait jadwal member berkala, turnamen komunitas, atau sparring? Hubungi admin langsung melalui WhatsApp.
            </p>

            <div className="mt-6 space-y-4">
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Alamat Lengkap
                  </h4>
                  <p className="text-sm font-bold text-slate-800 mt-0.5">{settings.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Jam Operasional
                  </h4>
                  <p className="text-sm font-bold text-slate-800 mt-0.5">{settings.operatingHours}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    WhatsApp Admin
                  </h4>
                  <p className="text-sm font-bold text-slate-800 mt-0.5">{settings.adminWhatsApp}</p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <a
                href={directWaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm tracking-wide transition-all shadow-md shadow-emerald-600/20"
              >
                <MessageSquare className="w-5 h-5" />
                <span>Chat Admin WhatsApp Langsung</span>
              </a>
            </div>
          </div>

          {/* Visual Sporty Badminton Card */}
          <div className="rounded-3xl bg-linear-to-br from-slate-900 to-emerald-950 p-8 text-white flex flex-col justify-between min-h-[380px] shadow-lg relative overflow-hidden">
            <div className="relative z-10">
              <span className="text-xs font-bold text-emerald-400 tracking-wider uppercase">
                GOR Badminton Premium
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold mt-2 leading-tight">
                Nikmati Sensasi Bermain Seperti di Kejuaraan Resmi
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm mt-3 leading-relaxed">
                Pencahayaan presisi, grip karpet vinyl maksimal, serta fasilitas bersih untuk menjaga kenyamanan dan stamina permainan Anda.
              </p>
            </div>

            <div className="relative z-10 pt-8 border-t border-white/10 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block">Status Operasional Hari Ini</span>
                <span className="text-sm font-bold text-emerald-400 flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Buka & Melayani Booking
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 block">Total Lapangan</span>
                <span className="text-sm font-extrabold text-white">4 Court Vinyl</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4">
          <p className="font-semibold text-slate-700">{settings.name} — Badminton Management System</p>
          <p className="mt-1">
            Dirancang khusus untuk manajemen operasional rental lapangan profesional.
          </p>
        </div>
      </footer>
    </div>
  );
};

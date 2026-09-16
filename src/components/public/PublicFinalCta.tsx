import React from 'react';
import { Calendar, MessageCircle, Sparkles, Trophy, ArrowRight } from 'lucide-react';
import { BusinessSettings } from '../../types';
import { generateDirectInquiryWhatsAppUrl } from '../../utils/whatsapp';

interface PublicFinalCtaProps {
  settings: BusinessSettings;
  onOpenBooking: () => void;
}

export const PublicFinalCta: React.FC<PublicFinalCtaProps> = ({ settings, onOpenBooking }) => {
  const waUrl = generateDirectInquiryWhatsAppUrl(settings);
  const gorName = settings.gorName || settings.name || 'GOR Badminton Arena';

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 border border-emerald-800/60 p-8 sm:p-14 shadow-2xl text-center">
        {/* Glow ambient background effect */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-teal-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <Trophy className="w-3.5 h-3.5 text-emerald-400" />
            <span>Siap Keringatan & Sehat Bersama</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase leading-tight">
            Amankan Lapangan Favoritmu <br />
            <span className="text-emerald-400">Sebelum Kehabisan Slot!</span>
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
            Slot prime-time malam dan akhir pekan cepat terisi. Cek ketersediaan hari ini dan kirimkan jadwal booking Anda dalam hitungan detik.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2">
            <button
              onClick={onOpenBooking}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-emerald-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Booking Lapangan Sekarang</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-7 py-4 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm uppercase tracking-wider border border-slate-700 hover:border-emerald-500/50 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>Tanya Admin via WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

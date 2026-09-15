import React from 'react';
import { Calendar, ArrowDown, Sparkles, MapPin, Clock } from 'lucide-react';
import { BusinessSettings } from '../../types';

interface PublicHeroProps {
  settings: BusinessSettings;
  onCtaClick: () => void;
}

export const PublicHero: React.FC<PublicHeroProps> = ({ settings, onCtaClick }) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-emerald-900 via-slate-900 to-slate-950 text-white pt-12 pb-20 sm:pt-20 sm:pb-28">
      {/* Sporty badminton court line background design */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-x-0 top-0 h-full max-w-5xl mx-auto border-x-2 border-white/20">
          <div className="w-full h-1/2 border-b-2 border-white/20"></div>
          <div className="absolute inset-y-0 left-1/2 w-0.5 bg-white/20"></div>
        </div>
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Subtle pill tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold tracking-wide uppercase mb-6 shadow-inner">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>Sistem Rental Lapangan Resmi • {settings.name}</span>
        </div>

        {/* Hero Title strictly according to requirement */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight uppercase leading-tight sm:leading-none text-white drop-shadow-sm">
          BOOKING LAPANGAN BADMINTON <span className="text-emerald-400">LEBIH MUDAH</span>
        </h1>

        {/* Subtitle strictly according to requirement */}
        <p className="mt-5 text-base sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
          Pilih tanggal, lihat ketersediaan lapangan, tentukan sesi bermain, lalu booking melalui WhatsApp.
        </p>

        {/* Quick Badges: Location & Hours */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs sm:text-sm text-slate-300">
          <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">
            <Clock className="w-4 h-4 text-emerald-400" />
            <span>{settings.operatingHours}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">
            <MapPin className="w-4 h-4 text-emerald-400" />
            <span className="truncate max-w-xs">{settings.address}</span>
          </div>
        </div>

        {/* CTA Button strictly according to requirement */}
        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onCtaClick}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-base tracking-wider uppercase transition-all shadow-lg shadow-emerald-500/30 hover:scale-[1.02] flex items-center justify-center gap-2 cursor-pointer"
          >
            <Calendar className="w-5 h-5" />
            <span>CEK KETERSEDIAAN</span>
            <ArrowDown className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};

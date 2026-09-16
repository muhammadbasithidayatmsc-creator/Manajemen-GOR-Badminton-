import React from 'react';
import {
  Calendar,
  ArrowDown,
  Sparkles,
  MapPin,
  Clock,
  ShieldCheck,
  Award,
  Users,
  CheckCircle2,
} from 'lucide-react';
import { BusinessSettings, Court } from '../../types';

interface PublicHeroProps {
  settings: BusinessSettings;
  courts: Court[];
  onOpenBooking: () => void;
  onScrollToAvailability: () => void;
}

export const PublicHero: React.FC<PublicHeroProps> = ({
  settings,
  courts,
  onOpenBooking,
  onScrollToAvailability,
}) => {
  const activeCourtsCount = courts.filter((c) => c.status === 'ACTIVE').length;
  const gorName = settings.gorName || settings.name || 'GOR Badminton Arena';

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white pt-10 pb-16 sm:pt-16 sm:pb-24 border-b border-emerald-950/40">
      {/* Background Badminton Court Lines Geometric Effect */}
      <div className="absolute inset-0 opacity-15 pointer-events-none overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-full max-w-6xl mx-auto border-x border-emerald-500/20">
          <div className="w-full h-1/2 border-b border-emerald-500/20"></div>
          <div className="absolute inset-y-0 left-1/2 w-px bg-emerald-500/20"></div>
          {/* Badminton service boxes & center circle */}
          <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 rounded-full border border-emerald-400/10"></div>
        </div>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Official GOR Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold tracking-wide uppercase mb-6 shadow-inner animate-fade-in">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>{gorName} &bull; Official Arena</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight uppercase leading-tight sm:leading-none text-white drop-shadow-sm max-w-4xl mx-auto">
          SEWA LAPANGAN BADMINTON <br />
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
            LEBIH MUDAH & REAL-TIME
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-5 text-sm sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
          Pilih tanggal, pantau ketersediaan slot live secara akurat tanpa risiko bentrok jadwal, dan amankan jadwal latihan favoritmu via WhatsApp resmi.
        </p>

        {/* Feature Badges: Buka, Lokasi, Fasilitas */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs sm:text-sm text-slate-300">
          <div className="flex items-center gap-1.5 bg-slate-900/80 border border-emerald-900/40 px-3 py-1.5 rounded-xl shadow-xs">
            <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{settings.operatingHours}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-900/80 border border-emerald-900/40 px-3 py-1.5 rounded-xl shadow-xs">
            <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="truncate max-w-xs">{settings.address}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-900/80 border border-emerald-900/40 px-3 py-1.5 rounded-xl shadow-xs text-emerald-300 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{activeCourtsCount} Lapangan Vinyl Siap Pakai</span>
          </div>
        </div>

        {/* CTAs: Booking Sekarang & Cek Jadwal */}
        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-md mx-auto">
          <button
            onClick={onOpenBooking}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm uppercase tracking-wider shadow-lg shadow-emerald-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Calendar className="w-4 h-4" />
            <span>Booking Sekarang</span>
          </button>

          <button
            onClick={onScrollToAvailability}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-white font-bold text-sm uppercase tracking-wider border border-slate-700 hover:border-emerald-500/50 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Cek Ketersediaan Slot</span>
            <ArrowDown className="w-4 h-4 text-emerald-400" />
          </button>
        </div>

        {/* Metrics Grid Cards (Genspark signature visual highlights) */}
        <div className="mt-12 sm:mt-16 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-5xl mx-auto">
          <div className="bg-slate-900/70 border border-slate-800/80 p-4 rounded-2xl text-left hover:border-emerald-500/40 transition-all">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-2">
              <Award className="w-4 h-4" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-white">Karpet Vinyl</div>
            <div className="text-xs text-slate-400 mt-0.5">Standar Turnamen BWF 5.0mm</div>
          </div>

          <div className="bg-slate-900/70 border border-slate-800/80 p-4 rounded-2xl text-left hover:border-emerald-500/40 transition-all">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-2">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-white">500+ Lux LED</div>
            <div className="text-xs text-slate-400 mt-0.5">Anti-silau & merata di tiap lapangan</div>
          </div>

          <div className="bg-slate-900/70 border border-slate-800/80 p-4 rounded-2xl text-left hover:border-emerald-500/40 transition-all">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-2">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-white">Anti-Bentrok</div>
            <div className="text-xs text-slate-400 mt-0.5">Jadwal sinkron langsung database</div>
          </div>

          <div className="bg-slate-900/70 border border-slate-800/80 p-4 rounded-2xl text-left hover:border-emerald-500/40 transition-all">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-2">
              <Users className="w-4 h-4" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-white">1,200+ Member</div>
            <div className="text-xs text-slate-400 mt-0.5">Komunitas & sparring aktif tiap pekan</div>
          </div>
        </div>
      </div>
    </section>
  );
};

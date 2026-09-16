import React from 'react';
import {
  Calendar,
  ArrowDown,
  Sparkles,
  MapPin,
  Clock,
  ShieldCheck,
  Award,
  Zap,
  CheckCircle2,
  ChevronRight,
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
    <section className="relative overflow-hidden bg-[#030712] text-white pt-10 pb-16 sm:pt-16 sm:pb-24 border-b border-white/5">
      {/* 3D Floating Ambient Glow Spheres */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-blue-600/20 via-indigo-600/15 to-purple-600/10 blur-[130px] rounded-full pointer-events-none -z-10"></div>
      <div className="absolute -top-10 -right-10 w-96 h-96 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none -z-10"></div>
      <div className="absolute bottom-0 -left-10 w-96 h-96 bg-purple-500/10 blur-[100px] rounded-full pointer-events-none -z-10"></div>

      {/* Subtle Court Lines Geometry */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none overflow-hidden select-none">
        <div className="max-w-6xl mx-auto h-full border-x border-white">
          <div className="w-full h-1/2 border-b border-white"></div>
          <div className="absolute inset-y-0 left-1/2 w-px bg-white"></div>
          <div className="absolute top-1/3 left-1/4 w-1/2 h-1/3 rounded-full border border-white"></div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column: Headlines & CTAs */}
          <div className="lg:col-span-7 text-center lg:text-left">
            {/* Top Quality Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/80 border border-blue-500/30 text-blue-400 text-xs font-bold tracking-wider uppercase mb-6 shadow-inner shadow-blue-500/10">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping"></span>
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>{gorName} &bull; Premium Sports Venue</span>
            </div>

            {/* Exact Requested Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight uppercase leading-[1.05] text-white">
              BOOK YOUR COURT.
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent drop-shadow-[0_4px_24px_rgba(59,130,246,0.35)]">
                PLAY YOUR BEST.
              </span>
            </h1>

            {/* Exact Requested Subheadline */}
            <p className="mt-6 text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-xl mx-auto lg:mx-0">
              Nikmati pengalaman bermain badminton dengan fasilitas nyaman, lapangan berkualitas dan proses booking yang mudah.
            </p>

            {/* Micro Highlights Pill */}
            <div className="mt-6 flex flex-wrap items-center justify-center lg:justify-start gap-2.5 text-xs text-slate-300">
              <div className="flex items-center gap-1.5 bg-slate-900/90 border border-white/10 px-3 py-1.5 rounded-xl shadow-xs">
                <Clock className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>{settings.operatingHours}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-900/90 border border-white/10 px-3 py-1.5 rounded-xl shadow-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{activeCourtsCount} Lapangan Siap Pakai</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-900/90 border border-white/10 px-3 py-1.5 rounded-xl shadow-xs">
                <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Anti-Double Booking</span>
              </div>
            </div>

            {/* Exact Requested CTAs: BOOKING SEKARANG & LIHAT JADWAL */}
            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 sm:gap-4 max-w-md mx-auto lg:mx-0">
              <button
                onClick={onOpenBooking}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 hover:from-blue-500 hover:via-indigo-500 hover:to-blue-500 text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-xl shadow-blue-600/35 hover:shadow-blue-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer relative overflow-hidden group"
              >
                <span className="absolute inset-0 bg-white/15 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                <Calendar className="w-4 h-4 text-blue-200" />
                <span>BOOKING SEKARANG</span>
              </button>

              <button
                onClick={onScrollToAvailability}
                className="w-full sm:w-auto px-7 py-4 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white font-bold text-xs sm:text-sm uppercase tracking-wider border border-white/10 hover:border-blue-500/50 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <span>LIHAT JADWAL</span>
                <ArrowDown className="w-4 h-4 text-blue-400" />
              </button>
            </div>
          </div>

          {/* Right Column: 3D Depth Card with Cinematic Sports Imagery & Floating 3D Elements */}
          <div className="lg:col-span-5 relative perspective-container mt-4 lg:mt-0">
            {/* Main 3D Card Showcase */}
            <div className="relative rounded-3xl p-1 bg-gradient-to-b from-blue-500/30 via-white/10 to-purple-500/20 shadow-2xl shadow-slate-950/90 subtle-3d-card">
              <div className="relative rounded-[22px] overflow-hidden bg-slate-950 border border-white/10">
                {/* Cinematic Badminton Court Sports Photography */}
                <div className="relative h-80 sm:h-96 w-full overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=1200&auto=format&fit=crop"
                    alt="Cinematic Badminton Court Arena"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center scale-105 hover:scale-110 transition-transform duration-700 brightness-95 contrast-110"
                  />
                  {/* Subtle lighting vignette overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-transparent to-blue-950/20"></div>

                  {/* Top floating pill inside image */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                    <span className="px-3 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md border border-white/15 text-[11px] font-mono font-bold text-blue-300 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      LIVE COURT VIEW
                    </span>
                    <span className="px-3 py-1 rounded-lg bg-blue-600/80 backdrop-blur-md text-white text-[11px] font-bold">
                      BWF Standard 5.0mm
                    </span>
                  </div>

                  {/* Bottom overlay inside image */}
                  <div className="absolute bottom-4 left-4 right-4 p-3 rounded-2xl bg-slate-950/80 backdrop-blur-xl border border-white/10 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-black text-white uppercase tracking-wider">
                        Sistem Karpet Vinyl Premium
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Pencahayaan LED 500+ Lux Anti-Silau
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-slate-400 uppercase font-semibold">Mulai Dari</div>
                      <div className="text-sm font-black text-blue-400">
                        Rp {settings.defaultHourlyRate.toLocaleString('id-ID')}/jam
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 3D Floating Element: Floating Shuttlecock Badge with depth effect */}
            <div className="absolute -top-6 -right-4 sm:-right-6 bg-slate-950/90 backdrop-blur-xl border border-blue-500/40 p-3 rounded-2xl shadow-xl shadow-blue-950/60 hidden sm:flex items-center gap-3 animate-float-slow z-20">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/40">
                {/* 3D Shuttlecock icon */}
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" opacity="0.2" />
                  <path d="M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16zm-1 2h2v4h-2V6zm0 6h2v6h-2v-6z" />
                </svg>
              </div>
              <div>
                <div className="text-xs font-black text-white">4 Lapangan Utama</div>
                <div className="text-[10px] text-blue-400 font-semibold">Tersedia Setiap Hari</div>
              </div>
            </div>

            {/* 3D Floating Element: Bottom Left Verified Badge */}
            <div className="absolute -bottom-6 -left-4 sm:-left-6 bg-slate-950/90 backdrop-blur-xl border border-purple-500/30 p-3 rounded-2xl shadow-xl shadow-purple-950/60 hidden sm:flex items-center gap-3 animate-float-opposite z-20">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-purple-500/40">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-xs font-black text-white">Konfirmasi Instan</div>
                <div className="text-[10px] text-purple-300 font-semibold">Langsung WhatsApp Admin</div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Feature Cards Under Hero with Soft 3D Elevation */}
        <div className="mt-16 sm:mt-20 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-6xl mx-auto">
          <div className="bg-slate-950/80 border border-white/10 p-5 rounded-2xl text-left hover:border-blue-500/40 transition-all duration-300 shadow-xl group">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Award className="w-4 h-4" />
            </div>
            <div className="text-base sm:text-lg font-black text-white">Karpet Vinyl BWF</div>
            <div className="text-xs text-slate-400 mt-1">Tebal 5.0mm, empuk & meredam getaran sendi</div>
          </div>

          <div className="bg-slate-950/80 border border-white/10 p-5 rounded-2xl text-left hover:border-blue-500/40 transition-all duration-300 shadow-xl group">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="text-base sm:text-lg font-black text-white">500+ Lux LED</div>
            <div className="text-xs text-slate-400 mt-1">Pencahayaan anti-silau berstandar turnamen</div>
          </div>

          <div className="bg-slate-950/80 border border-white/10 p-5 rounded-2xl text-left hover:border-blue-500/40 transition-all duration-300 shadow-xl group">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Zap className="w-4 h-4" />
            </div>
            <div className="text-base sm:text-lg font-black text-white">Anti-Bentrok Jadwal</div>
            <div className="text-xs text-slate-400 mt-1">Validasi ketersediaan langsung real-time</div>
          </div>

          <div className="bg-slate-950/80 border border-white/10 p-5 rounded-2xl text-left hover:border-blue-500/40 transition-all duration-300 shadow-xl group">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="text-base sm:text-lg font-black text-white">Fasilitas Lengkap</div>
            <div className="text-xs text-slate-400 mt-1">Shower bersih, kantin, musholla & parkir luas</div>
          </div>
        </div>
      </div>
    </section>
  );
};

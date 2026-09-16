import React from 'react';
import { Calendar, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import { BusinessSettings } from '../../types';

interface PublicFinalCtaProps {
  settings: BusinessSettings;
  onOpenBooking: () => void;
}

export const PublicFinalCta: React.FC<PublicFinalCtaProps> = ({
  settings,
  onOpenBooking,
}) => {
  return (
    <section className="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-64 bg-gradient-to-r from-blue-600/20 via-indigo-600/20 to-purple-600/20 blur-[100px] rounded-full pointer-events-none"></div>

      {/* Main Luxury Banner */}
      <div className="relative rounded-3xl p-1 bg-gradient-to-r from-blue-600/40 via-indigo-600/30 to-purple-600/40 shadow-2xl shadow-slate-950/90">
        <div className="relative rounded-[22px] bg-[#050B17] overflow-hidden p-8 sm:p-14 text-center border border-white/10">
          {/* Subtle image background with dramatic gradient */}
          <div className="absolute inset-0 opacity-15 pointer-events-none">
            <img
              src="https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=1600&auto=format&fit=crop"
              alt="Court Atmosphere"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-[#050B17]/80"></div>
          </div>

          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Jadwal Terbatas Setiap Hari</span>
            </div>

            {/* Exact Requested Title & Subheadline */}
            <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tight uppercase leading-tight">
              READY TO PLAY?
            </h2>

            <p className="text-base sm:text-xl text-slate-300 font-normal leading-relaxed">
              &ldquo;Amankan jadwal bermainmu sekarang.&rdquo;
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              {/* Exact Requested Button: BOOK YOUR COURT */}
              <button
                type="button"
                onClick={onOpenBooking}
                className="w-full sm:w-auto px-10 py-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 hover:from-blue-500 hover:via-indigo-500 hover:to-blue-500 text-white font-black text-sm uppercase tracking-wider shadow-xl shadow-blue-600/40 hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer group"
              >
                <Calendar className="w-4 h-4 text-blue-200" />
                <span>BOOK YOUR COURT</span>
                <ArrowRight className="w-4 h-4 text-blue-200 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="pt-4 flex items-center justify-center gap-6 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Anti-Double Booking
              </span>
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-blue-400" />
                Respon Cepat WhatsApp
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

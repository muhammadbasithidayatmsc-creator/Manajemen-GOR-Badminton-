import React from 'react';
import {
  Layers,
  Sparkles,
  Zap,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { Court } from '../../types';

interface PublicCourtCardsProps {
  courts: Court[];
  onSelectCourt: (courtId: string) => void;
}

const courtImages = [
  'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1544919982-b61976f0ba43?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1613918108466-292b78a8ef95?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1521537634581-0dced2fee2ef?q=80&w=800&auto=format&fit=crop',
];

export const PublicCourtCards: React.FC<PublicCourtCardsProps> = ({
  courts,
  onSelectCourt,
}) => {
  return (
    <section id="lapangan-section" className="scroll-mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wider mb-3">
          <Layers className="w-3.5 h-3.5" />
          <span>Fasilitas Lapangan Turnamen</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase">
          Pilihan Lapangan Badminton
        </h2>
        <p className="mt-3 text-slate-300 text-sm sm:text-base leading-relaxed">
          Seluruh lapangan menggunakan karpet vinyl berstandar BWF 5.0mm dengan pencahayaan LED 500+ Lux anti-silau untuk performa smash dan manuver maksimal.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 perspective-container">
        {courts.map((court, idx) => {
          const isMaintenance = court.status === 'MAINTENANCE';
          const courtImage = courtImages[idx % courtImages.length];

          return (
            <div
              key={court.id}
              className="bg-[#050B17]/95 border border-white/10 rounded-3xl overflow-hidden hover:border-blue-500/50 transition-all duration-300 flex flex-col shadow-2xl shadow-slate-950/80 subtle-3d-card group"
            >
              {/* Premium Photographic Image with 3D Depth */}
              <div className="relative h-48 w-full overflow-hidden">
                <img
                  src={courtImage}
                  alt={court.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 brightness-95"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050B17] via-[#050B17]/40 to-transparent"></div>

                {/* Badges on Image */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md border border-white/15 text-[11px] font-mono font-bold text-blue-400">
                    {court.code}
                  </span>
                  {isMaintenance ? (
                    <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[11px] font-bold">
                      Maintenance
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[11px] font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      Siap Main
                    </span>
                  )}
                </div>

                {/* Court Name on lower part of image */}
                <div className="absolute bottom-3 left-4 right-4">
                  <h3 className="text-xl font-black text-white group-hover:text-blue-300 transition-colors uppercase tracking-tight">
                    {court.name}
                  </h3>
                  <p className="text-xs text-blue-400 font-semibold mt-0.5">
                    Premium Indoor Court
                  </p>
                </div>
              </div>

              {/* Body Content & Features */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                {/* Requested Features: Indoor, LED Lighting, Professional Flooring */}
                <div className="space-y-2.5 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                    <span className="font-semibold">Indoor Stadium</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>LED Lighting (500+ Lux Anti-Silau)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>Professional Flooring (Vinyl BWF 5.0mm)</span>
                  </div>
                </div>

                {/* Rate & Action Button: PILIH LAPANGAN */}
                <div className="pt-3 border-t border-white/10 space-y-3">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs text-slate-400 uppercase font-semibold">Tarif Sewa</span>
                    <div className="text-right">
                      <span className="text-lg font-black text-white">
                        Rp {court.hourlyRate.toLocaleString('id-ID')}
                      </span>
                      <span className="text-xs text-slate-400"> / jam</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={isMaintenance}
                    onClick={() => onSelectCourt(court.id)}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-40 disabled:hover:from-blue-600 disabled:cursor-not-allowed text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-blue-600/25 hover:shadow-blue-500/40 transition-all flex items-center justify-center gap-2 cursor-pointer group/btn"
                  >
                    <span>PILIH LAPANGAN</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

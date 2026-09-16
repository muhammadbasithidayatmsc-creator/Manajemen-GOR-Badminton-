import React from 'react';
import {
  Sparkles,
  Award,
  Zap,
  CheckCircle,
  Calendar,
  Layers,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { Court } from '../../types';
import { formatRupiah } from '../../services/store';

interface PublicCourtCardsProps {
  courts: Court[];
  onSelectCourt: (courtId: string) => void;
}

export const PublicCourtCards: React.FC<PublicCourtCardsProps> = ({
  courts,
  onSelectCourt,
}) => {
  return (
    <section id="lapangan-section" className="scroll-mt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
          <Layers className="w-3.5 h-3.5" />
          <span>Fasilitas Lapangan Unggulan</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Pilihan Lapangan Badminton
        </h2>
        <p className="mt-3 text-slate-400 text-sm sm:text-base">
          Seluruh lapangan dirawat secara harian dengan karpet vinyl bersertifikat standar turnamen untuk kenyamanan kaki dan pantulan bola optimal.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {courts.map((court, idx) => {
          const isMaintenance = court.status === 'MAINTENANCE';
          const courtColorThemes = [
            'from-emerald-900/60 to-slate-900',
            'from-teal-900/60 to-slate-900',
            'from-cyan-900/60 to-slate-900',
            'from-emerald-950/80 to-slate-900',
          ];
          const bgTheme = courtColorThemes[idx % courtColorThemes.length];

          return (
            <div
              key={court.id}
              className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden hover:border-emerald-500/50 transition-all flex flex-col shadow-xl group"
            >
              {/* Graphic Court Preview Banner */}
              <div className={`relative h-40 bg-gradient-to-b ${bgTheme} p-4 flex flex-col justify-between overflow-hidden`}>
                {/* Badminton Court Visual Lines Representation */}
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                  <div className="w-full h-full border-2 border-white/30 rounded-lg m-2"></div>
                  <div className="absolute inset-x-0 top-1/2 h-0.5 bg-white/40"></div>
                  <div className="absolute inset-y-0 left-1/2 w-0.5 bg-white/40"></div>
                </div>

                <div className="relative z-10 flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-lg bg-slate-950/70 backdrop-blur-xs border border-white/10 text-[11px] font-mono font-bold text-emerald-300">
                    {court.code}
                  </span>
                  {isMaintenance ? (
                    <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[11px] font-bold">
                      Perawatan
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[11px] font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      Siap Main
                    </span>
                  )}
                </div>

                <div className="relative z-10">
                  <h3 className="text-xl font-black text-white group-hover:text-emerald-300 transition-colors">
                    {court.name}
                  </h3>
                  <p className="text-xs text-emerald-400/90 font-medium mt-0.5">
                    {court.surfaceType || 'Vinyl BWF Standard 5.0mm'}
                  </p>
                </div>
              </div>

              {/* Body specs & description */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2.5">
                  <div className="text-xs text-slate-400 leading-relaxed">
                    {court.notes || 'Permukaan karpet bertekstur pasir anti-slip dengan penyerapan guncangan sendi terbaik.'}
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-800 text-xs text-slate-300">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Karpet Vinyl BWF Standar 5.0mm</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Lampu LED 500+ Lux Anti-Silau</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Net Yonex Resmi & Tiang Kokoh</span>
                    </div>
                  </div>
                </div>

                {/* Pricing & CTA */}
                <div className="pt-4 border-t border-slate-800">
                  <div className="flex items-baseline justify-between mb-3">
                    <span className="text-xs text-slate-400">Tarif Sewa:</span>
                    <span className="text-lg font-black text-white">
                      {formatRupiah(court.hourlyRate)}
                      <span className="text-xs font-normal text-slate-400"> / jam</span>
                    </span>
                  </div>

                  <button
                    disabled={isMaintenance}
                    onClick={() => onSelectCourt(court.id)}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                      isMaintenance
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] cursor-pointer'
                    }`}
                  >
                    <Calendar className="w-4 h-4" />
                    <span>{isMaintenance ? 'Sedang Perawatan' : 'Pilih Lapangan Ini'}</span>
                    {!isMaintenance && <ArrowRight className="w-3.5 h-3.5" />}
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

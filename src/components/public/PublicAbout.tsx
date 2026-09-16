import React from 'react';
import { Award, CheckCircle, Sparkles, Trophy, Users, ShieldCheck } from 'lucide-react';
import { BusinessSettings } from '../../types';

interface PublicAboutProps {
  settings: BusinessSettings;
}

export const PublicAbout: React.FC<PublicAboutProps> = ({ settings }) => {
  const gorName = settings.gorName || settings.name || 'GOR Badminton Arena';

  return (
    <section id="tentang-section" className="scroll-mt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl">
        {/* Left column: Story & Mission */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Trophy className="w-3.5 h-3.5" />
            <span>Standar & Komitmen Kualitas</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            Arena Badminton Terbaik Untuk <br />
            <span className="text-emerald-400">Pemain Juara & Rekreasi</span>
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            {settings.aboutText}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs sm:text-sm text-slate-300 font-medium">
            <div className="flex items-center gap-2.5">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Pembersihan karpet rutin setiap sesi</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Sirkulasi udara sejuk non-pengap</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Sistem anti double booking terjamin</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Didukung staf operasional ramah & sigap</span>
            </div>
          </div>
        </div>

        {/* Right column: Stat Counters Card */}
        <div className="lg:col-span-5 grid grid-cols-2 gap-4">
          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 text-center">
            <div className="text-3xl sm:text-4xl font-black text-emerald-400 mb-1">4</div>
            <div className="text-xs font-bold uppercase tracking-wider text-white">Lapangan Vinyl</div>
            <div className="text-[11px] text-slate-400 mt-1">Standar BWF 5.0mm</div>
          </div>

          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 text-center">
            <div className="text-3xl sm:text-4xl font-black text-teal-400 mb-1">1.2K+</div>
            <div className="text-xs font-bold uppercase tracking-wider text-white">Member Aktif</div>
            <div className="text-[11px] text-slate-400 mt-1">Klub & Sparring Mingguan</div>
          </div>

          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 text-center">
            <div className="text-3xl sm:text-4xl font-black text-cyan-400 mb-1">500+</div>
            <div className="text-xs font-bold uppercase tracking-wider text-white">Lux LED</div>
            <div className="text-[11px] text-slate-400 mt-1">Penerangan Anti-Silau</div>
          </div>

          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 text-center">
            <div className="text-3xl sm:text-4xl font-black text-emerald-300 mb-1">4.9/5</div>
            <div className="text-xs font-bold uppercase tracking-wider text-white">Ulasan Atlet</div>
            <div className="text-[11px] text-slate-400 mt-1">Kepuasan Pengunjung</div>
          </div>
        </div>
      </div>
    </section>
  );
};

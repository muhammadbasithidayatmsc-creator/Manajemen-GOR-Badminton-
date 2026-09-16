import React from 'react';
import { Sparkles, Award, ShieldCheck, Heart } from 'lucide-react';
import { BusinessSettings } from '../../types';

interface PublicAboutProps {
  settings: BusinessSettings;
}

export const PublicAbout: React.FC<PublicAboutProps> = ({ settings }) => {
  const gorName = settings.gorName || settings.name || 'GOR Badminton Arena';

  return (
    <section id="tentang-section" className="scroll-mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="bg-[#050B17]/95 border border-white/10 rounded-3xl overflow-hidden shadow-2xl shadow-slate-950/80">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 sm:p-12">
          {/* Left Visual AI / High-End Venue Photography */}
          <div className="lg:col-span-6 relative rounded-2xl overflow-hidden group shadow-2xl border border-white/10">
            <img
              src="https://images.unsplash.com/photo-1544919982-b61976f0ba43?q=80&w=1200&auto=format&fit=crop"
              alt="Premium Sports Venue Architecture"
              referrerPolicy="no-referrer"
              className="w-full h-80 sm:h-96 object-cover object-center group-hover:scale-105 transition-transform duration-700 brightness-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050B17] via-transparent to-transparent"></div>

            <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-xl bg-slate-950/80 backdrop-blur-md border border-white/10 flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                {gorName} &bull; Arena Standar BWF
              </span>
              <span className="text-xs text-blue-400 font-mono font-bold">EST. 2024</span>
            </div>
          </div>

          {/* Right Column: Exact Requested Title & Copy */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Tentang Kami</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase leading-tight">
              MORE THAN JUST A COURT
            </h2>

            <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
              &ldquo;Tempat bermain badminton yang dirancang untuk memberikan pengalaman bermain yang nyaman, profesional dan menyenangkan.&rdquo;
            </p>

            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/10 text-center">
              <div className="p-3 rounded-2xl bg-slate-900/60 border border-white/5">
                <div className="text-xl sm:text-2xl font-black text-white">4</div>
                <div className="text-[11px] text-slate-400 uppercase font-semibold mt-0.5">Lapangan BWF</div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-900/60 border border-white/5">
                <div className="text-xl sm:text-2xl font-black text-blue-400">100%</div>
                <div className="text-[11px] text-slate-400 uppercase font-semibold mt-0.5">Vinyl Murni</div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-900/60 border border-white/5">
                <div className="text-xl sm:text-2xl font-black text-white">500+</div>
                <div className="text-[11px] text-slate-400 uppercase font-semibold mt-0.5">Lux Lighting</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

import React from 'react';
import { ShieldCheck, AlertCircle, Info, CheckCircle2 } from 'lucide-react';
import { BusinessSettings } from '../../types';

interface PublicBookingRulesProps {
  settings: BusinessSettings;
}

export const PublicBookingRules: React.FC<PublicBookingRulesProps> = ({ settings }) => {
  return (
    <section id="aturan-section" className="scroll-mt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl">
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Tata Tertib & Ketentuan</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Aturan Bermain & Ketentuan Booking
          </h2>
          <p className="mt-2 text-slate-400 text-sm sm:text-base">
            Mohon membaca dan menaati ketentuan di bawah demi kenyamanan bersama dan menjaga kualitas karpet lapangan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {settings.bookingRules.map((rule, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800 hover:border-emerald-500/40 transition-colors"
            >
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                {rule}
              </div>
            </div>
          ))}
        </div>

        {/* Important Footnote */}
        <div className="mt-6 p-4 rounded-2xl bg-emerald-950/30 border border-emerald-900/50 flex items-start gap-3 text-xs text-emerald-200/90">
          <AlertCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <span>
            <strong>Catatan Non-Marking Sole:</strong> Sepatu dengan tapak hitam atau bersol outdoor tidak diperkenankan menginjak karpet vinyl demi mencegah goresan permanen pada lapisan BWF. Terima kasih atas pengertiannya!
          </span>
        </div>
      </div>
    </section>
  );
};

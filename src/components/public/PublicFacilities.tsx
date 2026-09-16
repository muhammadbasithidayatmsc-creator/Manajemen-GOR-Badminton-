import React from 'react';
import {
  Sparkles,
  Car,
  Coffee,
  CheckCircle,
  Lightbulb,
} from 'lucide-react';

export const PublicFacilities: React.FC = () => {
  const facilities = [
    {
      id: 'court',
      emoji: '🏸',
      title: 'Premium Court',
      desc: 'Karpet vinyl BWF standar turnamen 5.0mm dengan daya cengkeram optimal dan peredam hentakan sendi.',
    },
    {
      id: 'lighting',
      emoji: '💡',
      title: 'Professional Lighting',
      desc: 'Lampu LED 500+ Lux anti-silau yang dipasang sejajar garis lapangan untuk visibilitas bola sempurna.',
    },
    {
      id: 'parking',
      emoji: '🚗',
      title: 'Parking',
      desc: 'Area parkir kendaraan roda dua dan roda empat luas, aman dengan pantauan CCTV 24 jam.',
    },
    {
      id: 'mushola',
      emoji: '🕌',
      title: 'Mushola',
      desc: 'Tempat ibadah nyaman, bersih, berpendingin udara dan dilengkapi tempat wudhu higienis.',
    },
    {
      id: 'shower',
      emoji: '🚿',
      title: 'Clean Facilities',
      desc: 'Kamar ganti, shower air bersih, dan toilet terawat yang dibersihkan secara rutin setiap hari.',
    },
    {
      id: 'waiting',
      emoji: '☕',
      title: 'Waiting Area',
      desc: 'Tribun santai dan kafetaria sejuk dengan aneka minuman dingin, snack energi, dan free Wi-Fi kencang.',
    },
  ];

  return (
    <section id="fasilitas-section" className="scroll-mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Kenyamanan & Layanan Maksimal</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase">
          Fasilitas Unggulan GOR
        </h2>
        <p className="mt-3 text-slate-300 text-sm sm:text-base leading-relaxed">
          Dirancang untuk memberikan standar kenyamanan tinggi bagi pemain profesional, komunitas, dan keluarga.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {facilities.map((fac) => (
          <div
            key={fac.id}
            className="bg-[#050B17]/95 border border-white/10 rounded-3xl p-6 hover:border-blue-500/50 hover:-translate-y-1 transition-all duration-300 shadow-xl shadow-slate-950/60 group"
          >
            <div className="text-3xl mb-4 w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              {fac.emoji}
            </div>
            <h3 className="text-lg font-black text-white group-hover:text-blue-400 transition-colors uppercase tracking-tight">
              {fac.title}
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed">
              {fac.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

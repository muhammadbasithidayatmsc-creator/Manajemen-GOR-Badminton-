import React from 'react';
import { Star, Quote, Sparkles } from 'lucide-react';

export const PublicTestimonials: React.FC = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Rian Ardianto',
      role: 'Ketua Komunitas Smash Mania',
      comment:
        'Kualitas karpet vinyl BWF di sini luar biasa empuk. Kaki tidak cepat pegal meski bermain 3 jam berturut-turut. Sistem bookingnya juga sangat cepat dan transparan.',
      rating: 5,
      avatar: 'RA',
    },
    {
      id: 2,
      name: 'Dr. Hendra Gunawan',
      role: 'Member Sparring Mingguan',
      comment:
        'Lampu LED-nya benar-benar anti-silau! Sangat nyaman untuk pemain yang mengenakan kacamata. Kamar mandinya bersih dan tempat parkirnya sangat aman.',
      rating: 5,
      avatar: 'HG',
    },
    {
      id: 3,
      name: 'Jessica Tan',
      role: 'Pemain Amatir & Konten Kreator',
      comment:
        'Desain GOR-nya modern dan estetik sekali. Proses cek jadwal live langsung di web tanpa perlu tanya-tanya manual ke admin membuat booking jadi effortless.',
      rating: 5,
      avatar: 'JT',
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Pengalaman Pemain Nyata</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase leading-tight">
          PLAYED. LOVED. RETURNED.
        </h2>
        <p className="mt-3 text-slate-300 text-sm sm:text-base leading-relaxed">
          Dipercaya oleh ribuan atlet amatir, komunitas klub, dan keluarga setiap minggunya.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((item) => (
          <div
            key={item.id}
            className="bg-[#050B17]/95 border border-white/10 rounded-3xl p-6 sm:p-7 hover:border-blue-500/40 transition-all duration-300 flex flex-col justify-between shadow-2xl shadow-slate-950/70 subtle-3d-card group"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <Quote className="w-6 h-6 text-slate-600 group-hover:text-blue-400 transition-colors" />
              </div>

              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed italic">
                &ldquo;{item.comment}&rdquo;
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-xs shadow-md shadow-blue-500/30">
                {item.avatar}
              </div>
              <div>
                <h4 className="text-sm font-black text-white">{item.name}</h4>
                <p className="text-[11px] text-slate-400">{item.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

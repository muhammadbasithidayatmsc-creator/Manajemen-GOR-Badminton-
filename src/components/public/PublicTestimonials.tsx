import React from 'react';
import { Star, MessageSquare, Quote, UserCheck } from 'lucide-react';

export const PublicTestimonials: React.FC = () => {
  const reviews = [
    {
      name: 'Budi Santoso',
      role: 'Kapten Komunitas PB Rawamangun',
      comment:
        'Karpet vinylnya luar biasa empuk, lutut ga gampang sakit meski main 3 set berturut-turut. Lampunya juga pas banget, ga silau pas mau smash atau angkat lob!',
      rating: 5,
      frequency: 'Main rutin tiap Selasa malam',
    },
    {
      name: 'Rian Ardianto',
      role: 'Pemain Sparring Antar Klub',
      comment:
        'Sistem booking via WhatsApp sangat responsif dan transparan. Jadwal di website beneran real-time jadi ga pernah kejadian double booking atau rebutan lapangan.',
      rating: 5,
      frequency: 'Member mingguan Court 1',
    },
    {
      name: 'Dewi Lestari',
      role: 'Member Weekend Badminton Club',
      comment:
        'Fasilitas toilet & shower bersih banget, kantin juga lengkap ada minuman dingin dan shuttlecock. Tempat parkir luas dan aman. Sangat recommended buat main bareng teman kantor.',
      rating: 5,
      frequency: 'Main tiap Sabtu sore',
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
          <Star className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" />
          <span>Testimoni Komunitas</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Apa Kata Pemain & Atlet Kami?
        </h2>
        <p className="mt-2 text-slate-400 text-sm sm:text-base">
          Pengalaman nyata dari komunitas badminton yang berlatih dan bertanding setiap pekan.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.map((rev, idx) => (
          <div
            key={idx}
            className="bg-slate-900 border border-slate-800 hover:border-emerald-500/40 p-6 rounded-3xl flex flex-col justify-between transition-all shadow-lg"
          >
            <div>
              {/* Stars */}
              <div className="flex items-center gap-1 mb-4 text-amber-400">
                {[...Array(rev.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Quote text */}
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic">
                "{rev.comment}"
              </p>
            </div>

            <div className="pt-5 mt-5 border-t border-slate-800 flex items-center justify-between">
              <div>
                <div className="font-extrabold text-white text-sm flex items-center gap-1.5">
                  <span>{rev.name}</span>
                  <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div className="text-[11px] text-emerald-400/90 font-medium">{rev.role}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">{rev.frequency}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

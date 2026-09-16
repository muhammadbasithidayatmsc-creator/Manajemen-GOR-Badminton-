import React from 'react';
import {
  Sparkles,
  Shield,
  Coffee,
  Car,
  Wifi,
  Droplets,
  HeartHandshake,
  CheckCircle,
  Zap,
} from 'lucide-react';
import { BusinessSettings } from '../../types';

interface PublicFacilitiesProps {
  settings: BusinessSettings;
}

export const PublicFacilities: React.FC<PublicFacilitiesProps> = ({ settings }) => {
  const facilityItems = [
    {
      icon: <Zap className="w-5 h-5 text-emerald-400" />,
      title: 'Karpet Vinyl BWF 5.0mm',
      desc: 'Permukaan berstandar internasional yang meredam benturan pada lutut dan pergelangan kaki.',
    },
    {
      icon: <Sparkles className="w-5 h-5 text-emerald-400" />,
      title: 'Pencahayaan LED 500+ Lux',
      desc: 'Lampu LED anti-silau dipasang simetris agar visibilitas shuttlecock tetap tajam di setiap sudut.',
    },
    {
      icon: <Droplets className="w-5 h-5 text-emerald-400" />,
      title: 'Kamar Mandi & Ruang Ganti Bersih',
      desc: 'Fasilitas shower dan ruang bilas yang wangi, dibersihkan berkala setiap hari.',
    },
    {
      icon: <Coffee className="w-5 h-5 text-emerald-400" />,
      title: 'Kantin Minuman & Kok',
      desc: 'Menyediakan aneka minuman isotonik dingin, air mineral, serta shuttlecock turnamen original.',
    },
    {
      icon: <HeartHandshake className="w-5 h-5 text-emerald-400" />,
      title: 'Musholla & Ruang Tunggu Luas',
      desc: 'Tempat ibadah nyaman lengkap dengan sarana wudhu, serta tribun santai bagi penonton.',
    },
    {
      icon: <Car className="w-5 h-5 text-emerald-400" />,
      title: 'Parkir Mobil & Motor Luas',
      desc: 'Area parkir aman 24 jam dengan petugas keamanan dan kamera CCTV pengawas.',
    },
    {
      icon: <Wifi className="w-5 h-5 text-emerald-400" />,
      title: 'Free High-Speed Wi-Fi',
      desc: 'Koneksi internet cepat untuk pengunjung, live streaming pertandingan, dan rekan sparring.',
    },
    {
      icon: <Shield className="w-5 h-5 text-emerald-400" />,
      title: 'Sewa Raket & Gripping Service',
      desc: 'Tersedia rental raket badminton siap pakai dan layanan ganti grip raket langsung di tempat.',
    },
  ];

  return (
    <section id="fasilitas-section" className="scroll-mt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Kenyamanan Bermain</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Fasilitas Lengkap & Modern
          </h2>
          <p className="mt-3 text-slate-400 text-sm sm:text-base">
            Dirancang khusus untuk mendukung performa atlet badminton, komunitas klub, maupun keluarga yang ingin berolahraga dengan nyaman.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {facilityItems.map((item, index) => (
            <div
              key={index}
              className="bg-slate-950/80 border border-slate-800 hover:border-emerald-500/40 p-5 rounded-2xl flex flex-col justify-between transition-all hover:translate-y-[-2px]"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-3">
                  {item.icon}
                </div>
                <h3 className="text-base font-black text-white mb-1.5">{item.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

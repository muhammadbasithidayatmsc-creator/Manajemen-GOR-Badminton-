import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Sparkles } from 'lucide-react';

export const PublicFaq: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Bagaimana cara booking lapangan di website ini?',
      a: 'Pilih tanggal bermain pada strip tanggal, tentukan lapangan dan sesi jam yang berstatus "Tersedia". Isi nama dan nomor WhatsApp Anda, lalu klik "Kirim Booking via WhatsApp". Sistem kami akan langsung membuka WhatsApp resmi admin GOR dengan rincian jadwal yang telah terformat rapi.',
    },
    {
      q: 'Berapa nominal uang muka (DP) dan bagaimana cara pembayarannya?',
      a: 'Uang muka (DP) minimal adalah 50% dari total biaya sewa untuk mengunci slot jadwal Anda. Pembayaran DP ditransfer manual ke rekening resmi BCA / Mandiri yang tertera, lalu kirimkan bukti transfer ke WhatsApp admin kami. Pelunasan sisa tagihan dilakukan di meja resepsionis saat Anda datang bermain.',
    },
    {
      q: 'Bisakah menyewa sebagai member rutin mingguan atau bulanan?',
      a: 'Sangat bisa! Kami menyediakan paket sewa rutin mingguan untuk komunitas atau instansi dengan slot jam tetap. Silakan hubungi admin via WhatsApp untuk mendiskusikan ketersediaan jadwal rutin dan penawaran khusus member.',
    },
    {
      q: 'Apakah tersedia fasilitas sewa raket dan penjualan shuttlecock?',
      a: 'Ya, kami menyediakan persewaan raket badminton original siap pakai dengan senar prima di meja kasir. Kami juga menjual shuttlecock berkualitas (Yonex, Samurai, dsb) serta grip raket dan minuman dingin.',
    },
    {
      q: 'Bagaimana kebijakan jika ingin melakukan reschedule atau pembatalan?',
      a: 'Perubahan jadwal (reschedule) dapat dilakukan maksimal H-1 sebelum sesi bermain dimulai, tergantung ketersediaan slot lain. Untuk pembatalan mendadak pada hari H, DP yang telah dibayarkan tidak dapat dikembalikan.',
    },
    {
      q: 'Apakah area parkir aman dan memadai untuk mobil?',
      a: 'Area parkir kami sangat luas, mampu menampung puluhan mobil dan motor secara leluasa. Keamanan terjaga dengan petugas parkir dan pengawasan CCTV 24 jam. Parkir gratis bagi pemain terdaftar.',
    },
  ];

  const toggleFaq = (index: number) => {
    setOpenIdx(openIdx === index ? null : index);
  };

  return (
    <section id="faq-section" className="scroll-mt-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Bantuan & Informasi</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Pertanyaan yang Sering Diajukan (FAQ)
        </h2>
        <p className="mt-2 text-slate-400 text-sm sm:text-base">
          Temukan jawaban cepat seputar operasional, tata cara sewa, dan fasilitas GOR.
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className={`rounded-2xl border transition-all overflow-hidden ${
                isOpen
                  ? 'bg-slate-900 border-emerald-500/50 shadow-lg'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full py-4 px-5 text-left flex items-center justify-between gap-4 cursor-pointer"
              >
                <span className="font-extrabold text-sm sm:text-base text-white">
                  {faq.q}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-emerald-400 transition-transform duration-200 shrink-0 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/80">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

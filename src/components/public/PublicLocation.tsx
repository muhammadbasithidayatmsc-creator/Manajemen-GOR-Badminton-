import React from 'react';
import { MapPin, Clock, Phone, ExternalLink, MessageCircle, Navigation } from 'lucide-react';
import { BusinessSettings } from '../../types';
import { generateDirectInquiryWhatsAppUrl } from '../../utils/whatsapp';

interface PublicLocationProps {
  settings: BusinessSettings;
}

export const PublicLocation: React.FC<PublicLocationProps> = ({ settings }) => {
  const gorName = settings.gorName || settings.name || 'GOR Badminton Arena';
  const waUrl = generateDirectInquiryWhatsAppUrl(settings);
  const mapsUrl = settings.googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${gorName} ${settings.address}`)}`;

  return (
    <section id="lokasi-section" className="scroll-mt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Info Details */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <MapPin className="w-3.5 h-3.5" />
              <span>Akses Mudah & Strategis</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Lokasi & Jam Operasional
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              GOR berlokasi di area strategis dengan akses jalan lebar, mudah dijangkau kendaraan roda dua maupun roda empat, serta dekat dengan pusat kuliner dan minimarket.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3.5 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Alamat Lengkap</div>
                  <div className="text-sm font-semibold text-white mt-0.5">{settings.address}</div>
                </div>
              </div>

              <div className="flex items-start gap-3.5 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Jam Operasional</div>
                  <div className="text-sm font-semibold text-white mt-0.5">{settings.operatingHours}</div>
                </div>
              </div>

              <div className="flex items-start gap-3.5 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">WhatsApp Admin Resmi</div>
                  <div className="text-sm font-semibold text-white mt-0.5 font-mono">+{settings.adminWhatsApp}</div>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-md cursor-pointer"
              >
                <Navigation className="w-4 h-4" />
                <span>Buka di Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all border border-slate-700 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>Chat Admin WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Graphic Map Card Representation */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between min-h-[320px]">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Peta & Navigasi</span>
                <span className="text-[11px] bg-emerald-500/20 text-emerald-300 font-semibold px-2 py-0.5 rounded">Rute Mudah</span>
              </div>
              <h3 className="text-lg font-black text-white">{gorName}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Tersedia petunjuk arah langsung ke lokasi GOR melalui navigasi GPS Google Maps atau Waze.
              </p>
            </div>

            {/* Visual map styled card */}
            <div className="my-6 p-4 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-2">
              <MapPin className="w-8 h-8 text-emerald-400 mx-auto animate-bounce" />
              <div className="text-xs font-bold text-white">Petunjuk Parkir</div>
              <div className="text-[11px] text-slate-400">
                Pintu masuk utama untuk mobil & motor berada di sisi timur gedung. Parkir gratis bagi pemain terdaftar.
              </div>
            </div>

            <div className="text-[11px] text-slate-500 text-center">
              Perlu konfirmasi ketersediaan parkir rombongan? Hubungi tim keamanan kami via WhatsApp.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

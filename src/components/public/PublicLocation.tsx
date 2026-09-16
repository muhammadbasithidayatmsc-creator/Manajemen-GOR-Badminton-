import React from 'react';
import { MapPin, Navigation, Phone, Sparkles, ExternalLink, Clock } from 'lucide-react';
import { BusinessSettings } from '../../types';

interface PublicLocationProps {
  settings: BusinessSettings;
}

export const PublicLocation: React.FC<PublicLocationProps> = ({ settings }) => {
  const gorName = settings.gorName || settings.name || 'GOR Badminton Arena';
  const encodedAddress = encodeURIComponent(settings.address || 'GOR Badminton');
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
  const whatsappUrl = `https://wa.me/${settings.adminWhatsApp}?text=Halo%20Admin%20${encodeURIComponent(gorName)},%20mohon%20info%20petunjuk%20arah%20dan%20lokasi%20lapangan.`;

  return (
    <section id="lokasi-section" className="scroll-mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="bg-[#050B17]/95 border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl shadow-slate-950/80">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Details */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wider">
              <MapPin className="w-3.5 h-3.5" />
              <span>Lokasi Strategis & Akses Mudah</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase">
              Kunjungi Arena Kami
            </h2>

            <div className="space-y-4 text-sm text-slate-300">
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-900/60 border border-white/5">
                <MapPin className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs text-slate-400 uppercase font-bold">Alamat Resmi</div>
                  <div className="text-sm sm:text-base font-semibold text-white mt-1">
                    {settings.address}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-900/60 border border-white/5">
                <Clock className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs text-slate-400 uppercase font-bold">Jam Operasional</div>
                  <div className="text-sm sm:text-base font-semibold text-white mt-1">
                    {settings.operatingHours} (Setiap Hari)
                  </div>
                </div>
              </div>
            </div>

            {/* Requested Buttons: Google Maps button & WhatsApp button */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Navigation className="w-4 h-4 text-blue-200" />
                <span>Buka Google Maps</span>
                <ExternalLink className="w-3 h-3 opacity-70" />
              </a>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider border border-white/10 hover:border-emerald-500/50 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>WhatsApp Admin (+{settings.adminWhatsApp})</span>
              </a>
            </div>
          </div>

          {/* Right Map Visual Placeholder / Realistic Card */}
          <div className="lg:col-span-5 relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl h-72 lg:h-80 group">
            <img
              src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=800&auto=format&fit=crop"
              alt="City Map & Navigation"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-75"
            />
            <div className="absolute inset-0 bg-blue-950/30 backdrop-blur-[2px]"></div>
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-white">
              <div className="w-14 h-14 rounded-2xl bg-blue-600/90 shadow-xl shadow-blue-600/40 flex items-center justify-center mb-3 animate-bounce">
                <MapPin className="w-7 h-7 text-white" />
              </div>
              <div className="text-base font-black uppercase tracking-wider">{gorName}</div>
              <div className="text-xs text-slate-300 mt-1 max-w-xs">{settings.address}</div>
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 px-4 py-2 rounded-lg bg-white/15 hover:bg-white/25 backdrop-blur-md text-xs font-bold text-white transition-all inline-flex items-center gap-1.5"
              >
                <span>Lihat Navigasi Rute</span>
                <Navigation className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

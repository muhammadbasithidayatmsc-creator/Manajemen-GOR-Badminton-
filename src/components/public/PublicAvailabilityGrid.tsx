import React, { useMemo } from 'react';
import {
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  Sparkles,
} from 'lucide-react';
import { Booking, Court, TimeSlot } from '../../types';

interface PublicAvailabilityGridProps {
  selectedDate: string;
  selectedCourtId: string;
  courts: Court[];
  timeSlots: TimeSlot[];
  bookings: Booking[];
  onSelectSlotToBook: (courtId: string, timeSlotId: string) => void;
}

export const PublicAvailabilityGrid: React.FC<PublicAvailabilityGridProps> = ({
  selectedDate,
  selectedCourtId,
  courts,
  timeSlots,
  bookings,
  onSelectSlotToBook,
}) => {
  // Courts to display (active or maintenance)
  const displayCourts = useMemo(() => {
    const list = courts;
    if (selectedCourtId === 'ALL') return list;
    return list.filter((c) => c.id === selectedCourtId);
  }, [courts, selectedCourtId]);

  // Active time slots sorted
  const activeSlots = useMemo(() => {
    return timeSlots.filter((s) => s.active).sort((a, b) => a.sortOrder - b.sortOrder);
  }, [timeSlots]);

  // Format date in Indonesian
  const formattedIndoDate = useMemo(() => {
    try {
      const [y, m, d] = selectedDate.split('-').map(Number);
      const date = new Date(y, m - 1, d);
      return date.toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return selectedDate;
    }
  }, [selectedDate]);

  return (
    <section id="jadwal-section" className="scroll-mt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
        {/* Header & Date Indicator */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Real-Time Matrix • Langsung Sinkron Database</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Jadwal & Ketersediaan Lapangan
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Menampilkan status live untuk <span className="text-emerald-400 font-bold">{formattedIndoDate}</span>
            </p>
          </div>

          {/* Status Legends */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div className="flex items-center gap-2 bg-emerald-950/60 border border-emerald-800/60 px-3 py-1.5 rounded-xl text-emerald-300 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
              <span>Tersedia (Bisa Diklik)</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700 px-3 py-1.5 rounded-xl text-slate-400 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              <span>Terisi / Booked</span>
            </div>
            <div className="flex items-center gap-2 bg-amber-950/40 border border-amber-800/40 px-3 py-1.5 rounded-xl text-amber-300 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
              <span>Maintenance</span>
            </div>
          </div>
        </div>

        {/* Live Interactive Matrix Table */}
        <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950">
          <table className="w-full text-left border-collapse min-w-[650px]">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/90 text-xs font-black uppercase text-slate-300 tracking-wider">
                <th className="py-4 px-4 w-36 sm:w-44 text-slate-400 border-r border-slate-800">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Sesi Jam</span>
                  </div>
                </th>
                {displayCourts.map((court) => (
                  <th key={court.id} className="py-4 px-4 text-center border-r border-slate-800 last:border-r-0">
                    <div className="font-extrabold text-white text-sm">{court.name}</div>
                    <div className="text-[11px] font-normal text-emerald-400/90 lowercase mt-0.5">
                      {court.surfaceType || 'Vinyl BWF 5.0mm'}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70 text-xs font-medium">
              {activeSlots.map((slot) => (
                <tr key={slot.id} className="hover:bg-slate-900/40 transition-colors">
                  {/* Time Slot Header */}
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-300 border-r border-slate-800 bg-slate-900/30 whitespace-nowrap">
                    {slot.label}
                  </td>

                  {/* Courts Columns */}
                  {displayCourts.map((court) => {
                    const isCourtMaintenance = court.status === 'MAINTENANCE';
                    const activeBooking = bookings.find(
                      (b) =>
                        b.date === selectedDate &&
                        b.courtId === court.id &&
                        b.timeSlotId === slot.id &&
                        b.bookingStatus !== 'CANCELLED'
                    );

                    if (isCourtMaintenance) {
                      return (
                        <td key={court.id} className="p-2 border-r border-slate-800 last:border-r-0 text-center">
                          <div className="py-2.5 px-3 rounded-xl bg-amber-950/20 border border-amber-900/30 text-amber-400 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-not-allowed">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span>Maintenance</span>
                          </div>
                        </td>
                      );
                    }

                    if (activeBooking) {
                      return (
                        <td key={court.id} className="p-2 border-r border-slate-800 last:border-r-0 text-center">
                          <div
                            title="Slot sudah dipesan oleh pemain lain"
                            className="py-2.5 px-3 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-400 text-xs font-bold flex items-center justify-center gap-1.5 cursor-not-allowed select-none opacity-80"
                          >
                            <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                            <span>Terisi</span>
                          </div>
                        </td>
                      );
                    }

                    return (
                      <td key={court.id} className="p-2 border-r border-slate-800 last:border-r-0 text-center">
                        <button
                          onClick={() => onSelectSlotToBook(court.id, slot.id)}
                          title={`Klik untuk booking ${court.name} sesi ${slot.label}`}
                          className="w-full py-2.5 px-3 rounded-xl bg-emerald-950/40 hover:bg-emerald-600 border border-emerald-700/50 hover:border-emerald-400 text-emerald-300 hover:text-slate-950 text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs hover:shadow-md hover:scale-[1.02] active:scale-[0.98] cursor-pointer group"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 group-hover:text-slate-950 shrink-0" />
                          <span>Tersedia</span>
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Tip Box */}
        <div className="mt-4 flex items-center gap-2 text-xs text-slate-400 bg-slate-950/50 p-3 rounded-xl border border-slate-800/80">
          <Info className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            Pilih kotak berlabel <strong className="text-emerald-400">"Tersedia"</strong> untuk langsung membuka formulir booking dan konfirmasi via WhatsApp resmi GOR.
          </span>
        </div>
      </div>
    </section>
  );
};

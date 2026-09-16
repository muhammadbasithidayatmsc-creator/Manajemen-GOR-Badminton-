import React, { useMemo } from 'react';
import {
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Sparkles,
  ArrowRight,
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
    <section id="jadwal-section" className="scroll-mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="bg-[#050B17]/95 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-slate-950/80">
        {/* Header Section: Exact Requested Title */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Real-Time Matrix • Live Database</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight uppercase">
              CEK KETERSEDIAAN LAPANGAN
            </h2>
            <p className="mt-1.5 text-sm text-slate-300">
              Menampilkan status live untuk{' '}
              <span className="text-blue-400 font-bold">{formattedIndoDate}</span>
            </p>
          </div>

          {/* Status Legends: AVAILABLE (Hijau), BOOKED (Red/Muted), MAINTENANCE (Gray) */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 text-xs">
            <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-xl text-emerald-400 font-bold shadow-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>AVAILABLE (Bisa Dipesan)</span>
            </div>
            <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/30 px-3 py-1.5 rounded-xl text-rose-400 font-semibold shadow-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              <span>BOOKED (Terisi)</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700 px-3 py-1.5 rounded-xl text-slate-400 font-semibold shadow-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-500"></span>
              <span>MAINTENANCE</span>
            </div>
          </div>
        </div>

        {/* Live Interactive Grid Table */}
        <div className="mt-6 overflow-x-auto rounded-2xl border border-white/10 bg-slate-950/90">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-white/10 bg-slate-900/90 text-xs font-black uppercase text-slate-300 tracking-wider">
                <th className="py-4 px-4 w-40 sm:w-48 text-slate-400 border-r border-white/10">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-blue-400" />
                    <span>Sesi Jam</span>
                  </div>
                </th>
                {displayCourts.map((court) => (
                  <th key={court.id} className="py-4 px-4 text-center border-r border-white/10 last:border-r-0">
                    <div className="font-extrabold text-white text-sm">{court.name}</div>
                    <div className="text-[11px] text-blue-400 font-mono font-normal">
                      {court.status === 'MAINTENANCE' ? (
                        <span className="text-slate-400 font-semibold">Sedang Perawatan</span>
                      ) : (
                        `Rp ${court.hourlyRate.toLocaleString('id-ID')}/jam`
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs">
              {activeSlots.map((slot) => (
                <tr key={slot.id} className="hover:bg-slate-900/40 transition-colors">
                  {/* Time Slot Column */}
                  <td className="py-3 px-4 font-mono font-bold text-slate-300 border-r border-white/10 bg-slate-900/30">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                      <span>{slot.label}</span>
                    </div>
                  </td>

                  {/* Court Availability Cells */}
                  {displayCourts.map((court) => {
                    const isCourtMaintenance = court.status === 'MAINTENANCE';

                    // Find if booked
                    const existingBooking = bookings.find(
                      (b) =>
                        b.date === selectedDate &&
                        b.courtId === court.id &&
                        b.timeSlotId === slot.id &&
                        b.bookingStatus !== 'CANCELLED'
                    );

                    if (isCourtMaintenance) {
                      return (
                        <td key={court.id} className="py-2.5 px-3 text-center border-r border-white/10 last:border-r-0">
                          <div className="py-2 px-3 rounded-xl bg-slate-900/90 border border-slate-700/60 text-slate-400 font-semibold text-[11px] flex items-center justify-center gap-1.5">
                            <AlertTriangle className="w-3.5 h-3.5 text-slate-400" />
                            <span>MAINTENANCE</span>
                          </div>
                        </td>
                      );
                    }

                    if (existingBooking) {
                      return (
                        <td key={court.id} className="py-2.5 px-3 text-center border-r border-white/10 last:border-r-0">
                          <div className="py-2 px-3 rounded-xl bg-rose-950/40 border border-rose-900/50 text-rose-300 font-semibold text-[11px] flex items-center justify-center gap-1.5">
                            <XCircle className="w-3.5 h-3.5 text-rose-400" />
                            <span>BOOKED</span>
                          </div>
                        </td>
                      );
                    }

                    // Available Slot
                    return (
                      <td key={court.id} className="py-2.5 px-3 text-center border-r border-white/10 last:border-r-0">
                        <button
                          type="button"
                          onClick={() => onSelectSlotToBook(court.id, slot.id)}
                          className="w-full py-2 px-3 rounded-xl bg-emerald-950/60 hover:bg-emerald-600 hover:text-slate-950 text-emerald-300 font-black text-[11px] border border-emerald-500/40 hover:border-emerald-400 hover:shadow-lg hover:shadow-emerald-500/20 hover:scale-[1.03] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer group"
                          title="Klik untuk langsung booking sesi ini"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 group-hover:text-slate-950 transition-colors" />
                          <span>AVAILABLE</span>
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer tip */}
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 pt-2">
          <span>
            💡 Tips: Klik tombol <strong className="text-emerald-400">AVAILABLE</strong> pada lapangan dan jam yang diinginkan untuk membuka formulir booking instan.
          </span>
          <span className="text-blue-400 font-semibold">
            Status diperbarui secara langsung (Live Sync)
          </span>
        </div>
      </div>
    </section>
  );
};

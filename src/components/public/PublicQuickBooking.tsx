import React, { useMemo } from 'react';
import { Calendar, ChevronRight, Filter, Sparkles, CheckCircle, Clock } from 'lucide-react';
import { Court, TimeSlot, Booking } from '../../types';
import { getTodayString } from '../../services/store';

interface PublicQuickBookingProps {
  selectedDate: string;
  onSelectDate: (date: string) => void;
  selectedCourtId: string;
  onSelectCourtId: (courtId: string) => void;
  courts: Court[];
  timeSlots: TimeSlot[];
  bookings: Booking[];
  onOpenBookingModal: () => void;
}

export const PublicQuickBooking: React.FC<PublicQuickBookingProps> = ({
  selectedDate,
  onSelectDate,
  selectedCourtId,
  onSelectCourtId,
  courts,
  timeSlots,
  bookings,
  onOpenBookingModal,
}) => {
  // Generate next 10 days for date strip
  const dateOptions = useMemo(() => {
    const list = [];
    for (let i = 0; i < 10; i++) {
      const dateStr = getTodayString(i);
      const [y, m, d] = dateStr.split('-').map(Number);
      const dateObj = new Date(y, m - 1, d);

      const dayName = i === 0 ? 'Hari Ini' : i === 1 ? 'Besok' : dateObj.toLocaleDateString('id-ID', { weekday: 'short' });
      const dayNum = dateObj.getDate();
      const monthName = dateObj.toLocaleDateString('id-ID', { month: 'short' });

      list.push({
        dateStr,
        dayName,
        dayNum,
        monthName,
        isToday: i === 0,
      });
    }
    return list;
  }, []);

  const activeCourts = useMemo(() => courts.filter((c) => c.status === 'ACTIVE'), [courts]);
  const activeSlots = useMemo(() => timeSlots.filter((s) => s.active), [timeSlots]);

  // Calculate remaining available slots for selected date
  const availableSlotsCount = useMemo(() => {
    let count = 0;
    const courtsToInspect = selectedCourtId === 'ALL'
      ? activeCourts
      : activeCourts.filter((c) => c.id === selectedCourtId);

    for (const court of courtsToInspect) {
      for (const slot of activeSlots) {
        const isBooked = bookings.some(
          (b) =>
            b.date === selectedDate &&
            b.courtId === court.id &&
            b.timeSlotId === slot.id &&
            b.bookingStatus !== 'CANCELLED'
        );
        if (!isBooked) count++;
      }
    }
    return count;
  }, [selectedDate, selectedCourtId, activeCourts, activeSlots, bookings]);

  return (
    <div className="relative -mt-8 sm:-mt-10 z-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-2xl shadow-slate-950/80">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              Quick Date Strip & Ketersediaan
            </span>
            <h2 className="text-lg sm:text-xl font-black text-white">
              Pilih Tanggal Bermain
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-emerald-950/60 border border-emerald-800/50 px-3.5 py-1.5 rounded-xl text-xs font-bold text-emerald-300">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>{availableSlotsCount} Slot Tersedia</span>
            </div>

            <button
              onClick={onOpenBookingModal}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs uppercase tracking-wider shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Booking</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Date Strip - Horizontal scrollable on mobile */}
        <div className="pt-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none scroll-smooth">
            {dateOptions.map((item) => {
              const isSelected = selectedDate === item.dateStr;
              return (
                <button
                  key={item.dateStr}
                  onClick={() => onSelectDate(item.dateStr)}
                  className={`shrink-0 flex flex-col items-center justify-center min-w-[76px] sm:min-w-[88px] py-2.5 px-3 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-b from-emerald-600 to-teal-700 border-emerald-400 text-white shadow-lg shadow-emerald-900/50 scale-105'
                      : 'bg-slate-950/60 hover:bg-slate-800 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span
                    className={`text-[11px] font-bold uppercase tracking-wider ${
                      isSelected ? 'text-emerald-100' : 'text-slate-400'
                    }`}
                  >
                    {item.dayName}
                  </span>
                  <span className="text-xl sm:text-2xl font-black mt-0.5 leading-none text-white">
                    {item.dayNum}
                  </span>
                  <span
                    className={`text-[10px] font-medium uppercase mt-0.5 ${
                      isSelected ? 'text-emerald-200' : 'text-slate-500'
                    }`}
                  >
                    {item.monthName}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Court Filter Tabs */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto">
            <span className="text-xs text-slate-400 font-bold uppercase flex items-center gap-1 shrink-0">
              <Filter className="w-3.5 h-3.5 text-emerald-400" />
              Filter:
            </span>
            <button
              onClick={() => onSelectCourtId('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                selectedCourtId === 'ALL'
                  ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-300'
                  : 'bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-slate-400'
              }`}
            >
              Semua Lapangan
            </button>
            {activeCourts.map((c) => (
              <button
                key={c.id}
                onClick={() => onSelectCourtId(c.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shrink-0 ${
                  selectedCourtId === c.id
                    ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-300'
                    : 'bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-slate-400'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>

          <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <Clock className="w-3 h-3 text-emerald-400" />
            <span>Klik slot pada tabel di bawah untuk langsung booking</span>
          </div>
        </div>
      </div>
    </div>
  );
};

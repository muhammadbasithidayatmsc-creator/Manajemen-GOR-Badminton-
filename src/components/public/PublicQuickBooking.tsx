import React, { useMemo, useState } from 'react';
import {
  Calendar,
  Clock,
  Sparkles,
  CheckCircle,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { Court, TimeSlot, Booking } from '../../types';
import { getTodayString, isSlotOccupiedByBooking } from '../../services/store';

interface PublicQuickBookingProps {
  selectedDate: string;
  onSelectDate: (date: string) => void;
  selectedCourtId: string;
  onSelectCourtId: (courtId: string) => void;
  courts: Court[];
  timeSlots: TimeSlot[];
  bookings: Booking[];
  onOpenBookingModal: (params?: {
    initialDate?: string;
    initialCourtId?: string;
    initialSlotId?: string;
  }) => void;
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
  // Local selection for time slot in the quick widget
  const [selectedSlotId, setSelectedSlotId] = useState<string>('');

  // Generate next 7 days for quick date selector
  const dateOptions = useMemo(() => {
    const list = [];
    for (let i = 0; i < 7; i++) {
      const dateStr = getTodayString(i);
      const [y, m, d] = dateStr.split('-').map(Number);
      const dateObj = new Date(y, m - 1, d);

      const dayName =
        i === 0 ? 'Hari Ini' : i === 1 ? 'Besok' : dateObj.toLocaleDateString('id-ID', { weekday: 'short' });
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
  const activeSlots = useMemo(
    () => timeSlots.filter((s) => s.active).sort((a, b) => a.sortOrder - b.sortOrder),
    [timeSlots]
  );

  // Calculate remaining available slots for selected date
  const availableSlotsCount = useMemo(() => {
    let count = 0;
    const courtsToInspect =
      selectedCourtId === 'ALL'
        ? activeCourts
        : activeCourts.filter((c) => c.id === selectedCourtId);

    for (const court of courtsToInspect) {
      for (const slot of activeSlots) {
        const isBooked = bookings.some(
          (b) =>
            b.date === selectedDate &&
            b.courtId === court.id &&
            isSlotOccupiedByBooking(slot, b, timeSlots)
        );
        if (!isBooked) count++;
      }
    }
    return count;
  }, [selectedDate, selectedCourtId, activeCourts, activeSlots, bookings]);

  // Handle widget submission
  const handleWidgetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onOpenBookingModal({
      initialDate: selectedDate,
      initialCourtId: selectedCourtId !== 'ALL' ? selectedCourtId : undefined,
      initialSlotId: selectedSlotId || undefined,
    });
  };

  return (
    <div className="relative -mt-10 sm:-mt-12 z-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* 3D Elevated Luxury Widget Card */}
      <div className="relative rounded-3xl p-1 bg-gradient-to-r from-blue-600/30 via-indigo-600/20 to-purple-600/30 shadow-2xl shadow-slate-950/90">
        <div className="bg-[#050B17]/95 backdrop-blur-2xl border border-white/10 rounded-[22px] p-5 sm:p-7">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-black text-white tracking-tight uppercase">
                  BOOK YOUR COURT
                </h2>
                <p className="text-xs text-slate-400">
                  Pilih jadwal instan dengan verifikasi ketersediaan real-time
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>{availableSlotsCount} Slot Tersedia</span>
              </div>
            </div>
          </div>

          {/* Form Structure with 3 Inputs: Tanggal, Lapangan, Jam + CTA Button */}
          <form onSubmit={handleWidgetSubmit} className="mt-6 space-y-6">
            {/* 1. Date Selection Strip */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-blue-400" />
                  <span>1. Pilih Tanggal</span>
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  min={getTodayString(0)}
                  onChange={(e) => onSelectDate(e.target.value)}
                  className="bg-slate-900 border border-white/10 text-white text-xs px-2.5 py-1 rounded-lg focus:outline-hidden focus:border-blue-500 cursor-pointer"
                />
              </div>

              {/* Horizontal Date Pills */}
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 overflow-x-auto pb-1">
                {dateOptions.map((opt) => {
                  const isSelected = selectedDate === opt.dateStr;
                  return (
                    <button
                      key={opt.dateStr}
                      type="button"
                      onClick={() => onSelectDate(opt.dateStr)}
                      className={`p-2.5 rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer text-center ${
                        isSelected
                          ? 'bg-gradient-to-b from-blue-600 to-indigo-600 text-white font-black shadow-lg shadow-blue-600/30 scale-[1.02] border border-blue-400/40'
                          : 'bg-slate-900/90 border border-white/5 text-slate-300 hover:bg-slate-800 hover:text-white hover:border-white/15'
                      }`}
                    >
                      <span className={`text-[10px] uppercase tracking-wider ${isSelected ? 'text-blue-100 font-bold' : 'text-slate-400'}`}>
                        {opt.dayName}
                      </span>
                      <span className="text-lg font-black my-0.5 leading-none">
                        {opt.dayNum}
                      </span>
                      <span className={`text-[9px] uppercase ${isSelected ? 'text-blue-200' : 'text-slate-400'}`}>
                        {opt.monthName}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2 & 3: Court & Time Slot Picker Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Court Picker */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <span className="text-blue-400 font-mono">🏸</span>
                  <span>2. Pilih Lapangan</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => onSelectCourtId('ALL')}
                    className={`p-2.5 rounded-xl text-xs font-bold transition-all text-left flex items-center justify-between cursor-pointer ${
                      selectedCourtId === 'ALL'
                        ? 'bg-blue-600 text-white border border-blue-400 shadow-md shadow-blue-600/30'
                        : 'bg-slate-900 border border-white/5 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span>Semua Lapangan</span>
                    <span className="text-[10px] opacity-80">({activeCourts.length})</span>
                  </button>

                  {activeCourts.map((court) => {
                    const isSelected = selectedCourtId === court.id;
                    return (
                      <button
                        key={court.id}
                        type="button"
                        onClick={() => onSelectCourtId(court.id)}
                        className={`p-2.5 rounded-xl text-xs font-bold transition-all text-left flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? 'bg-blue-600 text-white border border-blue-400 shadow-md shadow-blue-600/30'
                            : 'bg-slate-900 border border-white/5 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <span className="truncate">{court.name}</span>
                        <span className="text-[10px] text-blue-300 font-mono shrink-0 ml-1">
                          {court.code}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time Slot Picker */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-blue-400" />
                  <span>3. Pilih Jam Bermain (Opsional)</span>
                </label>
                <div className="relative">
                  <select
                    value={selectedSlotId}
                    onChange={(e) => setSelectedSlotId(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 text-slate-200 text-xs sm:text-sm rounded-xl p-3 focus:outline-hidden focus:border-blue-500 cursor-pointer"
                  >
                    <option value="">-- Pilih Jam / Sesi Bermain --</option>
                    {activeSlots.map((slot) => (
                      <option key={slot.id} value={slot.id}>
                        {slot.label} WIB
                      </option>
                    ))}
                  </select>
                </div>
                <p className="text-[11px] text-slate-400 mt-1.5">
                  Anda juga dapat memilih langsung pada tabel ketersediaan live di bawah.
                </p>
              </div>
            </div>

            {/* Action CTA: BOOKING SEKARANG */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 hover:from-blue-500 hover:via-indigo-500 hover:to-blue-500 text-white font-black text-sm uppercase tracking-wider shadow-xl shadow-blue-600/35 hover:shadow-blue-500/50 hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer group"
              >
                <span>BOOKING SEKARANG</span>
                <ArrowRight className="w-4 h-4 text-blue-200 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

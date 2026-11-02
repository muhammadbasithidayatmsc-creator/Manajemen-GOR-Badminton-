import React, { useState, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  Wrench,
  User,
  Phone,
  DollarSign,
} from 'lucide-react';
import {
  Booking,
  BookingStatus,
  Court,
  TimeSlot,
} from '../../types';
import { formatRupiah, getTodayString, isSlotOccupiedByBooking } from '../../services/store';
import { BookingStatusBadge, PaymentStatusBadge } from '../common/StatusBadges';

interface ScheduleGridViewProps {
  courts: Court[];
  timeSlots: TimeSlot[];
  bookings: Booking[];
  onSlotClick: (court: Court, slot: TimeSlot, existingBooking?: Booking) => void;
  onNewBookingClick: (date: string) => void;
}

export const ScheduleGridView: React.FC<ScheduleGridViewProps> = ({
  courts,
  timeSlots,
  bookings,
  onSlotClick,
  onNewBookingClick,
}) => {
  const [selectedDate, setSelectedDate] = useState<string>(getTodayString(0));

  const sortedSlots = useMemo(() => {
    return [...timeSlots].sort((a, b) => a.sortOrder - b.sortOrder);
  }, [timeSlots]);

  const activeCourts = courts; // all courts, including if status is maintenance

  // Filter bookings for this date
  const dateBookings = useMemo(() => {
    return bookings.filter((b) => b.date === selectedDate);
  }, [bookings, selectedDate]);

  // Navigate date helpers
  const handleOffsetDate = (days: number) => {
    const [y, m, d] = selectedDate.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    date.setDate(date.getDate() + days);
    const newY = date.getFullYear();
    const newM = String(date.getMonth() + 1).padStart(2, '0');
    const newD = String(date.getDate()).padStart(2, '0');
    setSelectedDate(`${newY}-${newM}-${newD}`);
  };

  const formattedDateIndo = useMemo(() => {
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

  const isToday = selectedDate === getTodayString(0);

  return (
    <div className="space-y-6 p-4 sm:p-8 max-w-7xl mx-auto">
      {/* Header & Date Controls */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-black tracking-widest text-blue-600 uppercase">
            CALENDAR MATRIX
          </span>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 leading-tight uppercase">
            TODAY&apos;S COURT SCHEDULE
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {formattedDateIndo} &bull; {activeCourts.length} Lapangan Terdaftar
          </p>
        </div>

        {/* Date Selector bar */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 p-1">
            <button
              onClick={() => handleOffsetDate(-1)}
              className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white transition-colors"
              title="Hari Sebelumnya"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={() => setSelectedDate(getTodayString(0))}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
                isToday ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-700 hover:bg-white'
              }`}
            >
              Hari Ini
            </button>

            <button
              onClick={() => handleOffsetDate(1)}
              className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white transition-colors"
              title="Hari Berikutnya"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Date Picker Input */}
          <div className="relative">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="pl-3 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <button
            onClick={() => onNewBookingClick(selectedDate)}
            className="ml-auto inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold tracking-wide transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Booking</span>
          </button>
        </div>
      </div>

      {/* Current date title bar */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
          <CalendarIcon className="w-4 h-4 text-emerald-600" />
          <span>{formattedDateIndo}</span>
        </div>

        {/* Status Legend Badges */}
        <div className="hidden lg:flex items-center gap-3 text-[11px] font-semibold text-slate-600">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> AVAILABLE
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> PENDING
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span> CONFIRMED
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-700"></span> COMPLETED
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span> CANCELLED
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-700"></span> MAINTENANCE
          </span>
        </div>
      </div>

      {/* MATRIX SCHEDULE TABLE: JAM | COURT 1 | COURT 2 | COURT 3 | COURT 4 */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[760px]">
            <thead>
              <tr className="bg-slate-900 text-white text-xs font-extrabold uppercase tracking-wider border-b border-slate-800">
                <th className="py-3.5 px-4 w-36 text-center border-r border-slate-800 bg-slate-950">
                  JAM
                </th>
                {activeCourts.map((court) => (
                  <th
                    key={court.id}
                    className="py-3.5 px-4 text-center border-r border-slate-800 last:border-r-0"
                  >
                    <div>
                      <span className="text-sm block">{court.name}</span>
                      <span className="text-[10px] font-bold text-emerald-400 block tracking-normal uppercase">
                        {court.status === 'MAINTENANCE' ? 'Perawatan' : court.code}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {sortedSlots.map((slot) => {
                return (
                  <tr key={slot.id} className="hover:bg-slate-50/50 transition-colors">
                    {/* JAM Column */}
                    <td className="py-3 px-3 text-center font-black text-slate-800 bg-slate-50/80 border-r border-slate-200">
                      <div className="flex items-center justify-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{slot.label}</span>
                      </div>
                    </td>

                    {/* Court Columns */}
                    {activeCourts.map((court) => {
                      // Check Court status
                      if (court.status === 'MAINTENANCE') {
                        return (
                          <td
                            key={court.id}
                            className="p-2 border-r border-slate-100 last:border-r-0 bg-amber-50/40 text-center"
                          >
                            <div className="p-2.5 rounded-xl border border-dashed border-amber-300 bg-amber-50/80 text-amber-800 flex flex-col items-center justify-center gap-1">
                              <Wrench className="w-4 h-4 text-amber-600" />
                              <span className="text-[11px] font-bold">MAINTENANCE</span>
                            </div>
                          </td>
                        );
                      }

                      if (court.status === 'INACTIVE') {
                        return (
                          <td
                            key={court.id}
                            className="p-2 border-r border-slate-100 last:border-r-0 bg-slate-100 text-center"
                          >
                            <div className="p-2.5 rounded-xl border border-slate-300 bg-slate-200 text-slate-500">
                              <span className="text-[11px] font-bold">NONAKTIF</span>
                            </div>
                          </td>
                        );
                      }

                      // Check if slot itself is inactive
                      if (!slot.active) {
                        return (
                          <td
                            key={court.id}
                            className="p-2 border-r border-slate-100 last:border-r-0 bg-slate-50 text-center"
                          >
                            <span className="text-slate-400 font-semibold text-[11px]">
                              Sesi Libur
                            </span>
                          </td>
                        );
                      }

                      // Check existing booking across full multi-hour range
                      const booking = dateBookings.find(
                        (b) =>
                          b.courtId === court.id &&
                          isSlotOccupiedByBooking(slot, b, timeSlots)
                      );

                      // If NO booking -> AVAILABLE
                      if (!booking) {
                        return (
                          <td
                            key={court.id}
                            className="p-2 border-r border-slate-100 last:border-r-0"
                          >
                            <button
                              onClick={() => onSlotClick(court, slot)}
                              className="w-full p-2.5 rounded-xl border border-dashed border-emerald-300 bg-emerald-50/40 hover:bg-emerald-100/60 hover:border-emerald-400 transition-all flex items-center justify-between group cursor-pointer"
                            >
                              <span className="text-[11px] font-bold text-emerald-700 tracking-wider">
                                AVAILABLE
                              </span>
                              <Plus className="w-3.5 h-3.5 text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                          </td>
                        );
                      }

                      // If Booked -> Show Status Badge, Customer Name, and Payment Status
                      const isStartSlot = booking.timeSlotId === slot.id;
                      return (
                        <td
                          key={court.id}
                          className="p-2 border-r border-slate-100 last:border-r-0"
                        >
                          <div
                            onClick={() => onSlotClick(court, slot, booking)}
                            className={`p-2.5 rounded-xl border transition-all cursor-pointer shadow-2xs hover:shadow-md ${
                              booking.bookingStatus === 'PENDING'
                                ? 'bg-amber-50/80 border-amber-300 text-amber-950 hover:border-amber-400'
                                : booking.bookingStatus === 'CONFIRMED'
                                ? 'bg-blue-50/80 border-blue-300 text-blue-950 hover:border-blue-400'
                                : 'bg-emerald-50/90 border-emerald-300 text-emerald-950 hover:border-emerald-400'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-1 mb-1">
                              <BookingStatusBadge status={booking.bookingStatus} size="sm" />
                              <div className="flex items-center gap-1">
                                {(booking.durationHours || 1) > 1 && (
                                  <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-indigo-100 text-indigo-800 border border-indigo-200">
                                    {booking.durationHours} Jam
                                  </span>
                                )}
                                <PaymentStatusBadge status={booking.paymentStatus} size="sm" />
                              </div>
                            </div>
                            <div className="font-bold text-xs truncate flex items-center gap-1 text-slate-900">
                              <User className="w-3 h-3 text-slate-400 shrink-0" />
                              <span className="truncate">{booking.customerName}</span>
                            </div>
                            <div className="text-[10px] text-slate-500 font-semibold mt-0.5 flex items-center justify-between">
                              <span className="truncate">{booking.customerPhone}</span>
                              <span className="font-bold text-slate-700 shrink-0">
                                {isStartSlot ? formatRupiah(booking.depositAmount) : '(Lanjutan)'}
                              </span>
                            </div>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

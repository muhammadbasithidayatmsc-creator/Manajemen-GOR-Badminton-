import React, { useMemo } from 'react';
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  DollarSign,
  Activity,
  Layers,
  ArrowUpRight,
  Eye,
  CheckCheck,
  XCircle,
} from 'lucide-react';
import {
  Booking,
  BookingStatus,
  Court,
  Customer,
  GorSettings,
  TimeSlot,
  Transaction,
  User,
} from '../../types';
import { formatRupiah, getTodayString } from '../../services/store';
import { BookingStatusBadge, PaymentStatusBadge } from '../common/StatusBadges';

interface DashboardViewProps {
  bookings: Booking[];
  courts: Court[];
  timeSlots: TimeSlot[];
  transactions: Transaction[];
  customers?: Customer[];
  settings?: GorSettings;
  currentUser?: User | null;
  onOpenBookingModal: (booking?: Booking) => void;
  onQuickNewBooking?: (date?: string, courtId?: string, slotId?: string) => void;
  onNavigateToSchedule?: () => void;
  onNavigate?: (view: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  bookings,
  courts,
  timeSlots,
  transactions,
  customers,
  settings,
  currentUser,
  onOpenBookingModal,
  onQuickNewBooking,
  onNavigateToSchedule,
  onNavigate,
}) => {
  const todayStr = getTodayString(0);
  const currentMonthPrefix = todayStr.substring(0, 7); // YYYY-MM

  const activeCourts = useMemo(() => courts.filter((c) => c.status === 'ACTIVE'), [courts]);
  const activeSlots = useMemo(() => timeSlots.filter((s) => s.active), [timeSlots]);

  // Today Bookings
  const todayBookings = useMemo(() => {
    return bookings.filter((b) => b.date === todayStr);
  }, [bookings, todayStr]);

  // Statistics Calculations
  const stats = useMemo(() => {
    const totalTodayBookings = todayBookings.filter((b) => b.bookingStatus !== 'CANCELLED').length;
    const pendingCount = bookings.filter((b) => b.bookingStatus === 'PENDING').length;
    const confirmedCount = bookings.filter((b) => b.bookingStatus === 'CONFIRMED').length;
    const completedCount = bookings.filter((b) => b.bookingStatus === 'COMPLETED').length;
    const cancelledCount = bookings.filter((b) => b.bookingStatus === 'CANCELLED').length;

    // Total possible slots today = activeCourts * activeSlots
    const totalSlotsToday = activeCourts.length * activeSlots.length;
    const occupiedSlotsToday = todayBookings.filter((b) => b.bookingStatus !== 'CANCELLED').length;
    const availableSlotsToday = Math.max(0, totalSlotsToday - occupiedSlotsToday);

    // Unique courts currently booked today
    const bookedCourtIdsToday = new Set(
      todayBookings.filter((b) => b.bookingStatus !== 'CANCELLED').map((b) => b.courtId)
    );
    const occupiedCourtsCount = bookedCourtIdsToday.size;

    // Omzet Hari Ini: Deposit + Completed payments today
    const omzetHariIni = transactions
      .filter((t) => t.date === todayStr)
      .reduce((sum, t) => sum + (t.depositAmount || 0), 0);

    // Omzet Bulan Ini: Deposit + Payments in current month
    const omzetBulanIni = transactions
      .filter((t) => t.date.startsWith(currentMonthPrefix))
      .reduce((sum, t) => sum + (t.depositAmount || 0), 0);

    return {
      totalTodayBookings,
      pendingCount,
      confirmedCount,
      completedCount,
      cancelledCount,
      availableSlotsToday,
      occupiedCourtsCount,
      totalCourtsCount: courts.length,
      omzetHariIni,
      omzetBulanIni,
    };
  }, [todayBookings, bookings, activeCourts, activeSlots, courts, transactions, todayStr, currentMonthPrefix]);

  // 7-day trend data
  const last7DaysData = useMemo(() => {
    const days: { dateStr: string; label: string; count: number; revenue: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const dateStr = getTodayString(-i);
      const dayDate = new Date(dateStr);
      const label = dayDate.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric' });

      const dayBookings = bookings.filter(
        (b) => b.date === dateStr && b.bookingStatus !== 'CANCELLED'
      );
      const dayTrx = transactions.filter((t) => t.date === dateStr);
      const revenue = dayTrx.reduce((acc, t) => acc + (t.depositAmount || 0), 0);

      days.push({
        dateStr,
        label,
        count: dayBookings.length,
        revenue,
      });
    }
    return days;
  }, [bookings, transactions]);

  const maxBookings7Days = Math.max(...last7DaysData.map((d) => d.count), 5);
  const maxRevenue7Days = Math.max(...last7DaysData.map((d) => d.revenue), 100000);

  return (
    <div className="space-y-8 p-4 sm:p-8 max-w-7xl mx-auto">
      {/* 8 Statistics Cards strictly matching requirements */}
      <div>
        <h2 className="text-xs font-black uppercase tracking-wider text-slate-500 mb-3">
          Ringkasan Operasional & Finansial
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* 1. Booking Hari Ini */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Booking Hari Ini
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Calendar className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-slate-900">
                {stats.totalTodayBookings}
              </span>
              <span className="text-xs text-slate-500">sesi</span>
            </div>
          </div>

          {/* 2. Booking Pending */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Booking Pending
              </span>
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-amber-600">
                {stats.pendingCount}
              </span>
              <span className="text-xs text-slate-500">menunggu</span>
            </div>
          </div>

          {/* 3. Booking Confirmed */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Booking Confirmed
              </span>
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-blue-600">
                {stats.confirmedCount}
              </span>
              <span className="text-xs text-slate-500">aktif</span>
            </div>
          </div>

          {/* 4. Slot Tersedia */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Slot Tersedia (Hari Ini)
              </span>
              <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center">
                <Layers className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-teal-600">
                {stats.availableSlotsToday}
              </span>
              <span className="text-xs text-slate-500">slot</span>
            </div>
          </div>

          {/* 5. Lapangan Terisi */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Lapangan Terisi
              </span>
              <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
                <Activity className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-slate-900">
                {stats.occupiedCourtsCount} / {stats.totalCourtsCount}
              </span>
              <span className="text-xs text-slate-500">lapangan</span>
            </div>
          </div>

          {/* 6. Booking Selesai */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Booking Selesai
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <CheckCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-emerald-600">
                {stats.completedCount}
              </span>
              <span className="text-xs text-slate-500">total</span>
            </div>
          </div>

          {/* 7. Booking Cancelled */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Booking Dibatalkan
              </span>
              <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center">
                <XCircle className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-rose-600">
                {stats.cancelledCount}
              </span>
              <span className="text-xs text-slate-500">batal</span>
            </div>
          </div>

          {/* 7. Omzet Hari Ini */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-emerald-200 bg-emerald-50/20 shadow-xs hover:border-emerald-300 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                Omzet Hari Ini
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-black text-emerald-700 truncate">
                {formatRupiah(stats.omzetHariIni)}
              </span>
            </div>
          </div>

          {/* 8. Omzet Bulan Ini */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Omzet Bulan Ini
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-black text-slate-900 truncate">
                {formatRupiah(stats.omzetBulanIni)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2 Interactive Visual Charts strictly required */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Grafik 1: Booking 7 Hari Terakhir */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Tren Booking 7 Hari Terakhir
              </h3>
              <p className="text-xs text-slate-500">Frekuensi jumlah sesi yang dipesan</p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700">
              Total 7 Hari
            </span>
          </div>

          {/* Bar Chart Visualization */}
          <div className="h-44 flex items-end justify-between gap-2 pt-4 px-2 border-b border-slate-100">
            {last7DaysData.map((d, idx) => {
              const heightPct = Math.max(12, (d.count / maxBookings7Days) * 100);
              const isToday = d.dateStr === todayStr;

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                  <span className="text-[10px] font-bold text-slate-600 opacity-80 group-hover:opacity-100 transition-opacity">
                    {d.count}
                  </span>
                  <div
                    style={{ height: `${heightPct}%` }}
                    className={`w-full max-w-[36px] rounded-t-lg transition-all ${
                      isToday
                        ? 'bg-emerald-600 shadow-xs'
                        : 'bg-slate-200 group-hover:bg-emerald-400'
                    }`}
                  />
                  <span
                    className={`text-[10px] font-semibold truncate mt-1 ${
                      isToday ? 'text-emerald-700 font-extrabold' : 'text-slate-400'
                    }`}
                  >
                    {d.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Grafik 2: Pendapatan 7 Hari Terakhir */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Pendapatan 7 Hari Terakhir
              </h3>
              <p className="text-xs text-slate-500">Pencatatan kas dan transfer manual</p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800">
              Uang Masuk
            </span>
          </div>

          {/* Bar / Column Chart for Revenue */}
          <div className="h-44 flex items-end justify-between gap-2 pt-4 px-2 border-b border-slate-100">
            {last7DaysData.map((d, idx) => {
              const heightPct = Math.max(12, (d.revenue / maxRevenue7Days) * 100);
              const isToday = d.dateStr === todayStr;

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                  <span className="text-[9px] font-bold text-slate-600 truncate max-w-[50px] opacity-70 group-hover:opacity-100">
                    {d.revenue > 0 ? `${Math.round(d.revenue / 1000)}k` : '0'}
                  </span>
                  <div
                    style={{ height: `${heightPct}%` }}
                    className={`w-full max-w-[36px] rounded-t-lg transition-all ${
                      isToday
                        ? 'bg-emerald-500'
                        : 'bg-emerald-200/80 group-hover:bg-emerald-400'
                    }`}
                  />
                  <span
                    className={`text-[10px] font-semibold truncate mt-1 ${
                      isToday ? 'text-emerald-700 font-extrabold' : 'text-slate-400'
                    }`}
                  >
                    {d.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* JADWAL HARI INI Table strictly required */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between flex-wrap gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">Jadwal Hari Ini</h3>
            <p className="text-xs text-slate-500">
              Daftar sesi customer yang terdaftar untuk hari ini ({todayStr})
            </p>
          </div>

          <button
            onClick={onNavigateToSchedule}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-200 transition-colors"
          >
            <span>Buka Kalender Lengkap</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        {todayBookings.length === 0 ? (
          <div className="p-10 text-center text-slate-400 text-sm">
            Belum ada jadwal booking yang tercatat untuk hari ini.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                  <th className="py-3 px-4">Jam Sesi</th>
                  <th className="py-3 px-4">Lapangan</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Pembayaran</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {todayBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{b.timeSlotLabel}</span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      {b.courtName}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{b.customerName}</div>
                      <div className="text-[11px] text-slate-400">{b.customerPhone}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <BookingStatusBadge status={b.bookingStatus} size="sm" />
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <PaymentStatusBadge status={b.paymentStatus} size="sm" />
                        <span className="text-[11px] text-slate-500 font-medium">
                          ({formatRupiah(b.depositAmount)})
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => onOpenBookingModal(b)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 border border-slate-200 transition-colors"
                        title="Lihat / Edit Booking"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

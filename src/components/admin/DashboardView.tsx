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

    // Outstanding Payment (Total Belum Lunas)
    const outstandingPayment = bookings
      .filter((b) => b.bookingStatus !== 'CANCELLED' && b.paymentStatus !== 'LUNAS')
      .reduce((sum, b) => sum + Math.max(0, (b.totalAmount || 0) - (b.depositAmount || 0)), 0);

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
      outstandingPayment,
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
      {/* 5 Primary Metric Cards (Strictly: TODAY, REVENUE, COURTS, PENDING, PAYMENT) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-500">
            Metrik Utama Operasional
          </h2>
          <span className="text-[11px] font-semibold text-slate-400">
            Realtime SSOT Synchronized
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {/* 1. TODAY */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-blue-400 hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                TODAY
              </span>
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Calendar className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2.5 flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {stats.totalTodayBookings}
              </span>
              <span className="text-xs font-semibold text-slate-400">sesi</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Booking hari ini</p>
          </div>

          {/* 2. REVENUE */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-emerald-200 bg-emerald-50/20 shadow-xs hover:border-emerald-400 hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold text-emerald-800 uppercase tracking-wider">
                REVENUE
              </span>
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2.5">
              <span className="text-lg sm:text-2xl font-black text-emerald-700 truncate tracking-tight block">
                {formatRupiah(stats.omzetHariIni)}
              </span>
            </div>
            <p className="text-[11px] text-emerald-700 font-medium mt-1">Omzet hari ini</p>
          </div>

          {/* 3. COURTS */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-indigo-400 hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                COURTS
              </span>
              <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Activity className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2.5 flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {stats.occupiedCourtsCount}
              </span>
              <span className="text-xs font-bold text-slate-400">/ {stats.totalCourtsCount}</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Lapangan terisi</p>
          </div>

          {/* 4. PENDING */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-amber-400 hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                PENDING
              </span>
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2.5 flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-black text-amber-600 tracking-tight">
                {stats.pendingCount}
              </span>
              <span className="text-xs font-semibold text-slate-400">menunggu</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Booking pending</p>
          </div>

          {/* 5. PAYMENT */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-rose-400 hover:shadow-md transition-all col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                PAYMENT
              </span>
              <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2.5">
              <span className="text-lg sm:text-xl font-black text-rose-600 truncate tracking-tight block">
                {formatRupiah(stats.outstandingPayment)}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Outstanding payment</p>
          </div>
        </div>

        {/* Secondary Operational Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          <div className="bg-slate-50 border border-slate-200/70 p-3.5 rounded-xl flex items-center justify-between">
            <div>
              <div className="text-[10px] font-bold text-slate-500 uppercase">Confirmed</div>
              <div className="text-lg font-black text-blue-600">{stats.confirmedCount} sesi</div>
            </div>
            <CheckCircle2 className="w-5 h-5 text-blue-500/40" />
          </div>

          <div className="bg-slate-50 border border-slate-200/70 p-3.5 rounded-xl flex items-center justify-between">
            <div>
              <div className="text-[10px] font-bold text-slate-500 uppercase">Slot Tersedia Hari Ini</div>
              <div className="text-lg font-black text-emerald-600">{stats.availableSlotsToday} slot</div>
            </div>
            <Layers className="w-5 h-5 text-emerald-500/40" />
          </div>

          <div className="bg-slate-50 border border-slate-200/70 p-3.5 rounded-xl flex items-center justify-between">
            <div>
              <div className="text-[10px] font-bold text-slate-500 uppercase">Selesai / Dibatalkan</div>
              <div className="text-lg font-black text-slate-800">{stats.completedCount} / {stats.cancelledCount}</div>
            </div>
            <CheckCheck className="w-5 h-5 text-slate-400" />
          </div>

          <div className="bg-slate-50 border border-slate-200/70 p-3.5 rounded-xl flex items-center justify-between">
            <div>
              <div className="text-[10px] font-bold text-slate-500 uppercase">Omzet Bulan Ini</div>
              <div className="text-sm font-black text-slate-900">{formatRupiah(stats.omzetBulanIni)}</div>
            </div>
            <DollarSign className="w-5 h-5 text-emerald-500/40" />
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

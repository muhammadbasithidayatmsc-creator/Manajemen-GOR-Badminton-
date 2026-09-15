import React, { useState, useMemo } from 'react';
import {
  FileBarChart2,
  Calendar,
  Download,
  Printer,
  TrendingUp,
  Award,
  Clock,
  UserCheck,
  CheckCircle2,
  XCircle,
  DollarSign,
  Layers,
} from 'lucide-react';
import { Booking, Court, Customer, TimeSlot, Transaction } from '../../types';
import { formatRupiah, getTodayString } from '../../services/store';

interface ReportViewProps {
  bookings: Booking[];
  transactions: Transaction[];
  courts: Court[];
  timeSlots: TimeSlot[];
  customers: Customer[];
}

type PeriodFilter = 'today' | '7days' | '30days' | 'month' | 'year' | 'custom';

export const ReportView: React.FC<ReportViewProps> = ({
  bookings,
  transactions,
  courts,
  timeSlots,
  customers,
}) => {
  const todayStr = getTodayString(0);
  const [period, setPeriod] = useState<PeriodFilter>('30days');
  const [startDate, setStartDate] = useState(getTodayString(-29));
  const [endDate, setEndDate] = useState(todayStr);

  // Compute start and end dates based on period
  const effectiveRange = useMemo(() => {
    const today = new Date();
    let start = todayStr;
    let end = todayStr;

    if (period === 'today') {
      start = todayStr;
      end = todayStr;
    } else if (period === '7days') {
      start = getTodayString(-6);
      end = todayStr;
    } else if (period === '30days') {
      start = getTodayString(-29);
      end = todayStr;
    } else if (period === 'month') {
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      start = `${year}-${month}-01`;
      end = todayStr;
    } else if (period === 'year') {
      const year = today.getFullYear();
      start = `${year}-01-01`;
      end = todayStr;
    } else if (period === 'custom') {
      start = startDate;
      end = endDate;
    }

    return { start, end };
  }, [period, startDate, endDate, todayStr]);

  // Filter Bookings & Transactions by date range
  const filteredBookings = useMemo(() => {
    return bookings.filter(
      (b) => b.date >= effectiveRange.start && b.date <= effectiveRange.end
    );
  }, [bookings, effectiveRange]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(
      (t) => t.date >= effectiveRange.start && t.date <= effectiveRange.end
    );
  }, [transactions, effectiveRange]);

  // Key metrics calculations strictly matching user request:
  // - Total Booking
  // - Booking Selesai
  // - Booking Cancelled
  // - Total Omzet
  // - Total DP
  // - Total Pelunasan
  // - Total Piutang/Sisa
  const metrics = useMemo(() => {
    const totalBookings = filteredBookings.length;
    const completedBookings = filteredBookings.filter((b) => b.bookingStatus === 'COMPLETED').length;
    const cancelledBookings = filteredBookings.filter((b) => b.bookingStatus === 'CANCELLED').length;

    // Total Omzet (total revenue expected from valid bookings)
    const activeBookings = filteredBookings.filter((b) => b.bookingStatus !== 'CANCELLED');
    const totalOmzet = activeBookings.reduce((sum, b) => sum + b.totalAmount, 0);

    // Total DP (total deposits recorded)
    const totalDP = activeBookings
      .filter((b) => b.paymentStatus === 'DP')
      .reduce((sum, b) => sum + b.depositAmount, 0);

    // Total Pelunasan (payments from bookings marked LUNAS)
    const totalPelunasan = activeBookings
      .filter((b) => b.paymentStatus === 'LUNAS')
      .reduce((sum, b) => sum + b.totalAmount, 0);

    // Total Piutang/Sisa (remaining amount to be collected)
    const totalPiutang = activeBookings.reduce((sum, b) => sum + (b.remainingAmount || 0), 0);

    return {
      totalBookings,
      completedBookings,
      cancelledBookings,
      totalOmzet,
      totalDP,
      totalPelunasan,
      totalPiutang,
    };
  }, [filteredBookings]);

  // Top statistics strictly required:
  // - Lapangan paling banyak digunakan
  // - Jam paling ramai
  // - Customer paling sering booking
  const topStats = useMemo(() => {
    // 1. Lapangan terbanyak
    const courtCountMap: Record<string, { name: string; count: number }> = {};
    for (const b of filteredBookings) {
      if (b.bookingStatus !== 'CANCELLED') {
        if (!courtCountMap[b.courtId]) {
          courtCountMap[b.courtId] = { name: b.courtName, count: 0 };
        }
        courtCountMap[b.courtId].count++;
      }
    }
    const sortedCourts = Object.values(courtCountMap).sort((a, b) => b.count - a.count);
    const topCourt = sortedCourts[0] || { name: 'Belum ada data', count: 0 };

    // 2. Jam paling ramai
    const slotCountMap: Record<string, { label: string; count: number }> = {};
    for (const b of filteredBookings) {
      if (b.bookingStatus !== 'CANCELLED') {
        if (!slotCountMap[b.timeSlotId]) {
          slotCountMap[b.timeSlotId] = { label: b.timeSlotLabel, count: 0 };
        }
        slotCountMap[b.timeSlotId].count++;
      }
    }
    const sortedSlots = Object.values(slotCountMap).sort((a, b) => b.count - a.count);
    const topSlot = sortedSlots[0] || { label: 'Belum ada data', count: 0 };

    // 3. Customer paling sering booking
    const custCountMap: Record<string, { name: string; count: number }> = {};
    for (const b of filteredBookings) {
      if (b.bookingStatus !== 'CANCELLED') {
        if (!custCountMap[b.customerName]) {
          custCountMap[b.customerName] = { name: b.customerName, count: 0 };
        }
        custCountMap[b.customerName].count++;
      }
    }
    const sortedCusts = Object.values(custCountMap).sort((a, b) => b.count - a.count);
    const topCustomer = sortedCusts[0] || { name: 'Belum ada data', count: 0 };

    return { topCourt, topSlot, topCustomer };
  }, [filteredBookings]);

  // Export to CSV
  const handleExportCSV = () => {
    const headers = [
      'Nomor Transaksi',
      'Tanggal',
      'Customer',
      'Booking Code',
      'Lapangan',
      'Sesi Jam',
      'Total',
      'Nominal Bayar',
      'Sisa',
      'Metode',
      'Status',
    ];

    const rows = filteredTransactions.map((t) => [
      `"${t.transactionNumber}"`,
      `"${t.date}"`,
      `"${t.customerName}"`,
      `"${t.bookingCode}"`,
      `"${t.courtName}"`,
      `"${t.timeSlotLabel}"`,
      t.totalAmount,
      t.depositAmount,
      t.remainingAmount,
      `"${t.paymentMethod}"`,
      `"${t.paymentStatus}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Laporan_GOR_${effectiveRange.start}_sd_${effectiveRange.end}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 p-4 sm:p-8 max-w-7xl mx-auto">
      {/* Header with Export & Print */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 no-print">
        <div>
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-tight">
            Laporan Pendapatan & Kinerja Operasional
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Periode: {effectiveRange.start} s/d {effectiveRange.end}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all border border-slate-200 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak / Download PDF</span>
          </button>
        </div>
      </div>

      {/* Period Filter Bar strictly requested */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center gap-2 no-print">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1">
          Filter Periode:
        </span>
        {[
          { id: 'today', label: 'Hari Ini' },
          { id: '7days', label: '7 Hari' },
          { id: '30days', label: '30 Hari' },
          { id: 'month', label: 'Bulan Ini' },
          { id: 'year', label: 'Tahun Ini' },
          { id: 'custom', label: 'Custom Range' },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setPeriod(item.id as PeriodFilter)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              period === item.id
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {item.label}
          </button>
        ))}

        {period === 'custom' && (
          <div className="flex items-center gap-2 ml-auto">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-2.5 py-1 rounded-lg border border-slate-200 text-xs text-slate-800"
            />
            <span className="text-xs text-slate-400">s/d</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-2.5 py-1 rounded-lg border border-slate-200 text-xs text-slate-800"
            />
          </div>
        )}
      </div>

      {/* Printable Report Header */}
      <div className="hidden print-only mb-6 text-center border-b pb-4">
        <h1 className="text-xl font-black uppercase">LAPORAN KINERJA & PENDAPATAN GOR</h1>
        <p className="text-xs text-slate-500">
          Periode: {effectiveRange.start} s/d {effectiveRange.end}
        </p>
      </div>

      {/* 7 Key Summary Cards strictly requested:
          Total Booking, Booking Selesai, Booking Cancelled, Total Omzet, Total DP, Total Pelunasan, Total Piutang/Sisa */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* 1. Total Booking */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Total Booking
          </span>
          <p className="text-2xl font-black text-slate-900 mt-1">
            {metrics.totalBookings}{' '}
            <span className="text-xs font-normal text-slate-400">sesi</span>
          </p>
        </div>

        {/* 2. Booking Selesai */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
            Booking Selesai
          </span>
          <p className="text-2xl font-black text-emerald-600 mt-1">
            {metrics.completedBookings}{' '}
            <span className="text-xs font-normal text-slate-400">sesi</span>
          </p>
        </div>

        {/* 3. Booking Cancelled */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-rose-800 uppercase tracking-wider block">
            Booking Dibatalkan
          </span>
          <p className="text-2xl font-black text-rose-600 mt-1">
            {metrics.cancelledBookings}{' '}
            <span className="text-xs font-normal text-slate-400">sesi</span>
          </p>
        </div>

        {/* 4. Total Omzet */}
        <div className="bg-white p-4 rounded-2xl border border-emerald-200 bg-emerald-50/20 shadow-xs">
          <span className="text-[11px] font-bold text-emerald-900 uppercase tracking-wider block">
            Total Omzet Sewa
          </span>
          <p className="text-xl sm:text-2xl font-black text-emerald-700 mt-1 truncate">
            {formatRupiah(metrics.totalOmzet)}
          </p>
        </div>

        {/* 5. Total DP */}
        <div className="bg-white p-4 rounded-2xl border border-amber-200 bg-amber-50/20 shadow-xs">
          <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider block">
            Total Uang Muka (DP)
          </span>
          <p className="text-xl sm:text-2xl font-black text-amber-700 mt-1 truncate">
            {formatRupiah(metrics.totalDP)}
          </p>
        </div>

        {/* 6. Total Pelunasan */}
        <div className="bg-white p-4 rounded-2xl border border-teal-200 bg-teal-50/20 shadow-xs">
          <span className="text-[11px] font-bold text-teal-900 uppercase tracking-wider block">
            Total Pelunasan
          </span>
          <p className="text-xl sm:text-2xl font-black text-teal-700 mt-1 truncate">
            {formatRupiah(metrics.totalPelunasan)}
          </p>
        </div>

        {/* 7. Total Piutang / Sisa */}
        <div className="bg-white p-4 rounded-2xl border border-rose-200 bg-rose-50/20 shadow-xs lg:col-span-2">
          <span className="text-[11px] font-bold text-rose-900 uppercase tracking-wider block">
            Total Piutang / Sisa Belum Lunas
          </span>
          <p className="text-xl sm:text-2xl font-black text-rose-700 mt-1 truncate">
            {formatRupiah(metrics.totalPiutang)}
          </p>
        </div>
      </div>

      {/* TOP STATISTIK strictly requested:
          Lapangan paling banyak digunakan, Jam paling ramai, Customer paling sering booking */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Lapangan Paling Banyak Digunakan */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Lapangan Terfavorit
            </span>
            <h3 className="text-base font-black text-slate-900 truncate">
              {topStats.topCourt.name}
            </h3>
            <p className="text-xs text-indigo-600 font-bold mt-0.5">
              {topStats.topCourt.count} sesi dipesan
            </p>
          </div>
        </div>

        {/* Jam Paling Ramai */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Jam Sesi Paling Ramai
            </span>
            <h3 className="text-base font-black text-slate-900 truncate">
              {topStats.topSlot.label}
            </h3>
            <p className="text-xs text-amber-600 font-bold mt-0.5">
              {topStats.topSlot.count} kali reservasi
            </p>
          </div>
        </div>

        {/* Customer Paling Sering Booking */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <UserCheck className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Customer Teraktif
            </span>
            <h3 className="text-base font-black text-slate-900 truncate">
              {topStats.topCustomer.name}
            </h3>
            <p className="text-xs text-emerald-600 font-bold mt-0.5">
              {topStats.topCustomer.count} booking tercatat
            </p>
          </div>
        </div>
      </div>

      {/* Detailed Transaction List in Report */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">
            Rincian Log Transaksi Pembayaran ({effectiveRange.start} s/d {effectiveRange.end})
          </h3>
        </div>

        {filteredTransactions.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            Belum ada transaksi tercatat pada rentang tanggal ini.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse min-w-[700px]">
              <thead className="bg-slate-50 text-[10px] font-extrabold text-slate-500 uppercase">
                <tr>
                  <th className="p-3">No. Transaksi</th>
                  <th className="p-3">Tanggal</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Lapangan</th>
                  <th className="p-3">Total</th>
                  <th className="p-3">Terbayar</th>
                  <th className="p-3">Sisa</th>
                  <th className="p-3">Metode</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredTransactions.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold text-slate-900">{t.transactionNumber}</td>
                    <td className="p-3">{t.date}</td>
                    <td className="p-3 font-semibold text-slate-900">{t.customerName}</td>
                    <td className="p-3">{t.courtName}</td>
                    <td className="p-3 font-medium">{formatRupiah(t.totalAmount)}</td>
                    <td className="p-3 font-bold text-emerald-700">{formatRupiah(t.depositAmount)}</td>
                    <td className="p-3 font-bold text-rose-700">
                      {t.remainingAmount > 0 ? formatRupiah(t.remainingAmount) : '-'}
                    </td>
                    <td className="p-3 font-semibold">{t.paymentMethod}</td>
                    <td className="p-3 font-bold">{t.paymentStatus}</td>
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

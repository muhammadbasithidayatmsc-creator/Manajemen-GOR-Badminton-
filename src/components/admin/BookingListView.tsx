import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Calendar,
  Clock,
  Phone,
  Filter,
  CheckCircle,
  ExternalLink,
} from 'lucide-react';
import { Booking, BookingStatus, Court, PaymentStatus } from '../../types';
import { formatRupiah } from '../../services/store';
import { BookingStatusBadge, PaymentStatusBadge } from '../common/StatusBadges';
import { ConfirmDialog } from '../common/ConfirmDialog';

interface BookingListViewProps {
  bookings: Booking[];
  courts: Court[];
  onOpenBookingModal: (booking?: Booking) => void;
  onDeleteBooking: (bookingId: string) => void;
  onQuickUpdateStatus: (booking: Booking, status: BookingStatus) => void;
}

export const BookingListView: React.FC<BookingListViewProps> = ({
  bookings,
  courts,
  onOpenBookingModal,
  onDeleteBooking,
  onQuickUpdateStatus,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [paymentFilter, setPaymentFilter] = useState<string>('ALL');
  const [courtFilter, setCourtFilter] = useState<string>('ALL');
  const [dateFilter, setDateFilter] = useState<string>('');

  // Delete dialog state
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      // Search
      const searchMatch =
        b.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.customerPhone.includes(searchTerm) ||
        b.bookingCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.courtName.toLowerCase().includes(searchTerm.toLowerCase());

      if (!searchMatch) return false;

      // Status
      if (statusFilter !== 'ALL' && b.bookingStatus !== statusFilter) return false;

      // Payment
      if (paymentFilter !== 'ALL' && b.paymentStatus !== paymentFilter) return false;

      // Court
      if (courtFilter !== 'ALL' && b.courtId !== courtFilter) return false;

      // Date
      if (dateFilter && b.date !== dateFilter) return false;

      return true;
    });
  }, [bookings, searchTerm, statusFilter, paymentFilter, courtFilter, dateFilter]);

  return (
    <div className="space-y-6 p-4 sm:p-8 max-w-7xl mx-auto">
      {/* Header & Controls */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-tight">
            Daftar Booking Lapangan
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Total {bookings.length} booking tercatat di sistem
          </p>
        </div>

        <button
          onClick={() => onOpenBookingModal()}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Booking Baru</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search */}
          <div className="relative lg:col-span-2">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Cari kode booking, nama, atau no. WA..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs font-medium bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-slate-50 focus:bg-white focus:outline-hidden"
            >
              <option value="ALL">Semua Status Booking</option>
              <option value="PENDING">PENDING</option>
              <option value="CONFIRMED">CONFIRMED</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
          </div>

          {/* Payment Filter */}
          <div>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-slate-50 focus:bg-white focus:outline-hidden"
            >
              <option value="ALL">Semua Status Bayar</option>
              <option value="BELUM BAYAR">BELUM BAYAR</option>
              <option value="DP">DP</option>
              <option value="LUNAS">LUNAS</option>
            </select>
          </div>

          {/* Court Filter */}
          <div>
            <select
              value={courtFilter}
              onChange={(e) => setCourtFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-slate-50 focus:bg-white focus:outline-hidden"
            >
              <option value="ALL">Semua Lapangan</option>
              {courts.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Date Filter & Clear */}
        <div className="flex items-center gap-3 pt-2 border-t border-slate-100 flex-wrap">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter Tanggal:</span>
          </div>
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-2.5 py-1 rounded-lg border border-slate-200 text-xs bg-slate-50 focus:bg-white text-slate-800"
          />
          {dateFilter && (
            <button
              onClick={() => setDateFilter('')}
              className="text-xs text-rose-600 hover:underline font-semibold"
            >
              Reset Tanggal
            </button>
          )}

          {(searchTerm || statusFilter !== 'ALL' || paymentFilter !== 'ALL' || courtFilter !== 'ALL' || dateFilter) && (
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('ALL');
                setPaymentFilter('ALL');
                setCourtFilter('ALL');
                setDateFilter('');
              }}
              className="ml-auto text-xs text-slate-500 hover:text-slate-800 font-bold"
            >
              Reset Semua Filter
            </button>
          )}
        </div>
      </div>

      {/* Table strictly according to requested columns */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {filteredBookings.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm">
            Tidak ada booking yang sesuai dengan filter pencarian.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[880px]">
              <thead>
                <tr className="bg-slate-50 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                  <th className="py-3.5 px-4">Kode Booking</th>
                  <th className="py-3.5 px-4">Tanggal</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">WhatsApp</th>
                  <th className="py-3.5 px-4">Lapangan</th>
                  <th className="py-3.5 px-4">Jam</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Pembayaran</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      {b.bookingCode}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-800">
                      {b.date}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-xs shrink-0 shadow-xs">
                          {b.customerName
                            ? b.customerName
                                .split(' ')
                                .map((n: string) => n[0])
                                .slice(0, 2)
                                .join('')
                                .toUpperCase()
                            : 'CU'}
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-slate-900 leading-snug truncate">
                            {b.customerName}
                          </div>
                          <a
                            href={`https://wa.me/${b.customerPhone.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] text-blue-600 hover:text-blue-800 font-medium transition-colors"
                            title="Chat WhatsApp"
                          >
                            <Phone className="w-3 h-3 text-blue-500" />
                            <span>{b.customerPhone}</span>
                          </a>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      {b.courtName}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-700">
                      {b.timeSlotLabel}
                    </td>
                    <td className="py-3.5 px-4">
                      <BookingStatusBadge status={b.bookingStatus} size="sm" />
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5">
                        <PaymentStatusBadge status={b.paymentStatus} size="sm" />
                        <div className="text-[10px] text-slate-500 font-medium">
                          Total: {formatRupiah(b.totalAmount)}
                          {b.depositAmount > 0 && ` (DP ${formatRupiah(b.depositAmount)})`}
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onOpenBookingModal(b)}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 border border-slate-200 transition-colors"
                          title="Edit Booking & Pembayaran"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteTargetId(b.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-700 hover:bg-rose-50 border border-slate-200 transition-colors"
                          title="Hapus Booking"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deleteTargetId)}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={() => {
          if (deleteTargetId) onDeleteBooking(deleteTargetId);
        }}
        title="Konfirmasi Hapus Booking"
        message="Apakah Anda yakin ingin menghapus data booking ini dari sistem? Slot jadwal ini akan kembali berstatus Available."
        confirmLabel="Ya, Hapus"
        isDanger={true}
      />
    </div>
  );
};

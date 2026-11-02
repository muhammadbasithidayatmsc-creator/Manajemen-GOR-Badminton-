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
  FileText,
  CalendarDays,
  Repeat,
  ChevronRight,
  X,
  ExternalLink,
  Layers,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  MessageCircle,
} from 'lucide-react';
import {
  Booking,
  BookingStatus,
  BusinessSettings,
  Court,
  MonthlyBookingGroup,
  PaymentStatus,
} from '../../types';
import { formatRupiah, store } from '../../services/store';
import { generateCustomerWhatsAppUrl, cleanPhoneNumber } from '../../utils/whatsapp';
import { BookingStatusBadge, PaymentStatusBadge } from '../common/StatusBadges';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { InvoiceModal } from '../common/InvoiceModal';
import { useToast } from '../../context/ToastContext';

interface BookingListViewProps {
  bookings: Booking[];
  monthlyBookings?: MonthlyBookingGroup[];
  courts: Court[];
  settings?: BusinessSettings;
  onOpenBookingModal: (booking?: Booking) => void;
  onDeleteBooking: (bookingId: string) => void;
  onQuickUpdateStatus: (booking: Booking, status: BookingStatus) => void;
  onDeleteMonthlyBooking?: (groupId: string) => void;
  onUpdateMonthlyStatus?: (
    groupId: string,
    updates: { bookingStatus?: BookingStatus; paymentStatus?: PaymentStatus }
  ) => void;
}

export const BookingListView: React.FC<BookingListViewProps> = ({
  bookings,
  monthlyBookings = [],
  courts,
  settings,
  onOpenBookingModal,
  onDeleteBooking,
  onQuickUpdateStatus,
  onDeleteMonthlyBooking,
  onUpdateMonthlyStatus,
}) => {
  const { success } = useToast();
  const [activeTab, setActiveTab] = useState<'regular' | 'monthly'>('regular');

  // Search & filters for regular bookings
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [paymentFilter, setPaymentFilter] = useState<string>('ALL');
  const [courtFilter, setCourtFilter] = useState<string>('ALL');
  const [dateFilter, setDateFilter] = useState<string>('');

  // Search & filters for monthly bookings
  const [monthlySearchTerm, setMonthlySearchTerm] = useState('');
  const [monthlyStatusFilter, setMonthlyStatusFilter] = useState<string>('ALL');

  // Delete dialog state
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [deleteMonthlyTargetId, setDeleteMonthlyTargetId] = useState<string | null>(null);

  // Invoice modal state
  const [selectedInvoiceBooking, setSelectedInvoiceBooking] = useState<Booking | null>(null);
  const [selectedInvoiceMonthly, setSelectedInvoiceMonthly] = useState<MonthlyBookingGroup | null>(null);

  // Detail sessions modal for monthly group
  const [viewingSessionsGroup, setViewingSessionsGroup] = useState<MonthlyBookingGroup | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fallbackSettings = useMemo(() => settings || store.getSettings(), [settings]);

  // Copy booking code helper
  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(code);
    success('Disalin', `ID ${code} disalin.`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filtered regular bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const searchMatch =
        b.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.customerPhone.includes(searchTerm) ||
        b.bookingCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.courtName.toLowerCase().includes(searchTerm.toLowerCase());

      if (!searchMatch) return false;
      if (statusFilter !== 'ALL' && b.bookingStatus !== statusFilter) return false;
      if (paymentFilter !== 'ALL' && b.paymentStatus !== paymentFilter) return false;
      if (courtFilter !== 'ALL' && b.courtId !== courtFilter) return false;
      if (dateFilter && b.date !== dateFilter) return false;

      return true;
    });
  }, [bookings, searchTerm, statusFilter, paymentFilter, courtFilter, dateFilter]);

  // Filtered monthly bookings
  const filteredMonthlyBookings = useMemo(() => {
    return monthlyBookings.filter((m) => {
      const searchMatch =
        m.customerName.toLowerCase().includes(monthlySearchTerm.toLowerCase()) ||
        m.customerPhone.includes(monthlySearchTerm) ||
        m.groupCode.toLowerCase().includes(monthlySearchTerm.toLowerCase()) ||
        m.courtName.toLowerCase().includes(monthlySearchTerm.toLowerCase());

      if (!searchMatch) return false;
      if (monthlyStatusFilter !== 'ALL' && m.bookingStatus !== monthlyStatusFilter) return false;

      return true;
    });
  }, [monthlyBookings, monthlySearchTerm, monthlyStatusFilter]);

  return (
    <div className="space-y-6 p-4 sm:p-8 max-w-7xl mx-auto">
      {/* Header & Main Controls */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-tight">
            Manajemen Booking Lapangan
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola reservasi reguler dan paket bulanan member dengan sinkronisasi otomatis WhatsApp
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onOpenBookingModal()}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Buat Booking Baru</span>
          </button>
        </div>
      </div>

      {/* Sub Tabs Switcher */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-200/80 rounded-2xl max-w-fit">
        <button
          onClick={() => setActiveTab('regular')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'regular'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>🏸 Booking Reguler & Sesi</span>
          <span className="px-1.5 py-0.5 rounded-md bg-slate-100 text-[10px] text-slate-700 font-extrabold">
            {bookings.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('monthly')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'monthly'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <CalendarDays className="w-3.5 h-3.5" />
          <span>Booking Bulanan (Member)</span>
          <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-extrabold ${activeTab === 'monthly' ? 'bg-purple-700 text-purple-100' : 'bg-slate-300 text-slate-700'}`}>
            {monthlyBookings.length}
          </span>
        </button>
      </div>

      {/* ================= TAB 1: REGULAR BOOKINGS ================= */}
      {activeTab === 'regular' && (
        <div className="space-y-4">
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
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold bg-white text-[#1F2937] placeholder:text-gray-500 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Status Filter */}
              <div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold bg-white text-[#1F2937] focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
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
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold bg-white text-[#1F2937] focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
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
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold bg-white text-[#1F2937] focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
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
              <div className="flex items-center gap-2 text-xs text-slate-600 font-bold">
                <Filter className="w-3.5 h-3.5" />
                <span>Filter Tanggal:</span>
              </div>
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-2.5 py-1 rounded-lg border border-slate-300 text-xs bg-white text-[#1F2937] font-semibold focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
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

          {/* Table of Regular Bookings */}
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
                      <th className="py-3.5 px-4">Lapangan</th>
                      <th className="py-3.5 px-4">Jam</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4">Pembayaran</th>
                      <th className="py-3.5 px-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                    {filteredBookings.map((b) => (
                      <tr key={b.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5 font-mono font-bold text-slate-900">
                            <span>{b.bookingCode}</span>
                            {b.bookingType === 'MONTHLY' && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-purple-100 text-purple-700 border border-purple-200">
                                Bulanan
                              </span>
                            )}
                          </div>
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
                                href={generateCustomerWhatsAppUrl({
                                  customerPhone: b.customerPhone,
                                  customerName: b.customerName,
                                  bookingCode: b.bookingCode,
                                  courtName: b.courtName,
                                  date: b.date,
                                  timeSlotLabel: b.timeSlotLabel,
                                  gorName: fallbackSettings.gorName,
                                })}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-[11px] text-emerald-700 hover:text-emerald-900 font-semibold transition-colors"
                                title="Chat WhatsApp Pelanggan"
                              >
                                <Phone className="w-3 h-3 text-emerald-600" />
                                <span>{b.customerPhone}</span>
                              </a>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-slate-800">
                          {b.courtName}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-slate-700">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span>{b.timeSlotLabel}</span>
                            {b.durationHours && b.durationHours > 1 ? (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
                                {b.durationHours} Jam
                              </span>
                            ) : (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                                1 Jam
                              </span>
                            )}
                          </div>
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
                            {/* Hubungi Pelanggan via WhatsApp */}
                            <a
                              href={generateCustomerWhatsAppUrl({
                                customerPhone: b.customerPhone,
                                customerName: b.customerName,
                                bookingCode: b.bookingCode,
                                courtName: b.courtName,
                                date: b.date,
                                timeSlotLabel: b.timeSlotLabel,
                                gorName: fallbackSettings.gorName,
                              })}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 rounded-lg text-emerald-700 hover:text-emerald-900 hover:bg-emerald-50 border border-emerald-200 transition-colors inline-flex items-center justify-center"
                              title="Hubungi Pelanggan via WhatsApp"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                            </a>

                            {/* Open Invoice Button */}
                            <button
                              onClick={() => {
                                setSelectedInvoiceBooking(b);
                                setSelectedInvoiceMonthly(null);
                              }}
                              className="p-1.5 rounded-lg text-blue-600 hover:text-blue-800 hover:bg-blue-50 border border-blue-200 transition-colors cursor-pointer"
                              title="Lihat & Print Invoice"
                            >
                              <FileText className="w-3.5 h-3.5" />
                            </button>

                            {/* Edit Booking Button */}
                            <button
                              onClick={() => onOpenBookingModal(b)}
                              className="p-1.5 rounded-lg text-slate-600 hover:text-emerald-700 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
                              title="Edit Booking & Pembayaran"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>

                            {/* Delete Booking Button */}
                            <button
                              onClick={() => setDeleteTargetId(b.id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-700 hover:bg-rose-50 border border-slate-200 transition-colors cursor-pointer"
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
        </div>
      )}

      {/* ================= TAB 2: MONTHLY BOOKINGS ================= */}
      {activeTab === 'monthly' && (
        <div className="space-y-4">
          {/* Monthly Toolbar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="Cari ID group, nama member, no. WA..."
                value={monthlySearchTerm}
                onChange={(e) => setMonthlySearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold bg-white text-[#1F2937] placeholder:text-gray-500 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={monthlyStatusFilter}
                onChange={(e) => setMonthlyStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold bg-white text-[#1F2937] focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              >
                <option value="ALL">Semua Status</option>
                <option value="PENDING">PENDING</option>
                <option value="CONFIRMED">CONFIRMED</option>
                <option value="COMPLETED">COMPLETED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>

              <div className="text-xs text-slate-500 font-semibold px-2">
                Total: <strong>{filteredMonthlyBookings.length} Paket</strong>
              </div>
            </div>
          </div>

          {/* Cards / Table of Monthly Groups */}
          {filteredMonthlyBookings.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-400 text-sm">
              Belum ada data booking bulanan yang tercatat atau cocok dengan pencarian.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredMonthlyBookings.map((group) => (
                <div
                  key={group.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all space-y-4"
                >
                  {/* Top Bar of Card */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-sm text-purple-700">
                        {group.groupCode}
                      </span>
                      <button
                        onClick={() => handleCopy(group.groupCode)}
                        className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
                        title="Salin ID"
                      >
                        {copiedId === group.groupCode ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                        {group.sessionCount} Sesi
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold text-slate-900 block">
                        {formatRupiah(group.totalAmount)}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        @{formatRupiah(group.ratePerSession)}/sesi
                      </span>
                    </div>
                  </div>

                  {/* Customer and Court Info */}
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="space-y-1">
                      <span className="text-[11px] text-slate-500 font-bold">Customer / Member</span>
                      <div className="font-bold text-slate-900">{group.customerName}</div>
                      <a
                        href={generateCustomerWhatsAppUrl({
                          customerPhone: group.customerPhone,
                          customerName: group.customerName,
                          bookingCode: group.groupCode,
                          courtName: group.courtName,
                          timeSlotLabel: group.timeSlotLabel,
                          gorName: fallbackSettings.gorName,
                        })}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-emerald-700 hover:text-emerald-900 font-bold"
                        title="Chat WhatsApp Member"
                      >
                        <Phone className="w-3 h-3 text-emerald-600" />
                        <span>{group.customerPhone}</span>
                      </a>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[11px] text-slate-500 font-bold">Lapangan & Sesi</span>
                      <div className="font-bold text-slate-900">{group.courtName}</div>
                      <div className="text-slate-700 font-semibold flex items-center gap-1.5 flex-wrap">
                        <span>{group.timeSlotLabel}</span>
                        {group.durationHours && group.durationHours > 1 && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            {group.durationHours} Jam
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Period & Schedule Pattern */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Periode:</span>
                      <span className="font-semibold text-slate-800">{group.periodLabel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Pola Hari:</span>
                      <span className="font-semibold text-purple-700">
                        Setiap {group.selectedDaysLabels.join(' & ')}
                      </span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-slate-200 text-[11px]">
                      <span className="text-slate-500">DP: {formatRupiah(group.depositAmount)}</span>
                      <span className="font-bold text-amber-700">Sisa: {formatRupiah(group.remainingAmount)}</span>
                    </div>
                  </div>

                  {/* Status Dropdowns Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                    <div className="flex items-center gap-2">
                      {/* Booking Status Select */}
                      <select
                        value={group.bookingStatus}
                        onChange={(e) =>
                          onUpdateMonthlyStatus?.(group.id, {
                            bookingStatus: e.target.value as BookingStatus,
                          })
                        }
                        className="text-xs font-semibold px-2.5 py-1 rounded-lg border border-slate-300 bg-white text-[#1F2937] shadow-2xs focus:outline-hidden"
                      >
                        <option value="PENDING">Status: PENDING</option>
                        <option value="CONFIRMED">Status: CONFIRMED</option>
                        <option value="COMPLETED">Status: COMPLETED</option>
                        <option value="CANCELLED">Status: CANCELLED</option>
                      </select>

                      {/* Payment Status Select */}
                      <select
                        value={group.paymentStatus}
                        onChange={(e) =>
                          onUpdateMonthlyStatus?.(group.id, {
                            paymentStatus: e.target.value as PaymentStatus,
                          })
                        }
                        className="text-xs font-semibold px-2.5 py-1 rounded-lg border border-slate-300 bg-white text-[#1F2937] shadow-2xs focus:outline-hidden"
                      >
                        <option value="BELUM BAYAR">Bayar: BELUM BAYAR</option>
                        <option value="DP">Bayar: DP</option>
                        <option value="LUNAS">Bayar: LUNAS</option>
                      </select>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-1.5 ml-auto">
                      <a
                        href={generateCustomerWhatsAppUrl({
                          customerPhone: group.customerPhone,
                          customerName: group.customerName,
                          bookingCode: group.groupCode,
                          courtName: group.courtName,
                          timeSlotLabel: group.timeSlotLabel,
                          gorName: fallbackSettings.gorName,
                        })}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-lg border border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors inline-flex items-center justify-center cursor-pointer"
                        title="Hubungi Member via WhatsApp"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                      </a>

                      <button
                        onClick={() => setViewingSessionsGroup(group)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                        title="Lihat Daftar Sesi"
                      >
                        <span>Sesi ({group.dates?.length || 0})</span>
                      </button>

                      <button
                        onClick={() => {
                          setSelectedInvoiceMonthly(group);
                          setSelectedInvoiceBooking(null);
                        }}
                        className="p-1.5 rounded-lg border border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors cursor-pointer"
                        title="Lihat Invoice Bulanan"
                      >
                        <FileText className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => setDeleteMonthlyTargetId(group.id)}
                        className="p-1.5 rounded-lg border border-rose-200 text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors cursor-pointer"
                        title="Hapus Paket Bulanan"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Detail Session Dates Modal */}
      {viewingSessionsGroup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">
                  Daftar Sesi Bulanan: {viewingSessionsGroup.groupCode}
                </h4>
                <p className="text-xs text-slate-500">
                  {viewingSessionsGroup.customerName} &bull; {viewingSessionsGroup.courtName} ({viewingSessionsGroup.timeSlotLabel})
                </p>
              </div>
              <button
                onClick={() => setViewingSessionsGroup(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-3 max-h-96 overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {viewingSessionsGroup.dates.map((d, i) => {
                  let formatted = d;
                  try {
                    const [y, m, dt] = d.split('-').map(Number);
                    const o = new Date(y, m - 1, dt);
                    formatted = o.toLocaleDateString('id-ID', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    });
                  } catch {
                    formatted = d;
                  }

                  return (
                    <div
                      key={i}
                      className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-bold text-slate-900 block">{formatted}</span>
                        <span className="text-[11px] text-slate-500">{viewingSessionsGroup.timeSlotLabel}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700">
                        Sesi {i + 1}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button
                onClick={() => setViewingSessionsGroup(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-white text-xs font-semibold hover:bg-slate-700 transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Modal for Screen and Printing */}
      <InvoiceModal
        isOpen={Boolean(selectedInvoiceBooking || selectedInvoiceMonthly)}
        onClose={() => {
          setSelectedInvoiceBooking(null);
          setSelectedInvoiceMonthly(null);
        }}
        booking={selectedInvoiceBooking}
        monthlyBooking={selectedInvoiceMonthly}
        settings={fallbackSettings}
      />

      {/* Regular Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deleteTargetId)}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={() => {
          if (deleteTargetId) onDeleteBooking(deleteTargetId);
          setDeleteTargetId(null);
        }}
        title="Konfirmasi Hapus Booking"
        message="Apakah Anda yakin ingin menghapus data booking ini dari sistem? Slot jadwal ini akan kembali berstatus Available."
        confirmLabel="Ya, Hapus"
        isDanger={true}
      />

      {/* Monthly Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deleteMonthlyTargetId)}
        onClose={() => setDeleteMonthlyTargetId(null)}
        onConfirm={() => {
          if (deleteMonthlyTargetId && onDeleteMonthlyBooking) {
            onDeleteMonthlyBooking(deleteMonthlyTargetId);
          }
          setDeleteMonthlyTargetId(null);
        }}
        title="Konfirmasi Hapus Paket Bulanan"
        message="Apakah Anda yakin ingin menghapus paket booking bulanan ini beserta seluruh jadwal sesi pertemuannya dari sistem?"
        confirmLabel="Ya, Hapus Semua Sesi"
        isDanger={true}
      />
    </div>
  );
};

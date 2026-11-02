import React, { useState, useMemo } from 'react';
import {
  Search,
  User,
  Phone,
  Calendar,
  DollarSign,
  FileText,
  Clock,
  Plus,
  Edit2,
  Trash2,
  ChevronRight,
  Receipt,
  X,
} from 'lucide-react';
import { Booking, Customer, Transaction } from '../../types';
import { formatRupiah } from '../../services/store';
import { cleanPhoneNumber } from '../../utils/whatsapp';
import { BookingStatusBadge, PaymentStatusBadge } from '../common/StatusBadges';
import { Modal } from '../common/Modal';
import { ConfirmDialog } from '../common/ConfirmDialog';

interface CustomerListViewProps {
  customers: Customer[];
  bookings: Booking[];
  transactions: Transaction[];
  onSaveCustomer: (customerData: Partial<Customer>) => void;
  onDeleteCustomer: (id: string) => void;
}

export const CustomerListView: React.FC<CustomerListViewProps> = ({
  customers,
  bookings,
  transactions,
  onSaveCustomer,
  onDeleteCustomer,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // Add/Edit modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customerToEdit, setCustomerToEdit] = useState<Customer | null>(null);
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formNotes, setFormNotes] = useState('');

  // Delete state
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Compute aggregated customer metrics
  const customerStatsMap = useMemo(() => {
    const map: Record<
      string,
      { totalBookings: number; totalSpent: number; lastBookingDate: string; bookings: Booking[]; transactions: Transaction[] }
    > = {};

    for (const cust of customers) {
      const custBookings = bookings.filter((b) => b.customerId === cust.id || b.customerPhone === cust.phone);
      const custTrx = transactions.filter((t) => t.customerId === cust.id || t.customerName === cust.name);

      const totalSpent = custTrx.reduce((acc, t) => acc + (t.depositAmount || 0), 0);

      const sortedDates = custBookings
        .map((b) => b.date)
        .sort((a, b) => b.localeCompare(a));
      const lastBookingDate = sortedDates[0] || cust.createdAt;

      map[cust.id] = {
        totalBookings: custBookings.length,
        totalSpent,
        lastBookingDate,
        bookings: custBookings,
        transactions: custTrx,
      };
    }
    return map;
  }, [customers, bookings, transactions]);

  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      const match =
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.phone.includes(searchTerm) ||
        (c.notes && c.notes.toLowerCase().includes(searchTerm.toLowerCase()));
      return match;
    });
  }, [customers, searchTerm]);

  const handleOpenAdd = () => {
    setCustomerToEdit(null);
    setFormName('');
    setFormPhone('');
    setFormNotes('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (customer: Customer, e: React.MouseEvent) => {
    e.stopPropagation();
    setCustomerToEdit(customer);
    setFormName(customer.name);
    setFormPhone(customer.phone);
    setFormNotes(customer.notes || '');
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formPhone.trim()) return;

    onSaveCustomer({
      id: customerToEdit ? customerToEdit.id : undefined,
      name: formName.trim(),
      phone: formPhone.trim(),
      notes: formNotes.trim(),
    });

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 p-4 sm:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-tight">
            Manajemen Customer
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Daftar pelanggan, riwayat jadwal bermain, dan catatan pembayaran
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Customer</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Cari customer berdasarkan nama, nomor telepon, catatan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-[#1F2937] bg-white placeholder:text-gray-500 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Customer Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {filteredCustomers.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm">
            Tidak ada customer yang ditemukan.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[780px]">
              <thead>
                <tr className="bg-slate-50 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                  <th className="py-3.5 px-4">Nama</th>
                  <th className="py-3.5 px-4">Nomor WhatsApp</th>
                  <th className="py-3.5 px-4 text-center">Total Booking</th>
                  <th className="py-3.5 px-4">Total Transaksi</th>
                  <th className="py-3.5 px-4">Booking Terakhir</th>
                  <th className="py-3.5 px-4">Catatan</th>
                  <th className="py-3.5 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {filteredCustomers.map((cust) => {
                  const stat = customerStatsMap[cust.id] || {
                    totalBookings: 0,
                    totalSpent: 0,
                    lastBookingDate: cust.createdAt,
                  };

                  return (
                    <tr
                      key={cust.id}
                      onClick={() => setSelectedCustomer(cust)}
                      className="hover:bg-emerald-50/40 transition-colors cursor-pointer"
                    >
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs">
                            {cust.name.charAt(0)}
                          </div>
                          <span>{cust.name}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-800">
                        <a
                          href={`https://wa.me/${cleanPhoneNumber(cust.phone)}`}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 font-bold text-emerald-700 hover:text-emerald-900 hover:underline"
                          title="Hubungi Pelanggan via WhatsApp"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>{cust.phone}</span>
                        </a>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 font-bold text-[11px]">
                          {stat.totalBookings} kali
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-emerald-700">
                        {formatRupiah(stat.totalSpent)}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-600">
                        {stat.lastBookingDate}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 max-w-[180px] truncate">
                        {cust.notes || '-'}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={(e) => handleOpenEdit(cust, e)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-700 hover:bg-slate-100 transition-colors"
                            title="Edit Customer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteTargetId(cust.id);
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                            title="Hapus Customer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          <ChevronRight className="w-4 h-4 text-slate-300" />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* DETAIL MODAL: Riwayat Booking & Riwayat Transaksi strictly required */}
      {selectedCustomer && (
        <Modal
          isOpen={Boolean(selectedCustomer)}
          onClose={() => setSelectedCustomer(null)}
          title={`Profil Customer: ${selectedCustomer.name}`}
          subtitle={`No. WA: ${selectedCustomer.phone}`}
          maxWidth="3xl"
        >
          <div className="space-y-6">
            {/* Quick summary header */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
              <div>
                <span className="text-slate-400 block font-bold uppercase tracking-wider">
                  Total Booking
                </span>
                <span className="text-base font-black text-slate-900 mt-0.5 block">
                  {customerStatsMap[selectedCustomer.id]?.totalBookings || 0} Sesi
                </span>
              </div>
              <div>
                <span className="text-slate-400 block font-bold uppercase tracking-wider">
                  Total Transaksi
                </span>
                <span className="text-base font-black text-emerald-700 mt-0.5 block">
                  {formatRupiah(customerStatsMap[selectedCustomer.id]?.totalSpent || 0)}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block font-bold uppercase tracking-wider">
                  Catatan Customer
                </span>
                <span className="text-xs font-semibold text-slate-700 mt-0.5 block">
                  {selectedCustomer.notes || 'Tidak ada catatan'}
                </span>
              </div>
            </div>

            {/* Riwayat Booking */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                <span>Riwayat Booking Lapangan</span>
              </h4>
              <div className="border border-slate-200 rounded-xl overflow-hidden max-h-48 overflow-y-auto">
                {customerStatsMap[selectedCustomer.id]?.bookings.length === 0 ? (
                  <p className="p-4 text-center text-xs text-slate-400">Belum ada booking</p>
                ) : (
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-500">
                      <tr>
                        <th className="p-2.5">Kode</th>
                        <th className="p-2.5">Tanggal</th>
                        <th className="p-2.5">Lapangan</th>
                        <th className="p-2.5">Sesi Jam</th>
                        <th className="p-2.5">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {customerStatsMap[selectedCustomer.id]?.bookings.map((b) => (
                        <tr key={b.id} className="hover:bg-slate-50">
                          <td className="p-2.5 font-mono font-bold text-slate-800">{b.bookingCode}</td>
                          <td className="p-2.5">{b.date}</td>
                          <td className="p-2.5">{b.courtName}</td>
                          <td className="p-2.5">{b.timeSlotLabel}</td>
                          <td className="p-2.5">
                            <BookingStatusBadge status={b.bookingStatus} size="sm" />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            {/* Riwayat Transaksi */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                <Receipt className="w-3.5 h-3.5 text-emerald-600" />
                <span>Riwayat Transaksi Pembayaran</span>
              </h4>
              <div className="border border-slate-200 rounded-xl overflow-hidden max-h-48 overflow-y-auto">
                {customerStatsMap[selectedCustomer.id]?.transactions.length === 0 ? (
                  <p className="p-4 text-center text-xs text-slate-400">Belum ada transaksi</p>
                ) : (
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-500">
                      <tr>
                        <th className="p-2.5">No. Transaksi</th>
                        <th className="p-2.5">Tanggal</th>
                        <th className="p-2.5">Total Biaya</th>
                        <th className="p-2.5">Nominal Bayar</th>
                        <th className="p-2.5">Metode</th>
                        <th className="p-2.5">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {customerStatsMap[selectedCustomer.id]?.transactions.map((t) => (
                        <tr key={t.id} className="hover:bg-slate-50">
                          <td className="p-2.5 font-mono font-bold text-slate-800">
                            {t.transactionNumber}
                          </td>
                          <td className="p-2.5">{t.date}</td>
                          <td className="p-2.5 font-semibold">{formatRupiah(t.totalAmount)}</td>
                          <td className="p-2.5 font-bold text-emerald-700">
                            {formatRupiah(t.depositAmount)}
                          </td>
                          <td className="p-2.5 font-semibold text-slate-600">{t.paymentMethod}</td>
                          <td className="p-2.5">
                            <PaymentStatusBadge status={t.paymentStatus} size="sm" />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl"
              >
                Tutup
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Add / Edit Customer Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={customerToEdit ? 'Edit Customer' : 'Tambah Customer Baru'}
        maxWidth="md"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-900 uppercase tracking-wider mb-1">
              Nama Lengkap <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Hendra Setiawan"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm sm:text-base font-semibold text-[#1F2937] bg-white placeholder:text-gray-500 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-900 uppercase tracking-wider mb-1">
              Nomor WhatsApp <span className="text-rose-500">*</span>
            </label>
            <input
              type="tel"
              required
              placeholder="08123456789"
              value={formPhone}
              onChange={(e) => setFormPhone(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm sm:text-base font-semibold text-[#1F2937] bg-white placeholder:text-gray-500 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-900 uppercase tracking-wider mb-1">
              Catatan Khusus (Komunitas / Klub / Member)
            </label>
            <textarea
              rows={3}
              placeholder="Contoh: Member rutin hari sabtu malam"
              value={formNotes}
              onChange={(e) => setFormNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm sm:text-base font-medium text-[#1F2937] bg-white placeholder:text-gray-500 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-600"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider"
            >
              Simpan Customer
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deleteTargetId)}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={() => {
          if (deleteTargetId) onDeleteCustomer(deleteTargetId);
        }}
        title="Hapus Customer"
        message="Yakin ingin menghapus data customer ini dari sistem?"
        confirmLabel="Ya, Hapus"
        isDanger={true}
      />
    </div>
  );
};

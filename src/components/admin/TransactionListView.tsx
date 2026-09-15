import React, { useState, useMemo } from 'react';
import {
  Search,
  Receipt,
  Plus,
  Calendar,
  CreditCard,
  DollarSign,
  Printer,
  FileSpreadsheet,
  CheckCircle,
  Filter,
} from 'lucide-react';
import { PaymentMethod, PaymentStatus, Transaction } from '../../types';
import { formatRupiah } from '../../services/store';
import { PaymentStatusBadge } from '../common/StatusBadges';
import { Modal } from '../common/Modal';

interface TransactionListViewProps {
  transactions: Transaction[];
  onAddManualTransaction: (trxData: Omit<Transaction, 'id' | 'transactionNumber' | 'createdAt'>) => void;
}

export const TransactionListView: React.FC<TransactionListViewProps> = ({
  transactions,
  onAddManualTransaction,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [methodFilter, setMethodFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Receipt modal
  const [selectedTrx, setSelectedTrx] = useState<Transaction | null>(null);

  // New manual transaction modal
  const [isNewTrxOpen, setIsNewTrxOpen] = useState(false);
  const [custName, setCustName] = useState('');
  const [courtName, setCourtName] = useState('Court 1 (Utama)');
  const [slotLabel, setSlotLabel] = useState('08:00 - 09:00');
  const [total, setTotal] = useState(75000);
  const [deposit, setDeposit] = useState(75000);
  const [method, setMethod] = useState<PaymentMethod>('CASH');
  const [payStatus, setPayStatus] = useState<PaymentStatus>('LUNAS');
  const [notes, setNotes] = useState('Pembayaran langsung kasir');

  // Filtered transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const matchSearch =
        t.transactionNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.bookingCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.courtName.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchSearch) return false;
      if (methodFilter !== 'ALL' && t.paymentMethod !== methodFilter) return false;
      if (statusFilter !== 'ALL' && t.paymentStatus !== statusFilter) return false;

      return true;
    });
  }, [transactions, searchTerm, methodFilter, statusFilter]);

  // Totals
  const totalOmzet = useMemo(() => {
    return filteredTransactions.reduce((acc, t) => acc + (t.depositAmount || 0), 0);
  }, [filteredTransactions]);

  const totalPiutang = useMemo(() => {
    return filteredTransactions.reduce((acc, t) => acc + (t.remainingAmount || 0), 0);
  }, [filteredTransactions]);

  const handleCreateManualTrx = (e: React.FormEvent) => {
    e.preventDefault();
    if (!custName.trim()) return;

    const remaining = Math.max(0, total - deposit);
    onAddManualTransaction({
      bookingId: `manual-${Date.now()}`,
      bookingCode: `MANUAL-${Date.now().toString().slice(-4)}`,
      customerId: `cust-manual`,
      customerName: custName.trim(),
      courtName,
      timeSlotLabel: slotLabel,
      date: new Date().toISOString().slice(0, 10),
      totalAmount: total,
      depositAmount: deposit,
      remainingAmount: remaining,
      paymentMethod: method,
      paymentStatus: deposit >= total ? 'LUNAS' : deposit > 0 ? 'DP' : 'BELUM BAYAR',
      notes,
    });

    setIsNewTrxOpen(false);
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <div className="space-y-6 p-4 sm:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-tight">
            Pencatatan Transaksi Manual
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Log pembayaran Cash, Transfer Bank, QRIS, dan sisa tagihan rental
          </p>
        </div>

        <button
          onClick={() => setIsNewTrxOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Catat Transaksi Manual</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Total Transaksi Tercatat
          </span>
          <p className="text-2xl font-black text-slate-900 mt-1">
            {filteredTransactions.length} <span className="text-xs font-normal text-slate-400">transaksi</span>
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-emerald-200 bg-emerald-50/20 shadow-xs">
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
            Total Uang Diterima (Kas & Bank)
          </span>
          <p className="text-2xl font-black text-emerald-700 mt-1 truncate">
            {formatRupiah(totalOmzet)}
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-amber-200 bg-amber-50/20 shadow-xs">
          <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
            Sisa Tagihan Belum Terbayar (Piutang)
          </span>
          <p className="text-2xl font-black text-amber-700 mt-1 truncate">
            {formatRupiah(totalPiutang)}
          </p>
        </div>
      </div>

      {/* Toolbar Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Search */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Cari nomor TRX, nama, kode booking..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs font-medium bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Method Filter */}
        <div>
          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-slate-50 focus:bg-white focus:outline-hidden"
          >
            <option value="ALL">Semua Metode Pembayaran</option>
            <option value="CASH">CASH (Tunai)</option>
            <option value="TRANSFER">TRANSFER BANK</option>
            <option value="QRIS">QRIS</option>
            <option value="LAINNYA">LAINNYA</option>
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-slate-50 focus:bg-white focus:outline-hidden"
          >
            <option value="ALL">Semua Status Pelunasan</option>
            <option value="LUNAS">LUNAS</option>
            <option value="DP">DP</option>
            <option value="BELUM BAYAR">BELUM BAYAR</option>
          </select>
        </div>
      </div>

      {/* Table strictly according to requested columns */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {filteredTransactions.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm">
            Tidak ada data transaksi yang sesuai filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[840px]">
              <thead>
                <tr className="bg-slate-50 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                  <th className="py-3.5 px-4">Nomor Transaksi</th>
                  <th className="py-3.5 px-4">Tanggal</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Booking</th>
                  <th className="py-3.5 px-4">Lapangan</th>
                  <th className="py-3.5 px-4">Sesi</th>
                  <th className="py-3.5 px-4">Total</th>
                  <th className="py-3.5 px-4">DP / Bayar</th>
                  <th className="py-3.5 px-4">Sisa</th>
                  <th className="py-3.5 px-4">Metode</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Struk</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {filteredTransactions.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      {t.transactionNumber}
                    </td>
                    <td className="py-3.5 px-4">{t.date}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{t.customerName}</td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">{t.bookingCode}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">{t.courtName}</td>
                    <td className="py-3.5 px-4">{t.timeSlotLabel}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      {formatRupiah(t.totalAmount)}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-emerald-700">
                      {formatRupiah(t.depositAmount)}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-rose-700">
                      {t.remainingAmount > 0 ? formatRupiah(t.remainingAmount) : '-'}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold text-[10px]">
                        {t.paymentMethod}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <PaymentStatusBadge status={t.paymentStatus} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedTrx(t)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 border border-slate-200 transition-colors"
                        title="Lihat & Cetak Struk"
                      >
                        <Printer className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* STRUK TRANSAKSI MODAL / PRINT */}
      {selectedTrx && (
        <Modal
          isOpen={Boolean(selectedTrx)}
          onClose={() => setSelectedTrx(null)}
          title="Struk Bukti Pembayaran Manual"
          maxWidth="sm"
        >
          <div className="space-y-4 text-xs font-mono bg-slate-50 p-5 rounded-2xl border border-slate-200">
            <div className="text-center border-b border-dashed border-slate-300 pb-3">
              <h3 className="font-extrabold text-sm uppercase text-slate-900 font-sans">
                GOR BADMINTON
              </h3>
              <p className="text-[11px] text-slate-500">Bukti Pembayaran Rental Lapangan</p>
              <p className="text-[10px] text-slate-400 mt-1">No: {selectedTrx.transactionNumber}</p>
            </div>

            <div className="space-y-1.5 py-1">
              <div className="flex justify-between">
                <span className="text-slate-500">Tanggal:</span>
                <span className="font-bold text-slate-800">{selectedTrx.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Customer:</span>
                <span className="font-bold text-slate-800">{selectedTrx.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Booking:</span>
                <span className="font-bold text-slate-800">{selectedTrx.bookingCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Lapangan:</span>
                <span className="font-bold text-slate-800">{selectedTrx.courtName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Sesi Jam:</span>
                <span className="font-bold text-slate-800">{selectedTrx.timeSlotLabel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Metode Bayar:</span>
                <span className="font-bold text-emerald-700">{selectedTrx.paymentMethod}</span>
              </div>
            </div>

            <div className="border-t border-dashed border-slate-300 pt-3 space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-600">Total Tarif:</span>
                <span className="font-bold">{formatRupiah(selectedTrx.totalAmount)}</span>
              </div>
              <div className="flex justify-between font-bold text-emerald-700">
                <span>Dibayarkan:</span>
                <span>{formatRupiah(selectedTrx.depositAmount)}</span>
              </div>
              <div className="flex justify-between font-bold text-slate-900">
                <span>Sisa Tagihan:</span>
                <span>{formatRupiah(selectedTrx.remainingAmount)}</span>
              </div>
              <div className="flex justify-between pt-1 font-bold">
                <span>Status Pelunasan:</span>
                <span className="text-emerald-700">{selectedTrx.paymentStatus}</span>
              </div>
            </div>

            <div className="text-center pt-3 border-t border-dashed border-slate-300 text-[10px] text-slate-400">
              Terima kasih atas kunjungan Anda di GOR Badminton. Harap patuhi tata tertib lapangan.
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={handlePrintReceipt}
                className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-sans text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak Struk</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedTrx(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-sans text-xs font-bold hover:bg-white"
              >
                Tutup
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Manual Transaction Form Modal */}
      <Modal
        isOpen={isNewTrxOpen}
        onClose={() => setIsNewTrxOpen(false)}
        title="Catat Pembayaran Manual"
        maxWidth="md"
      >
        <form onSubmit={handleCreateManualTrx} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Nama Customer <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Budi Santoso"
              value={custName}
              onChange={(e) => setCustName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Total Biaya (Rp)
              </label>
              <input
                type="number"
                min="0"
                step="5000"
                value={total}
                onChange={(e) => setTotal(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Nominal Bayar (Rp)
              </label>
              <input
                type="number"
                min="0"
                step="5000"
                value={deposit}
                onChange={(e) => setDeposit(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-emerald-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Metode Pembayaran
              </label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value as PaymentMethod)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
              >
                <option value="CASH">CASH (Tunai)</option>
                <option value="TRANSFER">TRANSFER BANK</option>
                <option value="QRIS">QRIS</option>
                <option value="LAINNYA">LAINNYA</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Status Pelunasan
              </label>
              <select
                value={payStatus}
                onChange={(e) => setPayStatus(e.target.value as PaymentStatus)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
              >
                <option value="LUNAS">LUNAS</option>
                <option value="DP">DP</option>
                <option value="BELUM BAYAR">BELUM BAYAR</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Catatan Kasir
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsNewTrxOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-600"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider"
            >
              Simpan Transaksi
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

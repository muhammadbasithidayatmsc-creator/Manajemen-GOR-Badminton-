import React, { useState, useMemo } from 'react';
import {
  Search,
  Crown,
  Users,
  UserCheck,
  UserX,
  AlertTriangle,
  Calendar,
  DollarSign,
  Plus,
  Edit2,
  Trash2,
  Clock,
  Phone,
  Tag,
  ExternalLink,
  ChevronRight,
  RefreshCw,
  X,
  Award,
  Sparkles,
  ShieldCheck,
  FileText,
} from 'lucide-react';
import { Member, Booking, Transaction, MemberStatus } from '../../types';
import { formatRupiah, store } from '../../services/store';
import { cleanPhoneNumber } from '../../utils/whatsapp';
import { Modal } from '../common/Modal';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { useToast } from '../../context/ToastContext';

interface MemberManagementViewProps {
  members: Member[];
  bookings: Booking[];
  transactions: Transaction[];
  onRefresh: () => void;
}

export const MemberManagementView: React.FC<MemberManagementViewProps> = ({
  members,
  bookings,
  transactions,
  onRefresh,
}) => {
  const { success, error: notifyError } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | MemberStatus>('ALL');

  // Selected member for detail view modal
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  // Add / Edit Member Modal
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);

  // Form states
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formAddress, setFormAddress] = useState('');
  const [formStartDate, setFormStartDate] = useState('');
  const [formEndDate, setFormEndDate] = useState('');
  const [formMembershipType, setFormMembershipType] = useState('Member Bulanan Reguler');
  const [formCustomRate, setFormCustomRate] = useState<number>(25000);
  const [formStatus, setFormStatus] = useState<MemberStatus>('ACTIVE');
  const [formNotes, setFormNotes] = useState('');

  // Extend Modal
  const [isExtendOpen, setIsExtendOpen] = useState(false);
  const [extendingMember, setExtendingMember] = useState<Member | null>(null);
  const [extendMonths, setExtendMonths] = useState<number>(1);

  // Delete Confirm
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Dynamic metrics calculation
  const stats = useMemo(() => {
    return store.getMemberStats();
  }, [members, bookings, transactions]);

  // Filtered members list
  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      const matchSearch =
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.phone.includes(searchTerm) ||
        m.memberId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (m.membershipType && m.membershipType.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchStatus = statusFilter === 'ALL' || m.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [members, searchTerm, statusFilter]);

  // Open add form
  const handleOpenAdd = () => {
    const today = new Date();
    const nextMonth = new Date(today);
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    const pad = (n: number) => String(n).padStart(2, '0');
    const startStr = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
    const endStr = `${nextMonth.getFullYear()}-${pad(nextMonth.getMonth() + 1)}-${pad(nextMonth.getDate())}`;

    setEditingMember(null);
    setFormName('');
    setFormPhone('');
    setFormAddress('');
    setFormStartDate(startStr);
    setFormEndDate(endStr);
    setFormMembershipType('Member Bulanan Reguler');
    setFormCustomRate(25000);
    setFormStatus('ACTIVE');
    setFormNotes('');
    setIsFormOpen(true);
  };

  // Open edit form
  const handleOpenEdit = (m: Member) => {
    setEditingMember(m);
    setFormName(m.name);
    setFormPhone(m.phone);
    setFormAddress(m.address || '');
    setFormStartDate(m.startDate);
    setFormEndDate(m.endDate);
    setFormMembershipType(m.membershipType || 'Member Bulanan Reguler');
    setFormCustomRate(m.customHourlyRate || 25000);
    setFormStatus(m.status);
    setFormNotes(m.notes || '');
    setIsFormOpen(true);
  };

  // Save form
  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formPhone.trim()) {
      notifyError('Validasi Gagal', 'Nama dan nomor WhatsApp wajib diisi.');
      return;
    }
    if (!formStartDate || !formEndDate) {
      notifyError('Validasi Gagal', 'Tanggal mulai dan berakhir keanggotaan wajib diisi.');
      return;
    }

    try {
      if (editingMember) {
        store.updateMember(editingMember.id, {
          name: formName.trim(),
          phone: formPhone.trim(),
          address: formAddress.trim(),
          startDate: formStartDate,
          endDate: formEndDate,
          membershipType: formMembershipType,
          customHourlyRate: Number(formCustomRate) || 25000,
          status: formStatus,
          notes: formNotes.trim(),
        });
        success('Member Diperbarui', `Data member ${formName} berhasil disimpan.`);
      } else {
        store.addMember({
          name: formName.trim(),
          phone: formPhone.trim(),
          address: formAddress.trim(),
          startDate: formStartDate,
          endDate: formEndDate,
          membershipType: formMembershipType,
          customHourlyRate: Number(formCustomRate) || 25000,
          status: formStatus,
          notes: formNotes.trim(),
        });
        success('Member Didaftarkan', `Member baru ${formName} berhasil didaftarkan dengan tarif Rp${Number(formCustomRate).toLocaleString('id-ID')}/jam.`);
      }
      setIsFormOpen(false);
      onRefresh();
    } catch (err: any) {
      notifyError('Gagal Menyimpan', err.message || 'Terjadi kesalahan sistem.');
    }
  };

  // Open extend modal
  const handleOpenExtend = (m: Member) => {
    setExtendingMember(m);
    setExtendMonths(1);
    setIsExtendOpen(true);
  };

  const handleConfirmExtend = () => {
    if (!extendingMember) return;
    try {
      store.extendMember(extendingMember.id, extendMonths);
      success('Perpanjangan Berhasil', `Keanggotaan ${extendingMember.name} diperpanjang +${extendMonths} bulan.`);
      setIsExtendOpen(false);
      setExtendingMember(null);
      onRefresh();
    } catch (err: any) {
      notifyError('Gagal Memperpanjang', err.message || 'Terjadi kesalahan sistem.');
    }
  };

  // Delete member
  const handleConfirmDelete = () => {
    if (!deleteTargetId) return;
    try {
      store.deleteMember(deleteTargetId);
      success('Member Dihapus', 'Data member berhasil dihapus.');
      setDeleteTargetId(null);
      if (selectedMember && selectedMember.id === deleteTargetId) {
        setSelectedMember(null);
      }
      onRefresh();
    } catch (err: any) {
      notifyError('Gagal Menghapus', err.message || 'Terjadi kesalahan sistem.');
    }
  };

  // Status Badge Helper
  const renderStatusBadge = (status: MemberStatus, endDate: string) => {
    const today = new Date().toISOString().split('T')[0];
    const isExpired = endDate < today;

    if (isExpired || status === 'EXPIRED') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
          <UserX className="w-3 h-3 text-rose-500" />
          Expired
        </span>
      );
    }
    if (status === 'INACTIVE') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
          <Clock className="w-3 h-3 text-slate-400" />
          Tidak Aktif
        </span>
      );
    }

    // Check if expiring within 14 days
    const end = new Date(endDate).getTime();
    const now = new Date(today).getTime();
    const diffDays = Math.ceil((end - now) / (1000 * 60 * 60 * 24));

    if (diffDays <= 14 && diffDays >= 0) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
          <AlertTriangle className="w-3 h-3 text-amber-500" />
          Akan Expired ({diffDays} hari)
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
        <UserCheck className="w-3 h-3 text-emerald-500" />
        Aktif
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-sm">
              <Crown className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Manajemen Member Bulanan
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            Kelola data keanggotaan member bulanan, tarif khusus Rp25.000/jam, masa aktif, dan riwayat booking.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onRefresh}
            className="p-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-600 transition-colors shadow-2xs"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold transition-all shadow-sm hover:shadow-md"
          >
            <Plus className="w-4 h-4" />
            Tambah Member Baru
          </button>
        </div>
      </div>

      {/* 6 Metric Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Total Member */}
        <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Total Member</span>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-slate-900">{stats.totalMembers}</span>
            <p className="text-[11px] text-slate-400 mt-0.5">Terdaftar di sistem</p>
          </div>
        </div>

        {/* Member Aktif */}
        <div className="p-4 rounded-xl border border-emerald-100 bg-emerald-50/40 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-emerald-800 text-xs font-semibold">
            <span>Member Aktif</span>
            <UserCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-emerald-700">{stats.activeMembers}</span>
            <p className="text-[11px] text-emerald-600/80 mt-0.5">Berhak tarif khusus</p>
          </div>
        </div>

        {/* Member Tidak Aktif */}
        <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Tidak Aktif</span>
            <UserX className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-slate-700">{stats.inactiveMembers}</span>
            <p className="text-[11px] text-slate-400 mt-0.5">Dinonaktifkan</p>
          </div>
        </div>

        {/* Member Akan Expired */}
        <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-amber-800 text-xs font-semibold">
            <span>Akan Expired</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-amber-700">{stats.expiringSoonMembers}</span>
            <p className="text-[11px] text-amber-600/80 mt-0.5">&le; 14 hari ke depan</p>
          </div>
        </div>

        {/* Booking Member Bulan Ini */}
        <div className="p-4 rounded-xl border border-purple-100 bg-purple-50/40 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-purple-800 text-xs font-semibold">
            <span>Booking Bulan Ini</span>
            <Calendar className="w-4 h-4 text-purple-600" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-purple-700">{stats.monthlyMemberBookings}</span>
            <p className="text-[11px] text-purple-600/80 mt-0.5">Sesi terjadwal</p>
          </div>
        </div>

        {/* Total Transaksi Member */}
        <div className="p-4 rounded-xl border border-blue-100 bg-blue-50/40 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-blue-800 text-xs font-semibold">
            <span>Total Transaksi</span>
            <DollarSign className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-2">
            <span className="text-lg sm:text-xl font-bold text-blue-900 truncate">
              {formatRupiah(stats.totalMemberRevenue)}
            </span>
            <p className="text-[11px] text-blue-600/80 mt-0.5">Akumulasi sewa</p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nama, ID member, no WA..."
            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white text-slate-900 placeholder:text-slate-400"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <button
            type="button"
            onClick={() => setStatusFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              statusFilter === 'ALL'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Semua ({members.length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('ACTIVE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              statusFilter === 'ACTIVE'
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
            }`}
          >
            Aktif ({stats.activeMembers})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('INACTIVE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              statusFilter === 'INACTIVE'
                ? 'bg-slate-700 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Tidak Aktif ({stats.inactiveMembers})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('EXPIRED')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              statusFilter === 'EXPIRED'
                ? 'bg-rose-600 text-white'
                : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
            }`}
          >
            Expired ({stats.expiredMembers})
          </button>
        </div>
      </div>

      {/* Member Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Member</th>
                <th className="py-3 px-4">Kontak WhatsApp</th>
                <th className="py-3 px-4">Periode Keanggotaan</th>
                <th className="py-3 px-4">Jenis & Tarif</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Crown className="w-8 h-8 text-slate-300" />
                      <p className="text-sm font-medium text-slate-600">Tidak ada data member yang sesuai</p>
                      <p className="text-xs text-slate-400">
                        {searchTerm ? 'Coba ganti kata kunci pencarian.' : 'Klik tombol Tambah Member Baru untuk mendaftarkan.'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredMembers.map((m) => {
                  const waNumber = cleanPhoneNumber(m.phone);
                  const isExp = m.endDate < new Date().toISOString().split('T')[0];

                  return (
                    <tr key={m.id} className="hover:bg-slate-50/60 transition-colors">
                      {/* Name & ID */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-amber-600 text-white flex items-center justify-center font-bold text-xs shadow-2xs shrink-0">
                            {m.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                              <span>{m.name}</span>
                              <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-normal">
                                {m.memberId}
                              </span>
                            </div>
                            {m.address && (
                              <p className="text-[11px] text-slate-400 truncate max-w-[200px]">
                                {m.address}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Phone & WA */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-slate-800 font-medium">{m.phone}</span>
                          <a
                            href={`https://wa.me/${waNumber}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 rounded-md text-emerald-600 hover:bg-emerald-50 transition-colors"
                            title="Chat WhatsApp"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </td>

                      {/* Period */}
                      <td className="py-3 px-4">
                        <div className="space-y-0.5">
                          <div className="text-slate-800 font-medium">
                            {m.startDate} s/d {m.endDate}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {isExp ? 'Telah berakhir' : 'Aktif hingga akhir periode'}
                          </div>
                        </div>
                      </td>

                      {/* Type & Rate */}
                      <td className="py-3 px-4">
                        <div className="space-y-0.5">
                          <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-purple-50 text-purple-700 border border-purple-200">
                            {m.membershipType || 'Member Bulanan'}
                          </span>
                          <div className="font-bold text-emerald-700 text-xs">
                            {formatRupiah(m.customHourlyRate || 25000)} / jam
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        {renderStatusBadge(m.status, m.endDate)}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={() => setSelectedMember(m)}
                            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-[11px] transition-colors"
                            title="Lihat Detail & Riwayat"
                          >
                            Detail
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenExtend(m)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-medium text-[11px] transition-colors"
                            title="Perpanjang Keanggotaan"
                          >
                            Perpanjang
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(m)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                            title="Edit Data Member"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteTargetId(m.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Hapus Member"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Tambah / Edit Member */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingMember ? `Edit Data Member (${editingMember.memberId})` : 'Daftarkan Member Bulanan Baru'}
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSaveForm} className="space-y-4 text-xs">
          <div className="p-3 bg-amber-50/80 border border-amber-200/80 rounded-xl text-amber-900 flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-[11px] leading-relaxed">
              Member Bulanan berhak mendapatkan <strong>tarif spesial Rp25.000/jam</strong> (dapat disesuaikan) saat booking lapangan. Sistem secara otomatis menerapkan harga ini saat nama member dipilih pada form booking.
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                Nama Lengkap Member <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="Contoh: Hendra Setiawan"
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white text-slate-900 placeholder:text-slate-400"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                Nomor WhatsApp <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formPhone}
                onChange={(e) => setFormPhone(e.target.value)}
                placeholder="Contoh: 081234567890"
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white text-slate-900 placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                Tanggal Mulai Keanggotaan <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={formStartDate}
                onChange={(e) => setFormStartDate(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white text-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                Tanggal Berakhir Keanggotaan <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={formEndDate}
                onChange={(e) => setFormEndDate(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                Jenis Membership
              </label>
              <select
                value={formMembershipType}
                onChange={(e) => setFormMembershipType(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white text-slate-900"
              >
                <option value="Member Bulanan Reguler">Member Bulanan Reguler</option>
                <option value="Member Bulanan VIP">Member Bulanan VIP</option>
                <option value="Member Komunitas Badminton">Member Komunitas Badminton</option>
                <option value="Member Instansi / Corporate">Member Instansi / Corporate</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                Tarif Khusus Member (/jam) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-xs">
                  Rp
                </span>
                <input
                  type="number"
                  min="0"
                  step="1000"
                  required
                  value={formCustomRate}
                  onChange={(e) => setFormCustomRate(Number(e.target.value))}
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm font-semibold rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                Status Member
              </label>
              <select
                value={formStatus}
                onChange={(e) => setFormStatus(e.target.value as MemberStatus)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white text-slate-900"
              >
                <option value="ACTIVE">Aktif</option>
                <option value="INACTIVE">Tidak Aktif</option>
                <option value="EXPIRED">Expired</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-800 mb-1">
              Alamat Lengkap (Opsional)
            </label>
            <input
              type="text"
              value={formAddress}
              onChange={(e) => setFormAddress(e.target.value)}
              placeholder="Contoh: Jl. Melati No. 12, Komplek Griya Asri"
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white text-slate-900 placeholder:text-slate-400"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-800 mb-1">
              Catatan / Keterangan Tambahan
            </label>
            <textarea
              rows={2}
              value={formNotes}
              onChange={(e) => setFormNotes(e.target.value)}
              placeholder="Catatan hari bermain favorit, grup mabar, atau preferensi lapangan..."
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white text-slate-900 placeholder:text-slate-400"
            />
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-50 font-medium transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-all shadow-sm"
            >
              {editingMember ? 'Simpan Perubahan' : 'Daftarkan Member'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Perpanjang Keanggotaan */}
      <Modal
        isOpen={isExtendOpen}
        onClose={() => setIsExtendOpen(false)}
        title={`Perpanjang Masa Member: ${extendingMember?.name || ''}`}
        maxWidth="max-w-md"
      >
        {extendingMember && (
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">ID Member:</span>
                <span className="font-mono font-bold text-slate-800">{extendingMember.memberId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Berlaku Saat Ini:</span>
                <span className="font-semibold text-slate-800">{extendingMember.endDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Tarif Khusus:</span>
                <span className="font-bold text-emerald-700">
                  {formatRupiah(extendingMember.customHourlyRate || 25000)} / jam
                </span>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-800 mb-2">
                Pilih Durasi Perpanjangan:
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[1, 3, 6, 12].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setExtendMonths(m)}
                    className={`py-2 px-1 rounded-xl text-xs font-semibold border transition-all ${
                      extendMonths === m
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-300 hover:border-emerald-400'
                    }`}
                  >
                    +{m} Bulan
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl text-emerald-900 space-y-1">
              <span className="font-semibold block text-xs">Estimasi Tanggal Berakhir Baru:</span>
              <p className="text-sm font-bold font-mono">
                {(() => {
                  try {
                    const base = new Date(extendingMember.endDate);
                    const now = new Date();
                    const validBase = base > now ? base : now;
                    const next = new Date(validBase);
                    next.setMonth(next.getMonth() + extendMonths);
                    return next.toLocaleDateString('id-ID', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    });
                  } catch {
                    return `+${extendMonths} Bulan`;
                  }
                })()}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsExtendOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-50 font-medium transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmExtend}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-all shadow-sm"
              >
                Konfirmasi Perpanjang
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal: Detail Member & Riwayat Booking */}
      <Modal
        isOpen={!!selectedMember}
        onClose={() => setSelectedMember(null)}
        title={`Profil & Riwayat Booking Member`}
        maxWidth="max-w-2xl"
      >
        {selectedMember && (() => {
          const memberBookings = bookings.filter(
            (b) =>
              b.memberId === selectedMember.memberId ||
              b.customerPhone === selectedMember.phone ||
              b.customerName.toLowerCase() === selectedMember.name.toLowerCase()
          );

          const memberTransactions = transactions.filter(
            (t) =>
              t.memberId === selectedMember.memberId ||
              t.customerName.toLowerCase() === selectedMember.name.toLowerCase()
          );

          const totalSpending = memberTransactions.reduce((acc, t) => acc + (t.depositAmount || 0), 0);

          return (
            <div className="space-y-4 text-xs">
              {/* Member Card Header */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-400 to-amber-500 text-slate-950 flex items-center justify-center font-bold text-lg shadow-inner">
                    <Crown className="w-6 h-6 text-slate-950" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-white">{selectedMember.name}</h3>
                    <p className="font-mono text-xs text-amber-300">ID: {selectedMember.memberId}</p>
                    <p className="text-[11px] text-slate-300 mt-0.5">
                      {selectedMember.membershipType || 'Member Bulanan'}
                    </p>
                  </div>
                </div>

                <div className="text-left sm:text-right space-y-1">
                  <div className="text-[11px] text-slate-400">Tarif Khusus Member:</div>
                  <div className="text-base font-bold text-emerald-400">
                    {formatRupiah(selectedMember.customHourlyRate || 25000)} / jam
                  </div>
                  <div className="text-[11px] text-slate-300">
                    Periode: {selectedMember.startDate} s/d {selectedMember.endDate}
                  </div>
                </div>
              </div>

              {/* Stats Overview */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
                  <span className="text-slate-500 text-[11px]">Total Booking</span>
                  <p className="text-lg font-bold text-slate-900 mt-0.5">{memberBookings.length}</p>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
                  <span className="text-slate-500 text-[11px]">Total Transaksi</span>
                  <p className="text-lg font-bold text-emerald-700 mt-0.5">{formatRupiah(totalSpending)}</p>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
                  <span className="text-slate-500 text-[11px]">Status</span>
                  <div className="mt-1">
                    {renderStatusBadge(selectedMember.status, selectedMember.endDate)}
                  </div>
                </div>
              </div>

              {/* Riwayat Booking */}
              <div className="space-y-2">
                <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                  <span className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    Riwayat Booking ({memberBookings.length})
                  </span>
                </div>

                {memberBookings.length === 0 ? (
                  <div className="p-6 text-center text-slate-400 bg-slate-50 rounded-xl">
                    Belum ada riwayat booking untuk member ini.
                  </div>
                ) : (
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {memberBookings.map((b) => (
                      <div
                        key={b.id}
                        className="p-3 rounded-xl border border-slate-200 bg-white flex items-center justify-between shadow-2xs hover:border-slate-300"
                      >
                        <div className="space-y-0.5">
                          <div className="font-semibold text-slate-900 flex items-center gap-2">
                            <span>{b.courtName}</span>
                            <span className="font-mono text-[10px] text-slate-400">#{b.bookingCode}</span>
                          </div>
                          <div className="text-slate-500 text-[11px]">
                            {b.date} • {b.timeSlotLabel} ({b.durationHours || 1} Jam)
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-slate-900">{formatRupiah(b.totalAmount)}</div>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            b.paymentStatus === 'LUNAS'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-amber-100 text-amber-700'
                          }`}>
                            {b.paymentStatus}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                <a
                  href={`https://wa.me/${cleanPhoneNumber(selectedMember.phone)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-medium transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  Hubungi via WhatsApp
                </a>
                <button
                  type="button"
                  onClick={() => setSelectedMember(null)}
                  className="px-4 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium"
                >
                  Tutup
                </button>
              </div>
            </div>
          );
        })()}
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTargetId}
        title="Hapus Member Bulanan?"
        message="Data keanggotaan member ini akan dihapus dari sistem. Riwayat transaksi sebelumnya tetap tersimpan di arsip laporan."
        confirmText="Hapus Member"
        cancelText="Batal"
        variant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
};

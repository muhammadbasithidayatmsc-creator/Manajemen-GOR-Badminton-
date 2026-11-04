import React, { useState } from 'react';
import {
  Layers,
  Plus,
  Edit2,
  Trash2,
  Power,
  CheckCircle2,
  AlertCircle,
  Clock,
  DollarSign,
  Calendar,
  Sparkles,
  ShieldCheck,
  Award,
  Crown,
  FileText,
  Timer,
  Check,
} from 'lucide-react';
import { MemberPackage, PackagePricingModel } from '../../types';
import { formatRupiah, store } from '../../services/store';
import { Modal } from '../common/Modal';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { useToast } from '../../context/ToastContext';

interface MemberPackageManagementViewProps {
  packages: MemberPackage[];
  onRefresh: () => void;
}

const PRESET_SESSION_COUNTS = [4, 8, 12, 16];
const PRESET_DURATIONS = [1, 2, 3, 4, 5];

export const MemberPackageManagementView: React.FC<MemberPackageManagementViewProps> = ({
  packages,
  onRefresh,
}) => {
  const { success, error } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPkg, setEditingPkg] = useState<MemberPackage | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [pricingModel, setPricingModel] = useState<PackagePricingModel>('FIXED_PACKAGE');
  const [price, setPrice] = useState(300000);
  const [memberHourlyRate, setMemberHourlyRate] = useState(25000);
  const [sessionCount, setSessionCount] = useState(4);
  const [durationHours, setDurationHours] = useState(3);
  const [validityMonths, setValidityMonths] = useState(1);
  const [description, setDescription] = useState('');
  const [active, setActive] = useState(true);

  // Delete State
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const handleOpenAdd = () => {
    setEditingPkg(null);
    setName('');
    setPricingModel('FIXED_PACKAGE');
    setPrice(300000);
    setMemberHourlyRate(25000);
    setSessionCount(4);
    setDurationHours(3);
    setValidityMonths(1);
    setDescription('');
    setActive(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (pkg: MemberPackage) => {
    setEditingPkg(pkg);
    setName(pkg.name);
    setPricingModel(pkg.pricingModel || 'FIXED_PACKAGE');
    setPrice(pkg.price);
    setMemberHourlyRate(pkg.memberHourlyRate || 25000);
    setSessionCount(pkg.sessionCount || 4);
    setDurationHours(pkg.durationHours || 3);
    setValidityMonths(pkg.validityMonths || 1);
    setDescription(pkg.description || '');
    setActive(pkg.active);
    setIsModalOpen(true);
  };

  const handleToggleActive = (pkg: MemberPackage) => {
    const updated = store.toggleMemberPackageActive(pkg.id);
    if (updated) {
      success('Status Paket Diubah', `Paket "${pkg.name}" kini ${updated.active ? 'Aktif' : 'Nonaktif'}.`);
      onRefresh();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      error('Data Tidak Lengkap', 'Nama paket membership wajib diisi.');
      return;
    }

    if (sessionCount <= 0 || durationHours <= 0) {
      error('Data Tidak Valid', 'Jumlah sesi dan durasi bermain minimal 1.');
      return;
    }

    try {
      if (editingPkg) {
        store.updateMemberPackage(editingPkg.id, {
          name: name.trim(),
          pricingModel,
          price: pricingModel === 'FIXED_PACKAGE' ? price : 0,
          memberHourlyRate,
          sessionCount: Number(sessionCount),
          durationHours: Number(durationHours),
          validityMonths: Number(validityMonths) || 1,
          description: description.trim(),
          active,
        });
        success('Paket Diperbarui', `Paket "${name}" berhasil diperbarui.`);
      } else {
        store.addMemberPackage({
          name: name.trim(),
          pricingModel,
          price: pricingModel === 'FIXED_PACKAGE' ? price : 0,
          memberHourlyRate,
          sessionCount: Number(sessionCount),
          durationHours: Number(durationHours),
          validityMonths: Number(validityMonths) || 1,
          description: description.trim(),
          active,
        });
        success('Paket Dibuat', `Paket membership baru "${name}" berhasil ditambahkan.`);
      }

      setIsModalOpen(false);
      onRefresh();
    } catch (err: any) {
      error('Gagal Menyimpan', err.message || 'Terjadi kesalahan sistem.');
    }
  };

  const handleConfirmDelete = () => {
    if (!deleteTargetId) return;
    const ok = store.deleteMemberPackage(deleteTargetId);
    if (ok) {
      success('Paket Dihapus', 'Paket membership berhasil dihapus.');
      setDeleteTargetId(null);
      onRefresh();
    } else {
      error('Gagal Menghapus', 'Paket tidak ditemukan.');
    }
  };

  // Live calculation preview
  const calculatedTotalHours = (Number(sessionCount) || 1) * (Number(durationHours) || 1);
  const estimatedPerSessionCost = pricingModel === 'FIXED_PACKAGE'
    ? Math.round(price / (Number(sessionCount) || 1))
    : memberHourlyRate * (Number(durationHours) || 1);
  const totalCalculatedFlexible = (Number(sessionCount) || 1) * (Number(durationHours) || 1) * memberHourlyRate;

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-white shadow-sm">
              <Layers className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Pengaturan Paket Member Bulanan
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-800 border border-indigo-200">
              Khusus Owner
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            Kelola master paket keanggotaan, jumlah sesi pertemuan (4, 8, 12, atau kustom), durasi jam, tarif khusus Rp25.000/jam, dan model harga.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold transition-all shadow-sm hover:shadow-md cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Paket Member Baru</span>
        </button>
      </div>

      {/* Stats Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs">
          <span className="text-slate-500 text-xs font-medium">Total Paket</span>
          <p className="text-2xl font-bold text-slate-900 mt-1">{packages.length}</p>
          <span className="text-[11px] text-slate-400">Dikonfigurasi Owner</span>
        </div>

        <div className="p-4 rounded-xl border border-emerald-100 bg-emerald-50/40 shadow-2xs">
          <span className="text-emerald-800 text-xs font-semibold">Paket Aktif</span>
          <p className="text-2xl font-bold text-emerald-700 mt-1">
            {packages.filter((p) => p.active).length}
          </p>
          <span className="text-[11px] text-emerald-600">Dapat dipilih Admin & Publik</span>
        </div>

        <div className="p-4 rounded-xl border border-purple-100 bg-purple-50/40 shadow-2xs">
          <span className="text-purple-800 text-xs font-semibold">Paket Fixed Bulanan</span>
          <p className="text-2xl font-bold text-purple-700 mt-1">
            {packages.filter((p) => p.pricingModel === 'FIXED_PACKAGE').length}
          </p>
          <span className="text-[11px] text-purple-600">Satu harga per bulan</span>
        </div>

        <div className="p-4 rounded-xl border border-blue-100 bg-blue-50/40 shadow-2xs">
          <span className="text-blue-800 text-xs font-semibold">Fleksibel Per Sesi</span>
          <p className="text-2xl font-bold text-blue-700 mt-1">
            {packages.filter((p) => p.pricingModel === 'PER_SESSION').length}
          </p>
          <span className="text-[11px] text-blue-600">Kalkulasi per sesi bermain</span>
        </div>
      </div>

      {/* Package Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {packages.map((pkg) => {
          const totalHours = pkg.sessionCount * pkg.durationHours;
          const isFixed = pkg.pricingModel === 'FIXED_PACKAGE';

          return (
            <div
              key={pkg.id}
              className={`rounded-2xl border transition-all p-5 flex flex-col justify-between shadow-2xs hover:shadow-md ${
                pkg.active
                  ? 'bg-white border-slate-200'
                  : 'bg-slate-50/80 border-slate-200 opacity-70'
              }`}
            >
              <div className="space-y-3">
                {/* Header row with badges */}
                <div className="flex items-start justify-between gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      isFixed
                        ? 'bg-purple-100 text-purple-800 border border-purple-200'
                        : 'bg-blue-100 text-blue-800 border border-blue-200'
                    }`}
                  >
                    {isFixed ? 'Paket Bulanan (Fixed)' : 'Fleksibel Per Sesi'}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleToggleActive(pkg)}
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold transition-colors cursor-pointer ${
                      pkg.active
                        ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                        : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                    }`}
                    title={pkg.active ? 'Klik untuk nonaktifkan' : 'Klik untuk aktifkan'}
                  >
                    <Power className="w-2.5 h-2.5" />
                    <span>{pkg.active ? 'Aktif' : 'Nonaktif'}</span>
                  </button>
                </div>

                {/* Package Name */}
                <div>
                  <h3 className="font-bold text-base text-slate-900 flex items-center gap-1.5">
                    <Crown className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>{pkg.name}</span>
                  </h3>
                  {pkg.description && (
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {pkg.description}
                    </p>
                  )}
                </div>

                {/* Pricing Box */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex items-baseline justify-between">
                    <span className="text-[11px] text-slate-500">Harga Paket:</span>
                    <span className="text-base font-extrabold text-slate-900">
                      {isFixed ? formatRupiah(pkg.price) : 'Hitung Per Sesi'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200/80">
                    <span className="text-slate-500">Tarif Khusus Member:</span>
                    <span className="font-bold text-emerald-700">
                      {formatRupiah(pkg.memberHourlyRate || 25000)} / jam
                    </span>
                  </div>
                </div>

                {/* Session Specifications */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 rounded-lg bg-emerald-50/60 border border-emerald-100">
                    <span className="text-[10px] text-emerald-700 block font-medium">Jumlah Sesi</span>
                    <strong className="text-sm text-emerald-950 font-bold">
                      {pkg.sessionCount}x / bln
                    </strong>
                  </div>
                  <div className="p-2 rounded-lg bg-blue-50/60 border border-blue-100">
                    <span className="text-[10px] text-blue-700 block font-medium">Durasi / Sesi</span>
                    <strong className="text-sm text-blue-950 font-bold">
                      {pkg.durationHours} Jam
                    </strong>
                  </div>
                  <div className="p-2 rounded-lg bg-amber-50/60 border border-amber-100">
                    <span className="text-[10px] text-amber-700 block font-medium">Total Waktu</span>
                    <strong className="text-sm text-amber-950 font-bold">
                      {totalHours} Jam
                    </strong>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
                  <span>Masa Berlaku: {pkg.validityMonths || 1} Bulan</span>
                  <span>Estimasi @ {formatRupiah(isFixed ? Math.round(pkg.price / pkg.sessionCount) : (pkg.memberHourlyRate * pkg.durationHours))} / sesi</span>
                </div>
              </div>

              {/* Action buttons footer */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end gap-1.5">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(pkg)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>Edit Paket</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteTargetId(pkg.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-colors cursor-pointer"
                  title="Hapus Paket"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Tambah / Edit Paket Member */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingPkg ? `Edit Paket: ${editingPkg.name}` : 'Buat Paket Member Bulanan Baru'}
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="p-3 bg-amber-50/80 border border-amber-200/80 rounded-xl text-amber-900 flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-[11px] leading-relaxed">
              Paket ini akan menjadi pilihan utama saat mendaftarkan member bulanan di Dashboard Admin maupun di formulir booking publik. Jumlah sesi dan durasi fleksibel dapat ditentukan bebas oleh Owner.
            </div>
          </div>

          {/* Nama Paket */}
          <div>
            <label className="block font-semibold text-slate-800 mb-1">
              Nama Paket Member <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Member Bulanan Reguler (4 Sesi)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm font-semibold rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white text-slate-900 placeholder:text-slate-400"
            />
          </div>

          {/* Model Harga: Fixed vs Per Sesi */}
          <div>
            <label className="block font-semibold text-slate-800 mb-1.5">
              Model Penagihan Biaya:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPricingModel('FIXED_PACKAGE')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  pricingModel === 'FIXED_PACKAGE'
                    ? 'bg-purple-50 border-purple-400 text-purple-900 ring-1 ring-purple-400 shadow-2xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                <div className="font-bold text-xs flex items-center justify-between">
                  <span>Paket Bulanan (Fixed)</span>
                  {pricingModel === 'FIXED_PACKAGE' && <Check className="w-4 h-4 text-purple-600" />}
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Satu harga total tetap untuk seluruh sesi bulanan (contoh: Rp300.000).
                </p>
              </button>

              <button
                type="button"
                onClick={() => setPricingModel('PER_SESSION')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  pricingModel === 'PER_SESSION'
                    ? 'bg-blue-50 border-blue-400 text-blue-900 ring-1 ring-blue-400 shadow-2xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                <div className="font-bold text-xs flex items-center justify-between">
                  <span>Fleksibel Per Sesi</span>
                  {pricingModel === 'PER_SESSION' && <Check className="w-4 h-4 text-blue-600" />}
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Dihitung otomatis: Jumlah sesi &times; durasi &times; tarif member Rp25.000/jam.
                </p>
              </button>
            </div>
          </div>

          {/* Pricing inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {pricingModel === 'FIXED_PACKAGE' && (
              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Harga Total Paket per Bulan (Rp) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">
                    Rp
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="5000"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm font-bold rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 bg-white text-slate-900"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                Tarif Khusus Member per Jam (Rp) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">
                  Rp
                </span>
                <input
                  type="number"
                  min="0"
                  step="1000"
                  required
                  value={memberHourlyRate}
                  onChange={(e) => setMemberHourlyRate(Number(e.target.value))}
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm font-bold rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white text-slate-900"
                />
              </div>
              <span className="text-[10px] text-slate-400 mt-0.5 block">Default: Rp25.000/jam</span>
            </div>
          </div>

          {/* Jumlah Sesi & Durasi */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                Jumlah Sesi per Bulan <span className="text-rose-500">*</span>
              </label>
              <div className="flex items-center gap-1.5 mb-1.5">
                {PRESET_SESSION_COUNTS.map((cnt) => (
                  <button
                    key={cnt}
                    type="button"
                    onClick={() => setSessionCount(cnt)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      sessionCount === cnt
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {cnt}x
                  </button>
                ))}
              </div>
              <input
                type="number"
                min="1"
                max="31"
                required
                value={sessionCount}
                onChange={(e) => setSessionCount(Number(e.target.value))}
                placeholder="Atau masukkan jumlah sesi kustom"
                className="w-full px-3 py-2 text-xs sm:text-sm font-semibold rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-white text-slate-900"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                Contoh: 4x (1x seminggu), 8x (2x seminggu), 12x (3x seminggu), atau kustom.
              </span>
            </div>

            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                Durasi Jam Bermain per Sesi <span className="text-rose-500">*</span>
              </label>
              <div className="flex items-center gap-1.5 mb-1.5">
                {PRESET_DURATIONS.map((dur) => (
                  <button
                    key={dur}
                    type="button"
                    onClick={() => setDurationHours(dur)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      durationHours === dur
                        ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {dur} Jam
                  </button>
                ))}
              </div>
              <input
                type="number"
                min="1"
                max="8"
                required
                value={durationHours}
                onChange={(e) => setDurationHours(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs sm:text-sm font-semibold rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white text-slate-900"
              />
            </div>
          </div>

          {/* Live Preview Summary */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
            <span className="font-bold text-slate-800 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Kalkulasi Spesifikasi Paket:
            </span>
            <div className="grid grid-cols-2 gap-2 pt-1 text-slate-700">
              <div>
                Total Jam Bermain: <strong>{calculatedTotalHours} Jam / Bulan</strong>
              </div>
              <div>
                Biaya per Sesi: <strong>{formatRupiah(estimatedPerSessionCost)}</strong>
              </div>
              {pricingModel === 'PER_SESSION' && (
                <div className="col-span-2 text-blue-700 font-semibold">
                  Estimasi Total Biaya Bulanan: {formatRupiah(totalCalculatedFlexible)} ({sessionCount} sesi &times; {durationHours} jam &times; {formatRupiah(memberHourlyRate)})
                </div>
              )}
            </div>
          </div>

          {/* Keterangan */}
          <div>
            <label className="block font-semibold text-slate-800 mb-1">
              Keterangan / Fasilitas Paket (Opsional)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Contoh: Termasuk shuttlecock latihan, prioritas booking lapangan, free locker..."
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-white text-slate-900 placeholder:text-slate-400"
            />
          </div>

          {/* Status Aktif */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="pkg-active-checkbox"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
              className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer"
            />
            <label htmlFor="pkg-active-checkbox" className="text-xs font-semibold text-slate-800 cursor-pointer">
              Aktifkan paket ini (dapat langsung dipilih saat pendaftaran member)
            </label>
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-50 font-medium transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-all shadow-sm cursor-pointer"
            >
              {editingPkg ? 'Simpan Perubahan' : 'Buat Paket'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deleteTargetId)}
        title="Hapus Paket Member?"
        message="Paket member ini akan dihapus dari pilihan master. Member yang sudah terdaftar dengan paket ini sebelumnya tetap aman dan aktif."
        confirmText="Hapus Paket"
        cancelText="Batal"
        variant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
};

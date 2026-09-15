import React, { useState } from 'react';
import {
  Grid,
  Plus,
  Edit2,
  Trash2,
  Wrench,
  Power,
  CheckCircle2,
  AlertCircle,
  FileText,
  DollarSign,
} from 'lucide-react';
import { Court, CourtStatus } from '../../types';
import { formatRupiah } from '../../services/store';
import { CourtStatusBadge } from '../common/StatusBadges';
import { Modal } from '../common/Modal';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { useToast } from '../../context/ToastContext';

interface CourtManagementViewProps {
  courts: Court[];
  onAddCourt: (court: Omit<Court, 'id'>) => void;
  onUpdateCourt: (id: string, updates: Partial<Court>) => void;
  onDeleteCourt: (id: string) => void;
}

export const CourtManagementView: React.FC<CourtManagementViewProps> = ({
  courts,
  onAddCourt,
  onUpdateCourt,
  onDeleteCourt,
}) => {
  const { success, error } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [courtToEdit, setCourtToEdit] = useState<Court | null>(null);

  // Form fields
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [status, setStatus] = useState<CourtStatus>('ACTIVE');
  const [hourlyRate, setHourlyRate] = useState(75000);
  const [surfaceType, setSurfaceType] = useState('Vinyl BWF 5.0mm');
  const [notes, setNotes] = useState('');

  // Delete dialog
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const handleOpenAdd = () => {
    setCourtToEdit(null);
    setName(`Court ${courts.length + 1}`);
    setCode(`C-0${courts.length + 1}`);
    setStatus('ACTIVE');
    setHourlyRate(75000);
    setSurfaceType('Vinyl BWF 5.0mm');
    setNotes('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (court: Court) => {
    setCourtToEdit(court);
    setName(court.name);
    setCode(court.code);
    setStatus(court.status);
    setHourlyRate(court.hourlyRate);
    setSurfaceType(court.surfaceType || 'Vinyl BWF 5.0mm');
    setNotes(court.notes || '');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !code.trim()) {
      error('Data Tidak Lengkap', 'Nama dan kode lapangan wajib diisi.');
      return;
    }

    if (courtToEdit) {
      onUpdateCourt(courtToEdit.id, {
        name: name.trim(),
        code: code.trim().toUpperCase(),
        status,
        hourlyRate,
        surfaceType: surfaceType.trim(),
        notes: notes.trim(),
      });
      success('Lapangan Diperbarui', `Data ${name} berhasil disimpan.`);
    } else {
      onAddCourt({
        name: name.trim(),
        code: code.trim().toUpperCase(),
        status,
        hourlyRate,
        surfaceType: surfaceType.trim(),
        notes: notes.trim(),
      });
      success('Lapangan Ditambahkan', `Lapangan ${name} berhasil didaftarkan.`);
    }

    setIsModalOpen(false);
  };

  // Quick toggle status: Maintenance, Inactive, Active
  const handleQuickStatus = (court: Court, targetStatus: CourtStatus) => {
    onUpdateCourt(court.id, { status: targetStatus });
    success('Status Diubah', `Status ${court.name} diubah menjadi ${targetStatus}.`);
  };

  return (
    <div className="space-y-6 p-4 sm:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-tight">
            Data Lapangan Badminton
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola court, status maintenance, dan spesifikasi lapangan (Khusus Owner)
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Lapangan</span>
        </button>
      </div>

      {/* Court Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {courts.map((court) => (
          <div
            key={court.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all p-5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between mb-3">
                <span className="px-2.5 py-1 rounded-lg text-xs font-extrabold bg-slate-900 text-white uppercase font-mono">
                  {court.code}
                </span>
                <CourtStatusBadge status={court.status} />
              </div>

              <h3 className="text-base font-extrabold text-slate-900">{court.name}</h3>
              <p className="text-xs text-slate-500 mt-0.5">{court.surfaceType || 'Vinyl Standar'}</p>

              {court.notes && (
                <p className="text-xs text-slate-600 mt-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
                  {court.notes}
                </p>
              )}

              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400">Tarif Dasar:</span>
                <span className="font-bold text-emerald-700">
                  {formatRupiah(court.hourlyRate)} / sesi
                </span>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              {/* Quick Status Buttons */}
              <div className="flex items-center gap-1">
                {court.status !== 'MAINTENANCE' ? (
                  <button
                    onClick={() => handleQuickStatus(court, 'MAINTENANCE')}
                    title="Set Status Maintenance"
                    className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50 border border-amber-200 text-xs"
                  >
                    <Wrench className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={() => handleQuickStatus(court, 'ACTIVE')}
                    title="Aktifkan Kembali"
                    className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 border border-emerald-200 text-xs"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </button>
                )}

                {court.status === 'ACTIVE' ? (
                  <button
                    onClick={() => handleQuickStatus(court, 'INACTIVE')}
                    title="Nonaktifkan Lapangan"
                    className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 border border-slate-200 text-xs"
                  >
                    <Power className="w-3.5 h-3.5" />
                  </button>
                ) : court.status === 'INACTIVE' ? (
                  <button
                    onClick={() => handleQuickStatus(court, 'ACTIVE')}
                    title="Aktifkan Lapangan"
                    className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 border border-emerald-200 text-xs"
                  >
                    <Power className="w-3.5 h-3.5" />
                  </button>
                ) : null}
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleOpenEdit(court)}
                  className="p-1.5 rounded-lg text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 border border-slate-200"
                  title="Edit Lapangan"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setDeleteTargetId(court.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-700 hover:bg-rose-50 border border-slate-200"
                  title="Hapus Lapangan"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal CRUD Lapangan */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={courtToEdit ? 'Edit Data Lapangan' : 'Tambah Lapangan Baru'}
        maxWidth="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Nama Lapangan <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Court 1 (Utama)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Kode Lapangan <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="C-01"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm uppercase focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as CourtStatus)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              >
                <option value="ACTIVE">ACTIVE (Aktif)</option>
                <option value="MAINTENANCE">MAINTENANCE (Perawatan)</option>
                <option value="INACTIVE">INACTIVE (Nonaktif)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Tarif Dasar / Sesi (Rp)
              </label>
              <input
                type="number"
                min="0"
                step="5000"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-bold text-emerald-700"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Jenis Lantai Karpet
              </label>
              <input
                type="text"
                value={surfaceType}
                onChange={(e) => setSurfaceType(e.target.value)}
                placeholder="Vinyl BWF 5.0mm"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Catatan Lapangan
            </label>
            <textarea
              rows={2}
              placeholder="Dekat pintu masuk, sirkulasi udara, dll."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
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
              Simpan Lapangan
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deleteTargetId)}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={() => {
          if (deleteTargetId) onDeleteCourt(deleteTargetId);
        }}
        title="Hapus Lapangan"
        message="Apakah Anda yakin ingin menghapus data lapangan ini?"
        confirmLabel="Ya, Hapus"
        isDanger={true}
      />
    </div>
  );
};

import React, { useState } from 'react';
import {
  Clock,
  Plus,
  Edit2,
  Trash2,
  Power,
  CheckCircle2,
  AlertCircle,
  ArrowUpDown,
} from 'lucide-react';
import { TimeSlot } from '../../types';
import { Modal } from '../common/Modal';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { useToast } from '../../context/ToastContext';

interface TimeSlotManagementViewProps {
  timeSlots: TimeSlot[];
  onAddTimeSlot: (slot: Omit<TimeSlot, 'id'>) => void;
  onUpdateTimeSlot: (id: string, updates: Partial<TimeSlot>) => void;
  onDeleteTimeSlot: (id: string) => void;
}

export const TimeSlotManagementView: React.FC<TimeSlotManagementViewProps> = ({
  timeSlots,
  onAddTimeSlot,
  onUpdateTimeSlot,
  onDeleteTimeSlot,
}) => {
  const { success, error } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [slotToEdit, setSlotToEdit] = useState<TimeSlot | null>(null);

  // Form State
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('09:00');
  const [label, setLabel] = useState('08:00 - 09:00');
  const [active, setActive] = useState(true);

  // Delete State
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const handleOpenAdd = () => {
    setSlotToEdit(null);
    setStartTime('08:00');
    setEndTime('09:00');
    setLabel('08:00 - 09:00');
    setActive(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (slot: TimeSlot) => {
    setSlotToEdit(slot);
    setStartTime(slot.startTime);
    setEndTime(slot.endTime);
    setLabel(slot.label);
    setActive(slot.active);
    setIsModalOpen(true);
  };

  const handleStartTimeChange = (val: string) => {
    setStartTime(val);
    setLabel(`${val} - ${endTime}`);
  };

  const handleEndTimeChange = (val: string) => {
    setEndTime(val);
    setLabel(`${startTime} - ${val}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startTime || !endTime) {
      error('Data Belum Lengkap', 'Jam mulai dan selesai wajib diisi.');
      return;
    }

    const sortOrder = parseInt(startTime.replace(':', ''), 10);

    if (slotToEdit) {
      onUpdateTimeSlot(slotToEdit.id, {
        startTime,
        endTime,
        label: label.trim() || `${startTime} - ${endTime}`,
        active,
        sortOrder,
      });
      success('Sesi Diperbarui', `Sesi ${label} berhasil disimpan.`);
    } else {
      onAddTimeSlot({
        startTime,
        endTime,
        label: label.trim() || `${startTime} - ${endTime}`,
        active,
        sortOrder,
      });
      success('Sesi Ditambahkan', `Sesi ${label} berhasil didaftarkan.`);
    }

    setIsModalOpen(false);
  };

  const handleToggleActive = (slot: TimeSlot) => {
    onUpdateTimeSlot(slot.id, { active: !slot.active });
    success('Status Diubah', `Sesi ${slot.label} ${!slot.active ? 'diaktifkan' : 'dinonaktifkan'}.`);
  };

  const sortedSlots = [...timeSlots].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div className="space-y-6 p-4 sm:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-tight">
            Pengaturan Sesi Jam Lapangan
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola pembagian slot operasional, jadwal buka-tutup, dan status aktif sesi
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Sesi Jam</span>
        </button>
      </div>

      {/* Sesi Jam List Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {sortedSlots.map((slot) => (
          <div
            key={slot.id}
            className={`rounded-2xl border p-4 transition-all shadow-xs flex items-center justify-between ${
              slot.active
                ? 'bg-white border-slate-200 hover:border-slate-300'
                : 'bg-slate-50 border-slate-200 opacity-60'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                  slot.active
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-slate-200 text-slate-500'
                }`}
              >
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-sm font-extrabold text-slate-900 block">{slot.label}</span>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider ${
                    slot.active ? 'text-emerald-600' : 'text-slate-400'
                  }`}
                >
                  {slot.active ? 'Sesi Aktif' : 'Nonaktif'}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => handleToggleActive(slot)}
                title={slot.active ? 'Nonaktifkan Sesi' : 'Aktifkan Sesi'}
                className={`p-1.5 rounded-lg border text-xs transition-colors ${
                  slot.active
                    ? 'text-slate-500 hover:text-amber-600 border-slate-200 hover:bg-slate-100'
                    : 'text-emerald-600 border-emerald-300 hover:bg-emerald-50'
                }`}
              >
                <Power className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleOpenEdit(slot)}
                title="Edit Sesi"
                className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-700 border border-slate-200 hover:bg-emerald-50 transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setDeleteTargetId(slot.id)}
                title="Hapus Sesi"
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-700 border border-slate-200 hover:bg-rose-50 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal CRUD Sesi Jam */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={slotToEdit ? 'Edit Sesi Jam' : 'Tambah Sesi Jam Baru'}
        maxWidth="sm"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Jam Mulai <span className="text-rose-500">*</span>
              </label>
              <input
                type="time"
                required
                value={startTime}
                onChange={(e) => handleStartTimeChange(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Jam Selesai <span className="text-rose-500">*</span>
              </label>
              <input
                type="time"
                required
                value={endTime}
                onChange={(e) => handleEndTimeChange(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Label Tampilan
            </label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="08:00 - 09:00"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded-md focus:ring-emerald-500"
              />
              <span>Sesi ini Aktif dan Bisa Dipesan</span>
            </label>
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
              Simpan Sesi
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deleteTargetId)}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={() => {
          if (deleteTargetId) onDeleteTimeSlot(deleteTargetId);
        }}
        title="Hapus Sesi Jam"
        message="Apakah Anda yakin ingin menghapus sesi jam ini? Sesi ini tidak akan lagi muncul di matriks jadwal lapangan."
        confirmLabel="Ya, Hapus"
        isDanger={true}
      />
    </div>
  );
};

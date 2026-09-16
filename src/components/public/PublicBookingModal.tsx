import React, { useState, useMemo, useEffect } from 'react';
import {
  X,
  Calendar,
  Clock,
  Layers,
  User,
  Phone,
  FileText,
  AlertCircle,
  CheckCircle2,
  Send,
  Sparkles,
  CreditCard,
  ShieldCheck,
  Building,
} from 'lucide-react';
import { Booking, BusinessSettings, Court, TimeSlot } from '../../types';
import { formatRupiah, getTodayString, store } from '../../services/store';
import { generateBookingWhatsAppUrl } from '../../utils/whatsapp';
import { useToast } from '../../context/ToastContext';

interface PublicBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: BusinessSettings;
  courts: Court[];
  timeSlots: TimeSlot[];
  bookings: Booking[];
  initialDate?: string;
  initialCourtId?: string;
  initialSlotId?: string;
  onBookingSubmitted?: () => void;
}

export const PublicBookingModal: React.FC<PublicBookingModalProps> = ({
  isOpen,
  onClose,
  settings,
  courts,
  timeSlots,
  bookings,
  initialDate,
  initialCourtId,
  initialSlotId,
  onBookingSubmitted,
}) => {
  const { success, error } = useToast();

  const activeCourts = useMemo(() => courts.filter((c) => c.status === 'ACTIVE'), [courts]);
  const activeSlots = useMemo(
    () => timeSlots.filter((s) => s.active).sort((a, b) => a.sortOrder - b.sortOrder),
    [timeSlots]
  );

  // Form states
  const [selectedDate, setSelectedDate] = useState<string>(initialDate || getTodayString(0));
  const [selectedCourtId, setSelectedCourtId] = useState<string>(
    initialCourtId || activeCourts[0]?.id || ''
  );
  const [selectedSlotId, setSelectedSlotId] = useState<string>(initialSlotId || '');

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerNotes, setCustomerNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync initial props when modal opens
  useEffect(() => {
    if (isOpen) {
      if (initialDate) setSelectedDate(initialDate);
      if (initialCourtId) setSelectedCourtId(initialCourtId);
      if (initialSlotId) setSelectedSlotId(initialSlotId);
    }
  }, [isOpen, initialDate, initialCourtId, initialSlotId]);

  // Selected Court & Slot objects
  const selectedCourt = activeCourts.find((c) => c.id === selectedCourtId);
  const selectedSlot = activeSlots.find((s) => s.id === selectedSlotId);

  // Calculate availability of slots for the chosen date and court
  const slotAvailabilityMap = useMemo(() => {
    const map: Record<string, boolean> = {};
    if (!selectedCourtId || !selectedDate) return map;

    for (const slot of activeSlots) {
      const isOccupied = bookings.some(
        (b) =>
          b.date === selectedDate &&
          b.courtId === selectedCourtId &&
          b.timeSlotId === slot.id &&
          b.bookingStatus !== 'CANCELLED'
      );
      map[slot.id] = !isOccupied;
    }
    return map;
  }, [selectedDate, selectedCourtId, activeSlots, bookings]);

  // If currently selected slot becomes unavailable on court or date switch, clear it
  useEffect(() => {
    if (selectedSlotId && slotAvailabilityMap[selectedSlotId] === false) {
      setSelectedSlotId('');
    }
  }, [selectedDate, selectedCourtId, slotAvailabilityMap, selectedSlotId]);

  if (!isOpen) return null;

  // Price calculations
  const totalAmount = selectedCourt ? selectedCourt.hourlyRate : settings.defaultHourlyRate;
  const depositMin = Math.round(totalAmount * 0.5);

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDate) {
      error('Pilih Tanggal', 'Silakan tentukan tanggal booking terlebih dahulu.');
      return;
    }
    if (!selectedCourt) {
      error('Pilih Lapangan', 'Silakan pilih lapangan badminton.');
      return;
    }
    if (!selectedSlot) {
      error('Pilih Sesi Jam', 'Silakan pilih jam bermain yang masih tersedia.');
      return;
    }
    if (!customerName.trim()) {
      error('Nama Lengkap Wajib', 'Masukkan nama lengkap pemesan.');
      return;
    }
    if (!customerPhone.trim() || customerPhone.replace(/[^0-9]/g, '').length < 8) {
      error('Nomor WhatsApp Tidak Valid', 'Masukkan nomor WhatsApp aktif pemesan (minimal 8 digit).');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. STRICT ANTI-DOUBLE BOOKING VALIDATION VIA STORE
      const availabilityCheck = store.checkSlotAvailability(
        selectedDate,
        selectedCourt.id,
        selectedSlot.id
      );

      if (!availabilityCheck.isAvailable) {
        error(
          'Jadwal Sudah Terisi',
          availabilityCheck.message || 'Slot baru saja dibooking oleh pemain lain. Silakan pilih slot atau jam lainnya.'
        );
        setIsSubmitting(false);
        return;
      }

      // 2. CREATE BOOKING IN STORE
      const createResult = store.createBooking({
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        courtId: selectedCourt.id,
        date: selectedDate,
        timeSlotId: selectedSlot.id,
        durationHours: 1,
        totalAmount,
        depositAmount: depositMin,
        bookingStatus: 'PENDING',
        paymentMethod: 'TRANSFER',
        notes: customerNotes.trim() || undefined,
        source: 'public_whatsapp',
      });

      if (!createResult.success || !createResult.booking) {
        error('Gagal Booking', createResult.error || 'Terjadi kendala saat menyimpan booking.');
        setIsSubmitting(false);
        return;
      }

      // 3. GENERATE WHATSAPP URL
      const waUrl = generateBookingWhatsAppUrl({
        settings,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        courtName: selectedCourt.name,
        date: selectedDate,
        timeSlotLabel: selectedSlot.label,
        totalAmount,
        notes: customerNotes.trim(),
        bookingCode: createResult.booking.bookingCode,
      });

      // 4. NOTIFY SUCCESS & OPEN WHATSAPP
      success(
        'Booking Berhasil Dibuat!',
        `Kode: ${createResult.booking.bookingCode}. Mengarahkan ke WhatsApp Admin untuk konfirmasi...`
      );

      // Open WhatsApp in new window
      window.open(waUrl, '_blank');

      // Refresh parent state
      if (onBookingSubmitted) {
        onBookingSubmitted();
      }

      // Reset & close modal
      onClose();
    } catch (err) {
      console.error('Booking submission error:', err);
      error('Kesalahan Sistem', 'Terjadi masalah teknis saat memproses booking Anda.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 via-emerald-950/60 to-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-slate-950 font-black shadow-md">
              <Sparkles className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">Formulir Booking Lapangan</h3>
              <p className="text-xs text-emerald-400 font-medium">
                {settings.gorName || settings.name} &bull; Konfirmasi Instan WhatsApp
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Tutup modal booking"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body - Scrollable */}
        <form onSubmit={handleSubmitBooking} className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-200">
          {/* Step 1: Tanggal Main */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-emerald-400" />
              <span>1. Tanggal Bermain</span>
            </label>
            <input
              type="date"
              min={getTodayString(0)}
              max={getTodayString(30)}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm font-semibold text-white focus:outline-hidden focus:border-emerald-500"
              required
            />
          </div>

          {/* Step 2: Pilih Lapangan */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>2. Pilih Lapangan Badminton</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {activeCourts.map((court) => {
                const isSelected = selectedCourtId === court.id;
                return (
                  <button
                    type="button"
                    key={court.id}
                    onClick={() => setSelectedCourtId(court.id)}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-emerald-950/60 border-emerald-400 shadow-md shadow-emerald-950'
                        : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-sm text-white">{court.name}</span>
                      <span className="text-[11px] font-mono text-emerald-400">{court.code}</span>
                    </div>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/80 text-xs">
                      <span className="text-slate-400 truncate max-w-[120px]">
                        {court.surfaceType || 'Vinyl BWF 5.0mm'}
                      </span>
                      <span className="font-bold text-white">{formatRupiah(court.hourlyRate)}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 3: Pilih Sesi Jam (Real-time availability checked from database) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span>3. Pilih Sesi Jam (Tersedia / Terisi)</span>
              </label>
              <span className="text-[11px] text-emerald-400 font-semibold">
                Waktu Lokal WIB
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-48 overflow-y-auto p-1 border border-slate-800/80 rounded-2xl bg-slate-950">
              {activeSlots.map((slot) => {
                const isAvailable = slotAvailabilityMap[slot.id] !== false;
                const isSelected = selectedSlotId === slot.id;

                if (!isAvailable) {
                  return (
                    <div
                      key={slot.id}
                      title="Slot jam ini sudah terisi oleh pemain lain"
                      className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-500 flex flex-col items-center justify-center cursor-not-allowed select-none opacity-60"
                    >
                      <span className="font-mono text-xs font-semibold">{slot.label}</span>
                      <span className="text-[10px] text-rose-400 font-bold uppercase mt-0.5">Terisi</span>
                    </div>
                  );
                }

                return (
                  <button
                    type="button"
                    key={slot.id}
                    onClick={() => setSelectedSlotId(slot.id)}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                      isSelected
                        ? 'bg-emerald-600 border-emerald-300 text-slate-950 font-bold shadow-md'
                        : 'bg-slate-900 hover:bg-slate-850 border-slate-700/80 text-white hover:border-emerald-500/50'
                    }`}
                  >
                    <span className="font-mono text-xs font-bold">{slot.label}</span>
                    <span
                      className={`text-[10px] font-bold uppercase mt-0.5 ${
                        isSelected ? 'text-slate-950' : 'text-emerald-400'
                      }`}
                    >
                      {isSelected ? '✓ Dipilih' : 'Tersedia'}
                    </span>
                  </button>
                );
              })}
            </div>
            {!selectedSlotId && (
              <p className="text-[11px] text-amber-400">
                * Silakan klik salah satu sesi jam yang berstatus "Tersedia" di atas.
              </p>
            )}
          </div>

          {/* Step 4: Data Pemesan */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <User className="w-4 h-4 text-emerald-400" />
              <span>4. Data Kontak Pemesan</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs text-slate-400">Nama Lengkap *</label>
                <input
                  type="text"
                  placeholder="Contoh: Kevin Sanjaya"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-hidden focus:border-emerald-500"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-400">Nomor WhatsApp Aktif *</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="tel"
                    placeholder="Contoh: 08123456789"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-hidden focus:border-emerald-500"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-400">Catatan Tambahan (Opsional)</label>
              <input
                type="text"
                placeholder="Contoh: Sparring komunitas kantor / butuh sewa raket 2 pcs"
                value={customerNotes}
                onChange={(e) => setCustomerNotes(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white placeholder:text-slate-600 focus:outline-hidden focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Step 5: Ringkasan Biaya & Info Transfer */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
              <span className="text-slate-400">Total Biaya Sewa (1 Sesi):</span>
              <span className="text-base font-black text-white">{formatRupiah(totalAmount)}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-emerald-400 font-bold">
              <span>Minimal Uang Muka (DP 50%):</span>
              <span>{formatRupiah(depositMin)}</span>
            </div>

            <div className="pt-2 text-[11px] text-slate-400 leading-relaxed space-y-1">
              <div className="font-semibold text-slate-300">Rekening Transfer Manual:</div>
              {settings.bankAccounts && settings.bankAccounts.length > 0 ? (
                settings.bankAccounts.map((acc, i) => (
                  <div key={i} className="font-mono text-emerald-300">
                    &bull; {acc.bankName}: {acc.accountNumber} (a/n {acc.accountHolder})
                  </div>
                ))
              ) : (
                <div className="font-mono text-emerald-300">{settings.bankInfo}</div>
              )}
              <p className="text-slate-500 italic mt-1">
                Kirim bukti transfer ke WhatsApp admin kami setelah menekan tombol di bawah.
              </p>
            </div>
          </div>

          {/* Modal Footer Actions */}
          <div className="pt-2 flex items-center justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
            >
              Batal
            </button>

            <button
              type="submit"
              disabled={isSubmitting || !selectedSlotId}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-emerald-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Memproses...' : 'Kirim Booking via WhatsApp'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

import React, { useState, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  CheckCircle,
  AlertCircle,
  Send,
  Sparkles,
  MapPin,
  Clock,
  User,
  Phone,
  FileText,
  ShieldCheck,
} from 'lucide-react';
import { Booking, BusinessSettings, Court, TimeSlot } from '../../types';
import { getTodayString, store } from '../../services/store';
import { useToast } from '../../context/ToastContext';

interface PublicBookingWizardProps {
  settings: BusinessSettings;
  courts: Court[];
  timeSlots: TimeSlot[];
  bookings: Booking[];
  onBookingSubmitted?: () => void;
}

export const PublicBookingWizard: React.FC<PublicBookingWizardProps> = ({
  settings,
  courts,
  timeSlots,
  bookings,
  onBookingSubmitted,
}) => {
  const { success, error, info } = useToast();

  const todayStr = getTodayString(0);
  const tomorrowStr = getTodayString(1);
  const dayAfterStr = getTodayString(2);

  // Active courts only
  const activeCourts = useMemo(() => {
    return courts.filter((c) => c.status === 'ACTIVE');
  }, [courts]);

  // Active time slots sorted
  const activeSlots = useMemo(() => {
    return timeSlots.filter((s) => s.active).sort((a, b) => a.sortOrder - b.sortOrder);
  }, [timeSlots]);

  // Form State
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [selectedCourtId, setSelectedCourtId] = useState<string>(
    activeCourts[0]?.id || ''
  );
  const [selectedSlotId, setSelectedSlotId] = useState<string>('');

  // Customer form inputs
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerNotes, setCustomerNotes] = useState('');

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSubmittedMsg, setLastSubmittedMsg] = useState<string | null>(null);

  // Currently selected objects
  const selectedCourt = activeCourts.find((c) => c.id === selectedCourtId);
  const selectedSlot = activeSlots.find((s) => s.id === selectedSlotId);

  // Calculate availability for each slot under current date & court
  const slotStatusMap = useMemo(() => {
    const map: Record<
      string,
      { isAvailable: boolean; reason?: string; booking?: Booking }
    > = {};

    if (!selectedCourtId || !selectedDate) return map;

    for (const slot of activeSlots) {
      const activeBooking = bookings.find(
        (b) =>
          b.date === selectedDate &&
          b.courtId === selectedCourtId &&
          b.timeSlotId === slot.id &&
          b.bookingStatus !== 'CANCELLED'
      );

      if (activeBooking) {
        map[slot.id] = {
          isAvailable: false,
          reason: 'Slot sudah dipesan',
          booking: activeBooking,
        };
      } else {
        map[slot.id] = { isAvailable: true };
      }
    }
    return map;
  }, [selectedDate, selectedCourtId, activeSlots, bookings]);

  // Handle slot selection
  const handleSelectSlot = (slotId: string) => {
    const status = slotStatusMap[slotId];
    if (status && !status.isAvailable) {
      error('Slot Tidak Tersedia', 'Slot ini sudah dipesan oleh pemain lain. Silakan pilih sesi atau lapangan lain.');
      return;
    }
    setSelectedSlotId(slotId);
  };

  // Format Date for display in Indonesian
  const formatDateIndo = (dateString: string) => {
    try {
      const [y, m, d] = dateString.split('-').map(Number);
      const date = new Date(y, m - 1, d);
      return date.toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  // Step 6: Submit & Open WhatsApp
  const handleBookingViaWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDate) {
      error('Pilih Tanggal', 'Silakan tentukan tanggal booking terlebih dahulu.');
      return;
    }
    if (!selectedCourt) {
      error('Pilih Lapangan', 'Silakan tentukan lapangan badminton yang diinginkan.');
      return;
    }
    if (!selectedSlot) {
      error('Pilih Sesi Jam', 'Silakan pilih sesi jam bermain yang masih tersedia.');
      return;
    }
    if (!customerName.trim()) {
      error('Nama Wajib Diisi', 'Silakan masukkan nama lengkap pemesan.');
      return;
    }
    if (!customerPhone.trim()) {
      error('Nomor WhatsApp Wajib Diisi', 'Silakan masukkan nomor WhatsApp aktif Anda.');
      return;
    }

    // STRICT DOUBLE BOOKING VERIFICATION BEFORE RECORDING
    const availability = store.checkSlotAvailability(
      selectedDate,
      selectedCourt.id,
      selectedSlot.id
    );

    if (!availability.isAvailable) {
      error(
        'Slot Tidak Tersedia',
        availability.message || 'Slot sudah dipesan oleh orang lain. Mohon pilih sesi yang lain.'
      );
      return;
    }

    setIsSubmitting(true);

    // Save pending booking in store so Admin sees it in Dashboard & prevents collision
    const res = store.createBooking({
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      courtId: selectedCourt.id,
      date: selectedDate,
      timeSlotId: selectedSlot.id,
      totalAmount: selectedCourt.hourlyRate,
      depositAmount: 0,
      bookingStatus: 'PENDING',
      notes: customerNotes.trim() || 'Booking via Public WhatsApp',
      source: 'public_whatsapp',
    });

    if (!res.success) {
      setIsSubmitting(false);
      error('Gagal Menyimpan Booking', res.error || 'Terjadi kendala.');
      return;
    }

    // Exact message template requested by user:
    /*
    Halo Admin, saya ingin melakukan booking lapangan badminton.

    Nama: [Nama]
    No. WhatsApp: [Nomor]
    Tanggal: [Tanggal]
    Lapangan: [Lapangan]
    Sesi: [Jam]
    Catatan: [Catatan]

    Mohon konfirmasi ketersediaan booking saya.
    */
    const notesText = customerNotes.trim() ? customerNotes.trim() : '-';
    const rawMessage = `Halo Admin, saya ingin melakukan booking lapangan badminton.

Nama: ${customerName.trim()}
No. WhatsApp: ${customerPhone.trim()}
Tanggal: ${formatDateIndo(selectedDate)}
Lapangan: ${selectedCourt.name}
Sesi: ${selectedSlot.label}
Catatan: ${notesText}

Mohon konfirmasi ketersediaan booking saya.`;

    // Clean Admin WhatsApp Number (remove non-digits, ensure 62 prefix)
    let cleanAdminNumber = settings.adminWhatsApp.replace(/[^0-9]/g, '');
    if (cleanAdminNumber.startsWith('0')) {
      cleanAdminNumber = '62' + cleanAdminNumber.substring(1);
    } else if (!cleanAdminNumber.startsWith('62')) {
      cleanAdminNumber = '62' + cleanAdminNumber;
    }

    const whatsappUrl = `https://wa.me/${cleanAdminNumber}?text=${encodeURIComponent(rawMessage)}`;

    setLastSubmittedMsg(rawMessage);
    setIsSubmitting(false);

    success(
      'Membuka WhatsApp Admin',
      'Data booking Anda telah dicatat dalam status Menunggu Konfirmasi. Sistem akan mengarahkan ke WhatsApp Admin.'
    );

    // Notify parent to refresh state
    if (onBookingSubmitted) {
      onBookingSubmitted();
    }

    // Open WhatsApp in new tab
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div id="booking-section" className="scroll-mt-24 py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Header section */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Formulir Cek & Booking Lapangan</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Reservasi Lapangan Badminton
        </h2>
        <p className="mt-2 text-slate-600 text-sm sm:text-base">
          Ikuti langkah mudah di bawah ini untuk melihat ketersediaan slot bermain dan terhubung langsung ke WhatsApp Admin.
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-200 overflow-hidden">
        <div className="p-6 sm:p-10 space-y-10">
          {/* STEP 1: Pilih Tanggal */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-black text-sm flex items-center justify-center shadow-xs">
                1
              </span>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                  Pilih Tanggal Bermain
                </h3>
                <p className="text-xs text-slate-500">Tentukan tanggal kunjungan Anda ke GOR</p>
              </div>
            </div>

            {/* Quick date buttons & Input */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setSelectedDate(todayStr);
                  setSelectedSlotId('');
                }}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold border transition-all ${
                  selectedDate === todayStr
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                Hari Ini ({todayStr})
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedDate(tomorrowStr);
                  setSelectedSlotId('');
                }}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold border transition-all ${
                  selectedDate === tomorrowStr
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                Besok ({tomorrowStr})
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedDate(dayAfterStr);
                  setSelectedSlotId('');
                }}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold border transition-all ${
                  selectedDate === dayAfterStr
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                Lusa ({dayAfterStr})
              </button>

              {/* Custom Date Picker */}
              <div className="relative flex-1 min-w-[200px]">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <CalendarIcon className="w-4 h-4" />
                </div>
                <input
                  type="date"
                  min={todayStr}
                  value={selectedDate}
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                    setSelectedSlotId('');
                  }}
                  className="w-full pl-10 pr-4 py-2 rounded-xl text-xs sm:text-sm font-medium border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-800"
                />
              </div>
            </div>

            <div className="mt-3 text-xs text-emerald-800 font-semibold flex items-center gap-1.5 bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-100">
              <CalendarIcon className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Jadwal terpilih: {formatDateIndo(selectedDate)}</span>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* STEP 2 & 3: Sistem Menampilkan Lapangan & Customer Memilih Lapangan */}
          {/* NOTE: Rule: "JANGAN menampilkan harga pada card/tabel jadwal lapangan publik." */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-black text-sm flex items-center justify-center shadow-xs">
                2
              </span>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                  Pilih Lapangan
                </h3>
                <p className="text-xs text-slate-500">Pilih court badminton yang ingin digunakan</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {activeCourts.map((court) => {
                const isSelected = selectedCourtId === court.id;
                return (
                  <div
                    key={court.id}
                    onClick={() => {
                      setSelectedCourtId(court.id);
                      setSelectedSlotId('');
                    }}
                    className={`relative rounded-2xl p-4 sm:p-5 border-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/50 shadow-md shadow-emerald-600/10 ring-1 ring-emerald-500'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="inline-block px-2.5 py-0.5 rounded-md text-[11px] font-extrabold tracking-wider bg-slate-900 text-white uppercase">
                        {court.code}
                      </span>
                      {isSelected && (
                        <CheckCircle className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                      )}
                    </div>
                    <h4 className="text-base font-bold text-slate-900">{court.name}</h4>
                    {court.surfaceType && (
                      <p className="text-xs text-slate-500 mt-1 font-medium">
                        {court.surfaceType}
                      </p>
                    )}
                    {court.notes && (
                      <p className="text-xs text-slate-400 mt-1.5 line-clamp-2">
                        {court.notes}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* STEP 4: Customer Memilih Sesi Jam (Dinamis dari database + Anti Double Booking check) */}
          <div>
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-black text-sm flex items-center justify-center shadow-xs">
                  3
                </span>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                    Pilih Sesi Jam Bermain
                  </h3>
                  <p className="text-xs text-slate-500">
                    Ketersediaan pada {selectedCourt?.name || 'Lapangan Terpilih'} ({formatDateIndo(selectedDate)})
                  </p>
                </div>
              </div>

              {/* Status Legend */}
              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                  <span className="text-slate-600 font-medium">Tersedia</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-rose-400"></span>
                  <span className="text-slate-600 font-medium">Slot Tidak Tersedia</span>
                </div>
              </div>
            </div>

            {/* Time Slot Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 sm:gap-3">
              {activeSlots.map((slot) => {
                const status = slotStatusMap[slot.id];
                const isAvailable = status ? status.isAvailable : true;
                const isSelected = selectedSlotId === slot.id;

                if (!isAvailable) {
                  return (
                    <div
                      key={slot.id}
                      className="p-3 rounded-xl border border-rose-200 bg-rose-50/70 text-rose-800 opacity-80 cursor-not-allowed flex flex-col justify-between"
                      title="Slot sudah dipesan atau tidak tersedia"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold line-through text-rose-700">
                          {slot.startTime}
                        </span>
                        <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                      </div>
                      <span className="text-[11px] font-extrabold mt-1 text-rose-600 block">
                        Slot Tidak Tersedia
                      </span>
                    </div>
                  );
                }

                return (
                  <button
                    key={slot.id}
                    type="button"
                    onClick={() => handleSelectSlot(slot.id)}
                    className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-600 text-white shadow-md shadow-emerald-600/25 ring-2 ring-emerald-500'
                        : 'border-slate-200 bg-slate-50/80 hover:bg-emerald-50 hover:border-emerald-300 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-black">{slot.label}</span>
                      {isSelected && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <span
                      className={`text-[11px] font-semibold mt-1.5 block ${
                        isSelected ? 'text-emerald-100' : 'text-emerald-700'
                      }`}
                    >
                      Tersedia
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Selected slot hint */}
            {selectedSlot && (
              <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs sm:text-sm text-emerald-900 font-semibold">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    Sesi Dipilih: <strong>{selectedSlot.label}</strong> di{' '}
                    <strong>{selectedCourt?.name}</strong>
                  </span>
                </div>
              </div>
            )}
          </div>

          <hr className="border-slate-100" />

          {/* STEP 5: Customer Mengisi Data Diri */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-black text-sm flex items-center justify-center shadow-xs">
                4
              </span>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                  Lengkapi Data Pemesan
                </h3>
                <p className="text-xs text-slate-500">
                  Data ini akan dikirimkan otomatis ke WhatsApp Admin GOR
                </p>
              </div>
            </div>

            <form onSubmit={handleBookingViaWhatsApp} className="space-y-4 max-w-2xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Nama Customer */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Nama Pemesan <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Kevin Sanjaya"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* No WhatsApp */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Nomor WhatsApp <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Phone className="w-4 h-4" />
                    </div>
                    <input
                      type="tel"
                      required
                      placeholder="Contoh: 08123456789"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Catatan */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Catatan Tambahan (Opsional)
                </label>
                <div className="relative">
                  <div className="absolute top-3 left-3 pointer-events-none text-slate-400">
                    <FileText className="w-4 h-4" />
                  </div>
                  <textarea
                    rows={2}
                    placeholder="Contoh: Sparring komunitas kantor, butuh sewa raket tambahan"
                    value={customerNotes}
                    onChange={(e) => setCustomerNotes(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Summary Box */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-slate-900 mb-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Ringkasan Rencana Booking Anda:</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <div>
                    <span className="text-slate-400 block">Tanggal:</span>
                    <span className="font-semibold text-slate-800">{formatDateIndo(selectedDate)}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Lapangan:</span>
                    <span className="font-semibold text-slate-800">{selectedCourt?.name || '-'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Sesi Jam:</span>
                    <span className="font-semibold text-emerald-700">{selectedSlot?.label || 'Belum dipilih'}</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 pt-2 border-t border-slate-200 mt-2">
                  * Tidak ada pembayaran online. Konfirmasi ketersediaan dan rincian pembayaran DP akan dilakukan melalui chat WhatsApp Admin.
                </p>
              </div>

              {/* STEP 6: Klik “BOOKING VIA WHATSAPP” */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting || !selectedSlotId}
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm sm:text-base tracking-wider uppercase transition-all shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                  <span>BOOKING VIA WHATSAPP</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

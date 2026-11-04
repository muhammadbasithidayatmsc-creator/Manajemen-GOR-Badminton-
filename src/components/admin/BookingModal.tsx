import React, { useState, useEffect, useMemo } from 'react';
import {
  Booking,
  BookingStatus,
  Court,
  PaymentMethod,
  PaymentStatus,
  TimeSlot,
  CustomerType,
  Member,
} from '../../types';
import {
  formatRupiah,
  getTodayString,
  store,
  addHoursToTime,
} from '../../services/store';
import {
  generateCustomerWhatsAppUrl,
  cleanPhoneNumber,
} from '../../utils/whatsapp';
import { Modal } from '../common/Modal';
import { useToast } from '../../context/ToastContext';
import {
  AlertTriangle,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  Grid,
  Phone,
  User,
  FileText,
  Timer,
  ExternalLink,
  MessageCircle,
  Crown,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingToEdit?: Booking | null;
  defaultDate?: string;
  defaultCourtId?: string;
  defaultSlotId?: string;
  courts: Court[];
  timeSlots: TimeSlot[];
  members?: Member[];
  onSaved: () => void;
}

const STANDARD_DURATIONS = [1, 2, 3, 4, 5];

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  bookingToEdit,
  defaultDate,
  defaultCourtId,
  defaultSlotId,
  courts,
  timeSlots,
  members: propMembers,
  onSaved,
}) => {
  const { success, error } = useToast();

  const isEditing = Boolean(bookingToEdit);

  // Active items
  const activeCourts = useMemo(() => courts.filter((c) => c.status === 'ACTIVE'), [courts]);
  const activeSlots = useMemo(() => timeSlots.filter((s) => s.active), [timeSlots]);
  const allMembers = useMemo(() => propMembers || store.getMembers(), [propMembers, isOpen]);

  // Customer Type State (Reguler vs Member Bulanan)
  const [customerType, setCustomerType] = useState<CustomerType>('REGULAR');
  const [selectedMemberId, setSelectedMemberId] = useState<string>('');
  const [memberWarning, setMemberWarning] = useState<string | null>(null);

  // Form State
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [date, setDate] = useState(defaultDate || getTodayString(0));
  const [courtId, setCourtId] = useState(defaultCourtId || activeCourts[0]?.id || '');
  const [timeSlotId, setTimeSlotId] = useState(defaultSlotId || activeSlots[0]?.id || '');
  const [durationHours, setDurationHours] = useState(1);
  const [isCustomDuration, setIsCustomDuration] = useState(false);
  const [customHours, setCustomHours] = useState(3);
  const [ratePerHour, setRatePerHour] = useState(30000);
  const [totalAmount, setTotalAmount] = useState(30000);
  const [depositAmount, setDepositAmount] = useState(0);
  const [bookingStatus, setBookingStatus] = useState<BookingStatus>('PENDING');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('BELUM BAYAR');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CASH');
  const [notes, setNotes] = useState('');

  // Conflict state
  const [conflictWarning, setConflictWarning] = useState<string | null>(null);

  const effectiveDuration = isCustomDuration ? Math.max(1, customHours) : durationHours;

  // Selected Court & Slot objects
  const selectedCourt = courts.find((c) => c.id === courtId);
  const selectedSlot = timeSlots.find((s) => s.id === timeSlotId);

  // Calculated End Time preview
  const timeSpanPreview = useMemo(() => {
    if (!selectedSlot) return null;
    const start = selectedSlot.startTime;
    const end = addHoursToTime(start, effectiveDuration);
    return {
      start,
      end,
      duration: effectiveDuration,
      label: effectiveDuration > 1 ? `${start} - ${end} (${effectiveDuration} Jam)` : selectedSlot.label,
    };
  }, [selectedSlot, effectiveDuration]);

  // Initialize or Reset Form
  useEffect(() => {
    if (bookingToEdit) {
      setCustomerType(bookingToEdit.customerType || 'REGULAR');
      setSelectedMemberId(bookingToEdit.memberId || '');
      setCustomerName(bookingToEdit.customerName);
      setCustomerPhone(bookingToEdit.customerPhone);
      setDate(bookingToEdit.date);
      setCourtId(bookingToEdit.courtId);
      setTimeSlotId(bookingToEdit.timeSlotId);
      const bDuration = bookingToEdit.durationHours || 1;
      if (STANDARD_DURATIONS.includes(bDuration)) {
        setDurationHours(bDuration);
        setIsCustomDuration(false);
      } else {
        setIsCustomDuration(true);
        setCustomHours(bDuration);
      }
      setRatePerHour(bookingToEdit.ratePerHour || (bookingToEdit.customerType === 'MEMBER' ? 25000 : 30000));
      setTotalAmount(bookingToEdit.totalAmount);
      setDepositAmount(bookingToEdit.depositAmount);
      setBookingStatus(bookingToEdit.bookingStatus);
      setPaymentStatus(bookingToEdit.paymentStatus);
      setPaymentMethod(bookingToEdit.paymentMethod || 'CASH');
      setNotes(bookingToEdit.notes || '');
      setMemberWarning(null);
    } else {
      setCustomerType('REGULAR');
      setSelectedMemberId('');
      setCustomerName('');
      setCustomerPhone('');
      const targetDate = defaultDate || getTodayString(0);
      setDate(targetDate);
      const targetCourtId = defaultCourtId || activeCourts[0]?.id || '';
      setCourtId(targetCourtId);
      const targetSlotId = defaultSlotId || activeSlots[0]?.id || '';
      setTimeSlotId(targetSlotId);
      setDurationHours(1);
      setIsCustomDuration(false);

      const court = courts.find((c) => c.id === targetCourtId);
      const rate = court ? court.hourlyRate : 30000;
      setRatePerHour(rate);
      setTotalAmount(rate);
      setDepositAmount(0);
      setBookingStatus('PENDING');
      setPaymentStatus('BELUM BAYAR');
      setPaymentMethod('CASH');
      setNotes('');
      setMemberWarning(null);
    }
  }, [bookingToEdit, defaultDate, defaultCourtId, defaultSlotId, courts, activeCourts, activeSlots, isOpen]);

  // Customer Type & Member Selection Handlers
  const handleCustomerTypeChange = (type: CustomerType) => {
    setCustomerType(type);
    if (type === 'REGULAR') {
      setSelectedMemberId('');
      setMemberWarning(null);
      const regRate = selectedCourt ? (selectedCourt.hourlyRate || 30000) : 30000;
      setRatePerHour(regRate);
      if (!isEditing) {
        setTotalAmount(regRate * effectiveDuration);
      }
    } else {
      const mbrRate = selectedCourt ? (selectedCourt.memberHourlyRate || 25000) : 25000;
      setRatePerHour(mbrRate);
      if (!isEditing) {
        setTotalAmount(mbrRate * effectiveDuration);
      }
    }
  };

  const handleSelectMember = (memberId: string) => {
    setSelectedMemberId(memberId);
    if (!memberId) {
      setMemberWarning(null);
      return;
    }

    const member = allMembers.find((m) => m.id === memberId || m.memberId === memberId);
    if (member) {
      setCustomerName(member.name);
      setCustomerPhone(member.phone);

      const today = new Date().toISOString().split('T')[0];
      if (member.endDate < today || member.status !== 'ACTIVE') {
        setMemberWarning(
          `Perhatian: Masa aktif keanggotaan ${member.name} telah berakhir (${member.endDate}) atau berstatus ${member.status}.`
        );
      } else {
        setMemberWarning(null);
      }

      const applicableRate = member.customHourlyRate || selectedCourt?.memberHourlyRate || 25000;
      setRatePerHour(applicableRate);
      if (!isEditing) {
        setTotalAmount(applicableRate * effectiveDuration);
      }
    }
  };

  // When court or duration changes, adjust total amount if newly creating or if total is standard
  const handleCourtChange = (newCourtId: string) => {
    setCourtId(newCourtId);
    const selected = courts.find((c) => c.id === newCourtId);
    if (selected) {
      const applicableRate = customerType === 'MEMBER'
        ? (selected.memberHourlyRate || 25000)
        : (selected.hourlyRate || 30000);
      setRatePerHour(applicableRate);
      if (!isEditing) {
        setTotalAmount(applicableRate * effectiveDuration);
      }
    }
  };

  const handleDurationSelect = (hrs: number) => {
    setIsCustomDuration(false);
    setDurationHours(hrs);
    if (!isEditing) {
      setTotalAmount(ratePerHour * hrs);
    }
  };

  const handleCustomDurationChange = (val: number) => {
    const valid = Math.max(1, Math.min(8, val));
    setCustomHours(valid);
    if (!isEditing) {
      setTotalAmount(ratePerHour * valid);
    }
  };

  // When deposit changes, automatically calculate remaining and payment status
  const handleDepositChange = (amount: number) => {
    setDepositAmount(amount);
    if (amount >= totalAmount && totalAmount > 0) {
      setPaymentStatus('LUNAS');
      setBookingStatus('CONFIRMED');
    } else if (amount > 0) {
      setPaymentStatus('DP');
      setBookingStatus('CONFIRMED');
    } else {
      setPaymentStatus('BELUM BAYAR');
    }
  };

  const handleTotalChange = (amount: number) => {
    setTotalAmount(amount);
    if (depositAmount >= amount && amount > 0) {
      setPaymentStatus('LUNAS');
    } else if (depositAmount > 0) {
      setPaymentStatus('DP');
    } else {
      setPaymentStatus('BELUM BAYAR');
    }
  };

  // Calculate Remaining Amount
  const remainingAmount = Math.max(0, totalAmount - depositAmount);

  // Anti Double Booking real-time validator across full duration
  useEffect(() => {
    if (!date || !courtId || !timeSlotId) {
      setConflictWarning(null);
      return;
    }

    const check = store.checkSlotAvailability(
      date,
      courtId,
      timeSlotId,
      effectiveDuration,
      bookingToEdit ? bookingToEdit.id : undefined
    );

    if (!check.isAvailable) {
      setConflictWarning(check.message || 'Slot sudah dipesan atau bertabrakan dengan jadwal lain.');
    } else {
      setConflictWarning(null);
    }
  }, [date, courtId, timeSlotId, effectiveDuration, bookingToEdit]);

  // Customer Direct WhatsApp Link
  const customerWhatsAppUrl = useMemo(() => {
    if (!customerPhone) return '';
    return generateCustomerWhatsAppUrl({
      customerPhone,
      customerName,
      bookingCode: bookingToEdit?.bookingCode,
      courtName: selectedCourt?.name,
      date,
      timeSlotLabel: timeSpanPreview?.label,
      gorName: 'GOR Badminton Smash Arena',
    });
  }, [customerPhone, customerName, bookingToEdit, selectedCourt, date, timeSpanPreview]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim() || !customerPhone.trim()) {
      error('Data Tidak Lengkap', 'Nama dan Nomor WhatsApp customer wajib diisi.');
      return;
    }

    // STRICT DOUBLE BOOKING CHECK ACROSS FULL DURATION
    const availability = store.checkSlotAvailability(
      date,
      courtId,
      timeSlotId,
      effectiveDuration,
      bookingToEdit ? bookingToEdit.id : undefined
    );

    if (!availability.isAvailable) {
      error(
        'Gagal Menyimpan Booking',
        availability.message || 'Slot bertabrakan dengan booking lain. Pilih tanggal, lapangan, atau sesi lain.'
      );
      return;
    }

    if (isEditing && bookingToEdit) {
      const res = store.updateBooking(bookingToEdit.id, {
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerType,
        memberId: customerType === 'MEMBER' && selectedMemberId ? selectedMemberId : undefined,
        ratePerHour,
        courtId,
        date,
        timeSlotId,
        durationHours: effectiveDuration,
        totalAmount,
        depositAmount,
        bookingStatus,
        paymentStatus,
        paymentMethod,
        notes: notes.trim(),
      });

      if (res.success) {
        success('Booking Diperbarui', `Booking ${bookingToEdit.bookingCode} (@${effectiveDuration} Jam) berhasil disimpan.`);
        onSaved();
        onClose();
      } else {
        error('Gagal Mengubah', res.error || 'Terjadi kesalahan.');
      }
    } else {
      const res = store.createBooking({
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerType,
        memberId: customerType === 'MEMBER' && selectedMemberId ? selectedMemberId : undefined,
        ratePerHour,
        courtId,
        date,
        timeSlotId,
        durationHours: effectiveDuration,
        totalAmount,
        depositAmount,
        bookingStatus,
        paymentMethod,
        notes: notes.trim(),
        source: 'admin_manual',
      });

      if (res.success) {
        success('Booking Dibuat', `Booking baru berhasil disimpan dengan kode ${res.booking?.bookingCode}.`);
        onSaved();
        onClose();
      } else {
        error('Gagal Membuat Booking', res.error || 'Terjadi kesalahan.');
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? `Edit Booking: ${bookingToEdit?.bookingCode}` : 'Form Booking Lapangan Baru'}
      subtitle="Manajemen reservasi, durasi fleksibel, tarif member & reguler, anti double booking"
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Double Booking Warning Banner */}
        {conflictWarning && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-300 flex items-start gap-3 text-rose-900 text-xs sm:text-sm font-semibold">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-extrabold block text-rose-950">Peringatan Bentrok Waktu!</span>
              <span>{conflictWarning} Silakan ganti jam mulai, durasi, atau lapangan sebelum menyimpan.</span>
            </div>
          </div>
        )}

        {/* Customer Type Selector (Reguler vs Member Bulanan) */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200/90 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Crown className="w-4 h-4 text-amber-500" />
              Jenis Pelanggan & Kategori Tarif:
            </span>
            <span className="text-xs font-bold text-slate-700 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200 shadow-2xs">
              Tarif: {formatRupiah(ratePerHour)} / jam
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleCustomerTypeChange('REGULAR')}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                customerType === 'REGULAR'
                  ? 'bg-slate-900 border-slate-900 text-white shadow-sm'
                  : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
              }`}
            >
              <div className="font-bold text-xs">Pelanggan Reguler</div>
              <div className={`text-[11px] ${customerType === 'REGULAR' ? 'text-slate-300' : 'text-slate-500'}`}>
                Tarif standar: {formatRupiah(selectedCourt?.hourlyRate || 30000)}/jam
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleCustomerTypeChange('MEMBER')}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                customerType === 'MEMBER'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 border-amber-600 text-white shadow-sm'
                  : 'bg-white border-slate-200 text-slate-700 hover:border-amber-300'
              }`}
            >
              <div className="font-bold text-xs flex items-center gap-1">
                <span>Member Bulanan</span>
                <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded font-mono">VIP</span>
              </div>
              <div className={`text-[11px] ${customerType === 'MEMBER' ? 'text-amber-100' : 'text-emerald-600 font-semibold'}`}>
                Tarif khusus: {formatRupiah(selectedCourt?.memberHourlyRate || 25000)}/jam
              </div>
            </button>
          </div>

          {/* Member Dropdown if customerType === 'MEMBER' */}
          {customerType === 'MEMBER' && (
            <div className="pt-2 border-t border-slate-200/80 space-y-2">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                Pilih Member Bulanan dari Database:
              </label>
              <select
                value={selectedMemberId}
                onChange={(e) => handleSelectMember(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm font-semibold rounded-xl border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-amber-500"
              >
                <option value="">-- Pilih Nama Member Terdaftar --</option>
                {allMembers.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.memberId}) - {m.phone} [{m.status} | Exp: {m.endDate}] - {formatRupiah(m.customHourlyRate || 25000)}/jam
                  </option>
                ))}
              </select>

              {memberWarning && (
                <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs font-medium flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>{memberWarning}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Customer Information (HIGH CONTRAST & CLEAR READABILITY) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-900 uppercase tracking-wider mb-1">
              Nama Customer <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                placeholder="Nama lengkap customer"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 text-sm sm:text-base font-semibold text-[#1F2937] bg-white placeholder:text-gray-500 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-bold text-gray-900 uppercase tracking-wider">
                Nomor WhatsApp <span className="text-rose-500">*</span>
              </label>
              {customerPhone && (
                <a
                  href={customerWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800 underline cursor-pointer"
                  title="Hubungi langsung ke nomor WhatsApp customer"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Hubungi Pelanggan</span>
                </a>
              )}
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                <Phone className="w-4 h-4" />
              </div>
              <input
                type="tel"
                required
                placeholder="Contoh: 08123456789"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 text-sm sm:text-base font-semibold text-[#1F2937] bg-white placeholder:text-gray-500 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Schedule & Slot Information */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-900 uppercase tracking-wider mb-1">
              Tanggal Main <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                <Calendar className="w-4 h-4" />
              </div>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 text-sm sm:text-base font-semibold text-[#1F2937] bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-900 uppercase tracking-wider mb-1">
              Lapangan <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                <Grid className="w-4 h-4" />
              </div>
              <select
                required
                value={courtId}
                onChange={(e) => handleCourtChange(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 text-sm sm:text-base font-semibold text-[#1F2937] bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              >
                {courts.map((court) => (
                  <option key={court.id} value={court.id}>
                    {court.name} {court.status !== 'ACTIVE' ? `(${court.status})` : ''} - {formatRupiah(court.hourlyRate)}/jam
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-900 uppercase tracking-wider mb-1">
              Jam Mulai <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                <Clock className="w-4 h-4" />
              </div>
              <select
                required
                value={timeSlotId}
                onChange={(e) => setTimeSlotId(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 text-sm sm:text-base font-semibold text-[#1F2937] bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              >
                {activeSlots.map((slot) => (
                  <option key={slot.id} value={slot.id}>
                    {slot.startTime} ({slot.label})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* DURASI BOOKING FLEKSIBEL (1 - 5 Jam & Kustom) */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Timer className="w-4 h-4 text-emerald-600" />
              Pilihan Durasi Bermain:
            </span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-lg">
              {effectiveDuration} Jam
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {STANDARD_DURATIONS.map((hrs) => (
              <button
                type="button"
                key={hrs}
                onClick={() => handleDurationSelect(hrs)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  !isCustomDuration && durationHours === hrs
                    ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                    : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {hrs} Jam
              </button>
            ))}

            <button
              type="button"
              onClick={() => {
                setIsCustomDuration(true);
                handleCustomDurationChange(customHours);
              }}
              className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                isCustomDuration
                  ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                  : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-100'
              }`}
            >
              Kustom
            </button>

            {isCustomDuration && (
              <div className="flex items-center gap-1.5 ml-2">
                <input
                  type="number"
                  min="1"
                  max="8"
                  value={customHours}
                  onChange={(e) => handleCustomDurationChange(Number(e.target.value))}
                  className="w-16 px-2.5 py-1.5 rounded-xl border border-slate-300 text-xs font-bold text-center bg-white text-[#1F2937]"
                />
                <span className="text-xs text-slate-500 font-medium">Jam</span>
              </div>
            )}
          </div>

          {/* Selesai otomatis dihitung */}
          {timeSpanPreview && (
            <div className="mt-2 pt-2 border-t border-slate-200 text-xs flex items-center justify-between text-slate-700">
              <span>
                Rentang Bermain:{' '}
                <strong className="text-slate-900 font-mono text-sm">
                  {timeSpanPreview.start} &rarr; {timeSpanPreview.end}
                </strong>{' '}
                ({timeSpanPreview.duration} Jam)
              </span>
              <span className="font-semibold text-emerald-700">
                Otomatis mengunci seluruh rentang waktu
              </span>
            </div>
          )}
        </div>

        {/* Pricing & Manual Payment Section */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              Rincian Pembayaran Manual
            </span>
            <span className="text-[11px] text-slate-500 font-medium">
              Formula: Sisa = Total - DP
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Total */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                Total Biaya (Rp)
              </label>
              <input
                type="number"
                min="0"
                step="5000"
                value={totalAmount}
                onChange={(e) => handleTotalChange(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-bold text-[#1F2937] bg-white focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* DP */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                Uang Muka / DP (Rp)
              </label>
              <input
                type="number"
                min="0"
                step="5000"
                value={depositAmount}
                onChange={(e) => handleDepositChange(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-bold text-emerald-700 bg-white focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Sisa (Auto-calculated) */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                Sisa Tagihan (Rp)
              </label>
              <div className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-100 text-sm font-black text-rose-700">
                {formatRupiah(remainingAmount)}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            {/* Payment Status */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                Status Pembayaran
              </label>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value as PaymentStatus)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 bg-white"
              >
                <option value="BELUM BAYAR">BELUM BAYAR</option>
                <option value="DP">DP</option>
                <option value="LUNAS">LUNAS</option>
              </select>
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                Metode Pembayaran
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 bg-white"
              >
                <option value="CASH">CASH (Tunai)</option>
                <option value="TRANSFER">TRANSFER BANK</option>
                <option value="QRIS">QRIS</option>
                <option value="LAINNYA">LAINNYA</option>
              </select>
            </div>

            {/* Booking Status */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                Status Booking
              </label>
              <select
                value={bookingStatus}
                onChange={(e) => setBookingStatus(e.target.value as BookingStatus)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 bg-white"
              >
                <option value="PENDING">PENDING</option>
                <option value="CONFIRMED">CONFIRMED</option>
                <option value="COMPLETED">COMPLETED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-bold text-gray-900 uppercase tracking-wider mb-1">
            Catatan Tambahan
          </label>
          <div className="relative">
            <div className="absolute top-2.5 left-3 pointer-events-none text-gray-500">
              <FileText className="w-4 h-4" />
            </div>
            <textarea
              rows={2}
              placeholder="Catatan khusus, request raket, atau instruksi sparring"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full pl-10 pr-3 py-2 rounded-xl border border-slate-300 text-sm font-medium text-[#1F2937] bg-white placeholder:text-gray-500 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-200">
          <div>
            {customerPhone && (
              <a
                href={customerWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-800 text-xs font-bold hover:bg-emerald-100 transition-colors cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>Hubungi Pelanggan ({customerPhone})</span>
                <ExternalLink className="w-3 h-3 text-emerald-600" />
              </a>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs uppercase tracking-wider hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={Boolean(conflictWarning)}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isEditing ? 'Simpan Perubahan' : 'Buat Booking'}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

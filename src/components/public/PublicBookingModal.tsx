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
  Building,
  CalendarDays,
  Repeat,
  Info,
  Timer,
  Crown,
} from 'lucide-react';
import {
  Booking,
  BookingType,
  BusinessSettings,
  Court,
  MonthlyBookingGroup,
  TimeSlot,
  MemberPackage,
} from '../../types';
import {
  formatRupiah,
  generateMonthlyDates,
  getTodayString,
  store,
  addHoursToTime,
  timeStringToMinutes,
} from '../../services/store';
import {
  generateBookingWhatsAppUrl,
  generateMonthlyBookingWhatsAppUrl,
  DEFAULT_ADMIN_WHATSAPP,
} from '../../utils/whatsapp';
import { useToast } from '../../context/ToastContext';
import { InvoiceModal } from '../common/InvoiceModal';

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

const DAYS_OF_WEEK = [
  { index: 1, label: 'Senin', short: 'Sen' },
  { index: 2, label: 'Selasa', short: 'Sel' },
  { index: 3, label: 'Rabu', short: 'Rab' },
  { index: 4, label: 'Kamis', short: 'Kam' },
  { index: 5, label: 'Jumat', short: 'Jum' },
  { index: 6, label: 'Sabtu', short: 'Sab' },
  { index: 0, label: 'Minggu', short: 'Min' },
];

const STANDARD_DURATIONS = [1, 2, 3, 4, 5];

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

  // Booking Type: REGULAR (Harian) or MONTHLY (Bulanan)
  const [bookingType, setBookingType] = useState<BookingType>('REGULAR');

  // Common form states
  const [selectedCourtId, setSelectedCourtId] = useState<string>(
    initialCourtId || activeCourts[0]?.id || ''
  );
  const [selectedSlotId, setSelectedSlotId] = useState<string>(initialSlotId || '');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerNotes, setCustomerNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Regular Booking states
  const [selectedDate, setSelectedDate] = useState<string>(initialDate || getTodayString(0));
  const [regularDuration, setRegularDuration] = useState<number>(1);
  const [isCustomRegularDuration, setIsCustomRegularDuration] = useState<boolean>(false);
  const [customRegularHours, setCustomRegularHours] = useState<number>(3);

  // Monthly Booking states
  const defaultStartDate = useMemo(() => getTodayString(1), []);
  const defaultEndDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const dt = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${dt}`;
  }, []);

  const [monthlyStartDate, setMonthlyStartDate] = useState<string>(defaultStartDate);
  const [monthlyEndDate, setMonthlyEndDate] = useState<string>(defaultEndDate);
  const [monthlySelectedDays, setMonthlySelectedDays] = useState<number[]>([1]); // default: Senin
  const [monthlyDuration, setMonthlyDuration] = useState<number>(3);
  const [isCustomMonthlyDuration, setIsCustomMonthlyDuration] = useState<boolean>(false);
  const [customMonthlyHours, setCustomMonthlyHours] = useState<number>(3);

  // Member Packages from Owner
  const memberPackages = useMemo(() => store.getMemberPackages().filter((p) => p.active), [isOpen]);
  const [selectedPackageId, setSelectedPackageId] = useState<string>(() => memberPackages[0]?.id || '');
  const selectedPackage = useMemo(
    () => memberPackages.find((p) => p.id === selectedPackageId) || memberPackages[0],
    [memberPackages, selectedPackageId]
  );

  // Auto-invoice state
  const [showInvoice, setShowInvoice] = useState(false);
  const [invoiceBooking, setInvoiceBooking] = useState<Booking | null>(null);
  const [invoiceMonthly, setInvoiceMonthly] = useState<MonthlyBookingGroup | null>(null);

  // Effective duration
  const activeDurationHours = useMemo(() => {
    if (bookingType === 'MONTHLY') {
      return isCustomMonthlyDuration ? Math.max(1, customMonthlyHours) : monthlyDuration;
    }
    return isCustomRegularDuration ? Math.max(1, customRegularHours) : regularDuration;
  }, [
    bookingType,
    isCustomMonthlyDuration,
    customMonthlyHours,
    monthlyDuration,
    isCustomRegularDuration,
    customRegularHours,
    regularDuration,
  ]);

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

  // Calculated End Time preview
  const timeSpanPreview = useMemo(() => {
    if (!selectedSlot) return null;
    const start = selectedSlot.startTime;
    const end = addHoursToTime(start, activeDurationHours);
    return {
      start,
      end,
      duration: activeDurationHours,
      label: activeDurationHours > 1 ? `${start} - ${end} (${activeDurationHours} Jam)` : selectedSlot.label,
    };
  }, [selectedSlot, activeDurationHours]);

  // Calculate availability of slots for REGULAR chosen date, court, and duration
  const slotAvailabilityMap = useMemo(() => {
    const map: Record<string, { isAvailable: boolean; message?: string }> = {};
    if (!selectedCourtId || !selectedDate) return map;

    for (const slot of activeSlots) {
      const check = store.checkSlotAvailability(
        selectedDate,
        selectedCourtId,
        slot.id,
        activeDurationHours
      );
      map[slot.id] = {
        isAvailable: check.isAvailable,
        message: check.message,
      };
    }
    return map;
  }, [selectedDate, selectedCourtId, activeSlots, activeDurationHours, bookings]);

  // Real-time conflict validation for currently selected slot
  const currentSlotConflict = useMemo(() => {
    if (bookingType !== 'REGULAR' || !selectedCourtId || !selectedDate || !selectedSlotId) {
      return null;
    }
    const check = store.checkSlotAvailability(
      selectedDate,
      selectedCourtId,
      selectedSlotId,
      activeDurationHours
    );
    return check.isAvailable ? null : check.message || 'Slot jam ini tidak tersedia atau bertabrakan.';
  }, [bookingType, selectedCourtId, selectedDate, selectedSlotId, activeDurationHours, bookings]);

  // Generate monthly dates preview
  const monthlyDates = useMemo(() => {
    if (bookingType !== 'MONTHLY') return [];
    return generateMonthlyDates(monthlyStartDate, monthlyEndDate, monthlySelectedDays);
  }, [bookingType, monthlyStartDate, monthlyEndDate, monthlySelectedDays]);

  // Real-time monthly conflict checker across full duration
  const monthlyAvailability = useMemo(() => {
    if (bookingType !== 'MONTHLY' || !selectedCourtId || !selectedSlotId || monthlyDates.length === 0) {
      return null;
    }
    return store.checkMonthlyBookingAvailability(
      monthlyStartDate,
      monthlyEndDate,
      selectedCourtId,
      selectedSlotId,
      monthlySelectedDays,
      activeDurationHours
    );
  }, [
    bookingType,
    monthlyStartDate,
    monthlyEndDate,
    selectedCourtId,
    selectedSlotId,
    monthlySelectedDays,
    monthlyDates,
    activeDurationHours,
    bookings,
  ]);

  // Selected days labels
  const selectedDaysLabels = useMemo(() => {
    return monthlySelectedDays
      .map((d) => DAYS_OF_WEEK.find((item) => item.index === d)?.label || '')
      .filter(Boolean);
  }, [monthlySelectedDays]);

  const toggleDayOfWeek = (dayIdx: number) => {
    setMonthlySelectedDays((prev) => {
      if (prev.includes(dayIdx)) {
        if (prev.length === 1) return prev; // Keep at least one day
        return prev.filter((d) => d !== dayIdx);
      } else {
        return [...prev, dayIdx].sort();
      }
    });
  };

  // Price calculations
  const hourlyRate = selectedCourt ? selectedCourt.hourlyRate : settings.defaultHourlyRate;
  const regularTotal = hourlyRate * activeDurationHours;
  const regularDeposit = Math.round(regularTotal * 0.5);

  const monthlySessionCount = monthlyDates.length;
  const memberRate = selectedPackage?.memberHourlyRate || selectedCourt?.memberHourlyRate || 25000;

  let monthlyTotal = 0;
  if (selectedPackage && selectedPackage.pricingModel === 'FIXED_PACKAGE') {
    monthlyTotal = selectedPackage.price;
  } else {
    monthlyTotal = memberRate * activeDurationHours * monthlySessionCount;
  }
  const monthlyDeposit = Math.round(monthlyTotal * 0.5);

  if (!isOpen && !showInvoice) return null;

  // Handle submit regular booking
  const handleSubmitRegular = () => {
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
      // 1. STRICT ANTI-DOUBLE BOOKING CHECK ACROSS FULL DURATION
      const availabilityCheck = store.checkSlotAvailability(
        selectedDate,
        selectedCourt.id,
        selectedSlot.id,
        activeDurationHours
      );

      if (!availabilityCheck.isAvailable) {
        error(
          'Jadwal Sudah Terisi / Bertabrakan',
          availabilityCheck.message || 'Waktu bermain bertabrakan dengan jadwal lain. Silakan pilih sesi atau durasi lain.'
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
        durationHours: activeDurationHours,
        totalAmount: regularTotal,
        depositAmount: regularDeposit,
        bookingStatus: 'PENDING',
        paymentMethod: 'TRANSFER',
        notes: customerNotes.trim() || undefined,
        source: 'public_whatsapp',
        bookingType: 'REGULAR',
      });

      if (!createResult.success || !createResult.booking) {
        error('Gagal Booking', createResult.error || 'Terjadi kendala saat menyimpan booking.');
        setIsSubmitting(false);
        return;
      }

      const createdBooking = createResult.booking;

      // 3. GENERATE WHATSAPP URL (+6281803716514)
      const waUrl = generateBookingWhatsAppUrl({
        settings,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        courtName: selectedCourt.name,
        date: selectedDate,
        timeSlotLabel: createdBooking.timeSlotLabel,
        durationHours: activeDurationHours,
        totalAmount: regularTotal,
        depositAmount: regularDeposit,
        notes: customerNotes.trim(),
        bookingCode: createdBooking.bookingCode,
        bookingType: 'REGULAR',
      });

      // 4. OPEN WHATSAPP AUTOMATICALLY
      window.open(waUrl, '_blank');

      // 5. SHOW INVOICE AUTOMATICALLY
      setInvoiceBooking(createdBooking);
      setInvoiceMonthly(null);
      setShowInvoice(true);

      success(
        'Booking Berhasil Dibuat!',
        `Kode: ${createdBooking.bookingCode}. Durasi: ${activeDurationHours} Jam. Ringkasan invoice telah dibuat.`
      );

      if (onBookingSubmitted) onBookingSubmitted();
    } catch (err) {
      console.error('Booking submission error:', err);
      error('Kesalahan Sistem', 'Terjadi masalah teknis saat memproses booking.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle submit monthly booking
  const handleSubmitMonthly = () => {
    if (!selectedCourt) {
      error('Pilih Lapangan', 'Silakan pilih lapangan badminton.');
      return;
    }
    if (!selectedSlot) {
      error('Pilih Sesi Jam', 'Silakan pilih jam bermain rutin.');
      return;
    }
    if (monthlySelectedDays.length === 0) {
      error('Pilih Hari', 'Silakan pilih minimal 1 hari dalam seminggu.');
      return;
    }
    if (monthlyDates.length === 0) {
      error('Jadwal Kosong', 'Tidak ada tanggal yang cocok dalam rentang periode.');
      return;
    }
    if (!customerName.trim()) {
      error('Nama Lengkap Wajib', 'Masukkan nama pemesan / nama komunitas.');
      return;
    }
    if (!customerPhone.trim() || customerPhone.replace(/[^0-9]/g, '').length < 8) {
      error('Nomor WhatsApp Tidak Valid', 'Masukkan nomor WhatsApp aktif (minimal 8 digit).');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Check conflicts across full multi-hour duration
      const check = store.checkMonthlyBookingAvailability(
        monthlyStartDate,
        monthlyEndDate,
        selectedCourt.id,
        selectedSlot.id,
        monthlySelectedDays,
        activeDurationHours
      );

      if (!check.isAvailable) {
        error(
          'Jadwal Bentrok!',
          `Terdapat ${check.conflictingDates.length} sesi yang bentrok dengan booking lain. Silakan periksa daftar jadwal bentrok.`
        );
        setIsSubmitting(false);
        return;
      }

      // Format period label
      const sObj = new Date(monthlyStartDate + 'T00:00:00');
      const eObj = new Date(monthlyEndDate + 'T00:00:00');
      const periodLabel = `${sObj.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} – ${eObj.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}`;

      // 2. CREATE MONTHLY BOOKING IN STORE
      const createResult = store.createMonthlyBooking({
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        courtId: selectedCourt.id,
        startDate: monthlyStartDate,
        endDate: monthlyEndDate,
        periodLabel,
        selectedDays: monthlySelectedDays,
        selectedDaysLabels,
        timeSlotId: selectedSlot.id,
        durationHours: activeDurationHours,
        totalAmount: monthlyTotal,
        depositAmount: monthlyDeposit,
        bookingStatus: 'PENDING',
        paymentMethod: 'TRANSFER',
        notes: selectedPackage
          ? `Paket: ${selectedPackage.name}${customerNotes.trim() ? ` - ${customerNotes.trim()}` : ''}`
          : customerNotes.trim() || undefined,
        source: 'public_whatsapp',
        customerType: 'MEMBER',
        ratePerHour: memberRate,
      });

      if (!createResult.success || !createResult.monthlyBooking) {
        error('Gagal Booking Bulanan', createResult.error || 'Terjadi kendala.');
        setIsSubmitting(false);
        return;
      }

      const createdGroup = createResult.monthlyBooking;

      // 3. GENERATE WHATSAPP URL (+6281803716514)
      const waUrl = generateMonthlyBookingWhatsAppUrl({
        settings,
        groupCode: createdGroup.groupCode,
        customerName: createdGroup.customerName,
        customerPhone: createdGroup.customerPhone,
        courtName: createdGroup.courtName,
        periodLabel: createdGroup.periodLabel,
        startDate: createdGroup.startDate,
        endDate: createdGroup.endDate,
        selectedDaysLabels: createdGroup.selectedDaysLabels,
        timeSlotLabel: createdGroup.timeSlotLabel,
        sessionCount: createdGroup.sessionCount,
        ratePerSession: createdGroup.ratePerSession,
        totalAmount: createdGroup.totalAmount,
        depositAmount: createdGroup.depositAmount,
        remainingAmount: createdGroup.remainingAmount,
        dates: createdGroup.dates,
        notes: createdGroup.notes,
      });

      // 4. OPEN WHATSAPP AUTOMATICALLY
      window.open(waUrl, '_blank');

      // 5. SHOW INVOICE AUTOMATICALLY
      setInvoiceMonthly(createdGroup);
      setInvoiceBooking(null);
      setShowInvoice(true);

      success(
        'Booking Bulanan Berhasil!',
        `ID: ${createdGroup.groupCode}. ${createdGroup.sessionCount} sesi (@${activeDurationHours} jam) berhasil dipesan.`
      );

      if (onBookingSubmitted) onBookingSubmitted();
    } catch (err) {
      console.error('Monthly booking submission error:', err);
      error('Kesalahan Sistem', 'Terjadi kendala saat menyimpan booking bulanan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (bookingType === 'MONTHLY') {
      handleSubmitMonthly();
    } else {
      handleSubmitRegular();
    }
  };

  return (
    <>
      {/* Auto Invoice Modal View */}
      <InvoiceModal
        isOpen={showInvoice}
        onClose={() => {
          setShowInvoice(false);
          onClose();
        }}
        booking={invoiceBooking}
        monthlyBooking={invoiceMonthly}
        settings={settings}
      />

      {/* Main Booking Modal Form */}
      {isOpen && !showInvoice && (
        <div
          id="public-booking-modal-overlay"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto"
        >
          <div
            id="public-booking-modal-container"
            className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[94vh] flex flex-col"
          >
            {/* Modal Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-emerald-950/60 to-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-slate-950 font-black shadow-md">
                  <Sparkles className="w-5 h-5 text-slate-950" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">Booking Lapangan Badminton</h3>
                  <p className="text-xs text-emerald-400 font-medium">
                    {settings.gorName || settings.name} &bull; Admin WhatsApp: +{settings.adminWhatsApp || DEFAULT_ADMIN_WHATSAPP}
                  </p>
                </div>
              </div>

              <button
                id="close-booking-modal-btn"
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Tutup modal booking"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body - Scrollable */}
            <form onSubmit={handleFormSubmit} className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-200">
              {/* TAB TOGGLE: Booking Reguler vs Booking Bulanan */}
              <div className="space-y-1.5">
                <label className="text-sm font-bold uppercase tracking-wider text-slate-200">
                  Pilih Jenis Booking:
                </label>
                <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-950 border border-slate-800 rounded-2xl">
                  <button
                    type="button"
                    id="toggle-regular-booking"
                    onClick={() => setBookingType('REGULAR')}
                    className={`py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      bookingType === 'REGULAR'
                        ? 'bg-emerald-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900'
                    }`}
                  >
                    <span>🏸</span>
                    <span>Booking Reguler (Harian)</span>
                  </button>

                  <button
                    type="button"
                    id="toggle-monthly-booking"
                    onClick={() => setBookingType('MONTHLY')}
                    className={`py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      bookingType === 'MONTHLY'
                        ? 'bg-purple-600 text-white shadow-md shadow-purple-950'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900'
                    }`}
                  >
                    <CalendarDays className="w-4 h-4" />
                    <span>Booking Bulanan (Member)</span>
                  </button>
                </div>
              </div>

              {/* IF REGULAR: Step 1 = Single Date */}
              {bookingType === 'REGULAR' && (
                <div className="space-y-2">
                  <label className="text-sm font-bold uppercase tracking-wider text-slate-100 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-emerald-400" />
                    <span>1. Tanggal Bermain</span>
                  </label>
                  <input
                    type="date"
                    id="regular-date-input"
                    min={getTodayString(0)}
                    max={getTodayString(45)}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full bg-white text-[#1F2937] border border-slate-300 rounded-xl px-4 py-3 text-sm sm:text-base font-semibold placeholder:text-gray-500 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
              )}

              {/* IF MONTHLY: Step 1 = Periode & Pola Hari */}
              {bookingType === 'MONTHLY' && (
                <div className="space-y-4 p-4 rounded-2xl bg-purple-950/20 border border-purple-900/40">
                  <div className="flex items-center gap-2 text-purple-300 font-bold text-sm uppercase tracking-wider">
                    <Repeat className="w-4 h-4 text-purple-400" />
                    <span>1. Paket & Periode Rutin Bulanan</span>
                  </div>

                  {/* Pilihan Master Paket Member Bulanan */}
                  {memberPackages.length > 0 && (
                    <div className="space-y-1.5 pb-2 border-b border-purple-900/40">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-slate-200">
                          Pilihan Paket Member Bulanan:
                        </label>
                        {selectedPackage && (
                          <span className="text-[11px] text-amber-300 font-bold">
                            Tarif Khusus {formatRupiah(selectedPackage.memberHourlyRate || 25000)}/jam
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {memberPackages.map((pkg) => {
                          const isSelected = selectedPackageId === pkg.id;
                          return (
                            <button
                              type="button"
                              key={pkg.id}
                              onClick={() => {
                                setSelectedPackageId(pkg.id);
                                if (pkg.durationHours) {
                                  setMonthlyDuration(pkg.durationHours);
                                  setCustomMonthlyHours(pkg.durationHours);
                                }
                              }}
                              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-purple-900/60 border-purple-400 ring-1 ring-purple-400 shadow-sm'
                                  : 'bg-slate-950/80 border-purple-900/30 hover:border-purple-800'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-xs text-white flex items-center gap-1">
                                  <Crown className="w-3.5 h-3.5 text-amber-400" />
                                  <span>{pkg.name}</span>
                                </span>
                                <span className="text-[11px] font-extrabold text-emerald-400">
                                  {pkg.pricingModel === 'FIXED_PACKAGE' ? formatRupiah(pkg.price) : `${formatRupiah(pkg.memberHourlyRate)}/jam`}
                                </span>
                              </div>
                              <div className="text-[10px] text-slate-400 mt-0.5">
                                {pkg.sessionCount}x Sesi &bull; {pkg.durationHours} Jam/Sesi &bull; {pkg.pricingModel === 'FIXED_PACKAGE' ? 'Fixed Bulanan' : 'Per Sesi'}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Date range */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-200">Tanggal Mulai *</label>
                      <input
                        type="date"
                        id="monthly-start-date"
                        min={getTodayString(0)}
                        value={monthlyStartDate}
                        onChange={(e) => setMonthlyStartDate(e.target.value)}
                        className="w-full bg-white text-[#1F2937] border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm sm:text-base font-semibold placeholder:text-gray-500 focus:ring-2 focus:ring-purple-500"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-200">Tanggal Selesai *</label>
                      <input
                        type="date"
                        id="monthly-end-date"
                        min={monthlyStartDate}
                        value={monthlyEndDate}
                        onChange={(e) => setMonthlyEndDate(e.target.value)}
                        className="w-full bg-white text-[#1F2937] border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm sm:text-base font-semibold placeholder:text-gray-500 focus:ring-2 focus:ring-purple-500"
                        required
                      />
                    </div>
                  </div>

                  {/* Day of Week Selector */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-slate-200">
                        Pilih Hari Bermain Rutin: <span className="text-purple-300 font-bold">{selectedDaysLabels.join(', ')}</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => setMonthlySelectedDays([1, 2, 3, 4, 5])}
                        className="text-[11px] text-purple-400 hover:text-purple-300 underline font-semibold cursor-pointer"
                      >
                        Hari Kerja (Sen-Jum)
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {DAYS_OF_WEEK.map((d) => {
                        const isSelected = monthlySelectedDays.includes(d.index);
                        return (
                          <button
                            type="button"
                            key={d.index}
                            onClick={() => toggleDayOfWeek(d.index)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-purple-600 border-purple-400 text-white shadow-sm font-bold'
                                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            {d.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Sessions preview badge */}
                  <div className="text-xs text-purple-300 flex items-center justify-between pt-1 border-t border-purple-900/30">
                    <span>Total Sesi Dihasilkan:</span>
                    <span className="font-bold text-sm text-purple-200">
                      {monthlySessionCount} Sesi Pertemuan
                    </span>
                  </div>
                </div>
              )}

              {/* Step 2: Pilih Lapangan */}
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-wider text-slate-100 flex items-center gap-1.5">
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
                          <span className="text-[11px] font-mono text-emerald-400 font-bold">{court.code}</span>
                        </div>
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/80 text-xs">
                          <span className="text-slate-400 truncate max-w-[120px]">
                            {court.surfaceType || 'Vinyl BWF 5.0mm'}
                          </span>
                          <span className="font-bold text-white">{formatRupiah(court.hourlyRate)}/jam</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 3: Pilih Durasi & Jam Mulai */}
              <div className="space-y-4">
                {/* 3A. DURASI FLEKSIBEL (1, 2, 3, 4, 5 Jam atau Kustom) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-bold uppercase tracking-wider text-slate-100 flex items-center gap-1.5">
                      <Timer className="w-4 h-4 text-emerald-400" />
                      <span>3. Durasi Bermain</span>
                    </label>
                    <span className="text-xs text-emerald-400 font-bold">
                      {activeDurationHours} Jam Bermain
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {STANDARD_DURATIONS.map((hrs) => {
                      const isSelected =
                        bookingType === 'MONTHLY'
                          ? !isCustomMonthlyDuration && monthlyDuration === hrs
                          : !isCustomRegularDuration && regularDuration === hrs;

                      return (
                        <button
                          type="button"
                          key={hrs}
                          onClick={() => {
                            if (bookingType === 'MONTHLY') {
                              setIsCustomMonthlyDuration(false);
                              setMonthlyDuration(hrs);
                            } else {
                              setIsCustomRegularDuration(false);
                              setRegularDuration(hrs);
                            }
                          }}
                          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold border transition-all cursor-pointer ${
                            isSelected
                              ? bookingType === 'MONTHLY'
                                ? 'bg-purple-600 border-purple-400 text-white shadow-md'
                                : 'bg-emerald-600 border-emerald-400 text-white shadow-md'
                              : 'bg-slate-950 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
                          }`}
                        >
                          {hrs} Jam
                        </button>
                      );
                    })}

                    <button
                      type="button"
                      onClick={() => {
                        if (bookingType === 'MONTHLY') {
                          setIsCustomMonthlyDuration(true);
                        } else {
                          setIsCustomRegularDuration(true);
                        }
                      }}
                      className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        (bookingType === 'MONTHLY' ? isCustomMonthlyDuration : isCustomRegularDuration)
                          ? 'bg-blue-600 border-blue-400 text-white'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Kustom
                    </button>
                  </div>

                  {/* If custom duration selected */}
                  {((bookingType === 'MONTHLY' && isCustomMonthlyDuration) ||
                    (bookingType === 'REGULAR' && isCustomRegularDuration)) && (
                    <div className="flex items-center gap-2 pt-1 max-w-xs">
                      <span className="text-xs text-slate-300 font-medium">Jumlah jam:</span>
                      <input
                        type="number"
                        min={1}
                        max={8}
                        value={bookingType === 'MONTHLY' ? customMonthlyHours : customRegularHours}
                        onChange={(e) => {
                          const val = Math.max(1, Math.min(8, Number(e.target.value) || 1));
                          if (bookingType === 'MONTHLY') {
                            setCustomMonthlyHours(val);
                          } else {
                            setCustomRegularHours(val);
                          }
                        }}
                        className="w-20 bg-white text-[#1F2937] border border-slate-300 rounded-xl px-3 py-1.5 text-sm font-bold text-center focus:ring-2 focus:ring-emerald-500"
                      />
                      <span className="text-xs text-slate-300">Jam per sesi</span>
                    </div>
                  )}
                </div>

                {/* 3B. PILIH JAM MULAI */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-bold uppercase tracking-wider text-slate-100 flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-emerald-400" />
                      <span>Pilih Jam Mulai</span>
                    </label>
                    <span className="text-[11px] text-slate-400">
                      Selesai otomatis dihitung (+{activeDurationHours} jam)
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-48 overflow-y-auto p-1 border border-slate-800/80 rounded-2xl bg-slate-950">
                    {activeSlots.map((slot) => {
                      const slotCheck = slotAvailabilityMap[slot.id];
                      const isAvailable =
                        bookingType === 'MONTHLY' ? true : slotCheck?.isAvailable !== false;
                      const isSelected = selectedSlotId === slot.id;

                      if (!isAvailable) {
                        return (
                          <div
                            key={slot.id}
                            title={slotCheck?.message || 'Slot jam ini sudah terisi atau bertabrakan'}
                            className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-500 flex flex-col items-center justify-center cursor-not-allowed select-none opacity-50"
                          >
                            <span className="font-mono text-xs font-semibold">{slot.startTime}</span>
                            <span className="text-[10px] text-rose-400 font-bold uppercase mt-0.5">
                              Tidak Tersedia
                            </span>
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
                              ? bookingType === 'MONTHLY'
                                ? 'bg-purple-600 border-purple-300 text-white font-bold shadow-md'
                                : 'bg-emerald-600 border-emerald-300 text-white font-bold shadow-md'
                              : 'bg-slate-900 hover:bg-slate-850 border-slate-700/80 text-white hover:border-emerald-500/50'
                          }`}
                        >
                          <span className="font-mono text-xs font-bold">{slot.startTime}</span>
                          <span
                            className={`text-[10px] font-bold uppercase mt-0.5 ${
                              isSelected
                                ? 'text-white'
                                : 'text-emerald-400'
                            }`}
                          >
                            {isSelected ? '✓ Dipilih' : 'Mulai Jam Ini'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3C. INTERACTIVE RENTANG WAKTU SELESAI OTOMATIS */}
                {timeSpanPreview && (
                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-xs text-slate-300">
                      <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>
                        Jadwal Main:{' '}
                        <strong className="text-white font-mono text-sm">
                          {timeSpanPreview.start} &rarr; {timeSpanPreview.end}
                        </strong>{' '}
                        ({timeSpanPreview.duration} Jam)
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-emerald-400 font-bold">
                        {formatRupiah(hourlyRate * activeDurationHours)}
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        (@{formatRupiah(hourlyRate)}/jam &times; {activeDurationHours} jam)
                      </span>
                    </div>
                  </div>
                )}

                {/* Conflict warning for REGULAR booking */}
                {currentSlotConflict && (
                  <div className="p-3.5 rounded-2xl bg-rose-950/60 border border-rose-800 flex items-start gap-2.5 text-xs text-rose-200">
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-rose-300 font-bold">Jadwal Bertabrakan:</strong>
                      <span>{currentSlotConflict}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* MONTHLY CONFLICT CHECK WARNING DISPLAY */}
              {bookingType === 'MONTHLY' && monthlyAvailability && (
                <div>
                  {!monthlyAvailability.isAvailable ? (
                    <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-800/80 space-y-2">
                      <div className="flex items-center gap-2 text-rose-300 font-bold text-xs">
                        <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                        <span>⚠️ Beberapa jadwal tidak tersedia ({monthlyAvailability.conflictingDates.length} sesi bentrok):</span>
                      </div>
                      <p className="text-[11px] text-rose-200/80">
                        Jadwal berikut sudah dibooking oleh pemain lain. Silakan ubah hari, jam sesi, durasi, atau pilih lapangan lain:
                      </p>
                      <div className="space-y-1 max-h-32 overflow-y-auto pr-1">
                        {monthlyAvailability.conflictingDates.map((c, i) => (
                          <div
                            key={i}
                            className="p-1.5 rounded-lg bg-rose-900/40 text-[11px] text-rose-100 flex items-center justify-between"
                          >
                            <span>• {c.formattedDate} — {c.courtName} — {c.timeSlotLabel}</span>
                            <span className="text-[10px] font-mono text-rose-300 uppercase">{c.reason}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-800/60 flex items-center gap-2 text-emerald-300 text-xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>
                        ✓ Semua <strong>{monthlyAvailability.totalDatesCount} sesi</strong> tersedia! Jadwal: Setiap {selectedDaysLabels.join(' & ')} pukul {timeSpanPreview?.label}.
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Step 4: Data Pemesan (HIGH CONTRAST & CLEAR READABILITY) */}
              <div className="space-y-3 pt-2 border-t border-slate-800">
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-100 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-emerald-400" />
                  <span>4. Data Kontak Pemesan / Komunitas</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-200">
                      Nama Customer / Komunitas <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      id="customer-name-input"
                      placeholder="Contoh: Kevin Sanjaya / PB Smash"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full bg-white text-[#1F2937] border border-slate-300 rounded-xl px-4 py-3 text-sm sm:text-base font-semibold placeholder:text-gray-500 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-200">
                      Nomor WhatsApp Customer <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-5 h-5 text-gray-500 absolute left-3.5 top-3.5 pointer-events-none" />
                      <input
                        type="tel"
                        id="customer-phone-input"
                        placeholder="Contoh: 08123456789"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="w-full bg-white text-[#1F2937] border border-slate-300 rounded-xl pl-11 pr-4 py-3 text-sm sm:text-base font-semibold placeholder:text-gray-500 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-200">
                    Catatan Tambahan (Opsional)
                  </label>
                  <textarea
                    rows={2}
                    id="customer-notes-input"
                    placeholder="Contoh: Sparring rutin / sewa 2 raket & shuttlecock"
                    value={customerNotes}
                    onChange={(e) => setCustomerNotes(e.target.value)}
                    className="w-full bg-white text-[#1F2937] border border-slate-300 rounded-xl px-4 py-2.5 text-sm sm:text-base font-medium placeholder:text-gray-500 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Step 5: Ringkasan Biaya & Info Transfer */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
                  <span className="text-slate-400">
                    Total Biaya Sewa ({bookingType === 'MONTHLY' ? `${monthlySessionCount} Sesi Bulanan (@${activeDurationHours} Jam)` : `1 Sesi (${activeDurationHours} Jam)`}):
                  </span>
                  <span className="text-base font-black text-white">
                    {formatRupiah(bookingType === 'MONTHLY' ? monthlyTotal : regularTotal)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-emerald-400 font-bold">
                  <span>Minimal Uang Muka (DP 50%):</span>
                  <span>{formatRupiah(bookingType === 'MONTHLY' ? monthlyDeposit : regularDeposit)}</span>
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
                    Booking akan langsung diarahkan ke WhatsApp Admin (+{settings.adminWhatsApp || DEFAULT_ADMIN_WHATSAPP}) dan Invoice resmi otomatis diterbitkan.
                  </p>
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div className="pt-2 flex items-center justify-end gap-3 shrink-0">
                <button
                  type="button"
                  id="cancel-booking-btn"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  id="submit-booking-wa-btn"
                  disabled={
                    isSubmitting ||
                    !selectedSlotId ||
                    Boolean(currentSlotConflict) ||
                    (bookingType === 'MONTHLY' && (!monthlyAvailability || !monthlyAvailability.isAvailable))
                  }
                  className={`px-6 py-3 rounded-xl font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                    bookingType === 'MONTHLY'
                      ? 'bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-white shadow-purple-500/25'
                      : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white shadow-emerald-500/25'
                  }`}
                >
                  <Send className="w-4 h-4" />
                  <span>
                    {isSubmitting
                      ? 'Memproses...'
                      : bookingType === 'MONTHLY'
                      ? 'Booking Bulanan via WhatsApp'
                      : 'Kirim Booking via WhatsApp'}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

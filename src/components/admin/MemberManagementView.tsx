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
  Timer,
  CheckCircle2,
  Layers,
  ArrowRight,
  MessageCircle,
  Receipt,
  Grid,
  Check,
  Info,
  Printer,
} from 'lucide-react';
import {
  Member,
  Booking,
  Transaction,
  MemberStatus,
  MemberPackage,
  PackagePricingModel,
  PaymentMethod,
  PaymentStatus,
  Court,
  TimeSlot,
} from '../../types';
import {
  formatRupiah,
  store,
  getTodayString,
  addHoursToTime,
  generateMonthlyDates,
} from '../../services/store';
import {
  cleanPhoneNumber,
  generateMemberInfoWhatsAppUrl,
  generateMemberScheduleWhatsAppUrl,
  generateMemberInvoiceWhatsAppUrl,
} from '../../utils/whatsapp';
import { Modal } from '../common/Modal';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { InvoiceModal } from '../common/InvoiceModal';
import { useToast } from '../../context/ToastContext';

interface MemberManagementViewProps {
  members: Member[];
  packages?: MemberPackage[];
  courts?: Court[];
  timeSlots?: TimeSlot[];
  bookings: Booking[];
  transactions: Transaction[];
  onRefresh: () => void;
  onNavigateToPackages?: () => void;
}

const DAY_OPTIONS = [
  { value: 1, label: 'Senin' },
  { value: 2, label: 'Selasa' },
  { value: 3, label: 'Rabu' },
  { value: 4, label: 'Kamis' },
  { value: 5, label: 'Jumat' },
  { value: 6, label: 'Sabtu' },
  { value: 0, label: 'Minggu' },
];

export const MemberManagementView: React.FC<MemberManagementViewProps> = ({
  members,
  packages: propPackages,
  courts: propCourts,
  timeSlots: propTimeSlots,
  bookings,
  transactions,
  onRefresh,
  onNavigateToPackages,
}) => {
  const { success, error: notifyError } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | MemberStatus>('ALL');

  // Master Data
  const packages = useMemo(() => propPackages || store.getMemberPackages(), [propPackages, members]);
  const activePackages = useMemo(() => packages.filter((p) => p.active), [packages]);
  const courts = useMemo(() => (propCourts || store.getCourts()).filter((c) => c.status === 'ACTIVE'), [propCourts]);
  const timeSlots = useMemo(() => (propTimeSlots || store.getTimeSlots()).filter((s) => s.active), [propTimeSlots]);
  const businessSettings = useMemo(() => store.getSettings(), []);

  // Selected member for detail view modal
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  // Invoice Modal State for Member
  const [selectedInvoiceMember, setSelectedInvoiceMember] = useState<Member | null>(null);

  // Registration Modal State
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [formStep, setFormStep] = useState<'ALL' | 'CLIENT' | 'MEMBERSHIP' | 'SCHEDULE' | 'PAYMENT'>('ALL');

  // Form Fields - Data Pelanggan
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formAddress, setFormAddress] = useState('');
  const [formClientNotes, setFormClientNotes] = useState('');

  // Form Fields - Data Membership
  const [formPackageId, setFormPackageId] = useState('');
  const [formPricingModel, setFormPricingModel] = useState<PackagePricingModel>('FIXED_PACKAGE');
  const [formStartDate, setFormStartDate] = useState(getTodayString(0));
  const [formEndDate, setFormEndDate] = useState(getTodayString(30));
  const [formCustomRate, setFormCustomRate] = useState<number>(25000);
  const [formSessionCount, setFormSessionCount] = useState<number>(4);
  const [formDurationHours, setFormDurationHours] = useState<number>(3);

  // Form Fields - Jadwal Pertemuan
  const [formCourtId, setFormCourtId] = useState('');
  const [formTimeSlotId, setFormTimeSlotId] = useState('');
  const [formSelectedDays, setFormSelectedDays] = useState<number[]>([6]); // Default Sabtu

  // Form Fields - Pembayaran
  const [formTotalAmount, setFormTotalAmount] = useState<number>(300000);
  const [formDepositAmount, setFormDepositAmount] = useState<number>(300000);
  const [formPaymentMethod, setFormPaymentMethod] = useState<PaymentMethod>('TRANSFER');
  const [formPaymentStatus, setFormPaymentStatus] = useState<PaymentStatus>('LUNAS');
  const [formPaymentNotes, setFormPaymentNotes] = useState('');

  // Edit Member Modal
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [editStartDate, setEditStartDate] = useState('');
  const [editEndDate, setEditEndDate] = useState('');
  const [editCustomRate, setEditCustomRate] = useState<number>(25000);
  const [editStatus, setEditStatus] = useState<MemberStatus>('ACTIVE');
  const [editNotes, setEditNotes] = useState('');

  // Extend Modal
  const [isExtendOpen, setIsExtendOpen] = useState(false);
  const [extendingMember, setExtendingMember] = useState<Member | null>(null);
  const [extendMonths, setExtendMonths] = useState<number>(1);

  // Delete Confirm
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Success Dialog after Registration (contains 3 WhatsApp actions)
  const [registeredMemberSuccess, setRegisteredMemberSuccess] = useState<{
    member: Member;
    bookings: Booking[];
  } | null>(null);

  // Monitoring Stats
  const monitoringStats = useMemo(() => {
    return store.getMemberSessionMonitoringStats();
  }, [members, bookings, packages]);

  // Filtered members
  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      const matchSearch =
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.phone.includes(searchTerm) ||
        m.memberCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (m.membershipType && m.membershipType.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchStatus = statusFilter === 'ALL' || m.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [members, searchTerm, statusFilter]);

  // Selected Slot & Court objects
  const selectedSlot = useMemo(() => timeSlots.find((s) => s.id === formTimeSlotId), [timeSlots, formTimeSlotId]);
  const selectedCourt = useMemo(() => courts.find((c) => c.id === formCourtId), [courts, formCourtId]);

  // Calculated End Time
  const calculatedEndTime = useMemo(() => {
    if (!selectedSlot) return '';
    return addHoursToTime(selectedSlot.startTime, formDurationHours);
  }, [selectedSlot, formDurationHours]);

  // Real-time generated session dates based on selected days in range
  const generatedDatesPreview = useMemo(() => {
    if (!formStartDate || !formEndDate || formSelectedDays.length === 0) return [];
    return generateMonthlyDates(formStartDate, formEndDate, formSelectedDays);
  }, [formStartDate, formEndDate, formSelectedDays]);

  // Check schedule conflict in real-time
  const scheduleConflictCheck = useMemo(() => {
    if (!formStartDate || !formEndDate || !formCourtId || !formTimeSlotId || formSelectedDays.length === 0) {
      return null;
    }
    return store.checkMonthlyBookingAvailability(
      formStartDate,
      formEndDate,
      formCourtId,
      formTimeSlotId,
      formSelectedDays,
      formDurationHours
    );
  }, [formStartDate, formEndDate, formCourtId, formTimeSlotId, formSelectedDays, formDurationHours]);

  // Open Registration Modal
  const handleOpenRegister = () => {
    const today = new Date();
    const nextMonth = new Date(today);
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    const pad = (n: number) => String(n).padStart(2, '0');
    const startStr = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
    const endStr = `${nextMonth.getFullYear()}-${pad(nextMonth.getMonth() + 1)}-${pad(nextMonth.getDate())}`;

    const defaultPkg = activePackages[0] || packages[0];
    const initialPkgId = defaultPkg?.id || '';
    const initialPrice = defaultPkg?.pricingModel === 'FIXED_PACKAGE' ? (defaultPkg.price || 300000) : 300000;
    const initialSessionCount = defaultPkg?.sessionCount || 4;
    const initialDuration = defaultPkg?.durationHours || 3;
    const initialRate = defaultPkg?.memberHourlyRate || 25000;

    setFormName('');
    setFormPhone('');
    setFormAddress('');
    setFormClientNotes('');

    setFormPackageId(initialPkgId);
    setFormPricingModel(defaultPkg?.pricingModel || 'FIXED_PACKAGE');
    setFormStartDate(startStr);
    setFormEndDate(endStr);
    setFormCustomRate(initialRate);
    setFormSessionCount(initialSessionCount);
    setFormDurationHours(initialDuration);

    setFormCourtId(courts[0]?.id || '');
    setFormTimeSlotId(timeSlots[0]?.id || '');
    setFormSelectedDays([6]); // Sabtu

    setFormTotalAmount(initialPrice);
    setFormDepositAmount(initialPrice);
    setFormPaymentMethod('TRANSFER');
    setFormPaymentStatus('LUNAS');
    setFormPaymentNotes('');

    setIsRegisterOpen(true);
  };

  // When package selected, auto-fill pricing and session parameters
  const handlePackageChange = (pkgId: string) => {
    setFormPackageId(pkgId);
    const selected = packages.find((p) => p.id === pkgId);
    if (selected) {
      setFormPricingModel(selected.pricingModel);
      setFormSessionCount(selected.sessionCount || 4);
      setFormDurationHours(selected.durationHours || 3);
      setFormCustomRate(selected.memberHourlyRate || 25000);

      // Auto compute total
      if (selected.pricingModel === 'FIXED_PACKAGE') {
        setFormTotalAmount(selected.price);
        setFormDepositAmount(selected.price);
      } else {
        const computed = (selected.sessionCount || 4) * (selected.durationHours || 3) * (selected.memberHourlyRate || 25000);
        setFormTotalAmount(computed);
        setFormDepositAmount(computed);
      }
    }
  };

  // Recalculate price when sessions/duration/rate changes
  const handleRecalculatePricing = (sessions: number, duration: number, rate: number, model: PackagePricingModel) => {
    if (model === 'PER_SESSION') {
      const calculated = sessions * duration * rate;
      setFormTotalAmount(calculated);
      setFormDepositAmount(calculated);
    }
  };

  // Submit Registration
  const handleSubmitRegister = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formName.trim() || !formPhone.trim()) {
      notifyError('Data Belum Lengkap', 'Nama lengkap dan nomor WhatsApp member wajib diisi.');
      return;
    }

    if (!formCourtId || !formTimeSlotId) {
      notifyError('Data Belum Lengkap', 'Silakan pilih lapangan dan sesi jam bermain.');
      return;
    }

    if (formSelectedDays.length === 0) {
      notifyError('Jadwal Belum Dipilih', 'Pilih minimal satu hari bermain rutin dalam seminggu.');
      return;
    }

    const selectedPkg = packages.find((p) => p.id === formPackageId);
    const dayLabels = formSelectedDays
      .map((d) => DAY_OPTIONS.find((opt) => opt.value === d)?.label || '')
      .filter(Boolean);

    const res = store.registerMemberWithPackageAndSchedule({
      name: formName.trim(),
      phone: formPhone.trim(),
      address: formAddress.trim(),
      packageId: formPackageId || undefined,
      packageName: selectedPkg?.name || 'Member Bulanan',
      pricingModel: formPricingModel,
      startDate: formStartDate,
      endDate: formEndDate,
      courtId: formCourtId,
      timeSlotId: formTimeSlotId,
      selectedDays: formSelectedDays,
      selectedDaysLabels: dayLabels,
      sessionCount: Number(formSessionCount),
      durationHours: Number(formDurationHours),
      customHourlyRate: Number(formCustomRate),
      totalAmount: Number(formTotalAmount),
      depositAmount: Number(formDepositAmount),
      paymentMethod: formPaymentMethod,
      paymentStatus: formPaymentStatus,
      notes: formClientNotes.trim() || formPaymentNotes.trim(),
    });

    if (!res.success) {
      notifyError('Gagal Mendaftarkan Member', res.error || 'Terjadi bentrok jadwal lapangan.');
      return;
    }

    success(
      'Member Berhasil Didaftarkan!',
      `Keanggotaan ${res.member?.name} aktif (${res.member?.memberCode}) dan ${res.bookings?.length} jadwal pertemuan telah berhasil dikunci.`
    );

    setIsRegisterOpen(false);
    onRefresh();

    // Show WhatsApp sharing dialog
    if (res.member && res.bookings) {
      setRegisteredMemberSuccess({
        member: res.member,
        bookings: res.bookings,
      });
    }
  };

  // Open Edit Member Modal
  const handleOpenEdit = (m: Member) => {
    setEditingMember(m);
    setEditName(m.name);
    setEditPhone(m.phone);
    setEditAddress(m.address || '');
    setEditStartDate(m.startDate);
    setEditEndDate(m.endDate);
    setEditCustomRate(m.customHourlyRate || 25000);
    setEditStatus(m.status);
    setEditNotes(m.notes || '');
    setIsEditOpen(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember) return;
    try {
      store.updateMember(editingMember.id, {
        name: editName.trim(),
        phone: editPhone.trim(),
        address: editAddress.trim(),
        startDate: editStartDate,
        endDate: editEndDate,
        customHourlyRate: Number(editCustomRate) || 25000,
        status: editStatus,
        notes: editNotes.trim(),
      });
      success('Data Member Diperbarui', `Perubahan member ${editName} berhasil disimpan.`);
      setIsEditOpen(false);
      setEditingMember(null);
      onRefresh();
    } catch (err: any) {
      notifyError('Gagal Menyimpan', err.message || 'Terjadi kesalahan.');
    }
  };

  // Open Extend Modal
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

  // Delete Member
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

  // Toggle Day Selection
  const toggleDay = (dayIndex: number) => {
    if (formSelectedDays.includes(dayIndex)) {
      if (formSelectedDays.length === 1) {
        notifyError('Pilihan Hari', 'Pilih minimal satu hari bermain.');
        return;
      }
      setFormSelectedDays(formSelectedDays.filter((d) => d !== dayIndex));
    } else {
      setFormSelectedDays([...formSelectedDays, dayIndex].sort((a, b) => a - b));
    }
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
            Pendaftaran member baru, pengelolaan paket & sesi pertemuan, monitoring sisa kuota, serta penguncian jadwal anti double booking.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onNavigateToPackages && (
            <button
              type="button"
              onClick={onNavigateToPackages}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors shadow-2xs cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5 text-indigo-600" />
              <span>Pengaturan Paket</span>
            </button>
          )}

          <button
            type="button"
            onClick={onRefresh}
            className="p-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-600 transition-colors shadow-2xs cursor-pointer"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleOpenRegister}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold transition-all shadow-sm hover:shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Daftar Member Bulanan</span>
          </button>
        </div>
      </div>

      {/* DASHBOARD MONITORING SESI MEMBER (8 Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 sm:gap-3">
        <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-slate-500">Total Member</span>
          <p className="text-xl font-bold text-slate-900 mt-1">{monitoringStats.totalMembers}</p>
          <span className="text-[10px] text-slate-400">Semua data</span>
        </div>

        <div className="p-3.5 rounded-xl border border-emerald-100 bg-emerald-50/40 shadow-2xs flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-emerald-800">Member Aktif</span>
          <p className="text-xl font-bold text-emerald-700 mt-1">{monitoringStats.activeMembers}</p>
          <span className="text-[10px] text-emerald-600">Berhak main</span>
        </div>

        <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 shadow-2xs flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-slate-500">Expired</span>
          <p className="text-xl font-bold text-slate-700 mt-1">{monitoringStats.expiredMembers}</p>
          <span className="text-[10px] text-slate-400">Lewat masa</span>
        </div>

        <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/50 shadow-2xs flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-amber-800">Akan Expired</span>
          <p className="text-xl font-bold text-amber-700 mt-1">{monitoringStats.expiringSoonMembers}</p>
          <span className="text-[10px] text-amber-600">&le; 14 hari</span>
        </div>

        <div className="p-3.5 rounded-xl border border-indigo-100 bg-indigo-50/40 shadow-2xs flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-indigo-800">Paket Aktif</span>
          <p className="text-xl font-bold text-indigo-700 mt-1">{monitoringStats.totalPackages}</p>
          <span className="text-[10px] text-indigo-600">Pilihan paket</span>
        </div>

        <div className="p-3.5 rounded-xl border border-purple-100 bg-purple-50/40 shadow-2xs flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-purple-800">Sesi Bulan Ini</span>
          <p className="text-xl font-bold text-purple-700 mt-1">{monitoringStats.totalSessionsThisMonth}</p>
          <span className="text-[10px] text-purple-600">Terjadwal</span>
        </div>

        <div className="p-3.5 rounded-xl border border-blue-100 bg-blue-50/40 shadow-2xs flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-blue-800">Sesi Terpakai</span>
          <p className="text-xl font-bold text-blue-700 mt-1">{monitoringStats.sessionsUsed}</p>
          <span className="text-[10px] text-blue-600">Sudah main</span>
        </div>

        <div className="p-3.5 rounded-xl border border-teal-100 bg-teal-50/40 shadow-2xs flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-teal-800">Sisa Sesi</span>
          <p className="text-xl font-bold text-teal-700 mt-1">{monitoringStats.sessionsRemaining}</p>
          <span className="text-[10px] text-teal-600">Belum main</span>
        </div>
      </div>

      {/* Banner Sesi Member Hari Ini (Jika ada) */}
      {monitoringStats.todayMemberSessions.length > 0 && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-900 to-teal-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">
                Jadwal Member Hari Ini ({monitoringStats.todayMemberSessions.length} Sesi Pertemuan)
              </h4>
              <p className="text-xs text-emerald-200 mt-0.5">
                Pastikan lapangan dan lampu siap sebelum jam bermain dimulai.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {monitoringStats.todayMemberSessions.slice(0, 3).map((s) => (
              <span
                key={s.id}
                className="px-2.5 py-1 rounded-lg bg-white/10 text-emerald-100 text-xs font-mono font-medium"
              >
                {s.customerName} &bull; {s.courtName} &bull; {s.timeSlotLabel}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nama, ID member, nomor WhatsApp..."
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

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <button
            type="button"
            onClick={() => setStatusFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
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
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              statusFilter === 'ACTIVE'
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
            }`}
          >
            Aktif ({monitoringStats.activeMembers})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('EXPIRED')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              statusFilter === 'EXPIRED'
                ? 'bg-rose-600 text-white'
                : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
            }`}
          >
            Expired ({monitoringStats.expiredMembers})
          </button>
        </div>
      </div>

      {/* Main Members Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Member & Kontak</th>
                <th className="py-3 px-4">Paket & Jadwal Rutin</th>
                <th className="py-3 px-4">Monitoring Sesi</th>
                <th className="py-3 px-4">Periode Masa Aktif</th>
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
                        {searchTerm ? 'Coba ubah kata kunci pencarian.' : 'Klik tombol Daftar Member Bulanan untuk mendaftarkan pelanggan.'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredMembers.map((m) => {
                  const sessionDetails = store.getMemberSessionDetails(m.id);
                  const totalSes = m.sessionCount || sessionDetails.totalSessions || 4;
                  const usedSes = sessionDetails.usedSessions;
                  const remainingSes = sessionDetails.remainingSessions;
                  const percentUsed = Math.min(100, Math.round((usedSes / totalSes) * 100));

                  const isExp = m.endDate < getTodayString(0);

                  return (
                    <tr key={m.id} className="hover:bg-slate-50/60 transition-colors">
                      {/* Name, Code, Phone */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-500 to-amber-600 text-white flex items-center justify-center font-bold text-xs shadow-2xs shrink-0">
                            {m.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 flex items-center gap-1.5">
                              <span>{m.name}</span>
                              <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-amber-50 text-amber-800 font-semibold border border-amber-200">
                                {m.memberCode}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                              <span className="font-mono">{m.phone}</span>
                              <a
                                href={`https://wa.me/${cleanPhoneNumber(m.phone)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-emerald-600 hover:text-emerald-700"
                                title="Chat WhatsApp"
                              >
                                <ExternalLink className="w-3 h-3 inline" />
                              </a>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Package & Routine Schedule */}
                      <td className="py-3 px-4">
                        <div className="space-y-0.5">
                          <div className="font-semibold text-slate-900">
                            {m.packageName || m.membershipType}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {m.courtName ? `${m.courtName} • ` : ''}
                            {m.selectedDaysLabels && m.selectedDaysLabels.length > 0
                              ? `Setiap ${m.selectedDaysLabels.join(' & ')}`
                              : 'Jadwal Rutin'}
                          </div>
                          <div className="text-[11px] font-semibold text-emerald-700">
                            {formatRupiah(m.customHourlyRate || 25000)} / jam &bull; {m.durationHours || 3} jam/sesi
                          </div>
                        </div>
                      </td>

                      {/* Session Monitoring Badge & Progress */}
                      <td className="py-3 px-4">
                        <div className="space-y-1 max-w-[160px]">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-slate-500">Terpakai: <strong>{usedSes}</strong></span>
                            <span className="font-bold text-emerald-700">Sisa: <strong>{remainingSes}</strong></span>
                          </div>
                          {/* Progress bar */}
                          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-emerald-600 h-1.5 rounded-full transition-all"
                              style={{ width: `${percentUsed}%` }}
                            />
                          </div>
                          <span className="text-[10px] text-slate-400 block text-right">
                            Total {totalSes} Sesi
                          </span>
                        </div>
                      </td>

                      {/* Period */}
                      <td className="py-3 px-4">
                        <div className="space-y-0.5">
                          <div className="font-medium text-slate-800">
                            {m.startDate} s/d {m.endDate}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {isExp ? 'Telah berakhir' : 'Aktif'}
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        {isExp || m.status === 'EXPIRED' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                            <UserX className="w-3 h-3 text-rose-500" />
                            Expired
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <UserCheck className="w-3 h-3 text-emerald-500" />
                            Aktif
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={() => setSelectedMember(m)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold text-[11px] transition-colors cursor-pointer"
                            title="Detail Sesi & WhatsApp"
                          >
                            Detail Sesi
                          </button>
                          <button
                            type="button"
                            onClick={() => setSelectedInvoiceMember(m)}
                            className="p-1.5 rounded-lg text-blue-600 hover:text-blue-800 hover:bg-blue-50 border border-blue-200 transition-colors cursor-pointer"
                            title="Cetak & Download Invoice Member"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenExtend(m)}
                            className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-[11px] transition-colors cursor-pointer"
                            title="Perpanjang Masa Aktif"
                          >
                            +Bulan
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(m)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                            title="Edit Data Member"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteTargetId(m.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
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

      {/* MODAL 1: FORM PENDAFTARAN LENGKAP MEMBER BULANAN */}
      <Modal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        title="Formulir Pendaftaran Member Bulanan Baru"
        maxWidth="max-w-3xl"
      >
        <form onSubmit={handleSubmitRegister} className="space-y-5 text-xs">
          {/* Header Info */}
          <div className="p-3 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl text-emerald-950 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-[11px] leading-relaxed">
              Pendaftaran member akan <strong>secara otomatis membuat jadwal seluruh sesi pertemuan</strong> di kalender lapangan utama dengan validasi anti double-booking. Tarif member Rp25.000/jam otomatis diterapkan.
            </div>
          </div>

          {/* SECTION A: DATA PELANGGAN */}
          <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
            <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs uppercase tracking-wider pb-1 border-b border-slate-100">
              <Users className="w-3.5 h-3.5 text-emerald-600" />
              <span>A. Data Pelanggan</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Nama Lengkap Member <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Hendra Setiawan"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm font-semibold rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 bg-white text-slate-900 placeholder:text-slate-400"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Nomor WhatsApp <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="Contoh: 081234567890"
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm font-semibold rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 bg-white text-slate-900 placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Alamat Member (Opsional)
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Jl. Danau Sunter No. 12"
                  value={formAddress}
                  onChange={(e) => setFormAddress(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 bg-white text-slate-900 placeholder:text-slate-400"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Catatan Pelanggan (Opsional)
                </label>
                <input
                  type="text"
                  placeholder="Grup sparring, preferensi lapangan..."
                  value={formClientNotes}
                  onChange={(e) => setFormClientNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 bg-white text-slate-900 placeholder:text-slate-400"
                />
              </div>
            </div>
          </div>

          {/* SECTION B: DATA MEMBERSHIP */}
          <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
            <div className="flex items-center justify-between pb-1 border-b border-slate-100">
              <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs uppercase tracking-wider">
                <Crown className="w-3.5 h-3.5 text-amber-500" />
                <span>B. Data Membership & Paket</span>
              </div>
              <span className="text-[11px] text-slate-500 font-medium">
                Pilih paket atau atur kustom
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Pilih Paket Member <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formPackageId}
                  onChange={(e) => handlePackageChange(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500"
                >
                  {packages.map((pkg) => (
                    <option key={pkg.id} value={pkg.id}>
                      {pkg.name} ({pkg.sessionCount}x sesi • {pkg.durationHours} Jam)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Tanggal Mulai <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={formStartDate}
                  onChange={(e) => setFormStartDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 bg-white text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Tanggal Berakhir <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={formEndDate}
                  onChange={(e) => setFormEndDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 bg-white text-slate-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Jumlah Sesi per Bulan <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  max="31"
                  required
                  value={formSessionCount}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setFormSessionCount(val);
                    handleRecalculatePricing(val, formDurationHours, formCustomRate, formPricingModel);
                  }}
                  className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 bg-white text-slate-900"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">Fleksibel (4, 8, 12, atau kustom)</span>
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Durasi Bermain per Sesi <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formDurationHours}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setFormDurationHours(val);
                    handleRecalculatePricing(formSessionCount, val, formCustomRate, formPricingModel);
                  }}
                  className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 bg-white text-slate-900"
                >
                  {[1, 2, 3, 4, 5].map((d) => (
                    <option key={d} value={d}>
                      {d} Jam per Pertemuan
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Tarif Khusus Member (/jam) <span className="text-rose-500">*</span>
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
                    value={formCustomRate}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setFormCustomRate(val);
                      handleRecalculatePricing(formSessionCount, formDurationHours, val, formPricingModel);
                    }}
                    className="w-full pl-9 pr-3 py-2 text-xs font-bold rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 bg-white text-emerald-700"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION C: JADWAL PERTEMUAN (Mengunci jadwal di sistem utama) */}
          <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
            <div className="flex items-center justify-between pb-1 border-b border-slate-100">
              <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs uppercase tracking-wider">
                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                <span>C. Jadwal Pertemuan & Lapangan</span>
              </div>
              <span className="text-[11px] font-semibold text-emerald-700">
                Otomatis mengunci seluruh rentang {formDurationHours} jam
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Lapangan yang Digunakan <span className="text-rose-500">*</span>
                </label>
                <select
                  required
                  value={formCourtId}
                  onChange={(e) => setFormCourtId(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-blue-500"
                >
                  {courts.map((court) => (
                    <option key={court.id} value={court.id}>
                      {court.name} - {formatRupiah(court.memberHourlyRate || 25000)}/jam
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Jam Mulai Bermain <span className="text-rose-500">*</span>
                </label>
                <select
                  required
                  value={formTimeSlotId}
                  onChange={(e) => setFormTimeSlotId(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-blue-500"
                >
                  {timeSlots.map((slot) => (
                    <option key={slot.id} value={slot.id}>
                      {slot.startTime} (Mulai) &rarr; Selesai {addHoursToTime(slot.startTime, formDurationHours)} ({formDurationHours} Jam)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Pilihan Hari Rutin */}
            <div>
              <label className="block font-semibold text-slate-800 mb-1.5">
                Pilih Hari Bermain Rutin: <span className="text-rose-500">*</span>
              </label>
              <div className="flex flex-wrap gap-1.5">
                {DAY_OPTIONS.map((day) => {
                  const isSelected = formSelectedDays.includes(day.value);
                  return (
                    <button
                      type="button"
                      key={day.value}
                      onClick={() => toggleDay(day.value)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {day.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Generated Session Dates Preview & Conflict Alert */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-slate-700">
                  Daftar Sesi Tergenerate: <strong>{generatedDatesPreview.length} Tanggal Pertemuan</strong>
                </span>
                <span className="text-slate-500">
                  Kuota Paket: <strong>{formSessionCount} Sesi</strong>
                </span>
              </div>

              {/* Warning if session count differs from generated dates */}
              {generatedDatesPreview.length !== Number(formSessionCount) && (
                <div className="p-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-[11px] flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>
                    Jumlah hari dalam periode ({generatedDatesPreview.length} tanggal) berbeda dengan kuota paket ({formSessionCount} sesi). Sistem akan mengunci {Math.min(generatedDatesPreview.length, Number(formSessionCount))} jadwal terawal.
                  </span>
                </div>
              )}

              {/* Conflict banner */}
              {scheduleConflictCheck && !scheduleConflictCheck.isAvailable && (
                <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-300 text-rose-900 text-[11px] space-y-1">
                  <div className="font-bold flex items-center gap-1.5 text-rose-950">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>Peringatan Bentrok Jadwal! ({scheduleConflictCheck.conflictingDates.length} sesi bertabrakan)</span>
                  </div>
                  <div className="max-h-24 overflow-y-auto pl-5 space-y-0.5 text-[10px]">
                    {scheduleConflictCheck.conflictingDates.map((c, i) => (
                      <div key={i} className="text-rose-800">
                        &bull; <strong>{c.formattedDate}</strong>: {c.reason}
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-rose-700 pt-0.5">
                    Silakan ubah jam mulai, hari, atau lapangan sebelum menyimpan.
                  </p>
                </div>
              )}

              {/* Date pill preview */}
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pt-1">
                {generatedDatesPreview.map((d, i) => {
                  let lbl = d;
                  try {
                    const [y, m, dt] = d.split('-').map(Number);
                    const o = new Date(y, m - 1, dt);
                    lbl = o.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' });
                  } catch {
                    lbl = d;
                  }
                  return (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[11px] font-medium text-slate-800 shadow-2xs"
                    >
                      Sesi {i + 1}: {lbl}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>

          {/* SECTION D: PEMBAYARAN */}
          <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
            <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs uppercase tracking-wider pb-1 border-b border-slate-100">
              <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
              <span>D. Pembayaran & Pelunasan</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Total Biaya Paket (Rp) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  step="5000"
                  required
                  value={formTotalAmount}
                  onChange={(e) => setFormTotalAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 bg-white text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Uang Muka / Pembayaran Masuk (Rp) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  step="5000"
                  required
                  value={formDepositAmount}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setFormDepositAmount(val);
                    if (val >= formTotalAmount && formTotalAmount > 0) {
                      setFormPaymentStatus('LUNAS');
                    } else if (val > 0) {
                      setFormPaymentStatus('DP');
                    } else {
                      setFormPaymentStatus('BELUM BAYAR');
                    }
                  }}
                  className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 bg-white text-emerald-700"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Sisa Tagihan
                </label>
                <div className="px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 bg-slate-100 text-slate-900">
                  {formatRupiah(Math.max(0, formTotalAmount - formDepositAmount))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Metode Pembayaran
                </label>
                <select
                  value={formPaymentMethod}
                  onChange={(e) => setFormPaymentMethod(e.target.value as PaymentMethod)}
                  className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-300 bg-white text-slate-900"
                >
                  <option value="TRANSFER">Transfer Bank</option>
                  <option value="CASH">Tunai (Cash)</option>
                  <option value="QRIS">QRIS</option>
                  <option value="LAINNYA">Lainnya</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Status Pembayaran
                </label>
                <select
                  value={formPaymentStatus}
                  onChange={(e) => setFormPaymentStatus(e.target.value as PaymentStatus)}
                  className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-300 bg-white text-slate-900"
                >
                  <option value="LUNAS">LUNAS</option>
                  <option value="DP">DP (Uang Muka)</option>
                  <option value="BELUM BAYAR">BELUM BAYAR</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Catatan Pembayaran (Opsional)
                </label>
                <input
                  type="text"
                  placeholder="No referensi transfer, dll."
                  value={formPaymentNotes}
                  onChange={(e) => setFormPaymentNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white text-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsRegisterOpen(false)}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-50 font-medium transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={Boolean(scheduleConflictCheck && !scheduleConflictCheck.isAvailable)}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold transition-all shadow-sm hover:shadow-md cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Daftarkan Member & Kunci Jadwal</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL 2: SUCCESS DIALOG WITH 3 WHATSAPP ACTIONS (Requirement 8) */}
      <Modal
        isOpen={Boolean(registeredMemberSuccess)}
        onClose={() => setRegisteredMemberSuccess(null)}
        title="Member Berhasil Terdaftar!"
        maxWidth="max-w-lg"
      >
        {registeredMemberSuccess && (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <h4 className="font-bold text-sm text-emerald-900">
                  {registeredMemberSuccess.member.name} ({registeredMemberSuccess.member.memberCode})
                </h4>
              </div>
              <p className="text-xs text-emerald-800 leading-relaxed">
                Paket <strong>{registeredMemberSuccess.member.packageName || registeredMemberSuccess.member.membershipType}</strong> berhasil diaktifkan dengan <strong>{registeredMemberSuccess.bookings.length} sesi pertemuan</strong> yang telah terkunci di kalender jadwal lapangan.
              </p>
            </div>

            <div className="space-y-2">
              <span className="font-bold text-slate-800 text-xs block">
                Kirim Bukti & Detail ke WhatsApp Pelanggan:
              </span>

              {/* WA Action 1: Kirim Info Membership */}
              <a
                href={generateMemberInfoWhatsAppUrl({
                  settings: businessSettings,
                  member: registeredMemberSuccess.member,
                  sendToCustomer: true,
                })}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full p-3 rounded-xl border border-emerald-300 bg-emerald-50/60 hover:bg-emerald-100/80 text-emerald-900 font-semibold flex items-center justify-between transition-colors shadow-2xs"
              >
                <div className="flex items-center gap-2.5">
                  <Crown className="w-4 h-4 text-emerald-600" />
                  <div>
                    <div className="text-xs font-bold">1. Kirim Informasi Membership</div>
                    <div className="text-[10px] text-emerald-700 font-normal">
                      Detail paket, masa aktif, tarif Rp25.000/jam, & status pembayaran
                    </div>
                  </div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-emerald-600" />
              </a>

              {/* WA Action 2: Kirim Jadwal Pertemuan */}
              <a
                href={generateMemberScheduleWhatsAppUrl({
                  settings: businessSettings,
                  member: registeredMemberSuccess.member,
                  sessionDates: registeredMemberSuccess.bookings.map((b) => b.date),
                  sendToCustomer: true,
                })}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full p-3 rounded-xl border border-blue-300 bg-blue-50/60 hover:bg-blue-100/80 text-blue-900 font-semibold flex items-center justify-between transition-colors shadow-2xs"
              >
                <div className="flex items-center gap-2.5">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <div>
                    <div className="text-xs font-bold">2. Kirim Jadwal Pertemuan Lengkap</div>
                    <div className="text-[10px] text-blue-700 font-normal">
                      Daftar semua tanggal sesi, lapangan, jam main & tata tertib
                    </div>
                  </div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
              </a>

              {/* WA Action 3: Kirim Invoice Membership */}
              <a
                href={generateMemberInvoiceWhatsAppUrl({
                  settings: businessSettings,
                  member: registeredMemberSuccess.member,
                  sendToCustomer: true,
                })}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full p-3 rounded-xl border border-purple-300 bg-purple-50/60 hover:bg-purple-100/80 text-purple-900 font-semibold flex items-center justify-between transition-colors shadow-2xs"
              >
                <div className="flex items-center gap-2.5">
                  <Receipt className="w-4 h-4 text-purple-600" />
                  <div>
                    <div className="text-xs font-bold">3. Kirim Invoice Membership</div>
                    <div className="text-[10px] text-purple-700 font-normal">
                      Kuitansi tagihan resmi, rincian biaya, DP, & nomor rekening
                    </div>
                  </div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-purple-600" />
              </a>

              {/* Cetak & Download Invoice Langsung */}
              <button
                type="button"
                onClick={() => setSelectedInvoiceMember(registeredMemberSuccess.member)}
                className="w-full p-3 rounded-xl border border-emerald-400 bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center justify-between transition-colors shadow-sm cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Printer className="w-4 h-4 text-white" />
                  <div className="text-left">
                    <div className="text-xs font-bold text-white">4. Cetak / Download Invoice Resmi</div>
                    <div className="text-[10px] text-emerald-100 font-normal">
                      Preview kuitansi lengkap, cetak printer, atau simpan file invoice PDF
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setRegisteredMemberSuccess(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Selesai & Tutup
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* MODAL 3: DETAIL MEMBER & RIWAYAT PERTEMUAN (Requirement 5) */}
      <Modal
        isOpen={Boolean(selectedMember)}
        onClose={() => setSelectedMember(null)}
        title="Profil Member & Monitoring Sesi Pertemuan"
        maxWidth="max-w-2xl"
      >
        {selectedMember && (() => {
          const sessionDetails = store.getMemberSessionDetails(selectedMember.id);
          const totalSes = selectedMember.sessionCount || sessionDetails.totalSessions || 4;
          const usedSes = sessionDetails.usedSessions;
          const remainingSes = sessionDetails.remainingSessions;

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
                    <p className="font-mono text-xs text-amber-300">ID: {selectedMember.memberCode}</p>
                    <p className="text-[11px] text-slate-300 mt-0.5">
                      {selectedMember.packageName || selectedMember.membershipType}
                    </p>
                  </div>
                </div>

                <div className="text-left sm:text-right space-y-0.5">
                  <div className="text-[11px] text-slate-400">Tarif Khusus Member:</div>
                  <div className="text-base font-bold text-emerald-400">
                    {formatRupiah(selectedMember.customHourlyRate || 25000)} / jam
                  </div>
                  <div className="text-[11px] text-slate-300">
                    Periode: {selectedMember.startDate} s/d {selectedMember.endDate}
                  </div>
                </div>
              </div>

              {/* Session Consumption Stat Cards */}
              <div className="grid grid-cols-4 gap-2.5 text-center">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-500 font-semibold block">Total Sesi</span>
                  <p className="text-lg font-bold text-slate-900 mt-0.5">{totalSes}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200">
                  <span className="text-[10px] text-blue-700 font-semibold block">Sesi Terpakai</span>
                  <p className="text-lg font-bold text-blue-800 mt-0.5">{usedSes}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200">
                  <span className="text-[10px] text-emerald-700 font-semibold block">Sisa Sesi</span>
                  <p className="text-lg font-bold text-emerald-800 mt-0.5">{remainingSes}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200">
                  <span className="text-[10px] text-amber-700 font-semibold block">Durasi / Sesi</span>
                  <p className="text-lg font-bold text-amber-800 mt-0.5">{selectedMember.durationHours || 3} Jam</p>
                </div>
              </div>

              {/* Meeting Sessions Table (Riwayat Setiap Pertemuan) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                  <span className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-600" />
                    <span>Daftar Sesi Pertemuan ({sessionDetails.bookings.length} Terjadwal)</span>
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Sesi dibatalkan tidak memotong kuota bermain
                  </span>
                </div>

                {sessionDetails.bookings.length === 0 ? (
                  <div className="p-6 text-center text-slate-400 bg-slate-50 rounded-xl">
                    Belum ada sesi pertemuan yang dibuat untuk member ini.
                  </div>
                ) : (
                  <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                    {sessionDetails.bookings.map((b, idx) => {
                      const isPast = b.date < getTodayString(0);
                      return (
                        <div
                          key={b.id}
                          className="p-2.5 rounded-xl border border-slate-200 bg-white flex items-center justify-between shadow-2xs hover:border-slate-300"
                        >
                          <div className="space-y-0.5">
                            <div className="font-bold text-slate-900 flex items-center gap-2">
                              <span>Sesi {idx + 1}: {b.date}</span>
                              <span className="font-mono text-[10px] text-slate-400">#{b.bookingCode}</span>
                            </div>
                            <div className="text-[11px] text-slate-500">
                              {b.courtName} &bull; {b.timeSlotLabel} ({b.durationHours || 1} Jam)
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                b.bookingStatus === 'COMPLETED' || (isPast && b.bookingStatus !== 'CANCELLED')
                                  ? 'bg-blue-100 text-blue-700'
                                  : b.bookingStatus === 'CANCELLED'
                                  ? 'bg-rose-100 text-rose-700'
                                  : 'bg-emerald-100 text-emerald-700'
                              }`}
                            >
                              {b.bookingStatus === 'COMPLETED' || (isPast && b.bookingStatus !== 'CANCELLED')
                                ? 'Selesai'
                                : b.bookingStatus === 'CANCELLED'
                                ? 'Dibatalkan'
                                : 'Terjadwal'}
                            </span>

                            {/* Quick status change dropdown */}
                            <select
                              value={b.bookingStatus}
                              onChange={(e) => {
                                store.updateMemberSessionStatus(b.id, e.target.value as any);
                                success('Status Sesi Diubah', `Sesi ${idx + 1} diubah menjadi ${e.target.value}.`);
                                onRefresh();
                              }}
                              className="px-2 py-0.5 rounded border border-slate-200 text-[10px] font-semibold bg-slate-50 text-slate-700"
                            >
                              <option value="CONFIRMED">Terjadwal</option>
                              <option value="COMPLETED">Selesai</option>
                              <option value="CANCELLED">Batalkan Sesi</option>
                            </select>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* WhatsApp Quick Actions Footer */}
              <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <a
                    href={generateMemberInfoWhatsAppUrl({
                      settings: businessSettings,
                      member: selectedMember,
                      sendToCustomer: true,
                    })}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold text-[11px] transition-colors"
                  >
                    <Crown className="w-3 h-3" />
                    <span>Kirim Info WA</span>
                  </a>

                  <a
                    href={generateMemberScheduleWhatsAppUrl({
                      settings: businessSettings,
                      member: selectedMember,
                      sessionDates: sessionDetails.bookings.map((b) => b.date),
                      sendToCustomer: true,
                    })}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold text-[11px] transition-colors"
                  >
                    <Calendar className="w-3 h-3" />
                    <span>Kirim Jadwal WA</span>
                  </a>

                  <a
                    href={generateMemberInvoiceWhatsAppUrl({
                      settings: businessSettings,
                      member: selectedMember,
                      sendToCustomer: true,
                    })}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 font-semibold text-[11px] transition-colors"
                  >
                    <Receipt className="w-3 h-3" />
                    <span>Kirim Invoice WA</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => setSelectedInvoiceMember(selectedMember)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition-colors shadow-2xs cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Cetak Invoice</span>
                  </button>
                </div>

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

      {/* MODAL 4: EDIT BASIC MEMBER DATA */}
      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title={editingMember ? `Edit Data Member (${editingMember.memberCode})` : 'Edit Member'}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-800 mb-1">
              Nama Lengkap Member <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 bg-white text-slate-900"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-800 mb-1">
              Nomor WhatsApp <span className="text-rose-500">*</span>
            </label>
            <input
              type="tel"
              required
              value={editPhone}
              onChange={(e) => setEditPhone(e.target.value)}
              className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 bg-white text-slate-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                Mulai Keanggotaan
              </label>
              <input
                type="date"
                required
                value={editStartDate}
                onChange={(e) => setEditStartDate(e.target.value)}
                className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-300 bg-white text-slate-900"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                Berakhir Keanggotaan
              </label>
              <input
                type="date"
                required
                value={editEndDate}
                onChange={(e) => setEditEndDate(e.target.value)}
                className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-300 bg-white text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                Tarif Khusus (/jam)
              </label>
              <input
                type="number"
                min="0"
                step="1000"
                required
                value={editCustomRate}
                onChange={(e) => setEditCustomRate(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-300 bg-white text-slate-900"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                Status Member
              </label>
              <select
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value as MemberStatus)}
                className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-300 bg-white text-slate-900"
              >
                <option value="ACTIVE">Aktif</option>
                <option value="INACTIVE">Tidak Aktif</option>
                <option value="EXPIRED">Expired</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-800 mb-1">
              Alamat (Opsional)
            </label>
            <input
              type="text"
              value={editAddress}
              onChange={(e) => setEditAddress(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white text-slate-900"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-800 mb-1">
              Catatan (Opsional)
            </label>
            <textarea
              rows={2}
              value={editNotes}
              onChange={(e) => setEditNotes(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white text-slate-900"
            />
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsEditOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-50 font-medium"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-sm"
            >
              Simpan Perubahan
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL 5: PERPANJANG MASA KEANGGOTAAN */}
      <Modal
        isOpen={isExtendOpen}
        onClose={() => setIsExtendOpen(false)}
        title={`Perpanjang Masa Keanggotaan: ${extendingMember?.name || ''}`}
        maxWidth="max-w-md"
      >
        {extendingMember && (
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">ID Member:</span>
                <span className="font-mono font-bold text-slate-800">{extendingMember.memberCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Masa Aktif Saat Ini:</span>
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
                    className={`py-2 px-1 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
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
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-50 font-medium"
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

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deleteTargetId)}
        title="Hapus Member Bulanan?"
        message="Data keanggotaan member ini akan dihapus dari sistem. Riwayat transaksi sebelumnya tetap tersimpan di arsip laporan."
        confirmText="Hapus Member"
        cancelText="Batal"
        variant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTargetId(null)}
      />

      {/* Invoice Modal for Preview, Printing & Download */}
      <InvoiceModal
        isOpen={Boolean(selectedInvoiceMember)}
        onClose={() => setSelectedInvoiceMember(null)}
        member={selectedInvoiceMember}
        settings={businessSettings}
      />
    </div>
  );
};

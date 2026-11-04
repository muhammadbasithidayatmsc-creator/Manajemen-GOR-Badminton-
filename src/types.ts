export type Role = 'owner' | 'admin' | 'OWNER' | 'ADMIN';
export type UserRole = 'OWNER' | 'ADMIN' | 'owner' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  username?: string;
  password?: string;
  phone: string;
  role: Role;
  active: boolean;
  avatar?: string;
}

export type CourtStatus = 'ACTIVE' | 'MAINTENANCE' | 'INACTIVE';

export interface Court {
  id: string;
  name: string;
  code: string;
  status: CourtStatus;
  notes?: string;
  hourlyRate: number; // Tarif Reguler per jam (default Rp30.000)
  memberHourlyRate?: number; // Tarif Khusus Member Bulanan per jam (default Rp25.000)
  surfaceType?: string;
}

export interface TimeSlot {
  id: string;
  startTime: string; // e.g., "08:00"
  endTime: string;   // e.g., "09:00"
  label: string;     // e.g., "08:00 - 09:00"
  active: boolean;
  sortOrder: number;
}

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
export type PaymentStatus = 'BELUM BAYAR' | 'DP' | 'LUNAS';
export type PaymentMethod = 'CASH' | 'TRANSFER' | 'QRIS' | 'LAINNYA';
export type BookingType = 'REGULAR' | 'MONTHLY';
export type CustomerType = 'REGULAR' | 'MEMBER';
export type MemberStatus = 'ACTIVE' | 'INACTIVE' | 'EXPIRED';
export type PackagePricingModel = 'FIXED_PACKAGE' | 'PER_SESSION';

export interface Customer {
  id: string;
  name: string;
  phone: string;
  notes?: string;
  createdAt: string;
}

export interface MemberPackage {
  id: string;
  name: string; // e.g. "Member Bulanan Reguler (4 Sesi)"
  pricingModel: PackagePricingModel; // 'FIXED_PACKAGE' | 'PER_SESSION'
  price: number; // Harga total paket per bulan (e.g. 300000)
  memberHourlyRate: number; // Tarif khusus per jam (e.g. 25000)
  sessionCount: number; // Jumlah sesi/pertemuan per bulan (e.g. 4, 8, 12, or custom)
  durationHours: number; // Durasi jam bermain per sesi (e.g. 3)
  validityMonths: number; // Masa berlaku paket (default 1 bulan)
  allowedDays?: number[]; // Hari yang diperbolehkan (0=Minggu, 1=Senin, ..., 6=Sabtu)
  defaultCourtId?: string;
  defaultTimeSlotId?: string;
  description?: string;
  active: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface Member {
  id: string;
  memberCode: string; // e.g. "MBR-2026-001"
  name: string;
  phone: string;
  address?: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  membershipType: string; // e.g. "Member Bulanan Reguler"
  packageId?: string;
  packageName?: string;
  pricingModel?: PackagePricingModel;
  packagePrice?: number;
  sessionCount?: number; // e.g. 4, 8, 12, etc.
  durationHours?: number; // e.g. 3 jam
  usedSessions?: number; // Sessions completed or past
  remainingSessions?: number; // Total - Used
  selectedDays?: number[];
  selectedDaysLabels?: string[];
  courtId?: string;
  courtName?: string;
  timeSlotId?: string;
  timeSlotLabel?: string;
  monthlyGroupId?: string;
  customHourlyRate?: number; // e.g. 25000
  totalAmount?: number;
  depositAmount?: number;
  remainingAmount?: number;
  paymentStatus?: PaymentStatus;
  paymentMethod?: PaymentMethod;
  status: MemberStatus;
  notes?: string;
  createdAt: string;
}

export interface MonthlyBookingGroup {
  id: string;
  groupCode: string; // e.g. "MBKG-202610-001"
  customerId: string;
  customerName: string;
  customerPhone: string;
  courtId: string;
  courtName: string;
  periodLabel: string; // e.g. "Oktober 2026" or "1 Okt 2026 - 31 Okt 2026"
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  selectedDays: number[]; // 0=Minggu, 1=Senin, ..., 6=Sabtu
  selectedDaysLabels: string[]; // e.g. ['Senin', 'Rabu']
  timeSlotId: string;
  timeSlotLabel: string;
  durationHours?: number;
  sessionCount: number;
  ratePerSession: number;
  totalAmount: number;
  depositAmount: number;
  remainingAmount: number;
  bookingStatus: BookingStatus;
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod;
  notes?: string;
  bookingIds: string[]; // References to individual Booking records generated
  dates: string[]; // List of all dates generated
  createdAt: string;
  customerType?: CustomerType;
  memberId?: string;
  ratePerHour?: number;
}

export interface Booking {
  id: string;
  bookingCode: string; // e.g. "BKG-20260911-001"
  customerId: string;
  customerName: string;
  customerPhone: string;
  courtId: string;
  courtName: string;
  date: string; // YYYY-MM-DD
  timeSlotId: string;
  timeSlotLabel: string;
  durationHours: number;
  totalAmount: number;
  depositAmount: number;
  remainingAmount: number;
  bookingStatus: BookingStatus;
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod;
  notes?: string;
  createdAt: string;
  source?: 'public_whatsapp' | 'admin_manual';
  bookingType?: BookingType;
  monthlyGroupId?: string;
  customerType?: CustomerType; // 'REGULAR' | 'MEMBER'
  memberId?: string;
  ratePerHour?: number; // Snapshot of hourly rate applied (e.g. 30000 or 25000)
}

export interface Transaction {
  id: string;
  transactionNumber: string; // e.g. "TRX-20260911-001"
  bookingId: string;
  bookingCode: string;
  customerId: string;
  customerName: string;
  courtName: string;
  timeSlotLabel: string;
  date: string;
  totalAmount: number;
  depositAmount: number;
  remainingAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  notes?: string;
  createdAt: string;
  customerType?: CustomerType;
}

export interface BankAccount {
  bankName: string;
  accountNumber: string;
  accountHolder: string;
}

export interface BusinessSettings {
  name: string;
  gorName?: string;
  tagline: string;
  address: string;
  adminWhatsApp: string; // e.g. "628123456789"
  operatingHours: string;
  aboutText: string;
  bookingRules: string[];
  facilities: string[];
  defaultHourlyRate: number;
  hourlyRateDefault?: number;
  defaultMemberHourlyRate?: number;
  bankInfo: string;
  bankAccounts: BankAccount[];
  paymentNotes?: string;
  paymentInstructions?: string;
  waTemplateCustomer?: string;
  waTemplateConfirmation?: string;
  googleMapsUrl?: string;
  qrisInfo: string;
}

export type GorSettings = BusinessSettings;

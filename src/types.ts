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
  hourlyRate: number; // Disimpan untuk admin kalkulasi transaksi, TIDAK ditampilkan di jadwal publik
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

export interface Customer {
  id: string;
  name: string;
  phone: string;
  notes?: string;
  createdAt: string;
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

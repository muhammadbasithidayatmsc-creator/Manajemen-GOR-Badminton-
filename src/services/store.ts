import {
  Booking,
  BookingStatus,
  BookingType,
  BusinessSettings,
  Court,
  Customer,
  CustomerType,
  Member,
  MemberStatus,
  MonthlyBookingGroup,
  PaymentMethod,
  PaymentStatus,
  TimeSlot,
  Transaction,
  User,
} from '../types';
import {
  DEFAULT_CUSTOMER_WA_TEMPLATE,
  DEFAULT_ADMIN_CONFIRMATION_WA_TEMPLATE,
} from '../utils/whatsapp';

const STORAGE_KEYS = {
  SETTINGS: 'gor_settings_v1',
  COURTS: 'gor_courts_v1',
  SLOTS: 'gor_slots_v1',
  CUSTOMERS: 'gor_customers_v1',
  MEMBERS: 'gor_members_v1',
  BOOKINGS: 'gor_bookings_v1',
  MONTHLY_BOOKINGS: 'gor_monthly_bookings_v1',
  TRANSACTIONS: 'gor_transactions_v1',
  USERS: 'gor_users_v1',
  CURRENT_USER: 'gor_current_user_v1',
};

// Initial Business Settings
export const DEFAULT_SETTINGS: BusinessSettings = {
  name: 'GOR Badminton Smash Arena',
  tagline: 'Pusat Rental Lapangan Badminton Terbaik & Nyaman',
  address: 'Jl. Pemuda Olahraga No. 88, Rawamangun, Jakarta Timur',
  adminWhatsApp: '6281803716514',
  operatingHours: '08:00 - 22:00 WIB (Setiap Hari)',
  aboutText:
    'GOR Badminton Smash Arena hadir dengan 4 lapangan berstandar internasional BWF, menggunakan karpet vinyl tebal 5.0mm yang empuk di lutut, pencahayaan LED 500+ lux anti-silau, serta sirkulasi udara yang sejuk untuk pengalaman bermain optimal.',
  bookingRules: [
    'Wajib menggunakan sepatu khusus badminton (non-marking sole).',
    'Booking via WhatsApp akan diverifikasi oleh admin maksimal 15 menit.',
    'Uang muka (DP) minimal 50% untuk mengonfirmasi jadwal booking.',
    'Pelunasan dilakukan di lokasi sebelum sesi bermain dimulai.',
    'Pembatalan booking maksimal H-1 sesi bermain.',
    'Dilarang merokok dan membawa makanan berat ke area karpet lapangan.',
  ],
  facilities: [
    '4 Lapangan Karpet Vinyl BWF Standard 5.0mm',
    'Pencahayaan LED Anti-Silau 500 Lux',
    'Kamar Ganti & Shower Bersih',
    'Kantin Minuman & Shuttlecock Ready',
    'Musholla & Area Tunggu Luas',
    'Parkir Mobil & Motor Aman 24 Jam',
    'Free High-Speed Wi-Fi',
  ],
  defaultHourlyRate: 30000,
  defaultMemberHourlyRate: 25000,
  bankInfo: 'BCA: 8820-1234-56 a/n GOR Badminton Smash Arena',
  bankAccounts: [
    { bankName: 'BCA', accountNumber: '8820-1234-56', accountHolder: 'GOR Badminton Smash Arena' },
    { bankName: 'Mandiri', accountNumber: '120-00-9876543-2', accountHolder: 'Bambang Hartono' },
  ],
  paymentNotes: 'Harap transfer DP minimal 50% untuk konfirmasi jadwal booking. Pembayaran di lokasi dapat menggunakan Tunai atau QRIS.',
  paymentInstructions: 'Transfer DP minimal 50% ke rekening di atas dan kirimkan bukti transfer melalui WhatsApp Admin untuk verifikasi instan.',
  waTemplateCustomer: DEFAULT_CUSTOMER_WA_TEMPLATE,
  waTemplateConfirmation: DEFAULT_ADMIN_CONFIRMATION_WA_TEMPLATE,
  qrisInfo: 'Tersedia QRIS All Payment di meja resepsionis',
};

// Initial Courts (Default: Reguler Rp30.000/jam, Member Bulanan Rp25.000/jam)
export const DEFAULT_COURTS: Court[] = [
  {
    id: 'court-1',
    name: 'Court 1 (Utama)',
    code: 'C-01',
    status: 'ACTIVE',
    notes: 'Dekat tribun penonton, karpet vinyl hijau BWF',
    hourlyRate: 30000,
    memberHourlyRate: 25000,
    surfaceType: 'Vinyl BWF 5.0mm',
  },
  {
    id: 'court-2',
    name: 'Court 2',
    code: 'C-02',
    status: 'ACTIVE',
    notes: 'Sirkulasi udara samping, sangat nyaman',
    hourlyRate: 30000,
    memberHourlyRate: 25000,
    surfaceType: 'Vinyl BWF 5.0mm',
  },
  {
    id: 'court-3',
    name: 'Court 3',
    code: 'C-03',
    status: 'ACTIVE',
    notes: 'Cocok untuk latihan rutin dan sparring',
    hourlyRate: 30000,
    memberHourlyRate: 25000,
    surfaceType: 'Vinyl BWF 5.0mm',
  },
  {
    id: 'court-4',
    name: 'Court 4',
    code: 'C-04',
    status: 'ACTIVE',
    notes: 'Paling privat di sudut belakang',
    hourlyRate: 30000,
    memberHourlyRate: 25000,
    surfaceType: 'Vinyl BWF 5.0mm',
  },
];

// Initial Members
export const DEFAULT_MEMBERS: Member[] = [
  {
    id: 'mbr-1',
    memberCode: 'MBR-2026-001',
    name: 'Kevin Sanjaya',
    phone: '081234567891',
    address: 'Rawamangun, Jakarta Timur',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    membershipType: 'Member Bulanan VIP',
    customHourlyRate: 25000,
    status: 'ACTIVE',
    notes: 'Member rutin main hari Senin & Kamis',
    createdAt: '2026-01-01',
  },
  {
    id: 'mbr-2',
    memberCode: 'MBR-2026-002',
    name: 'Hendra Setiawan',
    phone: '081298765432',
    address: 'Kelapa Gading, Jakarta Utara',
    startDate: '2026-02-01',
    endDate: '2026-11-30',
    membershipType: 'Member Bulanan Reguler',
    customHourlyRate: 25000,
    status: 'ACTIVE',
    notes: 'Langganan hari Sabtu malam Court 1',
    createdAt: '2026-02-01',
  },
  {
    id: 'mbr-3',
    memberCode: 'MBR-2026-003',
    name: 'Fajar Alfian',
    phone: '085611223344',
    address: 'Tebet, Jakarta Selatan',
    startDate: '2026-03-01',
    endDate: '2026-11-10',
    membershipType: 'Member Bulanan Reguler',
    customHourlyRate: 25000,
    status: 'ACTIVE',
    notes: 'Akan expired dalam beberapa hari',
    createdAt: '2026-03-01',
  },
  {
    id: 'mbr-4',
    memberCode: 'MBR-2026-004',
    name: 'Jonatan Christie',
    phone: '082155667788',
    address: 'Cempaka Putih, Jakarta Pusat',
    startDate: '2025-08-01',
    endDate: '2026-08-01',
    membershipType: 'Member Bulanan Reguler',
    customHourlyRate: 25000,
    status: 'EXPIRED',
    notes: 'Keanggotaan sudah lewat masa aktif',
    createdAt: '2025-08-01',
  },
];

// Initial Time Slots (12 Sesi dinamis)
export const DEFAULT_TIME_SLOTS: TimeSlot[] = [
  { id: 'slot-1', startTime: '08:00', endTime: '09:00', label: '08:00 - 09:00', active: true, sortOrder: 1 },
  { id: 'slot-2', startTime: '09:00', endTime: '10:00', label: '09:00 - 10:00', active: true, sortOrder: 2 },
  { id: 'slot-3', startTime: '10:00', endTime: '11:00', label: '10:00 - 11:00', active: true, sortOrder: 3 },
  { id: 'slot-4', startTime: '11:00', endTime: '12:00', label: '11:00 - 12:00', active: true, sortOrder: 4 },
  { id: 'slot-5', startTime: '13:00', endTime: '14:00', label: '13:00 - 14:00', active: true, sortOrder: 5 },
  { id: 'slot-6', startTime: '14:00', endTime: '15:00', label: '14:00 - 15:00', active: true, sortOrder: 6 },
  { id: 'slot-7', startTime: '15:00', endTime: '16:00', label: '15:00 - 16:00', active: true, sortOrder: 7 },
  { id: 'slot-8', startTime: '16:00', endTime: '17:00', label: '16:00 - 17:00', active: true, sortOrder: 8 },
  { id: 'slot-9', startTime: '18:00', endTime: '19:00', label: '18:00 - 19:00', active: true, sortOrder: 9 },
  { id: 'slot-10', startTime: '19:00', endTime: '20:00', label: '19:00 - 20:00', active: true, sortOrder: 10 },
  { id: 'slot-11', startTime: '20:00', endTime: '21:00', label: '20:00 - 21:00', active: true, sortOrder: 11 },
  { id: 'slot-12', startTime: '21:00', endTime: '22:00', label: '21:00 - 22:00', active: true, sortOrder: 12 },
];

// Initial Users
export const DEFAULT_USERS: User[] = [
  {
    id: 'user-owner-1',
    name: 'Bambang Hartono',
    username: 'owner',
    email: 'owner@gorarena.com',
    password: 'admin123',
    phone: '081298765432',
    role: 'owner',
    active: true,
  },
  {
    id: 'user-admin-1',
    name: 'Siti Rahmawati',
    username: 'admin',
    email: 'admin@gorarena.com',
    password: 'admin123',
    phone: '081344556677',
    role: 'admin',
    active: true,
  },
];

// Initial Customers
export const DEFAULT_CUSTOMERS: Customer[] = [
  { id: 'cust-1', name: 'Kevin Sanjaya', phone: '081234567891', notes: 'Komunitas PB Jaya, main double', createdAt: '2026-08-01' },
  { id: 'cust-2', name: 'Hendra Setiawan', phone: '081298765432', notes: 'Langganan hari Sabtu malam', createdAt: '2026-08-05' },
  { id: 'cust-3', name: 'Fajar Alfian', phone: '085611223344', notes: 'Member latihan sore', createdAt: '2026-08-10' },
  { id: 'cust-4', name: 'Apriyani Rahayu', phone: '081377889900', notes: 'Grup Kantor Telkom', createdAt: '2026-08-15' },
  { id: 'cust-5', name: 'Jonatan Christie', phone: '082155667788', notes: 'Sparring tunggal putra', createdAt: '2026-08-20' },
  { id: 'cust-6', name: 'Anthony Ginting', phone: '081844556677', notes: 'Main santai akhir pekan', createdAt: '2026-08-25' },
];

// Helper to get formatted date string: YYYY-MM-DD
export function getTodayString(offsetDays = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Generates all dates (YYYY-MM-DD) between startDate and endDate
 * filtered by selected day-of-week indices (0=Sunday, 1=Monday, ..., 6=Saturday).
 * If selectedDays is empty, all dates in range are returned.
 */
export function generateMonthlyDates(
  startDate: string,
  endDate: string,
  selectedDays: number[] = []
): string[] {
  const dates: string[] = [];
  try {
    if (!startDate || !endDate) return [];
    const start = new Date(startDate + 'T00:00:00');
    const end = new Date(endDate + 'T23:59:59');
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || start > end) {
      return [];
    }

    const cur = new Date(start);
    let guard = 0;
    while (cur <= end && guard < 120) {
      const dayOfWeek = cur.getDay();
      if (selectedDays.length === 0 || selectedDays.includes(dayOfWeek)) {
        const y = cur.getFullYear();
        const m = String(cur.getMonth() + 1).padStart(2, '0');
        const d = String(cur.getDate()).padStart(2, '0');
        dates.push(`${y}-${m}-${d}`);
      }
      cur.setDate(cur.getDate() + 1);
      guard++;
    }
  } catch (e) {
    console.error('Error generating monthly dates:', e);
  }
  return dates;
}

// Initial Bookings
export function generateInitialBookings(): Booking[] {
  const today = getTodayString(0);
  const yesterday = getTodayString(-1);
  const dayMinus2 = getTodayString(-2);
  const dayMinus3 = getTodayString(-3);
  const tomorrow = getTodayString(1);

  return [
    // Today bookings
    {
      id: 'bkg-01',
      bookingCode: 'BKG-0801',
      customerId: 'cust-1',
      customerName: 'Kevin Sanjaya',
      customerPhone: '081234567891',
      courtId: 'court-1',
      courtName: 'Court 1 (Utama)',
      date: today,
      timeSlotId: 'slot-1',
      timeSlotLabel: '08:00 - 09:00',
      durationHours: 1,
      totalAmount: 85000,
      depositAmount: 85000,
      remainingAmount: 0,
      bookingStatus: 'COMPLETED',
      paymentStatus: 'LUNAS',
      paymentMethod: 'CASH',
      notes: 'Sesi pagi sparring selesai tepat waktu',
      createdAt: `${today} 07:30`,
    },
    {
      id: 'bkg-02',
      bookingCode: 'BKG-0802',
      customerId: 'cust-2',
      customerName: 'Hendra Setiawan',
      customerPhone: '081298765432',
      courtId: 'court-2',
      courtName: 'Court 2',
      date: today,
      timeSlotId: 'slot-2',
      timeSlotLabel: '09:00 - 10:00',
      durationHours: 1,
      totalAmount: 75000,
      depositAmount: 75000,
      remainingAmount: 0,
      bookingStatus: 'COMPLETED',
      paymentStatus: 'LUNAS',
      paymentMethod: 'TRANSFER',
      notes: 'Transfer BCA sudah diverifikasi',
      createdAt: `${today} 08:15`,
    },
    {
      id: 'bkg-03',
      bookingCode: 'BKG-0803',
      customerId: 'cust-3',
      customerName: 'Fajar Alfian',
      customerPhone: '085611223344',
      courtId: 'court-1',
      courtName: 'Court 1 (Utama)',
      date: today,
      timeSlotId: 'slot-9',
      timeSlotLabel: '18:00 - 19:00',
      durationHours: 1,
      totalAmount: 85000,
      depositAmount: 50000,
      remainingAmount: 35000,
      bookingStatus: 'CONFIRMED',
      paymentStatus: 'DP',
      paymentMethod: 'QRIS',
      notes: 'DP 50rb via QRIS, sisa 35rb saat datang',
      createdAt: `${today} 10:00`,
    },
    {
      id: 'bkg-04',
      bookingCode: 'BKG-0804',
      customerId: 'cust-4',
      customerName: 'Apriyani Rahayu',
      customerPhone: '081377889900',
      courtId: 'court-3',
      courtName: 'Court 3',
      date: today,
      timeSlotId: 'slot-10',
      timeSlotLabel: '19:00 - 20:00',
      durationHours: 1,
      totalAmount: 75000,
      depositAmount: 75000,
      remainingAmount: 0,
      bookingStatus: 'CONFIRMED',
      paymentStatus: 'LUNAS',
      paymentMethod: 'TRANSFER',
      notes: 'Lunas transfer kantor',
      createdAt: `${today} 11:20`,
    },
    {
      id: 'bkg-05',
      bookingCode: 'BKG-0805',
      customerId: 'cust-5',
      customerName: 'Jonatan Christie',
      customerPhone: '082155667788',
      courtId: 'court-2',
      courtName: 'Court 2',
      date: today,
      timeSlotId: 'slot-11',
      timeSlotLabel: '20:00 - 21:00',
      durationHours: 1,
      totalAmount: 75000,
      depositAmount: 0,
      remainingAmount: 75000,
      bookingStatus: 'PENDING',
      paymentStatus: 'BELUM BAYAR',
      notes: 'Booking via WhatsApp, menunggu bukti transfer DP',
      createdAt: `${today} 12:45`,
      source: 'public_whatsapp',
    },
    {
      id: 'bkg-06',
      bookingCode: 'BKG-0806',
      customerId: 'cust-6',
      customerName: 'Anthony Ginting',
      customerPhone: '081844556677',
      courtId: 'court-4',
      courtName: 'Court 4',
      date: today,
      timeSlotId: 'slot-7',
      timeSlotLabel: '15:00 - 16:00',
      durationHours: 1,
      totalAmount: 75000,
      depositAmount: 0,
      remainingAmount: 75000,
      bookingStatus: 'CANCELLED',
      paymentStatus: 'BELUM BAYAR',
      notes: 'Dibatalkan customer karena hujan lebat',
      createdAt: `${today} 09:00`,
    },
    // Tomorrow bookings
    {
      id: 'bkg-07',
      bookingCode: 'BKG-0807',
      customerId: 'cust-2',
      customerName: 'Hendra Setiawan',
      customerPhone: '081298765432',
      courtId: 'court-1',
      courtName: 'Court 1 (Utama)',
      date: tomorrow,
      timeSlotId: 'slot-10',
      timeSlotLabel: '19:00 - 20:00',
      durationHours: 1,
      totalAmount: 85000,
      depositAmount: 85000,
      remainingAmount: 0,
      bookingStatus: 'CONFIRMED',
      paymentStatus: 'LUNAS',
      paymentMethod: 'TRANSFER',
      notes: 'Booking rutin besok malam',
      createdAt: `${today} 13:00`,
    },
    // Past days bookings (for 7-day reports)
    {
      id: 'bkg-08',
      bookingCode: 'BKG-0808',
      customerId: 'cust-1',
      customerName: 'Kevin Sanjaya',
      customerPhone: '081234567891',
      courtId: 'court-1',
      courtName: 'Court 1 (Utama)',
      date: yesterday,
      timeSlotId: 'slot-9',
      timeSlotLabel: '18:00 - 19:00',
      durationHours: 1,
      totalAmount: 85000,
      depositAmount: 85000,
      remainingAmount: 0,
      bookingStatus: 'COMPLETED',
      paymentStatus: 'LUNAS',
      paymentMethod: 'QRIS',
      notes: 'Selesai',
      createdAt: `${yesterday} 14:00`,
    },
    {
      id: 'bkg-09',
      bookingCode: 'BKG-0809',
      customerId: 'cust-3',
      customerName: 'Fajar Alfian',
      customerPhone: '085611223344',
      courtId: 'court-2',
      courtName: 'Court 2',
      date: yesterday,
      timeSlotId: 'slot-10',
      timeSlotLabel: '19:00 - 20:00',
      durationHours: 1,
      totalAmount: 75000,
      depositAmount: 75000,
      remainingAmount: 0,
      bookingStatus: 'COMPLETED',
      paymentStatus: 'LUNAS',
      paymentMethod: 'CASH',
      notes: 'Selesai',
      createdAt: `${yesterday} 15:30`,
    },
    {
      id: 'bkg-10',
      bookingCode: 'BKG-0810',
      customerId: 'cust-4',
      customerName: 'Apriyani Rahayu',
      customerPhone: '081377889900',
      courtId: 'court-3',
      courtName: 'Court 3',
      date: dayMinus2,
      timeSlotId: 'slot-10',
      timeSlotLabel: '19:00 - 20:00',
      durationHours: 1,
      totalAmount: 75000,
      depositAmount: 75000,
      remainingAmount: 0,
      bookingStatus: 'COMPLETED',
      paymentStatus: 'LUNAS',
      paymentMethod: 'TRANSFER',
      notes: 'Selesai',
      createdAt: `${dayMinus2} 10:00`,
    },
    {
      id: 'bkg-11',
      bookingCode: 'BKG-0811',
      customerId: 'cust-5',
      customerName: 'Jonatan Christie',
      customerPhone: '082155667788',
      courtId: 'court-4',
      courtName: 'Court 4',
      date: dayMinus3,
      timeSlotId: 'slot-8',
      timeSlotLabel: '16:00 - 17:00',
      durationHours: 1,
      totalAmount: 75000,
      depositAmount: 75000,
      remainingAmount: 0,
      bookingStatus: 'COMPLETED',
      paymentStatus: 'LUNAS',
      paymentMethod: 'CASH',
      notes: 'Selesai',
      createdAt: `${dayMinus3} 12:00`,
    },
  ];
}

// Initial Transactions corresponding to initial bookings
export function generateInitialTransactions(bookings: Booking[]): Transaction[] {
  const transactions: Transaction[] = [];
  let count = 1;

  for (const b of bookings) {
    if (b.depositAmount > 0 || b.paymentStatus === 'LUNAS') {
      transactions.push({
        id: `trx-${count}`,
        transactionNumber: `TRX-${b.date.replace(/-/g, '')}-${String(count).padStart(3, '0')}`,
        bookingId: b.id,
        bookingCode: b.bookingCode,
        customerId: b.customerId,
        customerName: b.customerName,
        courtName: b.courtName,
        timeSlotLabel: b.timeSlotLabel,
        date: b.date,
        totalAmount: b.totalAmount,
        depositAmount: b.depositAmount,
        remainingAmount: b.remainingAmount,
        paymentMethod: b.paymentMethod || 'CASH',
        paymentStatus: b.paymentStatus,
        notes: b.notes,
        createdAt: b.createdAt,
      });
      count++;
    }
  }

  return transactions;
}

// ==========================================
// TIME & DURATION MATHEMATICAL UTILITIES
// ==========================================

export function timeStringToMinutes(time: string): number {
  if (!time) return 0;
  const parts = time.split(':');
  const h = parseInt(parts[0], 10) || 0;
  const m = parseInt(parts[1], 10) || 0;
  return h * 60 + m;
}

export function minutesToTimeString(minutes: number): string {
  const normalized = Math.max(0, minutes);
  const h = Math.floor(normalized / 60);
  const m = normalized % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export function addHoursToTime(time: string, hours: number): string {
  const currentMinutes = timeStringToMinutes(time);
  const addedMinutes = Math.round(hours * 60);
  return minutesToTimeString(currentMinutes + addedMinutes);
}

/**
 * Strict interval overlap validator
 * Range A [startA, endA] overlaps with Range B [startB, endB] iff startA < endB AND startB < endA
 */
export function isTimeRangeOverlap(
  startA: string,
  endA: string,
  startB: string,
  endB: string
): boolean {
  const aStart = timeStringToMinutes(startA);
  const aEnd = timeStringToMinutes(endA);
  const bStart = timeStringToMinutes(startB);
  const bEnd = timeStringToMinutes(endB);
  return aStart < bEnd && bStart < aEnd;
}

export function getBookingTimeRange(
  booking: Booking,
  timeSlots: TimeSlot[]
): { startTime: string; endTime: string; durationHours: number } {
  let start = '08:00';
  const duration = booking.durationHours && booking.durationHours > 0 ? booking.durationHours : 1;

  const matchedSlot = timeSlots.find((s) => s.id === booking.timeSlotId);
  if (matchedSlot) {
    start = matchedSlot.startTime;
  } else if (booking.timeSlotLabel) {
    const match = booking.timeSlotLabel.match(/(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})/);
    if (match) {
      start = match[1].padStart(5, '0');
      const end = match[2].padStart(5, '0');
      return { startTime: start, endTime: end, durationHours: duration };
    }
  }

  const end = addHoursToTime(start, duration);
  return { startTime: start, endTime: end, durationHours: duration };
}

export function isSlotOccupiedByBooking(
  slot: TimeSlot,
  booking: Booking,
  timeSlots: TimeSlot[]
): boolean {
  if (booking.bookingStatus === 'CANCELLED') return false;
  const range = getBookingTimeRange(booking, timeSlots);
  return isTimeRangeOverlap(slot.startTime, slot.endTime, range.startTime, range.endTime);
}

// Storage Manager Class
class StorageService {
  private memoryCache: Record<string, unknown> = {};

  private get<T>(key: string, fallback: T): T {
    try {
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        const item = localStorage.getItem(key);
        if (item) return JSON.parse(item);
      }
      if (this.memoryCache[key] !== undefined) {
        return this.memoryCache[key] as T;
      }
      return fallback;
    } catch {
      return this.memoryCache[key] !== undefined ? (this.memoryCache[key] as T) : fallback;
    }
  }

  private set<T>(key: string, value: T): void {
    try {
      this.memoryCache[key] = value;
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        localStorage.setItem(key, JSON.stringify(value));
        window.dispatchEvent(new Event('gor_data_changed'));
      }
    } catch (e) {
      console.error('Storage error:', e);
    }
  }

  // Business Settings
  getSettings(): BusinessSettings {
    const s = this.get<BusinessSettings>(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
    if (!s.adminWhatsApp || s.adminWhatsApp === '6281298765432') {
      s.adminWhatsApp = '6281803716514';
    }
    if (!s.bankAccounts || s.bankAccounts.length === 0) {
      s.bankAccounts = DEFAULT_SETTINGS.bankAccounts;
    }
    // Always keep bankInfo synchronized with active bankAccounts for invoice and export
    s.bankInfo = s.bankAccounts
      .map((b) => `${b.bankName}: ${b.accountNumber} a/n ${b.accountHolder}`)
      .join(' | ');

    if (!s.defaultHourlyRate) s.defaultHourlyRate = 30000;
    if (!s.defaultMemberHourlyRate) s.defaultMemberHourlyRate = 25000;
    if (!s.paymentInstructions) {
      s.paymentInstructions = s.paymentNotes || DEFAULT_SETTINGS.paymentInstructions;
    }
    if (!s.waTemplateCustomer) s.waTemplateCustomer = DEFAULT_CUSTOMER_WA_TEMPLATE;
    if (!s.waTemplateConfirmation) s.waTemplateConfirmation = DEFAULT_ADMIN_CONFIRMATION_WA_TEMPLATE;

    return s;
  }

  updateSettings(settings: Partial<BusinessSettings>): BusinessSettings {
    const current = this.getSettings();
    const updated = { ...current, ...settings };
    if (updated.bankAccounts && updated.bankAccounts.length > 0) {
      updated.bankInfo = updated.bankAccounts
        .map((b) => `${b.bankName}: ${b.accountNumber} a/n ${b.accountHolder}`)
        .join(' | ');
    }
    this.set(STORAGE_KEYS.SETTINGS, updated);
    return updated;
  }

  // Courts CRUD with Dual-Pricing (Tarif Reguler Rp30.000 & Member Rp25.000)
  getCourts(): Court[] {
    const courts = this.get<Court[]>(STORAGE_KEYS.COURTS, DEFAULT_COURTS);
    let changed = false;
    const migrated = courts.map((c) => {
      let cHourlyRate = c.hourlyRate;
      // Standardize old initial dummy rates (75000/85000) to 30000 as requested
      if (!cHourlyRate || cHourlyRate > 50000) {
        cHourlyRate = 30000;
        changed = true;
      }
      const cMemberRate = c.memberHourlyRate ?? 25000;
      if (c.memberHourlyRate === undefined) {
        changed = true;
      }
      return {
        ...c,
        hourlyRate: cHourlyRate,
        memberHourlyRate: cMemberRate,
      };
    });

    if (changed) {
      this.saveCourts(migrated);
    }
    return migrated;
  }

  saveCourts(courts: Court[]): void {
    this.set(STORAGE_KEYS.COURTS, courts);
  }

  addCourt(courtData: Omit<Court, 'id'>): Court {
    const courts = this.getCourts();
    const newCourt: Court = {
      ...courtData,
      hourlyRate: Math.max(0, Number(courtData.hourlyRate) || 30000),
      memberHourlyRate: Math.max(0, Number(courtData.memberHourlyRate) || 25000),
      id: `court-${Date.now()}`,
    };
    courts.push(newCourt);
    this.saveCourts(courts);
    return newCourt;
  }

  updateCourt(id: string, updates: Partial<Court>): Court | null {
    const courts = this.getCourts();
    const index = courts.findIndex((c) => c.id === id);
    if (index === -1) return null;
    const current = courts[index];
    const newHourlyRate = updates.hourlyRate !== undefined
      ? Math.max(0, Number(updates.hourlyRate))
      : current.hourlyRate;
    const newMemberHourlyRate = updates.memberHourlyRate !== undefined
      ? Math.max(0, Number(updates.memberHourlyRate))
      : (current.memberHourlyRate ?? 25000);

    courts[index] = {
      ...current,
      ...updates,
      hourlyRate: newHourlyRate,
      memberHourlyRate: newMemberHourlyRate,
    };
    this.saveCourts(courts);
    return courts[index];
  }

  deleteCourt(id: string): boolean {
    const courts = this.getCourts();
    const filtered = courts.filter((c) => c.id !== id);
    if (filtered.length === courts.length) return false;
    this.saveCourts(filtered);
    return true;
  }

  // ==========================================
  // MEMBER BULANAN CRUD & OPERATIONS
  // ==========================================

  getMembers(): Member[] {
    const members = this.get<Member[]>(STORAGE_KEYS.MEMBERS, DEFAULT_MEMBERS);
    const today = getTodayString(0);
    let changed = false;

    // Check expiration dynamically
    const verified = members.map((m) => {
      if (m.status === 'ACTIVE' && m.endDate && m.endDate < today) {
        changed = true;
        return { ...m, status: 'EXPIRED' as MemberStatus };
      }
      return m;
    });

    if (changed) {
      this.saveMembers(verified);
    }
    return verified;
  }

  saveMembers(members: Member[]): void {
    this.set(STORAGE_KEYS.MEMBERS, members);
  }

  addMember(data: {
    name: string;
    phone: string;
    address?: string;
    startDate: string;
    endDate: string;
    membershipType?: string;
    customHourlyRate?: number;
    status?: MemberStatus;
    notes?: string;
  }): Member {
    const members = this.getMembers();
    const year = new Date().getFullYear();
    const nextNum = members.length + 1;
    const memberCode = `MBR-${year}-${String(nextNum).padStart(3, '0')}`;

    const newMember: Member = {
      id: `mbr-${Date.now()}`,
      memberCode,
      name: data.name.trim(),
      phone: data.phone.trim(),
      address: data.address?.trim() || '',
      startDate: data.startDate,
      endDate: data.endDate,
      membershipType: data.membershipType || 'Member Bulanan Reguler',
      customHourlyRate: data.customHourlyRate !== undefined ? Math.max(0, data.customHourlyRate) : 25000,
      status: data.status || 'ACTIVE',
      notes: data.notes?.trim() || '',
      createdAt: getTodayString(0),
    };

    members.unshift(newMember);
    this.saveMembers(members);

    // Also sync to customers list
    this.findOrCreateCustomer(newMember.name, newMember.phone, `Member Bulanan (${memberCode})`);

    return newMember;
  }

  updateMember(id: string, updates: Partial<Member>): Member | null {
    const members = this.getMembers();
    const index = members.findIndex((m) => m.id === id);
    if (index === -1) return null;

    const current = members[index];
    const today = getTodayString(0);

    let status = updates.status || current.status;
    const endDate = updates.endDate || current.endDate;
    if (status === 'ACTIVE' && endDate && endDate < today) {
      status = 'EXPIRED';
    }

    const updated: Member = {
      ...current,
      ...updates,
      status,
      customHourlyRate: updates.customHourlyRate !== undefined
        ? Math.max(0, Number(updates.customHourlyRate))
        : current.customHourlyRate,
    };

    members[index] = updated;
    this.saveMembers(members);
    return updated;
  }

  deleteMember(id: string): boolean {
    const members = this.getMembers();
    const filtered = members.filter((m) => m.id !== id);
    if (filtered.length === members.length) return false;
    this.saveMembers(filtered);
    return true;
  }

  extendMember(id: string, monthsToAdd: number): Member | null {
    const members = this.getMembers();
    const index = members.findIndex((m) => m.id === id);
    if (index === -1) return null;

    const current = members[index];
    const today = getTodayString(0);
    const baseDateStr = current.endDate && current.endDate >= today ? current.endDate : today;

    const [y, m, d] = baseDateStr.split('-').map(Number);
    const dateObj = new Date(y, m - 1, d);
    dateObj.setMonth(dateObj.getMonth() + monthsToAdd);

    const newYear = dateObj.getFullYear();
    const newMonth = String(dateObj.getMonth() + 1).padStart(2, '0');
    const newDay = String(dateObj.getDate()).padStart(2, '0');
    const newEndDate = `${newYear}-${newMonth}-${newDay}`;

    const updated: Member = {
      ...current,
      endDate: newEndDate,
      status: 'ACTIVE',
    };

    members[index] = updated;
    this.saveMembers(members);
    return updated;
  }

  getMemberById(id: string): Member | undefined {
    return this.getMembers().find((m) => m.id === id);
  }

  findMemberByPhone(phone: string): Member | undefined {
    const clean = phone.replace(/[^0-9]/g, '');
    const cleanStd = clean.startsWith('0') ? '62' + clean.substring(1) : clean;
    return this.getMembers().find((m) => {
      const mClean = m.phone.replace(/[^0-9]/g, '');
      const mStd = mClean.startsWith('0') ? '62' + mClean.substring(1) : mClean;
      return mStd === cleanStd;
    });
  }

  getMemberStats(): {
    total: number;
    active: number;
    inactive: number;
    expiringSoon: number;
    bookingsThisMonth: number;
    totalTransactions: number;
  } {
    const members = this.getMembers();
    const today = getTodayString(0);
    const currentMonthPrefix = today.substring(0, 7); // YYYY-MM

    // 14 days expiration threshold
    const soonDate = new Date();
    soonDate.setDate(soonDate.getDate() + 14);
    const soonStr = soonDate.toISOString().split('T')[0];

    const total = members.length;
    let active = 0;
    let inactive = 0;
    let expiringSoon = 0;

    for (const m of members) {
      if (m.status === 'ACTIVE') {
        active++;
        if (m.endDate && m.endDate >= today && m.endDate <= soonStr) {
          expiringSoon++;
        }
      } else {
        inactive++;
      }
    }

    const bookings = this.getBookings();
    const memberPhones = new Set(members.map((m) => m.phone.replace(/[^0-9]/g, '')));
    const memberIds = new Set(members.map((m) => m.id));

    let bookingsThisMonth = 0;
    let totalTransactions = 0;

    for (const b of bookings) {
      const bPhoneClean = b.customerPhone.replace(/[^0-9]/g, '');
      const isMemberBooking = b.customerType === 'MEMBER' || (b.memberId && memberIds.has(b.memberId)) || memberPhones.has(bPhoneClean);

      if (isMemberBooking) {
        if (b.date.startsWith(currentMonthPrefix) && b.bookingStatus !== 'CANCELLED') {
          bookingsThisMonth++;
        }
        if (b.paymentStatus === 'LUNAS' || b.depositAmount > 0) {
          totalTransactions += (b.paymentStatus === 'LUNAS' ? b.totalAmount : b.depositAmount);
        }
      }
    }

    return {
      total,
      active,
      inactive,
      expiringSoon,
      bookingsThisMonth,
      totalTransactions,
    };
  }

  // Time Slots CRUD
  getTimeSlots(): TimeSlot[] {
    const slots = this.get<TimeSlot[]>(STORAGE_KEYS.SLOTS, DEFAULT_TIME_SLOTS);
    return slots.sort((a, b) => a.sortOrder - b.sortOrder);
  }

  saveTimeSlots(slots: TimeSlot[]): void {
    this.set(STORAGE_KEYS.SLOTS, slots);
  }

  addTimeSlot(data: { startTime: string; endTime: string }): TimeSlot {
    const slots = this.getTimeSlots();
    const newSlot: TimeSlot = {
      id: `slot-${Date.now()}`,
      startTime: data.startTime,
      endTime: data.endTime,
      label: `${data.startTime} - ${data.endTime}`,
      active: true,
      sortOrder: slots.length + 1,
    };
    slots.push(newSlot);
    this.saveTimeSlots(slots);
    return newSlot;
  }

  updateTimeSlot(id: string, updates: Partial<TimeSlot>): TimeSlot | null {
    const slots = this.getTimeSlots();
    const index = slots.findIndex((s) => s.id === id);
    if (index === -1) return null;
    if (updates.startTime && updates.endTime) {
      updates.label = `${updates.startTime} - ${updates.endTime}`;
    }
    slots[index] = { ...slots[index], ...updates };
    this.saveTimeSlots(slots);
    return slots[index];
  }

  deleteTimeSlot(id: string): boolean {
    const slots = this.getTimeSlots();
    const filtered = slots.filter((s) => s.id !== id);
    if (filtered.length === slots.length) return false;
    this.saveTimeSlots(filtered);
    return true;
  }

  // Customers
  getCustomers(): Customer[] {
    return this.get<Customer[]>(STORAGE_KEYS.CUSTOMERS, DEFAULT_CUSTOMERS);
  }

  saveCustomers(customers: Customer[]): void {
    this.set(STORAGE_KEYS.CUSTOMERS, customers);
  }

  findOrCreateCustomer(name: string, phone: string, notes?: string): Customer {
    const customers = this.getCustomers();
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const cleanName = name.trim();

    // Standardize phone key for matching: 0812... -> 62812...
    const normalizePhoneKey = (num: string) => {
      let digits = num.replace(/[^0-9]/g, '');
      if (digits.startsWith('0')) digits = '62' + digits.substring(1);
      return digits;
    };

    const targetKey = normalizePhoneKey(cleanPhone);

    let existing = customers.find((c) => {
      const cKey = normalizePhoneKey(c.phone);
      const isPhoneMatch = targetKey.length >= 8 && cKey === targetKey;
      const isNameMatch = cleanName && c.name.toLowerCase() === cleanName.toLowerCase();
      return isPhoneMatch || isNameMatch;
    });

    if (existing) {
      if (notes && !existing.notes) {
        existing.notes = notes;
        this.saveCustomers(customers);
      }
      return existing;
    }

    const newCustomer: Customer = {
      id: `cust-${Date.now()}`,
      name: cleanName,
      phone: cleanPhone || phone,
      notes,
      createdAt: getTodayString(0),
    };
    customers.push(newCustomer);
    this.saveCustomers(customers);
    return newCustomer;
  }

  updateCustomer(id: string, updates: Partial<Customer>): Customer | null {
    const customers = this.getCustomers();
    const index = customers.findIndex((c) => c.id === id);
    if (index === -1) return null;
    customers[index] = { ...customers[index], ...updates };
    this.saveCustomers(customers);
    return customers[index];
  }

  deleteCustomer(id: string): boolean {
    const customers = this.getCustomers();
    const filtered = customers.filter((c) => c.id !== id);
    this.saveCustomers(filtered);
    return true;
  }

  // Bookings with Strict Anti Double Booking Validation
  getBookings(): Booking[] {
    const initial = generateInitialBookings();
    return this.get<Booking[]>(STORAGE_KEYS.BOOKINGS, initial);
  }

  saveBookings(bookings: Booking[]): void {
    this.set(STORAGE_KEYS.BOOKINGS, bookings);
  }

  /**
   * CRITICAL: Anti Double Booking Validation
   * Checks if proposed interval [startTime, startTime + duration] on target date + court
   * overlaps with any existing booking or exceeds operational hours.
   */
  checkSlotAvailability(
    date: string,
    courtId: string,
    timeSlotId: string,
    durationHours: number = 1,
    excludeBookingId?: string
  ): { isAvailable: boolean; message?: string; existingBooking?: Booking } {
    // 1. Check if Court is active
    const courts = this.getCourts();
    const court = courts.find((c) => c.id === courtId);
    if (!court) {
      return { isAvailable: false, message: 'Lapangan tidak ditemukan' };
    }
    if (court.status === 'MAINTENANCE') {
      return { isAvailable: false, message: `Lapangan ${court.name} sedang dalam MAINTENANCE` };
    }
    if (court.status === 'INACTIVE') {
      return { isAvailable: false, message: `Lapangan ${court.name} sedang NONAKTIF` };
    }

    // 2. Check if Slot is active
    const slots = this.getTimeSlots();
    const slot = slots.find((s) => s.id === timeSlotId);
    if (!slot || !slot.active) {
      return { isAvailable: false, message: 'Sesi jam tidak aktif' };
    }

    // Determine proposed start and end time
    const proposedDuration = Math.max(1, Number(durationHours) || 1);
    const proposedStart = slot.startTime;
    const proposedEnd = addHoursToTime(proposedStart, proposedDuration);

    // Check if end time exceeds operating hours or slot limits
    const activeSlots = slots.filter((s) => s.active);
    if (activeSlots.length > 0) {
      const maxEndTime = activeSlots.reduce((max, s) => {
        return timeStringToMinutes(s.endTime) > timeStringToMinutes(max) ? s.endTime : max;
      }, activeSlots[0].endTime);

      if (timeStringToMinutes(proposedEnd) > timeStringToMinutes(maxEndTime)) {
        return {
          isAvailable: false,
          message: `Durasi ${proposedDuration} jam (${proposedStart} - ${proposedEnd}) melebihi jam operasional GOR (tutup pukul ${maxEndTime}).`,
        };
      }
    }

    // 3. Strict time range overlap check against ALL existing active bookings
    const bookings = this.getBookings();
    for (const b of bookings) {
      if (
        b.date === date &&
        b.courtId === courtId &&
        b.bookingStatus !== 'CANCELLED' &&
        (!excludeBookingId || b.id !== excludeBookingId)
      ) {
        const bRange = getBookingTimeRange(b, slots);
        if (isTimeRangeOverlap(proposedStart, proposedEnd, bRange.startTime, bRange.endTime)) {
          return {
            isAvailable: false,
            message: `Waktu ${proposedStart} - ${proposedEnd} bertabrakan dengan booking ${b.bookingCode} (${b.customerName}, pukul ${bRange.startTime} - ${bRange.endTime}).`,
            existingBooking: b,
          };
        }
      }
    }

    return { isAvailable: true };
  }

  createBooking(
    bookingInput: {
      customerName: string;
      customerPhone: string;
      courtId: string;
      date: string;
      timeSlotId: string;
      durationHours?: number;
      totalAmount?: number;
      depositAmount?: number;
      bookingStatus?: BookingStatus;
      paymentMethod?: PaymentMethod;
      notes?: string;
      source?: 'public_whatsapp' | 'admin_manual';
      bookingType?: BookingType;
      monthlyGroupId?: string;
      customerType?: CustomerType;
      memberId?: string;
      ratePerHour?: number;
    }
  ): { success: boolean; booking?: Booking; error?: string } {
    const durationHours = Math.max(1, Number(bookingInput.durationHours) || 1);

    // 1. STRICT ANTI DOUBLE BOOKING VALIDATION ACROSS ENTIRE DURATION
    const availability = this.checkSlotAvailability(
      bookingInput.date,
      bookingInput.courtId,
      bookingInput.timeSlotId,
      durationHours
    );

    if (!availability.isAvailable) {
      return {
        success: false,
        error: availability.message || 'Slot sudah dipesan atau bertabrakan dengan booking lain.',
      };
    }

    // 2. Resolve or create Customer
    const customer = this.findOrCreateCustomer(
      bookingInput.customerName,
      bookingInput.customerPhone,
      bookingInput.notes
    );

    // 3. Resolve Court & Slot details
    const courts = this.getCourts();
    const court = courts.find((c) => c.id === bookingInput.courtId)!;
    const slots = this.getTimeSlots();
    const slot = slots.find((s) => s.id === bookingInput.timeSlotId)!;

    // 4. Resolve Pricing based on Customer Type (Reguler Rp30.000 vs Member Bulanan Rp25.000)
    const isMember = bookingInput.customerType === 'MEMBER';
    let member: Member | undefined;
    if (bookingInput.memberId) {
      member = this.getMemberById(bookingInput.memberId);
    }
    const applicableHourlyRate = bookingInput.ratePerHour !== undefined
      ? bookingInput.ratePerHour
      : (isMember
          ? (member?.customHourlyRate ?? court.memberHourlyRate ?? 25000)
          : (court.hourlyRate || 30000));

    const calculatedTotal = applicableHourlyRate * durationHours;
    const total = bookingInput.totalAmount ?? calculatedTotal;
    const deposit = bookingInput.depositAmount ?? 0;
    const remaining = Math.max(0, total - deposit);

    // Automatic payment status formula
    let paymentStatus: PaymentStatus = 'BELUM BAYAR';
    if (deposit >= total && total > 0) {
      paymentStatus = 'LUNAS';
    } else if (deposit > 0) {
      paymentStatus = 'DP';
    }

    const bookingStatus: BookingStatus = bookingInput.bookingStatus || (deposit > 0 ? 'CONFIRMED' : 'PENDING');

    const bookings = this.getBookings();
    const randomCode = Math.floor(100 + Math.random() * 900);
    const dateCode = bookingInput.date.replace(/-/g, '').substring(4);
    const bookingCode = `BKG-${dateCode}-${randomCode}`;

    const startTime = slot.startTime;
    const endTime = addHoursToTime(startTime, durationHours);
    const timeSlotLabel = durationHours > 1
      ? `${startTime} - ${endTime} (${durationHours} Jam)`
      : slot.label;

    const newBooking: Booking = {
      id: `bkg-${Date.now()}`,
      bookingCode,
      customerId: customer.id,
      customerName: customer.name,
      customerPhone: customer.phone,
      courtId: court.id,
      courtName: court.name,
      date: bookingInput.date,
      timeSlotId: slot.id,
      timeSlotLabel,
      durationHours,
      totalAmount: total,
      depositAmount: deposit,
      remainingAmount: remaining,
      bookingStatus,
      paymentStatus,
      paymentMethod: bookingInput.paymentMethod || 'CASH',
      notes: bookingInput.notes || '',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      source: bookingInput.source || 'admin_manual',
      bookingType: bookingInput.bookingType || 'REGULAR',
      monthlyGroupId: bookingInput.monthlyGroupId,
      customerType: isMember ? 'MEMBER' : 'REGULAR',
      memberId: bookingInput.memberId,
      ratePerHour: applicableHourlyRate,
    };

    bookings.push(newBooking);
    this.saveBookings(bookings);

    // If there is any deposit/payment recorded, automatically record a transaction
    if (deposit > 0 || paymentStatus === 'LUNAS') {
      this.addTransactionForBooking(newBooking, deposit, bookingInput.paymentMethod || 'CASH');
    }

    return { success: true, booking: newBooking };
  }

  updateBooking(
    id: string,
    updates: Partial<Booking>
  ): { success: boolean; booking?: Booking; error?: string } {
    const bookings = this.getBookings();
    const index = bookings.findIndex((b) => b.id === id);
    if (index === -1) {
      return { success: false, error: 'Booking tidak ditemukan' };
    }

    const current = bookings[index];
    const targetDate = updates.date || current.date;
    const targetCourtId = updates.courtId || current.courtId;
    const targetSlotId = updates.timeSlotId || current.timeSlotId;
    const targetDuration = updates.durationHours !== undefined
      ? Math.max(1, Number(updates.durationHours) || 1)
      : (current.durationHours || 1);

    // If date, court, slot, or duration is changing and status is not cancelled, validate double booking
    if (
      (updates.date && updates.date !== current.date) ||
      (updates.courtId && updates.courtId !== current.courtId) ||
      (updates.timeSlotId && updates.timeSlotId !== current.timeSlotId) ||
      (updates.durationHours !== undefined && updates.durationHours !== current.durationHours)
    ) {
      const check = this.checkSlotAvailability(targetDate, targetCourtId, targetSlotId, targetDuration, id);
      if (!check.isAvailable) {
        return { success: false, error: check.message || 'Jadwal bertabrakan dengan booking lain.' };
      }
    }

    // Recalculate remaining amount & payment status if total or deposit changed
    const total = updates.totalAmount !== undefined ? updates.totalAmount : current.totalAmount;
    const deposit = updates.depositAmount !== undefined ? updates.depositAmount : current.depositAmount;
    const remaining = Math.max(0, total - deposit);

    let paymentStatus = updates.paymentStatus || current.paymentStatus;
    if (updates.depositAmount !== undefined || updates.totalAmount !== undefined) {
      if (deposit >= total && total > 0) {
        paymentStatus = 'LUNAS';
      } else if (deposit > 0) {
        paymentStatus = 'DP';
      } else {
        paymentStatus = 'BELUM BAYAR';
      }
    }

    // If court changed, update courtName
    let courtName = current.courtName;
    if (updates.courtId && updates.courtId !== current.courtId) {
      const c = this.getCourts().find((x) => x.id === updates.courtId);
      if (c) courtName = c.name;
    }

    // If slot or duration changed, update timeSlotLabel
    const slots = this.getTimeSlots();
    const activeSlot = slots.find((x) => x.id === targetSlotId);
    let slotLabel = current.timeSlotLabel;
    if (activeSlot) {
      const startTime = activeSlot.startTime;
      const endTime = addHoursToTime(startTime, targetDuration);
      slotLabel = targetDuration > 1
        ? `${startTime} - ${endTime} (${targetDuration} Jam)`
        : activeSlot.label;
    }

    const updatedBooking: Booking = {
      ...current,
      ...updates,
      durationHours: targetDuration,
      courtName,
      timeSlotLabel: slotLabel,
      totalAmount: total,
      depositAmount: deposit,
      remainingAmount: remaining,
      paymentStatus,
    };

    bookings[index] = updatedBooking;
    this.saveBookings(bookings);

    // Sync or update transaction
    this.syncTransactionForBooking(updatedBooking);

    return { success: true, booking: updatedBooking };
  }

  deleteBooking(id: string): boolean {
    const bookings = this.getBookings();
    const filtered = bookings.filter((b) => b.id !== id);
    if (filtered.length === bookings.length) return false;
    this.saveBookings(filtered);
    return true;
  }

  // ==========================================
  // MONTHLY / RECURRING BOOKING ENGINE
  // ==========================================

  getMonthlyBookings(): MonthlyBookingGroup[] {
    return this.get<MonthlyBookingGroup[]>(STORAGE_KEYS.MONTHLY_BOOKINGS, []);
  }

  saveMonthlyBookings(groups: MonthlyBookingGroup[]): void {
    this.set(STORAGE_KEYS.MONTHLY_BOOKINGS, groups);
  }

  checkMonthlyBookingAvailability(
    startDate: string,
    endDate: string,
    courtId: string,
    timeSlotId: string,
    selectedDays: number[],
    durationHours: number = 1,
    excludeGroupId?: string
  ): {
    isAvailable: boolean;
    dates: string[];
    conflictingDates: {
      date: string;
      formattedDate: string;
      courtName: string;
      timeSlotLabel: string;
      reason: string;
    }[];
    availableDatesCount: number;
    totalDatesCount: number;
    message?: string;
  } {
    const dates = generateMonthlyDates(startDate, endDate, selectedDays);
    if (dates.length === 0) {
      return {
        isAvailable: false,
        dates: [],
        conflictingDates: [],
        availableDatesCount: 0,
        totalDatesCount: 0,
        message: 'Tidak ada tanggal yang cocok dalam rentang dan pola hari yang dipilih.',
      };
    }

    const courts = this.getCourts();
    const court = courts.find((c) => c.id === courtId);
    if (!court) {
      return {
        isAvailable: false,
        dates,
        conflictingDates: [],
        availableDatesCount: 0,
        totalDatesCount: dates.length,
        message: 'Lapangan tidak ditemukan.',
      };
    }

    const slots = this.getTimeSlots();
    const slot = slots.find((s) => s.id === timeSlotId);
    if (!slot || !slot.active) {
      return {
        isAvailable: false,
        dates,
        conflictingDates: [],
        availableDatesCount: 0,
        totalDatesCount: dates.length,
        message: 'Sesi jam tidak aktif.',
      };
    }

    const proposedDuration = Math.max(1, Number(durationHours) || 1);
    const proposedStart = slot.startTime;
    const proposedEnd = addHoursToTime(proposedStart, proposedDuration);
    const sessionLabel = proposedDuration > 1
      ? `${proposedStart} - ${proposedEnd} (${proposedDuration} Jam)`
      : slot.label;

    // Check operating hours limit
    const activeSlots = slots.filter((s) => s.active);
    if (activeSlots.length > 0) {
      const maxEndTime = activeSlots.reduce((max, s) => {
        return timeStringToMinutes(s.endTime) > timeStringToMinutes(max) ? s.endTime : max;
      }, activeSlots[0].endTime);

      if (timeStringToMinutes(proposedEnd) > timeStringToMinutes(maxEndTime)) {
        return {
          isAvailable: false,
          dates,
          conflictingDates: [],
          availableDatesCount: 0,
          totalDatesCount: dates.length,
          message: `Durasi ${proposedDuration} jam (${proposedStart} - ${proposedEnd}) melebihi jam operasional GOR (tutup pukul ${maxEndTime}).`,
        };
      }
    }

    const conflictingDates: {
      date: string;
      formattedDate: string;
      courtName: string;
      timeSlotLabel: string;
      reason: string;
    }[] = [];

    const bookings = this.getBookings();

    for (const d of dates) {
      let formattedDate = d;
      try {
        const [y, m, dt] = d.split('-').map(Number);
        const obj = new Date(y, m - 1, dt);
        formattedDate = obj.toLocaleDateString('id-ID', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
        });
      } catch {
        formattedDate = d;
      }

      const conflict = bookings.find((b) => {
        if (
          b.date === d &&
          b.courtId === courtId &&
          b.bookingStatus !== 'CANCELLED' &&
          (!excludeGroupId || b.monthlyGroupId !== excludeGroupId)
        ) {
          const bRange = getBookingTimeRange(b, slots);
          return isTimeRangeOverlap(proposedStart, proposedEnd, bRange.startTime, bRange.endTime);
        }
        return false;
      });

      if (conflict) {
        const conflictRange = getBookingTimeRange(conflict, slots);
        conflictingDates.push({
          date: d,
          formattedDate,
          courtName: court.name,
          timeSlotLabel: sessionLabel,
          reason: `Bentrok (${conflict.bookingCode} - ${conflict.customerName}, jam ${conflictRange.startTime} - ${conflictRange.endTime})`,
        });
      }
    }

    if (conflictingDates.length > 0) {
      return {
        isAvailable: false,
        dates,
        conflictingDates,
        availableDatesCount: dates.length - conflictingDates.length,
        totalDatesCount: dates.length,
        message: `Terdapat ${conflictingDates.length} sesi dari total ${dates.length} sesi yang bentrok dengan jadwal lain.`,
      };
    }

    return {
      isAvailable: true,
      dates,
      conflictingDates: [],
      availableDatesCount: dates.length,
      totalDatesCount: dates.length,
    };
  }

  createMonthlyBooking(input: {
    customerName: string;
    customerPhone: string;
    courtId: string;
    startDate: string;
    endDate: string;
    periodLabel?: string;
    selectedDays: number[];
    selectedDaysLabels: string[];
    timeSlotId: string;
    durationHours?: number;
    totalAmount?: number;
    depositAmount?: number;
    bookingStatus?: BookingStatus;
    paymentMethod?: PaymentMethod;
    notes?: string;
    source?: 'public_whatsapp' | 'admin_manual';
    customerType?: CustomerType;
    memberId?: string;
    ratePerHour?: number;
  }): {
    success: boolean;
    monthlyBooking?: MonthlyBookingGroup;
    bookings?: Booking[];
    error?: string;
    conflictingDates?: {
      date: string;
      formattedDate: string;
      courtName: string;
      timeSlotLabel: string;
      reason: string;
    }[];
  } {
    const durationHours = Math.max(1, Number(input.durationHours) || 1);

    // 1. Validate availability of all recurring dates across duration
    const check = this.checkMonthlyBookingAvailability(
      input.startDate,
      input.endDate,
      input.courtId,
      input.timeSlotId,
      input.selectedDays,
      durationHours
    );

    if (!check.isAvailable) {
      return {
        success: false,
        error: check.message || 'Beberapa jadwal tidak tersedia.',
        conflictingDates: check.conflictingDates,
      };
    }

    const { dates } = check;

    // 2. Resolve or create Customer
    const customer = this.findOrCreateCustomer(
      input.customerName,
      input.customerPhone,
      input.notes
    );

    // 3. Resolve Court & Slot
    const courts = this.getCourts();
    const court = courts.find((c) => c.id === input.courtId)!;
    const slots = this.getTimeSlots();
    const slot = slots.find((s) => s.id === input.timeSlotId)!;

    // 4. Resolve Pricing: Member Bulanan tarif Rp25.000/jam
    const isMember = input.customerType !== 'REGULAR';
    let member: Member | undefined;
    if (input.memberId) {
      member = this.getMemberById(input.memberId);
    }
    const applicableHourlyRate = input.ratePerHour !== undefined
      ? input.ratePerHour
      : (isMember
          ? (member?.customHourlyRate ?? court.memberHourlyRate ?? 25000)
          : (court.hourlyRate || 30000));

    const sessionCount = dates.length;
    const ratePerSession = applicableHourlyRate * durationHours;
    const totalAmount = input.totalAmount ?? sessionCount * ratePerSession;
    const depositAmount = input.depositAmount ?? Math.round(totalAmount * 0.5);
    const remainingAmount = Math.max(0, totalAmount - depositAmount);

    let paymentStatus: PaymentStatus = 'BELUM BAYAR';
    if (depositAmount >= totalAmount && totalAmount > 0) {
      paymentStatus = 'LUNAS';
    } else if (depositAmount > 0) {
      paymentStatus = 'DP';
    }

    const bookingStatus: BookingStatus =
      input.bookingStatus || (depositAmount > 0 ? 'CONFIRMED' : 'PENDING');

    const groupId = `mbkg-${Date.now()}`;
    const dateCode = input.startDate.replace(/-/g, '').substring(2, 6);
    const randomCode = Math.floor(100 + Math.random() * 900);
    const groupCode = `MBKG-${dateCode}-${randomCode}`;

    const periodLabel =
      input.periodLabel || `${input.startDate} s/d ${input.endDate}`;

    const sessionStartTime = slot.startTime;
    const sessionEndTime = addHoursToTime(sessionStartTime, durationHours);
    const sessionTimeSlotLabel = durationHours > 1
      ? `${sessionStartTime} - ${sessionEndTime} (${durationHours} Jam)`
      : slot.label;

    // 4. Create individual Booking records for every recurring date session
    const allBookings = this.getBookings();
    const createdBookings: Booking[] = [];
    const bookingIds: string[] = [];

    const perSessionTotal = Math.round(totalAmount / sessionCount);
    const perSessionDeposit = Math.round(depositAmount / sessionCount);
    const perSessionRemaining = Math.max(0, perSessionTotal - perSessionDeposit);

    dates.forEach((d, idx) => {
      const bkgId = `bkg-${Date.now()}-${idx + 1}`;
      const bkgCode = `${groupCode}-S${String(idx + 1).padStart(2, '0')}`;
      bookingIds.push(bkgId);

      const bkg: Booking = {
        id: bkgId,
        bookingCode: bkgCode,
        customerId: customer.id,
        customerName: customer.name,
        customerPhone: customer.phone,
        courtId: court.id,
        courtName: court.name,
        date: d,
        timeSlotId: slot.id,
        timeSlotLabel: sessionTimeSlotLabel,
        durationHours,
        totalAmount: perSessionTotal,
        depositAmount: perSessionDeposit,
        remainingAmount: perSessionRemaining,
        bookingStatus,
        paymentStatus,
        paymentMethod: input.paymentMethod || 'TRANSFER',
        notes: input.notes
          ? `${input.notes} (Sesi ${idx + 1}/${sessionCount})`
          : `Booking Bulanan Sesi ${idx + 1}/${sessionCount}`,
        createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
        source: input.source || 'public_whatsapp',
        bookingType: 'MONTHLY',
        monthlyGroupId: groupId,
        customerType: isMember ? 'MEMBER' : 'REGULAR',
        memberId: input.memberId,
        ratePerHour: applicableHourlyRate,
      };

      createdBookings.push(bkg);
      allBookings.push(bkg);
    });

    this.saveBookings(allBookings);

    // 5. Create and save MonthlyBookingGroup
    const monthlyGroup: MonthlyBookingGroup = {
      id: groupId,
      groupCode,
      customerId: customer.id,
      customerName: customer.name,
      customerPhone: customer.phone,
      courtId: court.id,
      courtName: court.name,
      periodLabel,
      startDate: input.startDate,
      endDate: input.endDate,
      selectedDays: input.selectedDays,
      selectedDaysLabels: input.selectedDaysLabels,
      timeSlotId: slot.id,
      timeSlotLabel: sessionTimeSlotLabel,
      durationHours,
      sessionCount,
      ratePerSession,
      totalAmount,
      depositAmount,
      remainingAmount,
      bookingStatus,
      paymentStatus,
      paymentMethod: input.paymentMethod || 'TRANSFER',
      notes: input.notes || '',
      bookingIds,
      dates,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      customerType: isMember ? 'MEMBER' : 'REGULAR',
      memberId: input.memberId,
      ratePerHour: applicableHourlyRate,
    };

    const monthlyGroups = this.getMonthlyBookings();
    monthlyGroups.unshift(monthlyGroup);
    this.saveMonthlyBookings(monthlyGroups);

    // 6. Record financial transaction for monthly booking
    if (depositAmount > 0 || paymentStatus === 'LUNAS') {
      const transactions = this.getTransactions();
      const count = transactions.length + 1;
      const dateStr = input.startDate.replace(/-/g, '');
      const newTrx: Transaction = {
        id: `trx-${Date.now()}`,
        transactionNumber: `TRX-${dateStr}-${String(count).padStart(3, '0')}`,
        bookingId: groupId,
        bookingCode: groupCode,
        customerId: customer.id,
        customerName: customer.name,
        courtName: court.name,
        timeSlotLabel: `${input.selectedDaysLabels.join(' & ')} (${slot.label})`,
        date: input.startDate,
        totalAmount,
        depositAmount,
        remainingAmount,
        paymentMethod: input.paymentMethod || 'TRANSFER',
        paymentStatus,
        notes: `Booking Bulanan: ${sessionCount} Sesi`,
        createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
        customerType: isMember ? 'MEMBER' : 'REGULAR',
      };
      transactions.unshift(newTrx);
      this.saveTransactions(transactions);
    }

    return {
      success: true,
      monthlyBooking: monthlyGroup,
      bookings: createdBookings,
    };
  }

  deleteMonthlyBooking(groupId: string, deleteChildBookings: boolean = true): boolean {
    const groups = this.getMonthlyBookings();
    const target = groups.find((g) => g.id === groupId);
    if (!target) return false;

    const filtered = groups.filter((g) => g.id !== groupId);
    this.saveMonthlyBookings(filtered);

    if (deleteChildBookings) {
      const bookings = this.getBookings().filter((b) => b.monthlyGroupId !== groupId);
      this.saveBookings(bookings);
    }

    return true;
  }

  updateMonthlyBookingStatus(
    groupId: string,
    updates:
      | { bookingStatus?: BookingStatus; paymentStatus?: PaymentStatus }
      | BookingStatus,
    legacyPaymentStatus?: PaymentStatus
  ): { success: boolean; group?: MonthlyBookingGroup; error?: string } {
    const groups = this.getMonthlyBookings();
    const index = groups.findIndex((g) => g.id === groupId);
    if (index === -1) return { success: false, error: 'Booking bulanan tidak ditemukan.' };

    const current = groups[index];
    const newBookingStatus =
      typeof updates === 'object'
        ? updates.bookingStatus || current.bookingStatus
        : updates || current.bookingStatus;
    const newPaymentStatus =
      typeof updates === 'object'
        ? updates.paymentStatus || current.paymentStatus
        : legacyPaymentStatus || current.paymentStatus;
    const isLunas = newPaymentStatus === 'LUNAS';

    const updatedGroup: MonthlyBookingGroup = {
      ...current,
      bookingStatus: newBookingStatus,
      paymentStatus: newPaymentStatus,
      depositAmount: isLunas ? current.totalAmount : current.depositAmount,
      remainingAmount: isLunas ? 0 : current.remainingAmount,
    };

    groups[index] = updatedGroup;
    this.saveMonthlyBookings(groups);

    // Sync child bookings
    const bookings = this.getBookings();
    let changed = false;
    for (let i = 0; i < bookings.length; i++) {
      if (bookings[i].monthlyGroupId === groupId) {
        bookings[i] = {
          ...bookings[i],
          bookingStatus: newBookingStatus,
          paymentStatus: newPaymentStatus,
          depositAmount: isLunas ? bookings[i].totalAmount : bookings[i].depositAmount,
          remainingAmount: isLunas ? 0 : bookings[i].remainingAmount,
        };
        changed = true;
      }
    }
    if (changed) {
      this.saveBookings(bookings);
    }

    // Sync transaction
    const transactions = this.getTransactions();
    const trxIndex = transactions.findIndex((t) => t.bookingId === groupId);
    if (trxIndex !== -1) {
      transactions[trxIndex] = {
        ...transactions[trxIndex],
        paymentStatus: newPaymentStatus,
        depositAmount: isLunas ? updatedGroup.totalAmount : transactions[trxIndex].depositAmount,
        remainingAmount: isLunas ? 0 : transactions[trxIndex].remainingAmount,
      };
      this.saveTransactions(transactions);
    }

    return { success: true, group: updatedGroup };
  }

  // Transactions
  getTransactions(): Transaction[] {
    const initialBookings = this.getBookings();
    const initialTrx = generateInitialTransactions(initialBookings);
    return this.get<Transaction[]>(STORAGE_KEYS.TRANSACTIONS, initialTrx);
  }

  saveTransactions(transactions: Transaction[]): void {
    this.set(STORAGE_KEYS.TRANSACTIONS, transactions);
  }

  addTransactionForBooking(booking: Booking, amountPaid: number, method: PaymentMethod): Transaction {
    const transactions = this.getTransactions();
    const count = transactions.length + 1;
    const dateStr = booking.date.replace(/-/g, '');
    const newTrx: Transaction = {
      id: `trx-${Date.now()}`,
      transactionNumber: `TRX-${dateStr}-${String(count).padStart(3, '0')}`,
      bookingId: booking.id,
      bookingCode: booking.bookingCode,
      customerId: booking.customerId,
      customerName: booking.customerName,
      courtName: booking.courtName,
      timeSlotLabel: booking.timeSlotLabel,
      date: booking.date,
      totalAmount: booking.totalAmount,
      depositAmount: amountPaid,
      remainingAmount: booking.remainingAmount,
      paymentMethod: method,
      paymentStatus: booking.paymentStatus,
      notes: booking.notes,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    transactions.unshift(newTrx);
    this.saveTransactions(transactions);
    return newTrx;
  }

  syncTransactionForBooking(booking: Booking): void {
    const transactions = this.getTransactions();
    const index = transactions.findIndex((t) => t.bookingId === booking.id);
    if (index !== -1) {
      transactions[index] = {
        ...transactions[index],
        customerName: booking.customerName,
        courtName: booking.courtName,
        timeSlotLabel: booking.timeSlotLabel,
        date: booking.date,
        totalAmount: booking.totalAmount,
        depositAmount: booking.depositAmount,
        remainingAmount: booking.remainingAmount,
        paymentStatus: booking.paymentStatus,
        paymentMethod: booking.paymentMethod || transactions[index].paymentMethod,
      };
      this.saveTransactions(transactions);
    } else if (booking.depositAmount > 0 || booking.paymentStatus === 'LUNAS') {
      const amount = booking.depositAmount > 0 ? booking.depositAmount : booking.totalAmount;
      this.addTransactionForBooking(booking, amount, booking.paymentMethod || 'CASH');
    }
  }

  addManualTransaction(trxData: Omit<Transaction, 'id' | 'transactionNumber' | 'createdAt'>): Transaction {
    const transactions = this.getTransactions();
    const count = transactions.length + 1;
    const dateStr = trxData.date.replace(/-/g, '');
    const newTrx: Transaction = {
      ...trxData,
      id: `trx-${Date.now()}`,
      transactionNumber: `TRX-${dateStr}-${String(count).padStart(3, '0')}`,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    transactions.unshift(newTrx);
    this.saveTransactions(transactions);
    return newTrx;
  }

  // Users & Auth
  getUsers(): User[] {
    const raw = this.get<User[]>(STORAGE_KEYS.USERS, DEFAULT_USERS);
    // Sanitize to ensure username and password exist for all users
    return raw.map((u) => {
      const defaultMatch = DEFAULT_USERS.find((d) => d.id === u.id);
      return {
        ...u,
        username: u.username || defaultMatch?.username || (u.role.toLowerCase() === 'owner' ? 'owner' : 'admin'),
        password: u.password || defaultMatch?.password || 'admin123',
      };
    });
  }

  saveUsers(users: User[]): void {
    this.set(STORAGE_KEYS.USERS, users);
  }

  getCurrentUser(): User | null {
    return this.get<User | null>(STORAGE_KEYS.CURRENT_USER, null);
  }

  setCurrentUser(user: User | null): void {
    this.set(STORAGE_KEYS.CURRENT_USER, user);
  }

  authenticate(identifier: string, password: string): { success: boolean; user?: User; error?: string } {
    const cleanId = identifier.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!cleanId || !cleanPass) {
      return { success: false, error: 'Username dan kata sandi wajib diisi.' };
    }

    const users = this.getUsers();
    const matched = users.find(
      (u) =>
        u.username?.toLowerCase() === cleanId ||
        u.email.toLowerCase() === cleanId
    );

    if (!matched) {
      return { success: false, error: 'Username atau kata sandi salah.' };
    }

    if (!matched.active) {
      return { success: false, error: 'Akun Anda berstatus nonaktif. Hubungi Owner untuk aktivasi.' };
    }

    const userPass = matched.password || 'admin123';
    if (userPass !== cleanPass) {
      return { success: false, error: 'Username atau kata sandi salah.' };
    }

    // Set session
    this.setCurrentUser(matched);
    return { success: true, user: matched };
  }

  updateAccountSecurity(
    userId: string,
    newUsername: string,
    newPassword?: string
  ): { success: boolean; user?: User; error?: string } {
    const cleanUsername = newUsername.trim().toLowerCase();
    if (!cleanUsername) {
      return { success: false, error: 'Username tidak boleh kosong.' };
    }

    const users = this.getUsers();
    // Prevent duplicate username
    const existing = users.find((u) => u.id !== userId && u.username?.toLowerCase() === cleanUsername);
    if (existing) {
      return { success: false, error: `Username "${cleanUsername}" sudah digunakan oleh akun lain.` };
    }

    const index = users.findIndex((u) => u.id === userId);
    if (index === -1) {
      return { success: false, error: 'Akun pengguna tidak ditemukan.' };
    }

    users[index].username = cleanUsername;
    if (newPassword && newPassword.trim()) {
      users[index].password = newPassword.trim();
    }

    this.saveUsers(users);

    // If current session is this user, sync current session
    const current = this.getCurrentUser();
    if (current && current.id === userId) {
      const updated = {
        ...current,
        username: cleanUsername,
        ...(newPassword && newPassword.trim() ? { password: newPassword.trim() } : {}),
      };
      this.setCurrentUser(updated);
    }

    return { success: true, user: users[index] };
  }

  // Reset to initial demo data
  resetAllData(): void {
    this.memoryCache = {};
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      try {
        localStorage.removeItem(STORAGE_KEYS.SETTINGS);
        localStorage.removeItem(STORAGE_KEYS.COURTS);
        localStorage.removeItem(STORAGE_KEYS.SLOTS);
        localStorage.removeItem(STORAGE_KEYS.CUSTOMERS);
        localStorage.removeItem(STORAGE_KEYS.BOOKINGS);
        localStorage.removeItem(STORAGE_KEYS.MONTHLY_BOOKINGS);
        localStorage.removeItem(STORAGE_KEYS.TRANSACTIONS);
        localStorage.removeItem(STORAGE_KEYS.USERS);
      } catch (e) {
        console.error('Reset storage error:', e);
      }
    }
    this.set(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
    this.set(STORAGE_KEYS.COURTS, DEFAULT_COURTS);
    this.set(STORAGE_KEYS.SLOTS, DEFAULT_TIME_SLOTS);
    this.set(STORAGE_KEYS.USERS, DEFAULT_USERS);
    this.set(STORAGE_KEYS.CUSTOMERS, DEFAULT_CUSTOMERS);
    const initialBookings = generateInitialBookings();
    this.set(STORAGE_KEYS.BOOKINGS, initialBookings);
    this.set(STORAGE_KEYS.MONTHLY_BOOKINGS, []);
    this.set(STORAGE_KEYS.TRANSACTIONS, generateInitialTransactions(initialBookings));
  }
}

export const store = new StorageService();

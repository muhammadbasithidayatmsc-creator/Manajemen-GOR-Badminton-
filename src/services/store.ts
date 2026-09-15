import {
  Booking,
  BookingStatus,
  BusinessSettings,
  Court,
  Customer,
  PaymentMethod,
  PaymentStatus,
  TimeSlot,
  Transaction,
  User,
} from '../types';

const STORAGE_KEYS = {
  SETTINGS: 'gor_settings_v1',
  COURTS: 'gor_courts_v1',
  SLOTS: 'gor_slots_v1',
  CUSTOMERS: 'gor_customers_v1',
  BOOKINGS: 'gor_bookings_v1',
  TRANSACTIONS: 'gor_transactions_v1',
  USERS: 'gor_users_v1',
  CURRENT_USER: 'gor_current_user_v1',
};

// Initial Business Settings
export const DEFAULT_SETTINGS: BusinessSettings = {
  name: 'GOR Badminton Smash Arena',
  tagline: 'Pusat Rental Lapangan Badminton Terbaik & Nyaman',
  address: 'Jl. Pemuda Olahraga No. 88, Rawamangun, Jakarta Timur',
  adminWhatsApp: '6281298765432',
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
  defaultHourlyRate: 75000,
  bankInfo: 'BCA: 8820-1234-56 a/n GOR Smash Arena',
  bankAccounts: [
    { bankName: 'BCA', accountNumber: '8820-1234-56', accountHolder: 'GOR Badminton Smash Arena' },
    { bankName: 'Mandiri', accountNumber: '120-00-9876543-2', accountHolder: 'Bambang Hartono' },
  ],
  paymentNotes: 'Harap transfer DP minimal 50% untuk konfirmasi jadwal booking. Pembayaran di lokasi dapat menggunakan Tunai atau QRIS.',
  waTemplateCustomer: `Halo Admin GOR [NAMA_GOR], saya ingin konfirmasi booking lapangan:
- Kode Booking: [KODE]
- Customer: [NAMA]
- Lapangan: [LAPANGAN]
- Tanggal: [TANGGAL]
- Sesi Jam: [JAM]
- Total Biaya: [TOTAL]

Mohon info nomor rekening pembayaran DP manual. Terima kasih!`,
  waTemplateConfirmation: `Halo Kak [NAMA], booking Anda di [NAMA_GOR] telah BERHASIL DIKONFIRMASI!
- Kode Booking: [KODE]
- Lapangan: [LAPANGAN]
- Jadwal: [TANGGAL] ([JAM])
- Status: [STATUS]
- Sisa Tagihan: [SISA]

Harap datang 10 menit sebelum jam main dan menggunakan sepatu badminton non-marking. Sampai jumpa di lapangan!`,
  qrisInfo: 'Tersedia QRIS All Payment di meja resepsionis',
};

// Initial Courts
export const DEFAULT_COURTS: Court[] = [
  {
    id: 'court-1',
    name: 'Court 1 (Utama)',
    code: 'C-01',
    status: 'ACTIVE',
    notes: 'Dekat tribun penonton, karpet vinyl hijau BWF',
    hourlyRate: 85000,
    surfaceType: 'Vinyl BWF 5.0mm',
  },
  {
    id: 'court-2',
    name: 'Court 2',
    code: 'C-02',
    status: 'ACTIVE',
    notes: 'Sirkulasi udara samping, sangat nyaman',
    hourlyRate: 75000,
    surfaceType: 'Vinyl BWF 5.0mm',
  },
  {
    id: 'court-3',
    name: 'Court 3',
    code: 'C-03',
    status: 'ACTIVE',
    notes: 'Cocok untuk latihan rutin dan sparring',
    hourlyRate: 75000,
    surfaceType: 'Vinyl BWF 5.0mm',
  },
  {
    id: 'court-4',
    name: 'Court 4',
    code: 'C-04',
    status: 'ACTIVE',
    notes: 'Paling privat di sudut belakang',
    hourlyRate: 75000,
    surfaceType: 'Vinyl BWF 5.0mm',
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

// Storage Manager Class
class StorageService {
  private get<T>(key: string, fallback: T): T {
    try {
      const item = localStorage.getItem(key);
      if (!item) return fallback;
      return JSON.parse(item);
    } catch {
      return fallback;
    }
  }

  private set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      window.dispatchEvent(new Event('gor_data_changed'));
    } catch (e) {
      console.error('Storage error:', e);
    }
  }

  // Business Settings
  getSettings(): BusinessSettings {
    return this.get<BusinessSettings>(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
  }

  updateSettings(settings: Partial<BusinessSettings>): BusinessSettings {
    const current = this.getSettings();
    const updated = { ...current, ...settings };
    this.set(STORAGE_KEYS.SETTINGS, updated);
    return updated;
  }

  // Courts CRUD
  getCourts(): Court[] {
    return this.get<Court[]>(STORAGE_KEYS.COURTS, DEFAULT_COURTS);
  }

  saveCourts(courts: Court[]): void {
    this.set(STORAGE_KEYS.COURTS, courts);
  }

  addCourt(courtData: Omit<Court, 'id'>): Court {
    const courts = this.getCourts();
    const newCourt: Court = {
      ...courtData,
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
    courts[index] = { ...courts[index], ...updates };
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
   * Checks if slot on target date + court + timeSlot is already occupied
   */
  checkSlotAvailability(
    date: string,
    courtId: string,
    timeSlotId: string,
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

    // 3. Check for existing active booking on same date, court, and time slot
    const bookings = this.getBookings();
    const conflict = bookings.find(
      (b) =>
        b.date === date &&
        b.courtId === courtId &&
        b.timeSlotId === timeSlotId &&
        b.bookingStatus !== 'CANCELLED' &&
        (!excludeBookingId || b.id !== excludeBookingId)
    );

    if (conflict) {
      return {
        isAvailable: false,
        message: 'Slot sudah dipesan atau tidak tersedia',
        existingBooking: conflict,
      };
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
    }
  ): { success: boolean; booking?: Booking; error?: string } {
    // 1. STRICT ANTI DOUBLE BOOKING VALIDATION
    const availability = this.checkSlotAvailability(
      bookingInput.date,
      bookingInput.courtId,
      bookingInput.timeSlotId
    );

    if (!availability.isAvailable) {
      return {
        success: false,
        error: availability.message || 'Slot sudah dipesan. Pilih slot atau jadwal lain.',
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

    const total = bookingInput.totalAmount ?? court.hourlyRate;
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
      timeSlotLabel: slot.label,
      durationHours: bookingInput.durationHours || 1,
      totalAmount: total,
      depositAmount: deposit,
      remainingAmount: remaining,
      bookingStatus,
      paymentStatus,
      paymentMethod: bookingInput.paymentMethod || 'CASH',
      notes: bookingInput.notes || '',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      source: bookingInput.source || 'admin_manual',
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

    // If date, court, or slot is changing and status is not cancelled, validate double booking
    if (
      (updates.date && updates.date !== current.date) ||
      (updates.courtId && updates.courtId !== current.courtId) ||
      (updates.timeSlotId && updates.timeSlotId !== current.timeSlotId)
    ) {
      const check = this.checkSlotAvailability(targetDate, targetCourtId, targetSlotId, id);
      if (!check.isAvailable) {
        return { success: false, error: check.message || 'Slot sudah dipesan pada jadwal baru tersebut.' };
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

    // If slot changed, update timeSlotLabel
    let slotLabel = current.timeSlotLabel;
    if (updates.timeSlotId && updates.timeSlotId !== current.timeSlotId) {
      const s = this.getTimeSlots().find((x) => x.id === updates.timeSlotId);
      if (s) slotLabel = s.label;
    }

    const updatedBooking: Booking = {
      ...current,
      ...updates,
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
    } else if (booking.depositAmount > 0) {
      this.addTransactionForBooking(booking, booking.depositAmount, booking.paymentMethod || 'CASH');
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
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.COURTS);
    localStorage.removeItem(STORAGE_KEYS.SLOTS);
    localStorage.removeItem(STORAGE_KEYS.CUSTOMERS);
    localStorage.removeItem(STORAGE_KEYS.BOOKINGS);
    localStorage.removeItem(STORAGE_KEYS.TRANSACTIONS);
    localStorage.removeItem(STORAGE_KEYS.USERS);
    this.set(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
    this.set(STORAGE_KEYS.COURTS, DEFAULT_COURTS);
    this.set(STORAGE_KEYS.SLOTS, DEFAULT_TIME_SLOTS);
    this.set(STORAGE_KEYS.USERS, DEFAULT_USERS);
    this.set(STORAGE_KEYS.CUSTOMERS, DEFAULT_CUSTOMERS);
    const initialBookings = generateInitialBookings();
    this.set(STORAGE_KEYS.BOOKINGS, initialBookings);
    this.set(STORAGE_KEYS.TRANSACTIONS, generateInitialTransactions(initialBookings));
  }
}

export const store = new StorageService();

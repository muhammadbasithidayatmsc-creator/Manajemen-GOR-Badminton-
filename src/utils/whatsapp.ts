import { BusinessSettings } from '../types';

export const DEFAULT_ADMIN_WHATSAPP = '6281803716514';

export const DEFAULT_CUSTOMER_WA_TEMPLATE = `🏸 KONFIRMASI BOOKING GOR [NAMA_GOR]

Halo [NAMA], terima kasih telah melakukan booking.

Berikut detail pemesanan Anda:

📋 Kode Booking: [KODE]
👤 Nama: [NAMA]
🏸 Lapangan: [LAPANGAN]
📅 Tanggal: [TANGGAL]
⏰ Jam: [JAM] - [JAM_SELESAI]
⏱️ Durasi: [DURASI]
👥 Jenis Pelanggan: [JENIS_PELANGGAN]
📌 Jenis Booking: [JENIS_BOOKING]

💰 RINCIAN PEMBAYARAN

Tarif per jam: Rp[HARGA_PER_JAM]
Total Biaya: Rp[TOTAL]
Uang Muka (DP): Rp[DP]
Sisa Pembayaran: Rp[SISA]

Status Booking: [STATUS]
Status Pembayaran: [STATUS_PEMBAYARAN]

🏦 INFORMASI PEMBAYARAN

Bank: [NAMA_BANK]
Nomor Rekening: [NOMOR_REKENING]
Atas Nama: [ATAS_NAMA]

Petunjuk Pembayaran:
[INSTRUKSI_PEMBAYARAN]

Mohon melakukan pembayaran sesuai informasi di atas dan mengirimkan bukti pembayaran kepada Admin GOR.

Terima kasih telah mempercayakan booking lapangan Anda kepada kami. 🙏`;

export const DEFAULT_ADMIN_CONFIRMATION_WA_TEMPLATE = `🏸 NOTIFIKASI BOOKING MASUK — GOR [NAMA_GOR]

Halo Admin, terdapat pemesanan baru yang perlu diverifikasi:

📋 Kode Booking: [KODE]
👤 Nama Pelanggan: [NAMA]
📱 WhatsApp: [WHATSAPP]
🏸 Lapangan: [LAPANGAN]
📅 Tanggal: [TANGGAL]
⏰ Jam: [JAM] - [JAM_SELESAI]
⏱️ Durasi: [DURASI]
👥 Jenis Pelanggan: [JENIS_PELANGGAN]
📌 Jenis Booking: [JENIS_BOOKING]

💰 DETAIL PEMBAYARAN
Tarif per jam: Rp[HARGA_PER_JAM]
Total Biaya: Rp[TOTAL]
Uang Muka (DP): Rp[DP]
Sisa Pembayaran: Rp[SISA]
Status Bayar: [STATUS_PEMBAYARAN]
Status Booking: [STATUS]

🏦 TUJUAN PEMBAYARAN
Bank: [NAMA_BANK] - [NOMOR_REKENING] a/n [ATAS_NAMA]

📝 Catatan: [CATATAN]

Silakan cek mutasi rekening dan konfirmasi pelanggan. Terima kasih!`;

/**
 * Clean phone number to WhatsApp international format (628...)
 * Strips non-digits, spaces, plus signs, dashes, parentheses, dots
 * Normalizes leading 08... or 8... to 628...
 */
export function cleanPhoneNumber(phone?: string | null): string {
  if (!phone) return '';
  let clean = String(phone).replace(/[^0-9]/g, '');
  if (!clean) return '';

  // Handle international prefix 0062...
  if (clean.startsWith('0062')) {
    clean = '62' + clean.substring(4);
  } else if (clean.startsWith('00')) {
    clean = clean.substring(2);
  }

  // Handle standard Indonesian formats: 08..., 8..., +628...
  if (clean.startsWith('0')) {
    clean = '62' + clean.substring(1);
  } else if (clean.startsWith('620')) {
    clean = '62' + clean.substring(3);
  } else if (!clean.startsWith('62')) {
    clean = '62' + clean;
  }

  return clean;
}

/**
 * Validates whether a phone number is a valid international WhatsApp number (format 628...)
 * Indonesian mobile numbers are usually between 10 and 15 digits total.
 */
export function isValidWhatsAppNumber(phone?: string | null): boolean {
  if (!phone) return false;
  const cleaned = cleanPhoneNumber(phone);
  return cleaned.startsWith('62') && cleaned.length >= 10 && cleaned.length <= 16;
}

/**
 * Normalizes admin WhatsApp number with fallback to default
 */
export function normalizeWhatsAppNumber(phone?: string): string {
  const cleaned = cleanPhoneNumber(phone);
  return cleaned || DEFAULT_ADMIN_WHATSAPP;
}

/**
 * Helper to safely read customers from localStorage without circular import
 */
function getStoredCustomers(): Array<{ id: string; name?: string; phone?: string }> {
  try {
    if (typeof window === 'undefined') return [];
    const raw = localStorage.getItem('gor_customers_v1');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Helper to safely read members from localStorage without circular import
 */
function getStoredMembers(): Array<{ id: string; name?: string; phone?: string; memberCode?: string }> {
  try {
    if (typeof window === 'undefined') return [];
    const raw = localStorage.getItem('gor_members_v1');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Helper to safely read monthly groups from localStorage without circular import
 */
function getStoredMonthlyGroups(): Array<{ id: string; customerName?: string; customerPhone?: string }> {
  try {
    if (typeof window === 'undefined') return [];
    const raw = localStorage.getItem('gor_monthly_bookings_v1');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Resolves customer's WhatsApp phone number with strict priority:
 * 1. Direct phone on selected transaction / booking
 * 2. Member record phone via memberId
 * 3. Customer record phone via customerId
 * 4. Monthly booking group phone via monthlyGroupId
 * 5. Name-based match in Member / Customer store
 * 
 * CRITICAL RULE: NEVER fallback to Admin / Owner number for customer invoices or reminders!
 * Returns empty string if no valid customer number is found.
 */
export function resolveCustomerPhoneNumber(params: {
  directPhone?: string | null;
  customerId?: string | null;
  memberId?: string | null;
  monthlyGroupId?: string | null;
  customerName?: string | null;
}): string {
  // 1. Direct phone from current transaction (highest priority)
  if (params.directPhone) {
    const cleaned = cleanPhoneNumber(params.directPhone);
    if (isValidWhatsAppNumber(cleaned)) {
      return cleaned;
    }
  }

  // 2. Member lookup
  if (params.memberId) {
    const members = getStoredMembers();
    const m = members.find((item) => item.id === params.memberId);
    if (m?.phone) {
      const cleaned = cleanPhoneNumber(m.phone);
      if (isValidWhatsAppNumber(cleaned)) return cleaned;
    }
  }

  // 3. Customer lookup
  if (params.customerId) {
    const customers = getStoredCustomers();
    const c = customers.find((item) => item.id === params.customerId);
    if (c?.phone) {
      const cleaned = cleanPhoneNumber(c.phone);
      if (isValidWhatsAppNumber(cleaned)) return cleaned;
    }
  }

  // 4. Monthly group lookup
  if (params.monthlyGroupId) {
    const groups = getStoredMonthlyGroups();
    const g = groups.find((item) => item.id === params.monthlyGroupId);
    if (g?.customerPhone) {
      const cleaned = cleanPhoneNumber(g.customerPhone);
      if (isValidWhatsAppNumber(cleaned)) return cleaned;
    }
  }

  // 5. Name-based lookup
  if (params.customerName && params.customerName.trim()) {
    const targetName = params.customerName.trim().toLowerCase();
    const members = getStoredMembers();
    const m = members.find((item) => item.name && item.name.trim().toLowerCase() === targetName);
    if (m?.phone) {
      const cleaned = cleanPhoneNumber(m.phone);
      if (isValidWhatsAppNumber(cleaned)) return cleaned;
    }

    const customers = getStoredCustomers();
    const c = customers.find((item) => item.name && item.name.trim().toLowerCase() === targetName);
    if (c?.phone) {
      const cleaned = cleanPhoneNumber(c.phone);
      if (isValidWhatsAppNumber(cleaned)) return cleaned;
    }
  }

  // If directPhone had at least 8 digits but was not strictly valid, try returning cleaned
  if (params.directPhone) {
    const cleaned = cleanPhoneNumber(params.directPhone);
    if (cleaned && cleaned.length >= 8) {
      return cleaned;
    }
  }

  // DO NOT FALLBACK TO ADMIN NUMBER!
  return '';
}

/**
 * Local format currency helper
 */
function localFormatRupiah(amount?: number | string): string {
  const num = typeof amount === 'number' ? amount : (Number(amount) || 0);
  return `Rp ${num.toLocaleString('id-ID')}`;
}

export interface WhatsAppTemplateData {
  namaGor?: string;
  nama?: string;
  whatsapp?: string;
  kode?: string;
  jenisBooking?: string;
  jenisPelanggan?: string;
  lapangan?: string;
  tanggal?: string;
  jam?: string;
  jamSelesai?: string;
  durasi?: string | number;
  hargaPerJam?: number | string;
  total?: number | string;
  dp?: number | string;
  sisa?: number | string;
  statusPembayaran?: string;
  status?: string;
  metodePembayaran?: string;
  namaBank?: string;
  nomorRekening?: string;
  atasNama?: string;
  instruksiPembayaran?: string;
  catatan?: string;
}

function formatNumberVal(val?: number | string): string {
  if (val === undefined || val === null || val === '') return '0';
  if (typeof val === 'number') {
    return val.toLocaleString('id-ID');
  }
  return String(val);
}

/**
 * Universal template substitution engine
 */
export function substituteWhatsAppTemplate(
  template: string,
  data: WhatsAppTemplateData
): string {
  if (!template) return '';

  const totalNum = typeof data.total === 'number' ? data.total : (Number(data.total) || 0);
  const dpNum = typeof data.dp === 'number' ? data.dp : (Number(data.dp) || 0);
  const sisaNum = data.sisa !== undefined
    ? (typeof data.sisa === 'number' ? data.sisa : Number(data.sisa) || 0)
    : Math.max(0, totalNum - dpNum);

  const replacements: Record<string, string> = {
    '[NAMA_GOR]': data.namaGor || 'GOR Badminton',
    '[NAMA]': data.nama || 'Pelanggan',
    '[WHATSAPP]': data.whatsapp || '-',
    '[KODE]': data.kode || '-',
    '[JENIS_BOOKING]': data.jenisBooking || 'Booking Reguler',
    '[JENIS_PELANGGAN]': data.jenisPelanggan || 'Pelanggan Reguler',
    '[LAPANGAN]': data.lapangan || 'Lapangan 1',
    '[TANGGAL]': data.tanggal || '-',
    '[JAM]': data.jam || '08:00',
    '[JAM_SELESAI]': data.jamSelesai || '09:00',
    '[DURASI]': typeof data.durasi === 'number' ? `${data.durasi} Jam` : (data.durasi || '1 Jam'),
    '[HARGA_PER_JAM]': formatNumberVal(data.hargaPerJam),
    '[TOTAL]': formatNumberVal(totalNum),
    '[DP]': formatNumberVal(dpNum),
    '[SISA]': formatNumberVal(sisaNum),
    '[STATUS_PEMBAYARAN]': data.statusPembayaran || 'BELUM BAYAR',
    '[STATUS]': data.status || 'PENDING',
    '[METODE_PEMBAYARAN]': data.metodePembayaran || 'TRANSFER',
    '[NAMA_BANK]': data.namaBank || 'BCA',
    '[NOMOR_REKENING]': data.nomorRekening || '8820-1234-56',
    '[ATAS_NAMA]': data.atasNama || 'GOR Badminton Smash Arena',
    '[INSTRUKSI_PEMBAYARAN]': data.instruksiPembayaran || 'Transfer DP minimal 50% untuk konfirmasi jadwal.',
    '[CATATAN]': data.catatan && data.catatan.trim() ? data.catatan.trim() : '-',
  };

  let result = template;
  for (const [tag, value] of Object.entries(replacements)) {
    result = result.split(tag).join(value);
  }

  return result.replace(/\[[A-Z0-9_]+\]/g, '-').trim();
}

/**
 * Standard Customer WhatsApp contact URL with schedule reminder
 * Sends directly to customer's WhatsApp number.
 */
export function generateCustomerWhatsAppUrl(params: {
  customerPhone?: string;
  customerName?: string;
  bookingCode?: string;
  courtName?: string;
  date?: string;
  timeSlotLabel?: string;
  gorName?: string;
  customMessage?: string;
  customerId?: string;
  memberId?: string;
}): string {
  const targetPhone = resolveCustomerPhoneNumber({
    directPhone: params.customerPhone,
    customerId: params.customerId,
    memberId: params.memberId,
    customerName: params.customerName,
  });

  if (!isValidWhatsAppNumber(targetPhone)) return '#';

  if (params.customMessage) {
    return `https://wa.me/${targetPhone}?text=${encodeURIComponent(params.customMessage)}`;
  }

  const gor = params.gorName || 'GOR Badminton Smash Arena';
  const name = params.customerName ? params.customerName.trim() : 'Pelanggan';

  const lines = [
    `🏸 *INFORMASI & PENGINGAT JADWAL RESERVASI*`,
    `*${gor.toUpperCase()}*`,
    `━━━━━━━━━━━━━━━━━━━━━━━━━`,
    ``,
    `Halo Kak *${name}*, kami dari Admin pengelola *${gor}*.`,
    ``,
  ];

  if (params.bookingCode) {
    lines.push(
      `Mengingatkan jadwal reservasi lapangan Anda:`,
      `• Kode Booking: *${params.bookingCode}*`
    );
    if (params.courtName) lines.push(`• Lapangan: *${params.courtName}*`);
    if (params.date) lines.push(`• Tanggal: *${params.date}*`);
    if (params.timeSlotLabel) lines.push(`• Jam Main: *${params.timeSlotLabel}*`);
    lines.push(
      ``,
      `⏰ *Pengingat Kehadiran:*`,
      `• Harap hadir 10–15 menit sebelum jam bermain dimulai.`,
      `• Wajib menggunakan sepatu badminton sol karet / non-marking di area karpet lapangan.`,
      ``,
      `Terima kasih dan sampai jumpa di lapangan! Salam olahraga 🏸`
    );
  } else {
    lines.push(
      `Ada yang bisa kami bantu terkait reservasi lapangan di ${gor}? Jangan ragu untuk mengabari kami. 🙏`
    );
  }

  return `https://wa.me/${targetPhone}?text=${encodeURIComponent(lines.join('\n'))}`;
}

/**
 * Customer Public Booking Submission to Admin (+6281803716514)
 * Used when a customer clicks "Booking via WhatsApp" from the public modal.
 */
export function generateBookingWhatsAppUrl(params: {
  settings?: BusinessSettings;
  customerName: string;
  customerPhone: string;
  courtName: string;
  date: string;
  timeSlotLabel: string;
  durationHours?: number;
  totalAmount: number;
  depositAmount?: number;
  remainingAmount?: number;
  notes?: string;
  bookingCode: string;
  bookingType?: 'REGULAR' | 'MONTHLY';
  customerType?: 'REGULAR' | 'MEMBER';
  ratePerHour?: number;
  paymentStatus?: string;
  bookingStatus?: string;
  sendToCustomer?: boolean;
}): string {
  const {
    settings,
    customerName,
    customerPhone,
    courtName,
    date,
    timeSlotLabel,
    durationHours = 1,
    totalAmount,
    depositAmount = 0,
    remainingAmount = Math.max(0, totalAmount - depositAmount),
    notes,
    bookingCode,
    bookingType = 'REGULAR',
    customerType = 'REGULAR',
    ratePerHour = totalAmount / Math.max(1, durationHours),
    paymentStatus = depositAmount >= totalAmount ? 'LUNAS' : depositAmount > 0 ? 'DP' : 'BELUM BAYAR',
    bookingStatus = depositAmount > 0 ? 'CONFIRMED' : 'PENDING',
    sendToCustomer = false,
  } = params;

  // If sending to customer, resolve customer's phone number!
  let targetPhone = '';
  if (sendToCustomer) {
    targetPhone = resolveCustomerPhoneNumber({ directPhone: customerPhone, customerName });
    if (!isValidWhatsAppNumber(targetPhone)) return '#';
  } else {
    // When customer submits to Admin, send to Admin WhatsApp (+6281803716514)
    targetPhone = normalizeWhatsAppNumber(settings?.adminWhatsApp || DEFAULT_ADMIN_WHATSAPP);
  }

  let jamMulai = '08:00';
  let jamSelesai = '09:00';
  if (timeSlotLabel) {
    const parts = timeSlotLabel.split('-');
    if (parts.length >= 2) {
      jamMulai = parts[0].trim();
      const endPart = parts[1].trim();
      jamSelesai = endPart.split('(')[0].trim();
    }
  }

  let formattedDate = date;
  try {
    const [y, m, d] = date.split('-').map(Number);
    const dateObj = new Date(y, m - 1, d);
    formattedDate = dateObj.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    formattedDate = date;
  }

  const primaryBank = settings?.bankAccounts && settings.bankAccounts.length > 0
    ? settings.bankAccounts[0]
    : { bankName: 'BCA', accountNumber: '8820-1234-56', accountHolder: 'GOR Badminton' };

  const templateData: WhatsAppTemplateData = {
    namaGor: settings?.gorName || settings?.name || 'GOR Badminton',
    nama: customerName.trim(),
    whatsapp: customerPhone.trim(),
    kode: bookingCode,
    jenisBooking: bookingType === 'MONTHLY' ? 'Booking Bulanan' : 'Booking Reguler',
    jenisPelanggan: customerType === 'MEMBER' ? 'Member Bulanan' : 'Pelanggan Reguler',
    lapangan: courtName,
    tanggal: `${formattedDate} (${date})`,
    jam: jamMulai,
    jamSelesai: jamSelesai,
    durasi: durationHours,
    hargaPerJam: Math.round(ratePerHour),
    total: totalAmount,
    dp: depositAmount,
    sisa: remainingAmount,
    statusPembayaran: paymentStatus,
    status: bookingStatus,
    metodePembayaran: 'TRANSFER',
    namaBank: primaryBank.bankName,
    nomorRekening: primaryBank.accountNumber,
    atasNama: primaryBank.accountHolder,
    instruksiPembayaran: settings?.paymentInstructions || settings?.paymentNotes || 'Kirim bukti transfer ke WhatsApp Admin untuk konfirmasi instan.',
    catatan: notes && notes.trim() ? notes.trim() : '-',
  };

  const rawTemplate = settings?.waTemplateCustomer || DEFAULT_CUSTOMER_WA_TEMPLATE;
  const fullText = substituteWhatsAppTemplate(rawTemplate, templateData);

  return `https://wa.me/${targetPhone}?text=${encodeURIComponent(fullText)}`;
}

/**
 * Customer Monthly Booking Submission to Admin (+6281803716514)
 */
export function generateMonthlyBookingWhatsAppUrl(params: {
  settings?: BusinessSettings;
  groupCode?: string;
  customerName?: string;
  customerPhone?: string;
  courtName?: string;
  periodLabel?: string;
  startDate?: string;
  endDate?: string;
  selectedDaysLabels?: string[];
  timeSlotLabel?: string;
  sessionCount?: number;
  ratePerSession?: number;
  totalAmount?: number;
  depositAmount?: number;
  remainingAmount?: number;
  dates?: string[];
  notes?: string;
  customerType?: 'REGULAR' | 'MEMBER';
  ratePerHour?: number;
  sendToCustomer?: boolean;
}): string {
  const {
    settings,
    groupCode = 'MBKG',
    customerName = 'Pelanggan',
    customerPhone = '',
    courtName = 'Lapangan Badminton',
    periodLabel = '',
    startDate = '',
    endDate = '',
    selectedDaysLabels = [],
    timeSlotLabel = '-',
    sessionCount = 4,
    ratePerSession = 0,
    totalAmount = 0,
    depositAmount = 0,
    remainingAmount = 0,
    dates = [],
    notes = '',
    customerType = 'MEMBER',
    ratePerHour = 25000,
    sendToCustomer = false,
  } = params;

  let targetPhone = '';
  if (sendToCustomer) {
    targetPhone = resolveCustomerPhoneNumber({ directPhone: customerPhone, customerName });
    if (!isValidWhatsAppNumber(targetPhone)) return '#';
  } else {
    targetPhone = normalizeWhatsAppNumber(settings?.adminWhatsApp || DEFAULT_ADMIN_WHATSAPP);
  }

  const safeDates = Array.isArray(dates) ? dates : [];
  const safeDaysLabels = Array.isArray(selectedDaysLabels) ? selectedDaysLabels : [];

  const datesSummary = safeDates
    .slice(0, 8)
    .map((d) => {
      try {
        const [y, m, dt] = String(d).split('-').map(Number);
        const o = new Date(y, m - 1, dt);
        return `• ${o.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' })}`;
      } catch {
        return `• ${d}`;
      }
    })
    .join('\n');

  const moreCount = safeDates.length > 8 ? `\n• ...dan ${safeDates.length - 8} sesi lainnya` : '';

  const primaryBank = settings?.bankAccounts && settings.bankAccounts.length > 0
    ? settings.bankAccounts[0]
    : { bankName: 'BCA', accountNumber: '8820-1234-56', accountHolder: 'GOR Badminton' };

  const messageLines = [
    `🏸 KONFIRMASI BOOKING MEMBER BULANAN — ${settings?.gorName || settings?.name || 'GOR BADMINTON'}`,
    '',
    `Halo Admin, saya ingin konfirmasi booking paket member bulanan:`,
    '',
    `📋 Kode Booking: ${groupCode}`,
    `👤 Nama: ${(customerName || '').trim()}`,
    `📱 WhatsApp: ${(customerPhone || '').trim()}`,
    `👥 Jenis Pelanggan: ${customerType === 'MEMBER' ? 'Member Bulanan' : 'Pelanggan Reguler'}`,
    `📌 Jenis Booking: Paket Member Bulanan`,
    `🏸 Lapangan: ${courtName}`,
    `📅 Periode: ${periodLabel || `${startDate} s/d ${endDate}`}`,
    `⏰ Jadwal: ${safeDaysLabels.length > 0 ? `Setiap ${safeDaysLabels.join(' & ')}` : 'Jadwal Rutin'} (${timeSlotLabel})`,
    `⏱️ Jumlah Sesi: ${sessionCount || safeDates.length || 4} Sesi Pertemuan`,
    '',
    `💰 RINCIAN BIAYA MEMBER:`,
    `Tarif Khusus Member: Rp${(ratePerHour || 25000).toLocaleString('id-ID')}/jam`,
    `Tarif per Sesi: ${localFormatRupiah(ratePerSession)}`,
    `Total Biaya: ${localFormatRupiah(totalAmount)}`,
    `Uang Muka (DP): ${localFormatRupiah(depositAmount)}`,
    `Sisa Pembayaran: ${localFormatRupiah(remainingAmount)}`,
    '',
    `🏦 REKENING TUJUAN PEMBAYARAN:`,
    `Bank: ${primaryBank.bankName}`,
    `Nomor Rekening: ${primaryBank.accountNumber}`,
    `Atas Nama: ${primaryBank.accountHolder}`,
    '',
    `Petunjuk Pembayaran:`,
    `${settings?.paymentInstructions || settings?.paymentNotes || 'Transfer DP untuk konfirmasi jadwal bulanan.'}`,
    '',
    `📝 Catatan: ${notes && notes.trim() ? notes.trim() : '-'}`,
    '',
    `Daftar Tanggal Sesi:`,
    datesSummary ? (datesSummary + moreCount) : '• Sesuai kalender terjadwal',
    '',
    'Mohon dibantu konfirmasi booking saya.',
    '',
    'Terima kasih 🙏🏻',
  ];

  const fullText = messageLines.join('\n');
  return `https://wa.me/${targetPhone}?text=${encodeURIComponent(fullText)}`;
}

export function generateDirectInquiryWhatsAppUrl(settings?: BusinessSettings): string {
  const targetPhone = normalizeWhatsAppNumber(settings?.adminWhatsApp || DEFAULT_ADMIN_WHATSAPP);
  const gorName = settings?.gorName || settings?.name || 'GOR Badminton';
  const text = `Halo Admin ${gorName}, saya ingin menanyakan informasi jadwal ketersediaan lapangan dan paket member bulanan (Tarif Khusus Rp25.000/jam).`;
  return `https://wa.me/${targetPhone}?text=${encodeURIComponent(text)}`;
}

/**
 * Kirim Informasi Membership via WhatsApp langsung ke Nomor Customer
 */
export function generateMemberInfoWhatsAppUrl(params: {
  settings?: BusinessSettings;
  member: {
    name?: string;
    phone?: string;
    memberCode?: string;
    membershipType?: string;
    packageName?: string;
    startDate?: string;
    endDate?: string;
    sessionCount?: number;
    durationHours?: number;
    courtName?: string;
    timeSlotLabel?: string;
    selectedDaysLabels?: string[];
    customHourlyRate?: number;
    totalAmount?: number;
    depositAmount?: number;
    remainingAmount?: number;
    paymentStatus?: string;
    paymentMethod?: string;
    notes?: string;
  };
  sendToCustomer?: boolean;
}): string {
  const { settings, member, sendToCustomer = true } = params;

  // Strict: If sending to customer, resolve customer's phone! NEVER fallback to Admin!
  const targetPhone = sendToCustomer
    ? resolveCustomerPhoneNumber({ directPhone: member.phone, customerName: member.name })
    : normalizeWhatsAppNumber(settings?.adminWhatsApp || DEFAULT_ADMIN_WHATSAPP);

  if (!isValidWhatsAppNumber(targetPhone)) return '#';

  const primaryBank = settings?.bankAccounts && settings.bankAccounts.length > 0
    ? settings.bankAccounts[0]
    : { bankName: 'BCA', accountNumber: '8820-1234-56', accountHolder: 'GOR Badminton' };

  const total = member.totalAmount || 0;
  const dp = member.depositAmount || 0;
  const sisa = member.remainingAmount !== undefined ? member.remainingAmount : Math.max(0, total - dp);

  const lines = [
    `🏸 INFORMASI MEMBERSHIP GOR BADMINTON — ${settings?.gorName || settings?.name || 'GOR SMASH ARENA'}`,
    '',
    `Halo Kak *${(member.name || 'Member').trim()}*, berikut rincian keanggotaan Member Bulanan Anda:`,
    '',
    `👑 *DATA MEMBERSHIP*`,
    `• ID Member: *${member.memberCode || '-'}*`,
    `• Nama Member: ${(member.name || '').trim()}`,
    `• WhatsApp: ${(member.phone || '').trim()}`,
    `• Paket: *${member.packageName || member.membershipType || 'Member Bulanan'}*`,
    `• Periode: ${member.startDate || '-'} s/d ${member.endDate || '-'}`,
    `• Kuota Sesi: *${member.sessionCount || 4} Sesi Pertemuan*`,
    `• Durasi Bermain: *${member.durationHours || 3} Jam per Sesi*`,
    `• Lapangan: ${member.courtName || 'Court Badminton'}`,
    `• Jadwal Rutin: ${member.selectedDaysLabels && member.selectedDaysLabels.length > 0 ? `Setiap ${member.selectedDaysLabels.join(' & ')}` : 'Sesuai Jadwal'} (${member.timeSlotLabel || '-'})`,
    `• Tarif Spesial Member: Rp${(member.customHourlyRate || 25000).toLocaleString('id-ID')}/jam`,
    '',
    `💰 *RINCIAN PEMBAYARAN*`,
    `• Total Biaya Paket: ${localFormatRupiah(total)}`,
    `• Pembayaran Masuk (DP): ${localFormatRupiah(dp)}`,
    `• Sisa Tagihan: *${localFormatRupiah(sisa)}*`,
    `• Status Pembayaran: *${member.paymentStatus || (dp >= total && total > 0 ? 'LUNAS' : dp > 0 ? 'DP' : 'BELUM BAYAR')}*`,
    `• Metode: ${member.paymentMethod || 'TRANSFER'}`,
    '',
    `🏦 *REKENING PEMBAYARAN RESMI GOR*`,
    `• Bank: ${primaryBank.bankName}`,
    `• No. Rekening: ${primaryBank.accountNumber}`,
    `• Atas Nama: ${primaryBank.accountHolder}`,
    '',
    `📌 *Petunjuk & Catatan:*`,
    `${settings?.paymentInstructions || settings?.paymentNotes || 'Harap simpan bukti transfer untuk verifikasi administrasi.'}`,
    member.notes ? `Catatan: ${member.notes}` : '',
    '',
    `⏰ *Pengingat Jadwal:*`,
    `• Harap hadir 10–15 menit sebelum jam bermain dimulai.`,
    `• Wajib menggunakan sepatu badminton non-marking.`,
    '',
    `Terima kasih telah bergabung menjadi Member Resmi kami. Selamat bermain dan jaga selalu sportivitas! 🙏🏸`,
  ].filter(Boolean);

  return `https://wa.me/${targetPhone}?text=${encodeURIComponent(lines.join('\n'))}`;
}

/**
 * Kirim Jadwal Pertemuan Member via WhatsApp langsung ke Nomor Customer
 */
export function generateMemberScheduleWhatsAppUrl(params: {
  settings?: BusinessSettings;
  member: {
    name?: string;
    phone?: string;
    memberCode?: string;
    membershipType?: string;
    packageName?: string;
    startDate?: string;
    endDate?: string;
    sessionCount?: number;
    durationHours?: number;
    courtName?: string;
    timeSlotLabel?: string;
    selectedDaysLabels?: string[];
  };
  sessionDates?: string[];
  sendToCustomer?: boolean;
}): string {
  const { settings, member, sessionDates = [], sendToCustomer = true } = params;

  // Strict: If sending to customer, resolve customer's phone! NEVER fallback to Admin!
  const targetPhone = sendToCustomer
    ? resolveCustomerPhoneNumber({ directPhone: member.phone, customerName: member.name })
    : normalizeWhatsAppNumber(settings?.adminWhatsApp || DEFAULT_ADMIN_WHATSAPP);

  if (!isValidWhatsAppNumber(targetPhone)) return '#';

  const safeSessionDates = Array.isArray(sessionDates) ? sessionDates : [];
  const formattedSchedule = safeSessionDates.length > 0
    ? safeSessionDates.map((d, idx) => {
        try {
          const [y, m, dt] = String(d).split('-').map(Number);
          const o = new Date(y, m - 1, dt);
          const dayLabel = o.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
          return `${idx + 1}. ${dayLabel} — ${member.timeSlotLabel || ''} (${member.courtName || 'Court'})`;
        } catch {
          return `${idx + 1}. ${d} — ${member.timeSlotLabel || ''} (${member.courtName || 'Court'})`;
        }
      }).join('\n')
    : '• Jadwal rutin sesuai kalender bermain';

  const lines = [
    `📅 JADWAL PERTEMUAN RESMI MEMBER — ${settings?.gorName || settings?.name || 'GOR SMASH ARENA'}`,
    '',
    `Halo *${(member.name || 'Member').trim()}* (${member.memberCode || 'MBR'}),`,
    `Berikut jadwal resmi sesi bermain paket *${member.packageName || member.membershipType || 'Member Bulanan'}* Anda:`,
    '',
    `🏸 Lapangan: *${member.courtName || 'Court Utama'}*`,
    `⏰ Jam Main: *${member.timeSlotLabel || ''} (${member.durationHours || 3} Jam)*`,
    `📊 Total Sesi: *${safeSessionDates.length || member.sessionCount || 4} Pertemuan Terjadwal*`,
    '',
    `📋 *DAFTAR TANGGAL PERTEMUAN:*`,
    formattedSchedule,
    '',
    `⚠️ *Ketentuan Sesi Member:*`,
    `• Harap hadir 10–15 menit sebelum jam bermain dimulai.`,
    `• Wajib menggunakan sepatu badminton sol karet / non-marking.`,
    `• Apabila berhalangan hadir, harap konfirmasi minimal H-1 untuk opsi penyesuaian jadwal.`,
    '',
    `Sampai jumpa di lapangan! Salam olahraga 🏸`,
  ];

  return `https://wa.me/${targetPhone}?text=${encodeURIComponent(lines.join('\n'))}`;
}

/**
 * Backward compatibility alias for Member Invoice WhatsApp generator
 */
export function generateMemberInvoiceWhatsAppUrl(params: {
  settings?: BusinessSettings;
  member: {
    name?: string;
    phone?: string;
    memberCode?: string;
    membershipType?: string;
    packageName?: string;
    startDate?: string;
    endDate?: string;
    sessionCount?: number;
    durationHours?: number;
    courtName?: string;
    totalAmount?: number;
    depositAmount?: number;
    remainingAmount?: number;
    paymentStatus?: string;
    paymentMethod?: string;
  };
  invoiceCode?: string;
  sendToCustomer?: boolean;
}): string {
  const result = generateInvoiceWhatsAppUrl({
    settings: params.settings,
    bookingType: 'MONTHLY',
    invoiceCode: params.invoiceCode,
    customerName: params.member.name,
    customerPhone: params.member.phone,
    memberCode: params.member.memberCode,
    packageName: params.member.packageName || params.member.membershipType,
    courtName: params.member.courtName,
    startDate: params.member.startDate,
    endDate: params.member.endDate,
    sessionCount: params.member.sessionCount,
    durationHours: params.member.durationHours,
    totalAmount: params.member.totalAmount,
    depositAmount: params.member.depositAmount,
    remainingAmount: params.member.remainingAmount,
    paymentStatus: params.member.paymentStatus,
  });

  return result.url;
}

function getTodayFormatted(): string {
  try {
    return new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return new Date().toISOString().split('T')[0];
  }
}

/* ========================================================================== */
/* STANDARISASI INVOICE WHATSAPP (BOOKING HARIAN & MEMBER BULANAN)            */
/* ========================================================================== */

export interface StandardInvoiceWhatsAppParams {
  settings?: BusinessSettings;
  bookingType: 'REGULAR' | 'MONTHLY';

  // Identifiers
  invoiceCode?: string;
  bookingCode?: string;

  // Customer / Member info
  customerName?: string;
  customerPhone?: string;
  customerId?: string;
  memberId?: string;
  monthlyGroupId?: string;
  memberCode?: string;
  packageName?: string;
  membershipType?: string;

  // Court & Schedule
  courtName?: string;
  date?: string; // YYYY-MM-DD (Harian)
  timeSlotLabel?: string;
  durationHours?: number;
  periodLabel?: string;
  startDate?: string;
  endDate?: string;
  selectedDaysLabels?: string[];
  sessionCount?: number;
  sessionDates?: string[];

  // Financial
  hourlyRate?: number;
  totalAmount?: number;
  depositAmount?: number;
  remainingAmount?: number;
  paymentStatus?: string;

  // Extra notes
  notes?: string;
}

export interface GenerateInvoiceWhatsAppResult {
  url: string;
  targetPhone: string;
  isValidPhone: boolean;
  message: string;
  errorReason?: string;
}

/**
 * Helper to build rich, professional message for Daily / Regular Bookings
 */
function buildRegularInvoiceMessage(data: {
  gorName: string;
  invoiceCode: string;
  bookingCode: string;
  customerName: string;
  courtName: string;
  formattedDate: string;
  timeSlotLabel: string;
  durationHours: number;
  totalAmount: number;
  depositAmount: number;
  remainingAmount: number;
  paymentStatus: string;
  primaryBank?: { bankName: string; accountNumber: string; accountHolder: string };
  paymentInstructions?: string;
  notes?: string;
}): string {
  const isLunas = data.remainingAmount <= 0 || data.paymentStatus === 'LUNAS';

  const lines = [
    `🏸 *INVOICE & KONFIRMASI BOOKING LAPANGAN*`,
    `*${data.gorName.toUpperCase()}*`,
    `━━━━━━━━━━━━━━━━━━━━━━━━━`,
    ``,
    `Halo Kak *${data.customerName}*, terima kasih telah melakukan pemesanan lapangan di *${data.gorName}*.`,
    `Berikut rincian resmi booking & invoice Anda:`,
    ``,
    `📋 *RINCIAN RESERVASI:*`,
    `• No. Invoice: *${data.invoiceCode}*`,
    `• Kode Booking: *${data.bookingCode}*`,
    `• Nama Customer: *${data.customerName}*`,
    `• Lapangan: *${data.courtName}*`,
    `• Tanggal Booking: *${data.formattedDate}*`,
    `• Jam Main: *${data.timeSlotLabel}*`,
    `• Durasi Bermain: *${data.durationHours} Jam*`,
    ``,
    `💰 *RINCIAN PEMBAYARAN:*`,
    `• Total Biaya: *${localFormatRupiah(data.totalAmount)}*`,
    `• Uang Muka (DP): *${localFormatRupiah(data.depositAmount)}*`,
    `• Sisa Pembayaran: *${localFormatRupiah(data.remainingAmount)}*`,
    `• Status Pembayaran: *[ ${data.paymentStatus.toUpperCase()} ]*`,
  ];

  if (!isLunas && data.primaryBank) {
    lines.push(
      ``,
      `🏦 *REKENING PEMBAYARAN RESMI GOR:*`,
      `• Bank: *${data.primaryBank.bankName}*`,
      `• No. Rekening: *${data.primaryBank.accountNumber}*`,
      `• Atas Nama: *${data.primaryBank.accountHolder}*`
    );
    if (data.paymentInstructions) {
      lines.push(`• Petunjuk: ${data.paymentInstructions}`);
    }
  }

  if (data.notes && data.notes.trim() && data.notes.trim() !== '-') {
    lines.push(``, `📝 *Catatan Tambahan:* ${data.notes.trim()}`);
  }

  // Requirement: Pengingat agar Customer hadir sesuai jadwal booking
  lines.push(
    ``,
    `⏰ *PENGINGAT JADWAL & KETENTUAN:*`,
    `• Harap hadir 10–15 menit sebelum jam bermain dimulai.`,
    `• Wajib menggunakan sepatu badminton sol karet / non-marking untuk keselamatan dan kenyamanan.`,
    `• Tunjukkan bukti invoice ini kepada petugas GOR saat tiba di lokasi.`,
    ``,
    `Selamat bertanding dan salam olahraga! 🏸💪`,
    `*${data.gorName}*`
  );

  return lines.join('\n');
}

/**
 * Helper to build rich, professional message for Monthly Member Bookings
 */
function buildMonthlyInvoiceMessage(data: {
  gorName: string;
  invoiceCode: string;
  bookingCode: string;
  customerName: string;
  memberCode?: string;
  packageName?: string;
  courtName: string;
  periodLabel?: string;
  startDate?: string;
  endDate?: string;
  timeSlotLabel: string;
  daysLabel?: string;
  sessionCount: number;
  durationHours: number;
  hourlyRate?: number;
  totalAmount: number;
  depositAmount: number;
  remainingAmount: number;
  paymentStatus: string;
  sessionDatesSummary?: string;
  primaryBank?: { bankName: string; accountNumber: string; accountHolder: string };
  paymentInstructions?: string;
  notes?: string;
}): string {
  const isLunas = data.remainingAmount <= 0 || data.paymentStatus === 'LUNAS';

  const lines = [
    `🏸 *INVOICE RESMI MEMBER BULANAN*`,
    `*${data.gorName.toUpperCase()}*`,
    `━━━━━━━━━━━━━━━━━━━━━━━━━`,
    ``,
    `Halo Kak *${data.customerName}*, berikut adalah rincian invoice dan jadwal resmi paket keanggotaan member bulanan Anda di *${data.gorName}*:`,
    ``,
    `📋 *DATA KEANGGOTAAN MEMBER:*`,
    `• No. Invoice: *${data.invoiceCode}*`,
    `• Kode Booking: *${data.bookingCode}*`,
    `• Nama Member: *${data.customerName}*`,
  ];

  if (data.memberCode) {
    lines.push(`• ID Member: *${data.memberCode}*`);
  }

  lines.push(
    `• Paket Member: *${data.packageName || 'Paket Member Bulanan'}*`,
    `• Lapangan: *${data.courtName}*`,
    `• Periode: *${data.periodLabel || `${data.startDate || '-'} s/d ${data.endDate || '-'}`}*`,
    `• Jadwal Rutin: *${data.daysLabel ? `Setiap ${data.daysLabel}` : 'Sesuai Jadwal'} (${data.timeSlotLabel})*`,
    `• Kuota Sesi: *${data.sessionCount} Sesi Pertemuan (@ ${data.durationHours} Jam/Sesi)*`
  );

  lines.push(
    ``,
    `💰 *RINCIAN BIAYA MEMBER:*`,
    `• Tarif Khusus Member: Rp${(data.hourlyRate || 25000).toLocaleString('id-ID')}/jam`,
    `• Total Tagihan Paket: *${localFormatRupiah(data.totalAmount)}*`,
    `• DP / Pembayaran Masuk: *${localFormatRupiah(data.depositAmount)}*`,
    `• Sisa Pembayaran: *${localFormatRupiah(data.remainingAmount)}*`,
    `• Status Pembayaran: *[ ${data.paymentStatus.toUpperCase()} ]*`
  );

  if (data.sessionDatesSummary) {
    lines.push(``, `📅 *JADWAL PERTEMUAN BULANAN:*`, data.sessionDatesSummary);
  }

  if (!isLunas && data.primaryBank) {
    lines.push(
      ``,
      `🏦 *REKENING PEMBAYARAN RESMI GOR:*`,
      `• Bank: *${data.primaryBank.bankName}*`,
      `• No. Rekening: *${data.primaryBank.accountNumber}*`,
      `• Atas Nama: *${data.primaryBank.accountHolder}*`
    );
    if (data.paymentInstructions) {
      lines.push(`• Petunjuk: ${data.paymentInstructions}`);
    }
  }

  if (data.notes && data.notes.trim() && data.notes.trim() !== '-') {
    lines.push(``, `📝 *Catatan Tambahan:* ${data.notes.trim()}`);
  }

  // Requirement: Pengingat agar Customer hadir sesuai jadwal booking
  lines.push(
    ``,
    `⏰ *PENGINGAT JADWAL & KETENTUAN MEMBER:*`,
    `• Harap hadir tepat waktu sesuai jadwal pertemuan yang sudah diagendakan.`,
    `• Wajib menggunakan sepatu badminton sol karet / non-marking di area karpet lapangan.`,
    `• Konfirmasi minimal H-1 kepada Admin jika ada kendala atau jadwal pengganti.`,
    ``,
    `Terima kasih telah bergabung menjadi member resmi *${data.gorName}*! Salam olahraga 🏸`
  );

  return lines.join('\n');
}

/**
 * STANDARDIZED UNIVERSAL INVOICE WHATSAPP GENERATOR
 * Unified helper for both Daily (Harian) and Monthly (Bulanan) bookings.
 * 
 * Rules:
 * 1. Prioritizes customer WhatsApp from selected transaction.
 * 2. If empty, resolves from linked Customer or Member data.
 * 3. NEVER uses Admin/Owner WhatsApp as fallback for invoice sending.
 * 4. Normalizes all numbers with cleanPhoneNumber (strips space, +, -, brackets, converts 08/8 to 628).
 * 5. Uses https://wa.me/ and encodeURIComponent.
 */
export function generateInvoiceWhatsAppUrl(
  params: StandardInvoiceWhatsAppParams
): GenerateInvoiceWhatsAppResult {
  const {
    settings,
    bookingType,
    invoiceCode = `INV-${Date.now()}`,
    bookingCode = 'BKG',
    customerName = 'Pelanggan',
    customerPhone,
    customerId,
    memberId,
    monthlyGroupId,
    memberCode,
    packageName,
    courtName = 'Lapangan Badminton',
    date = '',
    timeSlotLabel = '-',
    durationHours = 1,
    periodLabel,
    startDate,
    endDate,
    selectedDaysLabels = [],
    sessionCount = 4,
    sessionDates = [],
    hourlyRate,
    totalAmount = 0,
    depositAmount = 0,
    remainingAmount,
    paymentStatus = 'BELUM BAYAR',
    notes = '',
  } = params;

  // 1. Resolve customer phone number safely
  const targetPhone = resolveCustomerPhoneNumber({
    directPhone: customerPhone,
    customerId,
    memberId,
    monthlyGroupId,
    customerName,
  });

  const isValidPhone = isValidWhatsAppNumber(targetPhone);
  const gorName = settings?.gorName || settings?.name || 'GOR Badminton Smash Arena';
  const calculatedRemaining = remainingAmount !== undefined ? remainingAmount : Math.max(0, totalAmount - depositAmount);

  // Primary Bank Account
  const primaryBank = settings?.bankAccounts && settings.bankAccounts.length > 0
    ? settings.bankAccounts[0]
    : { bankName: 'BCA', accountNumber: '8820-1234-56', accountHolder: 'GOR Badminton' };

  let fullMessage = '';

  if (bookingType === 'MONTHLY') {
    // Format sessions dates list
    const safeDates = Array.isArray(sessionDates) ? sessionDates : [];
    const formattedDatesList = safeDates.length > 0
      ? safeDates.slice(0, 10).map((d, i) => {
          try {
            const [y, m, dt] = String(d).split('-').map(Number);
            const o = new Date(y, m - 1, dt);
            const dayStr = o.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
            return `  ${i + 1}. ${dayStr}`;
          } catch {
            return `  ${i + 1}. ${d}`;
          }
        }).join('\n') + (safeDates.length > 10 ? `\n  ...dan ${safeDates.length - 10} sesi lainnya` : '')
      : '• Sesuai jadwal kalender yang disepakati';

    const safeDays = Array.isArray(selectedDaysLabels) ? selectedDaysLabels : [];
    const daysStr = safeDays.length > 0 ? safeDays.join(' & ') : '';

    fullMessage = buildMonthlyInvoiceMessage({
      gorName,
      invoiceCode,
      bookingCode,
      customerName: customerName.trim(),
      memberCode,
      packageName,
      courtName,
      periodLabel,
      startDate,
      endDate,
      timeSlotLabel,
      daysLabel: daysStr,
      sessionCount,
      durationHours,
      hourlyRate,
      totalAmount,
      depositAmount,
      remainingAmount: calculatedRemaining,
      paymentStatus,
      sessionDatesSummary: formattedDatesList,
      primaryBank,
      paymentInstructions: settings?.paymentInstructions || settings?.paymentNotes,
      notes,
    });
  } else {
    // Daily / Regular Booking
    let formattedDate = date;
    try {
      if (date) {
        const [y, m, d] = date.split('-').map(Number);
        const dateObj = new Date(y, m - 1, d);
        formattedDate = dateObj.toLocaleDateString('id-ID', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        });
      }
    } catch {
      formattedDate = date;
    }

    fullMessage = buildRegularInvoiceMessage({
      gorName,
      invoiceCode,
      bookingCode,
      customerName: customerName.trim(),
      courtName,
      formattedDate,
      timeSlotLabel,
      durationHours,
      totalAmount,
      depositAmount,
      remainingAmount: calculatedRemaining,
      paymentStatus,
      primaryBank,
      paymentInstructions: settings?.paymentInstructions || settings?.paymentNotes,
      notes,
    });
  }

  const encodedMessage = encodeURIComponent(fullMessage);
  const url = isValidPhone ? `https://wa.me/${targetPhone}?text=${encodedMessage}` : '#';

  return {
    url,
    targetPhone,
    isValidPhone,
    message: fullMessage,
    errorReason: isValidPhone ? undefined : 'Nomor WhatsApp customer tidak valid atau belum tercatat pada data booking ini.',
  };
}

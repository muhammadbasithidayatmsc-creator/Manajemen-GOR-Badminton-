import { BusinessSettings } from '../types';
import { formatRupiah } from '../services/store';

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
 * Strips non-digits, spaces, plus signs, dashes, and converts leading 0 to 62
 */
export function cleanPhoneNumber(phone?: string): string {
  if (!phone) return '';
  let clean = phone.replace(/[^0-9]/g, '');
  if (!clean) return '';
  if (clean.startsWith('0')) {
    clean = '62' + clean.substring(1);
  } else if (!clean.startsWith('62')) {
    clean = '62' + clean;
  }
  return clean;
}

export function normalizeWhatsAppNumber(phone?: string): string {
  const cleaned = cleanPhoneNumber(phone);
  return cleaned || DEFAULT_ADMIN_WHATSAPP;
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

/**
 * Safe formatter for currency or string
 */
function formatNumberVal(val?: number | string): string {
  if (val === undefined || val === null || val === '') return '0';
  if (typeof val === 'number') {
    return val.toLocaleString('id-ID');
  }
  return String(val);
}

/**
 * Universal template substitution engine.
 * Replaces all placeholders [TAG] with actual values.
 * Ensures no raw placeholder strings remain.
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

  // Final pass: clean any unrecognized [TAG] placeholders to empty/clean text
  result = result.replace(/\[[A-Z0-9_]+\]/g, '-');

  return result.trim();
}

/**
 * Generate direct WhatsApp URL to contact the CUSTOMER from Admin panel
 * Uses the customer's own phone number!
 */
export function generateCustomerWhatsAppUrl(params: {
  customerPhone: string;
  customerName?: string;
  bookingCode?: string;
  courtName?: string;
  date?: string;
  timeSlotLabel?: string;
  gorName?: string;
  customMessage?: string;
}): string {
  const targetPhone = cleanPhoneNumber(params.customerPhone);
  if (!targetPhone) return '#';

  if (params.customMessage) {
    return `https://wa.me/${targetPhone}?text=${encodeURIComponent(params.customMessage)}`;
  }

  const gor = params.gorName || 'GOR Badminton';
  let text = `Halo Kak ${params.customerName ? params.customerName.trim() : ''}, kami dari Admin ${gor}.`;
  if (params.bookingCode) {
    text += ` Mengenai reservasi Anda (${params.bookingCode})`;
    if (params.courtName && params.date) {
      text += ` di ${params.courtName} pada tanggal ${params.date} (${params.timeSlotLabel || ''}).`;
    } else {
      text += '.';
    }
  }

  return `https://wa.me/${targetPhone}?text=${encodeURIComponent(text)}`;
}

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
  } = params;

  const targetPhone = normalizeWhatsAppNumber(settings?.adminWhatsApp || DEFAULT_ADMIN_WHATSAPP);

  // Parse start and end time from label if possible
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

  // Format date readable in Indonesian
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

export function generateMonthlyBookingWhatsAppUrl(params: {
  settings?: BusinessSettings;
  groupCode: string;
  customerName: string;
  customerPhone: string;
  courtName: string;
  periodLabel: string;
  startDate: string;
  endDate: string;
  selectedDaysLabels: string[];
  timeSlotLabel: string;
  sessionCount: number;
  ratePerSession: number;
  totalAmount: number;
  depositAmount: number;
  remainingAmount: number;
  dates: string[];
  notes?: string;
  customerType?: 'REGULAR' | 'MEMBER';
  ratePerHour?: number;
}): string {
  const {
    settings,
    groupCode,
    customerName,
    customerPhone,
    courtName,
    periodLabel,
    startDate,
    endDate,
    selectedDaysLabels,
    timeSlotLabel,
    sessionCount,
    ratePerSession,
    totalAmount,
    depositAmount,
    remainingAmount,
    dates,
    notes,
    customerType = 'MEMBER',
    ratePerHour = 25000,
  } = params;

  const targetPhone = normalizeWhatsAppNumber(settings?.adminWhatsApp || DEFAULT_ADMIN_WHATSAPP);

  // Format first 8 dates summary
  const datesSummary = dates
    .slice(0, 8)
    .map((d) => {
      try {
        const [y, m, dt] = d.split('-').map(Number);
        const o = new Date(y, m - 1, dt);
        return `• ${o.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' })}`;
      } catch {
        return `• ${d}`;
      }
    })
    .join('\n');

  const moreCount = dates.length > 8 ? `\n• ...dan ${dates.length - 8} sesi lainnya` : '';

  const primaryBank = settings?.bankAccounts && settings.bankAccounts.length > 0
    ? settings.bankAccounts[0]
    : { bankName: 'BCA', accountNumber: '8820-1234-56', accountHolder: 'GOR Badminton' };

  const messageLines = [
    `🏸 KONFIRMASI BOOKING MEMBER BULANAN — ${settings?.gorName || settings?.name || 'GOR BADMINTON'}`,
    '',
    `Halo Admin, saya ingin konfirmasi booking paket member bulanan:`,
    '',
    `📋 Kode Booking: ${groupCode}`,
    `👤 Nama: ${customerName.trim()}`,
    `📱 WhatsApp: ${customerPhone.trim()}`,
    `👥 Jenis Pelanggan: ${customerType === 'MEMBER' ? 'Member Bulanan' : 'Pelanggan Reguler'}`,
    `📌 Jenis Booking: Paket Member Bulanan`,
    `🏸 Lapangan: ${courtName}`,
    `📅 Periode: ${periodLabel} (${startDate} s/d ${endDate})`,
    `⏰ Jadwal: Setiap ${selectedDaysLabels.join(' & ')} (${timeSlotLabel})`,
    `⏱️ Jumlah Sesi: ${sessionCount} Sesi Pertemuan`,
    '',
    `💰 RINCIAN BIAYA MEMBER:`,
    `Tarif Khusus Member: Rp${(ratePerHour || 25000).toLocaleString('id-ID')}/jam`,
    `Tarif per Sesi: ${formatRupiah(ratePerSession)}`,
    `Total Biaya: ${formatRupiah(totalAmount)}`,
    `Uang Muka (DP): ${formatRupiah(depositAmount)}`,
    `Sisa Pembayaran: ${formatRupiah(remainingAmount)}`,
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
    datesSummary + moreCount,
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

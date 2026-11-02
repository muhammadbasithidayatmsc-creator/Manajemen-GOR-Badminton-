import { BusinessSettings } from '../types';
import { formatRupiah } from '../services/store';

export const DEFAULT_ADMIN_WHATSAPP = '6281803716514';

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
  } = params;

  // Use the requested target phone +6281803716514
  const targetPhone = normalizeWhatsAppNumber(settings?.adminWhatsApp || DEFAULT_ADMIN_WHATSAPP);

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

  const messageLines = [
    '🏸 BOOKING GOR BADMINTON',
    '',
    'Halo Admin, saya ingin melakukan booking:',
    '',
    `📋 ID Booking: ${bookingCode}`,
    `👤 Nama: ${customerName.trim()}`,
    `📱 WhatsApp: ${customerPhone.trim()}`,
    `📅 Tanggal: ${formattedDate} (${date})`,
    `🏸 Lapangan: ${courtName}`,
    `⏰ Jam/Session: ${timeSlotLabel}`,
    `⏱️ Durasi: ${durationHours} Jam`,
    `📌 Jenis Booking: ${bookingType === 'MONTHLY' ? 'Booking Bulanan' : 'Booking Reguler'}`,
    '',
    `💰 Total: ${formatRupiah(totalAmount)}`,
    `💳 DP: ${formatRupiah(depositAmount)}`,
    `💵 Sisa: ${formatRupiah(remainingAmount)}`,
    `📝 Catatan: ${notes && notes.trim() ? notes.trim() : '-'}`,
    '',
    'Mohon dibantu konfirmasi booking saya.',
    '',
    'Terima kasih 🙏🏻',
  ];

  const fullText = messageLines.join('\n');
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
    totalAmount,
    depositAmount,
    remainingAmount,
    dates,
    notes,
  } = params;

  const targetPhone = normalizeWhatsAppNumber(settings?.adminWhatsApp || DEFAULT_ADMIN_WHATSAPP);

  // Format first 5 dates summary
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

  const messageLines = [
    '🏸 BOOKING GOR BADMINTON (BULANAN)',
    '',
    'Halo Admin, saya ingin melakukan booking bulanan:',
    '',
    `📋 ID Booking: ${groupCode}`,
    `👤 Nama: ${customerName.trim()}`,
    `📱 WhatsApp: ${customerPhone.trim()}`,
    `📅 Periode: ${periodLabel} (${startDate} s/d ${endDate})`,
    `🏸 Lapangan: ${courtName}`,
    `⏰ Jadwal: Setiap ${selectedDaysLabels.join(' & ')} (${timeSlotLabel})`,
    `⏱️ Jumlah Sesi: ${sessionCount} Sesi`,
    '📌 Jenis Booking: Booking Bulanan',
    '',
    `💰 Total: ${formatRupiah(totalAmount)}`,
    `💳 DP: ${formatRupiah(depositAmount)}`,
    `💵 Sisa: ${formatRupiah(remainingAmount)}`,
    `📝 Catatan: ${notes && notes.trim() ? notes.trim() : '-'}`,
    '',
    'Daftar Tanggal Sesi:',
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
  const text = `Halo Admin ${gorName}, saya ingin menanyakan informasi jadwal ketersediaan lapangan dan sewa rutin bulanan.`;
  return `https://wa.me/${targetPhone}?text=${encodeURIComponent(text)}`;
}

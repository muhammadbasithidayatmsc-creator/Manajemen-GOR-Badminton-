import { BusinessSettings } from '../types';
import { formatRupiah } from '../services/store';

export function normalizeWhatsAppNumber(phone: string): string {
  let clean = phone.replace(/[^0-9]/g, '');
  if (clean.startsWith('0')) {
    clean = '62' + clean.substring(1);
  } else if (!clean.startsWith('62')) {
    clean = '62' + clean;
  }
  return clean;
}

export function generateBookingWhatsAppUrl(params: {
  settings: BusinessSettings;
  customerName: string;
  customerPhone: string;
  courtName: string;
  date: string;
  timeSlotLabel: string;
  totalAmount: number;
  notes?: string;
  bookingCode?: string;
}): string {
  const {
    settings,
    customerName,
    courtName,
    date,
    timeSlotLabel,
    totalAmount,
    notes,
    bookingCode,
  } = params;

  const targetPhone = normalizeWhatsAppNumber(settings.adminWhatsApp || '6281298765432');

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

  const gorName = settings.gorName || settings.name || 'GOR Badminton';

  let fullText = '';
  if (settings.waTemplateCustomer && settings.waTemplateCustomer.trim()) {
    fullText = settings.waTemplateCustomer
      .replace(/\[NAMA_GOR\]/gi, gorName)
      .replace(/\[NAMA\]/gi, customerName.trim())
      .replace(/\[KODE\]/gi, bookingCode || '-')
      .replace(/\[LAPANGAN\]/gi, courtName)
      .replace(/\[TANGGAL\]/gi, `${formattedDate} (${date})`)
      .replace(/\[JAM\]/gi, timeSlotLabel)
      .replace(/\[TOTAL\]/gi, formatRupiah(totalAmount));
  } else {
    const messageLines = [
      `Halo Admin ${gorName},`,
      '',
      'Saya ingin booking lapangan.',
      '',
      `Nama: ${customerName.trim()}`,
      `Tanggal: ${formattedDate} (${date})`,
      `Lapangan: ${courtName}`,
      `Jam: ${timeSlotLabel}`,
      `Total Biaya: ${formatRupiah(totalAmount)}`,
      bookingCode ? `Kode Booking: ${bookingCode}` : null,
      `Catatan: ${notes && notes.trim() ? notes.trim() : '-'}`,
      '',
      'Mohon konfirmasi booking saya.',
      '',
      'Terima kasih.',
    ].filter((line) => line !== null);

    fullText = messageLines.join('\n');
  }

  return `https://wa.me/${targetPhone}?text=${encodeURIComponent(fullText)}`;
}

export function generateDirectInquiryWhatsAppUrl(settings: BusinessSettings): string {
  const targetPhone = normalizeWhatsAppNumber(settings.adminWhatsApp || '6281298765432');
  const gorName = settings.gorName || settings.name || 'GOR Badminton';
  const text = `Halo Admin ${gorName}, saya ingin menanyakan informasi jadwal ketersediaan lapangan dan sewa rutin member.`;
  return `https://wa.me/${targetPhone}?text=${encodeURIComponent(text)}`;
}

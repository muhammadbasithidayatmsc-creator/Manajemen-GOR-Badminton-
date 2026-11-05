import React, { useRef, useState, useMemo, useEffect } from 'react';
import {
  X,
  Printer,
  Download,
  CheckCircle2,
  Clock,
  AlertCircle,
  Calendar,
  Layers,
  Phone,
  User,
  CreditCard,
  Building2,
  ExternalLink,
  Copy,
  Check,
  Crown,
  FileText,
  Sparkles,
  Receipt,
  Timer,
  ShieldCheck,
} from 'lucide-react';
import { Booking, BusinessSettings, Member, MonthlyBookingGroup } from '../../types';
import { store, formatRupiah } from '../../services/store';
import {
  generateBookingWhatsAppUrl,
  generateMonthlyBookingWhatsAppUrl,
  generateMemberInvoiceWhatsAppUrl,
  DEFAULT_ADMIN_WHATSAPP,
} from '../../utils/whatsapp';
import { useToast } from '../../context/ToastContext';

export interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking?: Booking | null;
  monthlyBooking?: MonthlyBookingGroup | null;
  member?: Member | null;
  settings?: BusinessSettings;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({
  isOpen,
  onClose,
  booking,
  monthlyBooking: propMonthlyBooking,
  member: propMember,
  settings: propSettings,
}) => {
  const { success, error: notifyError } = useToast();
  const [copied, setCopied] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  // Always read freshest business settings from store
  const activeSettings = useMemo(() => {
    const latest = store.getSettings();
    return { ...(propSettings || latest), ...latest };
  }, [propSettings, isOpen]);

  // Resolve member if not passed directly but booking or monthlyBooking has member info
  const resolvedMember = useMemo<Member | null>(() => {
    if (propMember) return propMember;
    const allMembers = store.getMembers();

    if (booking?.memberId) {
      const found = allMembers.find((m) => m.id === booking.memberId);
      if (found) return found;
    }
    if (booking?.monthlyGroupId) {
      const found = allMembers.find((m) => m.monthlyGroupId === booking.monthlyGroupId);
      if (found) return found;
    }
    if (propMonthlyBooking?.memberId) {
      const found = allMembers.find((m) => m.id === propMonthlyBooking.memberId);
      if (found) return found;
    }
    if (propMonthlyBooking?.id) {
      const found = allMembers.find((m) => m.monthlyGroupId === propMonthlyBooking.id);
      if (found) return found;
    }
    return null;
  }, [propMember, booking, propMonthlyBooking, isOpen]);

  // Resolve monthlyBooking group if not passed directly
  const resolvedMonthly = useMemo<MonthlyBookingGroup | null>(() => {
    if (propMonthlyBooking) return propMonthlyBooking;
    const allMonthly = store.getMonthlyBookings();

    if (booking?.monthlyGroupId) {
      const found = allMonthly.find((g) => g.id === booking.monthlyGroupId);
      if (found) return found;
    }
    if (resolvedMember?.monthlyGroupId) {
      const found = allMonthly.find((g) => g.id === resolvedMember.monthlyGroupId);
      if (found) return found;
    }
    return null;
  }, [propMonthlyBooking, booking, resolvedMember, isOpen]);

  // Sesi Monitoring Details
  const sessionDetails = useMemo(() => {
    if (resolvedMember?.id) {
      return store.getMemberSessionDetails(resolvedMember.id);
    }
    return null;
  }, [resolvedMember, isOpen]);

  // Clean data derivation with 100% null safety
  const isMonthly = Boolean(
    resolvedMonthly ||
    resolvedMember ||
    (booking && (booking.bookingType === 'MONTHLY' || booking.customerType === 'MEMBER'))
  );

  const idInvoice = useMemo(() => {
    if (resolvedMember?.memberCode) return `INV-${resolvedMember.memberCode}`;
    if (resolvedMonthly?.groupCode) return `INV-${resolvedMonthly.groupCode}`;
    if (booking?.bookingCode) return `INV-${booking.bookingCode}`;
    return `INV-${Date.now().toString().slice(-6)}`;
  }, [resolvedMember, resolvedMonthly, booking]);

  const customerName = (
    resolvedMember?.name ||
    resolvedMonthly?.customerName ||
    booking?.customerName ||
    'Pelanggan'
  ).trim();

  const customerPhone = (
    resolvedMember?.phone ||
    resolvedMonthly?.customerPhone ||
    booking?.customerPhone ||
    '-'
  ).trim();

  const packageName =
    resolvedMember?.packageName ||
    resolvedMember?.membershipType ||
    (isMonthly ? 'Member Bulanan Reguler' : 'Booking Reguler');

  const courtName =
    resolvedMember?.courtName ||
    resolvedMonthly?.courtName ||
    booking?.courtName ||
    'Lapangan Badminton';

  const durationHours = Math.max(
    1,
    Number(resolvedMember?.durationHours || resolvedMonthly?.durationHours || booking?.durationHours || 1)
  );

  const totalSessions =
    resolvedMember?.sessionCount ||
    resolvedMonthly?.sessionCount ||
    resolvedMonthly?.dates?.length ||
    (isMonthly ? 4 : 1);

  const usedSessions = sessionDetails?.usedSessions || resolvedMember?.usedSessions || 0;
  const remainingSessions = Math.max(0, totalSessions - usedSessions);

  const timeSlotLabel =
    resolvedMember?.timeSlotLabel ||
    resolvedMonthly?.timeSlotLabel ||
    booking?.timeSlotLabel ||
    '-';

  const hourlyRateDisplay =
    resolvedMember?.customHourlyRate ||
    resolvedMonthly?.ratePerHour ||
    booking?.ratePerHour ||
    (isMonthly ? 25000 : 30000);

  const totalAmount = Number(
    resolvedMember?.totalAmount ??
    resolvedMonthly?.totalAmount ??
    booking?.totalAmount ??
    0
  );

  const depositAmount = Number(
    resolvedMember?.depositAmount ??
    resolvedMonthly?.depositAmount ??
    booking?.depositAmount ??
    0
  );

  const remainingAmount = Number(
    resolvedMember?.remainingAmount ??
    resolvedMonthly?.remainingAmount ??
    booking?.remainingAmount ??
    Math.max(0, totalAmount - depositAmount)
  );

  const paymentStatus =
    resolvedMember?.paymentStatus ||
    resolvedMonthly?.paymentStatus ||
    booking?.paymentStatus ||
    (depositAmount >= totalAmount && totalAmount > 0 ? 'LUNAS' : depositAmount > 0 ? 'DP' : 'BELUM BAYAR');

  const paymentMethod =
    resolvedMember?.paymentMethod ||
    resolvedMonthly?.paymentMethod ||
    booking?.paymentMethod ||
    'TRANSFER';

  const bookingStatus =
    resolvedMonthly?.bookingStatus ||
    booking?.bookingStatus ||
    (depositAmount > 0 ? 'CONFIRMED' : 'PENDING');

  const notes =
    resolvedMember?.notes ||
    resolvedMonthly?.notes ||
    booking?.notes ||
    '';

  const createdAt =
    resolvedMember?.createdAt ||
    resolvedMonthly?.createdAt ||
    booking?.createdAt ||
    new Date().toISOString().split('T')[0];

  // Dates & Days arrays safe extraction
  const sessionDates: string[] = useMemo(() => {
    if (resolvedMonthly?.dates && Array.isArray(resolvedMonthly.dates)) {
      return resolvedMonthly.dates;
    }
    if (sessionDetails?.bookings && Array.isArray(sessionDetails.bookings)) {
      return sessionDetails.bookings.map((b) => b.date);
    }
    if (booking?.date) {
      return [booking.date];
    }
    return [];
  }, [resolvedMonthly, sessionDetails, booking]);

  const selectedDaysLabels: string[] = useMemo(() => {
    if (resolvedMember?.selectedDaysLabels && Array.isArray(resolvedMember.selectedDaysLabels)) {
      return resolvedMember.selectedDaysLabels;
    }
    if (resolvedMonthly?.selectedDaysLabels && Array.isArray(resolvedMonthly.selectedDaysLabels)) {
      return resolvedMonthly.selectedDaysLabels;
    }
    return [];
  }, [resolvedMember, resolvedMonthly]);

  // Formatted date / period label
  const dateOrPeriod = useMemo(() => {
    if (isMonthly) {
      const start = resolvedMember?.startDate || resolvedMonthly?.startDate || '';
      const end = resolvedMember?.endDate || resolvedMonthly?.endDate || '';
      if (start && end) return `${start} s/d ${end}`;
      if (resolvedMonthly?.periodLabel) return resolvedMonthly.periodLabel;
      return 'Paket Member Bulanan';
    }
    if (booking?.date) {
      try {
        const [y, m, d] = booking.date.split('-').map(Number);
        const o = new Date(y, m - 1, d);
        return o.toLocaleDateString('id-ID', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        });
      } catch {
        return booking.date;
      }
    }
    return '-';
  }, [isMonthly, resolvedMember, resolvedMonthly, booking]);

  // Bank Accounts fallback
  const activeBankAccounts = useMemo(() => {
    if (activeSettings.bankAccounts && activeSettings.bankAccounts.length > 0) {
      return activeSettings.bankAccounts;
    }
    return [{ bankName: 'BCA', accountNumber: '8820-1234-56', accountHolder: 'GOR Badminton' }];
  }, [activeSettings]);

  // WhatsApp Url
  const waUrl = useMemo(() => {
    if (resolvedMember) {
      return generateMemberInvoiceWhatsAppUrl({
        settings: activeSettings,
        member: resolvedMember,
        invoiceCode: idInvoice,
        sendToCustomer: true,
      });
    }
    if (resolvedMonthly) {
      return generateMonthlyBookingWhatsAppUrl({
        settings: activeSettings,
        groupCode: resolvedMonthly.groupCode,
        customerName: resolvedMonthly.customerName,
        customerPhone: resolvedMonthly.customerPhone,
        courtName: resolvedMonthly.courtName,
        periodLabel: resolvedMonthly.periodLabel,
        startDate: resolvedMonthly.startDate,
        endDate: resolvedMonthly.endDate,
        selectedDaysLabels: resolvedMonthly.selectedDaysLabels || [],
        timeSlotLabel: resolvedMonthly.timeSlotLabel,
        sessionCount: resolvedMonthly.sessionCount,
        ratePerSession: resolvedMonthly.ratePerSession,
        totalAmount: resolvedMonthly.totalAmount,
        depositAmount: resolvedMonthly.depositAmount,
        remainingAmount: resolvedMonthly.remainingAmount,
        dates: resolvedMonthly.dates || [],
        notes: resolvedMonthly.notes,
        customerType: 'MEMBER',
        ratePerHour: hourlyRateDisplay,
      });
    }
    if (booking) {
      return generateBookingWhatsAppUrl({
        settings: activeSettings,
        customerName: booking.customerName || 'Pelanggan',
        customerPhone: booking.customerPhone || '',
        courtName: booking.courtName || 'Court',
        date: booking.date || '',
        timeSlotLabel: booking.timeSlotLabel || '',
        durationHours: booking.durationHours || 1,
        totalAmount: booking.totalAmount || 0,
        depositAmount: booking.depositAmount || 0,
        remainingAmount: booking.remainingAmount || 0,
        notes: booking.notes,
        bookingCode: booking.bookingCode || 'BKG',
        bookingType: booking.bookingType || 'REGULAR',
        customerType: booking.customerType || 'REGULAR',
        ratePerHour: hourlyRateDisplay,
      });
    }
    return '#';
  }, [resolvedMember, resolvedMonthly, booking, activeSettings, idInvoice, hourlyRateDisplay]);

  // Cleanup printing class on unmount
  useEffect(() => {
    return () => {
      document.body.classList.remove('printing-invoice');
    };
  }, []);

  if (!isOpen) return null;

  // Copy ID
  const handleCopyCode = () => {
    try {
      navigator.clipboard.writeText(idInvoice);
      setCopied(true);
      success('Nomor Invoice Disalin', `${idInvoice} berhasil disalin ke clipboard.`);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  /**
   * Ultra-Safe Print Function:
   * Works on Desktop & Mobile Android without white/blank screen.
   */
  const handlePrint = () => {
    setIsPrinting(true);
    document.body.classList.add('printing-invoice');

    // Give browser 50ms to apply clean print styles, then print
    setTimeout(() => {
      try {
        window.print();
      } catch (err) {
        console.error('Print error:', err);
      } finally {
        setTimeout(() => {
          document.body.classList.remove('printing-invoice');
          setIsPrinting(false);
        }, 500);
      }
    }, 100);
  };

  /**
   * Standalone Download PDF / HTML File:
   * Generates a fully-styled, standalone printable invoice HTML document
   * that can be saved as PDF with 1 tap or printed on any mobile or desktop device.
   */
  const handleDownloadInvoice = () => {
    try {
      const gorName = activeSettings.gorName || activeSettings.name || 'GOR Badminton Smash Arena';
      const gorAddress = activeSettings.address || 'Pusat Rental Lapangan Badminton';
      const adminWA = activeSettings.adminWhatsApp || DEFAULT_ADMIN_WHATSAPP;

      const bankListHtml = activeBankAccounts
        .map(
          (b) => `
          <div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px; background: #ffffff; margin-bottom: 6px;">
            <div style="font-size: 11px; font-weight: bold; color: #1e293b; text-transform: uppercase;">${b.bankName}</div>
            <div style="font-family: monospace; font-size: 15px; font-weight: bold; color: #047857; margin: 4px 0;">${b.accountNumber}</div>
            <div style="font-size: 11px; color: #64748b;">a/n ${b.accountHolder}</div>
          </div>
        `
        )
        .join('');

      const sessionsHtml = sessionDates.length > 0
        ? `
          <div style="margin-top: 14px; padding: 12px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0;">
            <div style="font-size: 12px; font-weight: bold; color: #1e293b; margin-bottom: 8px;">
              Jadwal Sesi Pertemuan (${sessionDates.length} Sesi Terjadwal):
            </div>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 6px; font-size: 11px;">
              ${sessionDates.map((d, i) => `
                <div style="padding: 4px 8px; background: #ffffff; border: 1px solid #cbd5e1; border-radius: 4px;">
                  Sesi ${i + 1}: <strong>${d}</strong>
                </div>
              `).join('')}
            </div>
          </div>
        `
        : '';

      const htmlContent = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Invoice - ${idInvoice}</title>
  <style>
    * { box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    body { background: #f1f5f9; padding: 20px; color: #0f172a; margin: 0; }
    .sheet { max-width: 650px; margin: 0 auto; background: #ffffff; border-radius: 12px; padding: 32px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); border: 1px solid #e2e8f0; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #047857; padding-bottom: 16px; margin-bottom: 20px; }
    .title { font-size: 20px; font-weight: 800; color: #0f172a; margin: 0 0 4px 0; }
    .subtitle { font-size: 11px; color: #64748b; margin: 0; line-height: 1.4; }
    .badge { display: inline-block; background: #ecfdf5; color: #065f46; font-size: 11px; font-weight: bold; padding: 3px 8px; border-radius: 6px; border: 1px solid #a7f3d0; }
    .inv-num { font-size: 16px; font-weight: bold; color: #047857; margin-top: 4px; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px; }
    .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; font-size: 12px; }
    .card-title { font-size: 11px; font-weight: bold; color: #64748b; text-transform: uppercase; margin-bottom: 6px; }
    .row { display: flex; justify-content: space-between; margin-bottom: 4px; }
    .table { width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 12px; }
    .table th { background: #f1f5f9; text-align: left; padding: 8px; font-size: 11px; color: #475569; }
    .table td { padding: 10px 8px; border-bottom: 1px solid #e2e8f0; }
    .total-box { background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 8px; padding: 12px; margin-top: 16px; }
    .btn-print { display: block; width: 100%; padding: 12px; background: #047857; color: #ffffff; text-align: center; text-decoration: none; font-weight: bold; font-size: 13px; border-radius: 8px; margin-top: 20px; cursor: pointer; border: none; }
    @media print {
      body { background: #ffffff; padding: 0; }
      .sheet { box-shadow: none; border: none; padding: 0; width: 100%; max-width: 100%; }
      .btn-print { display: none !important; }
    }
  </style>
</head>
<body>
  <div class="sheet">
    <div class="header">
      <div>
        <h1 class="title">🏸 ${gorName}</h1>
        <p class="subtitle">${gorAddress}</p>
        <p class="subtitle">WhatsApp Admin: +${adminWA}</p>
      </div>
      <div style="text-align: right;">
        <span class="badge">INVOICE RESMI GOR</span>
        <div class="inv-num">${idInvoice}</div>
        <div style="font-size: 11px; color: #64748b;">Tanggal: ${createdAt}</div>
      </div>
    </div>

    <div class="grid">
      <div class="card">
        <div class="card-title">Data Member / Pelanggan</div>
        <div class="row"><span>Nama:</span><strong>${customerName}</strong></div>
        <div class="row"><span>WhatsApp:</span><span>${customerPhone}</span></div>
        <div class="row"><span>Kategori:</span><strong>${isMonthly ? 'Member Bulanan VIP' : 'Reguler'}</strong></div>
        <div class="row"><span>Status:</span><span style="color: #047857; font-weight: bold;">${paymentStatus}</span></div>
      </div>

      <div class="card">
        <div class="card-title">Jadwal & Spesifikasi Sesi</div>
        <div class="row"><span>Paket:</span><strong>${packageName}</strong></div>
        <div class="row"><span>Lapangan:</span><span>${courtName}</span></div>
        <div class="row"><span>Periode:</span><span>${dateOrPeriod}</span></div>
        <div class="row"><span>Durasi:</span><span>${durationHours} Jam per Sesi</span></div>
        <div class="row"><span>Total Sesi:</span><strong>${totalSessions} Sesi (${usedSessions} Terpakai, ${remainingSessions} Sisa)</strong></div>
      </div>
    </div>

    ${sessionsHtml}

    <table class="table">
      <thead>
        <tr>
          <th>Rincian Item</th>
          <th style="text-align: right;">Tarif / Jumlah</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <strong>Sewa ${courtName} — ${packageName}</strong><br>
            <span style="color: #64748b; font-size: 11px;">
              ${isMonthly ? `${totalSessions} Sesi Pertemuan @ ${durationHours} Jam (Tarif Khusus Member: ${formatRupiah(hourlyRateDisplay)}/jam)` : `1 Sesi @ ${durationHours} Jam`}
            </span>
          </td>
          <td style="text-align: right; font-weight: bold;">${formatRupiah(totalAmount)}</td>
        </tr>
        <tr>
          <td style="color: #047857;">Pembayaran Masuk / Uang Muka (DP)</td>
          <td style="text-align: right; color: #047857; font-weight: bold;">${formatRupiah(depositAmount)}</td>
        </tr>
      </tbody>
    </table>

    <div class="total-box">
      <div class="row" style="font-size: 15px; font-weight: 800;">
        <span>TOTAL TAGIHAN:</span>
        <span>${formatRupiah(totalAmount)}</span>
      </div>
      <div class="row" style="font-size: 13px; color: #b45309; font-weight: bold; margin-top: 6px;">
        <span>Sisa Pembayaran:</span>
        <span>${formatRupiah(remainingAmount)}</span>
      </div>
    </div>

    <div style="margin-top: 20px;">
      <div style="font-size: 12px; font-weight: bold; color: #1e293b; margin-bottom: 8px;">
        Rekening Pembayaran Resmi GOR:
      </div>
      ${bankListHtml}
    </div>

    <p style="font-size: 11px; color: #64748b; margin-top: 14px; line-height: 1.4;">
      ${activeSettings.paymentInstructions || activeSettings.paymentNotes || 'Harap simpan invoice ini sebagai bukti administrasi resmi.'}
    </p>

    <button onclick="window.print()" class="btn-print">🖨️ Cetak / Simpan sebagai PDF</button>
  </div>
</body>
</html>`;

      const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Invoice-${idInvoice}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      success('Invoice Disimpan', `File Invoice-${idInvoice}.html berhasil diunduh. Dapat dibuka & dicetak di HP / PC.`);
    } catch (err: any) {
      console.error('Download invoice error:', err);
      notifyError('Gagal Mengunduh', 'Terjadi kendala saat membuat file invoice.');
    }
  };

  return (
    <div
      id="invoice-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-sm overflow-y-auto animate-fade-in"
    >
      <div
        id="invoice-modal-container"
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto"
      >
        {/* Top Header Bar (Screen Only) */}
        <div className="print:hidden flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
              🏸
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Invoice & Bukti Reservasi {isMonthly ? 'Member Bulanan' : 'Reguler'}
              </h3>
              <p className="text-[11px] text-slate-500 font-mono">No: {idInvoice}</p>
            </div>
          </div>

          <button
            id="close-invoice-btn"
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
            aria-label="Tutup Invoice"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Invoice Body */}
        <div ref={printRef} id="printable-invoice-content" className="p-6 sm:p-8 space-y-5 bg-white text-slate-900">
          {/* Brand Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b-2 border-emerald-600">
            <div>
              <div className="inline-flex items-center gap-2 mb-1">
                <span className="text-2xl">🏸</span>
                <h1 className="text-xl font-black tracking-tight text-slate-900">
                  {activeSettings.gorName || activeSettings.name || 'GOR Badminton Smash Arena'}
                </h1>
              </div>
              <p className="text-xs text-slate-500 max-w-md">
                {activeSettings.address || 'Pusat Rental Lapangan Badminton Standar BWF'}
              </p>
              <p className="text-xs text-emerald-700 font-semibold mt-0.5">
                WhatsApp Admin & Owner: +{activeSettings.adminWhatsApp || DEFAULT_ADMIN_WHATSAPP}
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="inline-block px-3 py-1 text-[11px] font-bold uppercase rounded-full bg-emerald-100 text-emerald-800 tracking-wider mb-1">
                INVOICE RESMI GOR
              </span>
              <div className="text-base font-extrabold text-emerald-700 flex items-center sm:justify-end gap-1.5 font-mono">
                <span>{idInvoice}</span>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  title="Salin Nomor Invoice"
                  className="print:hidden p-1 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <p className="text-[11px] text-slate-500">Diterbitkan: {createdAt}</p>
            </div>
          </div>

          {/* Badges Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Jenis Booking:</span>
              <span
                className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                  isMonthly
                    ? 'bg-purple-100 text-purple-800 border border-purple-200'
                    : 'bg-blue-100 text-blue-800 border border-blue-200'
                }`}
              >
                {isMonthly ? '👑 Member Bulanan' : '🏸 Booking Reguler'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Status:</span>
              <span
                className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                  bookingStatus === 'CONFIRMED'
                    ? 'bg-emerald-100 text-emerald-800'
                    : bookingStatus === 'COMPLETED'
                    ? 'bg-slate-200 text-slate-800'
                    : bookingStatus === 'CANCELLED'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {bookingStatus}
              </span>

              <span
                className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                  paymentStatus === 'LUNAS'
                    ? 'bg-emerald-600 text-white'
                    : paymentStatus === 'DP'
                    ? 'bg-sky-600 text-white'
                    : 'bg-amber-500 text-white'
                }`}
              >
                {paymentStatus}
              </span>
            </div>
          </div>

          {/* Data Pemesan & Spesifikasi Jadwal Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Box 1: Customer Data */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-2">
              <div className="flex items-center gap-1.5 text-slate-700 font-bold uppercase tracking-wider text-[11px] pb-1 border-b border-slate-100">
                <User className="w-3.5 h-3.5 text-emerald-600" />
                <span>Data Pemesan</span>
              </div>
              <div className="space-y-1 pt-0.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Nama Lengkap</span>
                  <strong className="text-slate-900">{customerName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Nomor WhatsApp</span>
                  <span className="font-mono text-slate-800 font-semibold">{customerPhone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Kategori Member</span>
                  <span className="font-bold text-emerald-800">{packageName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Tarif Khusus Member</span>
                  <span className="font-bold text-emerald-700">
                    {formatRupiah(hourlyRateDisplay)} / jam
                  </span>
                </div>
                {notes && (
                  <div className="flex justify-between pt-1 border-t border-slate-100 text-slate-600">
                    <span className="text-slate-500">Catatan</span>
                    <span className="italic text-right max-w-[180px] truncate">{notes}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Box 2: Court & Session Details */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-2">
              <div className="flex items-center gap-1.5 text-slate-700 font-bold uppercase tracking-wider text-[11px] pb-1 border-b border-slate-100">
                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                <span>Jadwal & Kuota Sesi</span>
              </div>
              <div className="space-y-1 pt-0.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Lapangan</span>
                  <strong className="text-slate-900">{courtName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Periode Bermain</span>
                  <span className="font-medium text-slate-800 text-right">{dateOrPeriod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Jam / Session</span>
                  <span className="font-bold text-emerald-700">{timeSlotLabel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Durasi per Sesi</span>
                  <span className="font-semibold text-slate-800">{durationHours} Jam per Pertemuan</span>
                </div>
                {isMonthly && (
                  <div className="flex justify-between pt-1 border-t border-slate-100 font-semibold">
                    <span className="text-slate-500">Monitoring Kuota</span>
                    <span className="text-emerald-800 font-bold">
                      {totalSessions} Sesi ({usedSessions} Terpakai • {remainingSessions} Sisa)
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sesi Dates Breakdown Preview (If Monthly & Has dates) */}
          {isMonthly && sessionDates.length > 0 && (
            <div className="p-3.5 rounded-xl border border-purple-200 bg-purple-50/50 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-purple-900">
                <span>Daftar Tanggal Sesi Pertemuan ({sessionDates.length} Sesi Terjadwal):</span>
                {selectedDaysLabels.length > 0 && (
                  <span className="text-[11px] font-semibold text-purple-700">
                    Setiap {selectedDaysLabels.join(' & ')}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-h-36 overflow-y-auto pr-1">
                {sessionDates.map((d, i) => {
                  let lbl = String(d);
                  try {
                    const [y, m, dt] = String(d).split('-').map(Number);
                    const o = new Date(y, m - 1, dt);
                    lbl = o.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' });
                  } catch {
                    lbl = String(d);
                  }
                  return (
                    <div
                      key={i}
                      className="p-1.5 rounded-lg bg-white border border-purple-200 text-[11px] flex items-center justify-between shadow-2xs"
                    >
                      <span className="font-medium text-slate-800 truncate">{lbl}</span>
                      <span className="text-[10px] font-bold text-emerald-700">Sesi {i + 1}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Pricing Table */}
          <div className="rounded-xl border border-slate-200 overflow-hidden text-xs">
            <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 font-bold text-slate-700 flex justify-between">
              <span>Rincian Tagihan</span>
              <span>Jumlah</span>
            </div>

            <div className="p-4 space-y-2 bg-white">
              <div className="flex justify-between text-slate-700">
                <span>
                  Sewa {courtName} — {packageName} ({totalSessions} Sesi @ {durationHours} Jam)
                </span>
                <span className="font-bold text-slate-900">{formatRupiah(totalAmount)}</span>
              </div>

              <div className="pt-2 border-t border-slate-100 flex justify-between text-slate-600">
                <span>Uang Muka / Pembayaran Masuk (DP)</span>
                <span className="font-bold text-emerald-700">{formatRupiah(depositAmount)}</span>
              </div>

              <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline">
                <div>
                  <span className="text-sm font-extrabold text-slate-900">Total Tagihan Paket</span>
                  <p className="text-[11px] text-slate-400">Tarif khusus member resmi GOR Badminton</p>
                </div>
                <span className="text-base font-black text-slate-900">{formatRupiah(totalAmount)}</span>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex justify-between items-center text-xs text-amber-900">
                <div className="flex items-center gap-1.5 font-bold">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Sisa Tagihan yang Harus Dilunasi</span>
                </div>
                <span className="font-extrabold text-sm text-amber-900">{formatRupiah(remainingAmount)}</span>
              </div>
            </div>
          </div>

          {/* Payment Instructions & Bank Accounts */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-2.5">
            <div className="flex items-center gap-1.5 font-bold text-slate-900">
              <CreditCard className="w-4 h-4 text-emerald-600" />
              <span>Rekening Pembayaran Resmi GOR:</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {activeBankAccounts.map((acc, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-white border border-slate-200 rounded-lg flex flex-col justify-between shadow-2xs"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs uppercase tracking-wider text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                      {acc.bankName}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        try {
                          navigator.clipboard.writeText(acc.accountNumber);
                          success('Disalin', `Nomor rekening ${acc.accountNumber} disalin!`);
                        } catch {
                          // Ignore
                        }
                      }}
                      className="print:hidden text-[11px] text-emerald-700 hover:text-emerald-800 font-semibold inline-flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      <Copy className="w-3 h-3" />
                      Salin
                    </button>
                  </div>
                  <div className="font-mono font-bold text-sm text-slate-900 tracking-wide">
                    {acc.accountNumber}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    a/n <span className="font-semibold text-slate-700">{acc.accountHolder}</span>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed pt-1 border-t border-slate-200">
              {activeSettings.paymentInstructions || activeSettings.paymentNotes || 'Kirimkan bukti transfer pembayaran via WhatsApp Admin & Owner untuk konfirmasi instan.'}
            </p>
          </div>
        </div>

        {/* Action Buttons (Screen Only) */}
        <div className="print:hidden p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* 1. Cetak / Print Invoice */}
            <button
              id="print-invoice-btn"
              type="button"
              onClick={handlePrint}
              disabled={isPrinting}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 hover:bg-slate-100 font-bold text-xs transition-colors shadow-2xs cursor-pointer"
            >
              <Printer className="w-4 h-4 text-emerald-600" />
              <span>{isPrinting ? 'Mempersiapkan...' : 'Cetak / Print'}</span>
            </button>

            {/* 2. Download HTML / PDF Invoice */}
            <button
              id="download-invoice-btn"
              type="button"
              onClick={handleDownloadInvoice}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 hover:bg-slate-100 font-bold text-xs transition-colors shadow-2xs cursor-pointer"
            >
              <Download className="w-4 h-4 text-blue-600" />
              <span>Download PDF</span>
            </button>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* 3. Send via WhatsApp */}
            <a
              id="send-wa-invoice-btn"
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all shadow-sm hover:shadow-md cursor-pointer"
            >
              <span>🏸</span>
              <span>Kirim ke WhatsApp</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </a>

            {/* 4. Close */}
            <button
              id="close-invoice-footer-btn"
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

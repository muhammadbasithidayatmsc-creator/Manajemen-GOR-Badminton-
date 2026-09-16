import React, { useRef } from 'react';
import {
  X,
  Printer,
  Download,
  Share2,
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
} from 'lucide-react';
import { Booking, BusinessSettings, MonthlyBookingGroup } from '../../types';
import { formatRupiah } from '../../services/store';
import {
  generateBookingWhatsAppUrl,
  generateMonthlyBookingWhatsAppUrl,
  DEFAULT_ADMIN_WHATSAPP,
} from '../../utils/whatsapp';
import { useToast } from '../../context/ToastContext';

export interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking?: Booking | null;
  monthlyBooking?: MonthlyBookingGroup | null;
  settings: BusinessSettings;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({
  isOpen,
  onClose,
  booking,
  monthlyBooking,
  settings,
}) => {
  const { success } = useToast();
  const [copied, setCopied] = React.useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen || (!booking && !monthlyBooking)) return null;

  const isMonthly = !!monthlyBooking;
  const idBooking = isMonthly ? monthlyBooking.groupCode : booking!.bookingCode;
  const customerName = isMonthly ? monthlyBooking.customerName : booking!.customerName;
  const customerPhone = isMonthly ? monthlyBooking.customerPhone : booking!.customerPhone;
  const courtName = isMonthly ? monthlyBooking.courtName : booking!.courtName;
  const timeSlotLabel = isMonthly ? monthlyBooking.timeSlotLabel : booking!.timeSlotLabel;
  const totalAmount = isMonthly ? monthlyBooking.totalAmount : booking!.totalAmount;
  const depositAmount = isMonthly ? monthlyBooking.depositAmount : booking!.depositAmount;
  const remainingAmount = isMonthly ? monthlyBooking.remainingAmount : booking!.remainingAmount;
  const bookingStatus = isMonthly ? monthlyBooking.bookingStatus : booking!.bookingStatus;
  const paymentStatus = isMonthly ? monthlyBooking.paymentStatus : booking!.paymentStatus;
  const notes = isMonthly ? monthlyBooking.notes : booking!.notes;
  const createdAt = isMonthly ? monthlyBooking.createdAt : booking!.createdAt;

  // Formatted date / period
  let dateOrPeriod = '';
  if (isMonthly) {
    dateOrPeriod = `${monthlyBooking.periodLabel} (${monthlyBooking.startDate} s/d ${monthlyBooking.endDate})`;
  } else {
    try {
      const [y, m, d] = booking!.date.split('-').map(Number);
      const o = new Date(y, m - 1, d);
      dateOrPeriod = o.toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      dateOrPeriod = booking!.date;
    }
  }

  // WA URL generator
  const waUrl = isMonthly
    ? generateMonthlyBookingWhatsAppUrl({
        settings,
        groupCode: monthlyBooking.groupCode,
        customerName: monthlyBooking.customerName,
        customerPhone: monthlyBooking.customerPhone,
        courtName: monthlyBooking.courtName,
        periodLabel: monthlyBooking.periodLabel,
        startDate: monthlyBooking.startDate,
        endDate: monthlyBooking.endDate,
        selectedDaysLabels: monthlyBooking.selectedDaysLabels,
        timeSlotLabel: monthlyBooking.timeSlotLabel,
        sessionCount: monthlyBooking.sessionCount,
        ratePerSession: monthlyBooking.ratePerSession,
        totalAmount: monthlyBooking.totalAmount,
        depositAmount: monthlyBooking.depositAmount,
        remainingAmount: monthlyBooking.remainingAmount,
        dates: monthlyBooking.dates,
        notes: monthlyBooking.notes,
      })
    : generateBookingWhatsAppUrl({
        settings,
        customerName: booking!.customerName,
        customerPhone: booking!.customerPhone,
        courtName: booking!.courtName,
        date: booking!.date,
        timeSlotLabel: booking!.timeSlotLabel,
        durationHours: booking!.durationHours,
        totalAmount: booking!.totalAmount,
        depositAmount: booking!.depositAmount,
        remainingAmount: booking!.remainingAmount,
        notes: booking!.notes,
        bookingCode: booking!.bookingCode,
        bookingType: booking!.bookingType || 'REGULAR',
      });

  const handleCopyCode = () => {
    navigator.clipboard.writeText(idBooking);
    setCopied(true);
    success('Disalin', `ID Booking ${idBooking} berhasil disalin ke clipboard.`);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadInvoice = () => {
    const invoiceContent = `
=====================================================
            ${settings.gorName || settings.name || 'GOR BADMINTON'}
     ${settings.address || 'Pusat Rental Lapangan Badminton'}
            WhatsApp: +${settings.adminWhatsApp || DEFAULT_ADMIN_WHATSAPP}
=====================================================

INVOICE / RINGKASAN BOOKING
ID Booking       : ${idBooking}
Tanggal Terbit   : ${createdAt}
Jenis Booking    : ${isMonthly ? 'BOOKING BULANAN (MEMBER)' : 'BOOKING REGULER (HARIAN)'}
Status Booking   : ${bookingStatus}
Status Bayar     : ${paymentStatus}

-----------------------------------------------------
DATA PELANGGAN
-----------------------------------------------------
Nama Customer    : ${customerName}
WhatsApp         : ${customerPhone}

-----------------------------------------------------
DETAIL JADWAL SEWA
-----------------------------------------------------
Lapangan         : ${courtName}
Tanggal/Periode  : ${dateOrPeriod}
Jam / Sesi       : ${timeSlotLabel}
${isMonthly ? `Jumlah Sesi      : ${monthlyBooking.sessionCount} Sesi\nPola Hari        : Setiap ${monthlyBooking.selectedDaysLabels.join(' & ')}` : `Durasi           : ${booking!.durationHours} Jam`}
Catatan          : ${notes || '-'}

-----------------------------------------------------
RINCIAN BIAYA
-----------------------------------------------------
${isMonthly ? `Tarif per Sesi   : ${formatRupiah(monthlyBooking.ratePerSession)}\nJumlah Sesi      : ${monthlyBooking.sessionCount} Sesi` : `Tarif Sewa       : ${formatRupiah(totalAmount)}`}
TOTAL TAGIHAN    : ${formatRupiah(totalAmount)}
UANG MUKA (DP)   : ${formatRupiah(depositAmount)}
SISA PEMBAYARAN  : ${formatRupiah(remainingAmount)}

-----------------------------------------------------
INFORMASI PEMBAYARAN TRANSFER
-----------------------------------------------------
${settings.bankInfo || 'BCA: 8820-1234-56 a/n GOR Badminton Smash Arena'}
${settings.paymentNotes || 'Harap transfer DP untuk konfirmasi jadwal booking.'}

Link Konfirmasi WhatsApp Admin:
https://wa.me/${settings.adminWhatsApp || DEFAULT_ADMIN_WHATSAPP}
=====================================================
    Terima kasih telah berolahraga di GOR kami!
=====================================================
    `.trim();

    const blob = new Blob([invoiceContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Invoice-${idBooking}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    success('Invoice Diunduh', `File Invoice-${idBooking}.txt berhasil disimpan.`);
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
        {/* Modal Top Header (Screen Only) */}
        <div className="print:hidden flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
              🏸
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 text-sm">Invoice & Ringkasan Booking</h3>
              <p className="text-xs text-slate-500">ID: {idBooking}</p>
            </div>
          </div>
          <button
            id="close-invoice-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Invoice Body */}
        <div ref={printRef} id="printable-invoice-content" className="p-6 sm:p-8 space-y-6">
          {/* Brand Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <div className="inline-flex items-center gap-2 mb-1">
                <span className="text-xl">🏸</span>
                <h1 className="text-xl font-bold tracking-tight text-slate-900">
                  {settings.gorName || settings.name || 'GOR Badminton Smash Arena'}
                </h1>
              </div>
              <p className="text-xs text-slate-500 max-w-md">
                {settings.address || 'Jl. Pemuda Olahraga No. 88, Jakarta'}
              </p>
              <p className="text-xs text-emerald-700 font-medium mt-1">
                WhatsApp Admin: +{settings.adminWhatsApp || DEFAULT_ADMIN_WHATSAPP}
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="inline-block px-3 py-1 text-xs font-bold uppercase rounded-full bg-slate-100 text-slate-800 tracking-wider mb-1">
                INVOICE RESMI
              </span>
              <div className="text-base font-bold text-emerald-600 flex items-center sm:justify-end gap-1.5">
                <span>{idBooking}</span>
                <button
                  onClick={handleCopyCode}
                  title="Salin ID Booking"
                  className="print:hidden p-1 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <p className="text-[11px] text-slate-400">Diterbitkan: {createdAt}</p>
            </div>
          </div>

          {/* Badges Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Jenis Booking:</span>
              <span
                className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                  isMonthly ? 'bg-purple-100 text-purple-700 border border-purple-200' : 'bg-blue-100 text-blue-700 border border-blue-200'
                }`}
              >
                {isMonthly ? '📅 Booking Bulanan' : '🏸 Booking Reguler'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Status:</span>
              <span
                className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
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
                className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
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

          {/* Customer & Schedule Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Customer Box */}
            <div className="p-4 rounded-xl border border-slate-200/80 bg-white space-y-2">
              <div className="flex items-center gap-1.5 text-slate-500 font-semibold uppercase tracking-wider text-[11px] pb-1 border-b border-slate-100">
                <User className="w-3.5 h-3.5 text-slate-400" />
                Data Pemesan
              </div>
              <div className="space-y-1 pt-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Nama Customer</span>
                  <span className="font-semibold text-slate-900">{customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Nomor WhatsApp</span>
                  <span className="font-medium text-slate-800">{customerPhone}</span>
                </div>
                {notes && (
                  <div className="flex justify-between pt-1 border-t border-slate-100 text-slate-600">
                    <span className="text-slate-500">Catatan</span>
                    <span className="italic text-right max-w-[180px] truncate">{notes}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Court & Time Box */}
            <div className="p-4 rounded-xl border border-slate-200/80 bg-white space-y-2">
              <div className="flex items-center gap-1.5 text-slate-500 font-semibold uppercase tracking-wider text-[11px] pb-1 border-b border-slate-100">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Jadwal Lapangan
              </div>
              <div className="space-y-1 pt-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Lapangan</span>
                  <span className="font-semibold text-slate-900">{courtName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Tanggal / Periode</span>
                  <span className="font-medium text-slate-800 text-right">{dateOrPeriod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Jam / Session</span>
                  <span className="font-semibold text-emerald-700">{timeSlotLabel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{isMonthly ? 'Jumlah Sesi' : 'Durasi'}</span>
                  <span className="font-semibold text-slate-800">
                    {isMonthly ? `${monthlyBooking.sessionCount} Sesi Pertemuan` : `${booking!.durationHours} Jam`}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* If Monthly: Session Dates Breakdown preview */}
          {isMonthly && monthlyBooking.dates && monthlyBooking.dates.length > 0 && (
            <div className="p-4 rounded-xl border border-purple-100 bg-purple-50/50 space-y-2.5">
              <div className="flex items-center justify-between text-xs font-semibold text-purple-900">
                <span>Daftar Sesi Booking Bulanan ({monthlyBooking.dates.length} Pertemuan):</span>
                <span className="text-[11px] font-normal text-purple-700">
                  Setiap {monthlyBooking.selectedDaysLabels.join(' & ')}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-h-36 overflow-y-auto pr-1">
                {monthlyBooking.dates.map((d, i) => {
                  let lbl = d;
                  try {
                    const [y, m, dt] = d.split('-').map(Number);
                    const o = new Date(y, m - 1, dt);
                    lbl = o.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' });
                  } catch {
                    lbl = d;
                  }
                  return (
                    <div
                      key={i}
                      className="p-1.5 rounded-lg bg-white border border-purple-100/80 text-[11px] flex items-center justify-between shadow-2xs"
                    >
                      <span className="font-medium text-slate-700 truncate">{lbl}</span>
                      <span className="text-[10px] text-emerald-600 font-semibold">S{i + 1}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Pricing Summary Table */}
          <div className="rounded-xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 text-xs font-semibold text-slate-700 flex justify-between">
              <span>Item Sewa</span>
              <span>Jumlah</span>
            </div>

            <div className="p-4 space-y-2.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>
                  Sewa {courtName} ({isMonthly ? `${monthlyBooking.sessionCount} Sesi @ ${formatRupiah(monthlyBooking.ratePerSession)}` : `${timeSlotLabel}`})
                </span>
                <span className="font-medium text-slate-900">{formatRupiah(totalAmount)}</span>
              </div>

              <div className="pt-2 border-t border-slate-100 flex justify-between text-slate-600">
                <span>Uang Muka / DP</span>
                <span className="font-semibold text-emerald-600">{formatRupiah(depositAmount)}</span>
              </div>

              <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline">
                <div>
                  <span className="text-sm font-bold text-slate-900">Total Tagihan</span>
                  <p className="text-[11px] text-slate-400">Termasuk fasilitas & pencahayaan LED</p>
                </div>
                <span className="text-base font-bold text-slate-900">{formatRupiah(totalAmount)}</span>
              </div>

              <div className="p-3 bg-amber-50/70 border border-amber-200/70 rounded-xl flex justify-between items-center text-xs text-amber-900">
                <div className="flex items-center gap-1.5 font-semibold">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Sisa Pembayaran</span>
                </div>
                <span className="font-bold text-sm text-amber-900">{formatRupiah(remainingAmount)}</span>
              </div>
            </div>
          </div>

          {/* Payment Instructions */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 space-y-1.5">
            <div className="flex items-center gap-1.5 font-semibold text-slate-800">
              <CreditCard className="w-3.5 h-3.5 text-slate-500" />
              <span>Petunjuk Pembayaran Transfer / QRIS:</span>
            </div>
            <p className="font-mono font-medium text-slate-700">
              {settings.bankInfo || 'BCA: 8820-1234-56 a/n GOR Badminton Smash Arena'}
            </p>
            <p className="text-slate-500">
              {settings.paymentNotes || 'Kirimkan bukti transfer DP minimal 50% via WhatsApp Admin untuk konfirmasi instan.'}
            </p>
          </div>
        </div>

        {/* Action Buttons (Screen Only) */}
        <div className="print:hidden p-4 sm:p-6 bg-slate-50/90 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              id="print-invoice-btn"
              type="button"
              onClick={handlePrint}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 font-medium text-xs transition-colors shadow-2xs"
            >
              <Printer className="w-4 h-4 text-slate-500" />
              Print Invoice
            </button>
            <button
              id="download-invoice-btn"
              type="button"
              onClick={handleDownloadInvoice}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 font-medium text-xs transition-colors shadow-2xs"
            >
              <Download className="w-4 h-4 text-slate-500" />
              Download
            </button>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <a
              id="send-wa-invoice-btn"
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-all shadow-sm hover:shadow-md"
            >
              <span>🏸</span>
              <span>Kirim Booking ke WhatsApp</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </a>

            <button
              id="close-invoice-footer-btn"
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 text-xs font-medium transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

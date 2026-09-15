import React, { useState } from 'react';
import {
  Settings,
  Building,
  MapPin,
  Phone,
  CreditCard,
  MessageSquare,
  Save,
  CheckCircle,
  Copy,
  ExternalLink,
  Shield,
  KeyRound,
  Eye,
  EyeOff,
  UserCheck,
  Lock,
} from 'lucide-react';
import { GorSettings, User } from '../../types';
import { store } from '../../services/store';
import { useToast } from '../../context/ToastContext';

interface GorSettingsViewProps {
  settings: GorSettings;
  currentUser?: User | null;
  onSaveSettings: (settings: GorSettings) => void;
  onReloadData?: () => void;
}

type SettingsTab = 'general' | 'payments' | 'templates' | 'security';

export const GorSettingsView: React.FC<GorSettingsViewProps> = ({
  settings,
  currentUser,
  onSaveSettings,
  onReloadData,
}) => {
  const { success, error } = useToast();

  const [activeTab, setActiveTab] = useState<SettingsTab>('general');
  const [formData, setFormData] = useState<GorSettings>(settings);

  // Security Form State
  const [accountUsername, setAccountUsername] = useState(currentUser?.username || 'owner');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSavingSecurity, setIsSavingSecurity] = useState(false);

  const handleChange = (field: keyof GorSettings, val: any) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  const handleBankChange = (index: number, field: string, val: string) => {
    const updated = [...formData.bankAccounts];
    updated[index] = { ...updated[index], [field]: val };
    setFormData((prev) => ({ ...prev, bankAccounts: updated }));
  };

  const handleAddBank = () => {
    setFormData((prev) => ({
      ...prev,
      bankAccounts: [
        ...prev.bankAccounts,
        { bankName: 'BCA', accountNumber: '', accountHolder: '' },
      ],
    }));
  };

  const handleRemoveBank = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      bankAccounts: prev.bankAccounts.filter((_, i) => i !== index),
    }));
  };

  const handleSubmitSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(formData);
    success('Pengaturan Disimpan', 'Data GOR, rekening, dan template WhatsApp berhasil diperbarui.');
  };

  const handleSaveSecurity = (e: React.FormEvent) => {
    e.preventDefault();

    if (!accountUsername.trim()) {
      error('Username Wajib Diisi', 'Silakan masukkan username yang valid.');
      return;
    }

    if (newPassword && newPassword.length < 6) {
      error('Password Terlalu Pendek', 'Password baru minimal harus 6 karakter.');
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      error('Konfirmasi Password Tidak Cocok', 'Kata sandi baru dan konfirmasi kata sandi tidak sama.');
      return;
    }

    const userId = currentUser?.id || 'user-owner-1';

    setIsSavingSecurity(true);
    const result = store.updateAccountSecurity(userId, accountUsername, newPassword || undefined);
    setIsSavingSecurity(false);

    if (result.success) {
      success(
        'Kredensial Berhasil Disimpan',
        'Username dan kata sandi baru telah tersimpan secara permanen. Gunakan kredensial baru ini untuk login berikutnya.'
      );
      setNewPassword('');
      setConfirmPassword('');
      onReloadData?.();
    } else {
      error('Gagal Menyimpan', result.error || 'Terjadi kendala saat memperbarui kredensial.');
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-tight">
            Pengaturan Bisnis GOR
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola profil operasional, rekening bank manual, template pesan, dan keamanan kredensial akun
          </p>
        </div>

        {activeTab !== 'security' && (
          <button
            onClick={handleSubmitSettings}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Pengaturan</span>
          </button>
        )}
      </div>

      {/* Settings Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200">
        <button
          type="button"
          onClick={() => setActiveTab('general')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'general'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>Profil GOR & Operasional</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('payments')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'payments'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Rekening Bank & QRIS</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('templates')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'templates'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Template WhatsApp</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('security')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'security'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
          }`}
        >
          <Shield className="w-4 h-4 text-emerald-400" />
          <span>Security / Keamanan (Account)</span>
        </button>
      </div>

      {/* TAB 1: General Info */}
      {activeTab === 'general' && (
        <form onSubmit={handleSubmitSettings} className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
              <Building className="w-4 h-4 text-emerald-600" />
              <span>Identitas GOR & Kontak Operasional</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Nama GOR Badminton
                </label>
                <input
                  type="text"
                  required
                  value={formData.gorName}
                  onChange={(e) => handleChange('gorName', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Nomor WhatsApp Admin (Penerima Booking Publik)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    required
                    placeholder="6281234567890"
                    value={formData.adminWhatsApp}
                    onChange={(e) => handleChange('adminWhatsApp', e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Alamat Lengkap GOR
              </label>
              <div className="relative">
                <div className="absolute top-2.5 left-3 pointer-events-none text-slate-400">
                  <MapPin className="w-4 h-4" />
                </div>
                <textarea
                  rows={2}
                  required
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Link Google Maps Lokasi GOR
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <ExternalLink className="w-4 h-4" />
                </div>
                <input
                  type="url"
                  placeholder="https://maps.google.com/..."
                  value={formData.googleMapsUrl || ''}
                  onChange={(e) => handleChange('googleMapsUrl', e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Jam Buka Operasional
                </label>
                <input
                  type="text"
                  required
                  placeholder="08:00 - 22:00 WIB"
                  value={formData.operatingHours}
                  onChange={(e) => handleChange('operatingHours', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Biaya Sewa Lapangan Default (per jam)
                </label>
                <input
                  type="number"
                  step="5000"
                  min="0"
                  required
                  value={formData.hourlyRateDefault}
                  onChange={(e) => handleChange('hourlyRateDefault', Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-bold"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Profil</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: Payment Accounts */}
      {activeTab === 'payments' && (
        <form onSubmit={handleSubmitSettings} className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <CreditCard className="w-4 h-4 text-emerald-600" />
                <span>Daftar Rekening Bank & QRIS Manual</span>
              </div>
              <button
                type="button"
                onClick={handleAddBank}
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 px-3 py-1.5 rounded-lg border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 cursor-pointer transition-colors"
              >
                + Tambah Rekening
              </button>
            </div>

            <div className="space-y-3">
              {formData.bankAccounts.map((bank, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 flex flex-col md:flex-row items-start md:items-center gap-3"
                >
                  <div className="w-full md:w-36">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                      Bank / E-Wallet
                    </label>
                    <input
                      type="text"
                      placeholder="BCA / Mandiri / QRIS"
                      value={bank.bankName}
                      onChange={(e) => handleBankChange(idx, 'bankName', e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-bold bg-white"
                    />
                  </div>

                  <div className="w-full md:flex-1">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                      Nomor Rekening
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: 1234567890"
                      value={bank.accountNumber}
                      onChange={(e) => handleBankChange(idx, 'accountNumber', e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-mono font-bold bg-white"
                    />
                  </div>

                  <div className="w-full md:flex-1">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                      Atas Nama (Pemilik)
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: GOR Arena Badminton"
                      value={bank.accountHolder}
                      onChange={(e) => handleBankChange(idx, 'accountHolder', e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-medium bg-white"
                    />
                  </div>

                  <div className="pt-2 md:pt-4 self-end md:self-center">
                    <button
                      type="button"
                      onClick={() => handleRemoveBank(idx)}
                      disabled={formData.bankAccounts.length <= 1}
                      className="text-xs text-rose-600 hover:text-rose-700 font-bold px-2 py-1 rounded hover:bg-rose-50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Catatan Petunjuk Pembayaran Manual
              </label>
              <textarea
                rows={2}
                value={formData.paymentInstructions}
                onChange={(e) => handleChange('paymentInstructions', e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Rekening</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 3: WhatsApp Templates */}
      {activeTab === 'templates' && (
        <form onSubmit={handleSubmitSettings} className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              <span>Template Pesan WhatsApp Otomatis</span>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Template WhatsApp Customer (Ketika Booking di Web Publik)
                  </label>
                  <span className="text-[11px] text-slate-400">
                    Tag: [NAMA], [KODE], [LAPANGAN], [TANGGAL], [JAM], [TOTAL]
                  </span>
                </div>
                <textarea
                  rows={4}
                  value={formData.waTemplateCustomer}
                  onChange={(e) => handleChange('waTemplateCustomer', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Template Konfirmasi Admin (Kirim Notifikasi / Verifikasi)
                  </label>
                  <span className="text-[11px] text-slate-400">
                    Tag: [NAMA], [KODE], [LAPANGAN], [TANGGAL], [JAM], [STATUS], [SISA]
                  </span>
                </div>
                <textarea
                  rows={4}
                  value={formData.waTemplateConfirmation}
                  onChange={(e) => handleChange('waTemplateConfirmation', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Template</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 4: Security & Account (Requirement 3: Settings / Pengaturan → Security / Keamanan → Account) */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          {/* Breadcrumb path as requested */}
          <div className="bg-slate-100 px-4 py-2 rounded-xl text-xs font-bold text-slate-600 flex items-center gap-2">
            <span>Settings / Pengaturan</span>
            <span className="text-slate-400">&rarr;</span>
            <span className="text-emerald-700 font-extrabold">Security / Keamanan</span>
            <span className="text-slate-400">&rarr;</span>
            <span className="text-slate-900 bg-white px-2 py-0.5 rounded shadow-2xs font-extrabold">
              Account
            </span>
          </div>

          {/* Current Profile Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-base">
                {currentUser?.name?.charAt(0) || 'U'}
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 leading-tight">
                  {currentUser?.name || 'Pengguna Aktif'}
                </h3>
                <p className="text-xs text-slate-500">
                  Role Akses:{' '}
                  <strong className="text-emerald-700 uppercase">{currentUser?.role || 'OWNER'}</strong>{' '}
                  &bull; Email: {currentUser?.email}
                </p>
              </div>
            </div>

            <div className="hidden sm:block text-right">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Akun Aktif Terverifikasi</span>
              </span>
            </div>
          </div>

          {/* Form Keamanan Kredensial */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <KeyRound className="w-5 h-5 text-emerald-600" />
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">
                  Ubah Username & Kata Sandi Login
                </h3>
                <p className="text-xs text-slate-500">
                  Kredensial disimpan secara aman dan persistent. Setelah disimpan, login berikutnya wajib menggunakan kredensial baru.
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveSecurity} className="space-y-4 max-w-xl">
              {/* Username Field */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Username Login <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={accountUsername}
                    onChange={(e) => setAccountUsername(e.target.value)}
                    placeholder="Masukkan username baru"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm lowercase focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Username digunakan untuk masuk ke dashboard kasir & manajemen.
                </p>
              </div>

              {/* Password Baru Field */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Password Baru
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Masukkan password baru (minimal 6 karakter)"
                    className="w-full pl-10 pr-11 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-hidden cursor-pointer"
                    tabIndex={-1}
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Kosongkan jika Anda hanya ingin memperbarui username tanpa mengubah kata sandi.
                </p>
              </div>

              {/* Konfirmasi Password Field */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Konfirmasi Password Baru
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Ulangi password baru Anda"
                    disabled={!newPassword}
                    className="w-full pl-10 pr-11 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden disabled:bg-slate-100 disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-hidden cursor-pointer"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-3 border-t border-slate-100 flex items-center gap-3">
                <button
                  type="submit"
                  disabled={isSavingSecurity}
                  className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold uppercase tracking-wider transition-all shadow-md shadow-emerald-600/20 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSavingSecurity ? 'Menyimpan...' : 'Simpan Perubahan Keamanan'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

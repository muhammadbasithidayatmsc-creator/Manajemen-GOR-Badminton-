import React, { useState } from 'react';
import { Lock, User as UserIcon, ArrowRight, Eye, EyeOff, Shield, Sparkles } from 'lucide-react';
import { Modal } from '../common/Modal';
import { User } from '../../types';
import { store } from '../../services/store';
import { useToast } from '../../context/ToastContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const { success, error } = useToast();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!identifier.trim()) {
      error('Input Diperlukan', 'Silakan masukkan username atau email Anda.');
      return;
    }

    if (!password.trim()) {
      error('Input Diperlukan', 'Silakan masukkan kata sandi Anda.');
      return;
    }

    setIsLoading(true);

    const authResult = store.authenticate(identifier, password);

    setIsLoading(false);

    if (authResult.success && authResult.user) {
      success(
        'Login Berhasil',
        `Selamat datang kembali, ${authResult.user.name} (${authResult.user.role.toUpperCase()})`
      );
      setIdentifier('');
      setPassword('');
      onLoginSuccess(authResult.user);
      onClose();
    } else {
      error('Login Gagal', authResult.error || 'Username atau kata sandi tidak valid.');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Portal Masuk Manajemen"
      subtitle="Akses resmi staf operasional dan pemilik GOR"
      maxWidth="sm"
    >
      <div className="space-y-6">
        {/* Visual Luxury Banner Header */}
        <div className="relative rounded-2xl overflow-hidden p-4 bg-gradient-to-br from-blue-950/70 via-slate-900 to-slate-950 border border-white/10 flex items-center gap-3.5 shadow-inner">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/30 shrink-0">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-sm font-black text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
              <span>Sistem Manajemen Terpadu</span>
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              Masukkan kredensial akun terdaftar Anda untuk melanjutkan.
            </div>
          </div>
        </div>

        {/* Form: Username, Password, Login (No default credentials shown) */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Username / Email <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <UserIcon className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                autoFocus
                autoComplete="username"
                placeholder="Masukkan username atau email"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-slate-900 placeholder:text-slate-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Kata Sandi <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                placeholder="Masukkan kata sandi"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-11 py-3 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-slate-900 placeholder:text-slate-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-hidden cursor-pointer"
                tabIndex={-1}
                aria-label={showPassword ? 'Sembunyikan sandi' : 'Tampilkan sandi'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 hover:from-blue-500 hover:via-indigo-500 hover:to-blue-500 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-blue-600/30 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>{isLoading ? 'Memverifikasi...' : 'Masuk ke Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

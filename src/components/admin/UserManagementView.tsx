import React, { useState } from 'react';
import {
  Users,
  Plus,
  Edit2,
  Trash2,
  Power,
  Shield,
  ShieldCheck,
  Eye,
  EyeOff,
  Lock,
} from 'lucide-react';
import { User, UserRole } from '../../types';
import { Modal } from '../common/Modal';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { useToast } from '../../context/ToastContext';

interface UserManagementViewProps {
  users: User[];
  currentUser: User | null;
  onAddUser: (userData: Omit<User, 'id'>) => void;
  onUpdateUser: (id: string, updates: Partial<User>) => void;
  onDeleteUser: (id: string) => void;
}

export const UserManagementView: React.FC<UserManagementViewProps> = ({
  users,
  currentUser,
  onAddUser,
  onUpdateUser,
  onDeleteUser,
}) => {
  const { success, error } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState<UserRole>('ADMIN');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [active, setActive] = useState(true);

  // Delete target
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const handleOpenAdd = () => {
    setUserToEdit(null);
    setName('');
    setUsername('');
    setRole('ADMIN');
    setPassword('');
    setShowPassword(false);
    setActive(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user: User) => {
    setUserToEdit(user);
    setName(user.name);
    setUsername(user.username || '');
    setRole(user.role);
    setPassword('');
    setShowPassword(false);
    setActive(user.active);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !username.trim()) {
      error('Data Belum Lengkap', 'Nama dan username wajib diisi.');
      return;
    }

    if (!userToEdit && !password.trim()) {
      error('Password Wajib Diisi', 'Silakan tentukan kata sandi untuk akun staf baru.');
      return;
    }

    if (password.trim() && password.trim().length < 6) {
      error('Password Terlalu Pendek', 'Password minimal terdiri dari 6 karakter.');
      return;
    }

    if (userToEdit) {
      const updates: Partial<User> = {
        name: name.trim(),
        username: username.trim().toLowerCase(),
        role,
        active,
      };
      if (password.trim()) {
        updates.password = password.trim();
      }
      onUpdateUser(userToEdit.id, updates);
      success('User Diperbarui', `Akun ${name} berhasil disimpan.`);
    } else {
      onAddUser({
        name: name.trim(),
        username: username.trim().toLowerCase(),
        email: `${username.trim().toLowerCase()}@gorarena.com`,
        role,
        password: password.trim(),
        active,
      });
      success('User Ditambahkan', `Akun ${name} (${role}) berhasil dibuat.`);
    }

    setIsModalOpen(false);
  };

  const handleToggleActive = (user: User) => {
    if (user.id === currentUser?.id) {
      error('Aksi Tidak Diizinkan', 'Anda tidak dapat menonaktifkan akun Anda sendiri.');
      return;
    }
    onUpdateUser(user.id, { active: !user.active });
    success('Status Diubah', `Akun ${user.name} ${!user.active ? 'diaktifkan' : 'dinonaktifkan'}.`);
  };

  return (
    <div className="space-y-6 p-4 sm:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-tight">
            Manajemen Akun Admin & Staf
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Khusus OWNER: Tambah, edit, dan kelola hak akses staf kasir operasional
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Akun Baru</span>
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <th className="py-3.5 px-4">Nama Staf</th>
                <th className="py-3.5 px-4">Username Login</th>
                <th className="py-3.5 px-4">Role Akses</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-slate-900 text-white font-bold flex items-center justify-center text-xs">
                        {u.name.charAt(0)}
                      </div>
                      <span>{u.name}</span>
                      {u.id === currentUser?.id && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-extrabold">
                          (Anda)
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-medium text-slate-800">
                    {u.username}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase ${
                        u.role === 'OWNER'
                          ? 'bg-amber-100 text-amber-900 border border-amber-200'
                          : 'bg-blue-100 text-blue-900 border border-blue-200'
                      }`}
                    >
                      {u.role === 'OWNER' ? (
                        <ShieldCheck className="w-3 h-3 text-amber-700" />
                      ) : (
                        <Shield className="w-3 h-3 text-blue-700" />
                      )}
                      <span>{u.role}</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        u.active
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {u.active ? 'AKTIF' : 'NONAKTIF'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleToggleActive(u)}
                        disabled={u.id === currentUser?.id}
                        title={u.active ? 'Nonaktifkan Akun' : 'Aktifkan Akun'}
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <Power className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleOpenEdit(u)}
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50"
                        title="Edit Akun"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteTargetId(u.id)}
                        disabled={u.id === currentUser?.id || u.role === 'OWNER'}
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-rose-700 hover:bg-rose-50 disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Hapus Akun"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add / Edit User */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={userToEdit ? 'Edit Akun Staf' : 'Tambah Akun Baru'}
        maxWidth="sm"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Nama Lengkap <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Rian Ardianto"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Username Login <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="rian_admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm lowercase focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Role Akses
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-bold"
              >
                <option value="ADMIN">ADMIN (Operasional)</option>
                <option value="OWNER">OWNER (Full Akses)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                {userToEdit ? 'Password Baru (Opsional)' : 'Password'}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={userToEdit ? 'Biarkan kosong jika tetap' : 'Min. 6 karakter'}
                  className="w-full pl-3 pr-9 py-2 rounded-xl border border-slate-300 text-sm font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-hidden cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded-md focus:ring-emerald-500"
              />
              <span>Akun Aktif (Dapat Login ke Sistem)</span>
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-600"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider"
            >
              Simpan Akun
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deleteTargetId)}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={() => {
          if (deleteTargetId) onDeleteUser(deleteTargetId);
        }}
        title="Hapus Akun Pengguna"
        message="Apakah Anda yakin ingin menghapus akun ini dari sistem?"
        confirmLabel="Ya, Hapus"
        isDanger={true}
      />
    </div>
  );
};

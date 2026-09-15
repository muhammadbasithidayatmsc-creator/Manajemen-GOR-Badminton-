import React from 'react';
import {
  LayoutDashboard,
  CalendarDays,
  CalendarCheck,
  Users,
  Receipt,
  FileBarChart2,
  Grid,
  Clock,
  Settings,
  UserCog,
  LogOut,
  ExternalLink,
  Activity,
  X,
  Shield,
} from 'lucide-react';
import { BusinessSettings, User } from '../../types';

export type AdminView =
  | 'dashboard'
  | 'jadwal'
  | 'booking'
  | 'customer'
  | 'transaksi'
  | 'laporan'
  | 'lapangan'
  | 'sesi-jam'
  | 'pengaturan'
  | 'manajemen-admin';

interface AdminSidebarProps {
  currentView: AdminView;
  onSelectView: (view: AdminView) => void;
  currentUser: User;
  settings: BusinessSettings;
  onLogout: () => void;
  onSwitchToPublic: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentView,
  onSelectView,
  currentUser,
  settings,
  onLogout,
  onSwitchToPublic,
  isOpenMobile,
  onCloseMobile,
}) => {
  const isOwner = currentUser.role === 'owner';

  // Navigation Items
  const navItems: {
    id: AdminView;
    label: string;
    icon: React.ElementType;
    ownerOnly?: boolean;
    badge?: string;
  }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'jadwal', label: 'Jadwal Lapangan', icon: CalendarDays },
    { id: 'booking', label: 'Booking', icon: CalendarCheck },
    { id: 'customer', label: 'Customer', icon: Users },
    { id: 'transaksi', label: 'Transaksi', icon: Receipt },
    // Owner Only Menus
    { id: 'laporan', label: 'Laporan', icon: FileBarChart2, ownerOnly: true },
    { id: 'lapangan', label: 'Data Lapangan', icon: Grid, ownerOnly: true },
    { id: 'sesi-jam', label: 'Sesi Jam', icon: Clock, ownerOnly: true },
    { id: 'pengaturan', label: 'Pengaturan', icon: Settings, ownerOnly: true },
    { id: 'manajemen-admin', label: 'Manajemen Admin', icon: UserCog, ownerOnly: true },
  ];

  const filteredNavItems = navItems.filter((item) => !item.ownerOnly || isOwner);

  const handleNavClick = (view: AdminView) => {
    onSelectView(view);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-900 text-white flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-18 px-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black shadow-md shadow-emerald-500/20">
              <Activity className="w-5 h-5" />
            </div>
            <div className="overflow-hidden">
              <h2 className="text-sm font-black tracking-tight text-white uppercase truncate">
                {settings.name}
              </h2>
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                Panel Manajemen
              </span>
            </div>
          </div>

          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Card */}
        <div className="p-4 mx-3 mt-3 rounded-2xl bg-slate-800/80 border border-slate-700/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white font-bold text-sm flex items-center justify-center shadow-xs">
              {currentUser.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">{currentUser.name}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span
                  className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider ${
                    isOwner
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                  }`}
                >
                  {currentUser.role}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
            Operasional
          </div>

          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span className="flex-1 text-left">{item.label}</span>
                {item.ownerOnly && (
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-emerald-400 border border-slate-700">
                    OWNER
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer Actions: Switch to Public & Logout */}
        <div className="p-3 border-t border-slate-800 space-y-2">
          <button
            onClick={onSwitchToPublic}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Lihat Halaman Publik</span>
          </button>

          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold text-rose-300 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-900/50 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar (Logout)</span>
          </button>
        </div>
      </aside>
    </>
  );
};

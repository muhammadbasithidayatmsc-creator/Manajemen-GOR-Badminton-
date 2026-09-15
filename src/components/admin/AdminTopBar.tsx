import React from 'react';
import { Menu, Plus, RefreshCw, Calendar, Shield } from 'lucide-react';
import { User } from '../../types';
import { getTodayString } from '../../services/store';

interface AdminTopBarProps {
  title: string;
  subtitle?: string;
  currentUser: User;
  onOpenMobileMenu: () => void;
  onQuickNewBooking: () => void;
  onResetDemoData: () => void;
}

export const AdminTopBar: React.FC<AdminTopBarProps> = ({
  title,
  subtitle,
  currentUser,
  onOpenMobileMenu,
  onQuickNewBooking,
  onResetDemoData,
}) => {
  const today = new Date();
  const dateFormatted = today.toLocaleDateString('id-ID', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <header className="h-18 bg-white border-b border-slate-200 sticky top-0 z-30 px-4 sm:px-8 flex items-center justify-between shadow-xs">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs text-slate-500 hidden sm:block mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {/* Date Display */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-xs font-semibold text-slate-600 border border-slate-200">
          <Calendar className="w-3.5 h-3.5 text-slate-500" />
          <span>{dateFormatted}</span>
        </div>

        {/* Reset Demo Data Button */}
        <button
          onClick={onResetDemoData}
          title="Kembalikan data demo awal"
          className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-slate-200 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
        </button>

        {/* Quick New Booking Button */}
        <button
          onClick={onQuickNewBooking}
          className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider shadow-sm shadow-emerald-600/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Booking Baru</span>
          <span className="sm:hidden">Baru</span>
        </button>
      </div>
    </header>
  );
};

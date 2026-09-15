import React from 'react';
import { BookingStatus, CourtStatus, PaymentStatus } from '../../types';

export const BookingStatusBadge: React.FC<{ status: BookingStatus; size?: 'sm' | 'md' }> = ({
  status,
  size = 'md',
}) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  switch (status) {
    case 'PENDING':
      return (
        <span
          className={`inline-flex items-center font-semibold rounded-full bg-amber-100 text-amber-800 border border-amber-300 ${sizeClasses}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5 animate-pulse"></span>
          PENDING
        </span>
      );
    case 'CONFIRMED':
      return (
        <span
          className={`inline-flex items-center font-semibold rounded-full bg-blue-100 text-blue-800 border border-blue-300 ${sizeClasses}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mr-1.5"></span>
          CONFIRMED
        </span>
      );
    case 'COMPLETED':
      return (
        <span
          className={`inline-flex items-center font-semibold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 ${sizeClasses}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mr-1.5"></span>
          COMPLETED
        </span>
      );
    case 'CANCELLED':
      return (
        <span
          className={`inline-flex items-center font-semibold rounded-full bg-rose-100 text-rose-800 border border-rose-300 ${sizeClasses}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mr-1.5"></span>
          CANCELLED
        </span>
      );
    default:
      return (
        <span className={`inline-flex items-center font-semibold rounded-full bg-slate-100 text-slate-800 ${sizeClasses}`}>
          {status}
        </span>
      );
  }
};

export const PaymentStatusBadge: React.FC<{ status: PaymentStatus; size?: 'sm' | 'md' }> = ({
  status,
  size = 'md',
}) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  switch (status) {
    case 'LUNAS':
      return (
        <span
          className={`inline-flex items-center font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-300 ${sizeClasses}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>
          LUNAS
        </span>
      );
    case 'DP':
      return (
        <span
          className={`inline-flex items-center font-semibold rounded-full bg-amber-50 text-amber-700 border border-amber-300 ${sizeClasses}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5"></span>
          DP
        </span>
      );
    case 'BELUM BAYAR':
    default:
      return (
        <span
          className={`inline-flex items-center font-semibold rounded-full bg-rose-50 text-rose-700 border border-rose-300 ${sizeClasses}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mr-1.5"></span>
          BELUM BAYAR
        </span>
      );
  }
};

export const CourtStatusBadge: React.FC<{ status: CourtStatus }> = ({ status }) => {
  switch (status) {
    case 'ACTIVE':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
          ACTIVE
        </span>
      );
    case 'MAINTENANCE':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
          MAINTENANCE
        </span>
      );
    case 'INACTIVE':
    default:
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
          INACTIVE
        </span>
      );
  }
};

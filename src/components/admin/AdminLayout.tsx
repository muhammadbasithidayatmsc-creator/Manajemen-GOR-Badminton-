import React, { useState, useEffect, useMemo } from 'react';
import {
  Booking,
  BookingStatus,
  BusinessSettings,
  Court,
  Customer,
  MonthlyBookingGroup,
  PaymentStatus,
  TimeSlot,
  Transaction,
  User,
} from '../../types';
import { store } from '../../services/store';
import { AdminSidebar, AdminView } from './AdminSidebar';
import { AdminTopBar } from './AdminTopBar';
import { DashboardView } from './DashboardView';
import { ScheduleGridView } from './ScheduleGridView';
import { BookingListView } from './BookingListView';
import { CustomerListView } from './CustomerListView';
import { TransactionListView } from './TransactionListView';
import { ReportView } from './ReportView';
import { CourtManagementView } from './CourtManagementView';
import { TimeSlotManagementView } from './TimeSlotManagementView';
import { GorSettingsView } from './GorSettingsView';
import { UserManagementView } from './UserManagementView';
import { BookingModal } from './BookingModal';
import { useToast } from '../../context/ToastContext';

interface AdminLayoutProps {
  currentUser: User;
  onLogout: () => void;
  onSwitchToPublic: () => void;
  onUserUpdated?: (user: User) => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentUser,
  onLogout,
  onSwitchToPublic,
  onUserUpdated,
}) => {
  const { success, error } = useToast();

  const [activeView, setActiveView] = useState<AdminView>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // App data state synced with store
  const [settings, setSettings] = useState<BusinessSettings>(() => store.getSettings());
  const [courts, setCourts] = useState<Court[]>(() => store.getCourts());
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>(() => store.getTimeSlots());
  const [bookings, setBookings] = useState<Booking[]>(() => store.getBookings());
  const [monthlyBookings, setMonthlyBookings] = useState<MonthlyBookingGroup[]>(() => store.getMonthlyBookings());
  const [customers, setCustomers] = useState<Customer[]>(() => store.getCustomers());
  const [transactions, setTransactions] = useState<Transaction[]>(() => store.getTransactions());
  const [users, setUsers] = useState<User[]>(() => store.getUsers());

  // Function to reload all state from store
  const reloadData = () => {
    setSettings(store.getSettings());
    setCourts(store.getCourts());
    setTimeSlots(store.getTimeSlots());
    setBookings(store.getBookings());
    setMonthlyBookings(store.getMonthlyBookings());
    setCustomers(store.getCustomers());
    setTransactions(store.getTransactions());
    setUsers(store.getUsers());
  };

  // Synchronize on store events
  useEffect(() => {
    const handleDataChanged = () => {
      reloadData();
      const updatedCurrent = store.getCurrentUser();
      if (updatedCurrent && onUserUpdated) {
        onUserUpdated(updatedCurrent);
      }
    };
    window.addEventListener('gor_data_changed', handleDataChanged);
    return () => {
      window.removeEventListener('gor_data_changed', handleDataChanged);
    };
  }, [onUserUpdated]);

  // Booking Modal State
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingToEdit, setBookingToEdit] = useState<Booking | null>(null);
  const [bookingDefaultDate, setBookingDefaultDate] = useState<string | undefined>(undefined);
  const [bookingDefaultCourtId, setBookingDefaultCourtId] = useState<string | undefined>(undefined);
  const [bookingDefaultSlotId, setBookingDefaultSlotId] = useState<string | undefined>(undefined);

  // Open booking modal helper
  const handleOpenNewBooking = (date?: string, courtId?: string, slotId?: string) => {
    setBookingToEdit(null);
    setBookingDefaultDate(date);
    setBookingDefaultCourtId(courtId);
    setBookingDefaultSlotId(slotId);
    setIsBookingModalOpen(true);
  };

  const handleOpenEditBooking = (booking: Booking) => {
    setBookingToEdit(booking);
    setBookingDefaultDate(booking.date);
    setBookingDefaultCourtId(booking.courtId);
    setBookingDefaultSlotId(booking.timeSlotId);
    setIsBookingModalOpen(true);
  };

  // Handle Slot Click from Schedule Grid
  const handleSlotClick = (court: Court, slot: TimeSlot, existingBooking?: Booking) => {
    if (existingBooking) {
      handleOpenEditBooking(existingBooking);
    } else {
      handleOpenNewBooking(undefined, court.id, slot.id);
    }
  };

  // Delete Booking
  const handleDeleteBooking = (bookingId: string) => {
    const ok = store.deleteBooking(bookingId);
    if (ok) {
      success('Booking Dihapus', 'Data booking telah berhasil dihapus dari sistem.');
      reloadData();
    } else {
      error('Gagal Menghapus', 'Booking tidak ditemukan.');
    }
  };

  // Quick Status Update
  const handleQuickUpdateStatus = (booking: Booking, status: BookingStatus) => {
    const res = store.updateBooking(booking.id, { bookingStatus: status });
    if (res.success) {
      success('Status Diperbarui', `Booking diubah ke status ${status}`);
      reloadData();
    }
  };

  // Monthly Booking Operations
  const handleDeleteMonthlyBooking = (groupId: string, deleteRelated = true) => {
    const ok = store.deleteMonthlyBooking(groupId, deleteRelated);
    if (ok) {
      success('Booking Bulanan Dihapus', 'Data booking bulanan dan seluruh sesinya berhasil dihapus.');
      reloadData();
    } else {
      error('Gagal Menghapus', 'Data booking bulanan tidak ditemukan.');
    }
  };

  const handleUpdateMonthlyStatus = (
    groupId: string,
    updates: { bookingStatus?: BookingStatus; paymentStatus?: PaymentStatus }
  ) => {
    const res = store.updateMonthlyBookingStatus(groupId, updates);
    if (res.success) {
      success('Status Diperbarui', 'Status booking bulanan berhasil diperbarui.');
      reloadData();
    } else {
      error('Gagal Memperbarui', res.error || 'Terjadi kendala saat update status.');
    }
  };

  // Reset Demo Data
  const handleResetDemoData = () => {
    store.resetAllData();
    reloadData();
    success('Data Direset', 'Semua data operasional dan simulasi booking telah dikembalikan ke awal.');
  };

  // Court Operations
  const handleAddCourt = (courtData: Omit<Court, 'id'>) => {
    store.addCourt(courtData);
    reloadData();
  };

  const handleUpdateCourt = (id: string, updates: Partial<Court>) => {
    store.updateCourt(id, updates);
    reloadData();
  };

  const handleDeleteCourt = (id: string) => {
    store.deleteCourt(id);
    reloadData();
    success('Lapangan Dihapus', 'Data lapangan telah dihapus.');
  };

  // Time Slot Operations
  const handleAddTimeSlot = (slotData: Omit<TimeSlot, 'id'>) => {
    store.addTimeSlot(slotData);
    reloadData();
  };

  const handleUpdateTimeSlot = (id: string, updates: Partial<TimeSlot>) => {
    store.updateTimeSlot(id, updates);
    reloadData();
  };

  const handleDeleteTimeSlot = (id: string) => {
    store.deleteTimeSlot(id);
    reloadData();
    success('Sesi Jam Dihapus', 'Sesi jam telah dihapus.');
  };

  // Customer Operations
  const handleSaveCustomer = (custData: Partial<Customer>) => {
    if (custData.id) {
      store.updateCustomer(custData.id, custData);
      success('Customer Diperbarui', 'Data customer berhasil disimpan.');
    } else if (custData.name && custData.phone) {
      store.findOrCreateCustomer(custData.name, custData.phone, custData.notes);
      success('Customer Dibuat', 'Customer baru berhasil ditambahkan.');
    }
    reloadData();
  };

  const handleDeleteCustomer = (id: string) => {
    store.deleteCustomer(id);
    reloadData();
    success('Customer Dihapus', 'Data customer berhasil dihapus.');
  };

  // Manual Transaction
  const handleAddManualTransaction = (
    trxData: Omit<Transaction, 'id' | 'transactionNumber' | 'createdAt'>
  ) => {
    store.addManualTransaction(trxData);
    reloadData();
    success('Transaksi Dicatat', 'Pembayaran manual berhasil dibukukan.');
  };

  // Settings Save
  const handleSaveSettings = (newSettings: BusinessSettings) => {
    store.updateSettings(newSettings);
    reloadData();
  };

  // User Management
  const handleAddUser = (userData: Omit<User, 'id'>) => {
    const currentUsers = store.getUsers();
    const newUser: User = {
      ...userData,
      id: `user-${Date.now()}`,
    };
    store.saveUsers([...currentUsers, newUser]);
    reloadData();
  };

  const handleUpdateUser = (id: string, updates: Partial<User>) => {
    const currentUsers = store.getUsers();
    const updated = currentUsers.map((u) => (u.id === id ? { ...u, ...updates } : u));
    store.saveUsers(updated);
    if (currentUser.id === id) {
      const activeUpdated = { ...currentUser, ...updates };
      store.setCurrentUser(activeUpdated);
      onUserUpdated?.(activeUpdated);
    }
    reloadData();
  };

  const handleDeleteUser = (id: string) => {
    const currentUsers = store.getUsers();
    store.saveUsers(currentUsers.filter((u) => u.id !== id));
    reloadData();
    success('Akun Dihapus', 'Akun telah dihapus dari sistem.');
  };

  // View Titles
  const viewMeta: Record<AdminView, { title: string; subtitle: string }> = {
    dashboard: {
      title: 'Dashboard Operasional',
      subtitle: 'Ringkasan performa hari ini, okupansi lapangan, dan tindakan cepat',
    },
    jadwal: {
      title: 'Matriks Jadwal Lapangan',
      subtitle: 'Pantau ketersediaan slot realtime dan anti double booking',
    },
    booking: {
      title: 'Manajemen Booking',
      subtitle: 'Daftar semua reservasi, status verifikasi, dan pembayaran',
    },
    customer: {
      title: 'Database Customer',
      subtitle: 'Data pelanggan, riwayat booking, dan total transaksi',
    },
    transaksi: {
      title: 'Pencatatan Transaksi Manual',
      subtitle: 'Log kas masuk, transfer bank, QRIS, dan pencetakan struk',
    },
    laporan: {
      title: 'Laporan Pendapatan & Kinerja',
      subtitle: 'Analisis omzet, jam paling ramai, dan export data CSV / PDF',
    },
    lapangan: {
      title: 'Manajemen Lapangan',
      subtitle: 'Pengaturan court, karpet vinyl BWF, dan status maintenance',
    },
    'sesi-jam': {
      title: 'Pengaturan Sesi Jam',
      subtitle: 'Kelola jam buka, slot operasional, dan sesi aktif',
    },
    pengaturan: {
      title: 'Pengaturan Bisnis GOR',
      subtitle: 'Identitas GOR, rekening manual, dan template pesan WhatsApp',
    },
    'manajemen-admin': {
      title: 'Manajemen Akun Admin',
      subtitle: 'Kelola hak akses owner dan staf operasional kasir',
    },
  };

  const currentMeta = viewMeta[activeView] || {
    title: 'Admin Panel',
    subtitle: 'Sistem Manajemen Rental Lapangan GOR Badminton',
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Sidebar Navigation */}
      <AdminSidebar
        currentView={activeView}
        onSelectView={(v) => setActiveView(v)}
        currentUser={currentUser}
        settings={settings}
        onLogout={onLogout}
        onSwitchToPublic={onSwitchToPublic}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="lg:pl-64 flex flex-col flex-1 min-w-0">
        {/* Top Header Bar */}
        <AdminTopBar
          title={currentMeta.title}
          subtitle={currentMeta.subtitle}
          currentUser={currentUser}
          onOpenMobileMenu={() => setIsMobileSidebarOpen(true)}
          onQuickNewBooking={() => handleOpenNewBooking()}
          onResetDemoData={handleResetDemoData}
        />

        {/* View Switcher */}
        <main className="flex-1 pb-16">
          {activeView === 'dashboard' && (
            <DashboardView
              courts={courts}
              timeSlots={timeSlots}
              bookings={bookings}
              transactions={transactions}
              customers={customers}
              settings={settings}
              currentUser={currentUser}
              onNavigate={(view) => setActiveView(view as AdminView)}
              onOpenBookingModal={(b) => {
                if (b) handleOpenEditBooking(b);
                else handleOpenNewBooking();
              }}
            />
          )}

          {activeView === 'jadwal' && (
            <ScheduleGridView
              courts={courts}
              timeSlots={timeSlots}
              bookings={bookings}
              onSlotClick={handleSlotClick}
              onNewBookingClick={(date) => handleOpenNewBooking(date)}
            />
          )}

          {activeView === 'booking' && (
            <BookingListView
              bookings={bookings}
              monthlyBookings={monthlyBookings}
              courts={courts}
              settings={settings}
              onOpenBookingModal={(b) => {
                if (b) handleOpenEditBooking(b);
                else handleOpenNewBooking();
              }}
              onDeleteBooking={handleDeleteBooking}
              onQuickUpdateStatus={handleQuickUpdateStatus}
              onDeleteMonthlyBooking={handleDeleteMonthlyBooking}
              onUpdateMonthlyStatus={handleUpdateMonthlyStatus}
            />
          )}

          {activeView === 'customer' && (
            <CustomerListView
              customers={customers}
              bookings={bookings}
              transactions={transactions}
              onSaveCustomer={handleSaveCustomer}
              onDeleteCustomer={handleDeleteCustomer}
            />
          )}

          {activeView === 'transaksi' && (
            <TransactionListView
              transactions={transactions}
              onAddManualTransaction={handleAddManualTransaction}
            />
          )}

          {activeView === 'laporan' && (
            <ReportView
              bookings={bookings}
              transactions={transactions}
              courts={courts}
              timeSlots={timeSlots}
              customers={customers}
            />
          )}

          {activeView === 'lapangan' && (
            <CourtManagementView
              courts={courts}
              onAddCourt={handleAddCourt}
              onUpdateCourt={handleUpdateCourt}
              onDeleteCourt={handleDeleteCourt}
            />
          )}

          {activeView === 'sesi-jam' && (
            <TimeSlotManagementView
              timeSlots={timeSlots}
              onAddTimeSlot={handleAddTimeSlot}
              onUpdateTimeSlot={handleUpdateTimeSlot}
              onDeleteTimeSlot={handleDeleteTimeSlot}
            />
          )}

          {activeView === 'pengaturan' && (
            <GorSettingsView
              settings={settings}
              currentUser={currentUser}
              onSaveSettings={handleSaveSettings}
              onReloadData={reloadData}
              onNavigate={(view) => setActiveView(view as AdminView)}
            />
          )}

          {activeView === 'manajemen-admin' && (
            <UserManagementView
              users={users}
              currentUser={currentUser}
              onAddUser={handleAddUser}
              onUpdateUser={handleUpdateUser}
              onDeleteUser={handleDeleteUser}
            />
          )}
        </main>
      </div>

      {/* Global Booking Modal (Strict Anti Double Booking) */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        bookingToEdit={bookingToEdit}
        defaultDate={bookingDefaultDate}
        defaultCourtId={bookingDefaultCourtId}
        defaultSlotId={bookingDefaultSlotId}
        courts={courts}
        timeSlots={timeSlots}
        onSaved={reloadData}
      />
    </div>
  );
};

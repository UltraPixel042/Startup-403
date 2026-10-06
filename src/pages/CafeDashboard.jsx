import { useState } from 'react';
import { useStore } from '../context/StoreContext';
import SEOHead from '../components/SEOHead';
import Toast from '../components/Toast';

export default function CafeDashboard() {
  const {
    seats,
    reservations,
    orders,
    toggleSeatStatus,
    checkInReservation,
    checkoutReservation,
    cancelReservation,
  } = useStore();
  const [toast, setToast] = useState(null);
  const [activeTab, setActiveTab] = useState('seats');

  const todayReservations = reservations.filter(r => r.status !== 'cancelled' && r.status !== 'completed');
  const activeOrders = orders.filter(o => o.status !== 'completed' && o.status !== 'cancelled');

  const stats = {
    totalSeats: seats.length,
    available: seats.filter(s => s.status === 'available').length,
    occupied: seats.filter(s => s.status === 'occupied').length,
    closed: seats.filter(s => s.status === 'closed').length,
    totalReservations: todayReservations.length,
    pendingOrders: activeOrders.length,
  };

  const handleToggleSeat = (seatId) => {
    toggleSeatStatus(seatId);
    setToast({ message: `เปลี่ยนสถานะที่นั่ง ${seatId} เรียบร้อย`, type: 'info' });
  };

  const handleCheckIn = (resId) => {
    checkInReservation(resId);
    setToast({ message: 'ลูกค้าเช็คอินสำเร็จ!', type: 'success' });
  };

  const handleCheckout = (resId) => {
    checkoutReservation(resId);
    setToast({ message: 'เช็คเอาท์ลูกค้าสำเร็จ!', type: 'success' });
  };

  const handleCancel = (resId) => {
    cancelReservation(resId);
    setToast({ message: 'ยกเลิกการจองแล้ว', type: 'warning' });
  };

  return (
    <>
      <SEOHead
        title="Cafe Dashboard | จัดการร้าน"
        description="ระบบจัดการคาเฟ่สำหรับพนักงาน จัดการที่นั่ง ดูการจอง เช็คอิน/เช็คเอาท์ลูกค้า และดูออเดอร์ทั้งหมดในที่เดียว"
        path="/cafe"
      />

      <main className="pt-20 min-h-screen px-4 sm:px-6 lg:px-8 pb-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <header className="mb-8 pt-6">
            <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
              Cafe <span className="gradient-text">Dashboard</span>
            </h1>
            <p className="text-slate-400">จัดการที่นั่ง, การจอง และออเดอร์ในที่เดียว</p>
          </header>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="card text-center p-4">
              <div className="text-3xl font-bold text-primary-light">{stats.totalSeats}</div>
              <div className="text-xs text-slate-400 mt-1">ที่นั่งทั้งหมด</div>
            </div>
            <div className="card text-center p-4">
              <div className="text-3xl font-bold text-emerald-400">{stats.available}</div>
              <div className="text-xs text-slate-400 mt-1">ว่าง</div>
            </div>
            <div className="card text-center p-4">
              <div className="text-3xl font-bold text-cyan-400">{stats.totalReservations}</div>
              <div className="text-xs text-slate-400 mt-1">การจอง (Active)</div>
            </div>
            <div className="card text-center p-4">
              <div className="text-3xl font-bold text-amber-400">{stats.pendingOrders}</div>
              <div className="text-xs text-slate-400 mt-1">ออเดอร์ที่รอดำเนินการ</div>
            </div>
          </div>

          {/* Tab Navigation */}
          <nav className="flex gap-1 mb-6 p-1 rounded-xl bg-white/5" role="tablist" aria-label="Dashboard sections">
            {[
              { id: 'seats', label: '🪑 จัดการที่นั่ง (Seats)', ariaLabel: 'Seat Management' },
              { id: 'reservations', label: '📋 การจอง (Reservations)', ariaLabel: 'Reservations' },
            ].map((tab) => (
              <button
                key={tab.id}
                role="tab"
                aria-selected={activeTab === tab.id}
                className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all border-none cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-primary/20 text-primary-light'
                    : 'bg-transparent text-slate-400 hover:text-white'
                }`}
                onClick={() => setActiveTab(tab.id)}
                aria-label={tab.ariaLabel}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Seats Tab */}
          {activeTab === 'seats' && (
            <section aria-labelledby="seat-mgmt-heading" className="animate-fade-in">
              <div className="card">
                <h2 id="seat-mgmt-heading" className="text-xl font-semibold mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                  ผังที่นั่งร้าน
                </h2>
                <p className="text-sm text-slate-400 mb-6">
                  คลิกที่นั่งเพื่อสลับสถานะระหว่าง <strong className="text-emerald-400">เปิด (Open)</strong> และ <strong className="text-slate-400">ปิด (Closed)</strong>
                  <br />ที่นั่งที่มีลูกค้าจองหรือนั่งอยู่จะไม่สามารถเปลี่ยนสถานะได้
                </p>

                <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-4 justify-items-center">
                  {seats.map((seat) => {
                    const statusClass = seat.status;
                    return (
                      <button
                        key={seat.id}
                        className={`seat ${statusClass}`}
                        onClick={() => handleToggleSeat(seat.id)}
                        disabled={seat.status === 'occupied'}
                        aria-label={`ที่นั่ง ${seat.id}, สถานะ ${seat.status}. ${seat.status !== 'occupied' ? 'คลิกเพื่อเปลี่ยนสถานะ' : 'ไม่สามารถเปลี่ยนได้'}${seat.hasPower ? '. มีปลั๊กไฟ' : ''}`}
                      >
                        {seat.id}
                        {seat.hasPower && (
                          <span className="power-badge" aria-hidden="true">⚡</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </section>
          )}

          {/* Reservations Tab */}
          {activeTab === 'reservations' && (
            <section aria-labelledby="reservations-heading" className="animate-fade-in">
              <h2 id="reservations-heading" className="text-xl font-semibold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
                การจองวันนี้
              </h2>

              {todayReservations.length === 0 ? (
                <div className="card text-center py-12">
                  <div className="text-4xl mb-3" aria-hidden="true">📭</div>
                  <p className="text-slate-400">ยังไม่มีการจองในขณะนี้</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {todayReservations.map((res) => (
                    <article key={res.id} className="card">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center font-bold text-primary-light text-sm">
                            {res.seatId}
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-slate-200">
                              {res.customerName}
                            </div>
                            <div className="text-sm font-medium text-amber-300 mt-1">
                              เวลา: {res.checkInTime} - {res.checkOutTime}
                            </div>
                            <div className="text-xs text-slate-500 mt-0.5">
                              ID: {res.id}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`badge ${
                              res.status === 'confirmed'
                                ? 'badge-warning'
                                : res.status === 'checked-in'
                                ? 'badge-success'
                                : 'badge-danger'
                            }`}
                          >
                            {res.status === 'confirmed' ? 'รอเช็คอิน' : 'เช็คอินแล้ว'}
                          </span>

                          {res.status === 'confirmed' && (
                            <>
                              <button
                                onClick={() => handleCheckIn(res.id)}
                                className="btn-primary text-xs px-3 py-1.5"
                                aria-label={`Check in ลูกค้าที่นั่ง ${res.seatId}`}
                              >
                                เช็คอิน
                              </button>
                              <button
                                onClick={() => handleCancel(res.id)}
                                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500/15 text-red-400 border border-red-500/20 cursor-pointer hover:bg-red-500/25 transition-colors"
                                aria-label={`ยกเลิกการจอง ${res.id}`}
                              >
                                ยกเลิก
                              </button>
                            </>
                          )}
                          
                          {res.status === 'checked-in' && (
                             <button
                               onClick={() => handleCheckout(res.id)}
                               className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500/15 text-red-400 border border-red-500/20 cursor-pointer hover:bg-red-500/25 transition-colors"
                               aria-label={`เช็คเอาท์ลูกค้าที่นั่ง ${res.seatId}`}
                             >
                               เช็คเอาท์
                             </button>
                          )}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          )}
        </div>
      </main>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
}

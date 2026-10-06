import { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import SEOHead from '../components/SEOHead';
import Toast from '../components/Toast';

export default function CustomerReservation() {
  const { seats, reserveSeat, reservations, checkoutReservation } = useStore();
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [checkInTime, setCheckInTime] = useState('');
  const [checkOutTime, setCheckOutTime] = useState('');
  const [toast, setToast] = useState(null);
  const [filterPower, setFilterPower] = useState(false);

  // Generate time options from 08:00 to 20:00 every 30 minutes
  const timeOptions = useMemo(() => {
    const times = [];
    for (let i = 8; i <= 20; i++) {
      times.push(`${i.toString().padStart(2, '0')}:00`);
      if (i !== 20) times.push(`${i.toString().padStart(2, '0')}:30`);
    }
    return times;
  }, []);

  const handleSeatClick = (seat) => {
    if (seat.status !== 'available') return;
    setSelectedSeat(seat.id === selectedSeat ? null : seat.id);
  };

  const handleReserve = () => {
    if (!selectedSeat || !checkInTime || !checkOutTime) {
      setToast({ message: 'กรุณาเลือกที่นั่งและเวลาเข้า-ออกให้ครบถ้วน', type: 'warning' });
      return;
    }
    
    if (checkInTime >= checkOutTime) {
      setToast({ message: 'เวลาออกต้องมากกว่าเวลาเข้า', type: 'error' });
      return;
    }

    const result = reserveSeat(selectedSeat, checkInTime, checkOutTime);
    if (result) {
      setToast({ message: `จองที่นั่ง ${selectedSeat} เรียบร้อยแล้ว!`, type: 'success' });
      setSelectedSeat(null);
      setCheckInTime('');
      setCheckOutTime('');
    } else {
      setToast({ message: 'ที่นั่งนี้ไม่ว่างแล้ว', type: 'error' });
    }
  };

  const handleCheckout = (resId) => {
    checkoutReservation(resId);
    setToast({ message: 'เช็คเอาท์เรียบร้อยแล้ว ขอบคุณที่ใช้บริการค่ะ', type: 'success' });
  };

  const displaySeats = filterPower ? seats.filter(s => s.hasPower) : seats;
  const myReservations = reservations.filter(r => r.status !== 'cancelled' && r.status !== 'completed');

  const statusCounts = {
    available: seats.filter(s => s.status === 'available').length,
    occupied: seats.filter(s => s.status === 'occupied').length,
    closed: seats.filter(s => s.status === 'closed').length,
  };

  return (
    <>
      <SEOHead
        title="จองที่นั่ง (Reserve Seat)"
        description="เช็คสถานะที่นั่งแบบเรียลไทม์ ค้นหาที่นั่งมีปลั๊กไฟ และจองที่นั่งคาเฟ่พร้อมเลือกเวลาเข้า-ออกได้ด้วยตัวคุณเอง"
        path="/customer"
      />

      <main className="pt-20 min-h-screen px-4 sm:px-6 lg:px-8 pb-12">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <header className="mb-8 pt-6">
            <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
              <span className="gradient-text">Real-time</span> Seat Checker
            </h1>
            <p className="text-slate-400">เลือกที่นั่งที่คุณถูกใจ และกำหนดเวลาเข้า-ออกได้เลย</p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Seat Map — Main Area */}
            <section className="lg:col-span-2 space-y-6" aria-labelledby="seat-map-heading">
              {/* Status Summary */}
              <div className="grid grid-cols-3 gap-3">
                <div className="card text-center p-4">
                  <div className="text-2xl font-bold text-emerald-400">{statusCounts.available}</div>
                  <div className="text-xs text-slate-400 mt-1">ว่าง (Available)</div>
                </div>
                <div className="card text-center p-4">
                  <div className="text-2xl font-bold text-red-400">{statusCounts.occupied}</div>
                  <div className="text-xs text-slate-400 mt-1">มีคนนั่ง (Occupied)</div>
                </div>
                <div className="card text-center p-4">
                  <div className="text-2xl font-bold text-slate-500">{statusCounts.closed}</div>
                  <div className="text-xs text-slate-400 mt-1">ปิด (Closed)</div>
                </div>
              </div>

              {/* Filter + Legend */}
              <div className="card">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                  <h2 id="seat-map-heading" className="text-lg font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>
                    แผนผังที่นั่ง - โซนริมหน้าต่าง
                  </h2>
                  <label className="flex items-center gap-2 cursor-pointer text-sm">
                    <input
                      type="checkbox"
                      checked={filterPower}
                      onChange={(e) => setFilterPower(e.target.checked)}
                      className="w-4 h-4 accent-primary rounded"
                      aria-label="แสดงเฉพาะที่นั่งที่มีปลั๊กไฟ"
                    />
                    <span className="text-slate-300">🔌 เฉพาะมีปลั๊กไฟ</span>
                  </label>
                </div>

                {/* Legend */}
                <div className="flex flex-wrap gap-4 mb-6 text-xs text-slate-400" role="list" aria-label="Seat status legend">
                  <div className="flex items-center gap-1.5" role="listitem">
                    <span className="w-3 h-3 rounded bg-emerald-500/30 border border-emerald-500/50" aria-hidden="true"></span>
                    ว่าง
                  </div>
                  <div className="flex items-center gap-1.5" role="listitem">
                    <span className="w-3 h-3 rounded bg-red-500/30 border border-red-500/50" aria-hidden="true"></span>
                    มีคนนั่ง
                  </div>
                  <div className="flex items-center gap-1.5" role="listitem">
                    <span className="w-3 h-3 rounded bg-primary/30 border border-primary/50" aria-hidden="true"></span>
                    เลือกอยู่
                  </div>
                  <div className="flex items-center gap-1.5" role="listitem">
                    <span className="w-3 h-3 rounded bg-slate-500/30 border border-slate-500/50" aria-hidden="true"></span>
                    ปิดบริการ
                  </div>
                  <div className="flex items-center gap-1.5" role="listitem">
                    <span className="w-3 h-3 rounded-full bg-amber-500" aria-hidden="true"></span>
                    ปลั๊กไฟ
                  </div>
                </div>

                {/* Seat Grid */}
                <div
                  className="grid grid-cols-4 gap-3 justify-items-center"
                  role="grid"
                  aria-label="Seat selection grid"
                >
                  {displaySeats.map((seat) => {
                    const isSelected = selectedSeat === seat.id;
                    const statusClass = isSelected ? 'selected' : seat.status;
                    return (
                      <button
                        key={seat.id}
                        className={`seat ${statusClass}`}
                        onClick={() => handleSeatClick(seat)}
                        disabled={seat.status !== 'available'}
                        aria-label={`ที่นั่ง ${seat.id}, สถานะ ${seat.status}${seat.hasPower ? ', มีปลั๊กไฟ' : ''}${isSelected ? ', ถูกเลือก' : ''}`}
                        aria-pressed={isSelected}
                        role="gridcell"
                      >
                        {seat.id}
                        {seat.hasPower && (
                          <span className="power-badge" title="มีปลั๊กไฟ" aria-hidden="true">⚡</span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {displaySeats.length === 0 && (
                  <p className="text-center text-slate-500 py-8">ไม่พบที่นั่งที่ตรงกับเงื่อนไข</p>
                )}
              </div>
            </section>

            {/* Booking Panel — Sidebar */}
            <aside className="space-y-6" aria-label="Booking panel">
              {/* Lock & Book */}
              <div className="card">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ fontFamily: 'var(--font-heading)' }}>
                  <span aria-hidden="true">🔒</span> ล็อกที่นั่ง & จอง
                </h2>

                {selectedSeat ? (
                  <div className="mb-4 p-3 rounded-lg bg-primary/10 border border-primary/20">
                    <p className="text-sm text-slate-300">
                      ที่นั่งที่เลือก: <strong className="text-primary-light">ที่นั่ง {selectedSeat}</strong>
                      {seats.find(s => s.id === selectedSeat)?.hasPower && (
                        <span className="ml-2 text-amber-400">⚡ มีปลั๊กไฟ</span>
                      )}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-slate-500 mb-4">คลิกที่นั่งสีเขียวบนแผนผังเพื่อเลือกที่นั่ง</p>
                )}

                {/* Time Selection */}
                <fieldset className="mb-6 space-y-4">
                  <legend className="sr-only">เลือกเวลาเข้า-ออก</legend>
                  
                  <div>
                    <label htmlFor="checkInTime" className="block text-sm font-medium text-slate-300 mb-1">เวลาเข้า (Check-in)</label>
                    <select
                      id="checkInTime"
                      value={checkInTime}
                      onChange={(e) => setCheckInTime(e.target.value)}
                      className="w-full bg-black/20 border border-white/10 rounded-lg p-2.5 text-slate-200 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50"
                    >
                      <option value="" disabled className="text-slate-900">-- เลือกเวลา --</option>
                      {timeOptions.map(time => (
                        <option key={`in-${time}`} value={time} className="text-slate-900">{time}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="checkOutTime" className="block text-sm font-medium text-slate-300 mb-1">เวลาออก (Check-out)</label>
                    <select
                      id="checkOutTime"
                      value={checkOutTime}
                      onChange={(e) => setCheckOutTime(e.target.value)}
                      className="w-full bg-black/20 border border-white/10 rounded-lg p-2.5 text-slate-200 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50"
                    >
                      <option value="" disabled className="text-slate-900">-- เลือกเวลา --</option>
                      {timeOptions.map(time => (
                        <option key={`out-${time}`} value={time} className="text-slate-900">{time}</option>
                      ))}
                    </select>
                  </div>
                </fieldset>

                <button
                  onClick={handleReserve}
                  disabled={!selectedSeat || !checkInTime || !checkOutTime}
                  className="btn-primary w-full py-3 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
                  id="btn-reserve"
                >
                  ยืนยันการจอง
                </button>
              </div>

              {/* My Reservations */}
              <div className="card">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ fontFamily: 'var(--font-heading)' }}>
                  <span aria-hidden="true">📋</span> การจองของฉัน
                </h2>

                {myReservations.length === 0 ? (
                  <p className="text-sm text-slate-500">คุณยังไม่มีรายการจอง</p>
                ) : (
                  <ul className="space-y-3" aria-label="Your reservations">
                    {myReservations.map((res) => (
                      <li key={res.id} className="p-4 rounded-lg bg-white/5 border border-white/10">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-semibold text-slate-200">ที่นั่ง {res.seatId}</span>
                          <span className={`badge ${res.status === 'confirmed' ? 'badge-warning' : 'badge-success'}`}>
                            {res.status === 'confirmed' ? 'รอเช็คอิน' : 'เช็คอินแล้ว'}
                          </span>
                        </div>
                        <div className="text-sm text-slate-400 mb-3">
                          เวลา: {res.checkInTime} - {res.checkOutTime}
                        </div>
                        {res.status === 'checked-in' && (
                          <button
                            onClick={() => handleCheckout(res.id)}
                            className="w-full py-2 rounded-lg text-sm font-medium bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30 transition-colors"
                          >
                            เช็คเอาท์ (Checkout)
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </aside>
          </div>
        </div>
      </main>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
}

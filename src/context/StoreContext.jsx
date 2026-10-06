import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const StoreContext = createContext(null);
const STORE_KEY = 'brewbook_store';

/* ── Initial Seat Data ─────────────────────────────────── */
const createInitialSeats = () => [
  { id: 'A1', zone: 'Window Zone', hasPower: true, status: 'available' },
  { id: 'A2', zone: 'Window Zone', hasPower: true, status: 'available' },
  { id: 'A3', zone: 'Window Zone', hasPower: false, status: 'available' },
  { id: 'A4', zone: 'Window Zone', hasPower: false, status: 'available' },
  { id: 'B1', zone: 'Window Zone', hasPower: true, status: 'available' },
  { id: 'B2', zone: 'Window Zone', hasPower: false, status: 'available' },
  { id: 'B3', zone: 'Window Zone', hasPower: true, status: 'available' },
  { id: 'B4', zone: 'Window Zone', hasPower: false, status: 'occupied' },
  { id: 'C1', zone: 'Window Zone', hasPower: true, status: 'available' },
  { id: 'C2', zone: 'Window Zone', hasPower: false, status: 'available' },
  { id: 'C3', zone: 'Window Zone', hasPower: false, status: 'available' },
  { id: 'C4', zone: 'Window Zone', hasPower: true, status: 'available' },
];

/* ── Menu Items ────────────────────────────────────────── */
const MENU_ITEMS = [
  { id: 1, name: 'Espresso', category: 'Coffee', price: 65, emoji: '☕', description: 'Rich, bold single shot' },
  { id: 2, name: 'Café Latte', category: 'Coffee', price: 85, emoji: '☕', description: 'Smooth espresso with steamed milk' },
  { id: 3, name: 'Cappuccino', category: 'Coffee', price: 80, emoji: '☕', description: 'Equal parts espresso, milk & foam' },
  { id: 4, name: 'Cold Brew', category: 'Coffee', price: 90, emoji: '🧊', description: 'Slow-steeped for 24 hours' },
  { id: 5, name: 'Matcha Latte', category: 'Tea', price: 95, emoji: '🍵', description: 'Ceremonial grade matcha with oat milk' },
  { id: 6, name: 'Chai Latte', category: 'Tea', price: 85, emoji: '🍵', description: 'Spiced black tea with frothy milk' },
  { id: 7, name: 'Croissant', category: 'Food', price: 75, emoji: '🥐', description: 'Buttery, flaky French pastry' },
  { id: 8, name: 'Avocado Toast', category: 'Food', price: 120, emoji: '🥑', description: 'Sourdough with smashed avo & seeds' },
  { id: 9, name: 'Caesar Salad', category: 'Food', price: 140, emoji: '🥗', description: 'Crisp romaine with parmesan dressing' },
  { id: 10, name: 'Banana Bread', category: 'Food', price: 80, emoji: '🍞', description: 'Home-baked with walnuts' },
  { id: 11, name: 'Chocolate Cake', category: 'Dessert', price: 110, emoji: '🍫', description: 'Rich Belgian chocolate layered cake' },
  { id: 12, name: 'Lemonade', category: 'Drinks', price: 70, emoji: '🍋', description: 'Fresh-squeezed with mint' },
];

/* ── News / Promotions ─────────────────────────────────── */
const NEWS_ITEMS = [
  {
    id: 1,
    title: 'Grand Opening Week — 20% Off All Drinks!',
    description: 'Celebrate our launch with discounted beverages all week. Use code BREWBOOK20 at checkout.',
    date: '2026-10-01',
    tag: 'Promotion',
    emoji: '🎉',
  },
  {
    id: 2,
    title: 'New Seasonal Menu: Autumn Special',
    description: 'Discover our new pumpkin spice latte, maple cold brew, and cinnamon scones.',
    date: '2026-10-03',
    tag: 'Menu Update',
    emoji: '🍂',
  },
  {
    id: 3,
    title: 'Free Wi-Fi Upgrade — Now 500 Mbps!',
    description: 'We\'ve upgraded our internet for the ultimate remote working experience.',
    date: '2026-10-05',
    tag: 'Announcement',
    emoji: '📶',
  },
  {
    id: 4,
    title: 'Happy Hour: 3PM – 5PM Daily',
    description: 'Buy one get one free on all cold beverages during happy hour.',
    date: '2026-10-06',
    tag: 'Promotion',
    emoji: '⏰',
  },
];

export function StoreProvider({ children }) {
  const [storeData, setStoreData] = useState(() => {
    try {
      const stored = localStorage.getItem(STORE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }
    return {
      seats: createInitialSeats(),
      reservations: [],
      orders: [],
    };
  });

  useEffect(() => {
    localStorage.setItem(STORE_KEY, JSON.stringify(storeData));
  }, [storeData]);

  const { seats, reservations, orders } = storeData;

  /* ── Seat Operations ──────────────────────────────────── */
  const toggleSeatStatus = useCallback((seatId) => {
    setStoreData(prev => ({
      ...prev,
      seats: prev.seats.map(s => {
        if (s.id !== seatId) return s;
        const next = s.status === 'available' ? 'closed' : s.status === 'closed' ? 'available' : s.status;
        return { ...s, status: next };
      })
    }));
  }, []);

  const reserveSeat = useCallback((seatId, checkInTime, checkOutTime, customerName = 'Customer') => {
    const seat = seats.find(s => s.id === seatId);
    if (!seat || seat.status !== 'available') return false;

    const reservation = {
      id: `RES-${Date.now()}`,
      seatId,
      checkInTime,
      checkOutTime,
      customerName,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };

    setStoreData(prev => ({
      ...prev,
      reservations: [...prev.reservations, reservation],
      seats: prev.seats.map(s => (s.id === seatId ? { ...s, status: 'occupied' } : s))
    }));
    return reservation;
  }, [seats]);

  const checkInReservation = useCallback((reservationId) => {
    setStoreData(prev => ({
      ...prev,
      reservations: prev.reservations.map(r => (r.id === reservationId ? { ...r, status: 'checked-in' } : r))
    }));
  }, []);
  
  const checkoutReservation = useCallback((reservationId) => {
    setStoreData(prev => {
      const res = prev.reservations.find(r => r.id === reservationId);
      let nextSeats = prev.seats;
      if (res) {
        nextSeats = prev.seats.map(seat => (seat.id === res.seatId ? { ...seat, status: 'available' } : seat));
      }
      return {
        ...prev,
        seats: nextSeats,
        reservations: prev.reservations.map(r => (r.id === reservationId ? { ...r, status: 'completed' } : r))
      };
    });
  }, []);

  const cancelReservation = useCallback((reservationId) => {
    setStoreData(prev => {
      const res = prev.reservations.find(r => r.id === reservationId);
      let nextSeats = prev.seats;
      if (res) {
        nextSeats = prev.seats.map(seat => (seat.id === res.seatId ? { ...seat, status: 'available' } : seat));
      }
      return {
        ...prev,
        seats: nextSeats,
        reservations: prev.reservations.map(r => (r.id === reservationId ? { ...r, status: 'cancelled' } : r))
      };
    });
  }, []);

  /* ── Order Operations ─────────────────────────────────── */
  const placeOrder = useCallback((items, seatId) => {
    const order = {
      id: `ORD-${Date.now()}`,
      seatId,
      items,
      total: items.reduce((sum, i) => sum + i.price * i.qty, 0),
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    setStoreData(prev => ({
      ...prev,
      orders: [order, ...prev.orders]
    }));
    return order;
  }, []);

  const updateOrderStatus = useCallback((orderId, status) => {
    setStoreData(prev => ({
      ...prev,
      orders: prev.orders.map(o => (o.id === orderId ? { ...o, status } : o))
    }));
  }, []);

  const value = {
    seats,
    reservations,
    orders,
    menuItems: MENU_ITEMS,
    newsItems: NEWS_ITEMS,
    toggleSeatStatus,
    reserveSeat,
    checkInReservation,
    checkoutReservation,
    cancelReservation,
    placeOrder,
    updateOrderStatus,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}

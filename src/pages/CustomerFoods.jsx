import { useState } from 'react';
import { useStore } from '../context/StoreContext';
import SEOHead from '../components/SEOHead';
import Toast from '../components/Toast';

export default function CustomerFoods() {
  const { orders, menuItems, placeOrder } = useStore();
  const [cart, setCart] = useState({});
  const [toast, setToast] = useState(null);
  const [seatId, setSeatId] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [showCart, setShowCart] = useState(false);
  const [myOrderIds, setMyOrderIds] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem('my_orders') || '[]');
    } catch {
      return [];
    }
  });

  const myOrders = orders.filter(o => myOrderIds.includes(o.id));

  const categories = ['All', ...new Set(menuItems.map(i => i.category))];

  const filteredItems =
    activeCategory === 'All' ? menuItems : menuItems.filter(i => i.category === activeCategory);

  const addToCart = (item) => {
    setCart(prev => ({
      ...prev,
      [item.id]: {
        ...item,
        qty: (prev[item.id]?.qty || 0) + 1,
      },
    }));
  };

  const removeFromCart = (itemId) => {
    setCart(prev => {
      const next = { ...prev };
      if (next[itemId]?.qty > 1) {
        next[itemId] = { ...next[itemId], qty: next[itemId].qty - 1 };
      } else {
        delete next[itemId];
      }
      return next;
    });
  };

  const cartItems = Object.values(cart);
  const cartTotal = cartItems.reduce((sum, i) => sum + i.price * i.qty, 0);
  const cartCount = cartItems.reduce((sum, i) => sum + i.qty, 0);

  const handlePlaceOrder = () => {
    if (cartItems.length === 0) {
      setToast({ message: 'Your cart is empty', type: 'warning' });
      return;
    }
    if (!seatId.trim()) {
      setToast({ message: 'Please enter your seat number', type: 'warning' });
      return;
    }
    const newOrder = placeOrder(cartItems, seatId);
    
    const newOrderIds = [newOrder.id, ...myOrderIds];
    setMyOrderIds(newOrderIds);
    sessionStorage.setItem('my_orders', JSON.stringify(newOrderIds));

    setCart({});
    setSeatId('');
    setShowCart(false);
    setToast({ message: 'สั่งอาหารเรียบร้อยแล้ว! 🎉', type: 'success' });
  };

  return (
    <>
      <SEOHead
        title="Food & Drinks Menu"
        description="Order delicious food and drinks directly from your seat at BrewBook cafe. QR ordering made easy."
        path="/customer/foods"
      />

      <main className="pt-20 min-h-screen px-4 sm:px-6 lg:px-8 pb-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <header className="mb-8 pt-6">
            <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
              <span className="gradient-text">QR Order</span> — Food & Drinks
            </h1>
            <p className="text-slate-400">Browse our menu and order directly to your seat.</p>
          </header>

          {/* My Orders Status */}
          {myOrders.length > 0 && (
            <section className="mb-10 animate-fade-in" aria-label="My Orders">
              <h2 className="text-xl font-bold mb-4 text-white" style={{ fontFamily: 'var(--font-heading)' }}>สถานะออเดอร์ของคุณ</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {myOrders.map(order => (
                  <article key={order.id} className="card p-4 border border-primary/20 bg-black/20">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <span className="text-sm font-semibold text-slate-200 block mb-1">ที่นั่ง (Seat): {order.seatId}</span>
                        <span className="text-xs text-slate-400 block">ID: {order.id}</span>
                      </div>
                      <span className={`badge ${
                        order.status === 'pending' ? 'badge-warning' : 
                        order.status === 'preparing' ? 'badge-info' : 
                        order.status === 'completed' ? 'badge-success' : 'badge-danger'
                      }`}>
                        {order.status === 'pending' ? 'รอดำเนินการ' :
                         order.status === 'preparing' ? 'กำลังเตรียม' :
                         order.status === 'completed' ? 'เสิร์ฟแล้ว' : 'ยกเลิกแล้ว'}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 mb-3 space-y-1 bg-white/5 p-2 rounded">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between">
                          <span>{item.name} x{item.qty}</span>
                          <span>฿{item.price * item.qty}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-white/10">
                      <span className="text-sm font-semibold text-slate-300">รวม (Total)</span>
                      <span className="text-sm font-bold text-primary-light">฿{order.total}</span>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {/* Category Tabs */}
          <nav className="flex gap-2 mb-8 overflow-x-auto pb-2" role="tablist" aria-label="Menu categories">
            {categories.map((cat) => (
              <button
                key={cat}
                role="tab"
                aria-selected={activeCategory === cat}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all border-none cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                    : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                }`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </nav>

          {/* Menu Grid */}
          <section aria-label="Menu items">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
              {filteredItems.map((item) => {
                const inCart = cart[item.id];
                return (
                  <article key={item.id} className="card animate-slide-up opacity-0 group">
                    <div className="flex items-start gap-4">
                      <div className="text-4xl flex-shrink-0 group-hover:scale-110 transition-transform" aria-hidden="true">
                        {item.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h2 className="text-base font-semibold text-slate-100" style={{ fontFamily: 'var(--font-heading)' }}>
                              {item.name}
                            </h2>
                            <p className="text-xs text-slate-500 mt-0.5">{item.description}</p>
                          </div>
                          <span className="text-sm font-bold text-purple-300 whitespace-nowrap">฿{item.price}</span>
                        </div>

                        <div className="flex items-center gap-2 mt-3">
                          {inCart ? (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="w-7 h-7 rounded-md bg-white/10 text-white border-none cursor-pointer hover:bg-red-500/20 transition-colors text-sm flex items-center justify-center"
                                aria-label={`Remove one ${item.name} from cart`}
                              >
                                −
                              </button>
                              <span className="text-sm font-semibold text-slate-200 w-6 text-center" aria-label={`${inCart.qty} in cart`}>
                                {inCart.qty}
                              </span>
                              <button
                                onClick={() => addToCart(item)}
                                className="w-7 h-7 rounded-md bg-purple-500/20 text-purple-300 border-none cursor-pointer hover:bg-purple-500/30 transition-colors text-sm flex items-center justify-center"
                                aria-label={`Add another ${item.name} to cart`}
                              >
                                +
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => addToCart(item)}
                              className="btn-primary text-xs px-3 py-1.5 rounded-md"
                              aria-label={`Add ${item.name} to cart`}
                            >
                              + Add
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          {/* Floating Cart Button */}
          {cartCount > 0 && (
            <div className="fixed bottom-6 right-6 z-30">
              <button
                onClick={() => setShowCart(!showCart)}
                className="btn-primary px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 animate-pulse-glow"
                aria-label={`View cart with ${cartCount} items`}
              >
                <span aria-hidden="true">🛒</span>
                <span className="font-bold">{cartCount}</span>
                <span className="hidden sm:inline">— ฿{cartTotal}</span>
              </button>
            </div>
          )}

          {/* Cart Modal */}
          {showCart && (
            <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Your cart">
              <div className="card w-full max-w-md mx-4 max-h-[80vh] overflow-y-auto glow-purple">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
                    Your Cart
                  </h2>
                  <button
                    onClick={() => setShowCart(false)}
                    className="w-8 h-8 rounded-lg bg-white/10 text-white border-none cursor-pointer hover:bg-white/20 transition-colors flex items-center justify-center"
                    aria-label="Close cart"
                  >
                    ✕
                  </button>
                </div>

                {cartItems.length === 0 ? (
                  <p className="text-slate-500 text-center py-8">Your cart is empty</p>
                ) : (
                  <>
                    <ul className="space-y-3 mb-4" aria-label="Cart items">
                      {cartItems.map((item) => (
                        <li key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-white/3 border border-white/5">
                          <div className="flex items-center gap-3">
                            <span className="text-xl" aria-hidden="true">{item.emoji}</span>
                            <div>
                              <div className="text-sm font-medium text-slate-200">{item.name}</div>
                              <div className="text-xs text-slate-400">฿{item.price} × {item.qty}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-purple-300">฿{item.price * item.qty}</span>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="w-6 h-6 rounded bg-red-500/20 text-red-300 border-none cursor-pointer hover:bg-red-500/30 text-xs flex items-center justify-center"
                              aria-label={`Remove one ${item.name}`}
                            >
                              −
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>

                    {/* Seat Input */}
                    <div className="mb-4">
                      <label htmlFor="cart-seat-id" className="text-sm font-medium text-slate-300 mb-1 block">
                        Your Seat Number
                      </label>
                      <input
                        id="cart-seat-id"
                        type="text"
                        placeholder="e.g. A1"
                        value={seatId}
                        onChange={(e) => setSeatId(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-slate-200 text-sm focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 placeholder-slate-600"
                      />
                    </div>

                    {/* Total + Submit */}
                    <div className="border-t border-white/10 pt-4">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-base font-semibold text-slate-200">Total</span>
                        <span className="text-xl font-bold gradient-text">฿{cartTotal}</span>
                      </div>
                      <button
                        onClick={handlePlaceOrder}
                        className="btn-accent w-full py-3 rounded-xl text-base"
                        id="btn-place-order"
                      >
                        Place Order
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
}

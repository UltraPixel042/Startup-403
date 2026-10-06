import { useState } from 'react';
import { useStore } from '../context/StoreContext';
import SEOHead from '../components/SEOHead';
import Toast from '../components/Toast';

export default function CafeOrders() {
  const { orders, updateOrderStatus } = useStore();
  const [toast, setToast] = useState(null);
  const [filter, setFilter] = useState('all');

  const filteredOrders = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  const statusOptions = [
    { value: 'all', label: 'All Orders' },
    { value: 'pending', label: 'Pending' },
    { value: 'preparing', label: 'Preparing' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  const nextStatus = {
    pending: 'preparing',
    preparing: 'completed',
  };

  const handleStatusUpdate = (orderId, newStatus) => {
    updateOrderStatus(orderId, newStatus);
    setToast({ message: `Order updated to ${newStatus}`, type: 'success' });
  };

  const handleCancel = (orderId) => {
    updateOrderStatus(orderId, 'cancelled');
    setToast({ message: 'Order cancelled', type: 'warning' });
  };

  const getStatusBadge = (status) => {
    const map = {
      pending: 'badge-warning',
      preparing: 'badge-info',
      completed: 'badge-success',
      cancelled: 'badge-danger',
    };
    return map[status] || 'badge-info';
  };

  const getActionLabel = (status) => {
    if (status === 'pending') return '🍳 Start Preparing';
    if (status === 'preparing') return '✅ Mark Complete';
    return null;
  };

  const pendingCount = orders.filter(o => o.status === 'pending').length;
  const preparingCount = orders.filter(o => o.status === 'preparing').length;

  return (
    <>
      <SEOHead
        title="Order Management"
        description="Receive and manage customer food orders in real-time at BrewBook cafe."
        path="/cafe/order"
      />

      <main className="pt-20 min-h-screen px-4 sm:px-6 lg:px-8 pb-12">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <header className="mb-8 pt-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                  Order <span className="gradient-text">Management</span>
                </h1>
                <p className="text-slate-400">View and manage incoming food orders in real-time.</p>
              </div>

              {/* Live indicators */}
              <div className="flex gap-3">
                {pendingCount > 0 && (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" aria-hidden="true"></span>
                    <span className="text-xs font-semibold text-amber-300">{pendingCount} pending</span>
                  </div>
                )}
                {preparingCount > 0 && (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" aria-hidden="true"></span>
                    <span className="text-xs font-semibold text-cyan-300">{preparingCount} preparing</span>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Filter Tabs */}
          <nav className="flex gap-2 mb-6 overflow-x-auto pb-2" role="tablist" aria-label="Order status filter">
            {statusOptions.map((opt) => (
              <button
                key={opt.value}
                role="tab"
                aria-selected={filter === opt.value}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all border-none cursor-pointer ${
                  filter === opt.value
                    ? 'bg-purple-500/20 text-purple-300'
                    : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                }`}
                onClick={() => setFilter(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </nav>

          {/* Orders List */}
          <section aria-label="Orders list">
            {filteredOrders.length === 0 ? (
              <div className="card text-center py-16">
                <div className="text-5xl mb-4" aria-hidden="true">📋</div>
                <h2 className="text-lg font-semibold text-slate-300 mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                  No Orders Yet
                </h2>
                <p className="text-sm text-slate-500">Orders from customers will appear here in real-time.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => (
                  <article
                    key={order.id}
                    className={`card transition-all ${
                      order.status === 'pending' ? 'border-amber-500/30 glow-cyan' : ''
                    }`}
                  >
                    {/* Order Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-sm font-bold text-purple-300">
                          {order.seatId}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-slate-200">
                            Order {order.id}
                          </div>
                          <time className="text-xs text-slate-500" dateTime={order.createdAt}>
                            {new Date(order.createdAt).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </time>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`badge ${getStatusBadge(order.status)}`}>
                          {order.status}
                        </span>
                        <span className="text-base font-bold gradient-text">฿{order.total}</span>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="bg-white/3 rounded-lg p-3 mb-4">
                      <ul className="space-y-1" aria-label="Order items">
                        {order.items.map((item, idx) => (
                          <li key={idx} className="flex items-center justify-between text-sm">
                            <span className="text-slate-300">
                              <span aria-hidden="true">{item.emoji}</span> {item.name} × {item.qty}
                            </span>
                            <span className="text-slate-400">฿{item.price * item.qty}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Actions */}
                    {(order.status === 'pending' || order.status === 'preparing') && (
                      <div className="flex gap-2 justify-end">
                        {order.status === 'pending' && (
                          <button
                            onClick={() => handleCancel(order.id)}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500/15 text-red-400 border border-red-500/20 cursor-pointer hover:bg-red-500/25 transition-colors"
                            aria-label={`Cancel order ${order.id}`}
                          >
                            Cancel
                          </button>
                        )}
                        {nextStatus[order.status] && (
                          <button
                            onClick={() => handleStatusUpdate(order.id, nextStatus[order.status])}
                            className="btn-primary text-xs px-4 py-1.5"
                            aria-label={getActionLabel(order.status)}
                          >
                            {getActionLabel(order.status)}
                          </button>
                        )}
                      </div>
                    )}
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
}

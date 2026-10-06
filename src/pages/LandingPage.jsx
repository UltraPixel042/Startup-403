import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import SEOHead from '../components/SEOHead';

export default function LandingPage() {
  const { login } = useAuth();
  const { newsItems } = useStore();
  const navigate = useNavigate();

  const handleQuickLogin = (role) => {
    login(role);
    navigate(role === 'customer' ? '/customer' : '/cafe');
  };

  const tagColors = {
    Promotion: 'badge-warning',
    'Menu Update': 'badge-success',
    Announcement: 'badge-info',
  };

  return (
    <>
      <SEOHead
        title="หน้าหลัก (Home)"
        description="BrewBook — ระบบจองที่นั่งคาเฟ่ที่ดีที่สุด เลือกระยะเวลาเข้า-ออก ดูสถานะที่นั่งแบบเรียลไทม์ พร้อมสั่งอาหารผ่าน QR Code"
        keywords="จองที่นั่งคาเฟ่, คาเฟ่, ระบบจองที่นั่ง, สั่งอาหารคาเฟ่, cafe reservation, coworking space, ร้านกาแฟ"
        path="/"
      />

      <main className="pt-20 min-h-screen">
        {/* Hero Section */}
        <section className="relative overflow-hidden px-4 sm:px-6 lg:px-8 py-20 md:py-32" aria-labelledby="hero-heading">
          {/* Background decorations */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-600/20 rounded-full blur-[100px] pointer-events-none" aria-hidden="true"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-600/15 rounded-full blur-[120px] pointer-events-none" aria-hidden="true"></div>

          <div className="max-w-5xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-sm text-purple-300 mb-6 animate-slide-up">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true"></span>
              Open Now — Seats Available
            </div>

            <h1
              id="hero-heading"
              className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 leading-tight animate-slide-up"
              style={{ fontFamily: 'var(--font-heading)', animationDelay: '0.1s' }}
            >
              Your Perfect Spot,{' '}
              <span className="gradient-text">Reserved</span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              Find your ideal seat, check power outlets in real-time, book your slot, and order food — all from your phone. The ultimate cafe experience.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <button
                onClick={() => handleQuickLogin('customer')}
                className="btn-primary text-base px-8 py-3 rounded-xl"
                id="cta-reserve-seat"
              >
                🪑 Reserve a Seat
              </button>
              <button
                onClick={() => handleQuickLogin('cafe')}
                className="btn-secondary text-base px-8 py-3 rounded-xl"
                id="cta-manage-cafe"
              >
                ☕ Manage Cafe
              </button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="px-4 sm:px-6 lg:px-8 py-16" aria-labelledby="features-heading">
          <div className="max-w-6xl mx-auto">
            <h2 id="features-heading" className="text-2xl md:text-3xl font-bold text-center mb-12" style={{ fontFamily: 'var(--font-heading)' }}>
              Why <span className="gradient-text">BrewBook</span>?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 stagger-children">
              {[
                {
                  icon: '📡',
                  title: 'Real-time Availability',
                  desc: 'See which seats are free right now. No more walking in and finding no spots.',
                },
                {
                  icon: '🔌',
                  title: 'Power Outlet Finder',
                  desc: 'Filter seats by power outlets. Perfect for remote workers and students.',
                },
                {
                  icon: '📱',
                  title: 'QR Food Ordering',
                  desc: 'Order food and drinks directly from your seat. No waiting in line.',
                },
              ].map((feature) => (
                <article key={feature.title} className="card text-center animate-slide-up opacity-0">
                  <div className="text-4xl mb-4" aria-hidden="true">{feature.icon}</div>
                  <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                    {feature.title}
                  </h3>
                  <p className="text-sm text-slate-400">{feature.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* News & Promotions Section */}
        <section className="px-4 sm:px-6 lg:px-8 py-16" aria-labelledby="news-heading">
          <div className="max-w-6xl mx-auto">
            <h2 id="news-heading" className="text-2xl md:text-3xl font-bold text-center mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
              News & <span className="gradient-text">Promotions</span>
            </h2>
            <p className="text-slate-400 text-center mb-12 max-w-xl mx-auto">
              Stay up to date with our latest offerings, seasonal specials, and exciting announcements.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 stagger-children">
              {newsItems.map((item) => (
                <article key={item.id} className="card animate-slide-up opacity-0 group">
                  <div className="flex items-start gap-4">
                    <div className="text-3xl flex-shrink-0 group-hover:scale-110 transition-transform" aria-hidden="true">
                      {item.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className={`badge ${tagColors[item.tag] || 'badge-info'}`}>
                          {item.tag}
                        </span>
                        <time className="text-xs text-slate-500" dateTime={item.date}>
                          {new Date(item.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </time>
                      </div>
                      <h3 className="text-base font-semibold mb-1 text-slate-100" style={{ fontFamily: 'var(--font-heading)' }}>
                        {item.title}
                      </h3>
                      <p className="text-sm text-slate-400 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-4 sm:px-6 lg:px-8 py-20" aria-labelledby="cta-heading">
          <div className="max-w-3xl mx-auto text-center">
            <div className="card glow-purple p-10">
              <h2 id="cta-heading" className="text-2xl md:text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
                Ready to find your <span className="gradient-text">perfect spot</span>?
              </h2>
              <p className="text-slate-400 mb-8">
                Join thousands of happy customers who have already discovered their favourite seat.
              </p>
              <button
                onClick={() => handleQuickLogin('customer')}
                className="btn-primary text-base px-10 py-3 rounded-xl"
                id="cta-bottom-reserve"
              >
                Get Started — It&apos;s Free
              </button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

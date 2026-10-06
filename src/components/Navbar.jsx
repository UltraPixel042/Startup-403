import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, login, logout, isAuthenticated } = useAuth();
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const roleMenuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(e) {
      if (roleMenuRef.current && !roleMenuRef.current.contains(e.target)) {
        setShowRoleMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRoleSelect = (role) => {
    login(role);
    setShowRoleMenu(false);
    setMobileMenuOpen(false);
    navigate(role === 'customer' ? '/customer' : '/cafe');
  };

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  return (
    <nav className="glass-strong fixed top-0 left-0 right-0 z-40" role="navigation" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 no-underline" aria-label="BrewBook home">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#D4A373] to-[#8B5A2B] flex items-center justify-center font-bold text-white text-sm" aria-hidden="true">
              BB
            </div>
            <span className="text-xl font-bold gradient-text" style={{ fontFamily: 'var(--font-heading)' }}>
              BrewBook
            </span>
          </Link>

          {/* Desktop nav links */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center gap-1">
              {user.role === 'customer' && (
                <>
                  <Link to="/customer" className="px-3 py-2 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-all no-underline">
                    Reservations
                  </Link>
                  <Link to="/customer/foods" className="px-3 py-2 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-all no-underline">
                    Food & Drinks
                  </Link>
                </>
              )}
              {user.role === 'cafe' && (
                <>
                  <Link to="/cafe" className="px-3 py-2 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-all no-underline">
                    Dashboard
                  </Link>
                  <Link to="/cafe/order" className="px-3 py-2 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-all no-underline">
                    Orders
                  </Link>
                </>
              )}
            </div>
          )}

          {/* Right side actions */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <span className="hidden sm:inline-block badge badge-info">
                  {user.role === 'customer' ? '👤 Customer' : '☕ Cafe'}
                </span>
                <button onClick={handleLogout} className="btn-secondary text-sm" aria-label="Log out">
                  Logout
                </button>
              </>
            ) : (
              <div className="relative" ref={roleMenuRef}>
                <div className="flex items-center gap-6">
                  <button
                    className="btn-secondary text-sm"
                    aria-label="Sign up for BrewBook"
                    onClick={() => setShowRoleMenu(!showRoleMenu)}
                  >
                    Signup
                  </button>
                  <button
                    onClick={() => setShowRoleMenu(!showRoleMenu)}
                    className="btn-primary text-sm"
                    aria-haspopup="true"
                    aria-expanded={showRoleMenu}
                    aria-label="Log in and select role"
                  >
                    Login
                  </button>
                </div>

                {showRoleMenu && (
                  <div
                    className="absolute right-0 mt-2 w-56 glass-strong rounded-xl overflow-hidden animate-slide-up"
                    role="menu"
                    aria-label="Role selection"
                  >
                    <button
                      role="menuitem"
                      className="w-full px-4 py-3 text-left text-sm text-slate-200 hover:bg-white/10 transition-colors flex items-center gap-3 border-none bg-transparent cursor-pointer"
                      onClick={() => handleRoleSelect('customer')}
                    >
                      <span className="text-xl" aria-hidden="true">👤</span>
                      <div>
                        <div className="font-semibold">Customer</div>
                        <div className="text-xs text-slate-400">Reserve seats & order food</div>
                      </div>
                    </button>
                    <div className="h-px bg-white/10" role="separator"></div>
                    <button
                      role="menuitem"
                      className="w-full px-4 py-3 text-left text-sm text-slate-200 hover:bg-white/10 transition-colors flex items-center gap-3 border-none bg-transparent cursor-pointer"
                      onClick={() => handleRoleSelect('cafe')}
                    >
                      <span className="text-xl" aria-hidden="true">☕</span>
                      <div>
                        <div className="font-semibold">Cafe Manager</div>
                        <div className="text-xs text-slate-400">Manage seats & orders</div>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Mobile menu button */}
            {isAuthenticated && (
              <button
                className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors border-none bg-transparent text-white cursor-pointer"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle mobile menu"
                aria-expanded={mobileMenuOpen}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && isAuthenticated && (
          <div className="md:hidden pb-4 animate-slide-up" role="menu" aria-label="Mobile navigation">
            {user.role === 'customer' && (
              <>
                <Link to="/customer" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-all no-underline" role="menuitem">
                  Reservations
                </Link>
                <Link to="/customer/foods" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-all no-underline" role="menuitem">
                  Food & Drinks
                </Link>
              </>
            )}
            {user.role === 'cafe' && (
              <>
                <Link to="/cafe" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-all no-underline" role="menuitem">
                  Dashboard
                </Link>
                <Link to="/cafe/order" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-all no-underline" role="menuitem">
                  Orders
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

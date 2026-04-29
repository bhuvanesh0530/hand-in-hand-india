import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Home, FolderOpen, MapPin, Users, LayoutDashboard, Heart } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAdmin } = useApp();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [location]);

  const navLinks = [
    { label: 'Home', to: '/', icon: Home },
    { label: 'Categories', to: '/categories', icon: FolderOpen },
    { label: 'Districts', to: '/districts', icon: MapPin },
    { label: 'Businesses', to: '/categories', icon: Users },
  ];

  const isActive = (to: string) =>
    to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-500 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-2xl shadow-lg shadow-stone-200/50 border-b border-[#E05D4B]/10'
          : 'bg-white/80 backdrop-blur-xl border-b border-white/40'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">

          {/* ── BRAND / LOGO ─────────────────────────────────────────────── */}
          <Link to="/" className="flex items-center gap-3 group">
            {/* Animated heart icon */}
            <motion.div
              animate={{ scale: [1, 1.12, 1] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 shadow-md"
              style={{
                background: 'linear-gradient(135deg, #E05D4B, #C2410C)',
                boxShadow: '0 3px 14px rgba(224,93,75,0.30)',
              }}
            >
              <Heart className="w-4 h-4 text-white fill-white" />
            </motion.div>

            {/* Organisation name + updated tagline */}
            <div className="hidden sm:flex flex-col leading-tight">
              <span
                className="text-sm font-bold text-stone-800 group-hover:text-[#E05D4B] transition-colors duration-200"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Hand in Hand India
              </span>
              {/* CHANGED from "Connect. Collaborate. Grow." → "Empower. Enable. Transform." */}
              <span
                className="text-[10px] font-bold tracking-widest uppercase"
                style={{ color: '#E05D4B' }}
              >
                Empower. Enable. Transform.
              </span>
            </div>
          </Link>

          {/* ── DESKTOP NAV ──────────────────────────────────────────────── */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.label}
                to={link.to}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 group ${
                  isActive(link.to)
                    ? 'text-[#E05D4B] bg-[#E05D4B]/8'
                    : 'text-slate-600 hover:text-[#E05D4B] hover:bg-[#E05D4B]/5'
                }`}
              >
                <motion.span
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                >
                  <link.icon
                    className={`w-4 h-4 transition-colors ${
                      isActive(link.to)
                        ? 'text-[#E05D4B]'
                        : 'text-stone-400 group-hover:text-[#E05D4B]'
                    }`}
                  />
                </motion.span>
                {link.label}

                {/* Active indicator dot */}
                {isActive(link.to) && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#E05D4B]"
                  />
                )}

                {/* Hover underline */}
                <motion.div
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-[#E05D4B]/40 rounded-full origin-center"
                  initial={{ width: 0 }}
                  whileHover={{ width: '60%' }}
                  transition={{ duration: 0.2 }}
                />
              </Link>
            ))}
          </nav>

          {/* ── RIGHT SIDE ───────────────────────────────────────────────── */}
          <div className="flex items-center gap-2">
            {isAdmin && (
              <Link to="/admin/dashboard">
                <motion.div
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white shadow-lg"
                  style={{
                    background: 'linear-gradient(135deg, #E05D4B, #C2410C)',
                    boxShadow: '0 4px 16px rgba(224,93,75,0.28)',
                  }}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </motion.div>
              </Link>
            )}

            {/* Mobile hamburger */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2.5 rounded-xl hover:bg-[#E05D4B]/8 transition-colors"
            >
              <AnimatePresence mode="wait">
                {menuOpen ? (
                  <motion.div
                    key="x"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <X className="w-5 h-5 text-slate-700" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Menu className="w-5 h-5 text-slate-700" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </div>

      {/* ── MOBILE MENU ──────────────────────────────────────────────────── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="md:hidden overflow-hidden border-t border-[#E05D4B]/10 bg-white/97 backdrop-blur-xl"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <Link
                    to={link.to}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                      isActive(link.to)
                        ? 'bg-[#E05D4B]/10 text-[#E05D4B]'
                        : 'text-slate-600 hover:bg-[#E05D4B]/5 hover:text-[#E05D4B]'
                    }`}
                  >
                    <link.icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              {isAdmin && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navLinks.length * 0.06 }}
                >
                  <Link
                    to="/admin/dashboard"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-white"
                    style={{ background: 'linear-gradient(135deg, #E05D4B, #C2410C)' }}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Admin Dashboard
                  </Link>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
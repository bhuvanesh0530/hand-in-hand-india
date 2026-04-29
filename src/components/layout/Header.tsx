import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Home, FolderOpen, MapPin, Users, LayoutDashboard } from 'lucide-react';
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
    <header className={`sticky top-0 z-40 transition-all duration-500 ${
      scrolled
        ? 'bg-white/95 backdrop-blur-2xl shadow-lg shadow-stone-200/50 border-b border-[#FF6F61]/10'
        : 'bg-white/80 backdrop-blur-xl border-b border-white/40'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <motion.img
              src="https://www.hihindia.org/wp-content/uploads/2021/03/Hand-in-Hand-India-logo.png"
              alt="Hand in Hand India"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 400 }}
              className="h-10 lg:h-12 w-auto object-contain"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
            <div className="hidden sm:block">
              <p className="text-sm font-bold text-stone-800 leading-tight">Hand in Hand India</p>
              <p className="text-xs text-[#FF6F61] font-semibold tracking-wide">Connect. Collaborate. Grow.</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.label}
                to={link.to}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 group ${
                  isActive(link.to)
                    ? 'text-[#FF6F61] bg-[#FF6F61]/8'
                    : 'text-slate-600 hover:text-[#FF6F61] hover:bg-[#FF6F61]/5'
                }`}
              >
                {/* Icon with animation */}
                <motion.span
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                >
                  <link.icon className={`w-4 h-4 transition-colors ${
                    isActive(link.to) ? 'text-[#FF6F61]' : 'text-stone-400 group-hover:text-[#FF6F61]'
                  }`} />
                </motion.span>
                {link.label}

                {/* Active underline dot */}
                {isActive(link.to) && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#FF6F61]"
                  />
                )}

                {/* Hover underline */}
                <motion.div
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-[#FF6F61]/40 rounded-full origin-center"
                  initial={{ width: 0 }}
                  whileHover={{ width: '60%' }}
                  transition={{ duration: 0.2 }}
                />
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {isAdmin && (
              <Link to="/admin/dashboard">
                <motion.div
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-[#FF6F61] to-[#e8594d] text-white shadow-lg shadow-[#FF6F61]/25"
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
              className="md:hidden p-2.5 rounded-xl hover:bg-[#FF6F61]/8 transition-colors"
            >
              <AnimatePresence mode="wait">
                {menuOpen ? (
                  <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <X className="w-5 h-5 text-slate-700" />
                  </motion.div>
                ) : (
                  <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <Menu className="w-5 h-5 text-slate-700" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="md:hidden overflow-hidden border-t border-[#FF6F61]/10 bg-white/97 backdrop-blur-xl"
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
                        ? 'bg-[#FF6F61]/10 text-[#FF6F61]'
                        : 'text-slate-600 hover:bg-[#FF6F61]/5 hover:text-[#FF6F61]'
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
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-[#FF6F61] to-[#e8594d] text-white"
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
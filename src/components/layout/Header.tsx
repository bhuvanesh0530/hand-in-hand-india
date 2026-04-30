import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu, X, Home, FolderOpen, MapPin, Users,
  LayoutDashboard, Heart, Phone, ChevronDown, Star
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [bizOpen, setBizOpen] = useState(false);
  const { isAdmin, beneficiaries } = useApp();
  const location = useLocation();
  const bizRef = useRef<HTMLDivElement>(null);

  // Only featured beneficiaries
  const featuredBeneficiaries = beneficiaries.filter(b => b.featured === true);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); setBizOpen(false); }, [location]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (bizRef.current && !bizRef.current.contains(e.target as Node)) {
        setBizOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const navLinks = [
    { label: 'Home', to: '/', icon: Home },
    { label: 'Categories', to: '/categories', icon: FolderOpen },
    { label: 'Districts', to: '/districts', icon: MapPin },
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

          {/* ── BRAND ─────────────────────────────────────────────────── */}
          <Link to="/" className="flex items-center gap-3 group">
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
            <div className="hidden sm:flex flex-col leading-tight">
              <span
                className="text-sm font-bold text-stone-800 group-hover:text-[#E05D4B] transition-colors duration-200"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Hand in Hand India
              </span>
              <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: '#E05D4B' }}>
                Empower. Enable. Transform.
              </span>
            </div>
          </Link>

          {/* ── DESKTOP NAV ───────────────────────────────────────────── */}
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
                <motion.span whileHover={{ scale: 1.2, rotate: 5 }} transition={{ type: 'spring', stiffness: 400 }}>
                  <link.icon className={`w-4 h-4 transition-colors ${isActive(link.to) ? 'text-[#E05D4B]' : 'text-stone-400 group-hover:text-[#E05D4B]'}`} />
                </motion.span>
                {link.label}
                {isActive(link.to) && (
                  <motion.div layoutId="activeNav" className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#E05D4B]" />
                )}
              </Link>
            ))}

            {/* ── BUSINESSES DROPDOWN ───────────────────────────────── */}
            <div ref={bizRef} className="relative">
              <button
                onClick={() => setBizOpen(prev => !prev)}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 group ${
                  bizOpen ? 'text-[#E05D4B] bg-[#E05D4B]/8' : 'text-slate-600 hover:text-[#E05D4B] hover:bg-[#E05D4B]/5'
                }`}
              >
                <Users className={`w-4 h-4 transition-colors ${bizOpen ? 'text-[#E05D4B]' : 'text-stone-400 group-hover:text-[#E05D4B]'}`} />
                Businesses
                <motion.div animate={{ rotate: bizOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronDown className="w-3.5 h-3.5" />
                </motion.div>
              </button>

              {/* ── DROPDOWN PANEL ────────────────────────────────── */}
              <AnimatePresence>
                {bizOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.97 }}
                    transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute top-full right-0 mt-2 w-[580px] rounded-2xl overflow-hidden shadow-2xl border border-rose-100 z-50"
                    style={{ background: 'white' }}
                  >
                    {/* Dropdown header */}
                    <div
                      className="px-5 py-4 border-b border-rose-50"
                      style={{ background: 'linear-gradient(135deg, #FFF9F6, #FFF4EF)' }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                            <span className="text-sm font-bold text-stone-800">Featured Businesses</span>
                          </div>
                          <p className="text-xs text-stone-400 mt-0.5">
                            Handpicked women entrepreneurs across Tamil Nadu
                          </p>
                        </div>
                        <Link
                          to="/categories"
                          className="text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
                          style={{ color: '#E05D4B', background: 'rgba(224,93,75,0.08)' }}
                        >
                          View All →
                        </Link>
                      </div>
                    </div>

                    {/* Cards grid */}
                    <div className="p-4 max-h-[420px] overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
                      {featuredBeneficiaries.length === 0 ? (
                        <div className="text-center py-8 text-stone-400 text-sm">
                          No featured businesses yet.
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-3">
                          {featuredBeneficiaries.slice(0, 6).map((b, i) => (
                            <motion.div
                              key={b.id}
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: i * 0.05 }}
                            >
                              <Link
                                to={`/beneficiary/${b.id}`}
                                className="flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group/card border border-transparent hover:border-rose-100"
                                style={{ background: 'rgba(255,249,246,0.6)' }}
                                onMouseEnter={e => (e.currentTarget.style.background = '#FFF4EF')}
                                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,249,246,0.6)')}
                              >
                                {/* Avatar */}
                                <div
                                  className="w-12 h-12 rounded-xl flex-shrink-0 overflow-hidden border-2 border-rose-100"
                                  style={{ background: 'linear-gradient(135deg, #FFEDD5, #FDE68A)' }}
                                >
                                  {b.profile_image ? (
                                    <img
                                      src={b.profile_image}
                                      alt={b.business_name}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                      <Heart className="w-5 h-5" style={{ color: '#E05D4B' }} />
                                    </div>
                                  )}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-bold text-stone-800 truncate group-hover/card:text-[#E05D4B] transition-colors">
                                    {b.business_name}
                                  </p>
                                  {b.district && (
                                    <div className="flex items-center gap-1 mt-0.5">
                                      <MapPin className="w-3 h-3 flex-shrink-0" style={{ color: '#E05D4B' }} />
                                      <span className="text-xs text-stone-400 truncate">{b.district}</span>
                                    </div>
                                  )}
                                  {b.mobile_number && (
                                    <div className="flex items-center gap-1 mt-0.5">
                                      <Phone className="w-3 h-3 flex-shrink-0 text-stone-300" />
                                      <span className="text-xs text-stone-400 truncate">{b.mobile_number}</span>
                                    </div>
                                  )}
                                </div>
                              </Link>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Footer CTA */}
                    {featuredBeneficiaries.length > 6 && (
                      <div className="px-4 py-3 border-t border-rose-50 text-center" style={{ background: '#FFF9F6' }}>
                        <Link
                          to="/categories"
                          className="text-xs font-bold"
                          style={{ color: '#E05D4B' }}
                        >
                          +{featuredBeneficiaries.length - 6} more businesses → View All
                        </Link>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          {/* ── RIGHT SIDE ────────────────────────────────────────────── */}
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
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2.5 rounded-xl hover:bg-[#E05D4B]/8 transition-colors"
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

      {/* ── MOBILE MENU ───────────────────────────────────────────────── */}
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
                <motion.div key={link.label} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}>
                  <Link
                    to={link.to}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                      isActive(link.to) ? 'bg-[#E05D4B]/10 text-[#E05D4B]' : 'text-slate-600 hover:bg-[#E05D4B]/5 hover:text-[#E05D4B]'
                    }`}
                  >
                    <link.icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              {/* Mobile: Featured Businesses list */}
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: navLinks.length * 0.06 }}>
                <div className="px-4 py-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">Featured Businesses</p>
                  <div className="space-y-2">
                    {featuredBeneficiaries.slice(0, 4).map(b => (
                      <Link
                        key={b.id}
                        to={`/beneficiary/${b.id}`}
                        className="flex items-center gap-3 py-2 px-3 rounded-xl hover:bg-[#E05D4B]/5 transition-colors"
                      >
                        <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 border border-rose-100"
                          style={{ background: 'linear-gradient(135deg, #FFEDD5, #FDE68A)' }}>
                          {b.profile_image
                            ? <img src={b.profile_image} alt={b.business_name} className="w-full h-full object-cover" />
                            : <div className="w-full h-full flex items-center justify-center"><Heart className="w-3.5 h-3.5" style={{ color: '#E05D4B' }} /></div>
                          }
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-stone-700 truncate">{b.business_name}</p>
                          {b.district && <p className="text-xs text-stone-400 truncate">{b.district}</p>}
                        </div>
                      </Link>
                    ))}
                    <Link to="/categories" className="block text-xs font-bold text-center py-2" style={{ color: '#E05D4B' }}>
                      View All Businesses →
                    </Link>
                  </div>
                </div>
              </motion.div>

              {isAdmin && (
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: (navLinks.length + 1) * 0.06 }}>
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
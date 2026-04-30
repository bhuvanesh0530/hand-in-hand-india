import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Users, FolderOpen, TrendingUp, Sparkles,
  Star, Heart, ChevronRight, ChevronLeft, MapPin, Quote, Flower2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { BeneficiaryCard } from '../components/beneficiary/BeneficiaryCard';
import { CategoryCard } from '../components/category/CategoryCard';
import { useRef, useState, useCallback, useEffect } from 'react';

// ─── FEATURED DISTRICTS ───────────────────────────────────────────────────────
const FEATURED_DISTRICTS = [
  'Ariyalur', 'Chennai', 'Chengalpattu', 'Coimbatore', 'Cuddalore',
  'Dharmapuri', 'Dindigul', 'Erode', 'Kallakurichi', 'Kanchipuram',
  'Kanyakumari', 'Karur', 'Krishnagiri', 'Madurai', 'Mayiladuthurai',
  'Nagapattinam', 'Namakkal', 'Nilgiris', 'Perambalur', 'Pudukkottai',
  'Ramanathapuram', 'Ranipet', 'Salem', 'Sivaganga', 'Tenkasi',
  'Thanjavur', 'Theni', 'Tiruchirappalli', 'Tirunelveli', 'Tirupathur',
  'Tiruppur', 'Tiruvallur', 'Tiruvannamalai', 'Tiruvarur', 'Vellore',
  'Viluppuram', 'Virudhunagar',
].sort((a, b) => a.localeCompare(b));

const getDistrictImage = (district: string) =>
  `/illustrations/districts/${district.toLowerCase()}.png`;

// ─── QUOTES ───────────────────────────────────────────────────────────────────
const quotes = [
  {
    text: "Empowering women entrepreneurs through one unified platform — that's the spirit of Hand in Hand India.",
    author: "Hand in Hand India",
    role: "Program Team",
    location: "Kanchipuram",
    color: "from-indigo-50 via-violet-50 to-purple-50",
    accent: "#4338CA",
    accentLight: "#EEF2FF",
  },
  {
    text: "We believe every woman has the potential to build a thriving enterprise. Our mission is to give her the platform, the community, and the confidence to do so.",
    author: "Hand in Hand India",
    role: "Leadership Team",
    location: "Tamil Nadu",
    color: "from-amber-50 via-yellow-50 to-orange-50",
    accent: "#D97706",
    accentLight: "#FEF3C7",
  },
  {
    text: "Supporting women to build, manage, and grow their enterprises is how we transform communities — one Self-Help Group at a time.",
    author: "Hand in Hand India",
    role: "SHG Programme",
    location: "Tamil Nadu",
    color: "from-violet-50 via-indigo-50 to-blue-50",
    accent: "#3730A3",
    accentLight: "#E0E7FF",
  },
];

// ─── NETFLIX CAROUSEL ─────────────────────────────────────────────────────────
function NetflixCarousel<T>({
  items, renderItem, cardWidth = 180, gap = 16,
  title, subtitle, icon: Icon, viewAllTo, viewAllLabel,
  accentColor = '#4338CA',
}: {
  items: T[];
  renderItem: (item: T, i: number) => React.ReactNode;
  cardWidth?: number;
  gap?: number;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  viewAllTo: string;
  viewAllLabel: string;
  accentColor?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const scrollStep = (cardWidth + gap) * 3;

  const updateScrollState = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  }, []);

  // ✅ FIX: Run on mount so the right arrow appears immediately if content overflows
  useEffect(() => {
    // Small timeout to let the DOM fully render widths
    const timer = setTimeout(() => {
      updateScrollState();
    }, 100);
    return () => clearTimeout(timer);
  }, [updateScrollState, items]);

  // Also update on window resize
  useEffect(() => {
    window.addEventListener('resize', updateScrollState);
    return () => window.removeEventListener('resize', updateScrollState);
  }, [updateScrollState]);

  const scroll = (dir: 'left' | 'right') => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === 'left' ? -scrollStep : scrollStep, behavior: 'smooth' });
    setTimeout(updateScrollState, 400);
  };

  return (
    <div className="relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex items-end justify-between mb-8"
      >
        <div>
          <div
            className="flex items-center gap-2 font-bold text-xs mb-2 uppercase tracking-[0.18em]"
            style={{ color: accentColor }}
          >
            <Icon className="w-3.5 h-3.5" />
            {title}
          </div>
          <h2
            className="text-3xl sm:text-4xl font-extrabold"
            style={{ fontFamily: "'Playfair Display', Georgia, serif", color: '#1E1B4B' }}
          >
            {subtitle}
          </h2>
        </div>
        <Link
          to={viewAllTo}
          className="hidden sm:flex items-center gap-1 text-sm font-semibold hover:gap-2 transition-all duration-200"
          style={{ color: accentColor }}
        >
          {viewAllLabel} <ChevronRight className="w-4 h-4" />
        </Link>
      </motion.div>

      <div className="relative group/carousel">
        <AnimatePresence>
          {canScrollLeft && (
            <motion.button
              key="left"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-11 h-11 rounded-full bg-white shadow-xl flex items-center justify-center hover:scale-110 transition-transform"
              style={{ border: '1px solid #C7D2FE' }}
            >
              <ChevronLeft className="w-5 h-5" style={{ color: '#3730A3' }} />
            </motion.button>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {canScrollRight && (
            <motion.button
              key="right"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-11 h-11 rounded-full bg-white shadow-xl flex items-center justify-center hover:scale-110 transition-transform"
              style={{ border: '1px solid #C7D2FE' }}
            >
              <ChevronRight className="w-5 h-5" style={{ color: '#3730A3' }} />
            </motion.button>
          )}
        </AnimatePresence>

        <div
          ref={trackRef}
          onScroll={updateScrollState}
          className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {items.map((item, i) => (
            <div key={i} className="flex-shrink-0 snap-start" style={{ width: `${cardWidth}px` }}>
              {renderItem(item, i)}
            </div>
          ))}

          {/* View-all card */}
          <div className="flex-shrink-0 snap-start" style={{ width: `${cardWidth}px` }}>
            <Link to={viewAllTo}>
              <motion.div
                whileHover={{ y: -6, scale: 1.03 }}
                className="rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer h-full flex flex-col items-center justify-center text-white p-6 text-center min-h-[180px]"
                style={{ background: 'linear-gradient(135deg, #4338CA, #F59E0B)' }}
              >
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-3">
                  <ChevronRight className="w-6 h-6" />
                </div>
                <p className="text-sm font-bold">View All</p>
                <p className="text-xs text-white/70 mt-1">{viewAllLabel} →</p>
              </motion.div>
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-3 sm:hidden text-center">
        <Link to={viewAllTo} className="font-semibold text-sm" style={{ color: accentColor }}>
          {viewAllLabel} →
        </Link>
      </div>
    </div>
  );
}

// ─── DECORATIVE FLORAL SVG ────────────────────────────────────────────────────
function FloralAccent({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="55" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" opacity="0.4" />
      <circle cx="60" cy="60" r="40" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
      {[0,45,90,135,180,225,270,315].map((deg, i) => (
        <ellipse key={i} cx="60" cy="30" rx="6" ry="14" fill="currentColor" opacity="0.15"
          transform={`rotate(${deg} 60 60)`} />
      ))}
      <circle cx="60" cy="60" r="8" fill="currentColor" opacity="0.2" />
    </svg>
  );
}

// ─── MAIN HOME PAGE ───────────────────────────────────────────────────────────
export default function HomePage() {
  const { categories, beneficiaries, getChildCategories, isLoading } = useApp();

  const rootCategories = getChildCategories(null).sort((a: any, b: any) =>
    (a.name || '').localeCompare(b.name || '')
  );

  const allBeneficiaries = beneficiaries.filter(b => b.featured === true);

  const heroRef = useRef(null);
  const [activeQuote, setActiveQuote] = useState(0);

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);
  const blobY1 = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const blobY2 = useTransform(scrollYProgress, [0, 1], [0, 80]);

  return (
    <div className="relative overflow-x-hidden" style={{ fontFamily: "'Nunito', 'Helvetica Neue', sans-serif" }}>

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative min-h-[95vh] flex items-center justify-center overflow-hidden"
        style={{ background: 'linear-gradient(150deg, #F5F5FF 0%, #EEF2FF 30%, #F5F5FF 60%, #FFFBEB 100%)' }}
      >
        {/* Ambient blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            style={{ y: blobY1, background: 'radial-gradient(circle, rgba(67,56,202,0.15) 0%, rgba(99,102,241,0.08) 60%, transparent 100%)' }}
            animate={{ x: [0, 80, 0], y: [0, -40, 0], rotate: [0, 180, 360] }}
            transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
            className="absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full blur-3xl"
          />
          <motion.div
            style={{ y: blobY2, background: 'radial-gradient(circle, rgba(245,158,11,0.15) 0%, rgba(245,158,11,0.06) 60%, transparent 100%)' }}
            animate={{ x: [0, -60, 0], y: [0, 60, 0], rotate: [360, 180, 0] }}
            transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
            className="absolute bottom-1/4 left-1/4 w-[600px] h-[600px] rounded-full blur-3xl"
          />
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.05, 0.10, 0.05] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-3xl"
            style={{ background: 'radial-gradient(circle, rgba(67,56,202,0.12) 0%, transparent 70%)' }}
          />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: 'radial-gradient(circle, #4338CA 1px, transparent 1px)', backgroundSize: '44px 44px' }}
          />
          <FloralAccent className="absolute top-8 right-12 w-32 h-32 text-indigo-400 opacity-20" />
          <FloralAccent className="absolute bottom-12 left-8 w-24 h-24 text-amber-400 opacity-20" />
        </div>

        <motion.div
          style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}
          className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center"
        >
          {/* ✅ Logo with enhanced standalone glow */}
          <motion.div
            initial={{ opacity: 0, scale: 0.82 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center mb-8"
          >
            <div className="relative mb-5">
              {/* Outer soft glow — large radius, warm indigo+saffron */}
              <div
                className="absolute inset-0 -m-14 rounded-full blur-3xl"
                style={{
                  background: 'radial-gradient(circle, rgba(67,56,202,0.40) 0%, rgba(245,158,11,0.22) 50%, transparent 100%)',
                  opacity: 0.75,
                }}
              />
              {/* Inner sharp glow — tighter, more vivid */}
              <div
                className="absolute inset-0 -m-5 rounded-full blur-xl"
                style={{
                  background: 'radial-gradient(circle, rgba(99,102,241,0.55) 0%, rgba(245,158,11,0.15) 70%, transparent 100%)',
                  opacity: 0.60,
                }}
              />
              {/* Pulsing animated ring */}
              <motion.div
                animate={{ scale: [1, 1.12, 1], opacity: [0.25, 0.45, 0.25] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute inset-0 -m-6 rounded-full blur-2xl"
                style={{
                  background: 'radial-gradient(circle, rgba(79,70,229,0.45) 0%, transparent 70%)',
                }}
              />
              <img
                src="/logo.png"
                alt="Hand in Hand India"
                className="relative h-32 sm:h-44 lg:h-56 w-auto object-contain"
                style={{
                  filter: 'drop-shadow(0 0 28px rgba(99,102,241,0.40)) drop-shadow(0 0 10px rgba(245,158,11,0.25)) drop-shadow(0 4px 32px rgba(67,56,202,0.20))',
                }}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const fallback = document.getElementById('hero-logo-fallback');
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
              <div
                id="hero-logo-fallback"
                className="hidden w-32 h-32 sm:w-44 sm:h-44 rounded-3xl items-center justify-center shadow-2xl mx-auto"
                style={{ background: 'linear-gradient(135deg, #4338CA, #F59E0B)' }}
              >
                <Flower2 className="w-16 h-16 text-white" />
              </div>
            </div>

            {/* Tagline */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.6 }}
              className="flex items-center gap-3"
            >
              <div className="h-px w-8 bg-gradient-to-r from-transparent to-indigo-300" />
              <p
                className="text-sm sm:text-base font-bold tracking-[0.22em] uppercase"
                style={{
                  background: 'linear-gradient(90deg, #3730A3, #4338CA, #F59E0B)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Connect · Collaborate · Grow
              </p>
              <div className="h-px w-8 bg-gradient-to-l from-transparent to-amber-300" />
            </motion.div>
          </motion.div>

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold mb-8"
            style={{
              background: 'linear-gradient(135deg, rgba(67,56,202,0.08), rgba(245,158,11,0.08))',
              border: '1px solid rgba(67,56,202,0.20)',
              color: '#3730A3',
            }}
          >
            <motion.span animate={{ rotate: [0, 20, -20, 0] }} transition={{ duration: 2, repeat: Infinity }}>
              <Sparkles className="w-4 h-4" />
            </motion.span>
            Empowering Self-Help Groups across Tamil Nadu
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight mb-6"
            style={{ fontFamily: "'Playfair Display', Georgia, serif", color: '#1E1B4B' }}
          >
            Discover{' '}
            <span className="relative inline-block">
              <span style={{
                background: 'linear-gradient(90deg, #4338CA, #3730A3)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                Local Women
              </span>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="absolute -bottom-1 left-0 right-0 h-[3px] rounded-full origin-left"
                style={{ background: 'linear-gradient(90deg, #4338CA, #F59E0B)' }}
              />
            </span>
            <br />
            <span style={{ color: '#1E1B4B' }}>Entrepreneurs</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
            style={{ color: '#6B7280' }}
          >
            Connect with talented SHG members running small businesses across Tamil Nadu.
            Browse services, discover unique products, and support local communities.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.42 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Link to="/categories">
              <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.97 }}>
                <Button size="lg" icon={<ArrowRight className="w-5 h-5" />}>
                  Explore Categories
                </Button>
              </motion.div>
            </Link>
            <Link to="/districts">
              <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.97 }}>
                <Button variant="ghost" size="lg" icon={<MapPin className="w-5 h-5" />}>
                  Browse by District
                </Button>
              </motion.div>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="grid grid-cols-3 gap-5 max-w-md mx-auto"
          >
            {[
              { value: `${allBeneficiaries.length}+`, label: 'Businesses' },
              { value: `${categories.length}+`, label: 'Categories' },
              { value: '100%', label: 'Women-Led' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.08, y: -4 }}
                transition={{ type: 'spring', stiffness: 400 }}
                className="text-center p-4 rounded-2xl backdrop-blur-sm cursor-default"
                style={{
                  background: 'rgba(255,255,255,0.90)',
                  border: '1px solid rgba(67,56,202,0.12)',
                  boxShadow: '0 4px 24px rgba(67,56,202,0.08)',
                }}
              >
                <div
                  className="text-2xl sm:text-3xl font-extrabold"
                  style={{
                    background: 'linear-gradient(135deg, #4338CA, #F59E0B)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontFamily: "'Playfair Display', serif",
                  }}
                >
                  {stat.value}
                </div>
                <div className="text-xs font-semibold mt-1 tracking-wide uppercase" style={{ color: '#9CA3AF' }}>
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <div className="w-6 h-10 rounded-full border-2 flex items-start justify-center p-1.5"
            style={{ borderColor: '#C7D2FE' }}>
            <motion.div
              animate={{ y: [0, 14, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: '#4338CA' }}
            />
          </div>
        </motion.div>
      </section>

      {/* ── BROWSE BY DISTRICT ───────────────────────────────────────────── */}
      <section
        className="py-24 relative"
        style={{ background: 'linear-gradient(180deg, #F5F5FF 0%, #EEF2FF 100%)' }}
      >
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(67,56,202,0.25), transparent)' }} />
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-32 rounded-r-full opacity-40"
          style={{ background: 'linear-gradient(180deg, #4338CA, #F59E0B)' }} />

        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
          <NetflixCarousel
            items={FEATURED_DISTRICTS}
            cardWidth={168}
            gap={16}
            title="Browse by District"
            subtitle="Find Near You"
            icon={MapPin}
            viewAllTo="/districts"
            viewAllLabel="All 38 Districts"
            accentColor="#3730A3"
            renderItem={(district, i) => (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                whileHover={{ y: -8, scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                <Link to="/districts">
                  <div
                    className="rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer group"
                    style={{
                      border: '1px solid rgba(67,56,202,0.12)',
                      background: 'white',
                      boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                    }}
                  >
                    <div className="relative w-full aspect-square overflow-hidden"
                      style={{ background: '#EEF2FF' }}>
                      <img
                        src={getDistrictImage(district)}
                        alt={district}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          const parent = (e.target as HTMLImageElement).parentElement;
                          if (parent) {
                            (e.target as HTMLImageElement).style.display = 'none';
                            parent.style.background = 'linear-gradient(135deg, #EEF2FF, #FEF3C7)';
                          }
                        }}
                      />
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{ background: 'linear-gradient(to top, rgba(55,48,163,0.35), transparent)' }}
                      />
                    </div>
                    <div
                      className="px-3 py-2.5 transition-colors group-hover:bg-indigo-50"
                      style={{ background: 'white' }}
                    >
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3 h-3 flex-shrink-0" style={{ color: '#4338CA' }} />
                        <span className="text-xs font-bold truncate" style={{ color: '#1E1B4B' }}>{district}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )}
          />
        </div>
      </section>

      {/* ── BROWSE BY CATEGORY ─────────────────────────────────────────────── */}
      <section className="py-24 relative bg-white">
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(245,158,11,0.30), transparent)' }} />
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
          {isLoading ? (
            // ✅ Loading skeleton — shows while categories fetch
            <div>
              <div className="mb-8">
                <div className="h-4 w-36 rounded-full animate-pulse mb-3" style={{ background: '#EEF2FF' }} />
                <div className="h-10 w-64 rounded-xl animate-pulse" style={{ background: '#EEF2FF' }} />
              </div>
              <div className="flex gap-4 overflow-hidden pb-4">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className="flex-shrink-0 w-52 rounded-2xl animate-pulse"
                    style={{ height: '300px', background: '#EEF2FF' }} />
                ))}
              </div>
            </div>
          ) : rootCategories.length > 0 ? (
            // ✅ Category carousel — shows all root categories
            <NetflixCarousel
              items={rootCategories}
              cardWidth={210}
              gap={16}
              title="Browse by Category"
              subtitle="Find What You Need"
              icon={FolderOpen}
              viewAllTo="/categories"
              viewAllLabel="All Categories"
              accentColor="#4338CA"
              renderItem={(cat, i) => (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                >
                  <CategoryCard category={cat} index={i} />
                </motion.div>
              )}
            />
          ) : (
            // ✅ Empty state — only when truly no categories exist
            <div className="text-center py-16 rounded-2xl border"
              style={{ background: '#F5F5FF', borderColor: 'rgba(67,56,202,0.10)' }}>
              <FolderOpen className="w-12 h-12 mx-auto mb-4" style={{ color: '#C7D2FE' }} />
              <p style={{ color: '#6B7280' }}>No categories yet. Add them from the admin panel.</p>
            </div>
          )}
        </div>
      </section>

      {/* ── VOICES THAT INSPIRE ───────────────────────────────────────────── */}
      <section
        className="py-28 relative overflow-hidden"
        style={{ background: 'linear-gradient(150deg, #F5F5FF 0%, #EEF2FF 40%, #FFFBEB 100%)' }}
      >
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(67,56,202,0.20), transparent)' }} />
        <div className="absolute bottom-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(245,158,11,0.20), transparent)' }} />

        <div
          className="absolute top-6 left-8 text-[220px] font-black leading-none select-none pointer-events-none"
          style={{ color: 'rgba(67,56,202,0.04)', fontFamily: 'Georgia, serif' }}
        >"</div>
        <FloralAccent className="absolute top-8 right-16 w-40 h-40 text-indigo-400 opacity-10" />
        <FloralAccent className="absolute bottom-8 left-16 w-28 h-28 text-amber-400 opacity-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold mb-5"
              style={{
                background: 'rgba(67,56,202,0.08)',
                border: '1px solid rgba(67,56,202,0.18)',
                color: '#3730A3',
              }}
            >
              <Quote className="w-4 h-4" />
              Words of Empowerment
            </div>
            <h2
              className="text-3xl sm:text-5xl font-extrabold mb-4"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", color: '#1E1B4B' }}
            >
              Voices That Inspire
            </h2>
            <p className="max-w-md mx-auto text-sm leading-relaxed" style={{ color: '#6B7280' }}>
              Straight from the mission — our commitment to empowering women across Tamil Nadu
            </p>
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeQuote}
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.97 }}
              transition={{ duration: 0.45 }}
              className="relative max-w-3xl mx-auto mb-10"
            >
              <div
                className={`relative rounded-3xl p-10 sm:p-16 bg-gradient-to-br ${quotes[activeQuote].color} shadow-2xl text-center overflow-hidden`}
                style={{ border: '1px solid rgba(255,255,255,0.8)' }}
              >
                <div
                  className="absolute top-6 left-7 text-7xl font-black select-none leading-none"
                  style={{ color: quotes[activeQuote].accent, opacity: 0.12, fontFamily: 'Georgia, serif' }}
                >"</div>
                <div
                  className="absolute bottom-4 right-7 text-7xl font-black select-none leading-none rotate-180"
                  style={{ color: quotes[activeQuote].accent, opacity: 0.12, fontFamily: 'Georgia, serif' }}
                >"</div>

                <div
                  className="inline-flex w-12 h-12 rounded-2xl items-center justify-center mx-auto mb-7 shadow-md"
                  style={{ background: quotes[activeQuote].accentLight }}
                >
                  <Quote className="w-6 h-6" style={{ color: quotes[activeQuote].accent }} />
                </div>

                <p
                  className="text-lg sm:text-xl leading-relaxed font-medium mb-10 italic relative z-10"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif", color: '#1E1B4B' }}
                >
                  "{quotes[activeQuote].text}"
                </p>

                <div className="flex items-center justify-center gap-3">
                  <motion.div
                    animate={{ scale: [1, 1.08, 1] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                    className="w-11 h-11 rounded-full flex items-center justify-center shadow-lg"
                    style={{ background: `linear-gradient(135deg, ${quotes[activeQuote].accent}, #F59E0B)` }}
                  >
                    <Heart className="w-5 h-5 text-white fill-white" />
                  </motion.div>
                  <div className="text-left">
                    <p className="text-sm font-bold" style={{ color: '#1E1B4B' }}>{quotes[activeQuote].author}</p>
                    <p className="text-xs" style={{ color: '#6B7280' }}>
                      {quotes[activeQuote].role} · {quotes[activeQuote].location}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {quotes.map((q, i) => (
              <motion.button
                key={i}
                onClick={() => setActiveQuote(i)}
                whileHover={{ y: -3 }}
                className={`relative px-5 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 border ${
                  activeQuote === i ? 'bg-white shadow-lg' : 'bg-white/50 hover:bg-white/80'
                }`}
                style={{
                  color: activeQuote === i ? '#1E1B4B' : '#6B7280',
                  borderColor: activeQuote === i ? `${q.accent}44` : 'rgba(255,255,255,0.5)',
                }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full flex-shrink-0 transition-all duration-300"
                    style={{ background: activeQuote === i ? q.accent : '#D1D5DB' }} />
                  <span className="truncate max-w-[140px]">{q.author}</span>
                </div>
                <p className="text-xs mt-0.5 text-left truncate max-w-[140px]" style={{ color: '#9CA3AF' }}>{q.role}</p>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* ── OUR BUSINESSES ────────────────────────────────────────────────── */}
      <section className="py-24 relative bg-white">
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(245,158,11,0.35), transparent)' }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold mb-5"
              style={{ background: '#FEF3C7', border: '1px solid #FDE68A', color: '#92400E' }}
            >
              <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
              Our Businesses
            </div>
            <h2
              className="text-3xl sm:text-4xl font-extrabold"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", color: '#1E1B4B' }}
            >
              Meet Our Entrepreneurs
            </h2>
            <p className="mt-3 max-w-xl mx-auto" style={{ color: '#6B7280' }}>
              Discover talented women entrepreneurs and their amazing businesses across Tamil Nadu
            </p>
            <div className="flex items-center justify-center gap-3 mt-5">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-indigo-300" />
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-indigo-300" />
            </div>
          </motion.div>

          {allBeneficiaries.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {allBeneficiaries.map((b, i) => (
                <BeneficiaryCard key={b.id} beneficiary={b} index={i} />
              ))}
            </div>
          ) : (
            <div
              className="text-center py-16 rounded-3xl border"
              style={{ background: '#F5F5FF', borderColor: 'rgba(67,56,202,0.10)' }}
            >
              <Heart className="w-12 h-12 mx-auto mb-4" style={{ color: '#C7D2FE' }} />
              <p style={{ color: '#6B7280' }}>No featured businesses yet. Mark some from the admin panel.</p>
            </div>
          )}
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────────────────── */}
      <section
        className="py-24 relative"
        style={{ background: 'linear-gradient(150deg, #EEF2FF 0%, #F5F5FF 100%)' }}
      >
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(67,56,202,0.22), transparent)' }} />
        <FloralAccent className="absolute right-8 top-8 w-32 h-32 text-indigo-400 opacity-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2
              className="text-3xl sm:text-4xl font-extrabold"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", color: '#1E1B4B' }}
            >
              How It Works
            </h2>
            <p className="mt-3" style={{ color: '#6B7280' }}>Simple steps to connect with local businesses</p>
            <div className="flex items-center justify-center gap-3 mt-5">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-indigo-300" />
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-indigo-300" />
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: FolderOpen,
                title: 'Browse Categories',
                desc: 'Explore our organised categories to find the services and products you need.',
                gradient: 'linear-gradient(135deg, #4338CA, #818CF8)',
                num: '01',
              },
              {
                icon: Users,
                title: 'Discover Businesses',
                desc: 'View detailed profiles, services, photos and contact information.',
                gradient: 'linear-gradient(135deg, #F59E0B, #FCD34D)',
                num: '02',
              },
              {
                icon: TrendingUp,
                title: 'Connect & Support',
                desc: 'Reach out directly and support women entrepreneurs in your community.',
                gradient: 'linear-gradient(135deg, #3730A3, #F59E0B)',
                num: '03',
              },
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="relative text-center p-8 rounded-3xl cursor-default bg-white"
                style={{
                  border: '1px solid rgba(67,56,202,0.10)',
                  boxShadow: '0 8px 40px rgba(67,56,202,0.07)',
                }}
              >
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="inline-flex w-16 h-16 rounded-2xl items-center justify-center shadow-lg mb-6"
                  style={{ background: step.gradient }}
                >
                  <step.icon className="w-8 h-8 text-white" />
                </motion.div>
                <div className="absolute top-5 right-6 text-5xl font-black"
                  style={{ color: '#EEF2FF', fontFamily: "'Playfair Display', serif" }}>
                  {step.num}
                </div>
                <h3 className="text-xl font-bold mb-3" style={{ color: '#1E1B4B' }}>{step.title}</h3>
                <p className="leading-relaxed" style={{ color: '#6B7280' }}>{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="py-24 relative bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.01 }}
            className="relative rounded-3xl p-10 sm:p-16 text-center overflow-hidden cursor-default"
            style={{ background: 'linear-gradient(135deg, #3730A3 0%, #4338CA 50%, #F59E0B 100%)' }}
          >
            <div className="absolute top-0 right-0 w-72 h-72 rounded-full blur-3xl"
              style={{ background: 'rgba(255,255,255,0.10)', transform: 'translate(50%, -50%)' }} />
            <div className="absolute bottom-0 left-0 w-56 h-56 rounded-full blur-3xl"
              style={{ background: 'rgba(255,255,255,0.10)', transform: 'translate(-50%, 50%)' }} />
            <div className="absolute inset-0 opacity-[0.04]"
              style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
            <FloralAccent className="absolute right-8 top-8 w-32 h-32 text-white opacity-10" />

            <div className="relative">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="text-5xl mb-6"
              >
                🤝
              </motion.div>
              <h2
                className="text-3xl sm:text-4xl font-extrabold text-white mb-4"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Ready to Support Local?
              </h2>
              <p className="text-white/80 mb-8 max-w-lg mx-auto text-lg">
                Start browsing categories and discover amazing businesses run by talented women entrepreneurs in your community.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/categories">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    className="px-8 py-4 bg-white font-extrabold rounded-2xl shadow-2xl transition-all text-lg"
                    style={{ color: '#4338CA' }}
                  >
                    Explore Categories →
                  </motion.button>
                </Link>
                <Link to="/districts">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    className="px-8 py-4 font-extrabold rounded-2xl border transition-all text-lg"
                    style={{ background: 'rgba(255,255,255,0.15)', color: 'white', borderColor: 'rgba(255,255,255,0.35)' }}
                  >
                    Browse Districts →
                  </motion.button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
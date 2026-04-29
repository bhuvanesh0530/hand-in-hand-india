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
import { useRef, useState, useCallback } from 'react';

// ─── FEATURED DISTRICTS ───────────────────────────────────────────────────────
const FEATURED_DISTRICTS = [
  'Chennai', 'Coimbatore', 'Madurai', 'Salem', 'Tiruchirappalli', 'Vellore',
  'Kanchipuram', 'Thanjavur', 'Tirunelveli', 'Erode',
];

const getDistrictImage = (district: string) =>
  `/illustrations/districts/${district.toLowerCase()}.png`;

// ─── QUOTES ───────────────────────────────────────────────────────────────────
const quotes = [
  {
    text: "This platform gave my small business a voice. Now customers from across the district know my name.",
    author: "Meena Devi",
    role: "SHG Member · Weaving",
    location: "Madurai",
    color: "from-[#FF6F61]/15 to-[#FFD54F]/10",
    accent: "#FF6F61",
  },
  {
    text: "Empowering women entrepreneurs through one unified platform — that's the spirit of Hand in Hand India.",
    author: "Hand in Hand India",
    role: "Program Team",
    location: "Kanchipuram",
    color: "from-[#26A69A]/15 to-[#4DD0C4]/10",
    accent: "#26A69A",
  },
  {
    text: "Supporting women to build, manage, and grow their enterprises is how we transform communities.",
    author: "Lakshmi Priya",
    role: "SHG Leader · Food Products",
    location: "Salem",
    color: "from-[#C2410C]/12 to-[#FFD54F]/10",
    accent: "#C2410C",
  },
];

// ─── NETFLIX CAROUSEL ─────────────────────────────────────────────────────────
function NetflixCarousel<T>({
  items,
  renderItem,
  cardWidth = 180,
  gap = 16,
  title,
  subtitle,
  icon: Icon,
  viewAllTo,
  viewAllLabel,
  accentColor = '#FF6F61',
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
  const [canScrollRight, setCanScrollRight] = useState(true);

  const scrollStep = (cardWidth + gap) * 3;

  const updateScrollState = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  }, []);

  const scroll = (dir: 'left' | 'right') => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === 'left' ? -scrollStep : scrollStep, behavior: 'smooth' });
    setTimeout(updateScrollState, 400);
  };

  return (
    <div className="relative">
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex items-end justify-between mb-8"
      >
        <div>
          <div
            className="flex items-center gap-2 font-bold text-sm mb-2 uppercase tracking-wider"
            style={{ color: accentColor }}
          >
            <Icon className="w-4 h-4" />
            {title}
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 font-serif">{subtitle}</h2>
        </div>
        <Link
          to={viewAllTo}
          className="hidden sm:flex items-center gap-1 text-sm font-semibold hover:gap-2 transition-all duration-200"
          style={{ color: accentColor }}
        >
          {viewAllLabel} <ChevronRight className="w-4 h-4" />
        </Link>
      </motion.div>

      {/* Carousel wrapper */}
      <div className="relative group/carousel">
        {/* Left arrow */}
        <AnimatePresence>
          {canScrollLeft && (
            <motion.button
              key="left"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-11 h-11 rounded-full bg-white shadow-xl border border-rose-100 flex items-center justify-center hover:scale-110 transition-transform"
              style={{ boxShadow: `0 4px 24px rgba(0,0,0,0.12)` }}
            >
              <ChevronLeft className="w-5 h-5 text-stone-700" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Right arrow */}
        <AnimatePresence>
          {canScrollRight && (
            <motion.button
              key="right"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-11 h-11 rounded-full bg-white shadow-xl border border-rose-100 flex items-center justify-center hover:scale-110 transition-transform"
            >
              <ChevronRight className="w-5 h-5 text-stone-700" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Track */}
        <div
          ref={trackRef}
          onScroll={updateScrollState}
          className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {items.map((item, i) => (
            <div
              key={i}
              className="flex-shrink-0 snap-start"
              style={{ width: `${cardWidth}px` }}
            >
              {renderItem(item, i)}
            </div>
          ))}

          {/* View-all card */}
          <div className="flex-shrink-0 snap-start" style={{ width: `${cardWidth}px` }}>
            <Link to={viewAllTo}>
              <motion.div
                whileHover={{ y: -6, scale: 1.03 }}
                className="rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer h-full flex flex-col items-center justify-center text-white p-6 text-center min-h-[180px]"
                style={{ background: `linear-gradient(135deg, ${accentColor}, #26A69A)` }}
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

      {/* Mobile link */}
      <div className="mt-3 sm:hidden text-center">
        <Link to={viewAllTo} className="font-semibold text-sm" style={{ color: accentColor }}>
          {viewAllLabel} →
        </Link>
      </div>
    </div>
  );
}

// ─── MAIN HOME PAGE ───────────────────────────────────────────────────────────
export default function HomePage() {
  const { categories, beneficiaries, getChildCategories, isLoading } = useApp();
  const rootCategories = getChildCategories(null);
  const featuredBeneficiaries = beneficiaries.filter(b => b.featured).slice(0, 6);
  const heroRef = useRef(null);
  const [activeQuote, setActiveQuote] = useState(0);

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);
  const blobY1 = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const blobY2 = useTransform(scrollYProgress, [0, 1], [0, 80]);

  return (
    <div className="relative overflow-x-hidden">

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative min-h-[95vh] flex items-center justify-center overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #FFF5F0 0%, #FFF8F5 45%, #F0FAF9 100%)' }}
      >
        {/* Warm ambient blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div style={{ y: blobY1 }}
            animate={{ x: [0, 80, 0], y: [0, -40, 0], rotate: [0, 180, 360] }}
            transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
            className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-[#FF6F61]/22 to-[#FFD54F]/18 rounded-full blur-3xl"
          />
          <motion.div style={{ y: blobY2 }}
            animate={{ x: [0, -60, 0], y: [0, 60, 0], rotate: [360, 180, 0] }}
            transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
            className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-[#26A69A]/18 to-[#26A69A]/8 rounded-full blur-3xl"
          />
          {/* Delicate petal pattern */}
          <div
            className="absolute inset-0 opacity-[0.035]"
            style={{ backgroundImage: 'radial-gradient(circle, #C2410C 1px, transparent 1px)', backgroundSize: '44px 44px' }}
          />
        </div>

        <motion.div
          style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}
          className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center"
        >
          {/* Logo / Brand mark */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center mb-8"
          >
            {/* 
              *** YOUR LOGO GOES HERE ***
              Replace /logo.png with the actual path to your uploaded transparent logo.
              The logo will display prominently with the tagline below it.
            */}
            <div className="relative mb-4">
              <img
                src="/logo.png"
                alt="District Marketplace"
                className="h-20 sm:h-24 lg:h-28 w-auto object-contain drop-shadow-lg"
                onError={(e) => {
                  // If logo not yet uploaded, show elegant placeholder
                  e.currentTarget.style.display = 'none';
                  const fallback = document.getElementById('hero-logo-fallback');
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
              {/* Fallback elegant badge */}
              <div
                id="hero-logo-fallback"
                className="hidden w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-[#FF6F61] to-[#26A69A] items-center justify-center shadow-2xl shadow-[#FF6F61]/30 mx-auto"
              >
                <Flower2 className="w-10 h-10 text-white" />
              </div>
            </div>
            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-base sm:text-lg font-bold tracking-[0.2em] uppercase"
              style={{
                background: 'linear-gradient(90deg, #C2410C, #FF6F61, #26A69A)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Connect · Collaborate · Grow
            </motion.p>
          </motion.div>

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#FF6F61]/12 to-[#26A69A]/12 backdrop-blur-sm border border-[#FF6F61]/20 rounded-full text-[#C2410C] text-sm font-bold mb-7"
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
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-stone-900 leading-tight mb-6 font-serif"
          >
            Discover{' '}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-[#FF6F61] to-[#26A69A] bg-clip-text text-transparent">
                Local Women
              </span>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="absolute -bottom-1 left-0 right-0 h-[3px] bg-gradient-to-r from-[#FF6F61] to-[#26A69A] rounded-full origin-left"
              />
            </span>
            <br />
            <span className="text-stone-700">Entrepreneurs</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-lg sm:text-xl text-stone-500 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Connect with talented SHG members running small businesses across Tamil Nadu.
            Browse services, discover unique products, and support local communities.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
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
              { value: `${beneficiaries.length}+`, label: 'Businesses' },
              { value: `${categories.length}+`, label: 'Categories' },
              { value: '100%', label: 'Women-Led' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.08, y: -4 }}
                transition={{ type: 'spring', stiffness: 400 }}
                className="text-center p-4 rounded-2xl bg-white/80 backdrop-blur-sm border border-[#FF6F61]/12 shadow-lg cursor-default"
              >
                <div
                  className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-[#FF6F61] to-[#26A69A] bg-clip-text text-transparent"
                >
                  {stat.value}
                </div>
                <div className="text-xs text-stone-500 font-medium mt-1">{stat.label}</div>
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
          <div className="w-6 h-10 rounded-full border-2 border-stone-300 flex items-start justify-center p-1.5">
            <motion.div
              animate={{ y: [0, 14, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-[#FF6F61]"
            />
          </div>
        </motion.div>
      </section>

      {/* ── BROWSE BY DISTRICT — Netflix Carousel ─────────────────────────── */}
      <section className="py-20 relative bg-gradient-to-b from-[#FFF8F0] to-white">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#FF6F61]/20 to-transparent" />
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
            accentColor="#C2410C"
            renderItem={(district, i) => (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -6, scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Link to="/districts">
                  <div className="rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-[#FF6F61]/10 bg-white group cursor-pointer">
                    <div className="relative w-full aspect-square bg-[#FDF6F0] overflow-hidden">
                      <img
                        src={getDistrictImage(district)}
                        alt={district}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          const parent = (e.target as HTMLImageElement).parentElement;
                          if (parent) {
                            (e.target as HTMLImageElement).style.display = 'none';
                            parent.style.background = 'linear-gradient(135deg, #FFEDD5, #FDE68A)';
                          }
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#C2410C]/35 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <div className="px-3 py-2.5 bg-white group-hover:bg-[#FFF1EE] transition-colors">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3 h-3 text-[#C2410C] flex-shrink-0" />
                        <span className="text-xs font-bold text-stone-700 truncate">{district}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )}
          />
        </div>
      </section>

      {/* ── BROWSE BY CATEGORY — Netflix Carousel ─────────────────────────── */}
      <section className="py-20 relative bg-white">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#26A69A]/20 to-transparent" />
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
          {isLoading ? (
            <div className="flex gap-4 overflow-hidden pb-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="flex-shrink-0 w-44 h-56 rounded-2xl bg-stone-100 animate-pulse" />
              ))}
            </div>
          ) : rootCategories.length > 0 ? (
            <NetflixCarousel
              items={rootCategories.slice(0, 12)}
              cardWidth={200}
              gap={16}
              title="Browse by Category"
              subtitle="Find What You Need"
              icon={FolderOpen}
              viewAllTo="/categories"
              viewAllLabel="All Categories"
              accentColor="#FF6F61"
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
            <div className="text-center py-16 bg-stone-50 rounded-2xl border border-stone-100">
              <FolderOpen className="w-12 h-12 text-stone-300 mx-auto mb-4" />
              <p className="text-stone-500">No categories yet. Add them from the admin panel.</p>
            </div>
          )}
        </div>
      </section>

      {/* ── VOICES THAT INSPIRE (Image 4 enhanced) ───────────────────────── */}
      <section className="py-24 relative overflow-hidden bg-gradient-to-br from-[#FFF8F5] via-[#FDF6F0] to-[#F0FAF9]">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#FF6F61]/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#26A69A]/20 to-transparent" />

        {/* Decorative large quote watermark */}
        <div className="absolute top-8 left-8 text-[200px] font-black leading-none text-[#FF6F61]/5 select-none pointer-events-none">"</div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#FF6F61]/10 rounded-full text-[#C2410C] text-sm font-bold mb-4 border border-[#FF6F61]/15">
              <Quote className="w-4 h-4" />
              Words of Empowerment
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 font-serif">Voices That Inspire</h2>
            <p className="mt-3 text-stone-500 max-w-md mx-auto text-sm leading-relaxed">
              Real stories of resilience, community, and growth from our amazing women entrepreneurs
            </p>
          </motion.div>

          {/* Featured quote (large) */}
          <motion.div
            key={activeQuote}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative max-w-3xl mx-auto mb-10"
          >
            <div
              className={`relative rounded-3xl p-10 sm:p-14 bg-gradient-to-br ${quotes[activeQuote].color} backdrop-blur-xl border border-white/60 shadow-2xl text-center overflow-hidden`}
            >
              <div className="absolute top-6 left-6 text-7xl font-black opacity-15 select-none" style={{ color: quotes[activeQuote].accent }}>"</div>
              <div className="absolute bottom-6 right-6 text-7xl font-black opacity-15 select-none rotate-180" style={{ color: quotes[activeQuote].accent }}>"</div>

              <Quote className="w-10 h-10 mx-auto mb-6 opacity-40" style={{ color: quotes[activeQuote].accent }} />
              <p className="text-stone-800 text-lg sm:text-xl leading-relaxed font-medium mb-8 italic relative z-10">
                "{quotes[activeQuote].text}"
              </p>
              <div className="flex items-center justify-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg"
                  style={{ background: `linear-gradient(135deg, ${quotes[activeQuote].accent}, #26A69A)` }}
                >
                  <Heart className="w-5 h-5 text-white fill-white" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-stone-800">{quotes[activeQuote].author}</p>
                  <p className="text-xs text-stone-500">{quotes[activeQuote].role} · {quotes[activeQuote].location}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Quote selector dots + mini cards */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {quotes.map((q, i) => (
              <motion.button
                key={i}
                onClick={() => setActiveQuote(i)}
                whileHover={{ y: -3 }}
                className={`relative px-5 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 border ${
                  activeQuote === i
                    ? 'bg-white shadow-lg border-[#FF6F61]/30 text-[#C2410C]'
                    : 'bg-white/50 border-white/40 text-stone-500 hover:bg-white/80'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0 transition-all duration-300"
                    style={{ background: activeQuote === i ? q.accent : '#d1d5db' }}
                  />
                  <span className="truncate max-w-[140px]">{q.author}</span>
                </div>
                <p className="text-xs text-stone-400 mt-0.5 text-left truncate max-w-[140px]">{q.role}</p>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED BUSINESSES ───────────────────────────────────────────── */}
      <section className="py-24 relative bg-white">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-200 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 rounded-full text-amber-700 text-sm font-bold mb-4 border border-amber-100">
              <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
              Featured Businesses
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 font-serif">Star Entrepreneurs</h2>
            <p className="mt-2 text-stone-500">Meet our top-rated women entrepreneurs and their amazing businesses</p>
          </motion.div>

          {featuredBeneficiaries.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredBeneficiaries.map((b, i) => (
                <BeneficiaryCard key={b.id} beneficiary={b} index={i} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-stone-50 rounded-2xl border border-stone-100">
              <Heart className="w-12 h-12 text-stone-300 mx-auto mb-4" />
              <p className="text-stone-500">No featured businesses yet. Mark some as featured in the admin panel.</p>
            </div>
          )}
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <section className="py-24 relative bg-gradient-to-br from-[#F0FAF9] to-[#FFF8F5]">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#26A69A]/20 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 font-serif">How It Works</h2>
            <p className="mt-2 text-stone-500">Simple steps to connect with local businesses</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: FolderOpen, title: 'Browse Categories', desc: 'Explore our organized categories to find the services and products you need.', color: 'from-[#FF6F61] to-[#FFB5A8]' },
              { icon: Users, title: 'Discover Businesses', desc: 'View detailed profiles, services, photos and contact information.', color: 'from-[#26A69A] to-[#4DD0C4]' },
              { icon: TrendingUp, title: 'Connect & Support', desc: 'Reach out directly and support women entrepreneurs in your community.', color: 'from-[#FFD54F] to-[#F97316]' },
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="relative text-center p-8 bg-white/80 backdrop-blur-xl border border-white/60 rounded-3xl shadow-lg cursor-default"
              >
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className={`inline-flex w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} items-center justify-center shadow-lg mb-6`}
                >
                  <step.icon className="w-8 h-8 text-white" />
                </motion.div>
                <div className="absolute top-6 right-6 text-5xl font-black text-stone-100">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <h3 className="text-xl font-bold text-stone-900 mb-3">{step.title}</h3>
                <p className="text-stone-500 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="py-24 relative bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.01 }}
            className="relative bg-gradient-to-br from-[#FF6F61] via-[#e8594d] to-[#26A69A] rounded-3xl p-10 sm:p-16 text-center overflow-hidden cursor-default"
          >
            <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-56 h-56 bg-white/10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '32px 32px' }}
            />
            <div className="relative">
              <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 3, repeat: Infinity }} className="text-5xl mb-6">🤝</motion.div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 font-serif">Ready to Support Local?</h2>
              <p className="text-white/80 mb-8 max-w-lg mx-auto text-lg">
                Start browsing categories and discover amazing businesses run by talented women entrepreneurs in your community.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/categories">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    className="px-8 py-4 bg-white text-[#FF6F61] font-extrabold rounded-2xl shadow-2xl hover:shadow-white/25 transition-all text-lg"
                  >
                    Explore Categories →
                  </motion.button>
                </Link>
                <Link to="/districts">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    className="px-8 py-4 bg-white/20 text-white font-extrabold rounded-2xl border border-white/40 hover:bg-white/30 transition-all text-lg"
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
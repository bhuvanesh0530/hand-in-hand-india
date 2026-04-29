import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Users, FolderOpen, TrendingUp, Sparkles,
  Star, Heart, ChevronRight, MapPin, Quote
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { BeneficiaryCard } from '../components/beneficiary/BeneficiaryCard';
import { CategoryCard } from '../components/category/CategoryCard';
import { useRef } from 'react';

// ✅ 6 featured districts shown on homepage with illustrations
const FEATURED_DISTRICTS = [
  'Chennai', 'Coimbatore', 'Madurai', 'Salem', 'Tiruchirappalli', 'Vellore',
  'Kanchipuram', 'Thanjavur', 'Tirunelveli', 'Erode'
];

const getDistrictImage = (district: string) =>
  `/illustrations/districts/${district.toLowerCase()}.png`;

const quotes = [
  { text: "Empowering women entrepreneurs through one unified platform.", author: "Hand in Hand India" },
  { text: "Every business has a story of empowerment, resilience, and community spirit.", author: "SHG Member, Coimbatore" },
  { text: "Supporting women to build, manage, and grow their enterprises.", author: "Hand in Hand India" },
];

function FloatingCard({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8, scale: 1.02, boxShadow: '0 32px 64px rgba(0,0,0,0.12)' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function HomePage() {
  const { categories, beneficiaries, getChildCategories, isLoading } = useApp();
  const rootCategories = getChildCategories(null);
  const featuredBeneficiaries = beneficiaries.filter(b => b.featured).slice(0, 6);
  const heroRef = useRef(null);
  const quotesRef = useRef(null);

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);
  const blobY1 = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const blobY2 = useTransform(scrollYProgress, [0, 1], [0, 80]);

  return (
    <div className="relative overflow-x-hidden">

      {/* ── HERO ── */}
      <section ref={heroRef} className="relative min-h-[95vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#FDF6F0] via-[#FFF8F5] to-[#F0FAF9]">

        {/* Warm ambient blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div style={{ y: blobY1 }}
            animate={{ x: [0, 80, 0], y: [0, -40, 0], rotate: [0, 180, 360] }}
            transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
            className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-[#FF6F61]/25 to-[#FFD54F]/20 rounded-full blur-3xl"
          />
          <motion.div style={{ y: blobY2 }}
            animate={{ x: [0, -60, 0], y: [0, 60, 0], rotate: [360, 180, 0] }}
            transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
            className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-[#26A69A]/20 to-[#26A69A]/10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ x: [0, 40, 0], y: [0, -60, 0] }}
            transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-1/3 left-1/3 w-72 h-72 bg-gradient-to-br from-[#FFD54F]/15 to-[#FF6F61]/12 rounded-full blur-3xl"
          />
          {/* Warm dot pattern */}
          <div className="absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: 'radial-gradient(circle, #C2410C 1px, transparent 1px)', backgroundSize: '40px 40px' }}
          />
        </div>

        <motion.div
          style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}
          className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#FF6F61]/15 to-[#26A69A]/15 backdrop-blur-sm border border-[#FF6F61]/25 rounded-full text-[#C2410C] text-sm font-bold mb-8"
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
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-stone-900 leading-tight mb-6"
          >
            Discover{' '}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-[#FF6F61] to-[#26A69A] bg-clip-text text-transparent">Local Women</span>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.9, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-[#FF6F61] to-[#26A69A] rounded-full origin-left"
              />
            </span>
            <br />
            <span className="text-stone-700">Entrepreneurs</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg sm:text-xl text-stone-500 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Connect with talented SHG members running small businesses across Tamil Nadu.
            Browse services, discover unique products, and support local communities.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
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
            transition={{ duration: 0.7, delay: 0.4 }}
            className="grid grid-cols-3 gap-6 max-w-md mx-auto"
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
                className="text-center p-4 rounded-2xl bg-white/80 backdrop-blur-sm border border-[#FF6F61]/15 shadow-lg cursor-default"
              >
                <div className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-[#FF6F61] to-[#26A69A] bg-clip-text text-transparent">{stat.value}</div>
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

      {/* ── BROWSE BY DISTRICT — Horizontal scroll with illustrations ── */}
      <section className="py-20 relative bg-gradient-to-b from-[#FFF8F0] to-white">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#FF6F61]/20 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-end justify-between mb-10"
          >
            <div>
              <div className="flex items-center gap-2 text-[#C2410C] font-bold text-sm mb-2 uppercase tracking-wider">
                <MapPin className="w-4 h-4" />
                Browse by District
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900">Find Near You</h2>
              <p className="mt-2 text-stone-500">Discover women entrepreneurs in your district</p>
            </div>
            <Link to="/districts" className="hidden sm:flex items-center gap-1 text-[#C2410C] font-semibold hover:gap-2 transition-all text-sm">
              All districts <ChevronRight className="w-4 h-4" />
            </Link>
          </motion.div>

          {/* ✅ Horizontal scrolling district cards with illustrations */}
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {FEATURED_DISTRICTS.map((district, i) => (
              <motion.div
                key={district}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                whileHover={{ y: -6, scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex-shrink-0 snap-start"
                style={{ width: '160px' }}
              >
                <Link to="/districts">
                  <div className="rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-[#FF6F61]/10 bg-white group cursor-pointer">
                    {/* District illustration */}
                    <div className="relative w-full aspect-square bg-[#FDF6F0] overflow-hidden">
                      <img
                        src={getDistrictImage(district)}
                        alt={district}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          // Fallback: warm gradient placeholder when illustration missing
                          const parent = (e.target as HTMLImageElement).parentElement;
                          if (parent) {
                            (e.target as HTMLImageElement).style.display = 'none';
                            parent.style.background = `linear-gradient(135deg, #FFEDD5, #FDE68A)`;
                          }
                        }}
                      />
                      {/* Gradient overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#FF6F61]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    {/* District name */}
                    <div className="px-3 py-2.5 bg-white group-hover:bg-[#FFF1EE] transition-colors">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3 h-3 text-[#C2410C] flex-shrink-0" />
                        <span className="text-xs font-bold text-stone-700 truncate">{district}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}

            {/* "View all" card at end */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: FEATURED_DISTRICTS.length * 0.07 }}
              whileHover={{ y: -6, scale: 1.03 }}
              className="flex-shrink-0 snap-start"
              style={{ width: '160px' }}
            >
              <Link to="/districts">
                <div className="rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-[#FF6F61] to-[#26A69A] cursor-pointer h-full flex flex-col items-center justify-center text-white p-6 text-center min-h-[160px]">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-3">
                    <ChevronRight className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-bold">All 38 Districts</p>
                  <p className="text-xs text-white/70 mt-1">View all →</p>
                </div>
              </Link>
            </motion.div>
          </div>

          {/* Mobile "All districts" link */}
          <div className="mt-4 sm:hidden text-center">
            <Link to="/districts" className="text-[#C2410C] font-semibold text-sm">
              View all 38 districts →
            </Link>
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="py-24 relative bg-white">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#26A69A]/20 to-transparent" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-end justify-between mb-12"
          >
            <div>
              <div className="flex items-center gap-2 text-[#FF6F61] font-bold text-sm mb-2 uppercase tracking-wider">
                <FolderOpen className="w-4 h-4" />
                Browse by Category
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900">Find What You Need</h2>
              <p className="mt-2 text-stone-500">Explore our diverse range of services and businesses</p>
            </div>
            <Link to="/categories" className="hidden sm:flex items-center gap-1 text-[#FF6F61] font-semibold hover:gap-2 transition-all text-sm">
              View all <ChevronRight className="w-4 h-4" />
            </Link>
          </motion.div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-52 rounded-2xl bg-stone-100 animate-pulse" />
              ))}
            </div>
          ) : rootCategories.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {rootCategories.slice(0, 8).map((cat, i) => (
                <CategoryCard key={cat.id} category={cat} index={i} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-stone-50 rounded-2xl border border-stone-100">
              <FolderOpen className="w-12 h-12 text-stone-300 mx-auto mb-4" />
              <p className="text-stone-500">No categories yet. Add them from the admin panel.</p>
            </div>
          )}
        </div>
      </section>

      {/* ── QUOTES SECTION ── */}
      <section ref={quotesRef} className="py-24 relative overflow-hidden bg-gradient-to-br from-[#FFF8F5] via-[#FDF6F0] to-[#F0FAF9]">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#FF6F61]/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#26A69A]/20 to-transparent" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#FF6F61]/10 rounded-full text-[#C2410C] text-sm font-bold mb-4">
              <Quote className="w-4 h-4" />
              Words of Empowerment
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900">Voices That Inspire</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quotes.map((quote, i) => (
              <FloatingCard key={i} delay={i * 0.15} className="bg-white/90 backdrop-blur-xl border border-[#FF6F61]/10 rounded-3xl p-8 shadow-xl relative overflow-hidden cursor-default">
                <div className="absolute top-4 right-4 text-6xl font-black text-[#FF6F61]/8 select-none">"</div>
                <Quote className="w-8 h-8 text-[#FF6F61]/40 mb-4" />
                <p className="text-stone-700 leading-relaxed font-medium mb-4 text-sm">{quote.text}</p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF6F61] to-[#26A69A] flex items-center justify-center">
                    <Heart className="w-4 h-4 text-white fill-white" />
                  </div>
                  <span className="text-xs font-semibold text-stone-500">{quote.author}</span>
                </div>
              </FloatingCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED BUSINESSES ── */}
      <section className="py-24 relative bg-white">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-200 to-transparent" />
        </div>
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
            <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900">Star Entrepreneurs</h2>
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

      {/* ── HOW IT WORKS ── */}
      <section className="py-24 relative bg-gradient-to-br from-[#F0FAF9] to-[#FFF8F5]">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#26A69A]/20 to-transparent" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900">How It Works</h2>
            <p className="mt-2 text-stone-500">Simple steps to connect with local businesses</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: FolderOpen, title: 'Browse Categories', desc: 'Explore our organized categories to find services you need.', color: 'from-[#FF6F61] to-[#FFB5A8]' },
              { icon: Users, title: 'Discover Businesses', desc: 'View detailed profiles, services, photos and contact info.', color: 'from-[#26A69A] to-[#4DD0C4]' },
              { icon: TrendingUp, title: 'Connect & Support', desc: 'Reach out directly and support women entrepreneurs.', color: 'from-[#FFD54F] to-[#F97316]' },
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

      {/* ── CTA ── */}
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
            <div className="relative">
              <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 3, repeat: Infinity }} className="text-5xl mb-6">🤝</motion.div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">Ready to Support Local?</h2>
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
import { motion } from 'framer-motion';
import { Heart, Mail, Phone, MapPin, Share2, ThumbsUp, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="relative mt-24 overflow-hidden">
      {/* Top gradient divider — tricolor brand */}
      <div className="h-1" style={{ background: 'linear-gradient(90deg, #E05D4B, #F5B754, #1D9B8A)' }} />

      <div
        className="relative text-white"
        style={{ background: 'linear-gradient(150deg, #1a0806 0%, #2d1108 50%, #0a1a17 100%)' }}
      >
        {/* Decorative ambient blobs */}
        <div
          className="absolute top-10 left-10 w-72 h-72 rounded-full blur-3xl pointer-events-none"
          style={{ background: 'rgba(224,93,75,0.12)' }}
        />
        <div
          className="absolute bottom-10 right-10 w-56 h-56 rounded-full blur-3xl pointer-events-none"
          style={{ background: 'rgba(29,155,138,0.12)' }}
        />
        <div
          className="absolute top-1/2 left-1/2 w-[500px] h-[500px] rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2"
          style={{ background: 'rgba(245,183,84,0.05)' }}
        />

        {/* Subtle dot texture */}
        <div
          className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '36px 36px' }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

            {/* ── BRAND ─────────────────────────────────────────────────── */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex items-center gap-4 mb-5"
              >
                {/* Animated heart icon */}
                <motion.div
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-11 h-11 rounded-full flex items-center justify-center shadow-lg flex-shrink-0"
                  style={{
                    background: 'linear-gradient(135deg, #E05D4B, #C2410C)',
                    boxShadow: '0 4px 20px rgba(224,93,75,0.35)',
                  }}
                >
                  <Heart className="w-5 h-5 text-white fill-white" />
                </motion.div>

                <div>
                  <h3
                    className="text-lg font-bold text-white leading-tight"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    Hand in Hand India
                  </h3>
                  {/* UPDATED tagline */}
                  <p
                    className="text-xs font-bold tracking-widest uppercase"
                    style={{ color: '#F87C6D' }}
                  >
                    Empower. Enable. Transform.
                  </p>
                </div>
              </motion.div>

              <p className="text-sm leading-relaxed max-w-sm mb-7" style={{ color: '#c5b8b6' }}>
                Supporting Self-Help Group beneficiaries and their small businesses across
                communities. Discover local entrepreneurs and their amazing stories.
              </p>

              {/* Social icons */}
              <div className="flex gap-3 mb-7">
                {[Share2, ThumbsUp].map((Icon, i) => (
                  <motion.a
                    key={i}
                    href="#"
                    whileHover={{ scale: 1.12, y: -2 }}
                    className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors"
                    style={{
                      background: 'rgba(255,255,255,0.08)',
                      border: '1px solid rgba(255,255,255,0.12)',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.background = 'rgba(224,93,75,0.35)';
                      (e.currentTarget as HTMLElement).style.borderColor = 'rgba(224,93,75,0.45)';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)';
                      (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.12)';
                    }}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </motion.a>
                ))}
              </div>

              {/* CTA */}
              <Link to="/categories">
                <motion.div
                  whileHover={{ scale: 1.03, x: 4 }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-white text-sm font-bold rounded-xl"
                  style={{
                    background: 'linear-gradient(135deg, #E05D4B, #C2410C)',
                    boxShadow: '0 4px 20px rgba(224,93,75,0.25)',
                  }}
                >
                  Explore Businesses <ArrowRight className="w-4 h-4" />
                </motion.div>
              </Link>
            </div>

            {/* ── QUICK LINKS ───────────────────────────────────────────── */}
            <div>
              <h4
                className="font-bold mb-6 text-xs uppercase tracking-[0.18em]"
                style={{ color: '#f5eeec' }}
              >
                Quick Links
              </h4>
              <ul className="space-y-3">
                {[
                  { label: 'Home', to: '/' },
                  { label: 'Browse Categories', to: '/categories' },
                  { label: 'Browse Districts', to: '/districts' },
                  { label: 'All Businesses', to: '/categories' },
                  { label: 'Admin Portal', to: '/admin' },
                ].map(link => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="group flex items-center gap-2 text-sm transition-all duration-200"
                      style={{ color: '#c5b8b6' }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#F87C6D')}
                      onMouseLeave={e => (e.currentTarget.style.color = '#c5b8b6')}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0 transition-colors"
                        style={{ background: 'rgba(224,93,75,0.55)' }}
                      />
                      <span className="group-hover:translate-x-1 transition-transform duration-200 inline-block">
                        {link.label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* ── CONTACT ───────────────────────────────────────────────── */}
            <div>
              <h4
                className="font-bold mb-6 text-xs uppercase tracking-[0.18em]"
                style={{ color: '#f5eeec' }}
              >
                Contact
              </h4>
              <ul className="space-y-5">
                {[
                  { icon: Phone, text: '+91 98765 43210', label: 'Call Us' },
                  { icon: Mail, text: 'info@hihindia.org', label: 'Email Us' },
                  { icon: MapPin, text: 'Kanchipuram, Tamil Nadu', label: 'Find Us' },
                ].map((item, i) => (
                  <li key={i} className="group flex items-start gap-3">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors"
                      style={{
                        background: 'rgba(224,93,75,0.18)',
                        border: '1px solid rgba(224,93,75,0.28)',
                      }}
                    >
                      <item.icon className="w-4 h-4" style={{ color: '#F87C6D' }} />
                    </div>
                    <div>
                      {/* Label — clearly visible */}
                      <p
                        className="text-[10px] uppercase tracking-wider mb-0.5 font-bold"
                        style={{ color: '#a09290' }}
                      >
                        {item.label}
                      </p>
                      {/* Value — clearly visible white */}
                      <span
                        className="text-sm font-medium transition-colors"
                        style={{ color: '#f0e8e7' }}
                      >
                        {item.text}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ── BOTTOM BAR ────────────────────────────────────────────────── */}
          <div
            className="mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4"
            style={{ borderTop: '1px solid rgba(255,255,255,0.10)' }}
          >
            {/* Copyright — clearly readable */}
            <p className="text-sm" style={{ color: '#c5b8b6' }}>
              © 2025 Hand in Hand India. All rights reserved.
            </p>

            <div className="flex items-center gap-5 flex-wrap justify-center">
              <Link
                to="/"
                className="text-xs font-medium transition-colors"
                style={{ color: '#c5b8b6' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#F87C6D')}
                onMouseLeave={e => (e.currentTarget.style.color = '#c5b8b6')}
              >
                Privacy Policy
              </Link>
              <Link
                to="/"
                className="text-xs font-medium transition-colors"
                style={{ color: '#c5b8b6' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#F87C6D')}
                onMouseLeave={e => (e.currentTarget.style.color = '#c5b8b6')}
              >
                Terms of Use
              </Link>
              <p className="text-sm flex items-center gap-1.5" style={{ color: '#c5b8b6' }}>
                Made with{' '}
                <Heart
                  className="w-3.5 h-3.5 mx-0.5"
                  style={{ color: '#F87C6D', fill: '#F87C6D' }}
                />{' '}
                for communities
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
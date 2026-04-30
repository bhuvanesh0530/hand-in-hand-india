import { motion } from 'framer-motion';
import { Heart, Mail, Phone, MapPin, ArrowRight, Star, Share2, ThumbsUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="relative mt-24 overflow-hidden">
      {/* Top gradient strip */}
      <div className="h-[3px]" style={{ background: 'linear-gradient(90deg, #4338CA, #6366F1, #F59E0B)' }} />

      <div style={{ background: '#FAFAFA', borderTop: '0.5px solid #E5E7EB' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

            {/* ── BRAND ─────────────────────────────────────────────── */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex items-center gap-3 mb-4"
              >
                <motion.div
                  animate={{ scale: [1, 1.12, 1] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    background: 'linear-gradient(135deg, #4338CA, #3730A3)',
                    boxShadow: '0 4px 16px rgba(67,56,202,0.30)',
                  }}
                >
                  <Heart className="w-5 h-5 text-white fill-white" />
                </motion.div>
                <div>
                  <h3
                    className="text-base font-bold leading-tight"
                    style={{ color: '#1E1B4B', fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    Hand in Hand India
                  </h3>
                  <p className="text-[10px] font-bold tracking-widest uppercase" style={{ color: '#4338CA' }}>
                    Empower. Enable. Transform.
                  </p>
                </div>
              </motion.div>

              {/* Badge */}
              <div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-4"
                style={{ background: '#FEF3C7', border: '0.5px solid #FDE68A', color: '#92400E' }}
              >
                <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                Women-led businesses across Tamil Nadu
              </div>

              <p className="text-sm leading-relaxed max-w-sm mb-6" style={{ color: '#6B7280' }}>
                Supporting Self-Help Group beneficiaries and their small businesses across
                communities. Discover local entrepreneurs and their amazing stories.
              </p>

              {/* Social icons */}
              <div className="flex gap-2 mb-6">
                {[
                  { Icon: Share2, label: 'Facebook' },
                  { Icon: ThumbsUp, label: 'Instagram' },
                ].map(({ Icon, label }) => (
                  <motion.a
                    key={label}
                    href="#"
                    whileHover={{ scale: 1.1, y: -2 }}
                    className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
                    style={{
                      background: '#EEF2FF',
                      border: '0.5px solid #C7D2FE',
                      color: '#4338CA',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.background = '#4338CA';
                      (e.currentTarget as HTMLElement).style.color = '#fff';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.background = '#EEF2FF';
                      (e.currentTarget as HTMLElement).style.color = '#4338CA';
                    }}
                  >
                    <Icon className="w-4 h-4" />
                  </motion.a>
                ))}
              </div>

              {/* CTA */}
              <Link to="/categories">
                <motion.div
                  whileHover={{ scale: 1.03, x: 4 }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-white text-sm font-bold rounded-xl"
                  style={{
                    background: 'linear-gradient(135deg, #4338CA, #3730A3)',
                    boxShadow: '0 4px 20px rgba(67,56,202,0.25)',
                  }}
                >
                  Explore Businesses <ArrowRight className="w-4 h-4" />
                </motion.div>
              </Link>
            </div>

            {/* ── QUICK LINKS ───────────────────────────────────────── */}
            <div>
              <h4
                className="font-bold mb-6 text-xs uppercase tracking-[0.18em]"
                style={{ color: '#6B7280' }}
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
                      style={{ color: '#6B7280' }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#4338CA')}
                      onMouseLeave={e => (e.currentTarget.style.color = '#6B7280')}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ background: '#C7D2FE' }}
                      />
                      <span className="group-hover:translate-x-1 transition-transform duration-200 inline-block">
                        {link.label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* ── CONTACT ───────────────────────────────────────────── */}
            <div>
              <h4
                className="font-bold mb-6 text-xs uppercase tracking-[0.18em]"
                style={{ color: '#6B7280' }}
              >
                Contact
              </h4>
              <ul className="space-y-5">
                {[
                  { icon: Phone, text: '+91 98765 43210', label: 'Call Us' },
                  { icon: Mail, text: 'info@hihindia.org', label: 'Email Us' },
                  { icon: MapPin, text: 'Kanchipuram, Tamil Nadu', label: 'Find Us' },
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{
                        background: '#EEF2FF',
                        border: '0.5px solid #C7D2FE',
                      }}
                    >
                      <item.icon className="w-4 h-4" style={{ color: '#4338CA' }} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider mb-0.5 font-bold" style={{ color: '#9CA3AF' }}>
                        {item.label}
                      </p>
                      <span className="text-sm font-medium" style={{ color: '#374151' }}>
                        {item.text}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ── BOTTOM BAR ────────────────────────────────────────────── */}
          <div
            className="mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4"
            style={{ borderTop: '0.5px solid #E5E7EB' }}
          >
            <p className="text-sm" style={{ color: '#9CA3AF' }}>
              © 2025 Hand in Hand India. All rights reserved.
            </p>
            <div className="flex items-center gap-5 flex-wrap justify-center">
              {['Privacy Policy', 'Terms of Use'].map(label => (
                <Link
                  key={label}
                  to="/"
                  className="text-xs font-medium transition-colors"
                  style={{ color: '#9CA3AF' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#4338CA')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#9CA3AF')}
                >
                  {label}
                </Link>
              ))}
              <p className="text-xs flex items-center gap-1.5" style={{ color: '#9CA3AF' }}>
                Made with{' '}
                <Heart className="w-3 h-3 mx-0.5 fill-amber-400 text-amber-400" />
                for communities
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
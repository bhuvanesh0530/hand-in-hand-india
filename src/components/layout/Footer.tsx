import { motion } from 'framer-motion';
import { Heart, Mail, Phone, MapPin, Share2, ThumbsUp, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="relative mt-24 overflow-hidden">
      {/* Top gradient divider */}
      <div className="h-1 bg-gradient-to-r from-[#FF6F61] via-[#FFD54F] to-[#26A69A]" />

      <div className="bg-gradient-to-br from-[#1a0a00] via-[#2d1200] to-[#0a1a18] text-white relative">
        {/* Decorative blobs */}
        <div className="absolute top-10 left-10 w-64 h-64 bg-[#FF6F61]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-[#26A69A]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-[#FFD54F]/5 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

            {/* Brand */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex items-center gap-3 mb-4"
              >
                <motion.img
                  src="https://www.hihindia.org/wp-content/uploads/2021/03/Hand-in-Hand-India-logo.png"
                  alt="Hand in Hand India"
                  whileHover={{ scale: 1.05 }}
                  className="h-12 w-auto object-contain brightness-200"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <div>
                  <h3 className="text-lg font-bold text-white">Hand in Hand India</h3>
                  <p className="text-xs text-[#FF6F61] font-semibold tracking-wide">Connect. Collaborate. Grow.</p>
                </div>
              </motion.div>

              <p className="text-stone-300 text-sm leading-relaxed max-w-sm mb-6">
                Supporting Self-Help Group beneficiaries and their small businesses across
                communities. Discover local entrepreneurs and their amazing stories.
              </p>

              {/* Social icons */}
              <div className="flex gap-3 mb-6">
                {[Share2, ThumbsUp].map((Icon, i) => (
                  <motion.a
                    key={i}
                    href="#"
                    whileHover={{ scale: 1.1, y: -2 }}
                    className="w-10 h-10 rounded-xl bg-white/10 hover:bg-[#FF6F61]/40 flex items-center justify-center transition-colors border border-white/10 hover:border-[#FF6F61]/40"
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </motion.a>
                ))}
              </div>

              {/* CTA */}
              <Link to="/categories">
                <motion.div
                  whileHover={{ scale: 1.02, x: 4 }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#FF6F61] to-[#e8594d] text-white text-sm font-bold rounded-xl shadow-lg shadow-[#FF6F61]/20"
                >
                  Explore Businesses <ArrowRight className="w-4 h-4" />
                </motion.div>
              </Link>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">
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
                      className="group flex items-center gap-2 text-stone-300 hover:text-[#FF6F61] text-sm transition-all duration-200"
                    >
                      <motion.span
                        className="w-1.5 h-1.5 rounded-full bg-[#FF6F61]/40 group-hover:bg-[#FF6F61] transition-colors flex-shrink-0"
                      />
                      <span className="group-hover:translate-x-1 transition-transform duration-200 inline-block">
                        {link.label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Contact</h4>
              <ul className="space-y-4">
                {[
                  { icon: Phone, text: '+91 98765 43210', label: 'Call us' },
                  { icon: Mail, text: 'info@hihindia.org', label: 'Email us' },
                  { icon: MapPin, text: 'Kanchipuram, Tamil Nadu', label: 'Find us' },
                ].map((item, i) => (
                  <li key={i} className="group flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#FF6F61]/20 group-hover:bg-[#FF6F61]/30 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors border border-[#FF6F61]/20">
                      <item.icon className="w-4 h-4 text-[#FF6F61]" />
                    </div>
                    <div>
                      <p className="text-[10px] text-stone-500 uppercase tracking-wider mb-0.5">{item.label}</p>
                      <span className="text-stone-200 text-sm font-medium group-hover:text-white transition-colors">{item.text}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-stone-400 text-sm">
              © 2025 Hand in Hand India. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <Link to="/" className="text-stone-400 hover:text-[#FF6F61] text-xs transition-colors">Privacy Policy</Link>
              <Link to="/" className="text-stone-400 hover:text-[#FF6F61] text-xs transition-colors">Terms of Use</Link>
              <p className="text-stone-400 text-sm flex items-center gap-1">
                Made with <Heart className="w-3.5 h-3.5 text-[#FF6F61] fill-[#FF6F61] mx-1" /> for communities
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
import { motion } from 'framer-motion';
import { Heart, Mail, Phone, MapPin, Share2, ThumbsUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="relative mt-24 overflow-hidden">
      {/* Top wave */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#FF6F61]/30 to-transparent" />

      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        {/* Decorative blobs */}
        <div className="absolute top-10 left-10 w-64 h-64 bg-[#FF6F61]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-[#26A69A]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

            {/* Brand */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex items-center gap-3 mb-6"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FF6F61] to-[#26A69A] flex items-center justify-center shadow-lg">
                  <Heart className="w-6 h-6 text-white fill-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Hand in Hand India</h3>
                  <p className="text-xs text-slate-400">Empowering Communities</p>
                </div>
              </motion.div>
              <p className="text-slate-400 text-sm leading-relaxed max-w-sm mb-6">
                Supporting Self-Help Group beneficiaries and their small businesses across
                communities. Discover local entrepreneurs and their amazing stories.
              </p>
              <div className="flex gap-3">
                {[Share2, ThumbsUp].map((Icon, i) => (
                  <motion.a
                    key={i}
                    href="#"
                    whileHover={{ scale: 1.1, y: -2 }}
                    className="w-10 h-10 rounded-xl bg-white/10 hover:bg-[#FF6F61]/30 flex items-center justify-center transition-colors"
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-wider">Quick Links</h4>
              <ul className="space-y-3">
                {[
                  { label: 'Home', to: '/' },
                  { label: 'Browse Categories', to: '/categories' },
                  { label: 'All Businesses', to: '/categories' },
                  { label: 'Admin Portal', to: '/admin' },
                ].map(link => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-slate-400 hover:text-[#FF6F61] text-sm transition-colors hover:translate-x-1 inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-wider">Contact</h4>
              <ul className="space-y-4">
                {[
                  { icon: Phone, text: '+91 98765 43210' },
                  { icon: Mail, text: 'info@hihindia.org' },
                  { icon: MapPin, text: 'Kanchipuram, Tamil Nadu' },
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#FF6F61]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <item.icon className="w-4 h-4 text-[#FF6F61]" />
                    </div>
                    <span className="text-slate-400 text-sm">{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-slate-500 text-sm">
              © 2025 Hand in Hand India. All rights reserved.
            </p>
            <p className="text-slate-500 text-sm flex items-center gap-1">
              Made with <Heart className="w-3.5 h-3.5 text-[#FF6F61] fill-[#FF6F61]" /> for communities
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
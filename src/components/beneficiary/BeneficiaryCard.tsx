import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Star } from 'lucide-react';
import type { Beneficiary } from '../../types';
import { useApp } from '../../context/AppContext';
import { useRef } from 'react';

// ── Inline SVG icons (Instagram & Facebook not in lucide-react) ──────────────
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

interface BeneficiaryCardProps {
  beneficiary: Beneficiary;
  index?: number;
}

export function BeneficiaryCard({ beneficiary, index = 0 }: BeneficiaryCardProps) {
  const { getCategoryById } = useApp();
  const category = getCategoryById(beneficiary.category_id);
  const cardRef = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [6, -6]);
  const rotateY = useTransform(x, [-100, 100], [-6, 6]);
  const springRotateX = useSpring(rotateX, { stiffness: 300, damping: 30 });
  const springRotateY = useSpring(rotateY, { stiffness: 300, damping: 30 });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  }

  function handleMouseLeave() { x.set(0); y.set(0); }

  const services = typeof beneficiary.services === 'string'
    ? (beneficiary.services as string).split(',').map(s => s.trim()).filter(Boolean)
    : beneficiary.services || [];

  // Initials fallback — use only business_name (name doesn't exist on Beneficiary type)
  const initials = (beneficiary.business_name || '?')
    .split(' ').slice(0, 2).map((w: string) => w[0]).join('').toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        ref={cardRef}
        style={{ rotateX: springRotateX, rotateY: springRotateY, transformStyle: 'preserve-3d', perspective: 1000 }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        whileHover={{ y: -6, scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className="group bg-white/80 backdrop-blur-xl border border-white/60 rounded-2xl shadow-lg shadow-slate-200/50 overflow-hidden hover:shadow-2xl hover:shadow-[#FF6F61]/10 transition-shadow duration-300"
      >
        {/* ── TOP IMAGE AREA ── */}
        <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-[#FF6F61]/10 to-[#26A69A]/10">
          {beneficiary.profile_image ? (
            <motion.img
              src={beneficiary.profile_image}
              alt={beneficiary.business_name}
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.06 }}
              transition={{ duration: 0.4 }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#FF6F61]/20 to-[#26A69A]/20 flex items-center justify-center">
                <span className="text-2xl font-bold text-[#FF6F61]/70">{initials}</span>
              </div>
            </div>
          )}

          {/* Featured badge */}
          {beneficiary.featured && (
            <div className="absolute top-3 left-3">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-[#FFD54F] to-[#F97316] text-white text-xs font-bold rounded-full shadow-lg"
              >
                <Star className="w-3 h-3 fill-white" /> Featured
              </motion.div>
            </div>
          )}

          {/* Category badge */}
          {category && (
            <div className="absolute top-3 right-3">
              <div className="px-2.5 py-1 bg-white/90 backdrop-blur-xl text-slate-700 text-xs font-semibold rounded-full shadow-sm">
                {category.name}
              </div>
            </div>
          )}

          {/* District badge */}
          {beneficiary.district && (
            <div className="absolute bottom-3 left-3">
              <div className="flex items-center gap-1 px-2.5 py-1 bg-blue-600/90 backdrop-blur-xl text-white text-xs font-semibold rounded-full">
                <MapPin className="w-3 h-3" /> {beneficiary.district}
              </div>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* ── CARD BODY ── */}
        <div className="p-5">
          {/* Shop name */}
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#FF6F61] transition-colors leading-tight mb-1 truncate">
            {beneficiary.business_name || 'Unnamed'}
          </h3>

          {/* About (2 lines, trimmed) */}
          {beneficiary.about && (
            <p className="text-sm text-slate-500 line-clamp-2 mb-3">{beneficiary.about}</p>
          )}

          {/* Services tags — max 2 + "+N more" */}
          {services.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {services.slice(0, 2).map((service, i) => (
                <span key={i} className="px-2 py-0.5 bg-[#FF6F61]/10 text-[#FF6F61] text-xs font-semibold rounded-lg">
                  {service}
                </span>
              ))}
              {services.length > 2 && (
                <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-xs font-medium rounded-lg">
                  +{services.length - 2} more
                </span>
              )}
            </div>
          )}

          {/* Bottom row — location + social icons */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <div className="flex items-center gap-1.5 text-slate-400">
              <MapPin className="w-3.5 h-3.5" />
              <span className="text-xs truncate max-w-[110px]">
                {beneficiary.location?.split(',')[0] || beneficiary.district || '—'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {beneficiary.social_instagram && (
                <div className="w-6 h-6 rounded-lg bg-pink-50 flex items-center justify-center">
                  <InstagramIcon className="w-3.5 h-3.5 text-pink-500" />
                </div>
              )}
              {beneficiary.social_facebook && (
                <div className="w-6 h-6 rounded-lg bg-blue-50 flex items-center justify-center">
                  <FacebookIcon className="w-3.5 h-3.5 text-blue-500" />
                </div>
              )}
              {beneficiary.mobile_number && (
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="flex items-center gap-1.5 text-[#26A69A] bg-[#26A69A]/10 px-2.5 py-1 rounded-lg"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span className="text-xs font-semibold">Call</span>
                </motion.div>
              )}
            </div>
          </div>

          {/* View Full Profile button */}
          <Link to={`/beneficiary/${beneficiary.id}`}>
            <motion.div
              whileHover={{ x: 4 }}
              className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-sm font-semibold text-[#FF6F61]"
            >
              View Full Profile
              <span className="text-base">→</span>
            </motion.div>
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}
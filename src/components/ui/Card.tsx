import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

export function GlassCard({ children, className = '', onClick, hover = false }: CardProps) {
  return (
    <motion.div
      onClick={onClick}
      whileHover={hover ? { y: -6, scale: 1.01 } : {}}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={`bg-white/75 backdrop-blur-xl border border-white/60 rounded-2xl shadow-lg shadow-slate-200/50 ${hover ? 'cursor-pointer hover:shadow-2xl hover:shadow-[#FF6F61]/10 transition-all duration-300' : ''} ${className}`}
    >
      {children}
    </motion.div>
  );
}

export function StatCard({
  label, value, icon, gradient,
}: {
  label: string;
  value: string | number;
  icon: ReactNode;
  gradient: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className="relative bg-white/75 backdrop-blur-xl border border-white/60 rounded-2xl p-6 shadow-lg overflow-hidden"
    >
      <div className={`absolute top-0 right-0 w-32 h-32 rounded-full bg-gradient-to-br ${gradient} opacity-10 transform translate-x-8 -translate-y-8`} />
      <div className="relative">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg mb-4`}>
          {icon}
        </div>
        <p className="text-3xl font-bold text-slate-900">{value}</p>
        <p className="text-sm text-slate-500 mt-1">{label}</p>
      </div>
    </motion.div>
  );
}
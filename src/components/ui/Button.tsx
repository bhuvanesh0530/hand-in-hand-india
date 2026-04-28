import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface ButtonProps {
  children?: ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: ReactNode;
  disabled?: boolean;
  className?: string;
}

const variants = {
  primary: 'bg-gradient-to-r from-[#FF6F61] to-[#e8594d] text-white shadow-lg shadow-[#FF6F61]/25 hover:shadow-[#FF6F61]/40',
  secondary: 'bg-gradient-to-r from-[#26A69A] to-[#1d8a7f] text-white shadow-lg shadow-[#26A69A]/25 hover:shadow-[#26A69A]/40',
  ghost: 'bg-white/70 backdrop-blur-sm border border-white/60 text-slate-700 hover:bg-white/90',
  danger: 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/25',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs gap-1.5',
  md: 'px-5 py-2.5 text-sm gap-2',
  lg: 'px-7 py-3.5 text-base gap-2.5',
};

export function Button({
  children, onClick, type = 'button', variant = 'primary',
  size = 'md', icon, disabled, className = '',
}: ButtonProps) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.02, y: disabled ? 0 : -1 }}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={`inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </motion.button>
  );
}
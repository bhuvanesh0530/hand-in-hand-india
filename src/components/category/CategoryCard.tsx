import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Folder, ChevronRight, Users } from 'lucide-react';
import type { Category } from '../../types';
import { useApp } from '../../context/AppContext';

interface CategoryCardProps {
  category: Category;
  index?: number;
}

const gradients = [
  { from: 'from-[#FF6F61]', to: 'to-[#FFB5A8]', shadow: 'shadow-[#FF6F61]/20' },
  { from: 'from-[#26A69A]', to: 'to-[#4DD0C4]', shadow: 'shadow-[#26A69A]/20' },
  { from: 'from-[#FFD54F]', to: 'to-[#FFE082]', shadow: 'shadow-[#FFD54F]/20' },
  { from: 'from-[#7C3AED]', to: 'to-[#A78BFA]', shadow: 'shadow-[#7C3AED]/20' },
  { from: 'from-[#0EA5E9]', to: 'to-[#38BDF8]', shadow: 'shadow-[#0EA5E9]/20' },
  { from: 'from-[#F97316]', to: 'to-[#FB923C]', shadow: 'shadow-[#F97316]/20' },
];

export function CategoryCard({ category, index = 0 }: CategoryCardProps) {
  const { getChildCategories, getBeneficiariesByCategory } = useApp();
  const childCount = getChildCategories(category.id).length;
  const beneficiaryCount = getBeneficiariesByCategory(category.id).length;
  const grad = gradients[index % gradients.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
    >
      <Link to={`/categories/${category.id}`}>
        <motion.div
          whileHover={{ y: -8, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className="group relative bg-white/75 backdrop-blur-xl border border-white/60 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
        >
          {/* Top gradient bar */}
          <div className={`h-1.5 bg-gradient-to-r ${grad.from} ${grad.to}`} />

          <div className="p-6">
            {/* Icon */}
            <motion.div
              whileHover={{ rotate: -8, scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 400 }}
              className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${grad.from} ${grad.to} flex items-center justify-center shadow-lg ${grad.shadow} mb-4`}
            >
              <Folder className="w-7 h-7 text-white" />
            </motion.div>

            {/* Name */}
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#FF6F61] transition-colors leading-tight mb-2">
              {category.name}
            </h3>

            {/* Description */}
            {category.description && (
              <p className="text-sm text-slate-500 line-clamp-2 mb-4">
                {category.description}
              </p>
            )}

            {/* Stats */}
            <div className="flex items-center gap-4 mb-4">
              {childCount > 0 && (
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Folder className="w-3.5 h-3.5" />
                  <span className="text-xs font-medium">{childCount} subcategories</span>
                </div>
              )}
              {beneficiaryCount > 0 && (
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Users className="w-3.5 h-3.5" />
                  <span className="text-xs font-medium">{beneficiaryCount} businesses</span>
                </div>
              )}
            </div>

            {/* Explore link */}
            <div className="flex items-center gap-1 text-[#FF6F61] font-semibold text-sm group-hover:gap-2 transition-all">
              <span>Explore</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>

          {/* Hover overlay */}
          <div className={`absolute inset-0 bg-gradient-to-br ${grad.from} ${grad.to} opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none`} />
        </motion.div>
      </Link>
    </motion.div>
  );
}
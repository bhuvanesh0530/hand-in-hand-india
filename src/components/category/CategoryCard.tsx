import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight, Users, Folder } from 'lucide-react';
import type { Category } from '../../types';
import { useApp } from '../../context/AppContext';

interface CategoryCardProps {
  category: Category;
  index?: number;
}

// Maps category name → sector illustration file
// Handles variations in how the name might be stored in Supabase
const getSectorImage = (name: string): string | null => {
  const n = name.toLowerCase().trim();

  if (n.includes('handloom') || n.includes('handicraft')) {
    return '/illustrations/sectors/handloom.png';
  }
  if (n.includes('agri') || n.includes('allied') || n.includes('farm')) {
    return '/illustrations/sectors/agri.png';
  }
  if (n.includes('animal') || n.includes('husbandry') || n.includes('livestock')) {
    return '/illustrations/sectors/animal-husbandry.png';
  }
  if (n.includes('manufactur') || n.includes('production') || n.includes('industry')) {
    return '/illustrations/sectors/manufacturing.png';
  }
  if (n.includes('trade') || n.includes('commerce') || n.includes('retail')) {
    return '/illustrations/sectors/trade.png';
  }
  if (n.includes('service') || n.includes('tailoring') || n.includes('beauty')) {
    return '/illustrations/sectors/service.png';
  }
  return null; // no match → fallback icon
};

const gradients = [
  { from: 'from-[#C2410C]', to: 'to-[#D97706]', shadow: 'shadow-[#C2410C]/20' },
  { from: 'from-[#0F766E]', to: 'to-[#0d9488]', shadow: 'shadow-[#0F766E]/20' },
  { from: 'from-[#D97706]', to: 'to-[#f59e0b]', shadow: 'shadow-[#D97706]/20' },
  { from: 'from-[#C2410C]', to: 'to-[#0F766E]', shadow: 'shadow-[#C2410C]/20' },
  { from: 'from-[#0F766E]', to: 'to-[#D97706]', shadow: 'shadow-[#0F766E]/20' },
  { from: 'from-[#D97706]', to: 'to-[#C2410C]', shadow: 'shadow-[#D97706]/20' },
];

export function CategoryCard({ category, index = 0 }: CategoryCardProps) {
  const { getChildCategories, getBeneficiariesByCategory } = useApp();
  const childCount = getChildCategories(category.id).length;
  const beneficiaryCount = getBeneficiariesByCategory(category.id).length;
  const grad = gradients[index % gradients.length];
  const sectorImage = getSectorImage(category.name);

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

          {/* Illustration OR icon */}
          {sectorImage ? (
            <div className="relative w-full h-44 bg-[#FDF6F0] overflow-hidden">
              <img
                src={sectorImage}
                alt={category.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  // if image fails, hide and show fallback below
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              {/* Soft gradient overlay at bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white/60 to-transparent" />
            </div>
          ) : (
            // Fallback: gradient icon box (original design)
            <div className="px-6 pt-5 pb-2">
              <motion.div
                whileHover={{ rotate: -8, scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 400 }}
                className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${grad.from} ${grad.to} flex items-center justify-center shadow-lg ${grad.shadow} mb-4`}
              >
                <Folder className="w-7 h-7 text-white" />
              </motion.div>
            </div>
          )}

          <div className="p-5">
            {/* Name */}
            <h3 className="text-lg font-bold text-stone-900 group-hover:text-[#C2410C] transition-colors leading-tight mb-1">
              {category.name}
            </h3>

            {/* Description */}
            {category.description && (
              <p className="text-sm text-stone-500 line-clamp-2 mb-3">
                {category.description}
              </p>
            )}

            {/* Stats */}
            <div className="flex items-center gap-4 mb-3">
              {childCount > 0 && (
                <div className="flex items-center gap-1.5 text-stone-400">
                  <Folder className="w-3.5 h-3.5" />
                  <span className="text-xs font-medium">{childCount} subcategories</span>
                </div>
              )}
              {beneficiaryCount > 0 && (
                <div className="flex items-center gap-1.5 text-stone-400">
                  <Users className="w-3.5 h-3.5" />
                  <span className="text-xs font-medium">{beneficiaryCount} businesses</span>
                </div>
              )}
            </div>

            {/* Explore link */}
            <div className="flex items-center gap-1 text-[#C2410C] font-semibold text-sm group-hover:gap-2 transition-all">
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
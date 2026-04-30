import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight, Users, Folder } from 'lucide-react';
import type { Category } from '../../types';
import { useApp } from '../../context/AppContext';

interface CategoryCardProps {
  category: Category;
  index?: number;
}

const getSectorImage = (name: string): string | null => {
  const n = name.toLowerCase().trim();
  if (n.includes('handloom') || n.includes('handicraft')) return '/illustrations/sectors/handloom.png';
  if (n.includes('agri') || n.includes('allied') || n.includes('farm')) return '/illustrations/sectors/agri.png';
  if (n.includes('animal') || n.includes('husbandry') || n.includes('livestock')) return '/illustrations/sectors/animal-husbandry.png';
  if (n.includes('manufactur') || n.includes('production') || n.includes('industry')) return '/illustrations/sectors/manufacturing.png';
  if (n.includes('trade') || n.includes('commerce') || n.includes('retail')) return '/illustrations/sectors/trade.png';
  if (n.includes('service') || n.includes('tailoring') || n.includes('beauty')) return '/illustrations/sectors/service.png';
  return null;
};

const gradients = [
  { from: 'from-[#C2410C]', to: 'to-[#D97706]', shadow: 'shadow-[#C2410C]/20', fallbackBg: 'linear-gradient(135deg, #FFEDD5, #FEF3C7)' },
  { from: 'from-[#0F766E]', to: 'to-[#0d9488]', shadow: 'shadow-[#0F766E]/20', fallbackBg: 'linear-gradient(135deg, #CCFBF1, #D1FAE5)' },
  { from: 'from-[#D97706]', to: 'to-[#f59e0b]', shadow: 'shadow-[#D97706]/20', fallbackBg: 'linear-gradient(135deg, #FEF3C7, #FDE68A)' },
  { from: 'from-[#C2410C]', to: 'to-[#0F766E]', shadow: 'shadow-[#C2410C]/20', fallbackBg: 'linear-gradient(135deg, #FFEDD5, #CCFBF1)' },
  { from: 'from-[#0F766E]', to: 'to-[#D97706]', shadow: 'shadow-[#0F766E]/20', fallbackBg: 'linear-gradient(135deg, #CCFBF1, #FEF3C7)' },
  { from: 'from-[#D97706]', to: 'to-[#C2410C]', shadow: 'shadow-[#D97706]/20', fallbackBg: 'linear-gradient(135deg, #FEF3C7, #FFEDD5)' },
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
          className="group relative bg-white/75 backdrop-blur-xl border border-white/60 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 flex flex-col"
        >
          {/* Top gradient bar */}
          <div className={`h-1.5 bg-gradient-to-r ${grad.from} ${grad.to} flex-shrink-0`} />

          {/* Illustration OR icon — always fixed height h-44 */}
          {sectorImage ? (
            <div
              className="relative w-full overflow-hidden flex items-center justify-center flex-shrink-0"
              style={{ height: '176px', background: '#FDF6F0' }}
            >
              <img
                src={sectorImage}
                alt={category.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  const img = e.target as HTMLImageElement;
                  img.style.display = 'none';
                  const parent = img.parentElement;
                  if (parent) {
                    parent.style.background = grad.fallbackBg;
                    // Show a folder icon as text fallback
                    const iconDiv = document.createElement('div');
                    iconDiv.style.cssText = 'display:flex;align-items:center;justify-content:center;width:100%;height:100%;position:absolute;inset:0';
                    iconDiv.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.15)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>`;
                    parent.appendChild(iconDiv);
                  }
                }}
              />
              <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white/60 to-transparent pointer-events-none" />
            </div>
          ) : (
            <div
              className="flex items-center justify-center flex-shrink-0"
              style={{ height: '176px', background: grad.fallbackBg }}
            >
              <motion.div
                whileHover={{ rotate: -8, scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 400 }}
                className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${grad.from} ${grad.to} flex items-center justify-center shadow-lg ${grad.shadow}`}
              >
                <Folder className="w-8 h-8 text-white" />
              </motion.div>
            </div>
          )}

          {/* Card body */}
          <div className="p-5 flex flex-col flex-1">
            <h3 className="text-lg font-bold text-stone-900 group-hover:text-[#C2410C] transition-colors leading-tight mb-1">
              {category.name}
            </h3>

            {category.description && (
              <p className="text-sm text-stone-500 line-clamp-2 mb-3">
                {category.description}
              </p>
            )}

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

            <div className="flex items-center gap-1 text-[#C2410C] font-semibold text-sm group-hover:gap-2 transition-all mt-auto">
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
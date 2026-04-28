import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import type { Category } from '../../types';

interface BreadcrumbProps {
  categories: Category[];
  currentName?: string;
}

export function Breadcrumb({ categories, currentName }: BreadcrumbProps) {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-1.5 flex-wrap"
    >
      <Link
        to="/"
        className="flex items-center gap-1 text-slate-400 hover:text-[#FF6F61] transition-colors text-sm font-medium"
      >
        <Home className="w-3.5 h-3.5" />
        <span>Home</span>
      </Link>

      {categories.map((cat, index) => (
        <motion.span
          key={cat.id}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          className="flex items-center gap-1.5"
        >
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          {index === categories.length - 1 && !currentName ? (
            <span className="text-sm font-semibold text-slate-800">{cat.name}</span>
          ) : (
            <Link
              to={`/categories/${cat.id}`}
              className="text-sm font-medium text-slate-400 hover:text-[#FF6F61] transition-colors"
            >
              {cat.name}
            </Link>
          )}
        </motion.span>
      ))}

      {currentName && (
        <motion.span
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-1.5"
        >
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <span className="text-sm font-semibold text-slate-800 truncate max-w-[200px]">
            {currentName}
          </span>
        </motion.span>
      )}
    </motion.nav>
  );
}
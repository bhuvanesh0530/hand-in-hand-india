import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { Category } from '../types';
import { CategoryCard } from '../components/category/CategoryCard';
import { motion } from 'framer-motion';
import { MapPin, FolderOpen } from 'lucide-react';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const { data, error } = await supabase.from('categories').select('*').order('name');
        if (error) throw error;
        setCategories(data || []);
      } catch (err) {
        setError('Failed to load categories');
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className="rounded-full h-12 w-12 border-b-2 border-[#C2410C]" />
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <nav className="text-sm text-stone-400 mb-6">
        <Link to="/" className="hover:text-[#C2410C] transition">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-stone-700 font-medium">Categories</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <motion.h1
            className="text-3xl font-bold text-stone-800 mb-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            All Categories
          </motion.h1>
          <p className="text-stone-500">Browse beneficiaries by category</p>
        </div>
        <Link to="/districts">
          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#0F766E] text-white rounded-xl text-sm font-semibold shadow-lg shadow-teal-200 hover:bg-[#0d5f58] transition"
          >
            <MapPin className="w-4 h-4" /> Browse by District
          </motion.div>
        </Link>
      </div>

      {categories.length === 0 ? (
        <div className="text-center py-20">
          <FolderOpen className="w-12 h-12 text-stone-300 mx-auto mb-4" />
          <p className="text-stone-400">No categories found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link to={`/categories/${category.id}`}>
                <CategoryCard category={category} />
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
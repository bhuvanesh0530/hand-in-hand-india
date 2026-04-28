import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { Beneficiary, Category } from '../types';
import { BeneficiaryCard } from '../components/beneficiary/BeneficiaryCard';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';

export default function BeneficiaryPage() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: catData, error: catError } = await supabase
          .from('categories').select('*').eq('id', categoryId).single();
        if (catError) throw catError;
        setCategory(catData);

        const { data: benData, error: benError } = await supabase
          .from('beneficiaries').select('*').eq('category_id', categoryId).order('business_name');
        if (benError) throw benError;
        setBeneficiaries(benData || []);
      } catch (err) {
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [categoryId]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className="rounded-full h-12 w-12 border-b-2 border-[#FF6F61]" />
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-[#FF6F61] transition">Home</Link>
        <span className="mx-2">/</span>
        <Link to="/categories" className="hover:text-[#FF6F61] transition">Categories</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800 font-medium">{category?.name}</span>
      </nav>

      <motion.h1 className="text-3xl font-bold text-gray-800 mb-2"
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        {category?.name}
      </motion.h1>
      <p className="text-gray-500 mb-8">{category?.description}</p>

      {beneficiaries.length === 0 ? (
        <div className="text-center py-20">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-400">No beneficiaries found in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {beneficiaries.map((ben, index) => (
            <BeneficiaryCard key={ben.id} beneficiary={ben} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}
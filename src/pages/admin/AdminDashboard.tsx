import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { motion } from 'framer-motion';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ categories: 0, beneficiaries: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuthAndLoad() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate('/admin/login'); return; }

      const [{ count: catCount }, { count: benCount }] = await Promise.all([
        supabase.from('categories').select('*', { count: 'exact', head: true }),
        supabase.from('beneficiaries').select('*', { count: 'exact', head: true }),
      ]);

      setStats({ categories: catCount || 0, beneficiaries: benCount || 0 });
      setLoading(false);
    }
    checkAuthAndLoad();
  }, [navigate]);

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate('/admin/login');
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500" />
    </div>
  );

  const cards = [
    { label: 'Categories', value: stats.categories, href: '/admin/categories', color: 'bg-blue-50 text-blue-600' },
    { label: 'Beneficiaries', value: stats.beneficiaries, href: '/admin/beneficiaries', color: 'bg-rose-50 text-rose-600' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-500 text-sm">Hand in Hand India</p>
        </div>
        <button
          onClick={handleLogout}
          className="text-sm text-gray-500 hover:text-red-500 transition"
        >
          Sign Out
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
        {cards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Link to={card.href}>
              <div className={`rounded-2xl p-6 ${card.color} hover:shadow-md transition`}>
                <p className="text-sm font-medium">{card.label}</p>
                <p className="text-4xl font-bold mt-1">{card.value}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="font-semibold text-gray-700 mb-4">Quick Links</h2>
        <div className="flex flex-wrap gap-3">
          <Link to="/admin/categories" className="px-4 py-2 bg-gray-100 rounded-lg text-sm hover:bg-gray-200 transition">Manage Categories</Link>
          <Link to="/admin/beneficiaries" className="px-4 py-2 bg-gray-100 rounded-lg text-sm hover:bg-gray-200 transition">Manage Beneficiaries</Link>
          <Link to="/" className="px-4 py-2 bg-gray-100 rounded-lg text-sm hover:bg-gray-200 transition">View Public Site</Link>
        </div>
      </div>
    </div>
  );
}
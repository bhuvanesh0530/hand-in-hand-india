import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import type { Category } from '../../types';
import { motion } from 'framer-motion';

export default function AdminCategories() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate('/admin/login'); return; }
      fetchCategories();
    }
    init();
  }, [navigate]);

  async function fetchCategories() {
    setLoading(true);
    const { data } = await supabase.from('categories').select('*').order('name');
    setCategories(data || []);
    setLoading(false);
  }

  async function handleAdd() {
    if (!name.trim()) return;
    setSaving(true);
    setError(null);
    const { error } = await supabase.from('categories').insert({
      name: name.trim(),
      description: description.trim()
    });
    if (error) setError(error.message);
    else { setName(''); setDescription(''); fetchCategories(); }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this category?')) return;
    await supabase.from('categories').delete().eq('id', id);
    fetchCategories();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manage Categories</h1>
        <button onClick={() => navigate('/admin/dashboard')} className="text-sm text-gray-500 hover:text-gray-700">← Dashboard</button>
      </div>

      <div className="bg-white rounded-2xl shadow p-6 mb-8">
        <h2 className="font-semibold text-gray-700 mb-4">Add New Category</h2>
        {error && <div className="text-red-500 text-sm mb-3">{error}</div>}
        <div className="space-y-3">
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Category name *"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
          />
          <input
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Description (optional)"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
          />
          <button
            onClick={handleAdd}
            disabled={saving}
            className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-2 rounded-lg text-sm font-semibold transition disabled:opacity-50"
          >
            {saving ? 'Adding...' : 'Add Category'}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-rose-500" />
        </div>
      ) : (
        <div className="space-y-3">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-xl shadow px-5 py-4 flex items-center justify-between"
            >
              <div>
                <p className="font-medium text-gray-800">{cat.name}</p>
                {cat.description && <p className="text-sm text-gray-500">{cat.description}</p>}
              </div>
              <button
                onClick={() => handleDelete(cat.id)}
                className="text-sm text-red-400 hover:text-red-600 transition"
              >
                Delete
              </button>
            </motion.div>
          ))}
          {categories.length === 0 && (
            <p className="text-center text-gray-400 py-10">No categories yet.</p>
          )}
        </div>
      )}
    </div>
  );
}
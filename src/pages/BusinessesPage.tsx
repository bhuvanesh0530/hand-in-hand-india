import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, MapPin } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BeneficiaryCard } from '../components/beneficiary/BeneficiaryCard';
import { useSearchParams } from 'react-router-dom';

const SECTORS = [
  'Agriculture & Allied Activities',
  'Animal Husbandry',
  'Handloom & Handicrafts',
  'Manufacturing / Production',
  'Service',
  'Trade',
];

export default function BusinessesPage() {
  const { beneficiaries } = useApp();
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedSector, setSelectedSector] = useState('');

  // If coming from Categories page with ?sector=xxx, pre-select it
  useEffect(() => {
    const sectorParam = searchParams.get('sector');
    if (sectorParam) setSelectedSector(sectorParam);
  }, [searchParams]);

  // Unique districts for filter
  const districts = [...new Set(beneficiaries.map(b => b.district).filter(Boolean))].sort();

  // Filter by search + district + sector
  const filtered = beneficiaries.filter(b => {
    const matchSearch =
      b.business_name?.toLowerCase().includes(search.toLowerCase()) ||
      b.about?.toLowerCase().includes(search.toLowerCase()) ||
      b.district?.toLowerCase().includes(search.toLowerCase());
    const matchDistrict = selectedDistrict ? b.district === selectedDistrict : true;
    const matchSector = selectedSector ? b.sector === selectedSector : true;
    return matchSearch && matchDistrict && matchSector;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-rose-50/30 to-teal-50/20">

      {/* HERO HEADER */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#FF6F61]/10 via-white to-[#26A69A]/10 border-b border-rose-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#FF6F61]/10 rounded-full mb-4">
              <Users className="w-4 h-4 text-[#FF6F61]" />
              <span className="text-sm font-semibold text-[#FF6F61]">Women Entrepreneurs</span>
            </div>
            <h1 className="text-4xl font-bold text-slate-900 mb-3">
              {selectedSector ? (
                <span className="text-[#FF6F61]">{selectedSector}</span>
              ) : (
                <>All <span className="text-[#FF6F61]">Businesses</span></>
              )}
            </h1>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">
              Discover and support talented SHG women entrepreneurs across Tamil Nadu
            </p>
            <div className="mt-3 text-sm font-semibold text-[#26A69A]">
              {filtered.length} {filtered.length === 1 ? 'business' : 'businesses'} found
            </div>
          </motion.div>
        </div>
      </div>

      {/* FILTERS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search businesses..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6F61]/30 focus:border-[#FF6F61]"
            />
          </div>
          <select
            value={selectedSector}
            onChange={e => setSelectedSector(e.target.value)}
            className="pl-4 pr-8 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6F61]/30 focus:border-[#FF6F61] appearance-none cursor-pointer min-w-[200px]"
          >
            <option value="">All Sectors</option>
            {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <select
              value={selectedDistrict}
              onChange={e => setSelectedDistrict(e.target.value)}
              className="pl-10 pr-8 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6F61]/30 focus:border-[#FF6F61] appearance-none cursor-pointer min-w-[180px]"
            >
              <option value="">All Districts</option>
              {districts.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* CARDS GRID */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {filtered.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24 text-slate-400">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-lg font-semibold">No businesses found</p>
            <p className="text-sm mt-1">Try adjusting your search or filter</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((b, i) => (
              <BeneficiaryCard key={b.id} beneficiary={b} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
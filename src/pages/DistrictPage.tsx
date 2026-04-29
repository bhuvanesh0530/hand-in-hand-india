import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Search, Users, ChevronRight } from 'lucide-react';
import type { Beneficiary } from '../types';

// ✅ FIXED: Correct 38 official Tamil Nadu districts — consistent spelling everywhere
const TN_DISTRICTS = [
  'Ariyalur','Chengalpattu','Chennai','Coimbatore','Cuddalore',
  'Dharmapuri','Dindigul','Erode','Kallakurichi','Kanchipuram',
  'Kanniyakumari','Karur','Krishnagiri','Madurai','Mayiladuthurai',
  'Nagapattinam','Namakkal','Nilgiris','Perambalur','Pudukkottai',
  'Ramanathapuram','Ranipet','Salem','Sivagangai','Tenkasi',
  'Thanjavur','Theni','Thoothukudi','Tiruchirappalli','Tirunelveli',
  'Tirupathur','Tiruppur','Tiruvallur','Tiruvannamalai','Tiruvarur',
  'Vellore','Viluppuram','Virudhunagar'
];

// Maps district name → illustration file path
const getDistrictImage = (district: string) =>
  `/illustrations/districts/${district.toLowerCase()}.png`;

export default function DistrictPage() {
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAll() {
      const { data } = await supabase.from('beneficiaries').select('*');
      setBeneficiaries((data as Beneficiary[]) || []);
      setLoading(false);
    }
    fetchAll();
  }, []);

  const filteredDistricts = TN_DISTRICTS.filter(d =>
    d.toLowerCase().includes(search.toLowerCase())
  );

  const districtBeneficiaries = selectedDistrict
    ? beneficiaries.filter(b => b.district === selectedDistrict)
    : [];

  const getCount = (district: string) =>
    beneficiaries.filter(b => b.district === district).length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <nav className="text-sm text-stone-400 mb-6">
        <Link to="/" className="hover:text-[#C2410C] transition">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-stone-700 font-medium">Browse by District</span>
      </nav>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-bold text-stone-800 mb-2">Browse by District</h1>
        <p className="text-stone-500">Find women entrepreneurs across Tamil Nadu</p>
      </motion.div>

      {/* Search */}
      <div className="relative mb-6 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search district..."
          className="w-full pl-9 pr-4 py-2.5 border border-stone-200 bg-white/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0F766E]/40 focus:border-[#0F766E]"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* ── District Grid LEFT PANEL ── */}
        <div className="lg:col-span-1">
          <div className="grid grid-cols-2 gap-3 max-h-[680px] overflow-y-auto pr-1">
            {filteredDistricts.map((district, i) => {
              const count = getCount(district);
              const isSelected = selectedDistrict === district;
              const hasData = count > 0;

              return (
                <motion.button
                  key={district}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.02 }}
                  whileHover={{ y: -3, scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setSelectedDistrict(isSelected ? null : district)}
                  className={`relative rounded-2xl overflow-hidden text-left transition-all duration-300 cursor-pointer ${
                    isSelected
                      ? 'ring-2 ring-[#0F766E] shadow-xl shadow-teal-200/50'
                      : hasData
                        ? 'ring-1 ring-stone-200 hover:ring-[#0F766E]/40 hover:shadow-lg'
                        : 'ring-1 ring-stone-100 hover:ring-stone-200'
                  }`}
                >
                  {/* Illustration image */}
                  <div className="relative w-full aspect-square bg-[#FDF6F0]">
                    <img
                      src={getDistrictImage(district)}
                      alt={district}
                      className={`w-full h-full object-cover transition-all duration-500 ${
                        // ✅ FIXED: grayscale when no beneficiaries, color when has data
                        hasData
                          ? 'grayscale-0 opacity-100'
                          : 'grayscale opacity-50'
                      }`}
                      onError={(e) => {
                        // Hide broken images gracefully — show placeholder bg instead
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />

                    {/* Selected teal overlay */}
                    {isSelected && (
                      <div className="absolute inset-0 bg-[#0F766E]/15 pointer-events-none" />
                    )}

                    {/* ✅ Count badge — shows number of beneficiaries */}
                    <span className={`absolute top-2 right-2 text-xs font-bold px-2 py-0.5 rounded-full ${
                      isSelected
                        ? 'bg-[#0F766E] text-white'
                        : hasData
                          ? 'bg-white/90 text-[#0F766E]'
                          : 'bg-white/70 text-stone-400'
                    }`}>
                      {count}
                    </span>
                  </div>

                  {/* District name bar — ✅ BLACK when no data, TEAL when has data */}
                  <div className={`px-2 py-2 ${
                    isSelected
                      ? 'bg-[#0F766E] text-white'
                      : hasData
                        ? 'bg-white text-stone-700'
                        : 'bg-stone-50 text-stone-400'
                  }`}>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 flex-shrink-0" />
                      <span className="text-xs font-semibold truncate">{district}</span>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* ── Beneficiaries RIGHT PANEL ── */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {!selectedDistrict ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center py-24 text-center bg-gradient-to-br from-[#CCFBF1]/40 to-[#FDF6F0] rounded-2xl border border-[#0F766E]/15"
              >
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="w-20 h-20 rounded-full bg-[#CCFBF1] flex items-center justify-center mb-4"
                >
                  <MapPin className="w-10 h-10 text-[#0F766E]" />
                </motion.div>
                <h3 className="text-lg font-semibold text-stone-700 mb-2">Select a District</h3>
                <p className="text-stone-400 text-sm max-w-xs">
                  Choose a district from the left to see women entrepreneurs in that area
                </p>
              </motion.div>
            ) : loading ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0F766E]" />
              </div>
            ) : districtBeneficiaries.length === 0 ? (
              <motion.div
                key="none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <Users className="w-12 h-12 text-stone-300 mb-4" />
                <p className="text-stone-400">No beneficiaries found in {selectedDistrict}</p>
              </motion.div>
            ) : (
              <motion.div
                key={selectedDistrict}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                {/* Selected district header with illustration */}
                <div className="flex items-center gap-4 mb-6 p-4 bg-white/80 rounded-2xl border border-[#0F766E]/15 shadow-sm">
                  <img
                    src={getDistrictImage(selectedDistrict)}
                    alt={selectedDistrict}
                    className="w-16 h-16 rounded-xl object-cover flex-shrink-0 shadow-md"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  <div>
                    <h2 className="text-xl font-bold text-stone-800">{selectedDistrict}</h2>
                    <p className="text-sm text-stone-400">
                      {districtBeneficiaries.length} women entrepreneur{districtBeneficiaries.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>

                {/* Beneficiary cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {districtBeneficiaries.map((ben, i) => (
                    <motion.div
                      key={ben.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06 }}
                      whileHover={{ y: -4, scale: 1.02 }}
                    >
                      <Link to={`/beneficiary/${ben.id}`}>
                        <div className="bg-white/90 backdrop-blur-xl rounded-xl border border-[#C2410C]/10 shadow-sm hover:shadow-lg hover:border-[#0F766E]/30 transition-all p-4 flex gap-4">
                          {ben.profile_image ? (
                            <img
                              src={ben.profile_image}
                              alt={ben.business_name}
                              className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#CCFBF1] to-[#FFEDD5] flex items-center justify-center flex-shrink-0">
                              <Users className="w-8 h-8 text-[#0F766E]" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-stone-800 truncate">{ben.business_name}</h3>
                            <p className="text-xs text-stone-500 mt-0.5">{ben.location}</p>
                            <p className="text-xs text-stone-400 line-clamp-2 mt-1">{ben.about}</p>
                            {ben.mobile_number && (
                              <p className="text-xs text-[#0F766E] font-medium mt-1">📞 {ben.mobile_number}</p>
                            )}
                          </div>
                          <ChevronRight className="w-4 h-4 text-stone-300 flex-shrink-0 self-center" />
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Search, Users, ChevronRight } from 'lucide-react';
import type { Beneficiary } from '../types';

const TN_DISTRICTS = [
  'Ariyalur','Chengalpattu','Chennai','Coimbatore','Cuddalore',
  'Dharmapuri','Dindigul','Erode','Kallakurichi','Kancheepuram',
  'Karur','Krishnagiri','Madurai','Mayiladuthurai','Nagapattinam',
  'Namakkal','Nilgiris','Perambalur','Pudukkottai','Ramanathapuram',
  'Ranipet','Salem','Sivaganga','Tenkasi','Thanjavur','Theni',
  'Thoothukudi','Tiruchirappalli','Tirunelveli','Tirupathur',
  'Tiruppur','Tiruvallur','Tiruvannamalai','Tiruvarur','Vellore',
  'Viluppuram','Virudhunagar',
];

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
      <nav className="text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-blue-600 transition">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800 font-medium">Browse by District</span>
      </nav>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Browse by District</h1>
        <p className="text-gray-500">Find women entrepreneurs across Tamil Nadu</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* District List */}
        <div className="lg:col-span-1">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search district..."
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {filteredDistricts.map((district, i) => {
              const count = getCount(district);
              const isSelected = selectedDistrict === district;
              return (
                <motion.button
                  key={district}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.02 }}
                  whileHover={{ x: 4 }}
                  onClick={() => setSelectedDistrict(isSelected ? null : district)}
                  disabled={count === 0}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                      : count > 0
                        ? 'bg-white border border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50'
                        : 'bg-gray-50 border border-gray-100 text-gray-300 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {district}
                  </div>
                  {count > 0 && (
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-600'
                    }`}>
                      {count}
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Beneficiaries Panel */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {!selectedDistrict ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center py-24 text-center bg-gradient-to-br from-blue-50 to-white rounded-2xl border border-blue-100"
              >
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mb-4"
                >
                  <MapPin className="w-10 h-10 text-blue-400" />
                </motion.div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Select a District</h3>
                <p className="text-gray-400 text-sm max-w-xs">
                  Choose a district from the left to see women entrepreneurs in that area
                </p>
              </motion.div>
            ) : loading ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
              </div>
            ) : districtBeneficiaries.length === 0 ? (
              <motion.div
                key="none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <Users className="w-12 h-12 text-gray-300 mb-4" />
                <p className="text-gray-400">No beneficiaries found in {selectedDistrict}</p>
              </motion.div>
            ) : (
              <motion.div
                key={selectedDistrict}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-800">
                    {selectedDistrict}
                    <span className="ml-2 text-sm font-normal text-gray-400">
                      ({districtBeneficiaries.length} businesses)
                    </span>
                  </h2>
                </div>
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
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-blue-200 transition-all p-4 flex gap-4">
                          {ben.profile_image ? (
                            <img src={ben.profile_image} alt={ben.business_name} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                          ) : (
                            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center flex-shrink-0">
                              <Users className="w-8 h-8 text-blue-400" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-800 truncate">{ben.business_name}</h3>
                            <p className="text-xs text-gray-500 mt-0.5">{ben.location}</p>
                            <p className="text-xs text-gray-400 line-clamp-2 mt-1">{ben.about}</p>
                            {ben.mobile_number && (
                              <p className="text-xs text-blue-600 font-medium mt-1">📞 {ben.mobile_number}</p>
                            )}
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0 self-center" />
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
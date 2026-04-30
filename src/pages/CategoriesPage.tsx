import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, ChevronRight, Folder } from 'lucide-react';
import { useApp } from '../context/AppContext';

const SECTORS = [
  {
    id: 'agriculture',
    name: 'Agriculture & Allied Activities',
    description: 'Farming, horticulture, and allied agricultural businesses run by women SHGs.',
    image: '/illustrations/sectors/agri.png',
    gradient: { from: 'from-[#C2410C]', to: 'to-[#D97706]' },
    fallbackBg: 'linear-gradient(135deg, #FFEDD5, #FEF3C7)',
  },
  {
    id: 'animal-husbandry',
    name: 'Animal Husbandry',
    description: 'Dairy, poultry, and livestock-based livelihoods by women entrepreneurs.',
    image: '/illustrations/sectors/animal-husbandry.png',
    gradient: { from: 'from-[#0F766E]', to: 'to-[#0d9488]' },
    fallbackBg: 'linear-gradient(135deg, #CCFBF1, #D1FAE5)',
  },
  {
    id: 'handloom',
    name: 'Handloom & Handicrafts',
    description: 'Weaving, crafts, and traditional handmade products by skilled artisans.',
    image: '/illustrations/sectors/handloom.png',
    gradient: { from: 'from-[#D97706]', to: 'to-[#f59e0b]' },
    fallbackBg: 'linear-gradient(135deg, #FEF3C7, #FDE68A)',
  },
  {
    id: 'manufacturing',
    name: 'Manufacturing / Production',
    description: 'Small-scale production and manufacturing units led by women.',
    image: '/illustrations/sectors/manufacturing.png',
    gradient: { from: 'from-[#C2410C]', to: 'to-[#0F766E]' },
    fallbackBg: 'linear-gradient(135deg, #FFEDD5, #CCFBF1)',
  },
  {
    id: 'service',
    name: 'Service',
    description: 'Tailoring, beauty, catering, and other service-based businesses.',
    image: '/illustrations/sectors/service.png',
    gradient: { from: 'from-[#0F766E]', to: 'to-[#D97706]' },
    fallbackBg: 'linear-gradient(135deg, #CCFBF1, #FEF3C7)',
  },
  {
    id: 'trade',
    name: 'Trade',
    description: 'Retail, wholesale, and commerce businesses run by women SHG members.',
    image: '/illustrations/sectors/trade.png',
    gradient: { from: 'from-[#D97706]', to: 'to-[#C2410C]' },
    fallbackBg: 'linear-gradient(135deg, #FEF3C7, #FFEDD5)',
  },
];

export default function CategoriesPage() {
  const { beneficiaries } = useApp();

  const countBySector = (sectorName: string) =>
    beneficiaries.filter(b => b.sector === sectorName).length;

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
          <p className="text-stone-500">Browse beneficiaries by sector</p>
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

      {/* Sector Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {SECTORS.map((sector, index) => {
          const count = countBySector(sector.name);
          return (
            <motion.div
              key={sector.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link to={`/businesses?sector=${encodeURIComponent(sector.name)}`}>
                <motion.div
                  whileHover={{ y: -8, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  className="group relative bg-white/75 backdrop-blur-xl border border-white/60 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 flex flex-col"
                >
                  {/* Top gradient bar */}
                  <div className={`h-1.5 bg-gradient-to-r ${sector.gradient.from} ${sector.gradient.to} flex-shrink-0`} />

                  {/* Illustration — always exactly h-44 (176px), never collapses */}
                  <div
                    className="relative w-full flex-shrink-0 overflow-hidden flex items-center justify-center"
                    style={{ height: '176px', background: '#FDF6F0' }}
                  >
                    <img
                      src={sector.image}
                      alt={sector.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={e => {
                        const img = e.target as HTMLImageElement;
                        img.style.display = 'none';
                        const parent = img.parentElement;
                        if (parent) {
                          parent.style.background = sector.fallbackBg;
                        }
                      }}
                    />
                    <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white/60 to-transparent pointer-events-none" />
                  </div>

                  {/* Card body */}
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="text-lg font-bold text-stone-900 group-hover:text-[#C2410C] transition-colors leading-tight mb-1">
                      {sector.name}
                    </h3>
                    <p className="text-sm text-stone-500 line-clamp-2 mb-3">
                      {sector.description}
                    </p>

                    {count > 0 && (
                      <div className="flex items-center gap-1.5 text-stone-400 mb-3">
                        <Folder className="w-3.5 h-3.5" />
                        <span className="text-xs font-medium">{count} businesses</span>
                      </div>
                    )}

                    <div className="flex items-center gap-1 text-[#C2410C] font-semibold text-sm group-hover:gap-2 transition-all mt-auto">
                      <span>Explore</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Hover overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${sector.gradient.from} ${sector.gradient.to} opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none`} />
                </motion.div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
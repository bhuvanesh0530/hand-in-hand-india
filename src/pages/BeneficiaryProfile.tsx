import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Phone, MessageCircle, MapPin, Clock, Package,
  Star, User, Share2, ThumbsUp,
  Image as ImageIcon, ExternalLink, ChevronLeft, ChevronRight
} from 'lucide-react';
import type { Beneficiary, Category } from '../types';

export default function BeneficiaryProfile() {
  const { id } = useParams<{ id: string }>();
  const [beneficiary, setBeneficiary] = useState<Beneficiary | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [similar, setSimilar] = useState<Beneficiary[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    async function fetchData() {
      const { data: ben } = await supabase
        .from('beneficiaries')
        .select('*')
        .eq('id', id)
        .single();
      if (!ben) {
        setLoading(false);
        return;
      }
      setBeneficiary(ben as Beneficiary);

      const { data: cat } = await supabase
        .from('categories')
        .select('*')
        .eq('id', ben.category_id)
        .single();
      setCategory(cat);

      const { data: sim } = await supabase
        .from('beneficiaries')
        .select('*')
        .eq('district', ben.district)
        .neq('id', id)
        .limit(3);
      setSimilar((sim as Beneficiary[]) || []);

      setLoading(false);
    }
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="rounded-full h-12 w-12 border-b-2 border-blue-600"
        />
      </div>
    );
  }

  if (!beneficiary) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Beneficiary not found.
      </div>
    );
  }

  const services =
    typeof beneficiary.services === 'string'
      ? (beneficiary.services as string)
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
      : beneficiary.services || [];

  const gallery = beneficiary.gallery_images || [];

  const prevImage = () => {
    setActiveImage((i) => (i - 1 + gallery.length) % gallery.length);
  };

  const nextImage = () => {
    setActiveImage((i) => (i + 1) % gallery.length);
  };

  const isEmbedUrl = beneficiary.map_link?.includes('/maps/embed');

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">

      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2 flex-wrap">
        <Link to="/" className="hover:text-blue-600 transition">Home</Link>
        <span>/</span>
        <Link to="/districts" className="hover:text-blue-600 transition">Districts</Link>
        {beneficiary.district && (
          <>
            <span>/</span>
            <span>{beneficiary.district}</span>
          </>
        )}
        <span>/</span>
        <span className="text-gray-800 font-medium truncate">
          {beneficiary.business_name}
        </span>
      </nav>

      {/* HERO CARD */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-xl overflow-hidden mb-6"
      >
        {/* Banner */}
        <div className="h-36 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-500 relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                'radial-gradient(rgba(255,255,255,0.4) 1px, transparent 1px)',
              backgroundSize: '18px 18px',
            }}
          />
          <motion.div
            animate={{ x: [0, 100, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            className="absolute top-4 left-8 w-24 h-24 rounded-full bg-white/10 blur-xl"
          />
          <motion.div
            animate={{ x: [0, -80, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
            className="absolute bottom-2 right-12 w-16 h-16 rounded-full bg-white/10 blur-xl"
          />

          {/* Profile image + shop name ON the banner */}
          <div className="absolute bottom-0 left-6 right-6 flex items-end gap-4 pb-3">
            {/* Profile image */}
            <motion.div whileHover={{ scale: 1.05 }} className="relative flex-shrink-0">
              {beneficiary.profile_image ? (
                <img
                  src={beneficiary.profile_image}
                  alt={beneficiary.business_name}
                  className="w-20 h-20 rounded-2xl object-cover border-4 border-white shadow-xl"
                />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 border-4 border-white shadow-xl flex items-center justify-center">
                  <User className="w-10 h-10 text-blue-400" />
                </div>
              )}
              {beneficiary.featured && (
                <div className="absolute -top-2 -right-2 bg-amber-400 rounded-full p-1.5 shadow-lg">
                  <Star className="w-3 h-3 text-white fill-white" />
                </div>
              )}
            </motion.div>

            {/* Shop name + owner name + category */}
            <div className="pb-2 flex-1 min-w-0">
              {category && (
                <span className="inline-block px-3 py-1 bg-white/25 backdrop-blur-sm text-white text-xs font-bold rounded-full mb-1.5 tracking-wide uppercase">
                  {category.name}
                </span>
              )}
              <h1
                className="text-2xl font-extrabold text-white tracking-tight leading-tight drop-shadow-lg"
                style={{ fontFamily: "'Georgia', 'Times New Roman', serif", textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}
              >
                {beneficiary.business_name}
              </h1>
              {/* ✅ Owner name shown below shop name */}
              {beneficiary.name && (
                <p className="text-sm text-white/80 font-medium mt-0.5 drop-shadow">
                  {beneficiary.name}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="px-6 pb-6">
          {/* Location + hours row */}
          <div className="flex flex-wrap items-center gap-3 mt-4 mb-4">
            {beneficiary.district && (
              <span className="flex items-center gap-1 text-sm text-gray-500">
                <MapPin className="w-3.5 h-3.5 text-blue-500" />
                {beneficiary.district}
              </span>
            )}
            {beneficiary.location && (
              <span className="text-sm text-gray-400">
                · {beneficiary.location}
              </span>
            )}
            {beneficiary.working_hours && (
              <span className="flex items-center gap-1 text-sm text-gray-500">
                <Clock className="w-3.5 h-3.5 text-green-500" />
                {beneficiary.working_hours}
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 mb-4">
            {beneficiary.mobile_number && (
              <motion.a
                href={'tel:' + beneficiary.mobile_number}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold shadow-lg shadow-blue-200"
              >
                <Phone className="w-4 h-4" />
                Call Now
              </motion.a>
            )}
            {beneficiary.whatsapp && (
              <motion.a
                href={'https://wa.me/' + beneficiary.whatsapp}
                target="_blank"
                rel="noreferrer"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-5 py-2.5 bg-green-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-green-200"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </motion.a>
            )}
            {beneficiary.map_link && (
              <motion.a
                href={beneficiary.map_link}
                target="_blank"
                rel="noreferrer"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-orange-200"
              >
                <MapPin className="w-4 h-4" />
                Get Directions
              </motion.a>
            )}
          </div>

          {/* Services */}
          {services.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {services.map((service, i) => (
                <motion.span
                  key={i}
                  whileHover={{ scale: 1.05 }}
                  className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-lg cursor-default"
                >
                  {service}
                </motion.span>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* MAIN CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-6">

          {/* About */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
          >
            <h2 className="text-lg font-bold text-gray-800 mb-3">About</h2>
            <p className="text-gray-600 leading-relaxed">
              {beneficiary.about || 'No description available.'}
            </p>
          </motion.div>

          {/* Work Gallery */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
          >
            <h2 className="text-lg font-bold text-gray-800 mb-4">Work Gallery</h2>
            {gallery.length > 0 ? (
              <div>
                <div className="relative rounded-xl overflow-hidden aspect-video bg-gray-100 mb-3">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={activeImage}
                      src={gallery[activeImage]}
                      alt="Gallery"
                      initial={{ opacity: 0, scale: 1.05 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="w-full h-full object-cover"
                    />
                  </AnimatePresence>
                  {gallery.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-md hover:bg-white transition"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-md hover:bg-white transition"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                        {gallery.map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setActiveImage(i)}
                            className={
                              'rounded-full transition-all ' +
                              (activeImage === i
                                ? 'bg-white w-4 h-2'
                                : 'bg-white/50 w-2 h-2')
                            }
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {gallery.map((img, i) => (
                    <motion.button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      whileHover={{ scale: 1.05 }}
                      className={
                        'flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ' +
                        (activeImage === i
                          ? 'border-blue-500'
                          : 'border-transparent opacity-60')
                      }
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </motion.button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 bg-gray-50 rounded-xl">
                <ImageIcon className="w-10 h-10 text-gray-300 mb-2" />
                <p className="text-sm text-gray-400">
                  This beneficiary prefers not to share photos
                </p>
              </div>
            )}
          </motion.div>

          {/* Google Map */}
          {beneficiary.map_link && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
            >
              <h2 className="text-lg font-bold text-gray-800 mb-4">Location</h2>
              {isEmbedUrl ? (
                <>
                  <div className="rounded-xl overflow-hidden aspect-video">
                    <iframe
                      src={beneficiary.map_link}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      title="Location Map"
                    />
                  </div>
                  <a
                    href={beneficiary.map_link}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 flex items-center gap-2 text-blue-600 text-sm font-medium hover:underline"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Open in Google Maps
                  </a>
                </>
              ) : (
                <motion.a
                  href={beneficiary.map_link}
                  target="_blank"
                  rel="noreferrer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center gap-3 w-full py-4 bg-orange-50 border-2 border-orange-200 rounded-xl text-orange-600 font-semibold hover:bg-orange-100 transition"
                >
                  <MapPin className="w-5 h-5" />
                  Open Location in Google Maps
                </motion.a>
              )}
            </motion.div>
          )}
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">

          {/* Business Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
          >
            <h2 className="text-lg font-bold text-gray-800 mb-4">Business Details</h2>
            <div className="space-y-4">
              {/* ✅ Owner name in Business Details sidebar */}
              {beneficiary.name && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-rose-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium mb-0.5">Owner</p>
                    <p className="text-sm text-gray-700 font-medium">{beneficiary.name}</p>
                  </div>
                </div>
              )}
              {beneficiary.working_hours && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-4 h-4 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium mb-0.5">Working Hours</p>
                    <p className="text-sm text-gray-700 font-medium">
                      {beneficiary.working_hours}
                    </p>
                  </div>
                </div>
              )}
              {beneficiary.mobile_number && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-4 h-4 text-green-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium mb-0.5">Phone</p>
                    <a
                      href={'tel:' + beneficiary.mobile_number}
                      className="text-sm text-blue-600 font-semibold hover:underline"
                    >
                      {beneficiary.mobile_number}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Social Media */}
          {(beneficiary.social_instagram || beneficiary.social_facebook) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
            >
              <h2 className="text-lg font-bold text-gray-800 mb-4">Social Media</h2>
              <div className="space-y-3">
                {beneficiary.social_instagram && (
                  <motion.a
                    href={beneficiary.social_instagram}
                    target="_blank"
                    rel="noreferrer"
                    whileHover={{ x: 4 }}
                    className="flex items-center gap-3 text-sm text-pink-600 hover:underline font-medium"
                  >
                    <div className="w-8 h-8 rounded-lg bg-pink-50 flex items-center justify-center">
                      <Share2 className="w-4 h-4 text-pink-500" />
                    </div>
                    Instagram
                  </motion.a>
                )}
                {beneficiary.social_facebook && (
                  <motion.a
                    href={beneficiary.social_facebook}
                    target="_blank"
                    rel="noreferrer"
                    whileHover={{ x: 4 }}
                    className="flex items-center gap-3 text-sm text-blue-600 hover:underline font-medium"
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                      <ThumbsUp className="w-4 h-4 text-blue-500" />
                    </div>
                    Facebook
                  </motion.a>
                )}
              </div>
            </motion.div>
          )}

          {/* Business Card */}
          {beneficiary.business_card && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
            >
              <h2 className="text-lg font-bold text-gray-800 mb-4">Business Card</h2>
              <img
                src={beneficiary.business_card}
                alt="Business Card"
                className="w-full rounded-xl shadow-sm"
              />
            </motion.div>
          )}
        </div>
      </div>

      {/* Similar Nearby */}
      {similar.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Similar Nearby in {beneficiary.district}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {similar.map((ben) => (
              <motion.div
                key={ben.id}
                whileHover={{ y: -4, scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                <Link to={'/beneficiary/' + ben.id}>
                  <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-4 flex gap-3">
                    {ben.profile_image ? (
                      <img
                        src={ben.profile_image}
                        alt={ben.business_name}
                        className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <User className="w-6 h-6 text-blue-400" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-gray-800 truncate">
                        {ben.business_name}
                      </p>
                      {/* ✅ Owner name in Similar Nearby cards */}
                      {ben.name && (
                        <p className="text-xs text-gray-500 font-medium">{ben.name}</p>
                      )}
                      <p className="text-xs text-gray-400">{ben.location}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
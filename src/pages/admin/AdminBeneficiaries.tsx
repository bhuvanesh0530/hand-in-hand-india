import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import type { Category } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Edit2, Trash2, Eye, ChevronDown, ChevronUp } from 'lucide-react';

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

const SECTORS = [
  'Agriculture & Allied Activities',
  'Animal Husbandry',
  'Handloom & Handicrafts',
  'Manufacturing / Production',
  'Service',
  'Trade',
];

interface BeneficiaryRow {
  id: string;
  name?: string | null;
  business_name?: string | null;
  district?: string | null;
  location?: string | null;
  about?: string | null;
  services?: string | null;
  mobile_number?: string | null;
  whatsapp?: string | null;
  social_instagram?: string | null;
  social_facebook?: string | null;
  map_link?: string | null;
  profile_image?: string | null;
  gallery_images?: string[] | null;
  business_card?: string | null;
  working_hours?: string | null;
  featured?: boolean | null;
  category_id?: string | null;
  sector?: string | null;
  categories?: { name: string };
}

const EMPTY_FORM: Omit<BeneficiaryRow, 'id' | 'categories'> = {
  name: '',
  business_name: '',
  district: '',
  location: '',
  about: '',
  services: '',
  mobile_number: '',
  whatsapp: '',
  social_instagram: '',
  social_facebook: '',
  map_link: '',
  profile_image: '',
  gallery_images: [],
  business_card: '',
  working_hours: '',
  featured: false,
  category_id: '',
  sector: '',
};

export default function AdminBeneficiaries() {
  const navigate = useNavigate();
  const [beneficiaries, setBeneficiaries] = useState<BeneficiaryRow[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<BeneficiaryRow, 'id' | 'categories'>>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [uploadingProfile, setUploadingProfile] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [uploadingCard, setUploadingCard] = useState(false);
  const profileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const cardInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate('/admin/login'); return; }
      await Promise.all([fetchBeneficiaries(), fetchCategories()]);
    }
    init();
  }, [navigate]);

  async function fetchBeneficiaries() {
    const { data } = await supabase
      .from('beneficiaries')
      .select('*, categories(name)')
      .order('business_name');
    setBeneficiaries((data as BeneficiaryRow[]) || []);
    setLoading(false);
  }

  async function fetchCategories() {
    const { data } = await supabase.from('categories').select('*').order('name');
    setCategories(data || []);
  }

  async function uploadFile(file: File, folder: string): Promise<string | null> {
    const ext = file.name.split('.').pop();
    const filename = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage
      .from('beneficiary-photos')
      .upload(filename, file, { upsert: true });
    if (error) { setError(error.message); return null; }
    const { data } = supabase.storage.from('beneficiary-photos').getPublicUrl(filename);
    return data.publicUrl;
  }

  async function handleProfileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingProfile(true);
    const url = await uploadFile(file, 'profiles');
    if (url) setForm(f => ({ ...f, profile_image: url }));
    setUploadingProfile(false);
  }

  async function handleGalleryUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploadingGallery(true);
    const urls: string[] = [];
    for (const file of files) {
      const url = await uploadFile(file, 'gallery');
      if (url) urls.push(url);
    }
    setForm(f => ({ ...f, gallery_images: [...(f.gallery_images || []), ...urls] }));
    setUploadingGallery(false);
  }

  async function handleCardUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingCard(true);
    const url = await uploadFile(file, 'cards');
    if (url) setForm(f => ({ ...f, business_card: url }));
    setUploadingCard(false);
  }

  function removeGalleryImage(index: number) {
    setForm(f => ({ ...f, gallery_images: (f.gallery_images || []).filter((_, i) => i !== index) }));
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    setSuccess(null);

    const payload = {
      name: form.name?.trim() || null,
      business_name: form.business_name?.trim() || null,
      district: form.district?.trim() || null,
      location: form.location?.trim() || null,
      about: form.about?.trim() || null,
      services: form.services?.trim() || null,
      mobile_number: form.mobile_number?.trim() || null,
      whatsapp: form.whatsapp?.trim() || null,
      social_instagram: form.social_instagram?.trim() || null,
      social_facebook: form.social_facebook?.trim() || null,
      map_link: form.map_link?.trim() || null,
      profile_image: form.profile_image?.trim() || null,
      gallery_images: form.gallery_images?.length ? form.gallery_images : null,
      business_card: form.business_card?.trim() || null,
      working_hours: form.working_hours?.trim() || null,
      featured: form.featured || false,
      category_id: form.category_id || null,
      sector: form.sector?.trim() || null,
    };

    let err;
    if (editingId) {
      ({ error: err } = await supabase.from('beneficiaries').update(payload).eq('id', editingId));
    } else {
      ({ error: err } = await supabase.from('beneficiaries').insert(payload));
    }

    if (err) {
      setError(err.message);
    } else {
      setSuccess(editingId ? 'Updated successfully!' : 'Added successfully!');
      setForm(EMPTY_FORM);
      setEditingId(null);
      setShowForm(false);
      fetchBeneficiaries();
    }
    setSaving(false);
  }

  function handleEdit(ben: BeneficiaryRow) {
    setForm({
      name: ben.name || '',
      business_name: ben.business_name || '',
      district: ben.district || '',
      location: ben.location || '',
      about: ben.about || '',
      services: ben.services || '',
      mobile_number: ben.mobile_number || '',
      whatsapp: ben.whatsapp || '',
      social_instagram: ben.social_instagram || '',
      social_facebook: ben.social_facebook || '',
      map_link: ben.map_link || '',
      profile_image: ben.profile_image || '',
      gallery_images: ben.gallery_images || [],
      business_card: ben.business_card || '',
      working_hours: ben.working_hours || '',
      featured: ben.featured || false,
      category_id: ben.category_id || '',
      sector: ben.sector || '',
    });
    setEditingId(ben.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this beneficiary? This cannot be undone.')) return;
    await supabase.from('beneficiaries').delete().eq('id', id);
    setSuccess('Deleted successfully.');
    fetchBeneficiaries();
  }

  function cancelEdit() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(false);
    setError(null);
  }

  const inp = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 bg-white";
  const label = "block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide";

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Manage Beneficiaries</h1>
          <p className="text-sm text-gray-400 mt-0.5">{beneficiaries.length} total</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => { setShowForm(s => !s); setEditingId(null); setForm(EMPTY_FORM); }}
            className="flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white px-5 py-2 rounded-xl text-sm font-semibold transition"
          >
            {showForm ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            {showForm ? 'Close Form' : '+ Add Beneficiary'}
          </button>
          <button onClick={() => navigate('/admin/dashboard')}
            className="text-sm text-gray-500 hover:text-gray-700 px-3 py-2 rounded-xl border border-gray-200">
            ← Dashboard
          </button>
        </div>
      </div>

      {/* Alerts */}
      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">{error}</div>}
      {success && <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-600 rounded-xl text-sm">{success}</div>}

      {/* ── FORM ── */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8"
          >
            <h2 className="font-bold text-gray-700 mb-6 text-lg">
              {editingId ? '✏️ Edit Beneficiary' : '➕ Add New Beneficiary'}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              {/* Beneficiary Full Name */}
              <div className="sm:col-span-2">
                <label className={label}>Beneficiary Full Name</label>
                <input className={inp} placeholder="e.g. Prema Selvakumar"
                  value={form.name || ''} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>

              {/* Shop / Business Name */}
              <div className="sm:col-span-2">
                <label className={label}>Shop / Business Name</label>
                <input className={inp} placeholder="e.g. Prema Stitching Shop"
                  value={form.business_name || ''} onChange={e => setForm(f => ({ ...f, business_name: e.target.value }))} />
              </div>

              {/* District dropdown */}
              <div>
                <label className={label}>District</label>
                <select className={inp} value={form.district || ''}
                  onChange={e => setForm(f => ({ ...f, district: e.target.value }))}>
                  <option value="">Select district</option>
                  {TN_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              {/* ── SECTOR dropdown (hardcoded) ── */}
              <div>
                <label className={label}>Category / Sector</label>
                <select className={inp} value={form.sector || ''}
                  onChange={e => setForm(f => ({ ...f, sector: e.target.value }))}>
                  <option value="">Select sector</option>
                  {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              {/* Shop Address */}
              <div className="sm:col-span-2">
                <label className={label}>Shop Address</label>
                <input className={inp} placeholder="e.g. Ward 12, Near Community Hall, Kanchipuram"
                  value={form.location || ''} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
              </div>

              {/* About */}
              <div className="sm:col-span-2">
                <label className={label}>About</label>
                <textarea className={inp} rows={3}
                  placeholder="Describe the beneficiary, their work and background..."
                  value={form.about || ''} onChange={e => setForm(f => ({ ...f, about: e.target.value }))} />
              </div>

              {/* Services */}
              <div className="sm:col-span-2">
                <label className={label}>Services Offered</label>
                <input className={inp} placeholder="Stitching, Alterations, Embroidery (comma separated)"
                  value={form.services || ''} onChange={e => setForm(f => ({ ...f, services: e.target.value }))} />
                <p className="text-xs text-gray-400 mt-1">Separate each service with a comma</p>
              </div>

              {/* Phone */}
              <div>
                <label className={label}>Phone Number</label>
                <input className={inp} placeholder="+91 98765 43210"
                  value={form.mobile_number || ''} onChange={e => setForm(f => ({ ...f, mobile_number: e.target.value }))} />
              </div>

              {/* WhatsApp */}
              <div>
                <label className={label}>WhatsApp Number</label>
                <input className={inp} placeholder="919876543210 (with country code, no +)"
                  value={form.whatsapp || ''} onChange={e => setForm(f => ({ ...f, whatsapp: e.target.value }))} />
              </div>

              {/* Instagram */}
              <div>
                <label className={label}>Instagram URL</label>
                <input className={inp} placeholder="https://instagram.com/username"
                  value={form.social_instagram || ''} onChange={e => setForm(f => ({ ...f, social_instagram: e.target.value }))} />
              </div>

              {/* Facebook */}
              <div>
                <label className={label}>Facebook URL</label>
                <input className={inp} placeholder="https://facebook.com/pagename"
                  value={form.social_facebook || ''} onChange={e => setForm(f => ({ ...f, social_facebook: e.target.value }))} />
              </div>

              {/* Google Maps Link */}
              <div>
                <label className={label}>Google Maps Link</label>
                <input className={inp} placeholder="https://maps.google.com/..."
                  value={form.map_link || ''} onChange={e => setForm(f => ({ ...f, map_link: e.target.value }))} />
              </div>

              {/* Working Hours */}
              <div>
                <label className={label}>Working Hours</label>
                <input className={inp} placeholder="Mon–Sat, 9am–6pm"
                  value={form.working_hours || ''} onChange={e => setForm(f => ({ ...f, working_hours: e.target.value }))} />
              </div>

              {/* Featured toggle */}
              <div className="sm:col-span-2 flex items-center gap-3">
                <input type="checkbox" id="featured" checked={form.featured || false}
                  onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))}
                  className="w-4 h-4 accent-rose-500" />
                <label htmlFor="featured" className="text-sm text-gray-600 cursor-pointer">
                  Mark as Featured (shows on home page with a star badge)
                </label>
              </div>

              {/* Profile Photo Upload */}
              <div className="sm:col-span-2">
                <label className={label}>Profile Photo</label>
                <div className="flex items-center gap-4">
                  {form.profile_image && (
                    <img src={form.profile_image} alt="profile"
                      className="w-16 h-16 rounded-xl object-cover border border-gray-200" />
                  )}
                  <button type="button"
                    onClick={() => profileInputRef.current?.click()}
                    className="flex items-center gap-2 px-4 py-2 border border-dashed border-gray-300 rounded-xl text-sm text-gray-500 hover:border-rose-400 hover:text-rose-500 transition"
                  >
                    <Upload className="w-4 h-4" />
                    {uploadingProfile ? 'Uploading...' : 'Upload from PC'}
                  </button>
                  {form.profile_image && (
                    <button onClick={() => setForm(f => ({ ...f, profile_image: '' }))}
                      className="text-red-400 hover:text-red-600">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <input ref={profileInputRef} type="file" accept="image/*" className="hidden"
                  onChange={handleProfileUpload} />
              </div>

              {/* Gallery Photos Upload */}
              <div className="sm:col-span-2">
                <label className={label}>Work Gallery Photos</label>
                <button type="button"
                  onClick={() => galleryInputRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2 border border-dashed border-gray-300 rounded-xl text-sm text-gray-500 hover:border-rose-400 hover:text-rose-500 transition mb-3"
                >
                  <Upload className="w-4 h-4" />
                  {uploadingGallery ? 'Uploading...' : 'Upload Photos (select multiple)'}
                </button>
                <input ref={galleryInputRef} type="file" accept="image/*" multiple className="hidden"
                  onChange={handleGalleryUpload} />
                {(form.gallery_images || []).length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {(form.gallery_images || []).map((url, i) => (
                      <div key={i} className="relative">
                        <img src={url} alt={`gallery-${i}`}
                          className="w-16 h-16 rounded-lg object-cover border border-gray-200" />
                        <button onClick={() => removeGalleryImage(i)}
                          className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Business Card Upload */}
              <div className="sm:col-span-2">
                <label className={label}>Business Card Image</label>
                <div className="flex items-center gap-4">
                  {form.business_card && (
                    <img src={form.business_card} alt="card"
                      className="w-24 h-14 rounded-lg object-cover border border-gray-200" />
                  )}
                  <button type="button"
                    onClick={() => cardInputRef.current?.click()}
                    className="flex items-center gap-2 px-4 py-2 border border-dashed border-gray-300 rounded-xl text-sm text-gray-500 hover:border-rose-400 hover:text-rose-500 transition"
                  >
                    <Upload className="w-4 h-4" />
                    {uploadingCard ? 'Uploading...' : 'Upload Business Card'}
                  </button>
                  {form.business_card && (
                    <button onClick={() => setForm(f => ({ ...f, business_card: '' }))}
                      className="text-red-400 hover:text-red-600">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <input ref={cardInputRef} type="file" accept="image/*" className="hidden"
                  onChange={handleCardUpload} />
              </div>
            </div>

            {/* Form Buttons */}
            <div className="flex gap-3 mt-6">
              <button onClick={handleSave} disabled={saving}
                className="bg-rose-500 hover:bg-rose-600 text-white px-8 py-2.5 rounded-xl text-sm font-semibold transition disabled:opacity-50">
                {saving ? 'Saving...' : editingId ? 'Update Beneficiary' : 'Add Beneficiary'}
              </button>
              {editingId && (
                <button onClick={cancelEdit}
                  className="px-6 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-500 hover:bg-gray-50 transition">
                  Cancel
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── BENEFICIARIES LIST ── */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-rose-500" />
        </div>
      ) : beneficiaries.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          No beneficiaries yet. Click "+ Add Beneficiary" to get started.
        </div>
      ) : (
        <div className="space-y-3">
          {beneficiaries.map((ben, i) => (
            <motion.div
              key={ben.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
              className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-4 flex items-center gap-4"
            >
              {ben.profile_image ? (
                <img src={ben.profile_image} alt={ben.business_name || ''}
                  className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-rose-100 flex items-center justify-center text-rose-500 font-bold text-sm flex-shrink-0">
                  {(ben.business_name || '?').slice(0, 2).toUpperCase()}
                </div>
              )}

              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 truncate">
                  {ben.business_name || 'Unnamed'}
                  {ben.featured && <span className="ml-2 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">★ Featured</span>}
                </p>
                {ben.name && (
                  <p className="text-xs text-gray-600 font-medium mt-0.5">{ben.name}</p>
                )}
                <p className="text-xs text-gray-400 mt-0.5">
                  {ben.sector && <span className="mr-2">{ben.sector}</span>}
                  {ben.district && <span className="mr-2">· {ben.district}</span>}
                  {ben.mobile_number && <span>· {ben.mobile_number}</span>}
                </p>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <a href={`/beneficiary/${ben.id}`} target="_blank" rel="noreferrer"
                  className="p-2 text-gray-400 hover:text-blue-500 transition" title="View public profile">
                  <Eye className="w-4 h-4" />
                </a>
                <button onClick={() => handleEdit(ben)}
                  className="p-2 text-gray-400 hover:text-rose-500 transition" title="Edit">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(ben.id)}
                  className="p-2 text-gray-400 hover:text-red-500 transition" title="Delete">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, deleteDoc, doc, serverTimestamp, query, orderBy, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../../firebase/config';
import { useAuth } from '../../context/AuthContext';
import { logActivity } from '../../utils/activityLog';
import AdminLayout from '../../components/AdminLayout';
import PageTitle from '../../components/PageTitle';
import { FaEdit, FaTrash, FaPlus, FaImage, FaBuilding, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function AddPartner() {
  const { user } = useAuth();
  const [partners, setPartners] = useState([]);
  const [form, setForm] = useState({ name: '', order: '', image: null });
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loadingPartners, setLoadingPartners] = useState(true);
  const [editingPartner, setEditingPartner] = useState(null);
  const [status, setStatus] = useState(null);

  // Fetch existing partners
  const fetchPartners = async () => {
    try {
      const q = query(collection(db, 'partners'), orderBy('timestamp', 'desc'));
      const snap = await getDocs(q);
      setPartners(snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => (Number(a.order) || 9999) - (Number(b.order) || 9999)));
    } finally {
      setLoadingPartners(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setStatus(null);

    if (name === 'image') {
      const file = files[0];
      if (file) {
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setForm({ ...form, image: file });
        setPreviewUrl(URL.createObjectURL(file));
      }
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.image && !editingPartner) {
      setStatus({ type: 'error', message: 'Please upload a logo.' });
      return toast.error("Please upload a logo");
    }
    
    setUploading(true);
    try {
      let imageUrl = editingPartner?.imageUrl || '';
      let imagePath = editingPartner?.imagePath || '';

      if (form.image) {
        imagePath = `partners/${Date.now()}-${form.image.name}`;
        const imgRef = ref(storage, imagePath);
        const snap = await uploadBytes(imgRef, form.image);
        imageUrl = await getDownloadURL(snap.ref);

        if (editingPartner?.imagePath) {
          await deleteObject(ref(storage, editingPartner.imagePath));
        }
      }

      const payload = {
        name: form.name,
        order: Number(form.order) || partners.length + 1,
        imageUrl,
        imagePath,
      };

      if (editingPartner) {
        await updateDoc(doc(db, 'partners', editingPartner.id), {
          ...payload,
          updatedAt: serverTimestamp(),
        });
        await logActivity(user, 'edit_partner', `Updated partner: ${form.name}`);
        setStatus({ type: 'success', message: 'Partner updated successfully.' });
        toast.success('Partner updated successfully!');
      } else {
        await addDoc(collection(db, 'partners'), {
          ...payload,
          timestamp: serverTimestamp(),
        });
        await logActivity(user, 'add_partner', `Added partner: ${form.name}`);
        setStatus({ type: 'success', message: 'Partner added successfully.' });
        toast.success('Partner added successfully!');
      }

      resetForm();
      fetchPartners(); // Refresh list
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Failed to save partner.' });
      toast.error(err.message);
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setForm({ name: '', order: '', image: null });
    setPreviewUrl(null);
    setEditingPartner(null);
  };

  const handleEdit = (partner) => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setEditingPartner(partner);
    setForm({ name: partner.name || '', order: partner.order || '', image: null });
    setPreviewUrl(null);
    setStatus(null);
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Remove ${name} from partners?`)) {
      try {
        await deleteDoc(doc(db, 'partners', id));
        const partner = partners.find(item => item.id === id);
        if (partner?.imagePath) {
          await deleteObject(ref(storage, partner.imagePath));
        }
        toast.success('Partner removed');
        setStatus({ type: 'success', message: 'Partner removed successfully.' });
        fetchPartners();
      } catch (err) {
        setStatus({ type: 'error', message: 'Failed to delete partner.' });
        toast.error('Failed to delete');
      }
    }
  };

  return (
    <AdminLayout>
      <PageTitle>🤝 Manage Partners & Institutions</PageTitle>

      <div className="grid lg:grid-cols-3 gap-5 items-start">
        
        {/* Form Section */}
        <form onSubmit={handleSubmit} className="lg:col-span-1 space-y-4 bg-white dark:bg-gray-800 p-5 rounded-lg border border-slate-100 dark:border-gray-700 shadow-sm">
          <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
            {editingPartner ? <FaEdit className="text-primary" /> : <FaPlus className="text-primary" />}
            {editingPartner ? 'Edit Partner' : 'Add New Partner'}
          </h3>

          {status && (
            <div
              className={`rounded-lg border px-4 py-3 text-sm font-semibold ${
                status.type === 'success'
                  ? 'border-green-200 bg-green-50 text-green-700'
                  : 'border-red-200 bg-red-50 text-red-700'
              }`}
              role="status"
            >
              {status.message}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Institution Name</label>
            <div className="relative">
              <FaBuilding className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-slate-400" aria-hidden="true" />
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. M'Salem School"
                required
                className="w-full rounded-lg border bg-slate-50 py-3 !pl-11 pr-4 outline-none transition focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Homepage Display Number</label>
            <input
              name="order"
              type="number"
              min="1"
              value={form.order}
              onChange={handleChange}
              placeholder={`e.g. ${partners.length + 1}`}
              className="w-full rounded-lg border bg-slate-50 px-3 py-2.5 outline-none transition focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            />
            <p className="text-xs text-slate-500 dark:text-slate-400">Lower numbers appear first on the public homepage.</p>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Logo (Transparent PNG preferred)</label>
            {previewUrl || editingPartner?.imageUrl ? (
              <div className="relative group rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                <img src={previewUrl || editingPartner.imageUrl} alt="Preview" className="w-full h-32 object-contain p-4" />
                <button 
                  type="button" 
                  onClick={() => {
                    if (previewUrl) URL.revokeObjectURL(previewUrl);
                    setPreviewUrl(null);
                    setForm({...form, image: null});
                    if (editingPartner) setEditingPartner({ ...editingPartner, imageUrl: '' });
                  }}
                  className="absolute inset-0 bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center font-bold text-xs"
                >
                  REMOVE
                </button>
              </div>
            ) : (
              <div className="relative border-2 border-dashed border-slate-200 dark:border-gray-700 rounded-lg p-6 hover:border-primary transition group text-center cursor-pointer">
                <input type="file" name="image" accept="image/*" onChange={handleChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                <FaImage className="mx-auto text-slate-300 group-hover:text-primary mb-2" size={24} />
                <p className="text-[10px] text-slate-400 font-bold uppercase">Upload Logo</p>
              </div>
            )}
          </div>

          <button
            disabled={uploading}
            className="w-full rounded-lg bg-gradient-to-r from-[#003153] to-[#007BA7] py-3 text-xs font-black uppercase tracking-widest text-white shadow-lg transition hover:from-[#001b36] hover:to-[#005f82] disabled:opacity-50"
          >
            {uploading ? 'Uploading...' : editingPartner ? 'Update Partner' : 'Save Partner'}
          </button>

          {editingPartner && (
            <button
              type="button"
              onClick={resetForm}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 px-5 py-3 text-xs font-black uppercase tracking-widest text-slate-600 transition hover:bg-slate-50"
            >
              <FaTimes size={12} /> Cancel Edit
            </button>
          )}
        </form>

        {/* List Section */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg border border-slate-100 dark:border-gray-700 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-50 dark:border-gray-700">
            <h3 className="font-bold text-slate-800 dark:text-white">Current Partners ({partners.length})</h3>
          </div>
          <div className="divide-y divide-slate-50 dark:divide-gray-700">
            {loadingPartners ? (
              <LoadingSpinner label="Loading partners" />
            ) : partners.map((p, index) => (
              <div key={p.id} className={`flex items-center justify-between border-l-4 p-4 transition hover:bg-slate-50 dark:hover:bg-gray-900/50 ${['border-[#003153]', 'border-[#007BA7]', 'border-[#4169E1]', 'border-[#0096FF]'][index % 4]}`}>
                <div className="flex items-center gap-4">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#003153] text-xs font-black text-white">{p.order || index + 1}</span>
                  <div className="w-16 h-10 bg-slate-100 rounded flex items-center justify-center p-2">
                    <img src={p.imageUrl} alt="" className="max-w-full max-h-full object-contain grayscale" />
                  </div>
                  <span className="font-bold text-slate-700 dark:text-slate-200 text-sm">{p.name}</span>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleEdit(p)}
                    className="text-slate-300 hover:text-blue-500 transition p-2"
                    aria-label={`Edit ${p.name}`}
                  >
                    <FaEdit size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(p.id, p.name)}
                    className="text-slate-300 hover:text-red-500 transition p-2"
                    aria-label={`Delete ${p.name}`}
                  >
                    <FaTrash size={14} />
                  </button>
                </div>
              </div>
            ))}
            {!loadingPartners && partners.length === 0 && (
              <p className="p-6 text-center text-slate-400 text-sm italic">No partners added yet.</p>
            )}
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}

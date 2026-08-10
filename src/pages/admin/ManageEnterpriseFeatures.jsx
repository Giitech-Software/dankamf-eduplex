import React, { useEffect, useRef, useState } from 'react';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { FaEdit, FaImage, FaPlus, FaTimes, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import AdminLayout from '../../components/AdminLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import PageTitle from '../../components/PageTitle';
import { db, storage } from '../../firebase/config';
import { useAuth } from '../../context/AuthContext';
import { logActivity } from '../../utils/activityLog';

const emptyForm = {
  title: '',
  text: '',
  order: '',
  image: null,
};

export default function ManageEnterpriseFeatures() {
  const { user } = useAuth();
  const [features, setFeatures] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [status, setStatus] = useState(null);
  const [editingFeature, setEditingFeature] = useState(null);
  const [expandedFeatureId, setExpandedFeatureId] = useState(null);
  const formRef = useRef(null);

  const fetchFeatures = async () => {
    try {
      const q = query(collection(db, 'enterpriseFeatures'), orderBy('order', 'asc'));
      const snap = await getDocs(q);
      setFeatures(snap.docs.map(item => ({ id: item.id, ...item.data() })));
    } catch (error) {
      console.error('Error loading school capabilities:', error);
      toast.error('Failed to load school capabilities');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeatures();
  }, []);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleChange = (event) => {
    const { name, value, files } = event.target;
    setStatus(null);

    if (name === 'image') {
      const file = files?.[0] || null;
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setForm(prev => ({ ...prev, image: file }));
      setPreviewUrl(file ? URL.createObjectURL(file) : '');
      return;
    }

    setForm(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setForm(emptyForm);
    setPreviewUrl('');
    setEditingFeature(null);
    setFileInputKey(prev => prev + 1);
  };

  const handleEdit = (feature) => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setEditingFeature(feature);
    setPreviewUrl('');
    setStatus(null);
    setForm({
      title: feature.title || '',
      text: feature.text || '',
      order: feature.order || '',
      image: null,
    });
    setFileInputKey(prev => prev + 1);
    requestAnimationFrame(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      formRef.current?.querySelector('input[name="title"]')?.focus();
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus(null);
    setSaving(true);

    try {
      let imageUrl = editingFeature?.imageUrl || '';
      let imagePath = editingFeature?.imagePath || '';

      if (form.image) {
        imagePath = `enterpriseFeatures/${Date.now()}-${form.image.name}`;
        const imageRef = ref(storage, imagePath);
        await uploadBytes(imageRef, form.image);
        imageUrl = await getDownloadURL(imageRef);

        if (editingFeature?.imagePath) {
          await deleteObject(ref(storage, editingFeature.imagePath));
        }
      }

      const payload = {
        title: form.title.trim(),
        text: form.text.trim(),
        order: Number(form.order) || features.length + 1,
        imageUrl,
        imagePath,
      };

      if (editingFeature) {
        await updateDoc(doc(db, 'enterpriseFeatures', editingFeature.id), {
          ...payload,
          updatedAt: serverTimestamp(),
        });
        await logActivity(user, 'edit_enterprise_feature', `Updated enterprise feature: "${form.title}"`);
        toast.success('School capability updated');
        setStatus({ type: 'success', message: 'School capability updated successfully.' });
      } else {
        await addDoc(collection(db, 'enterpriseFeatures'), {
          ...payload,
          createdAt: serverTimestamp(),
        });
        await logActivity(user, 'add_enterprise_feature', `Added enterprise feature: "${form.title}"`);
        toast.success('School capability added');
        setStatus({ type: 'success', message: 'School capability saved successfully.' });
      }

      resetForm();
      fetchFeatures();
    } catch (error) {
      console.error('Error saving enterprise feature:', error);
      setStatus({ type: 'error', message: error.message || 'Failed to save feature.' });
      toast.error(error.message || 'Failed to save school capability');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (feature) => {
    if (!window.confirm(`Remove "${feature.title}" from the homepage school highlights?`)) return;

    try {
      await deleteDoc(doc(db, 'enterpriseFeatures', feature.id));

      if (feature.imagePath) {
        await deleteObject(ref(storage, feature.imagePath));
      }

      await logActivity(user, 'delete_enterprise_feature', `Deleted enterprise feature: "${feature.title}"`);
      toast.success('School capability removed');
      setStatus({ type: 'success', message: 'School capability removed successfully.' });
      setFeatures(prev => prev.filter(item => item.id !== feature.id));
    } catch (error) {
      console.error('Error deleting enterprise feature:', error);
      setStatus({ type: 'error', message: 'Failed to delete feature.' });
      toast.error('Failed to remove school capability');
    }
  };

  return (
    <AdminLayout>
      <PageTitle>School Capabilities &amp; Highlights</PageTitle>

      <div className="grid gap-5 lg:grid-cols-[360px_1fr]">
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="space-y-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900"
        >
          <div>
            <h2 className="flex items-center gap-2 text-base font-black text-slate-900 dark:text-white">
              {editingFeature ? <FaEdit className="text-primary" /> : <FaPlus className="text-primary" />}
              {editingFeature ? 'Edit Homepage Feature Card' : 'Add Homepage Feature Card'}
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              These cards power the homepage “Why Choose Us” section. Use Markdown for bold text, lists, and links.
            </p>
          </div>

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

          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Card title"
            required
            className="w-full rounded border border-slate-300 bg-white p-3 text-sm outline-none focus:ring-2 focus:ring-primary/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />

          <textarea
            name="text"
            value={form.text}
            onChange={handleChange}
            placeholder="Rich supporting text (Markdown supported)"
            required
            className="h-28 w-full resize-none rounded border border-slate-300 bg-white p-3 text-sm outline-none focus:ring-2 focus:ring-primary/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />

          <input
            name="order"
            type="number"
            min="1"
            value={form.order}
            onChange={handleChange}
            placeholder="Display order"
            className="w-full rounded border border-slate-300 bg-white p-3 text-sm outline-none focus:ring-2 focus:ring-primary/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
              Card Image
            </label>
            {previewUrl || editingFeature?.imageUrl ? (
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-gray-700 dark:bg-gray-800">
                <img src={previewUrl || editingFeature.imageUrl} alt="Preview" className="h-28 w-full object-contain" />
              </div>
            ) : (
              <div className="flex h-28 items-center justify-center rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 text-slate-400 dark:border-gray-700 dark:bg-gray-800">
                <FaImage size={28} />
              </div>
            )}
            <input
              key={fileInputKey}
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="w-full rounded border border-slate-300 bg-white p-2 text-sm file:mr-3 file:rounded file:border-0 file:bg-primary file:px-3 file:py-2 file:text-white hover:file:bg-cta dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-lg bg-primary px-5 py-3 text-sm font-black uppercase tracking-widest text-white transition hover:bg-cta disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? 'Saving...' : editingFeature ? 'Update Feature' : 'Save Feature'}
          </button>

          {editingFeature && (
            <button
              type="button"
              onClick={resetForm}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 px-5 py-3 text-sm font-black uppercase tracking-widest text-slate-600 transition hover:bg-slate-50"
            >
              <FaTimes size={12} /> Cancel Edit
            </button>
          )}
        </form>

        <div className="rounded-lg border border-slate-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
          <div className="border-b border-slate-100 p-4 dark:border-gray-700">
            <h2 className="font-black text-slate-900 dark:text-white">
              Current School Highlights ({features.length})
            </h2>
          </div>

          {loading ? (
            <LoadingSpinner label="Loading school highlights" />
          ) : features.length === 0 ? (
            <div className="p-6 text-center text-sm text-slate-400">
              No custom school highlights yet. The public homepage will use the default Dankamf highlights.
            </div>
          ) : (
            <div className="grid gap-4 p-4 md:grid-cols-2 xl:grid-cols-3">
              {features.map(feature => (
                <article
                  key={feature.id}
                  className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-gray-700 dark:bg-gray-800"
                >
                  <div className="mb-3 flex h-24 items-center justify-center rounded-lg bg-white p-3 dark:bg-gray-900">
                    {feature.imageUrl ? (
                      <img src={feature.imageUrl} alt={feature.title} className="h-full w-full object-contain" />
                    ) : (
                      <FaImage className="text-slate-300" size={24} />
                    )}
                  </div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        Order {feature.order || '-'}
                      </p>
                      <h3 className="mt-1 font-bold text-slate-900 dark:text-white">{feature.title}</h3>
                    </div>
                    <div className="flex shrink-0 gap-1">
                      <button
                        type="button"
                        onClick={() => handleEdit(feature)}
                        className="rounded p-2 text-slate-400 transition hover:bg-blue-50 hover:text-blue-600"
                        aria-label={`Edit ${feature.title}`}
                      >
                        <FaEdit size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(feature)}
                        className="rounded p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                        aria-label={`Delete ${feature.title}`}
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                  </div>
                  <p className={`mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300 ${expandedFeatureId === feature.id ? '' : 'line-clamp-2'}`}>
                    {feature.text}
                  </p>
                  <button
                    type="button"
                    onClick={() => setExpandedFeatureId(prev => prev === feature.id ? null : feature.id)}
                    className="mt-2 text-xs font-black uppercase tracking-wider text-primary hover:text-cta"
                  >
                    {expandedFeatureId === feature.id ? 'Hide content' : 'Open content'}
                  </button>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

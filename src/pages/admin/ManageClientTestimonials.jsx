import React, { useEffect, useState } from 'react';
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
  name: '',
  role: '',
  description: '',
  order: '',
  image: null,
};

export default function ManageClientTestimonials() {
  const { user } = useAuth();
  const [testimonials, setTestimonials] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [editingTestimonial, setEditingTestimonial] = useState(null);

  const fetchTestimonials = async () => {
    try {
      const q = query(collection(db, 'clientTestimonials'), orderBy('order', 'asc'));
      const snap = await getDocs(q);
      setTestimonials(snap.docs.map(item => ({ id: item.id, ...item.data() })));
    } catch (error) {
      console.error('Error loading client testimonials:', error);
      toast.error('Failed to load testimonials');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
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
    setEditingTestimonial(null);
    setFileInputKey(prev => prev + 1);
  };

  const handleEdit = (testimonial) => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setEditingTestimonial(testimonial);
    setPreviewUrl('');
    setStatus(null);
    setForm({
      name: testimonial.name || '',
      role: testimonial.role || '',
      description: testimonial.description || '',
      order: testimonial.order || '',
      image: null,
    });
    setFileInputKey(prev => prev + 1);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus(null);
    setSaving(true);

    try {
      let imageUrl = editingTestimonial?.imageUrl || '';
      let imagePath = editingTestimonial?.imagePath || '';

      if (form.image) {
        imagePath = `clientTestimonials/${Date.now()}-${form.image.name}`;
        const imageRef = ref(storage, imagePath);
        await uploadBytes(imageRef, form.image);
        imageUrl = await getDownloadURL(imageRef);

        if (editingTestimonial?.imagePath) {
          await deleteObject(ref(storage, editingTestimonial.imagePath));
        }
      }

      const payload = {
        name: form.name.trim(),
        role: form.role.trim(),
        description: form.description.trim(),
        order: Number(form.order) || testimonials.length + 1,
        imageUrl,
        imagePath,
      };

      if (editingTestimonial) {
        await updateDoc(doc(db, 'clientTestimonials', editingTestimonial.id), {
          ...payload,
          updatedAt: serverTimestamp(),
        });
        await logActivity(user, 'edit_client_testimonial', `Updated client testimonial: "${form.name}"`);
        toast.success('Client testimonial updated');
        setStatus({ type: 'success', message: 'Client testimonial updated successfully.' });
      } else {
        await addDoc(collection(db, 'clientTestimonials'), {
          ...payload,
          createdAt: serverTimestamp(),
        });
        await logActivity(user, 'add_client_testimonial', `Added client testimonial: "${form.name}"`);
        toast.success('Client testimonial added');
        setStatus({ type: 'success', message: 'Client testimonial saved successfully.' });
      }

      resetForm();
      fetchTestimonials();
    } catch (error) {
      console.error('Error saving client testimonial:', error);
      setStatus({ type: 'error', message: error.message || 'Failed to save testimonial.' });
      toast.error(error.message || 'Failed to save testimonial');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (testimonial) => {
    if (!window.confirm(`Delete "${testimonial.name}" from Client Confidence?`)) return;

    try {
      await deleteDoc(doc(db, 'clientTestimonials', testimonial.id));

      if (testimonial.imagePath) {
        await deleteObject(ref(storage, testimonial.imagePath));
      }

      await logActivity(user, 'delete_client_testimonial', `Deleted client testimonial: "${testimonial.name}"`);
      toast.success('Client testimonial deleted');
      setStatus({ type: 'success', message: 'Client testimonial deleted successfully.' });
      setTestimonials(prev => prev.filter(item => item.id !== testimonial.id));
    } catch (error) {
      console.error('Error deleting client testimonial:', error);
      setStatus({ type: 'error', message: 'Failed to delete testimonial.' });
      toast.error('Failed to delete testimonial');
    }
  };

  return (
    <AdminLayout>
      <PageTitle>Client Confidence Testimonials</PageTitle>

      <div className="grid gap-5 lg:grid-cols-[360px_1fr]">
        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900"
        >
          <div>
            <h2 className="flex items-center gap-2 text-base font-black text-slate-900 dark:text-white">
              {editingTestimonial ? <FaEdit className="text-primary" /> : <FaPlus className="text-primary" />}
              {editingTestimonial ? 'Edit Client Testimonial' : 'Add Client Testimonial'}
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              These cards appear under Client Confidence on the homepage.
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
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Client name"
            required
            className="w-full rounded border border-slate-300 bg-white p-3 text-sm outline-none focus:ring-2 focus:ring-primary/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />

          <input
            name="role"
            value={form.role}
            onChange={handleChange}
            placeholder="Role or organization"
            required
            className="w-full rounded border border-slate-300 bg-white p-3 text-sm outline-none focus:ring-2 focus:ring-primary/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Client description or testimonial"
            required
            className="h-32 w-full resize-none rounded border border-slate-300 bg-white p-3 text-sm outline-none focus:ring-2 focus:ring-primary/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
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
              Client Image
            </label>
            {previewUrl || editingTestimonial?.imageUrl ? (
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-gray-700 dark:bg-gray-800">
                <img src={previewUrl || editingTestimonial.imageUrl} alt="Preview" className="h-32 w-full object-cover rounded" />
              </div>
            ) : (
              <div className="flex h-32 items-center justify-center rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 text-slate-400 dark:border-gray-700 dark:bg-gray-800">
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
            {saving ? 'Saving...' : editingTestimonial ? 'Update Testimonial' : 'Save Testimonial'}
          </button>

          {editingTestimonial && (
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
              Current Testimonials ({testimonials.length})
            </h2>
          </div>

          {loading ? (
            <LoadingSpinner label="Loading testimonials" />
          ) : testimonials.length === 0 ? (
            <div className="p-6 text-center text-sm text-slate-400">
              No custom testimonials yet. The public homepage will use the default Dankamf testimonials.
            </div>
          ) : (
            <div className="grid gap-4 p-4 md:grid-cols-2 xl:grid-cols-3">
              {testimonials.map(testimonial => (
                <article
                  key={testimonial.id}
                  className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-gray-700 dark:bg-gray-800"
                >
                  <div className="mb-3 flex h-28 items-center justify-center overflow-hidden rounded-lg bg-white dark:bg-gray-900">
                    {testimonial.imageUrl ? (
                      <img src={testimonial.imageUrl} alt={testimonial.name} className="h-full w-full object-cover" />
                    ) : (
                      <FaImage className="text-slate-300" size={24} />
                    )}
                  </div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        Order {testimonial.order || '-'}
                      </p>
                      <h3 className="mt-1 font-bold text-slate-900 dark:text-white">{testimonial.name}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{testimonial.role}</p>
                    </div>
                    <div className="flex shrink-0 gap-1">
                      <button
                        type="button"
                        onClick={() => handleEdit(testimonial)}
                        className="rounded p-2 text-slate-400 transition hover:bg-blue-50 hover:text-blue-600"
                        aria-label={`Edit ${testimonial.name}`}
                      >
                        <FaEdit size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(testimonial)}
                        className="rounded p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                        aria-label={`Delete ${testimonial.name}`}
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    {testimonial.description}
                  </p>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../firebase/config';
import { useAuth } from '../../context/AuthContext';
import { logActivity } from '../../utils/activityLog';
import AdminLayout from '../../components/AdminLayout';
import PageTitle from '../../components/PageTitle';

export default function AddService() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    title: '',
    order: '',
    description: '',
    curriculum: '',
    assessment: '',
    timetable: '',
    iconImage: null,
  });

  const [msg, setMsg] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'iconImage') {
      setForm({ ...form, iconImage: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    setUploading(true);

    try {
      let iconUrl = '';
      if (form.iconImage) {
        const imgRef = ref(storage, `serviceIcons/${Date.now()}-${form.iconImage.name}`);
        const snap = await uploadBytes(imgRef, form.iconImage);
        iconUrl = await getDownloadURL(snap.ref);
      }

      await addDoc(collection(db, 'services'), {
        title: form.title,
        order: Number(form.order) || 9999,
        description: form.description,
        curriculum: form.curriculum,
        assessment: form.assessment,
        timetable: form.timetable,
        iconUrl,
        createdAt: serverTimestamp(),
      });

      await logActivity(user, 'add_service', `Added service: "${form.title}"`);

      setMsg('✅ Service added successfully!');
      setForm({ title: '', order: '', description: '', curriculum: '', assessment: '', timetable: '', iconImage: null });
    } catch (err) {
      setMsg('❌ ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <AdminLayout>
      <PageTitle>➕ Add Academic Programme</PageTitle>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Service Title"
          required
          className="w-full p-3 border rounded bg-white dark:bg-gray-900 dark:border-gray-700 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
        />

        <label className="block text-sm font-bold text-slate-700 dark:text-slate-200">Homepage display number<input type="number" min="1" name="order" placeholder="e.g. 1" value={form.order} onChange={handleChange} className="mt-1 w-full rounded-lg border p-3 dark:border-gray-700 dark:bg-gray-900 dark:text-white" /><span className="mt-1 block text-xs font-normal text-slate-500">Lower numbers appear first in Our Academics.</span></label>

        <textarea name="curriculum" value={form.curriculum} onChange={handleChange} placeholder="Curriculum details (Markdown supported)" className="w-full h-32 p-3 border rounded bg-white dark:bg-gray-900 dark:border-gray-700 dark:text-white placeholder-gray-500 dark:placeholder-gray-400" />
        <textarea name="assessment" value={form.assessment} onChange={handleChange} placeholder="Assessment approach (Markdown supported)" className="w-full h-32 p-3 border rounded bg-white dark:bg-gray-900 dark:border-gray-700 dark:text-white placeholder-gray-500 dark:placeholder-gray-400" />
        <textarea name="timetable" value={form.timetable} onChange={handleChange} placeholder="Timetable and academic calendar (Markdown supported)" className="w-full h-32 p-3 border rounded bg-white dark:bg-gray-900 dark:border-gray-700 dark:text-white placeholder-gray-500 dark:placeholder-gray-400" />

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Service Description (Markdown supported)"
          required
          className="w-full p-3 border rounded h-40 bg-white dark:bg-gray-900 dark:border-gray-700 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
        />

        <input
          type="file"
          name="iconImage"
          accept="image/*"
          onChange={handleChange}
          className="w-full p-3 border rounded bg-white dark:bg-gray-900 dark:border-gray-700 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-primary file:text-white hover:file:bg-cta transition"
        />

        <button
          type="submit"
          disabled={uploading}
          className="bg-primary text-white px-6 py-3 rounded hover:bg-cta transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? 'Publishing…' : 'Add Programme'}
        </button>

        {msg && <p className="text-sm text-gray-700 dark:text-gray-300">{msg}</p>}
      </form>
    </AdminLayout>
  );
}

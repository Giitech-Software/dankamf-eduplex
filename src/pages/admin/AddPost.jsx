import React, { useState, useEffect } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../firebase/config';
import { useAuth } from '../../context/AuthContext';
import { logActivity } from '../../utils/activityLog';
import AdminLayout from '../../components/AdminLayout';
import PageTitle from '../../components/PageTitle';
import { FaTrash, FaImage } from 'react-icons/fa';
import { requireRecentAdminAuth } from '../../firebase/security';

export default function AddPost() {
  const { user } = useAuth();
  const [form, setForm] = useState({ title: '', content: '', order: '', image: null });
  const [previewUrl, setPreviewUrl] = useState(null); // Local preview state
  const [msg, setMsg] = useState('');
  const [uploading, setUploading] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');

  // Handle local preview cleanup to prevent memory leaks
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      const file = files[0];
      if (file) {
        setForm({ ...form, image: file });
        setPreviewUrl(URL.createObjectURL(file));
      }
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const removeImage = () => {
    setForm({ ...form, image: null });
    setPreviewUrl(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    setUploading(true);

    try {
      await requireRecentAdminAuth(confirmPassword);
      let imageUrl = '';
      if (form.image) {
        const imgRef = ref(storage, `blogImages/${Date.now()}-${form.image.name}`);
        const snap = await uploadBytes(imgRef, form.image);
        imageUrl = await getDownloadURL(snap.ref);
      }

      await addDoc(collection(db, 'posts'), {
        title: form.title,
        content: form.content,
        order: Number(form.order) || 9999,
        imageUrl,
        image: imageUrl,
        timestamp: serverTimestamp(),
      });

      await logActivity(user, 'add_post', `Added post: "${form.title}"`);

      setMsg('✅ Post published successfully!');
      setForm({ title: '', content: '', order: '', image: null });
      setPreviewUrl(null);
      setConfirmPassword('');
    } catch (err) {
      setMsg('❌ Error: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <AdminLayout>
      <PageTitle>📝 Publish New Post</PageTitle>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl bg-white dark:bg-gray-800 p-5 sm:p-6 rounded-lg shadow-sm border border-slate-100 dark:border-gray-700">
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Title</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Enter the news article title..."
            required
            className="w-full p-3 border rounded-lg bg-white dark:bg-gray-900 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-primary outline-none transition"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Homepage display order</label>
          <input name="order" type="number" min="1" value={form.order} onChange={handleChange} placeholder="1 appears first" className="w-full p-3 border rounded-lg bg-white dark:bg-gray-900 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-primary outline-none transition" />
          <p className="text-xs text-slate-500 dark:text-slate-400">Use a smaller number for News &amp; Events items you want to appear first.</p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Content</label>
          <textarea
            name="content"
            value={form.content}
            onChange={handleChange}
            placeholder="Write the news article content (Markdown supported)..."
            required
            className="w-full p-3 border rounded-lg h-56 bg-white dark:bg-gray-900 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-primary outline-none transition resize-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Featured Image</label>
          
          {previewUrl ? (
            <div className="relative group rounded-xl overflow-hidden border-2 border-primary/20 bg-slate-50 dark:bg-gray-900">
              <img 
                src={previewUrl} 
                alt="Preview" 
                className="w-full h-52 object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  type="button"
                  onClick={removeImage}
                  className="bg-red-500 text-white p-3 rounded-full hover:bg-red-600 transition shadow-xl"
                  title="Remove Image"
                >
                  <FaTrash size={20} />
                </button>
              </div>
            </div>
          ) : (
            <div className="relative border-2 border-dashed border-slate-200 dark:border-gray-700 rounded-lg p-6 transition hover:border-primary group">
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="text-center space-y-2">
                <div className="flex justify-center text-slate-400 group-hover:text-primary transition">
                  <FaImage size={40} />
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                  Click or drag to upload a high-resolution banner
                </p>
              </div>
            </div>
          )}
        </div>

        <label className="block space-y-2 text-sm font-bold text-slate-700 dark:text-slate-200">
          <span>Confirm password to publish</span>
          <input type="password" required value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} autoComplete="current-password" className="w-full rounded-lg border border-slate-300 bg-white p-3 text-slate-900 dark:border-gray-700 dark:bg-gray-900 dark:text-white" />
        </label>

        <div className="pt-2">
          <button
            disabled={uploading}
            className="w-full md:w-auto bg-slate-900 text-white px-8 py-3 rounded-lg font-black text-sm uppercase tracking-widest hover:bg-warm transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? 'Processing Publication...' : 'Publish Article'}
          </button>
        </div>

        {msg && (
          <div className={`p-4 rounded-lg text-sm font-medium ${msg.includes('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {msg}
          </div>
        )}
      </form>
    </AdminLayout>
  );
}

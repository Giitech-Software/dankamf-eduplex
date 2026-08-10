// src/pages/admin/AddProject.jsx
import React, { useState, useEffect } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../firebase/config';
import AdminLayout from '../../components/AdminLayout';
import PageTitle from '../../components/PageTitle';

export default function AddProject() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'Clubs',
    image: null,
  });
  const [preview, setPreview] = useState(null); // Step 1: Add Preview State
  const [msg, setMsg] = useState('');
  const [uploading, setUploading] = useState(false);

  // Clean up the object URL to avoid memory leaks
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      const file = files[0];
      if (file) {
        setForm({ ...form, image: file });
        setPreview(URL.createObjectURL(file)); // Create temporary local URL
      }
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    setUploading(true);
    if (form.image && form.image.size > 180 * 1024) {
      setMsg('Gallery images must be 180 KB or smaller. Recommended range: 120–180 KB.');
      setUploading(false);
      return;
    }

    if (!form.image) {
      setMsg('❌ Please choose an image file');
      setUploading(false);
      return;
    }

    try {
      // Step 2: Unique File Naming (Clean Strategy)
      const fileExtension = form.image.name.split('.').pop();
      const cleanTitle = form.title.toLowerCase().replace(/\s+/g, '-');
      const fileName = `projects/${cleanTitle}-${Date.now()}.${fileExtension}`;
      const imageRef = ref(storage, fileName);

      const snapshot = await uploadBytes(imageRef, form.image);
      const imageUrl = await getDownloadURL(snapshot.ref);

      // Step 3: Save Reference to Firestore
      await addDoc(collection(db, 'projects'), {
        title: form.title,
        description: form.description,
        category: form.category,
        imageUrl,
        timestamp: serverTimestamp(),
      });

      setMsg('✅ Project added successfully!');
      setForm({ title: '', description: '', category: 'Clubs', image: null });
      setPreview(null);
    } catch (err) {
      setMsg('❌ Failed: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <AdminLayout>
      <>
        <PageTitle>➕ Add Campus Activity</PageTitle>
        <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
          {/* Title Input */}
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Project Title"
            required
            className="w-full p-3 border rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-warm outline-none"
          />

          {/* Description Input */}
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Project Description (Markdown supported)"
            required
            className="w-full p-3 border rounded h-48 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-warm outline-none"
          />

          <label className="block text-sm font-bold text-gray-700 dark:text-gray-200">Student Life Category
            <select name="category" value={form.category} onChange={handleChange} className="mt-2 w-full rounded border border-gray-300 bg-white p-3 text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white">
              <option>Clubs</option><option>Sports</option><option>STEM</option><option>Arts</option><option>Leadership</option>
            </select>
          </label>

          {/* Modern Image Upload Zone */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider">Featured Image</label>
            
            {/* Step 4: Conditional Image Preview Rendering */}
            {preview && (
              <div className="mb-4 relative h-48 w-full rounded-xl overflow-hidden border-2 border-warm shadow-lg animate-in fade-in duration-300">
                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                   <p className="text-white font-bold text-xs uppercase tracking-widest">Click below to change</p>
                </div>
              </div>
            )}

            <div className="relative group">
              <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-xl hover:border-warm dark:hover:border-warm transition-colors cursor-pointer bg-white dark:bg-gray-800">
                <div className="space-y-1 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div className="flex text-sm text-gray-600 dark:text-gray-400">
                    <span className="relative font-medium text-warm hover:text-warm-terracotta">
                      {form.image ? 'Replace selected file' : 'Select project image'}
                    </span>
                    <input 
                      name="image" 
                      type="file" 
                      accept="image/*" 
                      onChange={handleChange} 
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                    />
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  {form.image && (
                    <p className="text-sm text-warm font-bold mt-2 animate-pulse italic">
                      Ready for upload: {form.image.name}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full md:w-auto bg-primary text-white px-10 py-3 rounded-lg font-bold hover:bg-warm transition-all disabled:opacity-60 shadow-lg"
            disabled={uploading}
          >
            {uploading ? 'Deploying to Cloud Storage...' : 'Publish Project'}
          </button>

          {msg && (
            <div className={`mt-4 p-3 rounded text-sm font-medium ${msg.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {msg}
            </div>
          )}
        </form>
      </>
    </AdminLayout>
  );
}

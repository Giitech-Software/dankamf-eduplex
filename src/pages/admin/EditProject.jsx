import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../firebase/config';
import { useAuth } from '../../context/AuthContext';
import AdminLayout from '../../components/AdminLayout';
import PageTitle from '../../components/PageTitle';
import { toast } from 'react-toastify';
import { logActivity } from '../../utils/activityLog';

export default function EditProject() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  // Project-specific states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [link, setLink] = useState('');
  const [image, setImage] = useState(null);
  const [currentImage, setCurrentImage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const snap = await getDoc(doc(db, 'projects', id));
        if (snap.exists()) {
          const data = snap.data();
          setTitle(data.title || '');
          setDescription(data.description || '');
          setCategory(data.category || '');
          setLink(data.link || '');
          setCurrentImage(data.imageUrl || ''); // Note: matches your display logic 'imageUrl'
        } else {
          toast.error('Project not found');
          navigate('/admin/manage-projects');
        }
      } catch (err) {
        console.error(err);
        toast.error('Failed to load project details');
      }
    };
    fetchProject();
  }, [id, navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    // Strict Guard to prevent creating "Ghost Cards"
    if (!title.trim() || !description.trim()) {
      toast.warn('Title and Description are required!');
      return;
    }

    setLoading(true);

    try {
      let finalImageUrl = currentImage;

      // Only upload if a new file was selected
      if (image) {
        if (image.size > 180 * 1024) {
          toast.error('Gallery images must be 180 KB or smaller. Recommended range: 120–180 KB.');
          setLoading(false);
          return;
        }
        const imageRef = ref(storage, `projects/${Date.now()}-${image.name}`);
        await uploadBytes(imageRef, image);
        finalImageUrl = await getDownloadURL(imageRef);
      }

      await updateDoc(doc(db, 'projects', id), {
        title: title.trim(),
        description: description.trim(),
        category: category.trim(),
        link: link.trim(),
        imageUrl: finalImageUrl,
        updatedAt: serverTimestamp(),
      });

      await logActivity(currentUser, `Updated project: ${title}`);

      toast.success('Project updated successfully');
      navigate('/admin/manage-projects');
    } catch (err) {
      console.error(err);
      toast.error('Failed to update project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <PageTitle>💼 Edit Portfolio Project</PageTitle>
      
      <form
        onSubmit={handleUpdate}
        className="space-y-4 bg-white dark:bg-gray-900 p-5 sm:p-6 rounded-lg shadow-lg max-w-4xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Title */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Project Title</label>
            <input
              type="text"
              placeholder="e.g., M'Salem Library System"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              required
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Category</label>
            <input
              type="text"
              placeholder="e.g., Desktop Application"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-3 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
          </div>
        </div>

        {/* Project Link */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300">External Project Link (Optional)</label>
          <input
            type="url"
            placeholder="https://github.com/your-repo"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className="w-full p-3 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Project Description (Markdown)</label>
          <textarea
            placeholder="Describe the challenges, tech stack, and results..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="10"
            className="w-full p-3 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white font-mono text-sm"
            required
          />
        </div>

        {/* Image Preview & Upload */}
        <div className="space-y-3">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Project Cover Image</label>
          <div className="flex items-center gap-4">
            {currentImage && (
              <div className="relative group">
                <img
                  src={currentImage}
                  alt="Current"
                  className="h-32 w-48 object-cover rounded-lg border-2 border-slate-200"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                  <span className="text-white text-xs font-bold">Current Image</span>
                </div>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-bold shadow-md transition-all disabled:opacity-50"
          >
            {loading ? 'Saving Changes...' : 'Update Project'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/manage-projects')}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-8 py-3 rounded-lg font-bold transition-all"
          >
            Cancel
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}

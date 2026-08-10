// src/pages/admin/EditPost.jsx
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

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [currentImage, setCurrentImage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const snap = await getDoc(doc(db, 'posts', id));
        if (snap.exists()) {
          const data = snap.data();
          setTitle(data.title || '');
          setContent(data.content || '');
          setCurrentImage(data.image || '');
        } else {
          toast.error('Post not found');
          navigate('/admin/manage-posts');
        }
      } catch (err) {
        console.error(err);
        toast.error('Failed to load post');
      }
    })();
  }, [id, navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = currentImage;

      if (image) {
        const imageRef = ref(storage, `posts/${Date.now()}-${image.name}`);
        await uploadBytes(imageRef, image);
        imageUrl = await getDownloadURL(imageRef);
      }

      await updateDoc(doc(db, 'posts', id), {
        title,
        content,
        image: imageUrl,
        updatedAt: serverTimestamp(),
      });

      await logActivity(currentUser, `Updated post: ${title}`);

      toast.success('Post updated successfully');
      navigate('/admin/manage-posts');
    } catch (err) {
      console.error(err);
      toast.error('Failed to update post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <PageTitle>✏️ Edit News Article</PageTitle>
      <form
        onSubmit={handleUpdate}
        className="space-y-4 bg-white dark:bg-gray-900 p-6 rounded shadow"
      >
        <input
          type="text"
          placeholder="Post Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          required
        />

        <textarea
          placeholder="Post Content (Markdown Supported)"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows="8"
          className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          required
        />

        {currentImage && (
          <img
            src={currentImage}
            alt="Current"
            className="h-32 object-cover rounded"
          />
        )}

        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
          className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700 dark:text-white"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? 'Updating...' : 'Update Post'}
        </button>
      </form>
    </AdminLayout>
  );
}

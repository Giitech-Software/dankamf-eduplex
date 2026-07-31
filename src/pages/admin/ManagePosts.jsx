// src/pages/admin/ManagePosts.jsx
import React, { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { logActivity } from '../../utils/activityLog';
import AdminLayout from '../../components/AdminLayout';
import PageTitle from '../../components/PageTitle';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function ManagePosts() {
  const [posts, setPosts] = useState([]);
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const snap = await getDocs(collection(db, 'posts'));
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setPosts(data);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setMsg('Failed to load posts.');
        setTimeout(() => setMsg(''), 3000);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const handleDelete = async (postId, title) => {
    const confirm = window.confirm(`Delete post "${title}"?`);
    if (!confirm) return;

    try {
      await deleteDoc(doc(db, 'posts', postId));
      setPosts(prev => prev.filter(p => p.id !== postId));
      await logActivity(user, 'delete_post', `Deleted post: "${title}"`);
      setMsg(`Post "${title}" deleted.`);
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      console.error('Delete error:', err);
      setMsg('Failed to delete post.');
      setTimeout(() => setMsg(''), 3000);
    }
  };

  return (
    <AdminLayout>
      <PageTitle>📰 Manage News &amp; Events</PageTitle>

      <div className="p-6">
        {msg && (
          <div className="mb-4 p-3 rounded bg-green-600 text-white">{msg}</div>
        )}

        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
          {loading ? (
            <LoadingSpinner label="Loading posts" />
          ) : (
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {posts.length === 0 ? (
                <tr>
                  <td colSpan="3" className="px-6 py-4 text-center text-gray-500 dark:text-gray-300">
                    No posts available
                  </td>
                </tr>
              ) : (
                posts.map((p) => (
                  <tr key={p.id}>
                    <td className="px-6 py-4 text-gray-900 dark:text-white">{p.title}</td>
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                      {p.timestamp?.toDate ? p.timestamp.toDate().toLocaleDateString() : (p.date || '—')}
                    </td>
                    <td className="px-6 py-4 text-center space-x-3">
                      <Link
                        to={`/admin/edit-post/${p.id}`}
                        className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        <FaEdit className="mr-2" /> Edit
                      </Link>

                      <button
                        onClick={() => handleDelete(p.id, p.title)}
                        className="inline-flex items-center text-red-600 dark:text-red-400 hover:underline ml-4"
                      >
                        <FaTrash className="mr-2" /> Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

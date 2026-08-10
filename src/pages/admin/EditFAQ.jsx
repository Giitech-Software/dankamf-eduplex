import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useAuth } from '../../context/AuthContext';
import { logActivity } from '../../utils/activityLog';
import AdminLayout from '../../components/AdminLayout';
import PageTitle from '../../components/PageTitle';

export default function EditFAQ() {
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  const [faq, setFaq] = useState({ question: '', answer: '', icon: '', order: '' });
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFAQ = async () => {
      const ref = doc(db, 'faqs', id);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setFaq(snap.data());
      }
    };
    fetchFAQ();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMsg('');
    setLoading(true);
    try {
      // Keep the original timestamp so editing an FAQ does not change its
      // public position or distort the numbered presentation.
      await updateDoc(doc(db, 'faqs', id), { ...faq });

      await logActivity(user, 'update_faq', `Updated FAQ: ${faq.question}`);
      setMsg('✅ FAQ updated successfully!');
    } catch (err) {
      setMsg('❌ ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete this FAQ?');
    if (!confirmDelete) return;

    setMsg('');
    setLoading(true);
    try {
      await deleteDoc(doc(db, 'faqs', id));
      await logActivity(user, 'delete_faq', `Deleted FAQ: ${faq.question}`);
      setMsg('🗑️ FAQ deleted successfully!');
      navigate('/admin/manage-faqs');
    } catch (err) {
      setMsg('❌ ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <PageTitle>✏️ Edit FAQ</PageTitle>

      <form onSubmit={handleUpdate} className="space-y-4 max-w-xl">
        <input
          type="text"
          name="question"
          value={faq.question}
          onChange={(e) => setFaq({ ...faq, question: e.target.value })}
          placeholder="Question"
          required
          className="w-full p-3 border rounded bg-white dark:bg-gray-900 dark:border-gray-700 dark:text-white"
        />
        <label className="block text-sm font-bold text-slate-700 dark:text-slate-200">Homepage display number<input type="number" min="1" value={faq.order || ''} onChange={(e) => setFaq({ ...faq, order: Number(e.target.value) || '' })} className="mt-1 w-full rounded-lg border p-3 dark:border-gray-700 dark:bg-gray-900 dark:text-white" /><span className="mt-1 block text-xs font-normal text-slate-500">Lower numbers appear first.</span></label>
        <textarea
          name="answer"
          value={faq.answer}
          onChange={(e) => setFaq({ ...faq, answer: e.target.value })}
          placeholder="Answer"
          required
          className="w-full p-3 border rounded h-32 bg-white dark:bg-gray-900 dark:border-gray-700 dark:text-white"
        />
        <input
          type="text"
          name="icon"
          value={faq.icon}
          onChange={(e) => setFaq({ ...faq, icon: e.target.value })}
          placeholder="Icon (emoji or code)"
          className="w-full p-3 border rounded bg-white dark:bg-gray-900 dark:border-gray-700 dark:text-white"
        />

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Update FAQ'}
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Delete
          </button>
        </div>

        {msg && <p className="text-sm text-gray-700 dark:text-gray-300">{msg}</p>}
      </form>
    </AdminLayout>
  );
}

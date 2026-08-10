import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useAuth } from '../../context/AuthContext';
import { logActivity } from '../../utils/activityLog';
import AdminLayout from '../../components/AdminLayout';
import PageTitle from '../../components/PageTitle';

export default function AddFAQ() {
  const { user } = useAuth();

  const [form, setForm] = useState({
    question: '',
    answer: '',
    icon: '',
    order: '',
  });

  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    setLoading(true);

    try {
      await addDoc(collection(db, 'faqs'), {
        ...form,
        order: Number(form.order) || 9999,
        timestamp: serverTimestamp(),
      });

      await logActivity(user, 'add_faq', `Question: ${form.question}`);
      setMsg('✅ FAQ added successfully!');
      setForm({ question: '', answer: '', icon: '', order: '' });
    } catch (err) {
      setMsg('❌ ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <PageTitle>➕ Add FAQ</PageTitle>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
        <input
          type="text"
          name="question"
          placeholder="Question"
          value={form.question}
          onChange={handleChange}
          required
          className="w-full p-3 border rounded bg-white dark:bg-gray-900 dark:border-gray-700 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
        />

        <label className="block text-sm font-bold text-slate-700 dark:text-slate-200">Homepage display number<input type="number" min="1" name="order" placeholder="e.g. 1" value={form.order} onChange={handleChange} className="mt-1 w-full rounded-lg border p-3 dark:border-gray-700 dark:bg-gray-900 dark:text-white" /><span className="mt-1 block text-xs font-normal text-slate-500">Lower numbers appear first.</span></label>

        <textarea
          name="answer"
          placeholder="Answer (Markdown supported)"
          value={form.answer}
          onChange={handleChange}
          required
          rows={6}
          className="w-full p-3 border rounded bg-white dark:bg-gray-900 dark:border-gray-700 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
        />
        <p className="text-sm text-gray-600 dark:text-gray-400 -mt-2">
          You can use <strong>Markdown</strong> formatting here (e.g., `**bold**`, `- list`, `# heading`).
        </p>

        <input
          type="text"
          name="icon"
          placeholder="Icon (emoji or code)"
          value={form.icon}
          onChange={handleChange}
          className="w-full p-3 border rounded bg-white dark:bg-gray-900 dark:border-gray-700 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? 'Adding…' : 'Add FAQ'}
        </button>

        {msg && <p className="text-sm text-gray-700 dark:text-gray-300">{msg}</p>}
      </form>
    </AdminLayout>
  );
}

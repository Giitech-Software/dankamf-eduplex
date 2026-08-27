import React, { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import { requireRecentAdminAuth } from '../../firebase/security';

export default function EditJob() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    location: '',
    type: 'Full-time',
    description: '',
    requirements: '',
    status: 'open',
  });
  const [msg, setMsg] = useState('');

  useEffect(() => {
    const fetch = async () => {
      const snap = await getDoc(doc(db, 'jobs', id));
      if (snap.exists()) setForm(snap.data());
    };
    fetch();
  }, [id]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      await requireRecentAdminAuth(window.prompt('Enter your administrator password to confirm this update:'));
      await updateDoc(doc(db, 'jobs', id), form);
      setMsg('✅ Job updated!');
      setTimeout(() => navigate('/admin/jobs'), 800);
    } catch (err) {
      setMsg('❌ ' + err.message);
    }
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold text-primary dark:text-accent mb-6">✏️ Edit Job</h1>

      {msg && <p className="mb-4 text-sm text-gray-700 dark:text-gray-300">{msg}</p>}

      <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Job Title"
          required
          className="w-full p-3 border rounded bg-white dark:bg-gray-900 dark:border-gray-700 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
        />
        <input
          name="location"
          value={form.location}
          onChange={handleChange}
          placeholder="Location"
          required
          className="w-full p-3 border rounded bg-white dark:bg-gray-900 dark:border-gray-700 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
        />
        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          className="w-full p-3 border rounded bg-white dark:bg-gray-900 dark:border-gray-700 dark:text-white"
        >
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
          <option value="Contract">Contract</option>
        </select>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Job Description"
          required
          className="w-full p-3 border rounded h-24 bg-white dark:bg-gray-900 dark:border-gray-700 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
        />
        <textarea
          name="requirements"
          value={form.requirements}
          onChange={handleChange}
          placeholder="Requirements"
          required
          className="w-full p-3 border rounded h-24 bg-white dark:bg-gray-900 dark:border-gray-700 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
        />
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="w-full p-3 border rounded bg-white dark:bg-gray-900 dark:border-gray-700 dark:text-white"
        >
          <option value="open">Open</option>
          <option value="closed">Closed</option>
        </select>
        <button className="bg-primary text-white px-6 py-3 rounded hover:bg-cta transition">
          Update Job
        </button>
      </form>
    </AdminLayout>
  );
}

import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase/config';
import AdminLayout from '../../components/AdminLayout';
import { useNavigate } from 'react-router-dom';
import PageTitle from '../../components/PageTitle';
import { requireRecentAdminAuth } from '../../firebase/security';

export default function AddJob() {
  const [form, setForm] = useState({
    title: '',
    location: '',
    type: 'Full-time',
    description: '',
    requirements: '',
    status: 'open',
  });
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      await requireRecentAdminAuth(window.prompt('Enter your administrator password to confirm publishing:'));
      await addDoc(collection(db, 'jobs'), {
        ...form,
        postedAt: serverTimestamp(),
      });
      setMsg('✅ Job posted!');
      navigate('/admin/jobs');
    } catch (err) {
      setMsg('❌ ' + err.message);
    }
  };

  return (
    <AdminLayout>
      <>
        <PageTitle>💼 Manage Jobs</PageTitle>
      </>
      {msg && (
        <p className="mb-4 text-sm text-gray-700 dark:text-gray-300">{msg}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Job Title"
          required
          className="w-full p-3 border rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
        />
        <input
          name="location"
          value={form.location}
          onChange={handleChange}
          placeholder="Location"
          required
          className="w-full p-3 border rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
        />
        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          className="w-full p-3 border rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
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
          className="w-full p-3 border rounded h-24 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
        />
        <textarea
          name="requirements"
          value={form.requirements}
          onChange={handleChange}
          placeholder="Requirements"
          required
          className="w-full p-3 border rounded h-24 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
        />
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="w-full p-3 border rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
        >
          <option value="open">Open</option>
          <option value="closed">Closed</option>
        </select>
        <button className="bg-primary text-white px-6 py-3 rounded hover:bg-cta transition">
          Post Job
        </button>
      </form>
    </AdminLayout>
  );
}

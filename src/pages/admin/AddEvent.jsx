import React, { useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useAuth } from '../../context/AuthContext';
import { logActivity } from '../../utils/activityLog';
import AdminLayout from '../../components/AdminLayout';
import PageTitle from '../../components/PageTitle';

const initialForm = {
  title: '',
  date: '',
  time: '',
  location: '',
  category: 'School Event',
  description: '',
  imageUrl: '',
  registrationUrl: '',
  published: true,
};

export default function AddEvent() {
  const { user } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setStatus('');

    try {
      await addDoc(collection(db, 'events'), {
        ...form,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      await logActivity(user, 'add_event', `Added event: "${form.title}"`);
      setForm(initialForm);
      setStatus('Event published successfully.');
    } catch (error) {
      console.error('Error adding event:', error);
      setStatus('Unable to save this event. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <PageTitle>Manage Events</PageTitle>
      <form onSubmit={handleSubmit} className="max-w-3xl space-y-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="space-y-2 sm:col-span-2">
            <span className="text-sm font-bold text-slate-700">Event title</span>
            <input name="title" value={form.title} onChange={handleChange} required className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:ring-2 focus:ring-primary" />
          </label>
          <label className="space-y-2 sm:col-span-2">
            <span className="text-sm font-bold text-slate-700">Registration URL (optional)</span>
            <input type="url" name="registrationUrl" value={form.registrationUrl} onChange={handleChange} placeholder="https://..." className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:ring-2 focus:ring-primary" />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-bold text-slate-700">Date</span>
            <input type="date" name="date" value={form.date} onChange={handleChange} required className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:ring-2 focus:ring-primary" />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-bold text-slate-700">Time</span>
            <input type="time" name="time" value={form.time} onChange={handleChange} className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:ring-2 focus:ring-primary" />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-bold text-slate-700">Location</span>
            <input name="location" value={form.location} onChange={handleChange} required className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:ring-2 focus:ring-primary" />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-bold text-slate-700">Category</span>
            <select name="category" value={form.category} onChange={handleChange} className="w-full rounded-lg border border-slate-300 bg-white p-3 outline-none focus:ring-2 focus:ring-primary">
              <option>School Event</option><option>Academic</option><option>Sports</option><option>Admissions</option><option>Community</option>
            </select>
          </label>
          <label className="space-y-2 sm:col-span-2">
            <span className="text-sm font-bold text-slate-700">Image URL (optional)</span>
            <input type="url" name="imageUrl" value={form.imageUrl} onChange={handleChange} placeholder="https://..." className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:ring-2 focus:ring-primary" />
          </label>
          <label className="space-y-2 sm:col-span-2">
            <span className="text-sm font-bold text-slate-700">Description</span>
            <textarea name="description" value={form.description} onChange={handleChange} required rows="5" className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:ring-2 focus:ring-primary" />
          </label>
        </div>
        <label className="flex items-center gap-3 text-sm font-semibold text-slate-700">
          <input type="checkbox" name="published" checked={form.published} onChange={handleChange} className="h-4 w-4 accent-primary" />
          Publish on the public website
        </label>
        <div className="flex flex-wrap gap-3">
          <button disabled={saving} className="rounded-full bg-primary px-6 py-3 text-sm font-bold text-white transition hover:bg-primary-dark disabled:opacity-60">
          {saving ? 'Saving event…' : 'Save Event'}
          </button>
          <a href="/admin/manage-events" className="rounded-full border border-slate-300 px-6 py-3 text-sm font-bold text-darkgray hover:bg-slate-50">View Events</a>
        </div>
        {status && <p role="status" className="text-sm font-semibold text-primary">{status}</p>}
      </form>
    </AdminLayout>
  );
}

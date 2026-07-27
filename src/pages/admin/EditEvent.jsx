import React, { useEffect, useState } from 'react';
import { doc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { useNavigate, useParams } from 'react-router-dom';
import { db } from '../../firebase/config';
import { useAuth } from '../../context/AuthContext';
import { logActivity } from '../../utils/activityLog';
import AdminLayout from '../../components/AdminLayout';
import PageTitle from '../../components/PageTitle';
import LoadingSpinner from '../../components/LoadingSpinner';

const fields = ['title', 'date', 'time', 'location', 'category', 'imageUrl', 'registrationUrl', 'description'];

export default function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [form, setForm] = useState({ title: '', date: '', time: '', location: '', category: 'School Event', imageUrl: '', registrationUrl: '', description: '', published: true });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    getDoc(doc(db, 'events', id)).then((snapshot) => {
      if (snapshot.exists()) setForm((current) => ({ ...current, ...snapshot.data() }));
      else setMessage('Event not found.');
    }).catch(() => setMessage('Unable to load event.')).finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault(); setSaving(true); setMessage('');
    try {
      const updates = Object.fromEntries(fields.map((field) => [field, form[field]]));
      await updateDoc(doc(db, 'events', id), { ...updates, published: form.published, updatedAt: serverTimestamp() });
      await logActivity(user, 'edit_event', `Updated event: "${form.title}"`);
      navigate('/admin/manage-events');
    } catch (error) { console.error(error); setMessage('Unable to save event.'); } finally { setSaving(false); }
  };

  if (loading) return <AdminLayout><LoadingSpinner label="Loading event" /></AdminLayout>;

  return <AdminLayout><PageTitle>Edit Event</PageTitle><form onSubmit={handleSubmit} className="max-w-3xl space-y-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
    <div className="grid gap-5 sm:grid-cols-2">
      <label className="space-y-2 sm:col-span-2"><span className="text-sm font-bold text-slate-700">Event title</span><input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full rounded-lg border border-slate-300 p-3 focus:ring-2 focus:ring-primary" /></label>
      <label className="space-y-2"><span className="text-sm font-bold text-slate-700">Date</span><input required type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full rounded-lg border border-slate-300 p-3 focus:ring-2 focus:ring-primary" /></label>
      <label className="space-y-2"><span className="text-sm font-bold text-slate-700">Time</span><input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} className="w-full rounded-lg border border-slate-300 p-3 focus:ring-2 focus:ring-primary" /></label>
      <label className="space-y-2"><span className="text-sm font-bold text-slate-700">Location</span><input required value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="w-full rounded-lg border border-slate-300 p-3 focus:ring-2 focus:ring-primary" /></label>
      <label className="space-y-2"><span className="text-sm font-bold text-slate-700">Category</span><select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full rounded-lg border border-slate-300 bg-white p-3 focus:ring-2 focus:ring-primary"><option>School Event</option><option>Academic</option><option>Sports</option><option>Admissions</option><option>Community</option></select></label>
      <label className="space-y-2 sm:col-span-2"><span className="text-sm font-bold text-slate-700">Image URL</span><input type="url" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} className="w-full rounded-lg border border-slate-300 p-3 focus:ring-2 focus:ring-primary" /></label>
      <label className="space-y-2 sm:col-span-2"><span className="text-sm font-bold text-slate-700">Registration URL</span><input type="url" value={form.registrationUrl} onChange={(e) => setForm({ ...form, registrationUrl: e.target.value })} className="w-full rounded-lg border border-slate-300 p-3 focus:ring-2 focus:ring-primary" /></label>
      <label className="space-y-2 sm:col-span-2"><span className="text-sm font-bold text-slate-700">Description</span><textarea required rows="5" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full rounded-lg border border-slate-300 p-3 focus:ring-2 focus:ring-primary" /></label>
    </div>
    <label className="flex items-center gap-3 text-sm font-semibold text-slate-700"><input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} className="h-4 w-4 accent-primary" />Publish on the public website</label>
    <button disabled={saving} className="rounded-full bg-primary px-6 py-3 text-sm font-bold text-white hover:bg-primary-dark disabled:opacity-60">{saving ? 'Saving…' : 'Save Changes'}</button>
    {message && <p className="text-sm font-semibold text-red-600">{message}</p>}
  </form></AdminLayout>;
}

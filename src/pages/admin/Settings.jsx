import React, { useEffect, useState } from 'react';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import AdminLayout from '../../components/AdminLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import PageTitle from '../../components/PageTitle';
import { db } from '../../firebase/config';
import { useAuth } from '../../context/AuthContext';
import { logActivity } from '../../utils/activityLog';

const initial = {
  siteName: 'Dankamf Educational Complex', tagline: 'Excellence in Learning & Character', admissionsTitle: 'Join the Dankamf Family', admissionsSubtitle: 'Discover our admission process and take the first step towards securing a bright future for your child.', contactEmail: '', phone: '', whatsapp: '', address: '', officeHours: '', footerNote: '', facebook: '', instagram: '', twitter: '', tiktok: '', seoTitle: '', seoDescription: '', emergencyAlert: '', emergencyAlertActive: false,
};

export default function Settings() {
  const { role, user } = useAuth();
  const [form, setForm] = useState(initial);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => { getDoc(doc(db, 'config', 'global')).then((snap) => { if (snap.exists()) setForm((prev) => ({ ...prev, ...snap.data() })); }).catch((error) => setMessage({ type: 'error', text: error.message })).finally(() => setLoading(false)); }, []);

  const change = (event) => { const { name, value, type, checked } = event.target; setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value })); setMessage(null); };
  const submit = async (event) => {
    event.preventDefault();
    if (role !== 'superadmin') return setMessage({ type: 'error', text: 'Only superadmins can update school settings.' });
    if (form.contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contactEmail)) return setMessage({ type: 'error', text: 'Enter a valid contact email.' });
    setSaving(true); setMessage(null);
    try { await setDoc(doc(db, 'config', 'global'), { ...form, updatedAt: serverTimestamp(), updatedBy: user?.email || '' }, { merge: true }); await logActivity(user, 'update_site_settings', 'Updated the school configuration center.'); setMessage({ type: 'success', text: 'School settings published successfully.' }); } catch (error) { setMessage({ type: 'error', text: error.message || 'Unable to save settings.' }); } finally { setSaving(false); }
  };
  const input = (name, label, type = 'text', placeholder = '') => <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">{label}<input name={name} type={type} value={form[name] || ''} onChange={change} placeholder={placeholder} className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-primary/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white" /></label>;
  const textarea = (name, label, rows = 3) => <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">{label}<textarea name={name} value={form[name] || ''} onChange={change} rows={rows} className="mt-1 w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-primary/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white" /></label>;
  if (loading) return <AdminLayout><LoadingSpinner label="Loading school settings" /></AdminLayout>;
  return <AdminLayout><PageTitle>School Configuration Center</PageTitle><form onSubmit={submit} className="mx-auto max-w-5xl space-y-5">{message && <div role="status" className={`rounded-lg border px-4 py-3 text-sm font-semibold ${message.type === 'success' ? 'border-green-200 bg-green-50 text-green-700' : 'border-red-200 bg-red-50 text-red-700'}`}>{message.text}</div>}<section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900"><h2 className="text-lg font-black text-primary">School Identity</h2><p className="mb-4 mt-1 text-sm text-slate-500 dark:text-slate-400">These values appear across the public website.</p><div className="grid gap-4 md:grid-cols-2">{input('siteName', 'School name')}{input('tagline', 'Tagline')}</div></section><section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900"><h2 className="text-lg font-black text-primary">Contact &amp; Office</h2><div className="mt-4 grid gap-4 md:grid-cols-2">{input('contactEmail', 'Public email', 'email')}{input('phone', 'Main phone number')}{input('whatsapp', 'WhatsApp number')}{input('officeHours', 'Office hours')}</div><div className="mt-4">{textarea('address', 'Physical / digital address')}</div></section><section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900"><h2 className="text-lg font-black text-primary">Social Media</h2><div className="mt-4 grid gap-4 md:grid-cols-2">{input('facebook', 'Facebook URL', 'url')}{input('instagram', 'Instagram URL', 'url')}{input('twitter', 'X / Twitter URL', 'url')}{input('tiktok', 'TikTok URL', 'url')}</div></section><section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900"><h2 className="text-lg font-black text-primary">Footer &amp; SEO</h2><div className="mt-4 space-y-4">{textarea('footerNote', 'Footer note')}{input('seoTitle', 'SEO title')}{textarea('seoDescription', 'SEO description', 3)}</div></section><section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900"><h2 className="text-lg font-black text-primary">Emergency Alert</h2><div className="mt-4 space-y-4">{textarea('emergencyAlert', 'Alert message', 2)}<label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200"><input name="emergencyAlertActive" type="checkbox" checked={Boolean(form.emergencyAlertActive)} onChange={change} className="h-4 w-4 accent-primary" /> Publish this alert on the public website</label></div></section><button disabled={saving || role !== 'superadmin'} className="rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-white shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50">{saving ? 'Publishing…' : 'Publish School Settings'}</button>{role !== 'superadmin' && <p className="text-sm font-semibold text-red-600 dark:text-red-400">Only superadmins can publish settings.</p>}</form></AdminLayout>;
}

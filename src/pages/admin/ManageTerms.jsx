import React, { useEffect, useState } from 'react';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import AdminLayout from '../../components/AdminLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import { db } from '../../firebase/config';
import { requireRecentAdminAuth } from '../../firebase/security';

export default function ManageTerms() {
  const [content, setContent] = useState('');
  const [published, setPublished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => { getDoc(doc(db, 'legalPages', 'terms')).then((snapshot) => { if (snapshot.exists()) { const data = snapshot.data(); setContent(data.content || ''); setPublished(data.published === true); } }).catch(() => setMessage('Unable to load Terms of Service.')).finally(() => setLoading(false)); }, []);

  const save = async (event) => { event.preventDefault(); setSaving(true); setMessage(''); try { await requireRecentAdminAuth(password); await setDoc(doc(db, 'legalPages', 'terms'), { content: content.trim(), published, updatedAt: serverTimestamp() }, { merge: true }); setPassword(''); setMessage(published ? 'Terms of Service published.' : 'Terms saved as unpublished.'); } catch (error) { setMessage(error.message || 'Unable to save Terms of Service.'); } finally { setSaving(false); } };

  if (loading) return <AdminLayout><LoadingSpinner label="Loading Terms of Service" /></AdminLayout>;
  return <AdminLayout><div className="mx-auto max-w-4xl"><h1 className="text-2xl font-black text-primary">Terms of Service</h1><p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Write the public terms in Markdown. They appear on the Terms of Service page only when published.</p><form onSubmit={save} className="mt-5 space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900"><textarea required rows="22" value={content} onChange={(event) => setContent(event.target.value)} placeholder="Write the Terms of Service here..." className="w-full rounded-lg border p-3 font-mono text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white" /><label className="flex items-center gap-2 text-sm font-bold"><input type="checkbox" checked={published} onChange={(event) => setPublished(event.target.checked)} /> Publish on the public website</label><input required type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Administrator password to confirm" className="w-full rounded-lg border p-3 dark:border-slate-600 dark:bg-slate-800 dark:text-white" /><button disabled={saving} className="rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white disabled:opacity-60">{saving ? 'Saving…' : 'Save Terms'}</button>{message && <p role="status" className="text-sm font-semibold text-primary">{message}</p>}</form></div></AdminLayout>;
}

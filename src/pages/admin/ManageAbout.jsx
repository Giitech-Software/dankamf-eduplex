import React, { useEffect, useState } from 'react';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import AdminLayout from '../../components/AdminLayout';
import PageTitle from '../../components/PageTitle';
import { db, storage } from '../../firebase/config';
import LoadingSpinner from '../../components/LoadingSpinner';

const initial = { history: '', headteacherMessage: '', vision: '', mission: '', values: '', achievements: '', educationalPhilosophy: '', schoolIntroduction: '', proprietorName: '', proprietorRole: 'Proprietor', headteacherName: '', headteacherRole: 'Headteacher', proprietorImage: null, headteacherImage: null };

export default function ManageAbout() {
  const [form, setForm] = useState(initial);
  const [record, setRecord] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => { getDoc(doc(db, 'about', 'schoolProfile')).then((snap) => { if (snap.exists()) { const data = snap.data(); setRecord(data); setForm((prev) => ({ ...prev, ...data })); } }).catch(console.error).finally(() => setLoading(false)); }, []);

  const change = (event) => { const { name, value, files } = event.target; setForm((prev) => ({ ...prev, [name]: files ? files[0] : value })); setMessage(''); };
  const uploadImage = async (file, oldPath, type) => {
    if (!file) return { url: record[`${type}Image`] || '', path: record[`${type}ImagePath`] || '' };
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) throw new Error('Use JPG, PNG, or WEBP images only.');
    if (file.size > 180 * 1024) throw new Error('Each profile image must not exceed 180 KB.');
    const path = `aboutImages/${Date.now()}-${type}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '-')}`;
    const uploaded = await uploadBytes(ref(storage, path), file);
    if (oldPath) await deleteObject(ref(storage, oldPath)).catch(() => {});
    return { url: await getDownloadURL(uploaded.ref), path };
  };
  const submit = async (event) => {
    event.preventDefault(); setSaving(true); setMessage('');
    try {
      const proprietor = await uploadImage(form.proprietorImage, record.proprietorImagePath, 'proprietor');
      const headteacher = await uploadImage(form.headteacherImage, record.headteacherImagePath, 'headteacher');
      await setDoc(doc(db, 'about', 'schoolProfile'), { history: form.history.trim(), headteacherMessage: form.headteacherMessage.trim(), vision: form.vision.trim(), mission: form.mission.trim(), values: form.values.trim(), achievements: form.achievements.trim(), educationalPhilosophy: form.educationalPhilosophy.trim(), schoolIntroduction: form.schoolIntroduction.trim(), proprietorName: form.proprietorName.trim(), proprietorRole: form.proprietorRole.trim(), headteacherName: form.headteacherName.trim(), headteacherRole: form.headteacherRole.trim(), proprietorImage: proprietor.url, proprietorImagePath: proprietor.path, headteacherImage: headteacher.url, headteacherImagePath: headteacher.path, updatedAt: serverTimestamp() }, { merge: true });
      setRecord((prev) => ({ ...prev, proprietorImage: proprietor.url, proprietorImagePath: proprietor.path, headteacherImage: headteacher.url, headteacherImagePath: headteacher.path })); setForm((prev) => ({ ...prev, proprietorImage: null, headteacherImage: null })); setMessage('About content updated successfully.');
    } catch (error) { console.error(error); setMessage(error.message || 'Unable to update About content.'); } finally { setSaving(false); }
  };
  if (loading) return <AdminLayout><LoadingSpinner label="Loading About content" /></AdminLayout>;
  const introductionField = <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 md:col-span-2">School Introduction <span className="font-normal text-slate-500">(Markdown supported)</span><textarea name="schoolIntroduction" value={form.schoolIntroduction || ''} onChange={change} rows="5" placeholder="Introduce Dankamf Educational Complex to visitors." className="mt-1 w-full rounded-lg border p-3 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white" /></label>;
  const philosophyField = <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 md:col-span-2">Educational Philosophy <span className="font-normal text-slate-500">(Markdown supported)</span><textarea name="educationalPhilosophy" value={form.educationalPhilosophy || ''} onChange={change} rows="5" placeholder="Explain the school&apos;s educational philosophy." className="mt-1 w-full rounded-lg border p-3 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white" /></label>;
  const field = (name, label, type = 'text') => <><label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">{label}<input name={name} type={type} value={form[name] || ''} onChange={change} className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-2.5 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-primary/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white" /></label>{name === 'mission' && <div className="mt-4 grid gap-4 md:grid-cols-2">{introductionField}{philosophyField}{achievementsField}</div>}</>;
  const achievementsField = <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 md:col-span-2">School Achievements <span className="font-normal text-slate-500">(Markdown supported)</span><textarea name="achievements" value={form.achievements || ''} onChange={change} rows="5" placeholder="# School Achievements\n\nAdd the school&apos;s achievements and milestones." className="mt-1 w-full rounded-lg border p-3 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white" /></label>;
  return <AdminLayout><PageTitle>About &amp; School Profile</PageTitle><form onSubmit={submit} className="mx-auto max-w-5xl space-y-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900 sm:p-7"><p className="text-sm text-slate-500 dark:text-slate-400">Update the public About page. Profile images should be clear JPG, PNG, or WEBP files under 180 KB.</p>{message && <p className="rounded-lg bg-blue-50 p-3 text-sm font-semibold text-primary dark:bg-blue-950/40 dark:text-blue-200">{message}</p>}<label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">School History<textarea name="history" value={form.history} onChange={change} rows="5" required className="mt-1 w-full rounded-lg border p-3 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white" /></label><div className="grid gap-4 md:grid-cols-2">{field('vision', 'Vision')}{field('mission', 'Mission')}</div><label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Core Values<textarea name="values" value={form.values} onChange={change} rows="3" className="mt-1 w-full rounded-lg border p-3 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white" /></label><label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Headteacher&apos;s Welcome<textarea name="headteacherMessage" value={form.headteacherMessage} onChange={change} rows="5" className="mt-1 w-full rounded-lg border p-3 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white" /></label><div className="grid gap-5 md:grid-cols-2">{[['proprietor', 'Proprietor'], ['headteacher', 'Headteacher']].map(([type, label]) => <div key={type} className="space-y-3 rounded-lg border p-4 dark:border-gray-700"><h2 className="font-black text-primary">{label} Profile</h2>{field(`${type}Name`, `${label} name`)}{field(`${type}Role`, 'Role')}<label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Profile photo<input name={`${type}Image`} type="file" accept="image/jpeg,image/png,image/webp" onChange={change} className="mt-1 block w-full text-sm dark:text-white" /></label>{record[`${type}Image`] && <img src={record[`${type}Image`]} alt={`${label}`} className="h-32 w-32 rounded-xl object-cover" />}</div>)}</div><button disabled={saving} className="rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white disabled:opacity-60">{saving ? 'Saving…' : 'Save About Content'}</button></form></AdminLayout>;
}

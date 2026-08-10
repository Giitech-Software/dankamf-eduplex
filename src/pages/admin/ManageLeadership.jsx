import React, { useEffect, useState } from 'react';
import { collection, addDoc, deleteDoc, doc, getDocs, serverTimestamp, updateDoc } from 'firebase/firestore';
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { FaImage, FaPencilAlt, FaTrash } from 'react-icons/fa';
import AdminLayout from '../../components/AdminLayout';
import PageTitle from '../../components/PageTitle';
import LoadingSpinner from '../../components/LoadingSpinner';
import { db, storage } from '../../firebase/config';

const emptyForm = { name: '', role: '', bio: '', order: 1, image: null };

export default function ManageLeadership() {
  const [leaders, setLeaders] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const load = async () => {
    try {
      const snap = await getDocs(collection(db, 'leadership'));
      setLeaders(snap.docs.map((item) => ({ id: item.id, ...item.data() })).sort((a, b) => (Number(a.order) || 9999) - (Number(b.order) || 9999)));
    } catch (error) { console.error(error); setMessage('Unable to load leadership profiles.'); } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);
  useEffect(() => () => { if (preview?.startsWith('blob:')) URL.revokeObjectURL(preview); }, [preview]);

  const chooseImage = (event) => {
    const image = event.target.files?.[0] || null;
    if (image && image.size > 180 * 1024) return setMessage('Staff images must not exceed 180 KB.');
    if (preview?.startsWith('blob:')) URL.revokeObjectURL(preview);
    setForm((current) => ({ ...current, image }));
    setPreview(image ? URL.createObjectURL(image) : editing?.imageUrl || '');
    setMessage('');
  };

  const startEdit = (leader) => {
    setEditing(leader);
    setForm({ name: leader.name || '', role: leader.role || '', bio: leader.bio || '', order: leader.order || 1, image: null });
    setPreview(leader.imageUrl || '');
    setMessage('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => { setEditing(null); setForm({ ...emptyForm, order: leaders.length + 1 }); setPreview(''); setMessage(''); };

  const save = async (event) => {
    event.preventDefault(); setSaving(true); setMessage('');
    try {
      let imageUrl = editing?.imageUrl || '';
      let imagePath = editing?.imagePath || '';
      if (form.image) {
        const path = `leadershipImages/${Date.now()}-${form.image.name.replace(/[^a-zA-Z0-9._-]/g, '-')}`;
        const uploaded = await uploadBytes(ref(storage, path), form.image);
        imageUrl = await getDownloadURL(uploaded.ref); imagePath = path;
        if (editing?.imagePath) await deleteObject(ref(storage, editing.imagePath)).catch(() => {});
      }
      const data = { name: form.name.trim(), role: form.role.trim(), bio: form.bio.trim(), order: Number(form.order) || 1, imageUrl, imagePath, published: true };
      if (editing) await updateDoc(doc(db, 'leadership', editing.id), data);
      else await addDoc(collection(db, 'leadership'), { ...data, createdAt: serverTimestamp() });
      setMessage(editing ? 'Staff profile updated successfully.' : 'Staff profile published successfully.');
      setEditing(null); setForm({ ...emptyForm, order: leaders.length + 2 }); setPreview(''); await load();
    } catch (error) { console.error(error); setMessage(error.message || 'Unable to save staff profile.'); } finally { setSaving(false); }
  };

  const remove = async (leader) => {
    if (!window.confirm(`Delete ${leader.name}'s profile?`)) return;
    await deleteDoc(doc(db, 'leadership', leader.id));
    if (leader.imagePath) await deleteObject(ref(storage, leader.imagePath)).catch(() => {});
    setLeaders((items) => items.filter((item) => item.id !== leader.id));
    if (editing?.id === leader.id) cancelEdit();
  };

  return <AdminLayout><PageTitle>Leadership Team</PageTitle><div className="mt-5 grid gap-6 lg:grid-cols-[360px_1fr]">
    <form onSubmit={save} className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <h2 className="text-lg font-black text-primary dark:text-sky-300">{editing ? 'Edit Staff Profile' : 'Add Staff Profile'}</h2>
      {message && <p role="status" className="text-sm font-semibold text-primary dark:text-sky-300">{message}</p>}
      <label className="block text-sm font-bold text-darkgray dark:text-slate-200">Full name<input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-2 w-full rounded-lg border border-slate-300 p-3 dark:border-slate-600 dark:bg-slate-800 dark:text-white" /></label>
      <label className="block text-sm font-bold text-darkgray dark:text-slate-200">Role<input required value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="mt-2 w-full rounded-lg border border-slate-300 p-3 dark:border-slate-600 dark:bg-slate-800 dark:text-white" /></label>
      <label className="block text-sm font-bold text-darkgray dark:text-slate-200">Biography <span className="font-normal text-slate-500">(Markdown supported)</span><textarea required rows="5" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} className="mt-2 w-full rounded-lg border border-slate-300 p-3 dark:border-slate-600 dark:bg-slate-800 dark:text-white" /></label>
      <label className="block text-sm font-bold text-darkgray dark:text-slate-200">Display order<input type="number" min="1" value={form.order} onChange={(e) => setForm({ ...form, order: e.target.value })} className="mt-2 w-full rounded-lg border border-slate-300 p-3 dark:border-slate-600 dark:bg-slate-800 dark:text-white" /></label>
      <label className="block text-sm font-bold text-darkgray dark:text-slate-200">Profile photo <span className="font-normal text-slate-500">(optional when editing, max 180 KB)</span><input type="file" accept="image/jpeg,image/png,image/webp" onChange={chooseImage} className="mt-2 w-full rounded-lg border border-slate-300 p-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white" /></label>
      {preview ? <img src={preview} alt="Staff preview" className="h-40 w-full rounded-lg object-cover" /> : <div className="flex h-32 items-center justify-center rounded-lg border-2 border-dashed border-slate-300 text-slate-400"><FaImage size={28} /></div>}
      <div className="flex gap-2"><button disabled={saving} className="flex-1 rounded-full bg-primary px-5 py-3 text-sm font-bold text-white hover:bg-primary-dark disabled:opacity-60">{saving ? 'Saving…' : editing ? 'Save Changes' : 'Publish Staff Profile'}</button>{editing && <button type="button" onClick={cancelEdit} className="rounded-full border border-slate-300 px-4 text-sm font-bold text-slate-600">Cancel</button>}</div>
    </form>
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900"><h2 className="mb-4 text-lg font-black text-primary dark:text-sky-300">Published Staff ({leaders.length})</h2>{loading ? <LoadingSpinner label="Loading staff profiles" /> : leaders.length === 0 ? <p className="rounded-lg bg-slate-50 p-8 text-center text-text-light dark:bg-slate-800 dark:text-slate-300">No staff profiles yet.</p> : <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{leaders.map((leader) => <article key={leader.id} className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800">{leader.imageUrl ? <img src={leader.imageUrl} alt={leader.name} className="h-40 w-full object-cover" /> : <div className="flex h-40 items-center justify-center bg-primary text-4xl font-black text-white">{leader.name?.charAt(0)}</div>}<div className="p-4"><h3 className="font-black text-darkgray dark:text-white">{leader.name}</h3><p className="mt-1 text-xs font-bold uppercase tracking-wider text-accent">{leader.role}</p><p className="mt-2 line-clamp-3 text-sm text-text-light dark:text-slate-300">{leader.bio}</p><div className="mt-3 flex gap-4"><button onClick={() => startEdit(leader)} className="inline-flex items-center gap-2 text-xs font-bold text-primary dark:text-sky-300"><FaPencilAlt /> Edit</button><button onClick={() => remove(leader)} className="inline-flex items-center gap-2 text-xs font-bold text-red-600"><FaTrash /> Delete</button></div></div></article>)}</div>}</section>
  </div></AdminLayout>;
}

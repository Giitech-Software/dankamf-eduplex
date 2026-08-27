import React, { useEffect, useState } from 'react';
import { addDoc, collection, deleteDoc, doc, getDocs, orderBy, query, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { requireRecentAdminAuth } from '../../firebase/security';
import AdminLayout from '../../components/AdminLayout';
import PageTitle from '../../components/PageTitle';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function ManageAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({ message: '', type: 'notice' });

  const load = async () => {
    try {
      const snapshot = await getDocs(query(collection(db, 'schoolAlerts'), orderBy('createdAt', 'desc')));
      setAlerts(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
    } catch (error) {
      console.error(error);
      setMessage('Unable to load alerts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const add = async (event) => {
    event.preventDefault();
    if (!form.message.trim()) return;
    try {
      await requireRecentAdminAuth(window.prompt('Enter your administrator password to confirm publishing:'));
      await addDoc(collection(db, 'schoolAlerts'), { ...form, active: true, createdAt: serverTimestamp() });
      setForm({ message: '', type: 'notice' });
      setMessage('Alert published.');
      await load();
    } catch (error) {
      setMessage(error.message || 'Unable to publish alert.');
    }
  };

  const toggle = async (alert) => {
    try {
      await requireRecentAdminAuth(window.prompt('Enter your administrator password to confirm this change:'));
      await updateDoc(doc(db, 'schoolAlerts', alert.id), { active: !alert.active });
      setAlerts((items) => items.map((item) => item.id === alert.id ? { ...item, active: !alert.active } : item));
    } catch (error) {
      setMessage(error.message || 'Unable to update alert.');
    }
  };

  const remove = async (alert) => {
    if (!window.confirm('Delete this school alert?')) return;
    try {
      await requireRecentAdminAuth(window.prompt('Enter your administrator password to confirm deletion:'));
      await deleteDoc(doc(db, 'schoolAlerts', alert.id));
      setAlerts((items) => items.filter((item) => item.id !== alert.id));
    } catch (error) {
      setMessage(error.message || 'Unable to delete alert.');
    }
  };

  return (
    <AdminLayout>
      <PageTitle>School Alerts</PageTitle>
      <form onSubmit={add} className="mt-5 flex max-w-3xl flex-col gap-3 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900 sm:flex-row">
        <select value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value })} className="rounded-lg border border-slate-300 bg-white p-3 text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-white">
          <option value="notice">Notice</option><option value="emergency">Emergency</option>
        </select>
        <input required value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} placeholder="Write an important school alert..." className="min-w-0 flex-1 rounded-lg border border-slate-300 bg-white p-3 text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-white" />
        <button className="rounded-full bg-primary px-5 py-3 text-sm font-bold text-white">Publish</button>
      </form>
      {message && <p className="mt-3 text-sm font-semibold text-primary">{message}</p>}
      <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
        {loading ? <LoadingSpinner label="Loading alerts" /> : <table className="min-w-full"><thead><tr className="border-b text-left text-xs uppercase text-slate-500"><th className="px-5 py-3">Message</th><th className="px-5 py-3">Type</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Actions</th></tr></thead><tbody>{alerts.map((alert) => <tr key={alert.id} className="border-b dark:border-slate-700 dark:text-slate-200"><td className="px-5 py-4 text-sm font-semibold">{alert.message}</td><td className="px-5 py-4 text-sm">{alert.type}</td><td className="px-5 py-4 text-sm">{alert.active ? 'Active' : 'Hidden'}</td><td className="space-x-3 px-5 py-4 text-sm"><button onClick={() => toggle(alert)} className="font-bold text-primary">{alert.active ? 'Hide' : 'Show'}</button><button onClick={() => remove(alert)} className="font-bold text-red-600">Delete</button></td></tr>)}</tbody></table>}
      </div>
    </AdminLayout>
  );
}

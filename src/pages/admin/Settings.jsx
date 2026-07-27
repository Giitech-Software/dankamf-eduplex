import React, { useEffect, useState } from 'react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase/config';
import AdminLayout from '../../components/AdminLayout';
import { useAuth } from '../../context/AuthContext';
import PageTitle from '../../components/PageTitle';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function Settings() {
  const { role } = useAuth();
  const [form, setForm] = useState({
    siteName: '',
    tagline: '',
    contactEmail: '',
    phone: '',
    footerNote: '',
  });
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    (async () => {
      const snap = await getDoc(doc(db, 'config', 'global'));
      if (snap.exists()) setForm(snap.data());
      setLoading(false);
    })();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      if (role !== 'superadmin') {
        setMsg('❌ Only super admins can update settings.');
        return;
      }
      await setDoc(
        doc(db, 'config', 'global'),
        { ...form, updatedAt: serverTimestamp() },
        { merge: true }
      );
      setMsg('✅ Settings saved!');
    } catch (err) {
      setMsg('❌ ' + err.message);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <LoadingSpinner label="Loading settings" />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <>
        <PageTitle>⚙️ Site Settings</PageTitle>
      </>
      {msg && (
        <p className="mb-4 text-gray-700 dark:text-gray-300">{msg}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
        <input
          name="siteName"
          value={form.siteName}
          onChange={handleChange}
          placeholder="Site Name"
          className="w-full p-3 border rounded bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          required
        />
        <input
          name="tagline"
          value={form.tagline}
          onChange={handleChange}
          placeholder="Tagline"
          className="w-full p-3 border rounded bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white"
        />
        <input
          name="contactEmail"
          type="email"
          value={form.contactEmail}
          onChange={handleChange}
          placeholder="Contact Email"
          className="w-full p-3 border rounded bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white"
        />
        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Phone"
          className="w-full p-3 border rounded bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white"
        />
        <textarea
          name="footerNote"
          value={form.footerNote}
          onChange={handleChange}
          placeholder="Footer Note"
          className="w-full p-3 border rounded h-24 bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white"
        />

        <button
          className="bg-primary text-white px-6 py-3 rounded hover:bg-cta transition disabled:opacity-60"
          disabled={role !== 'superadmin'}
        >
          Save Settings
        </button>
        {role !== 'superadmin' && (
          <p className="text-sm text-red-600 dark:text-red-400 mt-1">
            Only super admins can save changes.
          </p>
        )}
      </form>
    </AdminLayout>
  );
}

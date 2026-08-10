import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  doc, getDoc, updateDoc, deleteDoc, serverTimestamp
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../firebase/config';
import { useAuth } from '../../context/AuthContext';
import { logActivity } from '../../utils/activityLog';
import AdminLayout from '../../components/AdminLayout';
import PageTitle from '../../components/PageTitle';

export default function EditService() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [service, setService] = useState({
    title: '',
    order: '',
    description: '',
    curriculum: '',
    assessment: '',
    timetable: '',
    iconUrl: '',
    iconImage: null,
  });

  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchService() {
      try {
        const docRef = doc(db, 'services', id);
        const snap = await getDoc(docRef);

        if (snap.exists()) {
          const data = snap.data();
          setService({
            title: data.title || '',
            order: data.order || '',
            description: data.description || '',
            curriculum: data.curriculum || '',
            assessment: data.assessment || '',
            timetable: data.timetable || '',
            iconUrl: data.iconUrl || '',
            iconImage: null,
          });
        } else {
          setMsg('❌ Service not found');
        }
      } catch (error) {
        setMsg('❌ Failed to load service');
      }
    }

    fetchService();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMsg('');
    setLoading(true);

    try {
      let iconUrl = service.iconUrl;

      if (service.iconImage) {
        const imgRef = ref(storage, `serviceIcons/${Date.now()}-${service.iconImage.name}`);
        const snap = await uploadBytes(imgRef, service.iconImage);
        iconUrl = await getDownloadURL(snap.ref);
      }

      await updateDoc(doc(db, 'services', id), {
        title: service.title,
        order: Number(service.order) || 9999,
        description: service.description,
        curriculum: service.curriculum,
        assessment: service.assessment,
        timetable: service.timetable,
        iconUrl,
        updatedAt: serverTimestamp(),
      });

      await logActivity(user, 'update_service', `Updated service: ${service.title}`);
      setMsg('✅ Service updated successfully!');
    } catch (err) {
      setMsg('❌ ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete this service?');
    if (!confirmDelete) return;

    setMsg('');
    setLoading(true);
    try {
      await deleteDoc(doc(db, 'services', id));
      await logActivity(user, 'delete_service', `Deleted service: ${service.title}`);
      setMsg('🗑️ Service deleted successfully!');
      navigate('/admin/services');
    } catch (err) {
      setMsg('❌ ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <PageTitle>✏️ Edit Academic Programme</PageTitle>

      <form onSubmit={handleUpdate} className="space-y-4 max-w-xl">
        <input
          type="text"
          name="title"
          value={service.title}
          onChange={(e) => setService({ ...service, title: e.target.value })}
          placeholder="Service Title"
          required
          className="w-full p-3 border rounded bg-white dark:bg-gray-900 dark:border-gray-700 dark:text-white"
        />

        <textarea
          name="description"
          value={service.description}
          onChange={(e) => setService({ ...service, description: e.target.value })}
          placeholder="Service Description (Markdown supported)"
          required
          className="w-full p-3 border rounded h-40 bg-white dark:bg-gray-900 dark:border-gray-700 dark:text-white"
        />
        <label className="block text-sm font-bold text-slate-700 dark:text-slate-200">Homepage display number<input type="number" min="1" value={service.order || ''} onChange={(e) => setService({ ...service, order: e.target.value })} className="mt-1 w-full rounded-lg border p-3 dark:border-gray-700 dark:bg-gray-900 dark:text-white" /><span className="mt-1 block text-xs font-normal text-slate-500">Lower numbers appear first in Our Academics.</span></label>

        <textarea name="curriculum" value={service.curriculum} onChange={(e) => setService({ ...service, curriculum: e.target.value })} placeholder="Curriculum overview (Markdown supported)" className="w-full h-32 p-3 border rounded bg-white dark:bg-gray-900 dark:border-gray-700 dark:text-white" />
        <textarea name="assessment" value={service.assessment} onChange={(e) => setService({ ...service, assessment: e.target.value })} placeholder="Assessment approach (Markdown supported)" className="w-full h-32 p-3 border rounded bg-white dark:bg-gray-900 dark:border-gray-700 dark:text-white" />
        <textarea name="timetable" value={service.timetable} onChange={(e) => setService({ ...service, timetable: e.target.value })} placeholder="Timetable and academic calendar (Markdown supported)" className="w-full h-32 p-3 border rounded bg-white dark:bg-gray-900 dark:border-gray-700 dark:text-white" />

        <div>
          {service.iconUrl && (
            <img
              src={service.iconUrl}
              alt="Current Icon"
              className="h-32 mb-2 rounded shadow"
            />
          )}
          <input
            type="file"
            name="iconImage"
            accept="image/*"
            onChange={(e) => setService({ ...service, iconImage: e.target.files[0] })}
            className="w-full p-3 border rounded bg-white dark:bg-gray-900 dark:border-gray-700 dark:text-white"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {loading ? 'Updating…' : 'Update Service'}
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Delete
          </button>
        </div>

        {msg && <p className="text-sm text-gray-700 dark:text-gray-300">{msg}</p>}
      </form>
    </AdminLayout>
  );
}

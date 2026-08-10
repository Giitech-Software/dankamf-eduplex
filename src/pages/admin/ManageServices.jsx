import React, { useEffect, useState } from 'react';
import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { deleteObject, ref } from 'firebase/storage';
import { Link } from 'react-router-dom';
import { db, storage } from '../../firebase/config';
import { useAuth } from '../../context/AuthContext';
import { logActivity } from '../../utils/activityLog';
import AdminLayout from '../../components/AdminLayout';
import PageTitle from '../../components/PageTitle';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function ManageServices() {
  const [services, setServices] = useState([]);
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    getDocs(collection(db, 'services'))
      .then((snapshot) => setServices(snapshot.docs.map((serviceDoc) => ({ id: serviceDoc.id, ...serviceDoc.data() })).sort((a, b) => (Number(a.order) || 9999) - (Number(b.order) || 9999))))
      .catch((error) => console.error('Error fetching academic programmes:', error))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id, imageUrl, title) => {
    try {
      await deleteDoc(doc(db, 'services', id));
      if (imageUrl) await deleteObject(ref(storage, imageUrl));
      setServices((previous) => previous.filter((service) => service.id !== id));
      await logActivity(currentUser?.email, `Deleted academic programme: ${title}`);
      setMsg(`Programme "${title}" deleted successfully.`);
    } catch (error) {
      console.error('Error deleting academic programme:', error);
      setMsg('Unable to delete this programme. Please try again.');
    }
    setTimeout(() => setMsg(''), 3000);
  };

  return (
    <AdminLayout>
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <PageTitle>Academic Programmes</PageTitle>
        <Link to="/admin/services" className="inline-flex w-fit rounded-full bg-primary px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-primary-dark">
          + Add Academic Programme
        </Link>
      </div>
      {msg && <div className="mb-4 rounded border border-green-300 bg-green-50 px-4 py-2 text-green-800">{msg}</div>}
      {loading ? <LoadingSpinner label="Loading academic programmes" /> : services.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
          <h3 className="text-lg font-bold text-darkgray">No academic programmes yet</h3>
          <p className="mt-2 text-sm text-slate-600">Add Preschool, Primary, JHS, or another programme to publish it on the Academics page.</p>
          <Link to="/admin/services" className="mt-4 inline-flex rounded-full bg-primary px-4 py-2 text-sm font-bold text-white hover:bg-primary-dark">Add the first programme</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <div key={service.id} className="rounded border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">
              {service.imageUrl && <img src={service.imageUrl} alt={service.title} className="mb-3 h-40 w-full rounded object-cover" />}
              <div className="flex items-start justify-between gap-3"><h3 className="text-lg font-semibold text-gray-900 dark:text-white">{service.title}</h3><span className="rounded-full bg-primary px-2.5 py-1 text-xs font-black text-white">{service.order || index + 1}</span></div>
              <p className="mt-1 line-clamp-3 text-sm text-gray-700 dark:text-gray-300">{service.description}</p>
              <div className="mt-3 flex items-center justify-between">
                <Link to={`/admin/edit-service/${service.id}`} className="text-sm font-bold text-blue-600 underline dark:text-blue-400">Edit</Link>
                <button onClick={() => handleDelete(service.id, service.imageUrl, service.title)} className="text-sm font-bold text-red-600 underline dark:text-red-400">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}

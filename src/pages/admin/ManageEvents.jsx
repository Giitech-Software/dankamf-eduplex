import React, { useEffect, useState } from 'react';
import { collection, deleteDoc, doc, getDocs, orderBy, query } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { db } from '../../firebase/config';
import { useAuth } from '../../context/AuthContext';
import { logActivity } from '../../utils/activityLog';
import AdminLayout from '../../components/AdminLayout';
import PageTitle from '../../components/PageTitle';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function ManageEvents() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const loadEvents = async () => {
    try {
      const snapshot = await getDocs(query(collection(db, 'events'), orderBy('date', 'asc')));
      setEvents(snapshot.docs.map((event) => ({ id: event.id, ...event.data() })));
    } catch (error) {
      console.error('Error loading events:', error);
      setMessage('Unable to load events.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadEvents(); }, []);

  const removeEvent = async (event) => {
    if (!window.confirm(`Delete “${event.title}”?`)) return;
    try {
      await deleteDoc(doc(db, 'events', event.id));
      await logActivity(user, 'delete_event', `Deleted event: "${event.title}"`);
      setEvents((current) => current.filter((item) => item.id !== event.id));
      setMessage('Event deleted.');
    } catch (error) {
      console.error('Error deleting event:', error);
      setMessage('Unable to delete the event.');
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <PageTitle>Manage Events</PageTitle>
        <Link to="/admin/add-event" className="rounded-full bg-primary px-5 py-2.5 text-center text-sm font-bold text-white hover:bg-primary-dark">Add Event</Link>
      </div>
      {message && <p className="my-4 rounded-lg bg-blue-50 p-3 text-sm font-semibold text-primary">{message}</p>}
      <div className="mt-5 overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        {loading ? <LoadingSpinner label="Loading events" /> : (
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50"><tr>{['Event', 'Date', 'Category', 'Status', 'Actions'].map((heading) => <th key={heading} className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">{heading}</th>)}</tr></thead>
            <tbody className="divide-y divide-slate-100">
              {events.length === 0 ? <tr><td colSpan="5" className="px-5 py-8 text-center text-slate-500">No events have been created.</td></tr> : events.map((event) => (
                <tr key={event.id} className="hover:bg-slate-50">
                  <td className="px-5 py-4 font-bold text-darkgray">{event.title}</td>
                  <td className="px-5 py-4 text-sm text-slate-600">{event.date || '—'}</td>
                  <td className="px-5 py-4 text-sm text-slate-600">{event.category}</td>
                  <td className="px-5 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${event.published ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>{event.published ? 'Published' : 'Draft'}</span></td>
                  <td className="space-x-4 px-5 py-4 text-sm"><Link to={`/admin/edit-event/${event.id}`} className="inline-flex items-center gap-1 font-bold text-primary hover:underline"><FaEdit /> Edit</Link><button onClick={() => removeEvent(event)} className="inline-flex items-center gap-1 font-bold text-red-600 hover:underline"><FaTrash /> Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
}

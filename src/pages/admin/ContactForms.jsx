// src/pages/admin/ContactForms.jsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import AdminLayout from '../../components/AdminLayout';
import {
  collection,
  getDocs,
  orderBy,
  query,
  updateDoc,
  doc
} from 'firebase/firestore';
import { db } from '../../firebase/config';
import PageTitle from '../../components/PageTitle';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function ContactForms() {
  const { role } = useAuth();
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedForm, setSelectedForm] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [sendingReply, setSendingReply] = useState(false);

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const q = query(collection(db, 'contactForms'), orderBy('timestamp', 'desc'));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setForms(data);
      } catch (error) {
        console.error('Error fetching contact forms:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchForms();
  }, []);

  if (!['admin', 'superadmin'].includes(role)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500 text-lg dark:text-red-400">
          Access denied: You do not have permission to view this page.
        </p>
      </div>
    );
  }

  const openReplyModal = (form) => {
    setSelectedForm(form);
    setReplyMessage(form.reply || '');
  };

  const sendReply = async () => {
    if (!replyMessage.trim()) return;
    setSendingReply(true);
    try {
      const docRef = doc(db, 'contactForms', selectedForm.id);
      await updateDoc(docRef, { reply: replyMessage });
      alert('✅ Reply sent and saved.');
      setSelectedForm(null);
      setReplyMessage('');
    } catch (error) {
      console.error('Error sending reply:', error);
      alert('❌ Failed to send reply.');
    } finally {
      setSendingReply(false);
    }
  };

  return (
    <AdminLayout>
      <div className="p-4">
        <PageTitle>📝 Contact Forms</PageTitle>

        {loading ? (
          <LoadingSpinner label="Loading messages" />
        ) : forms.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-300">
            No contact messages submitted yet.
          </p>
        ) : (
          <div className="overflow-x-auto bg-white dark:bg-gray-900 rounded-lg shadow mt-4">
            <table className="min-w-full table-auto text-gray-900 dark:text-gray-100">
              <thead className="bg-primary text-white">
                <tr>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Message</th>
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Reply</th>
                </tr>
              </thead>
              <tbody>
                {forms.map((form) => (
                  <tr
                    key={form.id}
                    className="border-b hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <td className="px-4 py-2">{form.name}</td>
                    <td className="px-4 py-2">{form.email}</td>
                    <td className="px-4 py-2">{form.message}</td>
                    <td className="px-4 py-2">
                      {form.timestamp?.toDate().toLocaleString() ?? '—'}
                    </td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => openReplyModal(form)}
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {form.reply ? 'View/Edit Reply' : 'Reply'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Reply Modal */}
        {selectedForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-900 dark:text-white p-6 rounded-md shadow-lg w-full max-w-md">
              <h2 className="text-xl font-bold mb-2 text-primary dark:text-primary-light">
                Reply to {selectedForm.name}
              </h2>
              <textarea
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                placeholder="Enter your reply message..."
                className="w-full h-32 p-2 border rounded mb-4 bg-white dark:bg-gray-800 dark:text-white"
              />
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setSelectedForm(null)}
                  className="px-4 py-2 bg-gray-300 dark:bg-gray-700 dark:text-white rounded hover:bg-gray-400 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={sendReply}
                  disabled={sendingReply}
                  className="px-4 py-2 bg-primary text-white rounded hover:bg-accent"
                >
                  {sendingReply ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                      Sending...
                    </span>
                  ) : 'Send Reply'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import AdminLayout from '../../components/AdminLayout';
import PageTitle from '../../components/PageTitle';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function ManageFAQs() {
  const [faqs, setFaqs] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const snap = await getDocs(collection(db, 'faqs'));
        setFaqs(snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => (Number(a.order) || 9999) - (Number(b.order) || 9999)));
      } catch (err) {
        console.error(err);
        toast.error('Failed to load FAQs');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <AdminLayout>
      <PageTitle>📚 Manage FAQs</PageTitle>
      {loading ? (
        <LoadingSpinner label="Loading FAQs" />
      ) : (
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={faq.id}
            className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 rounded"
          >
            <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
              <span>{faq.icon} {faq.order || index + 1}. {faq.question.replace(/^\s*\d+[.)]\s*/, '')}</span>
            </h3>
            <p className={`mt-1 text-sm text-gray-700 dark:text-gray-300 ${expandedId === faq.id ? '' : 'line-clamp-2'}`}>{faq.answer}</p>
            <button type="button" onClick={() => setExpandedId((current) => current === faq.id ? null : faq.id)} className="mt-2 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              {expandedId === faq.id ? 'Hide answer' : 'Open answer'}
            </button>
            <Link
              to={`/admin/edit-faq/${faq.id}`}
              className="text-sm text-blue-600 dark:text-blue-400 underline mt-2 inline-block"
            >
              Edit
            </Link>
          </div>
        ))}
      </div>
      )}
    </AdminLayout>
  );
}

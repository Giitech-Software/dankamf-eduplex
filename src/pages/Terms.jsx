import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import ReactMarkdown from 'react-markdown';
import { db } from '../firebase/config';
import LoadingSpinner from '../components/LoadingSpinner';

const Terms = () => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDoc(doc(db, 'legalPages', 'terms'))
      .then((snapshot) => {
        if (snapshot.exists() && snapshot.data().published !== false) setContent(snapshot.data().content?.trim() || '');
      })
      .catch((error) => console.error('Unable to load Terms of Service.', error))
      .finally(() => setLoading(false));
  }, []);

  return <main className="min-h-screen bg-background-alt px-4 py-10 text-gray-800 sm:px-6"><div className="mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10"><h1 className="mb-6 text-3xl font-extrabold text-primary">Terms of Service</h1>{loading ? <LoadingSpinner label="Loading Terms of Service" /> : content ? <div className="markdown-content max-w-none text-base leading-relaxed sm:text-lg"><ReactMarkdown>{content}</ReactMarkdown></div> : <p className="rounded-lg bg-blue-50 p-4 text-text-light" role="status">Our Terms of Service are being prepared and will be available soon.</p>}</div></main>;
};

export default Terms;

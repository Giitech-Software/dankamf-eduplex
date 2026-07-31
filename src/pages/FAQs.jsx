import React, { useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { db } from '../firebase/config';
import LoadingSpinner from '../components/LoadingSpinner';
import Seo from '../components/Seo';
import SeoConfig from '../config/SeoConfig';

export default function FAQs() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const q = query(collection(db, 'faqs'), orderBy('timestamp', 'desc'));
        const snapshot = await getDocs(q);
        setFaqs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (fetchError) {
        console.error('Error fetching FAQs:', fetchError);
        setError('Unable to load the FAQs right now. Please try again shortly.');
      } finally {
        setLoading(false);
      }
    };

    fetchFaqs();
  }, []);

  return (
    <>
      <Seo {...SeoConfig.faqs} />
      <section className="bg-electric-blue px-4 py-6 text-primary sm:px-8 sm:py-8">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-cobalt">Helpful Answers</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
            Frequently Asked Questions
          </h1>
        </div>
      </section>

      <main className="bg-white px-0 py-10 sm:px-8 sm:py-14">
        <div className="mx-auto max-w-4xl">
          {loading ? (
            <LoadingSpinner label="Loading FAQs" />
          ) : error ? (
            <p className="px-4 text-center text-red-600 sm:px-0">{error}</p>
          ) : faqs.length === 0 ? (
            <p className="px-4 text-center text-slate-500 sm:px-0">No FAQs are available yet.</p>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {faqs.map(faq => (
                <article
                  key={faq.id}
                  className="border-l-4 border-primary bg-slate-50 p-5 shadow-sm sm:rounded-lg"
                >
                  <h2 className="text-xl font-bold text-slate-900">{faq.question}</h2>
                  <div className="prose prose-slate mt-3 max-w-none text-slate-700">
                    <ReactMarkdown>{faq.answer}</ReactMarkdown>
                  </div>
                </article>
              ))}
            </div>
          )}

          <div className="mt-10 px-4 text-center sm:px-0">
            <Link
              to="/#faqs"
              className="inline-flex rounded-lg bg-primary px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-cta"
            >
              Back to Homepage FAQs
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}

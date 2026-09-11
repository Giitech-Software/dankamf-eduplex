import React, { useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { db } from '../firebase/config';
import Seo from '../components/Seo';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Fees() {
  const [fees, setFees] = useState([]);
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getDocs(query(collection(db, 'admissionFees'), orderBy('programme', 'asc'))),
      getDocs(query(collection(db, 'scholarships'), orderBy('createdAt', 'desc'))),
    ]).then(([feeSnap, scholarshipSnap]) => {
      setFees(feeSnap.docs.map((item) => ({ id: item.id, ...item.data() })));
      setScholarships(scholarshipSnap.docs.map((item) => ({ id: item.id, ...item.data() })).filter((item) => item.published));
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const hasContent = fees.length > 0 || scholarships.length > 0;
  return <><Seo title="Fees & Scholarships | Dankamf Educational Complex" description="Review admission fees and scholarship information for Dankamf Educational Complex." /><main className="min-h-screen bg-background-alt"><section className="bg-primary-dark px-4 py-8 text-center text-white sm:px-8 sm:py-10"><p className="text-xs font-black uppercase tracking-[0.25em] text-accent-yellow">Admissions Finance</p><h1 className="mt-2 text-3xl font-black sm:text-4xl">Fees &amp; Scholarships</h1></section><section className="mx-auto max-w-6xl px-4 py-8 sm:px-8"><Link to="/admissions" className="mb-6 inline-flex rounded-full border border-primary/20 bg-white px-4 py-2 text-sm font-bold text-primary">← Back to Admissions</Link>{loading ? <LoadingSpinner label="Loading fees" /> : hasContent ? <><div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">{fees.length > 0 && <table className="min-w-full"><thead className="bg-blue-50"><tr>{['Programme', 'Admission', 'Tuition', 'Stationery'].map((heading) => <th key={heading} className="px-5 py-4 text-left text-sm font-black text-primary">{heading}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{fees.map((fee) => <tr key={fee.id}><td className="px-5 py-4 font-bold">{fee.programme}</td><td className="px-5 py-4">{fee.admission || '—'}</td><td className="px-5 py-4">{fee.tuition || '—'}</td><td className="px-5 py-4">{fee.stationery || '—'}</td></tr>)}</tbody></table>}</div>{scholarships.length > 0 && <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50 p-6"><h2 className="text-2xl font-black text-primary">Scholarship Information</h2>{scholarships.map((item) => <div key={item.id} className="mt-4"><h3 className="font-bold text-primary">{item.title}</h3><p className="mt-1 text-text-light">{item.description}</p></div>)}</div>}</> : <p className="rounded-lg bg-blue-50 p-4 text-center text-text-light" role="status">Fees and scholarship information will be available soon.</p>}</section></main></>;
}

import React, { useEffect, useState } from 'react';
import { collection, deleteDoc, doc, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../../firebase/config';
import AdminLayout from '../../components/AdminLayout';
import PageTitle from '../../components/PageTitle';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function ManageAlumni() {
  const [alumni, setAlumni] = useState([]); const [loading, setLoading] = useState(true);
  useEffect(() => { getDocs(query(collection(db, 'alumniRegistrations'), orderBy('createdAt', 'desc'))).then((snap) => setAlumni(snap.docs.map((item) => ({ id: item.id, ...item.data() })))).catch(console.error).finally(() => setLoading(false)); }, []);
  const remove = async (item) => { if (!window.confirm(`Delete ${item.name}'s registration?`)) return; await deleteDoc(doc(db, 'alumniRegistrations', item.id)); setAlumni((items) => items.filter((entry) => entry.id !== item.id)); };
  return <AdminLayout><PageTitle>Alumni Registrations</PageTitle>{loading ? <LoadingSpinner label="Loading alumni registrations" /> : <div className="mt-5 overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm"><table className="min-w-full divide-y divide-slate-200"><thead className="bg-slate-50"><tr>{['Name', 'Graduation', 'Contact', 'Interest', 'Actions'].map((heading) => <th key={heading} className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">{heading}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{alumni.length === 0 ? <tr><td colSpan="5" className="p-8 text-center text-slate-500">No alumni registrations yet.</td></tr> : alumni.map((item) => <tr key={item.id}><td className="px-5 py-4 font-bold text-darkgray">{item.name}<p className="text-xs font-normal text-slate-500">{item.programme}</p></td><td className="px-5 py-4 text-sm">{item.graduationYear || '—'}</td><td className="px-5 py-4 text-sm">{item.email}<br />{item.phone}</td><td className="max-w-xs px-5 py-4 text-sm text-slate-600">{item.interest || '—'}</td><td className="px-5 py-4"><button onClick={() => remove(item)} className="font-bold text-red-600 hover:underline">Delete</button></td></tr>)}</tbody></table></div>}</AdminLayout>;
}

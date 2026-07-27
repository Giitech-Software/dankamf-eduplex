import React, { useEffect, useState } from 'react';
import { collection, doc, getDocs, orderBy, query, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import AdminLayout from '../../components/AdminLayout';
import PageTitle from '../../components/PageTitle';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function InterviewRequests() {
  const [requests, setRequests] = useState([]); const [loading, setLoading] = useState(true);
  useEffect(() => { getDocs(query(collection(db, 'interviewRequests'), orderBy('createdAt', 'desc'))).then((snap) => setRequests(snap.docs.map((item) => ({ id: item.id, ...item.data() })))).catch(console.error).finally(() => setLoading(false)); }, []);
  const updateStatus = async (id, status) => { await updateDoc(doc(db, 'interviewRequests', id), { status }); setRequests((items) => items.map((item) => item.id === id ? { ...item, status } : item)); };
  return <AdminLayout><PageTitle>Interview Requests</PageTitle>{loading ? <LoadingSpinner label="Loading interview requests" /> : <div className="mt-5 overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm"><table className="min-w-full divide-y divide-slate-200"><thead className="bg-slate-50"><tr>{['Applicant', 'Reference', 'Preferred slot', 'Contact', 'Status'].map((heading) => <th key={heading} className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">{heading}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{requests.length === 0 ? <tr><td colSpan="5" className="p-8 text-center text-slate-500">No interview requests yet.</td></tr> : requests.map((request) => <tr key={request.id}><td className="px-5 py-4 font-bold">{request.name}</td><td className="px-5 py-4 text-xs font-bold text-primary">{request.reference}</td><td className="px-5 py-4 text-sm">{request.preferredDate}<br />{request.preferredTime}</td><td className="px-5 py-4 text-sm">{request.email}<br />{request.phone}</td><td className="px-5 py-4"><select value={request.status || 'new'} onChange={(event) => updateStatus(request.id, event.target.value)} className="rounded-full border px-3 py-1.5 text-xs font-bold"><option value="new">New</option><option value="confirmed">Confirmed</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option></select></td></tr>)}</tbody></table></div>}</AdminLayout>;
}

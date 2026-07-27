import React, { useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { Download } from 'lucide-react';
import { db } from '../firebase/config';
import LoadingSpinner from './LoadingSpinner';

export default function DownloadCenter() {
  const [items, setItems] = useState([]); const [loading, setLoading] = useState(true);
  useEffect(() => { getDocs(query(collection(db, 'downloads'), where('published', '==', true), orderBy('createdAt', 'desc'))).then((snap) => setItems(snap.docs.map((item) => ({ id: item.id, ...item.data() })))).catch(console.error).finally(() => setLoading(false)); }, []);
  if (!loading && items.length === 0) return null;
  return <section id="downloads" className="bg-background-alt px-4 py-16 sm:px-8"><div className="mx-auto max-w-7xl"><div className="mb-8"><p className="text-xs font-black uppercase tracking-[0.22em] text-accent">Resources</p><h2 className="mt-2 text-3xl font-black text-darkgray sm:text-4xl">Download Center</h2><p className="mt-3 max-w-2xl text-text-light">Access prospectuses, forms, calendars, policies, and other school resources.</p></div>{loading ? <LoadingSpinner label="Loading resources" /> : <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{items.map((item) => <a key={item.id} href={item.url} target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg"><div><p className="text-xs font-bold uppercase tracking-wider text-accent">{item.category}</p><h3 className="mt-1 font-bold text-primary">{item.title}</h3><p className="mt-1 truncate text-xs text-slate-500">{item.fileName}</p></div><Download className="h-5 w-5 shrink-0 text-accent" /></a>)}</div>}</div></section>;
}

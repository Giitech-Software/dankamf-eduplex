import React, { useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { db } from '../firebase/config';

export default function LeadershipSection() {
  const [leaders, setLeaders] = useState([]);
  useEffect(() => { getDocs(query(collection(db, 'leadership'), where('published', '==', true), orderBy('order', 'asc'))).then((snap) => setLeaders(snap.docs.map((item) => ({ id: item.id, ...item.data() })))).catch(console.error); }, []);
  if (!leaders.length) return null;
  return <section className="mt-10 not-prose"><h2 className="mb-6 text-3xl font-black text-primary">Leadership Team</h2><div className="grid gap-5 sm:grid-cols-2">{leaders.map((leader) => <article key={leader.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">{leader.imageUrl && <img src={leader.imageUrl} alt={leader.name} className="h-56 w-full object-cover" loading="lazy" />}<div className="p-5"><h3 className="text-xl font-black text-primary">{leader.name}</h3><p className="mt-1 text-sm font-bold uppercase tracking-wider text-accent">{leader.role}</p><p className="mt-3 text-sm leading-relaxed text-text-light">{leader.bio}</p></div></article>)}</div></section>;
}

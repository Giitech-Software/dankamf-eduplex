import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Link } from 'react-router-dom';

const previewBio = (bio = '') => {
  const sentences = bio.replace(/[#*_`]/g, '').split(/(?<=[.!?])\s+/).filter(Boolean);
  return sentences.slice(0, 2).join(' ');
};

export default function LeadershipSection() {
  const [leaders, setLeaders] = useState([]);
  useEffect(() => { getDocs(collection(db, 'leadership')).then((snap) => setLeaders(snap.docs.map((item) => ({ id: item.id, ...item.data() })).filter((item) => item.published !== false).sort((a, b) => (Number(a.order) || 9999) - (Number(b.order) || 9999)))).catch(console.error); }, []);
  const seniorLeaders = leaders.filter((leader) => /proprietor|headteacher|principal|director|administrator|deputy|coordinator|manager/i.test(leader.role || '')).slice(0, 4);
  if (!seniorLeaders.length) return null;
  return <section className="mt-10 not-prose"><h2 className="mb-2 text-3xl font-black text-primary">Leadership Team</h2><p className="mb-6 text-sm text-text-light">Meet the senior leaders guiding Dankamf Educational Complex.</p><div className="grid gap-5 sm:grid-cols-2">{seniorLeaders.map((leader) => <Link id={`leader-${leader.id}`} key={leader.id} to={`/staff#staff-${leader.id}`} className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-cobalt/40 hover:shadow-xl">{leader.imageUrl && <div className="flex h-56 w-full items-center justify-center bg-slate-100"><img src={leader.imageUrl} alt={leader.name} className="h-full w-full object-contain" loading="lazy" /></div>}<div className="p-5"><h3 className="text-xl font-black text-primary group-hover:text-cobalt">{leader.name}</h3><p className="mt-1 text-sm font-bold uppercase tracking-wider text-accent">{leader.role}</p><p className="mt-3 line-clamp-2 text-sm leading-relaxed text-text-light">{previewBio(leader.bio)}</p><span className="mt-3 inline-flex text-xs font-black uppercase tracking-wider text-cobalt">View full profile →</span></div></Link>)}</div></section>;
}

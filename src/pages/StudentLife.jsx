import React, { useEffect, useMemo, useState } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { db } from '../firebase/config';
import Seo from '../components/Seo';
import LoadingSpinner from '../components/LoadingSpinner';
import ReactMarkdown from 'react-markdown';

const categories = ['All', 'Clubs', 'Sports', 'STEM', 'Arts', 'Leadership'];
const categoryTerms = { Clubs: ['club', 'clubs'], Sports: ['sport', 'sports', 'athletics', 'games'], STEM: ['stem', 'robot', 'coding', 'science', 'technology'], Arts: ['art', 'arts', 'music', 'creative', 'culture'], Leadership: ['leadership', 'leader', 'service', 'student council'] };
const getImageUrl = (item) => item.imageUrl || item.image || item.imageURL || '';

export default function StudentLife() {
  const [projects, setProjects] = useState([]); const [active, setActive] = useState('All'); const [loading, setLoading] = useState(true);
  useEffect(() => { getDocs(query(collection(db, 'projects'), orderBy('timestamp', 'desc'))).then((snap) => setProjects(snap.docs.map((item) => ({ id: item.id, ...item.data() })))).catch(console.error).finally(() => setLoading(false)); }, []);
  const filtered = useMemo(() => {
    if (active === 'All') return projects;
    const wanted = active.toLowerCase();
    const terms = categoryTerms[active] || [wanted];
    return projects.filter((item) => {
      const searchable = `${item.category || ''} ${item.title || ''} ${item.description || ''}`.toLowerCase();
      return terms.some((term) => searchable.includes(term));
    });
  }, [active, projects]);
  return <><Seo title="Student Life | Dankamf Educational Complex" description="Discover clubs, sports, STEM, arts, leadership, and activities at Dankamf Educational Complex." /><main className="min-h-screen bg-background-alt"><section className="bg-primary-dark px-4 py-14 text-center text-white sm:px-8"><p className="text-xs font-black uppercase tracking-[0.25em] text-accent-yellow">Beyond the Classroom</p><h1 className="mt-3 text-4xl font-black sm:text-5xl">Student Life</h1><p className="mx-auto mt-4 max-w-2xl text-slate-300">A vibrant environment where learners discover passions, build confidence, and lead with purpose.</p></section><section className="px-4 py-12 sm:px-8"><div className="mx-auto max-w-7xl"><div className="mb-8 flex flex-wrap gap-2">{categories.map((category) => <button key={category} onClick={() => setActive(category)} className={`rounded-full px-4 py-2 text-sm font-bold transition ${active === category ? 'bg-primary text-white' : 'bg-white text-primary ring-1 ring-slate-200 hover:bg-blue-50'}`}>{category}</button>)}</div>{loading ? <LoadingSpinner label="Loading student life" /> : filtered.length === 0 ? <p className="py-12 text-center text-text-light">No published activities match <strong>{active}</strong> yet.</p> : <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{filtered.map((item) => <Link key={item.id} to={`/projects#project-${item.id}`} className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">{getImageUrl(item) ? <img src={getImageUrl(item)} alt={item.title} loading="lazy" decoding="async" className="h-52 w-full object-cover transition duration-500 group-hover:scale-105" /> : <div className="flex h-52 items-center justify-center bg-blue-50 text-sm font-bold text-primary">Dankamf Student Life</div>}<div className="p-5"><p className="text-xs font-bold uppercase tracking-wider text-accent">{item.category || 'Student Life'}</p><h2 className="mt-2 text-xl font-black text-primary">{item.title}</h2><div className="prose prose-sm mt-2 line-clamp-3 max-w-none text-text-light"><ReactMarkdown>{item.description}</ReactMarkdown></div><span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-accent">Explore <ArrowRight className="h-4 w-4" /></span></div></Link>)}</div>}</div></section></main></>;
}

import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { Search as SearchIcon } from 'lucide-react';
import { db } from '../firebase/config';
import LoadingSpinner from '../components/LoadingSpinner';

const staticPages = [
  { title: 'About Us', description: 'Our history, mission, vision, and values.', path: '/about', type: 'Page' },
  { title: 'Academics', description: 'Explore our programmes and curriculum.', path: '/services', type: 'Page' },
  { title: 'Admissions', description: 'Apply to Dankamf Educational Complex.', path: '/jobs', type: 'Page' },
  { title: 'Contact Us', description: 'Get in touch with our school team.', path: '/contact', type: 'Page' },
  { title: 'Campus Gallery', description: 'Explore life and learning at Dankamf.', path: '/gallery', type: 'Page' },
];

export default function Search() {
  const [params, setParams] = useSearchParams();
  const [term, setTerm] = useState(params.get('q') || '');
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all(['posts', 'events', 'projects', 'downloads'].map((name) => getDocs(collection(db, name))))
      .then(([posts, events, projects, downloads]) => {
        const map = (snapshot, type, path) => snapshot.docs.map((item) => {
          const data = item.data();
          return { id: item.id, title: data.title || data.fileName, description: data.description || data.content || data.category || '', type, path: typeof path === 'function' ? path(item.id) : path };
        });
        setRecords([...staticPages, ...map(posts, 'News', (id) => `/blog#post-${id}`), ...map(events, 'Event', '/#events'), ...map(projects, 'School Life', (id) => `/projects#project-${id}`), ...map(downloads, 'Resource', '/downloads')]);
      })
      .catch((error) => console.error('Search index error:', error))
      .finally(() => setLoading(false));
  }, []);

  const results = useMemo(() => {
    const query = term.trim().toLowerCase();
    if (!query) return [];
    return records.filter((record) => `${record.title} ${record.description} ${record.type}`.toLowerCase().includes(query));
  }, [records, term]);

  const submit = (event) => { event.preventDefault(); setParams(term.trim() ? { q: term.trim() } : {}); };

  return <main className="min-h-screen bg-background-alt px-4 py-12 sm:px-8"><div className="mx-auto max-w-5xl"><div className="text-center"><p className="text-xs font-black uppercase tracking-[0.25em] text-accent">Dankamf Search</p><h1 className="mt-3 text-4xl font-black text-primary sm:text-5xl">Search the School</h1><form onSubmit={submit} className="mx-auto mt-7 flex max-w-2xl gap-2"><input value={term} onChange={(event) => setTerm(event.target.value)} placeholder="Search pages, news, events, projects, resources…" aria-label="Search the website" className="min-w-0 flex-1 rounded-full border border-slate-300 bg-white px-5 py-3 text-darkgray outline-none focus:ring-2 focus:ring-primary" /><button className="rounded-full bg-accent-yellow px-5 py-3 text-darkgray hover:bg-accent-yellow-dark" aria-label="Submit search"><SearchIcon className="h-5 w-5" /></button></form></div><div className="mt-10">{loading ? <LoadingSpinner label="Building search results" /> : !term.trim() ? <p className="text-center text-text-light">Enter a search term to find information across the school website.</p> : results.length === 0 ? <p className="text-center text-text-light">No results found for “{term}”.</p> : <div className="grid gap-4 sm:grid-cols-2">{results.map((result) => <Link key={`${result.type}-${result.id || result.path}`} to={result.path} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg"><p className="text-xs font-bold uppercase tracking-wider text-accent">{result.type}</p><h2 className="mt-2 text-xl font-black text-primary">{result.title}</h2><p className="mt-2 line-clamp-2 text-sm leading-relaxed text-text-light">{result.description}</p></Link>)}</div>}</div></div></main>;
}

import React, { useEffect, useState } from 'react';
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';
import { BriefcaseBusiness, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { db } from '../firebase/config';
import ReactMarkdown from 'react-markdown';

export default function VacancyPreview() {
  const [vacancies, setVacancies] = useState([]);
  useEffect(() => {
    getDocs(query(collection(db, 'jobs'), orderBy('postedAt', 'desc'), limit(3)))
      .then((snapshot) => setVacancies(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })).filter((job) => job.published !== false)))
      .catch((error) => console.error('Unable to load vacancy preview:', error));
  }, []);
  if (!vacancies.length) return null;
  return <section className="bg-white px-4 py-12 sm:px-8"><div className="mx-auto max-w-7xl"><div className="mb-7 flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><p className="text-xs font-black uppercase tracking-[0.22em] text-accent">Join Our Team</p><h2 className="mt-2 text-3xl font-black text-primary">Current Vacancies</h2></div><Link to="/careers" className="inline-flex items-center gap-2 text-sm font-bold text-accent hover:text-primary">View all careers <ArrowRight className="h-4 w-4" /></Link></div><div className="grid gap-4 md:grid-cols-3">{vacancies.map((job) => <Link key={job.id} to={`/jobs/${job.id}`} className="group rounded-xl border border-slate-200 bg-slate-50 p-5 transition hover:-translate-y-1 hover:border-accent/40 hover:bg-white hover:shadow-lg"><BriefcaseBusiness className="h-6 w-6 text-accent" /><h3 className="mt-4 text-lg font-black text-primary group-hover:text-accent">{job.title}</h3><div className="prose prose-sm mt-2 line-clamp-2 max-h-12 max-w-none overflow-hidden text-text-light"><ReactMarkdown>{job.description || 'View the vacancy details and application requirements.'}</ReactMarkdown></div><span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-accent">View and apply <ArrowRight className="h-4 w-4" /></span></Link>)}</div></div></section>;
}

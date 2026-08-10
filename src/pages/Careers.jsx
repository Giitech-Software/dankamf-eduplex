import React, { useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { ArrowRight, BriefcaseBusiness, MapPin } from 'lucide-react';
import { db } from '../firebase/config';
import Seo from '../components/Seo';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Careers() {
  const [vacancies, setVacancies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDocs(query(collection(db, 'jobs'), orderBy('postedAt', 'desc')))
      .then((snapshot) => setVacancies(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })).filter((job) => job.published !== false)))
      .catch((error) => console.error('Unable to load vacancies:', error))
      .finally(() => setLoading(false));
  }, []);

  return <>
    <Seo title="Jobs & Vacancies | Dankamf Educational Complex" description="Explore teaching, administrative, and support job opportunities at Dankamf Educational Complex in Oyibi, Greater Accra." path="/jobs" />
    <main className="min-h-screen bg-background-alt">
      <section className="bg-electric-blue px-4 py-6 text-primary sm:px-8 sm:py-8">
        <div className="mx-auto max-w-5xl text-center"><p className="text-xs font-black uppercase tracking-[0.25em]">Work With Dankamf</p><h1 className="mt-2 text-3xl font-black sm:text-4xl">Careers &amp; Vacancies</h1><p className="mx-auto mt-2 max-w-2xl text-sm leading-relaxed text-primary/80 sm:text-base">Join a purpose-driven school community committed to excellence in learning and character.</p></div>
      </section>
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-8 sm:py-14">
        {loading ? <LoadingSpinner label="Loading vacancies" /> : vacancies.length === 0 ? <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center"><BriefcaseBusiness className="mx-auto h-10 w-10 text-accent" /><h2 className="mt-4 text-2xl font-black text-primary">No current vacancies</h2><p className="mt-2 text-text-light">Please check again soon or send an enquiry through our contact page.</p><Link to="/contact" className="mt-6 inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white">Contact the School</Link></div> : <div className="grid gap-5 md:grid-cols-2">{vacancies.map((job) => <article key={job.id} className="flex flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-accent/40 hover:shadow-lg"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-wider text-accent">{job.type || 'School position'}</p><h2 className="mt-2 text-xl font-black text-primary">{job.title}</h2></div><BriefcaseBusiness className="h-6 w-6 shrink-0 text-accent" /></div><p className="mt-4 flex items-center gap-2 text-sm font-semibold text-text-light"><MapPin className="h-4 w-4 text-accent" />{job.location || 'Dankamf Educational Complex, Oyibi'}</p><p className="mt-4 line-clamp-3 leading-relaxed text-text-light">{job.description || 'View the full vacancy details and application requirements.'}</p><Link to={`/jobs/${job.id}`} className="mt-6 inline-flex items-center gap-2 text-sm font-black text-accent hover:text-primary">View Vacancy &amp; Apply <ArrowRight className="h-4 w-4" /></Link></article>)}</div>}
      </section>
    </main>
  </>;
}

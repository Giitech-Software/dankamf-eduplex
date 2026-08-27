import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { FaBookReader, FaChild, FaSchool, FaUserGraduate } from 'react-icons/fa';
import { db } from '../firebase/config';
import LoadingSpinner from './LoadingSpinner';
import ReactMarkdown from 'react-markdown';

const fallbackIcon = (title = '') => {
  const value = title.toLowerCase();
  if (value.includes('creche') || value.includes('nursery') || value.includes('preschool')) return <FaChild />;
  if (value.includes('jhs') || value.includes('junior')) return <FaUserGraduate />;
  if (value.includes('primary')) return <FaBookReader />;
  return <FaSchool />;
};

const slugify = (title = '') => title.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

function ProgrammeImage({ service }) {
  return (
    <div className="h-72 w-full min-w-0 overflow-hidden bg-slate-100 sm:h-[22rem] lg:h-[24rem]">
      {(service.imageUrl || service.iconUrl) ? (
        <img src={service.imageUrl || service.iconUrl} alt="" loading="lazy" className="block h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
      ) : (
        <span className="flex h-full items-center justify-center text-5xl text-primary">{fallbackIcon(service.title)}</span>
      )}
    </div>
  );
}

export default function ServiceGrid() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDocs(collection(db, 'services'))
      .then((snapshot) => setServices(snapshot.docs.map((serviceDoc) => ({ id: serviceDoc.id, ...serviceDoc.data() })).sort((a, b) => (Number(a.order) || 9999) - (Number(b.order) || 9999)).slice(0, 4)))
      .catch((error) => console.error('Error loading homepage academic programmes:', error))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="bg-gradient-to-b from-[#f8fcff] to-[#eaf6ff] px-0 py-16 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 max-w-3xl px-4 sm:px-0">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-accent sm:text-sm sm:tracking-[0.3em]">Our Academics</p>
          <h3 className="mt-2 text-2xl font-black tracking-tight text-primary-dark sm:text-4xl">Programmes &amp; Curriculum</h3>
          <p className="mt-3 text-base leading-relaxed text-text-light">A structured and engaging learning path designed to inspire excellence at every level of education.</p>
        </div>

        {loading ? <LoadingSpinner label="Loading academic programmes" /> : services.length === 0 ? (
          <p className="px-4 text-text-light">Academic programmes will be published soon.</p>
        ) : (
          <div className="grid gap-5 px-4 sm:grid-cols-2 sm:gap-7 sm:px-0">
            {services.map((service) => (
              <Link key={service.id} to={`/academics/${slugify(service.title)}`} className="academic-preview-card group flex min-w-0 cursor-pointer flex-col overflow-hidden border border-slate-200 bg-white transition-all duration-500 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl">
                <ProgrammeImage service={service} />
                <div className="flex flex-1 flex-col space-y-3 p-4 sm:p-5">
                  <h4 className="text-xl font-bold leading-tight text-slate-900 transition-colors group-hover:text-primary sm:text-2xl">{service.title}</h4>
                  <div className="prose prose-sm line-clamp-3 max-h-[5.5rem] max-w-none overflow-hidden text-base leading-relaxed text-slate-600 sm:prose-base"><ReactMarkdown>{service.description || 'Explore this academic programme and its learning pathway.'}</ReactMarkdown></div>
                  <span className="flex items-center pt-3 text-sm font-black uppercase tracking-[0.16em] text-accent transition-opacity sm:opacity-0 sm:group-hover:opacity-100">View programme &rarr;</span>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-8 px-4 text-center sm:px-0">
          <Link to="/academics" className="inline-flex items-center justify-center rounded-full bg-accent-yellow px-4 py-2 text-xs font-black uppercase tracking-widest text-darkgray shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-accent-yellow-dark hover:shadow-xl">Explore All Programmes</Link>
        </div>
      </div>
    </section>
  );
}

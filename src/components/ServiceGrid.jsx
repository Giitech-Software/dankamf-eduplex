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
    <div className="box-border flex h-48 min-w-0 max-w-full shrink-0 items-center justify-center overflow-hidden bg-slate-100 sm:h-56 sm:w-full lg:h-64">
      {(service.imageUrl || service.iconUrl) ? (
        <img src={service.imageUrl || service.iconUrl} alt="" loading="lazy" className="block h-full max-w-full w-full object-contain transition-transform duration-500 group-hover:scale-105" />
      ) : (
        <span className="text-5xl text-primary">{fallbackIcon(service.title)}</span>
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
          <div className="grid gap-3 px-4 sm:grid-cols-2 sm:gap-4 sm:px-0">
            {services.map((service) => (
              <Link key={service.id} to={`/academics/${slugify(service.title)}`} className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-white/80 bg-white/60 shadow-lg shadow-[#003153]/10 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-cerulean/60 hover:bg-white/80 hover:shadow-xl">
                <ProgrammeImage service={service} />
                <div className="p-4 sm:p-5">
                  <h4 className="mb-2 text-base font-bold text-slate-950 sm:text-lg">{service.title}</h4>
                  <div className="prose prose-sm line-clamp-3 max-w-none text-text-light sm:prose-base"><ReactMarkdown>{service.description || 'Explore this academic programme and its learning pathway.'}</ReactMarkdown></div>
                  <span className="mt-3 inline-flex text-sm font-bold text-accent">View programme →</span>
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

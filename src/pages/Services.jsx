//path: src/pages/Services.jsx
import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { db } from '../firebase/config';

import Seo from '../components/Seo';
import SeoConfig from '../config/SeoConfig';
import LoadingSpinner from '../components/LoadingSpinner';
import ReactMarkdown from 'react-markdown';

const getServiceSlug = (title = '') => title
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/(^-|-$)/g, '');

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'services'));
        setServices(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a, b) => (Number(a.order) || 9999) - (Number(b.order) || 9999)));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <Seo {...SeoConfig.services} />
      <div className="min-h-screen bg-gradient-to-b from-[#f8fcff] to-[#eaf6ff] px-0 py-8 text-slate-900 sm:px-5 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 px-4 sm:px-0">
            <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Academic Programs
            </h1>
            <div className="w-20 h-1.5 bg-accent mt-3 rounded-full"></div>
            <p className="mt-3 text-text-light text-base leading-relaxed max-w-3xl">Our curriculum is designed to foster intellectual curiosity and a love for learning at every stage, from foundational skills to advanced studies.</p>
          </div>
          
          {loading ? (
            <LoadingSpinner label="Loading services" />
          ) : (
          <div className="grid gap-3 px-4 sm:gap-6 sm:px-0 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => {
                return (
                <Link
                  key={service.id}
                  to={`/academics/${getServiceSlug(service.title)}`}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-white/80 bg-white/60 shadow-lg shadow-[#003153]/10 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-cerulean/60 hover:bg-white/80 hover:shadow-xl"
                >
                  <div className="mb-4 flex h-48 items-center justify-center overflow-hidden bg-slate-100 sm:h-56">
                    {(service.imageUrl || service.iconUrl) ? <img src={service.imageUrl || service.iconUrl} alt="" loading="lazy" className="h-full w-full object-contain p-2" /> : <span className="text-5xl text-primary">{service.icon}</span>}
                  </div>
                  <div className="px-4 pb-5 sm:px-5"><h2 className="text-xl font-bold text-slate-900 mb-3 leading-tight group-hover:text-primary transition-colors">
                    {service.title}
                  </h2>
                  <div className="prose prose-sm line-clamp-4 max-h-24 max-w-none flex-1 overflow-hidden text-text-light sm:prose-base">
                    <ReactMarkdown>{service.description || 'Explore this academic programme and its learning pathway.'}</ReactMarkdown>
                  </div>
                  <div className="mt-4 flex min-h-11 items-center gap-2 text-sm font-black uppercase tracking-widest text-accent transition-all">
                    View Program <span className="text-xs transition-transform group-hover:translate-x-1">-&gt;</span>
                  </div></div>
                </Link>
              );
            })}
          </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Services;

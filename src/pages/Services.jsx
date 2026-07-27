//path: src/pages/Services.jsx
import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { db } from '../firebase/config';

import Seo from '../components/Seo';
import SeoConfig from '../config/SeoConfig';
import LoadingSpinner from '../components/LoadingSpinner';

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
        setServices(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const truncateText = (text, limit) => {
    if (!text) return '';
    return text.length > limit ? text.substring(0, limit) + '...' : text;
  };

  return (
    <>
      <Seo {...SeoConfig.services} />
      
      <div className="min-h-screen bg-white px-0 py-8 text-slate-900 sm:px-5 lg:px-12">
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
            {services.map((service, idx) => {
              const previewText = truncateText(service.description, 180);
              return (
                <Link
                  key={service.id}
                  to={`/academics/${getServiceSlug(service.title)}`}
                  className="group flex flex-col rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 hover:border-accent hover:shadow-lg sm:p-5"
                >
                  <div className="text-3xl mb-4">{service.icon}</div>
                  <h2 className="text-xl font-bold text-slate-900 mb-3 leading-tight group-hover:text-primary transition-colors">
                    {service.title}
                  </h2>
                  <p className="text-[1rem] text-text-light leading-relaxed flex-1">
                    {previewText}
                  </p>
                  <div className="mt-4 flex min-h-11 items-center gap-2 text-sm font-black uppercase tracking-widest text-accent transition-all">
                    View Program <span className="text-xs transition-transform group-hover:translate-x-1">-&gt;</span>
                  </div>
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

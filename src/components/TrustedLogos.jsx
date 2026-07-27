import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase/config';
import { motion } from 'framer-motion';
import LoadingSpinner from './LoadingSpinner';

export default function TrustedLogos() {
  const [logos, setLogos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogos = async () => {
      try {
        const q = query(collection(db, 'partners'), orderBy('timestamp', 'desc'));
        const snap = await getDocs(q);
        setLogos(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching logos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLogos();
  }, []);

  if (!loading && logos.length === 0) return null;

  return (
    <section className="bg-white px-0 py-8 sm:px-5">
      <div className="max-w-7xl mx-auto">
        {/* Header: Centered, Clean, and Authoritative */}
        <div className="mb-6 flex flex-col items-center px-4 sm:px-0">
          <h2 className="mb-3 text-center text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
            Accreditation & <span className="text-primary">Affiliations</span>
          </h2>
          <div className="h-1.5 w-20 bg-primary rounded-full mb-4"></div>
          <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-slate-400 sm:text-sm sm:tracking-[0.3em]">
            Recognized by Leading Educational Bodies
          </p>
        </div>
        
        {loading ? (
          <LoadingSpinner label="Loading partners" />
        ) : (
        /* Grid: Balanced spacing with high-resolution rendering */
        <div className="grid grid-cols-2 gap-2 px-4 sm:gap-3 sm:px-0 md:grid-cols-4">
          {logos.map((logo) => (
            <motion.div
              key={logo.id}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="group flex h-24 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 p-2 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:bg-white hover:shadow-lg md:h-28"
            >
              {logo.imageUrl ? (
                <img
                  src={logo.imageUrl}
                  alt={logo.name || "Partner Logo"}
                  className="max-h-16 w-full object-contain transition-transform duration-300 group-hover:scale-105 md:max-h-20"
                />
              ) : (
                <span className="select-none text-center text-xl font-black uppercase tracking-tight text-slate-300 md:text-2xl">
                  {logo.name}
                </span>
              )}
            </motion.div>
          ))}
        </div>
        )}
      </div>
    </section>
  );
}

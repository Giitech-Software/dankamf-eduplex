import React, { useEffect, useState } from 'react';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '../firebase/config';
import { motion } from 'framer-motion';
import LoadingSpinner from './LoadingSpinner';

export default function TrustedLogos() {
  const [logos, setLogos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogos = async () => {
      try {
        const q = query(collection(db, 'partners'));
        const snap = await getDocs(q);
        setLogos(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a, b) => (Number(a.order) || 9999) - (Number(b.order) || 9999)));
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
    <section className="bg-[#f8fcff] px-0 py-10 sm:px-5">
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
          {logos.map((logo, index) => (
            <motion.div
              key={logo.id}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className={`group relative flex h-24 items-center justify-center rounded-2xl border-2 bg-white/60 p-2 shadow-lg shadow-[#003153]/10 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-white/85 hover:shadow-xl md:h-28 ${['border-[#003153]', 'border-[#007BA7]', 'border-[#4169E1]', 'border-[#0096FF]'][index % 4]}`}
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

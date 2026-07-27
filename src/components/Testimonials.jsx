// src/components/Testimonials.jsx
import React, { useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase/config';
import LoadingSpinner from './LoadingSpinner';
import { Link } from 'react-router-dom';
import { fallbackTestimonials } from '../data/clientTestimonials';

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState(fallbackTestimonials);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const q = query(collection(db, 'clientTestimonials'), orderBy('order', 'asc'));
        const snap = await getDocs(q);
        const data = snap.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(testimonial => testimonial.name && testimonial.description);

        if (data.length > 0) {
          setTestimonials(data);
        }
      } catch (error) {
        console.error('Error fetching client testimonials:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  return (
    <section className="bg-white px-0 py-16 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 px-4 sm:px-0 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-accent sm:text-sm sm:tracking-[0.3em]">
              Testimonials
            </p>
            <h3 className="mt-2 text-2xl font-black tracking-tight text-darkgray sm:text-4xl">
              From Our Community
            </h3>
          </div>
          <p className="max-w-md text-base leading-relaxed text-text-light">
            Hear from parents, students, and staff about their experience at Dankamf Eduplex.
          </p>
        </div>

        {loading ? (
          <LoadingSpinner label="Loading client testimonials" />
        ) : (
        <div className="grid gap-3 px-4 sm:gap-5 sm:px-0 md:grid-cols-2 lg:grid-cols-4">
          {testimonials.slice(0, 4).map(({ id, quote, description, imageUrl, name, role }, index) => (
            <figure key={id || name} className="rounded-lg border border-slate-200 bg-slate-50 p-4 sm:p-5">
              {imageUrl && (
                <div className="-mx-4 -mt-4 mb-4 h-56 overflow-hidden bg-white ring-1 ring-slate-200 sm:mx-0 sm:mt-0 sm:h-60 sm:rounded-lg">
                  <img
                    src={imageUrl}
                    alt={name}
                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
              )}
              <blockquote className="text-base leading-relaxed text-text-light">
                "{description || quote}"
              </blockquote>
              <figcaption className="mt-4 border-t border-slate-200 pt-3">
                <p className="font-black text-text">{name}</p>
                <p className="mt-1 text-base text-slate-500">{role}</p>
              </figcaption>
            </figure>
          ))}
        </div>
        )}
        <div className="mt-8 text-center">
          <Link
            to="/client-confidence"
            className="inline-flex rounded-lg border border-primary px-5 py-2.5 text-sm font-bold text-primary transition hover:bg-primary hover:text-white"
          >
            Read More Testimonials
          </Link>
        </div>
      </div>
    </section>
  );
}

import React, { useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { db } from '../firebase/config';
import Seo from '../components/Seo';
import SeoConfig from '../config/SeoConfig';
import LoadingSpinner from '../components/LoadingSpinner';
import { fallbackTestimonials } from '../data/clientTestimonials';

export default function ClientConfidence() {
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

        if (data.length > 0) setTestimonials(data);
      } catch (error) {
        console.error('Error fetching client testimonials:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  return (
    <>
      <Seo {...SeoConfig.clientConfidence} />
      <section className="bg-slate-950 px-4 py-14 text-white sm:px-8 sm:py-16">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-sm font-black uppercase tracking-[0.3em] text-warm">
            Testimonials
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
            Voices of Our Community
          </h1>
          <p className="mx-auto mt-4 max-w-3xl text-base leading-relaxed text-slate-200 sm:text-lg">
            Hear what parents, students, and alumni have to say about their experience
            at Dankamf Educational Complex.
          </p>
        </div>
      </section>

      <section className="bg-white px-0 py-10 sm:px-8 sm:py-14">
        <div className="mx-auto max-w-7xl">
          {loading ? (
            <LoadingSpinner label="Loading client testimonials" />
          ) : (
            <div className="grid gap-3 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.map(({ id, quote, description, imageUrl, name, role }) => (
                <figure
                  key={id || name}
                  className="border border-slate-200 bg-slate-50 p-4 transition-shadow hover:shadow-lg sm:rounded-lg sm:p-5"
                >
                  {imageUrl && (
                    <div className="-mx-4 -mt-4 mb-4 h-64 overflow-hidden bg-white ring-1 ring-slate-200 sm:mx-0 sm:mt-0 sm:h-72 sm:rounded-lg">
                      <img src={imageUrl} alt={name} className="h-full w-full object-cover" />
                    </div>
                  )}
                  <blockquote className="text-base leading-relaxed text-slate-700">
                    "{description || quote}"
                  </blockquote>
                  <figcaption className="mt-4 border-t border-slate-200 pt-3">
                    <p className="font-black text-slate-950">{name}</p>
                    <p className="mt-1 text-base text-slate-500">{role}</p>
                  </figcaption>
                </figure>
              ))}
            </div>
          )}

          <div className="mt-10 text-center">
            <Link
              to="/contact"
              className="inline-flex rounded-lg bg-warm px-6 py-3 text-base font-bold text-white shadow-lg transition hover:bg-warm-terracotta"
            >
            Contact Us for Admissions
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

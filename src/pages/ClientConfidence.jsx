import React, { useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { db } from '../firebase/config';
import Seo from '../components/Seo';
import SeoConfig from '../config/SeoConfig';
import LoadingSpinner from '../components/LoadingSpinner';
import { fallbackTestimonials } from '../data/clientTestimonials';
import ReactMarkdown from 'react-markdown';

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
    <main className="min-h-screen bg-background-alt">
      <Seo {...SeoConfig.clientConfidence} />
      <section className="bg-primary-dark px-4 py-10 text-center text-white sm:px-8 sm:py-14">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-accent-yellow">
            Testimonials
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
            Voices of Our Community
          </h1>
          <p className="mx-auto mt-4 max-w-3xl text-base leading-relaxed text-slate-300 sm:text-lg">
            Hear what parents, students, and alumni have to say about their experience
            at Dankamf Educational Complex.
          </p>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-8 sm:py-14">
        <div className="mx-auto max-w-7xl">
          {loading ? (
            <LoadingSpinner label="Loading client testimonials" />
          ) : (
            <div className="grid gap-3 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.map(({ id, quote, description, imageUrl, name, role }) => (
                <figure
                  key={id || name}
                  className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-cobalt/40 hover:shadow-xl"
                >
                  {imageUrl && (
                    <div className="flex h-56 items-center justify-center overflow-hidden bg-slate-100 sm:h-64">
                      <img src={imageUrl} alt={name} className="h-full w-full object-cover" />
                    </div>
                  )}
                  <div className="p-5">
                    <blockquote className="prose prose-sm max-w-none text-text-light sm:prose-base">
                      <ReactMarkdown>{description || quote}</ReactMarkdown>
                    </blockquote>
                  <figcaption className="mt-4 border-t border-slate-200 pt-3">
                    <p className="font-black text-primary">{name}</p>
                    <p className="mt-1 text-sm text-slate-500">{role}</p>
                  </figcaption>
                  </div>
                </figure>
              ))}
            </div>
          )}

          <div className="mt-10 text-center">
            <Link
              to="/contact"
              className="inline-flex rounded-full bg-primary px-4 py-2 text-sm font-bold text-white shadow-lg transition hover:bg-primary-dark"
            >
            Contact Us for Admissions
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

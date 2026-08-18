// components/CTABanner.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function CTABanner() {
  return (
    <section className="bg-cerulean px-0 py-8 text-white sm:px-8 sm:py-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 sm:px-0 md:flex-row md:items-center md:justify-between">
        <div className="max-w-3xl">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-accent-light sm:text-sm sm:tracking-[0.3em]">
            Begin Your Journey With Us
          </p>
          <h3 className="mt-2 text-2xl font-black tracking-tight sm:text-4xl">
            Ready to give your child the best start?
          </h3>
          <p className="mt-3 text-base leading-relaxed text-slate-300">
            Schedule a visit or contact our admissions office to learn more about our vibrant community and excellent programmes.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row md:shrink-0">
          <Link
            to="/contact"
            className="inline-flex w-full items-center justify-center rounded-full bg-accent-yellow px-4 py-2 text-xs font-black uppercase tracking-widest text-darkgray transition-all duration-300 hover:bg-accent-yellow-dark hover:shadow-xl sm:w-auto"
          >
            Get In Touch
          </Link>
          <Link
            to="/academics"
            className="inline-flex w-full items-center justify-center rounded-full border border-white/30 px-4 py-2 text-sm font-black uppercase tracking-widest text-white transition-all duration-300 hover:border-white hover:bg-white hover:text-primary-dark sm:w-auto"
          >
            Our Academics
          </Link>
        </div>
      </div>
    </section>
  );
}

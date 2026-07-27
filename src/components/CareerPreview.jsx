import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin } from 'lucide-react';
import { FaSchool } from 'react-icons/fa';
import { admissionPrograms } from '../data/careerOpenings';

export default function CareerPreview() {
  return (
    <section className="bg-accent-light px-0 py-16 text-darkgray sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-8 max-w-3xl px-4 text-center sm:px-0">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-accent sm:text-sm sm:tracking-[0.3em]">Admissions Open</p>
          <h3 className="mt-2 text-2xl font-black tracking-tight text-primary-dark sm:text-4xl">Join Our Family</h3>
          <p className="mt-3 text-base leading-relaxed text-text-light">
            We are accepting applications for the upcoming academic year. Discover the right path for your child's future.
          </p>
        </div>

        <div className="grid gap-3 px-4 sm:grid-cols-2 sm:gap-4 sm:px-0 lg:grid-cols-4">
          {admissionPrograms.slice(0, 3).map(program => (
            <article
              key={program.id}
              className="flex flex-col rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-accent/40 hover:shadow-lg"
            >
              <FaSchool className="h-7 w-7 text-accent" aria-hidden="true" />
              <h4 className="mt-4 text-lg font-black leading-snug text-primary">{program.title}</h4>
              <p className="mt-4 flex items-start gap-2 text-sm leading-relaxed text-text-light">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                {program.location}
              </p>
              <p className="mt-2 text-sm font-bold text-text-light">{program.type}</p>
              <Link
                to={`/jobs/${program.id}`}
                className="mt-auto inline-flex items-center gap-1 pt-5 text-sm font-bold text-accent transition hover:text-primary"
              >
                View Details <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </article>
          ))}
        </div>

        <div className="mt-8 px-4 text-center sm:px-0">
          <Link
            to="/jobs"
            className="inline-flex w-full justify-center rounded-full bg-accent-yellow px-5 py-2.5 text-sm font-bold text-darkgray shadow-lg transition hover:bg-accent-yellow-dark sm:w-auto"
          >
            Learn About Admissions
          </Link>
        </div>
      </div>
    </section>
  );
}

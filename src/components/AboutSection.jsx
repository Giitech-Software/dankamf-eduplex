// src/components/AboutSection.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function AboutSection() {
  return (
    <section className="bg-slate-50 px-0 py-16 sm:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="px-4 sm:px-0">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-accent sm:text-sm sm:tracking-[0.3em]">
            About Our School
          </p>
          <h3 className="mt-2 text-2xl font-black tracking-tight text-darkgray sm:text-4xl">
            A Legacy of Excellence in Education
          </h3>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-text-light">
            Dankamf Educational Complex is a private educational institution committed to providing quality, holistic education that nurtures academic excellence, discipline, creativity, moral values, and leadership among learners.
          </p>
          <Link
            to="/about"
            className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-accent-yellow px-5 py-2.5 text-xs font-black uppercase tracking-widest text-darkgray transition-all duration-300 hover:bg-accent-yellow-dark hover:shadow-lg sm:w-auto"
          >
            Discover Our Story
          </Link>
        </div>

        <div className="grid gap-3 px-4 sm:grid-cols-3 sm:gap-4 sm:px-0 lg:grid-cols-1">
          {[
            ['Our Mission', 'We provide the highest quality education in Christ-centered principles and values so that all our students are empowered to lead productive and fulfilling lives.'],
            ['Our Vision', 'To be a leader in private Education in the World by empowering our students with Godly principles and values to become productive, caring, and results-oriented leaders.'],
            ['Core Values', 'Excellence, Integrity, Equity, and Citizenship, all rooted in the fear of God.'],
          ].map(([title, text]) => (
            <div key={title} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <h4 className="text-lg font-black text-primary">{title}</h4>
              <p className="mt-2 text-base leading-relaxed text-text-light">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

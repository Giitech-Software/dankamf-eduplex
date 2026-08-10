// src/components/AboutSection.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import ReactMarkdown from 'react-markdown';

export default function AboutSection() {
  const [about, setAbout] = useState(null);
  useEffect(() => { getDoc(doc(db, 'about', 'schoolProfile')).then((snap) => { if (snap.exists()) setAbout(snap.data()); }).catch(console.error); }, []);
  return (
    <section className="bg-powder-blue/30 px-0 py-16 sm:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="px-4 sm:px-0">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-accent sm:text-sm sm:tracking-[0.3em]">
            About Our School
          </p>
          <h3 className="mt-2 text-2xl font-black tracking-tight text-darkgray sm:text-4xl">
            A Legacy of Excellence in Education
          </h3>
          <div className="prose prose-sm line-clamp-3 max-h-[5.5rem] max-w-3xl overflow-hidden leading-relaxed text-text-light sm:prose-base">
            <ReactMarkdown>{about?.history || 'Dankamf Educational Complex is a private educational institution committed to providing quality, holistic education that nurtures academic excellence, discipline, creativity, moral values, and leadership among learners.'}</ReactMarkdown>
          </div>
        </div>

        <div className="grid gap-3 px-4 sm:grid-cols-3 sm:gap-4 sm:px-0 lg:grid-cols-1">
          {[
            ['Our Mission', about?.mission || 'We provide the highest quality education in Christ-centered principles and values so that all our students are empowered to lead productive and fulfilling lives.'],
            ['Our Vision', about?.vision || 'To be a leader in private Education by empowering our students with Godly principles and values to become productive, caring, and results-oriented leaders.'],
            ['Core Values', about?.values || 'Excellence, Integrity, Equity, and Citizenship, all rooted in the fear of God.'],
          ].map(([title, text]) => (
            <div key={title} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <h4 className="text-lg font-black text-primary">{title}</h4>
              <div className="prose prose-sm line-clamp-3 max-h-[5.5rem] overflow-hidden leading-relaxed text-text-light sm:prose-base"><ReactMarkdown>{text}</ReactMarkdown></div>
            </div>
          ))}
          <Link to="/about" className="inline-flex w-full items-center justify-center rounded-full bg-accent-yellow px-4 py-2 text-xs font-black uppercase tracking-widest text-darkgray transition-all duration-300 hover:bg-accent-yellow-dark hover:shadow-lg sm:col-span-3 lg:col-span-1">
            Read More
          </Link>
        </div>
      </div>
    </section>
  );
}

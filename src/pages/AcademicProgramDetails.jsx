import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import Seo from '../components/Seo';
import SeoConfig from '../config/SeoConfig';
import LoadingSpinner from '../components/LoadingSpinner';
import ReactMarkdown from 'react-markdown';
import { BookOpen, CheckCircle, FlaskConical } from 'lucide-react';

const getServiceSlug = (title = '') => title
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/(^-|-$)/g, '');

export default function AcademicProgramDetails() {
  const { slug } = useParams();
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgram = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'services'));
        const services = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const foundProgram = services.find(service => getServiceSlug(service.title) === slug);
        setProgram(foundProgram || false);
      } catch (error) {
        console.error("Error fetching academic program:", error);
        setProgram(false);
      } finally {
        setLoading(false);
      }
    };

    fetchProgram();
  }, [slug]);

  if (loading) {
    return <LoadingSpinner label="Loading Program Details" fullPage />;
  }

  if (program === false) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-3xl font-black text-primary">Programme Not Found</h1>
        <Link to="/academics" className="mt-6 inline-flex text-accent hover:underline">
          &larr; Back to Academics
        </Link>
      </main>
    );
  }

  const excerpt = program.description?.slice(0, 150) || `Details about our ${program.title} program.`;

  return (
    <>
      <Seo {...SeoConfig.dynamic.academicProgram({ title: program.title, excerpt, slug })} />

      <section className="border-b border-slate-200 bg-white px-4 py-7 text-primary-dark sm:px-8 sm:py-9">
        <div className="mx-auto max-w-5xl">
          <Link to="/academics" className="inline-flex rounded-full border border-blue-200 px-3 py-1.5 text-xs font-bold text-primary transition hover:border-primary hover:bg-blue-50">
            &larr; Back to All Programmes
          </Link>
          <p className="mt-5 text-xs font-black uppercase tracking-[0.22em] text-accent">Academic Programme</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">{program.title}</h1>
        </div>
      </section>

      <main className="min-h-screen bg-background-alt px-4 py-8 sm:px-8 sm:py-12">
        <div className="mx-auto w-full max-w-5xl space-y-6">
          {(program.imageUrl || program.iconUrl) && <div className="flex h-80 max-h-[34rem] min-h-64 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-sm sm:h-[30rem] lg:h-[34rem]"><img src={program.imageUrl || program.iconUrl} alt={program.title} className="h-full w-full object-cover" /></div>}
          {/* Programme Details */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
            <h2 className="mb-4 flex items-center gap-3 text-2xl font-bold text-primary">
              <BookOpen size={24} /> Programme Details
            </h2>
            <div className="prose prose-base max-w-none sm:prose-lg">
              <ReactMarkdown>{program.description || 'Programme information will be published soon.'}</ReactMarkdown>
            </div>
          </section>

          {/* Core Subjects */}
          {program.subjects && program.subjects.length > 0 && (
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
              <h2 className="mb-4 flex items-center gap-3 text-2xl font-bold text-primary">
                <CheckCircle size={24} /> Core Subjects
              </h2>
              <ul className="grid grid-cols-2 md:grid-cols-3 gap-3 text-text-light">
                {program.subjects.map((subject, index) => (
                  <li key={index} className="flex items-center gap-2 p-2 bg-background-alt rounded-md">
                    <CheckCircle size={16} className="text-accent" /> {subject}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Learning Resources */}
          {program.learningResources && (
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
              <h2 className="mb-4 flex items-center gap-3 text-2xl font-bold text-primary">
                <FlaskConical size={24} /> Learning Resources
              </h2>
              <div className="prose prose-lg max-w-none">
                <ReactMarkdown>{program.learningResources}</ReactMarkdown>
              </div>
            </section>
          )}

          {program.curriculum && (
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
              <h2 className="mb-4 flex items-center gap-3 text-2xl font-bold text-primary"><BookOpen size={24} /> Curriculum</h2>
              <div className="prose prose-lg max-w-none"><ReactMarkdown>{program.curriculum}</ReactMarkdown></div>
            </section>
          )}

          {program.assessment && (
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
              <h2 className="mb-4 flex items-center gap-3 text-2xl font-bold text-primary"><CheckCircle size={24} /> Assessment</h2>
              <div className="prose prose-lg max-w-none"><ReactMarkdown>{program.assessment}</ReactMarkdown></div>
            </section>
          )}

          {program.timetable && (
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
              <h2 className="mb-4 text-2xl font-bold text-primary">Timetable & Academic Calendar</h2>
              <div className="prose prose-lg max-w-none"><ReactMarkdown>{program.timetable}</ReactMarkdown></div>
            </section>
          )}
        </div>
      </main>
    </>
  );
}

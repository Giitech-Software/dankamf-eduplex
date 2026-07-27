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
        <h1 className="text-3xl font-black text-primary">Program Not Found</h1>
        <Link to="/services" className="mt-6 inline-flex text-accent hover:underline">
          &larr; Back to Academics
        </Link>
      </main>
    );
  }

  const excerpt = program.description?.slice(0, 150) || `Details about our ${program.title} program.`;

  return (
    <>
      <Seo {...SeoConfig.dynamic.academicProgram({ title: program.title, excerpt, slug })} />

      <section className="bg-primary-dark px-4 py-12 text-white sm:px-8 sm:py-16">
        <div className="mx-auto max-w-4xl">
          <Link to="/services" className="text-sm font-bold text-highlight transition hover:text-white">
            &larr; Back to All Programs
          </Link>
          <div className="mt-8 text-4xl text-highlight">{program.icon}</div>
          <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">{program.title}</h1>
        </div>
      </section>

      <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-8 sm:py-14">
        <div className="space-y-10">
          {/* Program Overview */}
          <section>
            <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-3">
              <BookOpen size={24} /> Program Overview
            </h2>
            <div className="prose prose-lg max-w-none">
              <ReactMarkdown>{program.description}</ReactMarkdown>
            </div>
          </section>

          {/* Core Subjects */}
          {program.subjects && program.subjects.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-3">
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
            <section>
              <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-3">
                <FlaskConical size={24} /> Learning Resources
              </h2>
              <div className="prose prose-lg max-w-none">
                <ReactMarkdown>{program.learningResources}</ReactMarkdown>
              </div>
            </section>
          )}

          {program.curriculum && (
            <section>
              <h2 className="mb-4 flex items-center gap-3 text-2xl font-bold text-primary"><BookOpen size={24} /> Curriculum</h2>
              <div className="prose prose-lg max-w-none"><ReactMarkdown>{program.curriculum}</ReactMarkdown></div>
            </section>
          )}

          {program.assessment && (
            <section>
              <h2 className="mb-4 flex items-center gap-3 text-2xl font-bold text-primary"><CheckCircle size={24} /> Assessment</h2>
              <div className="prose prose-lg max-w-none"><ReactMarkdown>{program.assessment}</ReactMarkdown></div>
            </section>
          )}

          {program.timetable && (
            <section>
              <h2 className="mb-4 text-2xl font-bold text-primary">Timetable & Academic Calendar</h2>
              <div className="prose prose-lg max-w-none"><ReactMarkdown>{program.timetable}</ReactMarkdown></div>
            </section>
          )}
        </div>
      </main>
    </>
  );
}

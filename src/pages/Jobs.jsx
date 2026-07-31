import React, { useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin } from 'lucide-react';
import { FaSchool } from 'react-icons/fa';
import { db } from '../firebase/config';
import Seo from '../components/Seo';
import SeoConfig from '../config/SeoConfig';
import LoadingSpinner from '../components/LoadingSpinner';
import { admissionPrograms } from '../data/careerOpenings';

export default function Jobs() {
  const [programs, setPrograms] = useState(admissionPrograms);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const q = query(collection(db, 'jobs'), orderBy('postedAt', 'desc'));
        const snap = await getDocs(q);
        // This can be extended later to fetch dynamic admission info from Firestore
        // For now, we rely on the hardcoded programs.
        setPrograms(admissionPrograms);
      } catch (error) {
        console.error('Error loading admission programs:', error);
        setPrograms(admissionPrograms);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <>
      <Seo {...SeoConfig.careers} />
      <div className="min-h-screen bg-background-alt text-text">
        <section className="bg-electric-blue px-4 py-6 text-primary sm:px-8 sm:py-8">
          <div className="mx-auto max-w-5xl text-center">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-primary">Admissions</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
              Join the Dankamf Family
            </h1>
            <p className="mx-auto mt-2 max-w-3xl text-sm leading-relaxed text-primary/80 sm:text-base">
              Discover our admission process and take the first step towards securing a bright future for your child.
            </p>
          </div>
        </section>

        <main className="mx-auto w-full max-w-7xl px-0 py-10 sm:px-8 sm:py-14">
          <div className="px-4 sm:px-0 mb-12">
            <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-sm border border-slate-200">
              <h2 className="text-3xl font-bold text-primary mb-4">Admissions – 2026/2027 Academic Year</h2>
              <p className="text-text-light mb-6">We are dedicated to providing a nurturing environment for your child’s academic and personal growth. Below is our fee schedule and requirements for the current academic year.</p>

              <h3 className="text-xl font-bold text-primary border-b pb-2 mb-4">Fee Schedule (All figures in GHS)</h3>
              {/* This table can be replaced with a dynamic component later if needed */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-background-alt">
                      <th className="p-3 border">Program</th>
                      <th className="p-3 border">Admission</th>
                      <th className="p-3 border">Tuition</th>
                      <th className="p-3 border">Stationery</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b"><td className="p-3 border">Crèche</td><td className="p-3 border">150.00</td><td className="p-3 border">700.00</td><td className="p-3 border">400.00</td></tr>
                    <tr className="border-b"><td className="p-3 border">Nursery 1 & 2</td><td className="p-3 border">150.00</td><td className="p-3 border">700.00</td><td className="p-3 border">400.00</td></tr>
                    <tr className="border-b"><td className="p-3 border">KG 1 & 2</td><td className="p-3 border">150.00</td><td className="p-3 border">700.00</td><td className="p-3 border">400.00</td></tr>
                    <tr className="border-b"><td className="p-3 border">Primary 1-3</td><td className="p-3 border">150.00</td><td className="p-3 border">750.00</td><td className="p-3 border">450.00</td></tr>
                    <tr className="border-b"><td className="p-3 border">Primary 4-6</td><td className="p-3 border">150.00</td><td className="p-3 border">800.00</td><td className="p-3 border">500.00</td></tr>
                    <tr><td className="p-3 border">JHS 1-3</td><td className="p-3 border">200.00</td><td className="p-3 border">850.00</td><td className="p-3 border">550.00</td></tr>
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-text-light mt-4"><strong>Transport Fees:</strong> Rates are calculated based on your residence location (12.00 - 14.00 per day). Please contact the administration office for a specific quote.</p>
              <Link to="/admissions/apply" className="mt-6 inline-flex rounded-full bg-accent-yellow px-6 py-3 text-sm font-bold text-darkgray hover:bg-accent-yellow-dark">Enroll Online</Link>
              <Link to="/admissions/interview" className="ml-3 mt-6 inline-flex rounded-full border border-primary px-6 py-3 text-sm font-bold text-primary hover:bg-primary hover:text-white">Book Interview</Link>
              <Link to="/admissions/status" className="mt-4 inline-flex rounded-full text-sm font-bold text-accent hover:text-primary">Check Application Status →</Link>
              <Link to="/admissions/fees" className="mt-4 ml-4 inline-flex rounded-full text-sm font-bold text-accent hover:text-primary">View Fees & Scholarships →</Link>

              <h3 className="text-xl font-bold text-primary border-b pb-2 my-6">How to Apply</h3>
              <ol className="list-decimal list-inside space-y-2 text-text-light">
                <li><strong>Visit Us:</strong> Come to the school premises to pick up an official admission form.</li>
                <li><strong>Submit:</strong> Return the completed form along with all required documentation.</li>
                <li><strong>Payment:</strong> Payments can be made to the school accounts office.</li>
                <li><strong>Inquiry:</strong> For any questions, please contact the Headmaster at <strong>024 217 2216</strong>.</li>
              </ol>
            </div>
          </div>

          {loading ? <LoadingSpinner label="Loading Admission Programs" /> : (
            <div className="grid gap-3 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
              {programs.map(program => (
                <article
                  key={program.id}
                  className="flex flex-col rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-accent/40 hover:shadow-lg sm:p-6"
                >
                  <FaSchool className="h-7 w-7 text-accent" aria-hidden="true" />
                  <h2 className="mt-4 text-2xl font-black text-primary">{program.title}</h2>
                  <p className="mt-3 flex items-center gap-2 text-sm font-bold text-slate-500">
                    <MapPin className="h-4 w-4 text-accent" aria-hidden="true" />
                    {program.location}
                  </p>
                  <p className="mt-1 text-sm font-bold text-slate-500">{program.type}</p>
                  <p className="mt-4 line-clamp-3 text-base leading-relaxed text-text-light">
                    {program.description}
                  </p>
                  <Link
                    to={`/jobs/${program.id}`}
                    className="mt-auto inline-flex items-center gap-1 pt-5 text-sm font-bold text-accent transition hover:text-primary"
                  >
                    View Details <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </article>
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  );
}

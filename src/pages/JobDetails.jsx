import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { doc, getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { MapPin } from 'lucide-react';
import { FaSchool } from 'react-icons/fa';
import { db, storage } from '../firebase/config';
import Seo from '../components/Seo';
import SeoConfig from '../config/SeoConfig';
import LoadingSpinner from '../components/LoadingSpinner';
import ReactMarkdown from 'react-markdown';
import { findAdmissionProgram } from '../data/careerOpenings';

export default function JobDetails() {
  const { id } = useParams();
  const location = useLocation();
  const backLabel = location.pathname.startsWith('/jobs/') ? 'Back to Jobs & Vacancies' : 'Back to Admissions';
  const [job, setJob] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', cover: '', cv: null });
  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      // First, try to find the program in our hardcoded data.
      const program = findAdmissionProgram(id);
      if (program) {
        setJob(program);
      } else {
        // Fallback to fetch from Firestore if it's a dynamic entry
        const snap = await getDoc(doc(db, 'jobs', id));
        setJob(snap.exists() ? snap.data() : false);
      }
    };

    fetchJob();
  }, [id]);

  const handleChange = event => {
    const { name, value, files } = event.target;
    setForm({ ...form, [name]: name === 'cv' ? files[0] : value });
  };

  const handleSubmit = async event => {
    event.preventDefault();
    setMsg('');
    setMsgType('');
    setUploading(true);

    try {
      let cvUrl = '';
      if (form.cv) {
        if (!form.cv.name.toLowerCase().endsWith('.pdf')) throw new Error('Please upload your CV as a PDF file.');
        if (form.cv.size > 5 * 1024 * 1024) throw new Error('Your CV must be 5 MB or smaller.');
        const safeName = form.cv.name.replace(/[^a-zA-Z0-9._-]/g, '-');
        const fileRef = ref(storage, `applications/${id}/${Date.now()}-${safeName}`);
        const snap = await uploadBytes(fileRef, form.cv);
        cvUrl = await getDownloadURL(snap.ref);
      }

      const applicationData = {
        name: form.name,
        email: form.email,
        coverLetter: form.cover,
        cvUrl,
        submittedAt: serverTimestamp(),
        jobId: id,
      };

      await Promise.all([
        addDoc(collection(db, 'jobs', id, 'applications'), applicationData),
        addDoc(collection(db, 'applications'), applicationData),
      ]);

      setMsg('Application submitted successfully.');
      setMsgType('success');
      setForm({ name: '', email: '', cover: '', cv: null });
    } catch (error) {
      console.error(error);
      setMsg('Unable to submit application: ' + error.message);
      setMsgType('error');
    } finally {
      setUploading(false);
    }
  };

  if (job === null) return <LoadingSpinner label="Loading job details" fullPage />;

  if (job === false) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-3xl font-black text-primary">Program Not Found</h1>
        <Link to="/jobs" className="mt-6 inline-flex text-accent hover:underline">
          &larr; {backLabel}
        </Link>
      </main>
    );
  }

  const excerpt = job.description?.slice(0, 150) || `Admission information for ${job.title}.`;

  return (
    <>
      <Seo {...SeoConfig.dynamic.admissionInfo({ title: job.title, excerpt, id })} />

      <section className="bg-electric-blue px-4 py-7 text-primary sm:px-8 sm:py-9">
        <div className="mx-auto max-w-4xl">
          <Link to="/jobs" className="text-sm font-bold text-cobalt transition hover:text-primary">
            &larr; {backLabel}
          </Link>
          <FaSchool className="mt-5 h-7 w-7 text-cobalt" aria-hidden="true" />
          <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">{job.title}</h1>
          <div className="mt-3 flex flex-wrap gap-4 text-sm font-bold text-primary/75">
            <span className="inline-flex items-center gap-2">
              <MapPin className="h-4 w-4 text-cobalt" aria-hidden="true" />
              {job.location}
            </span>
            <span>{job.type}</span>
          </div>
        </div>
      </section>

      <main className="mx-auto grid w-full max-w-6xl gap-6 px-0 py-10 sm:px-8 sm:py-14 lg:grid-cols-[1fr_24rem]">
        <section className="space-y-6 px-4 sm:px-0">
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-2xl font-black text-primary">Role Overview</h2>
            <div className="prose mt-3 max-w-none text-text-light"><ReactMarkdown>{job.description}</ReactMarkdown></div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-2xl font-black text-primary">Role Requirements</h2>
            <div className="prose mt-3 max-w-none text-text-light"><ReactMarkdown>{job.requirements}</ReactMarkdown></div>
          </div>
        </section>

        <section className="rounded-xl border border-powder-blue bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-2xl font-black text-primary">Apply for This Role</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-500">
            Submit your details and attach your CV in PDF format. Our school team will review your application carefully.
          </p>
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Applicant full name"
              required
              className="w-full rounded border border-slate-300 bg-white p-3"
            />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              required
              className="w-full rounded border border-slate-300 bg-white p-3"
            />
            <textarea
              name="cover"
              value={form.cover}
              onChange={handleChange}
              placeholder="Message (optional)"
              className="h-28 w-full rounded border border-slate-300 bg-white p-3"
            />
            <input
              type="file"
              name="cv"
              accept="application/pdf"
              onChange={handleChange}
              required
              className="w-full rounded border border-slate-300 bg-white p-3 text-sm"
            />
            <button
              disabled={uploading}
              className="w-full rounded-full bg-primary px-6 py-3 text-sm font-bold text-white transition hover:bg-primary-dark disabled:cursor-wait disabled:opacity-70"
            >
              {uploading ? (
                <span className="inline-flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Submitting...
                </span>
              ) : 'Submit Application'}
            </button>
            {msg && <p role="status" className={`rounded-lg border px-3 py-2 text-sm font-bold ${msgType === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-red-200 bg-red-50 text-red-700'}`}>{msg}</p>}
          </form>
        </section>
      </main>
    </>
  );
}

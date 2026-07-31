import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { MapPin } from 'lucide-react';
import { FaSchool } from 'react-icons/fa';
import { db, storage } from '../firebase/config';
import Seo from '../components/Seo';
import SeoConfig from '../config/SeoConfig';
import LoadingSpinner from '../components/LoadingSpinner';
import { findAdmissionProgram } from '../data/careerOpenings';

export default function JobDetails() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', cover: '', cv: null });
  const [msg, setMsg] = useState('');
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
    setUploading(true);

    try {
      let cvUrl = '';
      if (form.cv) {
        const fileRef = ref(storage, `applications/${id}/${Date.now()}-${form.cv.name}`);
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
      setForm({ name: '', email: '', cover: '', cv: null });
    } catch (error) {
      console.error(error);
      setMsg('Unable to submit application: ' + error.message);
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
          &larr; Back to Admissions
        </Link>
      </main>
    );
  }

  const excerpt = job.description?.slice(0, 150) || `Admission information for ${job.title}.`;

  return (
    <>
      <Seo {...SeoConfig.dynamic.admissionInfo({ title: job.title, excerpt, id })} />

      <section className="bg-slate-950 px-4 py-12 text-white sm:px-8 sm:py-16">
        <div className="mx-auto max-w-4xl">
          <Link to="/jobs" className="text-sm font-bold text-highlight transition hover:text-white">
            &larr; Back to Admissions
          </Link>
          <FaSchool className="mt-8 h-8 w-8 text-highlight" aria-hidden="true" />
          <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">{job.title}</h1>
          <div className="mt-4 flex flex-wrap gap-4 text-sm font-bold text-slate-300">
            <span className="inline-flex items-center gap-2">
              <MapPin className="h-4 w-4 text-highlight" aria-hidden="true" />
              {job.location}
            </span>
            <span>{job.type}</span>
          </div>
        </div>
      </section>

      <main className="mx-auto grid w-full max-w-6xl gap-6 px-0 py-10 sm:px-8 sm:py-14 lg:grid-cols-[1fr_24rem]">
        <section className="space-y-6 px-4 sm:px-0">
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-2xl font-black text-primary">Program Overview</h2>
            <p className="mt-3 text-base leading-relaxed text-text-light">{job.description}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-2xl font-black text-primary">Admission Requirements</h2>
            <p className="mt-3 text-base leading-relaxed text-text-light">{job.requirements}</p>
          </div>
        </section>

        <section className="border-y border-slate-200 bg-slate-50 p-5 sm:rounded-lg sm:border sm:p-6">
          <h2 className="text-2xl font-black text-primary">Enroll Online</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-500">
            Share your details and attach a PDF resume. We will review your application carefully.
          </p>
          {msg && <p className="mt-4 rounded-lg bg-white p-3 text-sm font-bold text-primary">{msg}</p>}

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Parent/Guardian Name"
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
              className="w-full rounded bg-highlight px-6 py-3 font-bold text-white transition hover:bg-amber-600 disabled:cursor-wait disabled:opacity-70"
            >
              {uploading ? (
                <span className="inline-flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Submitting...
                </span>
              ) : 'Submit Application'}
            </button>
          </form>
        </section>
      </main>
    </>
  );
}

import React, { useEffect, useState } from 'react';
import { useLocation, useParams, Link } from 'react-router-dom';
import { addDoc, collection, doc, getDoc, serverTimestamp } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { MapPin } from 'lucide-react';
import { FaSchool } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import Seo from '../components/Seo';
import LoadingSpinner from '../components/LoadingSpinner';
import { db, storage } from '../firebase/config';
import { findAdmissionProgram } from '../data/careerOpenings';

export default function JobDetails() {
  const { id } = useParams();
  const location = useLocation();
  const admissionProgram = findAdmissionProgram(id);
  const [job, setJob] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', cover: '', cv: null });
  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (admissionProgram) { setJob(admissionProgram); return undefined; }
    let mounted = true;
    getDoc(doc(db, 'jobs', id)).then((snap) => { if (mounted) setJob(snap.exists() ? { id: snap.id, ...snap.data() } : false); }).catch(() => { if (mounted) setJob(false); });
    return () => { mounted = false; };
  }, [id, admissionProgram]);

  const handleChange = (event) => { const { name, value, files } = event.target; setForm((current) => ({ ...current, [name]: name === 'cv' ? files?.[0] || null : value })); };
  const handleSubmit = async (event) => {
    event.preventDefault(); setMsg(''); setMsgType(''); setUploading(true);
    try {
      let cvUrl = '';
      if (form.cv) { if (!form.cv.name.toLowerCase().endsWith('.pdf')) throw new Error('Please upload your CV as a PDF file.'); if (form.cv.size > 5 * 1024 * 1024) throw new Error('Your CV must be 5 MB or smaller.'); const safeName = form.cv.name.replace(/[^a-zA-Z0-9._-]/g, '-'); const uploaded = await uploadBytes(ref(storage, `applications/${id}/${Date.now()}-${safeName}`), form.cv); cvUrl = await getDownloadURL(uploaded.ref); }
      const applicationData = { name: form.name, email: form.email, coverLetter: form.cover, cvUrl, submittedAt: serverTimestamp(), jobId: id };
      await Promise.all([addDoc(collection(db, 'jobs', id, 'applications'), applicationData), addDoc(collection(db, 'applications'), applicationData)]);
      setMsg('Application submitted successfully.'); setMsgType('success'); setForm({ name: '', email: '', cover: '', cv: null });
    } catch (error) { console.error(error); setMsg(`Unable to submit application: ${error.message}`); setMsgType('error'); } finally { setUploading(false); }
  };

  if (job === null) return <LoadingSpinner label={admissionProgram ? 'Loading admission programme' : 'Loading vacancy details'} fullPage />;
  if (job === false) return <main className="mx-auto max-w-3xl px-4 py-16 text-center"><h1 className="text-3xl font-black text-primary">{admissionProgram ? 'Programme Not Found' : 'Vacancy Not Found'}</h1><Link to={admissionProgram ? '/admissions' : '/jobs'} className="mt-6 inline-flex text-accent hover:underline">← {admissionProgram ? 'Back to Admissions' : 'Back to Jobs & Vacancies'}</Link></main>;

  if (admissionProgram) return <><Seo title={`${job.title} | Admissions | Dankamf Educational Complex`} description={job.description} /><main className="min-h-screen bg-background-alt"><section className="bg-electric-blue px-4 py-7 text-primary sm:px-8 sm:py-9"><div className="mx-auto max-w-4xl"><Link to="/admissions" className="inline-flex items-center gap-2 text-sm font-bold text-cobalt hover:text-primary">← <span>Back to Admissions</span></Link><FaSchool className="mt-5 h-7 w-7 text-cobalt" aria-hidden="true" /><h1 className="mt-3 text-3xl font-black sm:text-4xl">{job.title}</h1><p className="mt-3 text-sm font-bold text-primary/75">{job.type} · {job.location}</p></div></section><section className="mx-auto grid max-w-5xl gap-6 px-4 py-10 sm:px-8 sm:py-14 lg:grid-cols-[1fr_22rem]"><article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7"><h2 className="text-2xl font-black text-primary">Programme Overview</h2><div className="prose mt-4 max-w-none text-text-light"><ReactMarkdown>{job.description}</ReactMarkdown></div><h2 className="mt-8 text-2xl font-black text-primary">Admission Requirements</h2><div className="prose mt-4 max-w-none text-text-light"><ReactMarkdown>{job.requirements}</ReactMarkdown></div></article><aside className="h-fit rounded-xl border border-powder-blue bg-white p-5 shadow-sm sm:p-6"><h2 className="text-xl font-black text-primary">Ready to enrol?</h2><p className="mt-2 text-sm text-text-light">Share your child’s details with our admissions team.</p><Link to="/admissions/apply" className="mt-5 inline-flex w-full justify-center rounded-full bg-primary px-5 py-3 text-sm font-bold text-white">Enrol Online</Link><Link to="/admissions" className="mt-3 inline-flex w-full justify-center rounded-full border border-primary px-5 py-3 text-sm font-bold text-primary">View Admissions</Link></aside></section></main></>;

  const backLabel = location.pathname.startsWith('/jobs/') ? 'Back to Jobs & Vacancies' : 'Back to Admissions';
  return <><Seo title={`${job.title} | Careers | Dankamf Educational Complex`} description={job.description?.slice(0, 150)} /><section className="bg-electric-blue px-4 py-7 text-primary sm:px-8 sm:py-9"><div className="mx-auto max-w-4xl"><Link to="/jobs" className="text-sm font-bold text-cobalt">← {backLabel}</Link><FaSchool className="mt-5 h-7 w-7 text-cobalt" /><h1 className="mt-3 text-3xl font-black sm:text-4xl">{job.title}</h1><div className="mt-3 flex flex-wrap gap-4 text-sm font-bold text-primary/75"><span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4" />{job.location}</span><span>{job.type}</span></div></div></section><main className="mx-auto grid max-w-6xl gap-6 px-4 py-10 sm:px-8 sm:py-14 lg:grid-cols-[1fr_24rem]"><section className="space-y-6"><div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"><h2 className="text-2xl font-black text-primary">Role Overview</h2><div className="prose mt-3 max-w-none text-text-light"><ReactMarkdown>{job.description}</ReactMarkdown></div></div><div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"><h2 className="text-2xl font-black text-primary">Role Requirements</h2><div className="prose mt-3 max-w-none text-text-light"><ReactMarkdown>{job.requirements}</ReactMarkdown></div></div></section><section className="h-fit rounded-xl border border-powder-blue bg-white p-5 shadow-sm"><h2 className="text-2xl font-black text-primary">Apply for This Role</h2><p className="mt-2 text-sm text-slate-500">Submit your details and attach your CV in PDF format.</p><form onSubmit={handleSubmit} className="mt-5 space-y-4"><input name="name" value={form.name} onChange={handleChange} placeholder="Applicant full name" required className="w-full rounded border border-slate-300 p-3" /><input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email" required className="w-full rounded border border-slate-300 p-3" /><textarea name="cover" value={form.cover} onChange={handleChange} placeholder="Message (optional)" className="h-28 w-full rounded border border-slate-300 p-3" /><input type="file" name="cv" accept="application/pdf" onChange={handleChange} required className="w-full rounded border border-slate-300 p-3 text-sm" /><button disabled={uploading} className="w-full rounded-full bg-primary px-6 py-3 text-sm font-bold text-white disabled:opacity-70">{uploading ? 'Submitting…' : 'Submit Application'}</button>{msg && <p role="status" className={`rounded-lg border px-3 py-2 text-sm font-bold ${msgType === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-red-200 bg-red-50 text-red-700'}`}>{msg}</p>}</form></section></main></>;
}

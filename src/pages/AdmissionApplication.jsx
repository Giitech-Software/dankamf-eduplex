import React, { useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import Seo from '../components/Seo';
import SeoConfig from '../config/SeoConfig';

const initialForm = { studentName: '', dateOfBirth: '', program: '', parentName: '', email: '', phone: '', message: '' };

export default function AdmissionApplication() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState('');
  const [reference, setReference] = useState('');
  const [saving, setSaving] = useState(false);
  const update = (event) => setForm({ ...form, [event.target.name]: event.target.value });
  const submit = async (event) => {
    event.preventDefault(); setSaving(true); setStatus('');
    try {
      const applicationReference = `DKE-2026-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
      await addDoc(collection(db, 'admissionApplications'), { ...form, applicationReference, status: 'new', createdAt: serverTimestamp() });
      setForm(initialForm); setReference(applicationReference); setStatus('Application received. Our admissions team will contact you shortly.');
    } catch (error) { console.error(error); setStatus('We could not submit your application. Please try again.'); } finally { setSaving(false); }
  };
  return <><Seo title="Apply for Admission | Dankamf Educational Complex" {...SeoConfig.careers} /><main className="min-h-screen bg-background-alt px-4 py-12 sm:px-8"><div className="mx-auto max-w-3xl"><div className="mb-8 text-center"><p className="text-xs font-black uppercase tracking-[0.25em] text-accent">Admissions 2026/2027</p><h1 className="mt-3 text-4xl font-black text-primary sm:text-5xl">Start Your Application</h1><p className="mx-auto mt-4 max-w-2xl text-text-light">Share your details with our admissions team and we will guide you through the next steps.</p></div><form onSubmit={submit} className="grid gap-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-2 sm:p-8">
    <label className="space-y-2"><span className="text-sm font-bold text-darkgray">Student’s full name</span><input required name="studentName" value={form.studentName} onChange={update} className="w-full rounded-lg border border-slate-300 p-3 focus:ring-2 focus:ring-primary" /></label>
    <label className="space-y-2"><span className="text-sm font-bold text-darkgray">Date of birth</span><input required type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={update} className="w-full rounded-lg border border-slate-300 p-3 focus:ring-2 focus:ring-primary" /></label>
    <label className="space-y-2"><span className="text-sm font-bold text-darkgray">Programme</span><select required name="program" value={form.program} onChange={update} className="w-full rounded-lg border border-slate-300 bg-white p-3 focus:ring-2 focus:ring-primary"><option value="">Select a programme</option><option>Crèche & Nursery</option><option>Kindergarten & Primary</option><option>Junior High School</option></select></label>
    <label className="space-y-2"><span className="text-sm font-bold text-darkgray">Parent/guardian name</span><input required name="parentName" value={form.parentName} onChange={update} className="w-full rounded-lg border border-slate-300 p-3 focus:ring-2 focus:ring-primary" /></label>
    <label className="space-y-2"><span className="text-sm font-bold text-darkgray">Email address</span><input required type="email" name="email" value={form.email} onChange={update} className="w-full rounded-lg border border-slate-300 p-3 focus:ring-2 focus:ring-primary" /></label>
    <label className="space-y-2"><span className="text-sm font-bold text-darkgray">Phone number</span><input required type="tel" name="phone" value={form.phone} onChange={update} className="w-full rounded-lg border border-slate-300 p-3 focus:ring-2 focus:ring-primary" /></label>
    <label className="space-y-2 sm:col-span-2"><span className="text-sm font-bold text-darkgray">Additional information</span><textarea name="message" value={form.message} onChange={update} rows="4" className="w-full rounded-lg border border-slate-300 p-3 focus:ring-2 focus:ring-primary" /></label>
    <div className="sm:col-span-2"><button disabled={saving} className="w-full rounded-full bg-accent-yellow px-6 py-3 font-bold text-darkgray hover:bg-accent-yellow-dark disabled:opacity-60">{saving ? 'Submitting…' : 'Submit Application'}</button>{status && <p role="status" className="mt-4 text-center text-sm font-semibold text-primary">{status}{reference && <><br /><span className="mt-2 inline-block rounded-lg bg-blue-50 px-4 py-2 text-lg tracking-wider">Reference: {reference}</span></>}</p>}</div>
  </form></div></main></>;
}

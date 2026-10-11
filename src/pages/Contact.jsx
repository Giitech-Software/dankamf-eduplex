// src/pages/Contact.jsx
import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { FaEnvelope, FaGlobe, FaMapMarkerAlt, FaPhoneAlt, FaWhatsapp } from 'react-icons/fa';
import { db } from '../firebase/config';
import Seo from '../components/Seo';
import SeoConfig from '../config/SeoConfig';
import useSiteSettings from '../hooks/useSiteSettings';

const whatsappMessage = encodeURIComponent(
  'Hello Dankamf Eduplex, I would like to make an inquiry about admissions.'
);
export default function Contact() {
  const { settings } = useSiteSettings();
  const legacyHeadteacherNumbers = /(?:024\s*217\s*2216|233\s*24\s*217\s*2216|0242172216|233242172216)/;
  const configuredPhone = settings?.phone || '';
  const configuredWhatsapp = settings?.whatsapp || '';
  const phone = legacyHeadteacherNumbers.test(configuredPhone.replace(/\D/g, '')) ? '0504453176' : (configuredPhone || '0504453176');
  const whatsappNumber = (legacyHeadteacherNumbers.test(configuredWhatsapp.replace(/\D/g, '')) ? '0504453176' : (configuredWhatsapp || phone)).replace(/\D/g, '').replace(/^0/, '233');
  const contacts = settings?.contacts || [];
  const email = settings?.contactEmail || 'dankamfeducational@gmail.com';
  const address = settings?.address || 'Oyibi-Accra, near SDA Church, Greater Accra Region, Ghana';
  const officeHours = settings?.officeHours || 'Monday-Friday: 7:00am-3:00pm';
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('');
    try {
      await addDoc(collection(db, 'contactForms'), {
        ...form,
        timestamp: serverTimestamp(),
      });
      setStatus('Message sent successfully!');
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      console.error(err);
      setStatus('Failed to send message. Please try again.');
    }
  };

  return (
    <>
      <Seo {...SeoConfig.contact} />
      <div className="min-h-screen bg-background text-text flex flex-col">
        <main className="w-full flex-grow">
          <section className="bg-electric-blue px-4 py-6 text-center text-primary sm:px-8 sm:py-8">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-cobalt">Get in Touch</p>
            <h1 className="mt-2 text-3xl font-black sm:text-4xl">Contact Us</h1>
            <p className="mx-auto mt-2 max-w-2xl text-sm leading-relaxed text-primary/80">We’re here to help with admissions, curriculum, visits, and general enquiries.</p>
          </section>
          <div className="mx-auto w-full max-w-3xl px-0 py-6 sm:p-8">
          <div className="mb-6 space-y-3 px-4 text-gray-700 sm:px-0">
            <div className="grid gap-3 sm:grid-cols-2">
              <a
                href={`mailto:${email}`}
                className="flex min-h-14 items-center gap-3 rounded-lg border border-gray-200 bg-white p-3 text-primary shadow-sm transition hover:border-primary"
              >
                <FaEnvelope className="shrink-0" />
                <span className="min-w-0 truncate">{email}</span>
              </a>
              <a
                href={`tel:${phone.replace(/\s/g, '')}`}
                className="flex min-h-14 items-center gap-3 rounded-lg border border-gray-200 bg-white p-3 text-primary shadow-sm transition hover:border-primary"
              >
                <FaPhoneAlt className="shrink-0" />
                <span>{phone}</span>
              </a>
              <a
                href="https://dankamfeducational.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-14 items-center gap-3 rounded-lg border border-gray-200 bg-white p-3 text-primary shadow-sm transition hover:border-primary"
              >
                <FaGlobe className="shrink-0" />
                <span className="min-w-0 truncate">dankamfeducational.com</span>
              </a>
              <p className="flex min-h-14 items-center gap-3 rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
                <FaMapMarkerAlt className="shrink-0 text-primary" />
                <span>{address}</span>
              </p>
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-3 rounded-lg bg-[#25D366] px-4 py-3 font-semibold text-white transition hover:bg-[#1DA851]"
              aria-label="Chat with Dankamf Eduplex on WhatsApp"
            >
              <FaWhatsapp className="text-xl" />
              Chat on WhatsApp Business
            </a>

            <div className="grid gap-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm md:grid-cols-[1.4fr_0.6fr]">
              <iframe
                title="Dankamf Educational Complex location map"
                src="https://www.google.com/maps?q=Dankamf+Educational+Complex,+Accra,+Ghana&output=embed"
                className="h-64 w-full border-0 md:h-full md:min-h-64"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="p-5">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-accent">Visit Our Campus</p>
                <h3 className="mt-2 text-xl font-black text-primary">Office Hours</h3>
                <dl className="mt-4 space-y-3 text-sm text-text-light">
                  <div className="flex justify-between gap-4"><dt className="font-bold text-darkgray">Office hours</dt><dd>{officeHours}</dd></div>
                  <div className="flex justify-between gap-4"><dt className="font-bold text-darkgray">Weekend & holidays</dt><dd>Closed</dd></div>
                </dl>
                <a href="https://www.google.com/maps/search/?api=1&query=Dankamf+Educational+Complex,+Accra,+Ghana" target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex rounded-full bg-primary px-4 py-2 text-xs font-bold text-white hover:bg-primary-dark">Get Directions</a>
              </div>
            </div>
            {contacts.length > 0 && <section className="mt-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="text-xl font-black text-primary">Key Contacts</h2><div className="mt-4 grid gap-3 sm:grid-cols-2">{contacts.map((contact, index) => <div key={`${contact.phone}-${index}`} className="rounded-lg border border-slate-100 bg-slate-50 p-4"><p className="font-black text-primary">{contact.name}</p><p className="mt-1 text-sm font-semibold text-accent">{contact.role}</p><a href={`tel:${contact.phone}`} className="mt-2 inline-block text-sm font-bold text-primary hover:underline">{contact.phone}</a></div>)}</div></section>}
          </div>
          <form onSubmit={handleSubmit} className="space-y-3 bg-white p-5 shadow sm:rounded-lg sm:p-6">
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your Name"
              required
              className="w-full rounded border p-3 focus:outline-none focus:ring-primary"
            />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Your Email"
              required
              className="w-full rounded border p-3 focus:outline-none focus:ring-primary"
            />
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Your Message"
              required
              className="w-full h-32 p-3 border rounded resize-none focus:ring-primary focus:outline-none"
            />
            <button
              type="submit"
              className="bg-primary text-white py-3 rounded hover:bg-cta transition w-full"
            >
              Send Message
            </button>
            {status && <p className="text-center mt-2">{status}</p>}
          </form>
          </div>
        </main>
      </div>
    </>
  );
}

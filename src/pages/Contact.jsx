// src/pages/Contact.jsx
import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { FaEnvelope, FaGlobe, FaMapMarkerAlt, FaPhoneAlt, FaWhatsapp } from 'react-icons/fa';
import { db } from '../firebase/config';
import Seo from '../components/Seo';
import SeoConfig from '../config/SeoConfig';

const whatsappNumber = '233242172216';
const whatsappMessage = encodeURIComponent(
  'Hello Dankamf Eduplex, I would like to make an inquiry about admissions.'
);
const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`; // Corrected variable name

export default function Contact() {
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
        <main className="mx-auto w-full max-w-3xl flex-grow px-0 py-6 sm:p-8">
          <h2 className="mb-4 px-4 text-center text-3xl font-bold text-primary sm:px-0 sm:text-4xl">Contact Us</h2>
          <p className="text-center text-slate-600 mb-6 px-4 sm:px-0">We're here to help. Reach out for inquiries about admissions, curriculum, or visits.</p>
          <div className="mb-6 space-y-3 px-4 text-gray-700 sm:px-0">
            <div className="grid gap-3 sm:grid-cols-2">
              <a
                href="mailto:info@dankamfeducationalcomplex.com"
                className="flex min-h-14 items-center gap-3 rounded-lg border border-gray-200 bg-white p-3 text-primary shadow-sm transition hover:border-primary"
              >
                <FaEnvelope className="shrink-0" />
                <span className="min-w-0 truncate">info@dankamfeducationalcomplex.com</span>
              </a>
              <a
                href="tel:+233242172216"
                className="flex min-h-14 items-center gap-3 rounded-lg border border-gray-200 bg-white p-3 text-primary shadow-sm transition hover:border-primary"
              >
                <FaPhoneAlt className="shrink-0" />
                <span>024 217 2216</span>
              </a>
              <a
                href="https://dankamf-eduplex.web.app"
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-14 items-center gap-3 rounded-lg border border-gray-200 bg-white p-3 text-primary shadow-sm transition hover:border-primary"
              >
                <FaGlobe className="shrink-0" />
                <span className="min-w-0 truncate">dankamf-eduplex.web.app</span>
              </a>
              <p className="flex min-h-14 items-center gap-3 rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
                <FaMapMarkerAlt className="shrink-0 text-primary" />
                <span>Oyibi–Accra, near SDA Church, Greater Accra Region, Ghana</span>
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
                  <div className="flex justify-between gap-4"><dt className="font-bold text-darkgray">Monday–Friday</dt><dd>7:00am–3:00pm</dd></div>
                  <div className="flex justify-between gap-4"><dt className="font-bold text-darkgray">Weekend & holidays</dt><dd>Closed</dd></div>
                </dl>
                <a href="https://www.google.com/maps/search/?api=1&query=Dankamf+Educational+Complex,+Accra,+Ghana" target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex rounded-full bg-primary px-4 py-2 text-xs font-bold text-white hover:bg-primary-dark">Get Directions</a>
              </div>
            </div>
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
        </main>
      </div>
    </>
  );
}

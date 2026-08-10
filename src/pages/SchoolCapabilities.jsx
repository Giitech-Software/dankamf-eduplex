import React, { useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { FaTimes } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { db } from '../firebase/config';
import Seo from '../components/Seo';
import LoadingSpinner from '../components/LoadingSpinner';

export default function SchoolCapabilities() {
  const location = useLocation();
  const [features, setFeatures] = useState([]);
  const [activeFeature, setActiveFeature] = useState(null);
  const [highlightedId, setHighlightedId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDocs(query(collection(db, 'enterpriseFeatures'), orderBy('order', 'asc')))
      .then((snapshot) => setFeatures(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })).filter((item) => item.title && item.text)))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const id = location.hash.replace('#feature-', '');
    if (!id || !features.some((feature) => feature.id === id)) return;
    setHighlightedId(id);
    requestAnimationFrame(() => document.getElementById(`feature-${id}`)?.scrollIntoView({ behavior: 'auto', block: 'center' }));
    const timer = setTimeout(() => setHighlightedId(null), 3500);
    return () => clearTimeout(timer);
  }, [location.hash, features]);

  const getGalleryImages = (feature) => {
    const gallery = Array.isArray(feature.gallery) ? feature.gallery : Array.isArray(feature.images) ? feature.images : [];
    return gallery
      .map((image) => typeof image === 'string' ? { url: image } : image)
      .filter((image) => image?.url && image.url !== feature.imageUrl);
  };

  return <>
    <Seo title="Why Choose Dankamf | School Capabilities" description="Discover the academic, pastoral, and learning advantages of Dankamf Educational Complex." path="/school-capabilities" />
    <main className="min-h-screen bg-background-alt">
      <section className="bg-electric-blue px-4 py-6 text-primary sm:px-8 sm:py-8"><div className="mx-auto max-w-4xl text-center"><p className="text-xs font-black uppercase tracking-[0.25em]">Why Choose Us</p><h1 className="mt-2 text-3xl font-black sm:text-4xl">The Dankamf Advantage</h1><p className="mx-auto mt-2 max-w-2xl text-sm text-primary/80 sm:text-base">Explore the learning environment, values, and opportunities that help every learner thrive.</p></div></section>
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-8 sm:py-14">
        {loading ? <LoadingSpinner label="Loading school highlights" /> : features.length === 0 ? <p className="rounded-xl bg-white p-8 text-center text-text-light">School highlights will be published soon.</p> : <div className="grid gap-6 md:grid-cols-2">{features.map((feature) => <article id={`feature-${feature.id}`} key={feature.id} onClick={() => setActiveFeature(feature)} className={`cursor-pointer overflow-hidden rounded-xl border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl ${highlightedId === feature.id ? 'border-accent ring-4 ring-accent/30 ring-offset-4' : 'border-powder-blue'}`}>{feature.imageUrl && <img src={feature.imageUrl} alt={feature.title} loading="lazy" decoding="async" className="h-56 w-full object-cover" />}<div className="p-6"><h2 className="text-2xl font-black text-primary">{feature.title}</h2><div className="prose mt-3 line-clamp-4 max-w-none text-text-light"><ReactMarkdown>{feature.text}</ReactMarkdown></div><span className="mt-4 inline-flex text-sm font-black text-accent">Open full highlight →</span></div></article>)}</div>}
      </section>
    </main>
    {activeFeature && <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={activeFeature.title} onClick={() => setActiveFeature(null)}><div className="relative max-h-[90svh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl" onClick={(event) => event.stopPropagation()}><button onClick={() => setActiveFeature(null)} aria-label="Close highlight" className="absolute right-4 top-4 z-10 rounded-full bg-white p-3 text-slate-700 shadow-lg hover:bg-slate-100"><FaTimes /></button>{activeFeature.imageUrl && <img src={activeFeature.imageUrl} alt={activeFeature.title} className="max-h-80 w-full object-cover" />}<div className="p-6 sm:p-8"><h2 className="text-3xl font-black text-primary">{activeFeature.title}</h2><div className="prose mt-4 max-w-none text-text-light"><ReactMarkdown>{activeFeature.text}</ReactMarkdown></div>{getGalleryImages(activeFeature).length > 0 && <div className="mt-8 space-y-6 border-t border-slate-200 pt-6"><p className="text-xs font-black uppercase tracking-[0.2em] text-accent">More from this highlight</p>{getGalleryImages(activeFeature).map((image, index) => <figure key={`${image.url}-${index}`} className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50"><img src={image.url} alt={image.caption || `${activeFeature.title} detail ${index + 1}`} loading="lazy" decoding="async" className="h-auto max-h-[28rem] w-full object-cover" />{image.caption && <figcaption className="px-4 py-3 text-sm text-text-light">{image.caption}</figcaption>}</figure>)}</div>}<button onClick={() => setActiveFeature(null)} className="mt-6 rounded-full bg-primary px-5 py-2 text-sm font-bold text-white">Close</button></div></div></div>}
  </>;
}

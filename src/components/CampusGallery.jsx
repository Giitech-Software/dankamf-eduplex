import React, { useEffect, useState } from 'react';
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight, FaTimes } from 'react-icons/fa';
import { db } from '../firebase/config';
import LoadingSpinner from './LoadingSpinner';

export default function CampusGallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(null);

  useEffect(() => {
    getDocs(query(collection(db, 'gallery'), orderBy('order', 'asc'), limit(6)))
      .then((snapshot) => setImages(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })).filter((item) => item.imageUrl && item.published !== false)))
      .catch((error) => console.error('Error loading campus gallery:', error))
      .finally(() => setLoading(false));
  }, []);

  return <>
    <section className="bg-white px-4 py-12 sm:px-8 sm:py-14">
      <div className="mx-auto max-w-7xl">
        <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-xs font-black uppercase tracking-[0.22em] text-accent sm:text-sm">Life at Dankamf</p><h2 className="mt-2 text-3xl font-black tracking-tight text-darkgray sm:text-4xl">Campus Gallery</h2><p className="mt-3 max-w-2xl text-base leading-relaxed text-text-light">Explore moments from learning, creativity, community, and student life.</p></div><Link to="/gallery" className="text-sm font-black uppercase tracking-widest text-primary hover:text-accent">View full gallery →</Link></div>
        {loading ? <LoadingSpinner label="Loading campus gallery" /> : images.length === 0 ? <div className="rounded-xl border border-dashed border-blue-200 bg-blue-50/60 px-5 py-8 text-center"><p className="text-sm font-semibold text-primary">New campus moments will appear here soon.</p><Link to="/gallery" className="mt-3 inline-flex text-xs font-black uppercase tracking-wider text-primary hover:text-accent">Visit Gallery</Link></div> : <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-5">{images.map((image) => <button key={image.id} type="button" onClick={() => setActiveImage(image)} className="group relative aspect-square overflow-hidden rounded-xl bg-slate-100 text-left"><img src={image.imageUrl} alt={image.title || 'Dankamf Educational Complex campus'} loading="lazy" decoding="async" className="h-full w-full object-cover brightness-90 transition duration-500 group-hover:scale-105 group-hover:brightness-100" /><div className="pointer-events-none absolute inset-0 bg-black/5 transition group-hover:bg-transparent" /><div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-3 pt-8 text-sm font-bold text-white opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100">{image.title}</div></button>)}</div>}
      </div>
    </section>
    {activeImage && <GalleryLightbox image={activeImage} images={images} onClose={() => setActiveImage(null)} onChange={setActiveImage} />}
  </>;
}

function GalleryLightbox({ image, images, onClose, onChange }) {
  const index = images.findIndex((item) => item.id === image.id);
  return <div className="fixed inset-0 z-[120] flex h-[100svh] w-screen items-center justify-center overflow-hidden bg-slate-950/98 p-0" role="dialog" aria-modal="true" onClick={onClose}><button type="button" onClick={onClose} aria-label="Close gallery viewer" className="fixed right-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/95 text-xl text-slate-900 shadow-lg transition hover:bg-white" ><FaTimes /></button><button type="button" onClick={(event) => { event.stopPropagation(); onChange(images[(index - 1 + images.length) % images.length]); }} aria-label="Previous image" className="fixed left-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow-lg transition hover:bg-white sm:left-8"><FaChevronLeft /></button><figure className="flex h-full w-full flex-col items-center justify-center px-2 pb-8 pt-16 sm:px-12" onClick={(event) => event.stopPropagation()}><img src={image.imageUrl} alt={image.title || 'Dankamf Educational Complex campus'} className="max-h-[calc(100svh-7rem)] max-w-full object-contain" /><figcaption className="mt-3 text-center text-sm font-semibold text-white">{image.title || 'Dankamf Educational Complex'}{image.category && <span className="ml-2 text-white/60">· {image.category}</span>}<span className="ml-2 text-white/50">{index + 1} / {images.length}</span></figcaption></figure><button type="button" onClick={(event) => { event.stopPropagation(); onChange(images[(index + 1) % images.length]); }} aria-label="Next image" className="fixed right-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow-lg transition hover:bg-white sm:right-8"><FaChevronRight /></button></div>;
}

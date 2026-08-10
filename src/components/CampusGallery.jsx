import React, { useEffect, useState } from 'react';
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { db } from '../firebase/config';
import LoadingSpinner from './LoadingSpinner';

export default function CampusGallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDocs(query(collection(db, 'gallery'), orderBy('order', 'asc'), limit(12)))
      .then((snapshot) => setImages(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })).filter((item) => item.imageUrl && item.published !== false)))
      .catch((error) => console.error('Error loading campus gallery:', error))
      .finally(() => setLoading(false));
  }, []);

  if (!loading && images.length === 0) return null;

  return (
    <section className="bg-white px-4 py-16 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-accent sm:text-sm">Life at Dankamf</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-darkgray sm:text-4xl">Campus Gallery</h2>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-text-light">Explore moments from learning, creativity, community, and student life.</p>
          </div>
          <Link to="/projects" className="text-sm font-black uppercase tracking-widest text-primary hover:text-accent">View all activities →</Link>
        </div>
        {loading ? <LoadingSpinner label="Loading campus gallery" /> : <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5">
          {images.map((image) => <Link key={image.id} to={`/projects#project-${image.id}`} className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-slate-100"><img src={image.imageUrl} alt={image.title || 'Dankamf Educational Complex campus'} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /><div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-3 pt-8 text-sm font-bold text-white opacity-0 transition group-hover:opacity-100">{image.title}</div></Link>)}
        </div>}
      </div>
    </section>
  );
}

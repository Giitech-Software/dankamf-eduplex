import React, { useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../../firebase/config';

/** Reuse a published Gallery image in an admin content form. */
export default function GalleryImagePicker({ value = '', onChange, label = 'Or select an existing Gallery image' }) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getDocs(query(collection(db, 'gallery'), orderBy('order', 'asc')))
      .then((snapshot) => setImages(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })).filter((item) => item.imageUrl)))
      .catch(() => setImages([]))
      .finally(() => setLoading(false));
  }, []);
  return <label className="block text-sm font-bold text-slate-700 dark:text-slate-200">{label}<select value={value} onChange={(event) => onChange(event.target.value)} disabled={loading || images.length === 0} className="mt-2 w-full rounded-lg border border-slate-300 bg-white p-3 text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-white"><option value="">{loading ? 'Loading Gallery…' : images.length ? 'Choose a Gallery image…' : 'No Gallery images available'}</option>{images.map((image) => <option key={image.id} value={image.imageUrl}>{image.title || `${image.category || 'Gallery'} image`} {image.order ? `(#${image.order})` : ''}</option>)}</select>{value && <img src={value} alt="Selected Gallery preview" className="mt-3 h-28 w-full rounded-lg object-cover" />}</label>;
}

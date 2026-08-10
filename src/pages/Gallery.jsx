import React from 'react';
import Seo from '../components/Seo';
import SeoConfig from '../config/SeoConfig';
import CampusGallery from '../components/CampusGallery';

export default function Gallery() {
  return (
    <>
      <Seo title="Campus Gallery | Dankamf Educational Complex" description="Explore campus life, learning, activities, and events at Dankamf Educational Complex." {...SeoConfig.projects} />
      <main className="min-h-screen bg-background-alt">
        <section className="bg-primary-dark px-4 py-8 text-center text-white sm:px-8 sm:py-10">
          <div className="mx-auto max-w-5xl text-left">
            <div className="text-center">
              <p className="text-xs font-black uppercase tracking-[0.25em] text-accent-yellow">Explore Our Campus</p>
              <h1 className="mt-3 text-4xl font-black sm:text-5xl">Campus Gallery</h1>
              <p className="mx-auto mt-4 max-w-2xl text-slate-300">A visual window into the learning, growth, and community that define Dankamf.</p>
            </div>
          </div>
        </section>
        <CampusGallery />
      </main>
    </>
  );
}

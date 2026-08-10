import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase/config';

const heroImages = [
  '/images/hero-banner-01.webp',
  '/images/hero-banner-02.webp',
  '/images/hero-banner-03.webp',
  '/images/hero-banner-04.webp',
  '/images/hero-banner-05.webp',
   '/images/hero-banner-06.webp',
    '/images/hero-banner-07.webp',
    '/images/hero-banner-08.webp',
    '/images/hero-banner-09.webp',
    '/images/hero-banner-10.webp',
    '/images/hero-banner-11.webp',
    '/images/hero-banner-12.webp',
    '/images/hero-banner-13.webp',

];
 
export default function HeroSection({ siteName, tagline }) {
  const [activeImage, setActiveImage] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [images, setImages] = useState(heroImages);

  useEffect(() => {
    let mounted = true;
    const loadManagedImages = async () => {
      try {
        const snapshot = await getDocs(query(collection(db, 'heroSlides'), orderBy('order', 'asc')));
        const managedImages = snapshot.docs
          .map((document) => document.data())
          .filter((slide) => slide.active !== false && slide.url)
          .map((slide) => slide.url);
        if (mounted && managedImages.length) {
          // Managed images lead the carousel; developer-maintained images remain available after them.
          const combinedImages = [
            ...managedImages,
            ...heroImages.filter((image) => !managedImages.includes(image)),
          ];
          setImages(combinedImages);
        }
      } catch (error) {
        // Developer-maintained images remain the safe fallback if managed content is unavailable.
        console.warn('Managed hero images unavailable; using developer images.', error);
      }
    };
    loadManagedImages();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    setActiveImage(0);
  }, [images.length]);

  useEffect(() => {
    if (isPaused || images.length < 2) return undefined;

    const timer = window.setTimeout(() => {
      setActiveImage((current) => (current + 1) % images.length);
    }, activeImage === 0 ? 9000 : 6500);

    return () => window.clearTimeout(timer);
  }, [activeImage, images.length, isPaused]);

  const showPrevious = () => {
    setActiveImage((current) => (current - 1 + images.length) % images.length);
  };

  const showNext = () => {
    setActiveImage((current) => (current + 1) % images.length);
  };

  const useFallbackImage = (event) => {
    if (event.currentTarget.src.endsWith('/hero-fallback.png')) return;
    event.currentTarget.src = '/images/hero-fallback.png';
  };

  return (
    <section
      className="relative isolate min-h-[100svh] overflow-hidden bg-primary-dark text-white sm:aspect-[16/9] sm:min-h-0"
      aria-roledescription="carousel"
      aria-label="Dankamf Educational Complex highlights"
    >
      {images.map((image, index) => (
        <React.Fragment key={image}>
          <img
            src={image}
            alt=""
            aria-hidden="true"
            onError={useFallbackImage}
            loading="lazy"
            decoding="async"
            className={`absolute inset-0 -z-30 h-full w-full scale-110 object-cover opacity-60 blur-2xl transition-opacity duration-1000 ${index === activeImage ? 'opacity-60' : 'opacity-0'}`}
          />
          <img
            src={image}
            alt=""
            aria-hidden="true"
            onError={useFallbackImage}
            loading={index === activeImage ? 'eager' : 'lazy'}
            fetchPriority={index === activeImage ? 'high' : 'low'}
            decoding="async"
            className={`absolute inset-0 -z-20 h-full w-full object-cover object-center transition-opacity duration-1000 sm:object-contain ${index === activeImage ? 'opacity-100' : 'opacity-0'}`}
          />
        </React.Fragment>
      ))}
      <div className="absolute inset-0 -z-10 bg-primary-dark/0" />
 
      <div className="mx-auto flex h-full max-w-6xl items-start px-4 pb-24 pt-24 sm:px-10 sm:pb-24 sm:pt-28 lg:px-16">
<div className="mx-auto max-w-4xl text-center">
          <h1 className="mt-3 text-[2.35rem] font-black leading-[1.04] sm:text-5xl lg:text-6xl">
            <span className="block text-white font-semibold italic text-2xl drop-shadow-[0_2px_3px_rgba(0,0,0,0.9)] sm:text-3xl">Welcome to</span>
            <span className="mt-1 block text-[2rem] text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] sm:text-4xl lg:text-5xl">{siteName || 'Dankamf Educational Complex'}</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg font-medium italic leading-relaxed text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.8)] sm:text-xl">
            Changing lives through Godly principles and quality education.
          </p>
          <div className="mx-auto mt-7 grid w-full max-w-2xl grid-cols-3 gap-2 sm:mt-8 sm:flex sm:flex-wrap sm:items-center sm:justify-center sm:gap-4">
            <Link to="/admissions/apply" className="inline-flex min-h-9 w-full items-center justify-center rounded-full border border-blue-200 bg-white/5 px-1 py-1.5 text-[11px] font-bold leading-tight text-white shadow-lg ring-2 ring-blue-700/70 ring-offset-1 ring-offset-transparent backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:bg-white hover:text-primary active:translate-y-0 sm:w-fit sm:px-4 sm:text-sm">Enroll Online</Link>
            <Link to="/about" className="inline-flex min-h-9 w-full items-center justify-center rounded-full border border-blue-200 bg-white/5 px-1 py-1.5 text-[11px] font-bold leading-tight text-white ring-2 ring-blue-700/70 ring-offset-1 ring-offset-transparent backdrop-blur-sm transition hover:bg-white hover:text-primary sm:w-fit sm:px-4 sm:text-sm">About Us</Link>
            <Link to="/contact" className="inline-flex min-h-9 w-full items-center justify-center rounded-full border border-blue-200 bg-white/5 px-1 py-1.5 text-[11px] font-bold leading-tight text-white ring-2 ring-blue-700/70 ring-offset-1 ring-offset-transparent backdrop-blur-sm transition hover:bg-blue-100 hover:text-primary sm:w-fit sm:px-4 sm:text-sm">Contact Us</Link>
          </div>
        </div>
      </div>

      {images.length > 1 && (
        <div className="hero-controls absolute bottom-44 left-1/2 flex max-w-[calc(100%-1.5rem)] -translate-x-1/2 items-center gap-2 rounded-full border border-white/25 bg-primary-dark/55 px-2 py-1.5 shadow-lg backdrop-blur-md sm:bottom-[50%] sm:gap-3 sm:px-3">
          <button
            type="button"
            onClick={showPrevious}
            aria-label="Previous hero image"
            className="hero-control-button flex h-8 w-8 items-center justify-center rounded-full border border-white/20 text-base font-bold text-white transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-electric-blue"
          >
            <span aria-hidden="true">‹</span>
          </button>
          <button
            type="button"
            onClick={() => setIsPaused((paused) => !paused)}
            aria-label={isPaused ? 'Play hero slideshow' : 'Pause hero slideshow'}
            className="hero-control-button flex h-8 w-8 items-center justify-center rounded-full border border-white/20 text-xs font-bold text-white transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-electric-blue"
          >
            <span aria-hidden="true">{isPaused ? '▶' : 'Ⅱ'}</span>
          </button>
          <button
            type="button"
            onClick={showNext}
            aria-label="Next hero image"
            className="hero-control-button flex h-8 w-8 items-center justify-center rounded-full border border-white/20 text-base font-bold text-white transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-electric-blue"
          >
            <span aria-hidden="true">›</span>
          </button>
        </div>
      )}
    </section>
  );
}

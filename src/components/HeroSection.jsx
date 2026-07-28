import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const heroImages = [
  '/images/hero-banner-01.webp',
  '/images/hero-banner-02.webp',
  '/images/hero-banner-03.webp',
  '/images/hero-banner-04.webp',
  '/images/hero-banner-05.webp',
   '/images/hero-banner-06.webp',
    '/images/hero-banner-07.webp',

];
 
export default function HeroSection({ siteName, tagline }) {
  const [activeImage, setActiveImage] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused || heroImages.length < 2) return undefined;

    const timer = window.setInterval(() => {
      setActiveImage((current) => (current + 1) % heroImages.length);
    }, 6500);

    return () => window.clearInterval(timer);
  }, [isPaused]);

  const showPrevious = () => {
    setActiveImage((current) => (current - 1 + heroImages.length) % heroImages.length);
  };

  const showNext = () => {
    setActiveImage((current) => (current + 1) % heroImages.length);
  };

  return (
    <section
      className="relative isolate min-h-[60vh] overflow-hidden bg-primary-dark text-white sm:min-h-[70vh]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setIsPaused(false);
      }}
      aria-roledescription="carousel"
      aria-label="Dankamf Educational Complex highlights"
    >
      {heroImages.map((image, index) => (
        <img
          key={image}
          src={image}
          alt=""
          aria-hidden="true"
          className={`absolute inset-0 -z-20 h-full w-full object-cover object-top transition-opacity duration-1000 ${
            index === activeImage ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}
      <div className="absolute inset-0 -z-10 bg-primary-dark/0" />
 
      <div className="mx-auto max-w-6xl px-4 pb-20 pt-20 sm:px-10 sm:pb-24 sm:pt-28 lg:px-16">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mt-3 text-[2.35rem] font-black leading-[1.04] sm:text-5xl lg:text-6xl">
            <span className="inline-block text-accent-yellow font-semibold text-2xl drop-shadow-[0_2px_3px_rgba(0,0,0,0.9)] sm:text-3xl">Welcome to</span>
            <span className="mt-1 inline-block text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">{siteName || 'Dankamf Educational Complex'}</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg font-medium italic leading-relaxed text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.8)] sm:text-xl">
            Changing lives through Godly principles and quality education.
          </p>
          <div className="mx-auto mt-8 flex max-w-2xl flex-wrap items-center justify-center gap-3 sm:gap-4">
            <Link to="/admissions/apply" className="inline-flex min-h-9 w-fit items-center justify-center rounded-full border border-blue-200 bg-white/10 px-4 py-1.5 text-sm font-bold text-white shadow-lg ring-2 ring-blue-700/70 ring-offset-1 ring-offset-transparent backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:bg-white hover:text-primary active:translate-y-0">Apply Now</Link>
            <Link to="/book-a-tour" className="inline-flex min-h-9 w-fit items-center justify-center rounded-full border border-blue-200 bg-white/10 px-4 py-1.5 text-sm font-bold text-white ring-2 ring-blue-700/70 ring-offset-1 ring-offset-transparent backdrop-blur-sm transition hover:bg-white hover:text-primary">Book a Tour</Link>
            <Link to="/contact" className="inline-flex min-h-9 w-fit items-center justify-center rounded-full border border-blue-200 bg-primary-dark/30 px-4 py-1.5 text-sm font-bold text-white ring-2 ring-blue-700/70 ring-offset-1 ring-offset-transparent backdrop-blur-sm transition hover:bg-blue-100 hover:text-primary">Contact Us</Link>
          </div>
        </div>
      </div>

      {heroImages.length > 1 && (
        <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-3 rounded-full bg-primary-dark/50 px-3 py-1.5 backdrop-blur-sm">
          <button
            type="button"
            onClick={showPrevious}
            aria-label="Previous hero image"
            className="flex h-7 w-7 items-center justify-center rounded-full text-white transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-accent-yellow"
          >
            <span aria-hidden="true">‹</span>
          </button>
          <div className="flex items-center gap-2" role="tablist" aria-label="Hero images">
            {heroImages.map((image, index) => (
              <button
                key={image}
                type="button"
                role="tab"
                aria-selected={index === activeImage}
                aria-label={`Show hero image ${index + 1}`}
                onClick={() => setActiveImage(index)}
                className={`h-1.5 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-accent-yellow ${
                  index === activeImage ? 'w-7 bg-accent-yellow' : 'w-1.5 bg-white/70'
                }`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={showNext}
            aria-label="Next hero image"
            className="flex h-7 w-7 items-center justify-center rounded-full text-white transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-accent-yellow"
          >
            <span aria-hidden="true">›</span>
          </button>
        </div>
      )}
    </section>
  );
}

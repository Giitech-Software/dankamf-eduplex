import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const heroImages = [
  '/images/hero-banner.webp',
  '/images/hero-banner3.webp',
  // Add up to eight additional images here as they become available.
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
      <div className="absolute inset-0 -z-10 bg-primary-dark/65" />
 
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-10 lg:px-16 pt-20 sm:pt-28"> {/* Further reduced top padding */}
        <div className="max-w-4xl text-center mx-auto">
          <h1 className="mt-3 text-[2.35rem] font-black leading-[1.04] sm:text-5xl lg:text-6xl">
            <span className="block text-accent-yellow font-semibold text-2xl sm:text-3xl">Welcome to</span>
            <span className="block mt-1 text-white">{siteName || 'Dankamf Educational Complex'}</span>
          </h1>
          <p className="mt-4 max-w-2xl text-lg font-medium leading-relaxed text-slate-200 sm:text-xl mx-auto">
            A premier educational institution committed to nurturing bright minds and building strong moral foundations for future leaders through excellence in learning and character.
          </p>
          {tagline && (
            <p className="mt-5 max-w-2xl text-xl font-semibold italic leading-snug text-accent-light/90 sm:text-2xl mx-auto">
              "{tagline}"
            </p>
          )}
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link to="/admissions/apply" className="inline-flex w-full items-center justify-center rounded-full bg-accent-yellow px-5 py-2.5 text-sm font-bold text-darkgray shadow-lg transition-all hover:-translate-y-0.5 hover:bg-accent-yellow-dark active:translate-y-0 sm:w-auto sm:px-6">Apply Now</Link>
            <Link to="/book-a-tour" className="inline-flex w-full items-center justify-center rounded-full border border-white/70 bg-white/10 px-5 py-2.5 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white hover:text-primary sm:w-auto sm:px-6">Book a Tour</Link>
          </div>
        </div>
      </div>

      {heroImages.length > 1 && (
        <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-3 rounded-full bg-primary-dark/50 px-3 py-2 backdrop-blur-sm">
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

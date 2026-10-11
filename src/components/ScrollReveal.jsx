import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Adds lightweight, CSS-driven reveals to public page content after route changes.
// CSS keeps this progressive: content remains visible if JavaScript is unavailable.
export default function ScrollReveal() {
  const location = useLocation();

  useEffect(() => {
    let observer;
    const frame = window.requestAnimationFrame(() => {
      const sections = document.querySelectorAll(
        '.public-site main section:not([aria-roledescription="carousel"])'
      );

      sections.forEach((section) => {
        section.classList.add('scroll-section-reveal');
        const candidates = section.querySelectorAll('h1, h2, h3, h4, h5, h6, p, img, video');
        candidates.forEach((element, index) => {
          if (element.closest('[role="dialog"]')) return;
          element.classList.add('scroll-reveal');
          if (/^H[1-6]$/.test(element.tagName)) element.classList.add('scroll-title');
          element.style.setProperty('--reveal-delay', `${Math.min(index * 110, 440)}ms`);
        });
      });

      observer = new IntersectionObserver(
        (entries, currentObserver) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-visible');
            currentObserver.unobserve(entry.target);
          });
        },
        { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
      );

      document.querySelectorAll('.scroll-section-reveal, .scroll-reveal').forEach((element) => observer.observe(element));
    });

    return () => {
      window.cancelAnimationFrame(frame);
      observer?.disconnect();
    };
  }, [location.pathname, location.search]);

  return null;
}

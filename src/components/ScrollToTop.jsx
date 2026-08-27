import { useEffect, useState } from 'react';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';
import { useLocation, useNavigationType } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname, search, hash } = useLocation();
  const navigationType = useNavigationType();
  const [showButton, setShowButton] = useState(false);
  const [atBottom, setAtBottom] = useState(false);
  const [scrollDirection, setScrollDirection] = useState('down');

  useEffect(() => {
    if (navigationType === 'POP') return undefined;
    if (hash) {
      let attempts = 0;
      const timer = setInterval(() => {
        const target = document.getElementById(hash.slice(1));
        attempts += 1;
        if (target || attempts >= 30) {
          clearInterval(timer);
          target?.scrollIntoView({ behavior: 'auto', block: 'start' });
        }
      }, 100);
      return () => clearInterval(timer);
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    return undefined;
  }, [pathname, search, hash, navigationType]);

  useEffect(() => {
    let hideTimer;
    let previousY = window.scrollY;
    const getPageHeight = () => Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
    const activate = () => {
      const pageHeight = getPageHeight();
      const currentY = window.scrollY;
      if (Math.abs(currentY - previousY) > 2) setScrollDirection(currentY < previousY ? 'up' : 'down');
      previousY = currentY;
      const bottom = currentY + window.innerHeight >= pageHeight - 120;
      setAtBottom(bottom);
      setShowButton(currentY > 420 && pageHeight > window.innerHeight + 420);
      clearTimeout(hideTimer);
      hideTimer = window.setTimeout(() => setShowButton(false), 2000);
    };

    const handleScroll = () => activate();
    const handleInteraction = () => {
      if (window.scrollY > 420) activate();
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('touchstart', handleInteraction, { passive: true });
    window.addEventListener('pointerdown', handleInteraction, { passive: true });
    window.addEventListener('keydown', handleInteraction);
    return () => {
      clearTimeout(hideTimer);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('touchstart', handleInteraction);
      window.removeEventListener('pointerdown', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
    };
  }, []);

  return showButton ? (
    <button type="button" onClick={() => { const goToTop = atBottom || scrollDirection === 'up'; const pageHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight); window.scrollTo({ top: goToTop ? 0 : pageHeight, behavior: 'smooth' }); }} aria-label={atBottom || scrollDirection === 'up' ? 'Back to top' : 'Scroll to bottom'} title={atBottom || scrollDirection === 'up' ? 'Back to top' : 'Scroll to bottom'} className="fixed bottom-24 right-4 z-[80] inline-flex items-center gap-2 rounded-full border border-white/60 bg-primary/55 px-3 py-2 text-xs font-black uppercase tracking-wider text-white shadow-lg backdrop-blur-md transition hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-white/80 sm:bottom-24 sm:right-6">
      {atBottom || scrollDirection === 'up' ? <FaArrowUp aria-hidden="true" /> : <FaArrowDown aria-hidden="true" />}
      <span>{atBottom || scrollDirection === 'up' ? 'Back to top' : 'Scroll to bottom'}</span>
    </button>
  ) : null;
}

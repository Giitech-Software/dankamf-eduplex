import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BriefcaseBusiness,
  FolderKanban,
  HelpCircle,
  MessageCircle,
  Send,
  Sparkles,
  X,
} from 'lucide-react';

const sessionKey = 'dankamf-guided-assistant-shown';
const whatsappUrl =
  'https://wa.me/233242172216?text=Hello%20Dankamf%20Eduplex%2C%20I%20would%20like%20to%20make%20an%20inquiry.';

const options = [
  {
    label: 'Explore Academics',
    description: 'Review our academic programs.',
    to: '/services',
    icon: BriefcaseBusiness,
  },
  {
    label: 'See School Life',
    description: 'View events and activities.',
    to: '/projects',
    icon: FolderKanban,
  },
  {
    label: 'Admissions & Inquiries',
    description: 'Get in touch with our team.',
    to: '/contact',
    icon: Send,
  },
  {
    label: 'Read FAQs',
    description: 'Find quick answers and guidance.',
    to: '/faqs',
    icon: HelpCircle,
  },
];

export default function GuidedAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const dragRef = React.useRef(null);
  const didDragRef = React.useRef(false);
  const isNearTop = offset.y < -(window.innerHeight * 0.3);

  const handlePointerMove = (event) => {
    if (!dragRef.current) return;
    const deltaX = event.clientX - dragRef.current.startX;
    const deltaY = event.clientY - dragRef.current.startY;
    if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) didDragRef.current = true;
    const nextX = dragRef.current.originX + deltaX;
    const nextY = dragRef.current.originY + deltaY;
    setOffset({
      x: Math.max(-window.innerWidth + 90, Math.min(0, nextX)),
      y: Math.max(-(window.innerHeight - 136), Math.min(0, nextY)),
    });
  };

  const handlePointerUp = () => {
    dragRef.current = null;
    window.removeEventListener('pointermove', handlePointerMove);
    window.removeEventListener('pointerup', handlePointerUp);
  };

  const handlePointerDown = (event) => {
    event.preventDefault();
    didDragRef.current = false;
    dragRef.current = { startX: event.clientX, startY: event.clientY, originX: offset.x, originY: offset.y };
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp, { once: true });
  };

  const openAssistant = () => {
    setOffset((current) => ({ ...current, x: 0, y: 0 }));
    setIsOpen(true);
  };

  useEffect(() => {
    try {
      if (sessionStorage.getItem(sessionKey)) return undefined;
    } catch (error) {
      console.warn('sessionStorage not available:', error);
    }

    const handleScroll = () => {
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
      const hasReachedTrigger = scrollableHeight > 0 && window.scrollY / scrollableHeight >= 0.25;

      if (!hasReachedTrigger) return;

      try {
        sessionStorage.setItem(sessionKey, 'true');
      } catch (error) {
        console.warn('sessionStorage not available:', error);
      }

      setIsOpen(true);
      window.removeEventListener('scroll', handleScroll);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className={`fixed bottom-4 right-4 z-[60] flex items-end sm:bottom-6 sm:right-6 ${isNearTop ? 'flex-col-reverse' : 'flex-col'}`}
      style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}
    >
      {isOpen && (
        <section
          aria-label="Dankamf guided assistant"
          className={`${isNearTop ? 'mt-2' : 'mb-2'} w-[calc(100vw-2rem)] max-w-[15rem] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl shadow-slate-950/20`}
        >
          <div className="flex items-start justify-between bg-gradient-to-r from-primary to-accent px-3 py-2 text-white">
              <div className="flex items-center gap-2">
              <div className="rounded-lg bg-white/10 p-1 text-white ring-1 ring-white/20">
                <Sparkles className="h-4 w-4" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-white">
                  Dankamf Connect
                </p>
                <p className="mt-0.5 text-xs text-slate-300">How can we help?</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                setOffset((current) => ({ ...current, x: 0 }));
              }}
              className="rounded-md p-1 text-slate-300 transition hover:bg-white/10 hover:text-white"
              aria-label="Close assistant"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

            <div className="p-1.5">
            <p className="px-1 pb-1 text-[10px] font-bold leading-snug text-slate-600">
              Explore our site or start a conversation with our team.
            </p>

            <div className="space-y-1">
              {options.map(option => {
                const Icon = option.icon;

                return (
                  <Link
                    key={option.label}
                    to={option.to}
                    onClick={() => setIsOpen(false)}
                    className="group flex items-center gap-1.5 rounded-lg border border-transparent px-1 py-1 transition hover:border-slate-200 hover:bg-slate-50"
                  >
                    <span className="rounded-md bg-accent-light p-1.5 text-accent transition group-hover:bg-accent group-hover:text-white">
                      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[10px] font-black text-slate-900">{option.label}</span>
                      <span className="mt-0.5 block text-[10px] leading-tight text-slate-500">
                        {option.description}
                      </span>
                    </span>
                  </Link>
                );
              })}
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 flex items-center justify-center gap-1.5 rounded-lg bg-green-500 px-2 py-1.5 text-[10px] font-black uppercase tracking-[0.08em] text-white transition hover:bg-green-600"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              Chat on WhatsApp
            </a>
          </div>
        </section>
      )}

      {!isOpen && (
        <button
          type="button"
          onClick={() => {
            if (didDragRef.current) {
              didDragRef.current = false;
              return;
            }
            openAssistant();
          }}
          onPointerDown={handlePointerDown}
          aria-label="Open Dankamf assistant"
          className="inline-flex h-10 cursor-grab touch-none items-center justify-center gap-1.5 rounded-full border border-slate-200/80 bg-primary/40 px-3 text-white shadow-lg shadow-slate-950/20 ring-1 ring-white/40 backdrop-blur-sm transition hover:-translate-y-0.5 hover:bg-primary/60 focus:outline-none focus:ring-4 focus:ring-slate-300/60 active:cursor-grabbing"
        >
          <MessageCircle className="h-5 w-5 animate-bounce text-red-600 drop-shadow-sm" aria-hidden="true" />
          <span className="text-[10px] font-black uppercase tracking-[0.1em]">Let's Chat</span>
        </button>
      )}
    </div>
  );
}

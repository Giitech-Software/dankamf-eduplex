// src/components/PublicHeader.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Disclosure } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../assets/logo.png'; // Add your logo in src/assets
import { Search } from 'lucide-react';

const animatedTexts = [
  { text: '📚 Excellence in Learning', style: 'bg-primary text-white' },
  { text: '✨ A Modern Approach', style: 'bg-electric-blue text-primary' },
  { text: '🚀 Building Future Leaders', style: 'bg-sky-blue text-primary' },
  { text: '🌟 Nurturing Bright Minds', style: 'bg-slate-100 text-primary' },
  { text: '🙏 Godly Principles', style: 'bg-blue-100 text-primary' },
  { text: '🎓 Quality Education', style: 'bg-cerulean text-white' },
  { text: '💡 Innovation in Teaching', style: 'bg-slate-100 text-primary' },
  { text: '🛡️ Character & Integrity', style: 'bg-blue-100 text-primary' },
  { text: '🌍 A Global Perspective', style: 'bg-sky-blue text-primary' },
  { text: '🔑 Your Future Starts Here', style: 'bg-primary text-white' },
  { text: '🌱 Growing With Purpose', style: 'bg-ice-blue text-primary' },
  { text: '🏆 Inspiring Excellence', style: 'bg-electric-blue text-primary' },
  { text: '🤝 Learning Together', style: 'bg-slate-100 text-primary' },
  { text: '🎯 Focused on Success', style: 'bg-sky-blue text-primary' },
  { text: '❤️ Shaping Good Character', style: 'bg-blue-100 text-primary' },
];

export default function PublicHeader() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const [index, setIndex] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [mobileMoreOpen, setMobileMoreOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % animatedTexts.length);
    }, 3000); // Change text every 3 seconds
    return () => clearInterval(timer);
  }, []);

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'Academics', to: '/academics' },
    { label: 'School Life', to: '/student-life' },
    { label: 'Gallery', to: '/gallery' },
    { label: 'News', to: '/blog' },
    { label: 'Admissions', to: '/admissions' },
    { label: 'Contact', to: '/contact' },
  ];

  const isActive = (path) => currentPath === path;

  const handleSearch = (event) => {
    event.preventDefault();
    const query = searchTerm.trim().toLowerCase();
    if (!query) return;

    navigate(`/search?q=${encodeURIComponent(query)}`);
    setSearchTerm('');
    setSearchOpen(false);
  };

  return (
    <Disclosure as="nav" className="sticky top-0 z-50 w-full border-b-2 border-electric-blue bg-midnight text-white shadow-md">
      {({ open, close }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo + Brand */}
              <div className="flex min-w-0 flex-1 items-center gap-2">
                <img src={logo} alt="Dankamf Eduplex logo" className="h-11 w-11 shrink-0 rounded-full bg-white p-1 object-contain" />
                <div className="relative h-6 w-56 overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.5 }}
                      className={`absolute left-0 top-0 inline-flex h-6 w-max max-w-full items-center whitespace-nowrap rounded-full px-2.5 text-xs font-black tracking-wide shadow-md sm:text-sm ${animatedTexts[index].style}`}
                    >
                      {animatedTexts[index].text}
                    </motion.span>
                  </AnimatePresence>
                </div>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-2 text-sm">
                {navLinks.map(({ label, to }) => (
                  <Link
                    key={to}
                    to={to}
                    className={`rounded-full px-2.5 py-1.5 text-xs font-bold transition ${
                      isActive(to) ? 'bg-white/20 text-white ring-1 ring-electric-blue' : 'text-white/90 hover:bg-white/15 hover:text-white'
                    }`}
                  >
                    {label}
                  </Link>
                ))}

                <div className="group relative">
                  <button type="button" className="inline-flex items-center gap-1 rounded-full border border-sky-blue/70 bg-white/10 px-2.5 py-1.5 text-xs font-bold text-white transition hover:bg-white/20 hover:text-electric-blue">
                    More <span className="text-xs" aria-hidden="true">⌄</span>
                  </button>
                  <div className="invisible absolute right-0 top-full z-50 mt-4 w-72 translate-y-2 rounded-xl border border-slate-100 bg-white p-3 text-darkgray opacity-0 shadow-2xl transition-all group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                    <p className="px-3 pb-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Explore Dankamf</p>
                    <div className="grid grid-cols-2 gap-1">
                      {[
                        ['About Us', '/about'], ['Our Staff', '/staff'], ['Enroll Online', '/admissions/apply'],
                        ['FAQs', '/faqs'], ['Calendar', '/calendar'], ['Check Status', '/admissions/status'], ['Downloads', '/downloads'],
                        ['Testimonials', '/client-confidence'], ['Alumni', '/alumni'], ['Careers & Vacancies', '/jobs'], ['Contact Us', '/contact'],
                      ].map(([label, to]) => (
                        <Link key={to} to={to} className="rounded-lg px-3 py-2 text-sm font-semibold transition hover:bg-accent-light hover:text-primary">
                          {label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSearch} className={`relative ml-2 flex items-center transition-all ${searchOpen ? 'w-36' : 'w-8'}`}>
                  {searchOpen && (
                    <input
                      autoFocus
                      value={searchTerm}
                      onChange={(event) => setSearchTerm(event.target.value)}
                      placeholder="Search sections"
                      aria-label="Search website"
                      className="w-36 rounded-full border border-white/20 bg-white px-3 py-1.5 pr-8 text-xs text-darkgray outline-none ring-accent-yellow focus:ring-2"
                    />
                  )}
                  <button
                    type={searchOpen ? 'submit' : 'button'}
                    onClick={() => setSearchOpen(true)}
                    aria-label="Search website"
                    className="absolute right-1 inline-flex h-7 w-7 items-center justify-center rounded-full text-white transition hover:bg-white/15 hover:text-electric-blue"
                  >
                    <Search className="h-4 w-4" />
                  </button>
                </form>

              </div>

              {/* Mobile menu button */}
              <div className="relative z-10 ml-3 flex shrink-0 items-center md:hidden">
                <Disclosure.Button
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white transition hover:bg-white/20 hover:text-electric-blue focus:outline-none focus:ring-2 focus:ring-electric-blue"
                  aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
                >
                  {open ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          <Disclosure.Panel className="md:hidden max-h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain border-t border-white/15 bg-midnight px-3 pb-4 pt-3 text-white shadow-xl">
            <form onSubmit={handleSearch} className="mb-3 flex gap-2">
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search sections"
                aria-label="Search website"
                className="min-w-0 flex-1 rounded-full border border-white/20 bg-white px-4 py-2 text-sm text-darkgray outline-none focus:ring-2 focus:ring-accent-yellow"
              />
              <button type="submit" aria-label="Submit search" className="rounded-full bg-accent-yellow px-3 text-darkgray">
                <Search className="h-4 w-4" />
              </button>
            </form>
            {navLinks.map(({ label, to }) => (
              <Link
                key={to}
                to={to}
                onClick={close}
                className={`block rounded-lg px-3 py-3 text-base font-semibold transition ${
                  isActive(to) ? 'bg-white/20 text-white' : 'text-white hover:bg-white/15 hover:text-white'
                }`}
              >
                {label}
              </Link>
            ))}
            <div className="mt-2 border-t border-white/10 pt-3">
              <button type="button" onClick={() => setMobileMoreOpen((value) => !value)} className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs font-black uppercase tracking-[0.2em] text-electric-blue">
                <span>Explore More</span><span aria-hidden="true">{mobileMoreOpen ? '−' : '+'}</span>
              </button>
              {mobileMoreOpen && <div className="grid grid-cols-2 gap-1">
                {[
                  ['About Us', '/about'], ['Our Staff', '/staff'], ['Enroll Online', '/admissions/apply'],
                  ['FAQs', '/faqs'], ['Calendar', '/calendar'],
                  ['Check Status', '/admissions/status'], ['Downloads', '/downloads'],
                  ['Testimonials', '/client-confidence'], ['Alumni', '/alumni'],
                  ['Contact Us', '/contact'],
                ].map(([label, to]) => (
                  <Link key={to} to={to} onClick={close} className="rounded-lg px-3 py-3 text-sm font-semibold text-white transition hover:bg-white/15 hover:text-white">
                    {label}
                  </Link>
                ))}
              </div>}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}

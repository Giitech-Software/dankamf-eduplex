// src/components/PublicHeader.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Disclosure } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png'; // Add your logo in src/assets
import { Search } from 'lucide-react';

const animatedTexts = [
  { text: 'Excellence in Learning', color: 'text-white' },
  { text: 'A Modern Approach', color: 'text-accent' },
  { text: 'Building Future Leaders', color: 'text-highlight' },
  { text: 'Nurturing Bright Minds', color: 'text-white' },
  { text: 'Godly Principles', color: 'text-accent' },
  { text: 'Quality Education', color: 'text-highlight' },
  { text: 'Innovation in Teaching', color: 'text-white' },
  { text: 'Character & Integrity', color: 'text-accent' },
  { text: 'A Global Perspective', color: 'text-highlight' },
  { text: 'Your Future Starts Here', color: 'text-white' },
];

export default function PublicHeader() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const [index, setIndex] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

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
    { label: 'Admissions', to: '/jobs' },
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
    <Disclosure as="nav" className="sticky top-0 z-50 bg-primary text-white shadow-md">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo + Brand */}
              <div className="flex min-w-0 items-center gap-2">
                <img src={logo} alt="Dankamf Eduplex logo" className="h-9 w-9 shrink-0 object-contain" />
                <div className="relative h-6 w-56 overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.5 }}
                      className={`absolute inset-0 flex items-center text-base font-bold tracking-wide sm:text-lg ${animatedTexts[index].color}`}
                    >
                      {animatedTexts[index].text}
                    </motion.span>
                  </AnimatePresence>
                </div>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-6 text-sm">
                {navLinks.map(({ label, to }) => (
                  <Link
                    key={to}
                    to={to}
                    className={`hover:text-accent transition ${
                      isActive(to) ? 'text-accent font-semibold' : 'text-white'
                    }`}
                  >
                    {label}
                  </Link>
                ))}

                <div className="group relative">
                  <button type="button" className="inline-flex items-center gap-1 text-white transition hover:text-accent-yellow">
                    More <span className="text-xs" aria-hidden="true">⌄</span>
                  </button>
                  <div className="invisible absolute right-0 top-full z-50 mt-4 w-72 translate-y-2 rounded-xl border border-slate-100 bg-white p-3 text-darkgray opacity-0 shadow-2xl transition-all group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                    <p className="px-3 pb-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Explore Dankamf</p>
                    <div className="grid grid-cols-2 gap-1">
                      {[
                        ['About Us', '/about'], ['Apply Online', '/admissions/apply'],
                        ['FAQs', '/faqs'], ['Calendar', '/calendar'], ['Check Status', '/admissions/status'], ['Downloads', '/downloads'],
                        ['Testimonials', '/client-confidence'], ['Alumni', '/alumni'], ['Contact Us', '/contact'],
                      ].map(([label, to]) => (
                        <Link key={to} to={to} className="rounded-lg px-3 py-2 text-sm font-semibold transition hover:bg-accent-light hover:text-primary">
                          {label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSearch} className={`relative ml-6 flex items-center transition-all ${searchOpen ? 'w-36' : 'w-8'}`}>
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
                    className="absolute right-1 inline-flex h-7 w-7 items-center justify-center rounded-full text-white transition hover:bg-white/10 hover:text-accent-yellow"
                  >
                    <Search className="h-4 w-4" />
                  </button>
                </form>

                {user && (
                  <Link to="/dashboard" className="bg-white text-primary px-4 py-2 rounded hover:bg-accent hover:text-white">
                    Dashboard
                  </Link>
                )}
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden flex items-center">
                <Disclosure.Button
                  className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-white transition hover:bg-white/10 hover:text-accent focus:outline-none focus:ring-2 focus:ring-white/60"
                  aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
                >
                  {open ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          <Disclosure.Panel className="md:hidden max-h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain border-t border-white/10 bg-primary px-3 pb-4 pt-3 shadow-xl">
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
                className={`block rounded-lg px-3 py-3 text-base font-semibold transition ${
                  isActive(to) ? 'bg-accent text-white' : 'text-white hover:bg-white hover:text-primary'
                }`}
              >
                {label}
              </Link>
            ))}
            <div className="mt-2 border-t border-white/10 pt-3">
              <p className="px-3 pb-2 text-xs font-black uppercase tracking-[0.2em] text-accent-yellow">Explore More</p>
              <div className="grid grid-cols-2 gap-1">
                {[
                  ['About Us', '/about'], ['Apply Online', '/admissions/apply'],
                  ['FAQs', '/faqs'], ['Calendar', '/calendar'],
                  ['Check Status', '/admissions/status'], ['Downloads', '/downloads'],
                  ['Testimonials', '/client-confidence'], ['Alumni', '/alumni'],
                  ['Contact Us', '/contact'],
                ].map(([label, to]) => (
                  <Link key={to} to={to} className="rounded-lg px-3 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-primary">
                    {label}
                  </Link>
                ))}
              </div>
            </div>
            {user && (
              <Link to="/dashboard" className="mt-2 block rounded-lg bg-white px-3 py-3 text-center text-base font-bold text-primary">
                Dashboard
              </Link>
            )}
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}

import React from 'react';
import Seo from '../components/Seo';
import UpcomingEvents from '../components/UpcomingEvents';

export default function Calendar() {
  return <><Seo title="School Calendar | Dankamf Educational Complex" description="View upcoming school events, activities, and important dates at Dankamf Educational Complex." /><main className="min-h-screen bg-background-alt"><section className="bg-primary-dark px-4 py-14 text-center text-white sm:px-8"><p className="text-xs font-black uppercase tracking-[0.25em] text-accent-yellow">Plan Ahead</p><h1 className="mt-3 text-4xl font-black sm:text-5xl">School Calendar</h1><p className="mx-auto mt-4 max-w-2xl text-slate-300">Stay informed about activities, events, admissions dates, and important school moments.</p></section><UpcomingEvents /></main></>;
}

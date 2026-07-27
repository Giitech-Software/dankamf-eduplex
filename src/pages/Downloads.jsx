import React from 'react';
import Seo from '../components/Seo';
import DownloadCenter from '../components/DownloadCenter';

export default function Downloads() {
  return <><Seo title="Download Center | Dankamf Educational Complex" description="Download prospectuses, admission forms, calendars, policies, and school resources." /><main className="min-h-screen bg-background-alt"><section className="bg-primary-dark px-4 py-14 text-center text-white sm:px-8"><p className="text-xs font-black uppercase tracking-[0.25em] text-accent-yellow">School Resources</p><h1 className="mt-3 text-4xl font-black sm:text-5xl">Download Center</h1><p className="mx-auto mt-4 max-w-2xl text-slate-300">Everything families need to prepare, plan, and stay connected with Dankamf.</p></section><DownloadCenter /></main></>;
}

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, GraduationCap, Microscope, Palette, Users } from 'lucide-react';
import Seo from '../components/Seo';

const levels = [
  { title: 'Preschool', slug: 'creche-nursery', icon: <Users />, description: 'A caring, stimulating foundation for our youngest learners.' },
  { title: 'Lower Primary', slug: 'kindergarten-primary', icon: <BookOpen />, description: 'Strong foundations in literacy, numeracy, curiosity, and confidence.' },
  { title: 'Upper Primary', slug: 'kindergarten-primary', icon: <Palette />, description: 'Deeper learning, creativity, collaboration, and growing independence.' },
  { title: 'Junior High School', slug: 'junior-high-school', icon: <Microscope />, description: 'Rigorous academics, leadership development, and character formation.' },
  { title: 'Senior High School', slug: 'senior-high-school', icon: <GraduationCap />, description: 'A future-focused pathway for advanced learning and university readiness.' },
];

export default function Academics() {
  return <><Seo title="Academics | Dankamf Educational Complex" description="Explore academic levels, programmes, and learning pathways at Dankamf Educational Complex." /><main className="min-h-screen bg-background-alt"><section className="bg-primary-dark px-4 py-14 text-center text-white sm:px-8"><p className="text-xs font-black uppercase tracking-[0.25em] text-accent-yellow">Learning Pathways</p><h1 className="mt-3 text-4xl font-black sm:text-5xl">Academics at Dankamf</h1><p className="mx-auto mt-4 max-w-3xl text-slate-300">A purposeful journey from early childhood through advanced preparation for the future.</p></section><section className="px-4 py-12 sm:px-8 sm:py-16"><div className="mx-auto max-w-7xl"><div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{levels.map((level) => <article key={level.title} className="group flex flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl"><div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-light text-primary">{level.icon}</div><h2 className="mt-5 text-2xl font-black text-primary">{level.title}</h2><p className="mt-3 flex-1 leading-relaxed text-text-light">{level.description}</p><Link to={`/academics/${level.slug}`} className="mt-6 inline-flex items-center gap-2 text-sm font-black uppercase tracking-wider text-accent hover:text-primary">Explore programme <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></Link></article>)}</div></div></section></main></>;
}

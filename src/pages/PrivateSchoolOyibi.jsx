import React from 'react';
import { Link } from 'react-router-dom';
import Seo from '../components/Seo';

const faqItems = [
  { question: 'Where is Dankamf Educational Complex located?', answer: 'Dankamf Educational Complex is located in Oyibi, within the Kpone-Katamanso area of the Greater Accra Region, Ghana.' },
  { question: 'Which levels does the school offer?', answer: 'The school provides nursery, kindergarten, primary, and Junior High School education.' },
  { question: 'Does the school provide ICT and STEM learning?', answer: 'Yes. Learners have opportunities to develop ICT, coding, STEM, creativity, and problem-solving skills.' },
  { question: 'How can I enrol my child?', answer: 'Families can review the admissions information and submit an online enrolment application through the school website.' },
];

export default function PrivateSchoolOyibi() {
  return (
    <>
      <Seo
        title="Private School in Oyibi, Kpone-Katamanso | Dankamf Educational Complex"
        description="Discover Dankamf Educational Complex, a trusted private basic school in Oyibi, Kpone-Katamanso, Greater Accra, offering nursery, kindergarten, primary, and JHS education."
        path="/private-school-oyibi"
        faqItems={faqItems}
      />
      <main className="min-h-screen bg-background-alt">
        <section className="bg-primary-dark px-4 py-10 text-center text-white sm:px-8 sm:py-14">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-accent-yellow">A trusted school community in Oyibi</p>
          <h1 className="mx-auto mt-3 max-w-4xl text-4xl font-black sm:text-5xl">Private School in Oyibi, Kpone-Katamanso</h1>
          <p className="mx-auto mt-4 max-w-3xl text-base leading-relaxed text-slate-300 sm:text-lg">Dankamf Educational Complex provides quality basic education, strong moral foundations, and future-ready learning for children in Oyibi and the wider Greater Accra community.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/admissions/apply" className="rounded-full bg-accent-yellow px-5 py-2.5 text-sm font-black text-darkgray transition hover:bg-white">Enrol Online</Link>
            <Link to="/book-a-tour" className="rounded-full border border-white/60 px-5 py-2.5 text-sm font-black text-white transition hover:bg-white hover:text-primary">Book a Campus Tour</Link>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-10 sm:px-8 sm:py-14">
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
            <div className="space-y-5 text-text-light">
              <div><p className="text-xs font-black uppercase tracking-[0.2em] text-accent">About our school</p><h2 className="mt-2 text-3xl font-black text-primary">A strong foundation for every learner</h2></div>
              <p>Dankamf Educational Complex is a private basic school serving families in Oyibi, Kpone-Katamanso, and the Greater Accra Region. We support learners from the early years through Junior High School with purposeful teaching, continuous support, and a caring school community.</p>
              <p>Our approach brings together academic excellence, discipline, creativity, leadership, ICT, STEM learning, sports, arts, and character development grounded in Godly principles.</p>
              <Link to="/about" className="inline-flex rounded-full border border-primary px-5 py-2.5 text-sm font-black text-primary hover:bg-primary hover:text-white">Discover Our Story</Link>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {['Nursery & Kindergarten', 'Primary School', 'Junior High School', 'ICT, Coding & STEM'].map((item) => <div key={item} className="rounded-xl border border-blue-200 bg-white p-4 shadow-sm"><h3 className="font-black text-primary">{item}</h3><p className="mt-1 text-sm leading-relaxed text-text-light">Learner-centred teaching, confidence-building activities, and practical preparation for the next stage.</p></div>)}
            </div>
          </div>
        </section>

        <section className="bg-white px-4 py-10 sm:px-8 sm:py-14">
          <div className="mx-auto max-w-6xl"><div className="mb-7 text-center"><p className="text-xs font-black uppercase tracking-[0.2em] text-accent">The Dankamf advantage</p><h2 className="mt-2 text-3xl font-black text-primary">Why families choose Dankamf</h2></div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{['Quality teaching and learner support', 'Discipline, character, and Godly values', 'ICT, coding, STEM, sports, and arts', 'Safe and supportive school environment', 'Leadership and confidence development', 'A welcoming partnership with families'].map((item) => <article key={item} className="rounded-xl border border-slate-200 bg-background-alt p-5"><h3 className="font-black text-primary">{item}</h3><p className="mt-2 text-sm leading-relaxed text-text-light">Designed to help every learner grow academically, socially, morally, and practically.</p></article>)}</div><div className="mt-7 text-center"><Link to="/school-capabilities" className="inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-black text-white hover:bg-primary-dark">Explore Why Choose Dankamf</Link></div></div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-10 sm:px-8 sm:py-14"><div className="grid gap-8 lg:grid-cols-2"><div><p className="text-xs font-black uppercase tracking-[0.2em] text-accent">School achievements</p><h2 className="mt-2 text-3xl font-black text-primary">A culture of progress and excellence</h2><p className="mt-4 leading-relaxed text-text-light">Dankamf Educational Complex continues to pursue strong learning outcomes, learner development, innovation, talent growth, and meaningful community impact. Our achievements and school updates are shared through the News &amp; Events section.</p><Link to="/blog" className="mt-5 inline-flex rounded-full border border-primary px-5 py-2.5 text-sm font-black text-primary hover:bg-primary hover:text-white">Read News &amp; Achievements</Link></div><div className="rounded-2xl border border-blue-200 bg-blue-50 p-6"><h2 className="text-xl font-black text-primary">Plan your next step</h2><p className="mt-2 leading-relaxed text-text-light">Learn about enrolment, visit the campus, or contact the school admissions team for guidance.</p><div className="mt-5 flex flex-wrap gap-3"><Link to="/admissions" className="rounded-full bg-primary px-4 py-2 text-sm font-bold text-white">Admissions</Link><Link to="/contact" className="rounded-full border border-primary px-4 py-2 text-sm font-bold text-primary">Contact Us</Link></div></div></div></section>

        <section className="bg-primary-dark px-4 py-10 text-white sm:px-8 sm:py-14"><div className="mx-auto max-w-4xl"><h2 className="text-3xl font-black">Frequently asked questions</h2><div className="mt-6 grid gap-4 sm:grid-cols-2">{faqItems.map((item) => <article key={item.question} className="rounded-xl border border-white/15 bg-white/10 p-5"><h3 className="font-black">{item.question}</h3><p className="mt-2 text-sm leading-relaxed text-slate-300">{item.answer}</p></article>)}</div></div></section>
      </main>
    </>
  );
}

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import SeoConfig from '../config/SeoConfig';
import LeadershipSection from '../components/LeadershipSection';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import ReactMarkdown from 'react-markdown';

const defaults = {
  history: 'Dankamf Educational Complex was established on 11th January 2016 by Elder Daniel Attrams and Dcn Mrs Florence Attrams with the vision of transforming lives through quality education. Since its inception, the school has remained committed to nurturing academically excellent, morally upright, and socially responsible learners.',
  headteacherMessage: 'It is my great pleasure to welcome you to Dankamf Educational Complex, a school dedicated to nurturing excellence in academics, character, creativity, and leadership. Together, let us inspire young minds, build strong character, and prepare our children for a bright future.',
  vision: 'To be a leader in private education by empowering students with Godly principles and values to become productive, caring, and results-oriented leaders.',
  mission: 'We provide the highest quality education in Christ-centred principles and values so that students are empowered to lead productive and fulfilling lives as lifelong learners and responsible citizens.',
  values: 'Excellence, Integrity, Equity, and Citizenship, all rooted in the fear of God.',
  achievements: '',
  educationalPhilosophy: '',
  schoolIntroduction: '',
};

const AboutUs = () => {
  const [about, setAbout] = useState(defaults);
  useEffect(() => { getDoc(doc(db, 'about', 'schoolProfile')).then((snap) => { if (snap.exists()) setAbout((prev) => ({ ...prev, ...snap.data() })); }).catch(console.error); }, []);
  return (
  <>
    <Seo {...SeoConfig.about} />
    <section className="bg-electric-blue px-4 py-6 text-primary sm:px-8 sm:py-8">
      <div className="mx-auto max-w-4xl text-left">
        <div className="text-center">
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">About Dankamf Educational Complex</h1>
        <p className="mt-2 text-sm leading-relaxed text-primary/80 sm:text-base">
          Changing lives through Godly principles and quality education.
        </p>
        </div>
      </div>
    </section>

    <main className="about-page mx-auto max-w-4xl px-4 py-10 text-text sm:px-6 sm:py-12">
      <div className="about-content max-w-none">
        {about.schoolIntroduction && <section className="about-markdown-card">
          <ReactMarkdown>{about.schoolIntroduction}</ReactMarkdown>
        </section>}

        <section className="about-markdown-card">
          <h2>Our History</h2>
          <ReactMarkdown>{about.history}</ReactMarkdown>
        </section>

        <section className="about-markdown-card">
          <h2>Message from the Headmaster</h2>
          {about.headteacherImage && <img src={about.headteacherImage} alt={about.headteacherName || 'Headteacher'} className="mb-5 h-48 w-40 rounded-xl object-cover shadow-md" />}
          {about.headteacherName && <p className="font-bold text-primary">{about.headteacherName} · {about.headteacherRole || 'Headteacher'}</p>}
          <ReactMarkdown>{about.headteacherMessage}</ReactMarkdown>
          {about.proprietorImage && <div className="mt-6 flex items-center gap-4"><img src={about.proprietorImage} alt={about.proprietorName || 'Proprietor'} className="h-24 w-24 rounded-full object-cover" /><p className="font-bold text-primary">{about.proprietorName} · {about.proprietorRole || 'Proprietor'}</p></div>}
        </section>

        <LeadershipSection />

        <section className="about-markdown-card">
          <h2>Our Vision & Mission</h2>
          <h3>Vision</h3>
          <ReactMarkdown>{about.vision}</ReactMarkdown>
          <h3>Mission</h3>
          <ReactMarkdown>{about.mission}</ReactMarkdown>
        </section>

        {about.educationalPhilosophy && <section className="about-markdown-card">
          <h2>Educational Philosophy</h2>
          <ReactMarkdown>{about.educationalPhilosophy}</ReactMarkdown>
        </section>}

        <section className="about-markdown-card">
          <h2>Our Core Values</h2>
          <ReactMarkdown>{about.values}</ReactMarkdown>
        </section>

        {about.achievements ? <section className="about-markdown-card">
          <ReactMarkdown>{about.achievements}</ReactMarkdown>
        </section> : <section className="about-markdown-card">
          <h2>School Achievements</h2>
          <p>At Dankamf Educational Complex, we take pride in our continuous pursuit of excellence in education and the holistic development of our learners. Through the commitment of our dedicated staff, supportive parents, and hardworking students, we have achieved remarkable milestones in academics, character building, and talent development.</p>
          <ul>
            <li><strong>Academic Excellence:</strong> Improved learning outcomes through effective teaching, regular assessment, and focused preparation for national examinations.</li>
            <li><strong>Holistic Learner Development:</strong> Nurturing confident, disciplined, creative, and responsible individuals equipped with essential life skills.</li>
            <li><strong>Dedicated Teaching Team:</strong> A team of passionate educators committed to providing quality instruction and personalized support for every learner.</li>
            <li><strong>Innovation in Learning:</strong> Embracing modern teaching methods and technology to create engaging and meaningful learning experiences.</li>
            <li><strong>Talent & Leadership Development:</strong> Encouraging participation in sports, creative arts, science activities, and leadership programs to discover and develop students’ talents.</li>
            <li><strong>Strong School-Community Partnership:</strong> Working closely with parents and stakeholders to create a supportive environment for learners’ success.</li>
          </ul>
        </section>}
      </div>

      <div className="mt-12 text-center">
        <Link
          to="/contact"
          className="inline-flex w-full justify-center rounded-lg bg-accent px-6 py-3 text-base font-bold text-white shadow-lg transition-all hover:scale-105 sm:w-auto"
        >
          Contact Us for Inquiries
        </Link>
      </div>
    </main>
  </>
  );
};

export default AboutUs;

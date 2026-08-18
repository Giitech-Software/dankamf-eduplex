import React, { useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { 
  FaCogs,
  FaShieldAlt,
  FaUserFriends,
  FaLaptopCode,
  FaMobileAlt,
  FaCloud,
} from 'react-icons/fa';
import { GiTeacher, GiBookshelf, GiPodiumWinner } from 'react-icons/gi';
import { MdOutlineComputer, MdSportsBasketball } from 'react-icons/md';
import { db } from '../firebase/config';
import LoadingSpinner from './LoadingSpinner';
import ReactMarkdown from 'react-markdown';
import { Link } from 'react-router-dom';

const iconClass = 'text-3xl text-accent-yellow';

const fallbackFeatures = [
  {
    icon: <GiTeacher className={iconClass} />,
    title: 'Experienced Educators',
    text: 'Our dedicated and qualified teachers are committed to nurturing each child\'s potential.',
  },
  {
    icon: <GiBookshelf className={iconClass} />,
    title: 'Modern Curriculum',
    text: 'We offer a balanced and comprehensive curriculum that prepares students for the future.',
  },
  {
    icon: <MdOutlineComputer className={iconClass} />,
    title: 'ICT & Science Labs',
    text: 'State-of-the-art facilities to provide hands-on practical learning and digital literacy.',
  },
  {
    icon: <MdSportsBasketball className={iconClass} />,
    title: 'Sports & Arts',
    text: 'A wide range of extracurricular activities to promote physical health and creativity.',
  },
  {
    icon: <FaShieldAlt className={iconClass} />,
    title: 'Safe & Secure Campus',
    text: 'A welcoming and secure environment where students can learn and grow with confidence.',
  },
  {
    icon: <GiPodiumWinner className={iconClass} />,
    title: 'Proven Track Record',
    text: 'A history of academic excellence and producing well-rounded, successful graduates.',
  },
];

export default function FeatureGrid() {
  const [features, setFeatures] = useState(fallbackFeatures);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        const q = query(collection(db, 'enterpriseFeatures'), orderBy('order', 'asc'));
        const snap = await getDocs(q);
        const data = snap.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(feature => feature.title && feature.text);

        if (data.length > 0) {
          setFeatures(data);
        }
      } catch (error) {
        console.error('Error fetching enterprise features:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatures();
  }, []);

  return (
    <section className="bg-gradient-to-b from-[#f8fcff] to-[#eaf6ff] px-0 py-16 sm:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mx-auto mb-8 max-w-3xl px-4 text-center sm:px-0">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-accent sm:text-sm sm:tracking-[0.3em]">
            Why Choose Us
          </p>
          <h3 className="mt-2 text-2xl font-black tracking-tight text-darkgray sm:text-4xl">
            The Dankamf Advantage
          </h3>
          <p className="mt-3 text-base text-text-light leading-relaxed">
            We provide a supportive and enriching environment where every student is empowered to succeed.
          </p>
        </div>

        {loading ? (
          <LoadingSpinner label="Loading enterprise features" />
        ) : (
        <>
        <div className="grid gap-3 px-4 sm:gap-4 sm:px-0 md:grid-cols-2 lg:grid-cols-4">
          {features.slice(0, 6).map(({ id, icon, imageUrl, title, text }) => (
            <div
              key={id || title}
                className={`group overflow-hidden rounded-2xl border border-white/80 bg-white/55 shadow-lg shadow-[#003153]/10 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-cerulean/60 hover:bg-white/80 hover:shadow-xl ${
                imageUrl ? '' : 'p-3 sm:p-4'
              }`}
            >
              {imageUrl ? (
                <div className="h-48 overflow-hidden bg-slate-100 sm:h-64 lg:h-72">
                  <img
                    src={imageUrl}
                    alt={title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              ) : (
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#e0f7ff] to-white shadow-sm ring-1 ring-cerulean/20 group-hover:ring-cerulean/50">
                  {icon}
                </div>
              )}
              <div className={imageUrl ? 'p-3 sm:p-4' : ''}>
                <h4 className="mb-2 text-base font-bold text-slate-950 sm:text-lg">{title}</h4>
                    <div className="prose prose-sm line-clamp-3 max-w-none leading-relaxed text-text-light sm:prose-base"><ReactMarkdown>{text}</ReactMarkdown></div>
                    <Link to={`/school-capabilities#feature-${id}`} className="mt-3 inline-flex text-sm font-black text-accent hover:text-primary">Read More →</Link>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link to="/school-capabilities" className="inline-flex items-center justify-center rounded-full border border-primary/30 bg-white px-4 py-2 text-xs font-black uppercase tracking-widest text-primary transition hover:border-primary hover:bg-blue-50">
            Explore More <span className="ml-2">→</span>
          </Link>
        </div>
        </>
        )}
      </div>
    </section>
  );
}

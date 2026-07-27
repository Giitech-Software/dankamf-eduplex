import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaSchool, FaChild, FaBookReader, FaUserGraduate,
  FaUsersCog, FaCloud, FaHotel, FaChurch,
} from 'react-icons/fa';

function IconCircle({ icon }) {
  return (
    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent-light text-primary text-2xl ring-1 ring-blue-200">
      {icon}
    </div>
  );
}

const services = [
  {
    title: 'Crèche & Nursery',
    icon: <FaChild />,
    text: (
      <>
        A safe, stimulating, and caring environment for our youngest learners to play, explore, and begin their educational journey. Focus on early childhood development.{' '}
        <Link to="/academics/creche-nursery" className="text-accent underline">Learn More</Link>.
      </>
    ),
  },
  {
    title: 'Kindergarten & Primary',
    icon: <FaBookReader />,
    text: (
      <>
        A strong foundation in literacy, numeracy, and critical thinking. Our primary school program fosters curiosity and a love for learning in a structured setting.{' '}
        <Link to="/academics/kindergarten-primary" className="text-accent underline">Explore Primary</Link>.
      </>
    ),
  },
  {
    title: 'Junior High School (JHS)',
    icon: <FaUserGraduate />,
    text: (
      <>
        Preparing students for the next stage of their education with a rigorous academic program, leadership opportunities, and character development initiatives.{' '}
        <Link to="/academics/junior-high-school" className="text-accent underline">Explore JHS</Link>.
      </>
    ),
  },
  {
    title: 'Extracurricular Activities',
    icon: <FaSchool />,
    text: (
      <>
        We offer a variety of clubs, sports, and arts programs to ensure the holistic development of every student, fostering teamwork, creativity, and physical well-being.{' '}
        <Link to="/projects" className="text-accent underline">See Activities</Link>.
      </>
    ),
  },
];

export default function ServiceGrid() {
  return (
    <section className="bg-background-alt px-0 py-16 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 max-w-3xl px-4 sm:px-0">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-accent sm:text-sm sm:tracking-[0.3em]">
            Our Academics
          </p>
          <h3 className="mt-2 text-2xl font-black tracking-tight text-primary-dark sm:text-4xl">
            Programs & Curriculum
          </h3>
          <p className="mt-3 text-base leading-relaxed text-text-light">
            A structured and engaging learning path designed to inspire excellence at every level of education.
          </p>
        </div>

        <div className="grid gap-3 px-4 sm:gap-4 sm:px-0 lg:grid-cols-2">
          {services.map(({ title, icon, text }, i) => (
            <article
              key={i}
              className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 hover:border-accent/50 hover:shadow-lg sm:flex-row sm:p-5"
            >
              <IconCircle icon={icon} />
              <div>
                <h4 className="mb-2 text-lg font-bold text-primary sm:text-xl">{title}</h4>
                <p className="text-sm leading-relaxed text-text-light sm:text-base [&_a]:font-bold [&_a]:text-accent [&_a]:no-underline hover:[&_a]:text-primary">
                  {text}
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 px-4 text-center sm:px-0">
          <Link
            to="/services"
            className="inline-flex items-center justify-center rounded-full bg-accent-yellow px-5 py-2.5 text-xs font-black uppercase tracking-widest text-darkgray shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-accent-yellow-dark hover:shadow-xl"
          >
            Explore All Programs
          </Link>
        </div>
      </div>
    </section>
  );
}

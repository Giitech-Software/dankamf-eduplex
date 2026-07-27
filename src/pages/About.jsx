import React from 'react';
import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import SeoConfig from '../config/SeoConfig';
import LeadershipSection from '../components/LeadershipSection';

const AboutUs = () => (
  <>
    <Seo {...SeoConfig.about} />
    <section className="bg-primary-dark px-4 py-12 text-white sm:px-8 sm:py-16">
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="text-4xl font-black tracking-tight sm:text-5xl">About Dankamf Educational Complex</h1>
        <p className="mt-4 text-lg leading-relaxed text-slate-300">
          Changing lives through Godly principles and quality education.
        </p>
      </div>
    </section>

    <main className="mx-auto max-w-4xl px-4 py-10 text-text sm:px-6 sm:py-12">
      <div className="prose prose-lg max-w-none prose-h2:text-primary prose-h2:font-bold prose-h3:font-semibold">
        <section>
          <h2>Our History</h2>
          <p>Dankamf Educational Complex was established on 11th January 2016 by Elder. Daniel Attrams and Dcns Mrs. Florence Attrams with the vision of transforming lives through quality education. The founders firmly believe that education is the most powerful tool for changing the world and empowering individuals to make meaningful contributions to society.</p>
          <p>The establishment of the school was inspired by the extensive professional experience of Elder Daniel Attrams in the field of education. He holds a Master of Science (MSc.) Degree in Development Policy and Planning from the Kwame Nkrumah University of Science and Technology (KNUST), a Bachelor of Arts Degree in Political Science from the University of Ghana, Legon, and a Certificate in Education from SDA Training College, Asokore-Koforidua.</p>
          <p>Drawing on these rich experiences, Mr. and Mrs. Attrams established Dankamf Educational Complex to provide high-quality, holistic, and inclusive education to children from all backgrounds. Since its inception, the school has remained committed to nurturing academically excellent, morally upright, and socially responsible learners who are equipped with the knowledge, skills, and values needed to succeed in an ever-changing world.</p>
        </section>

        <section className="mt-10">
          <h2>Message from the Headmaster</h2>
          <p>Dear Parents, Guardians, Students, and Esteemed Visitors,</p>
          <p>It is my great pleasure to welcome you to Dankamf Educational Complex, a school dedicated to nurturing excellence in academics, character, creativity, and leadership. We believe that every child has unique talents and the potential to succeed when provided with the right guidance, opportunities, and supportive learning environment.</p>
          <p>At Dankamf Educational Complex, we are committed to delivering quality education through dedicated and highly qualified teachers, innovative teaching methods, and a curriculum that equips our learners with the knowledge, skills, and values needed to thrive in an ever-changing world. Beyond academic achievement, we emphasize discipline, integrity, respect, responsibility, and teamwork, ensuring that our learners grow into confident and responsible citizens.</p>
          <p>I warmly invite you to become part of the Dankamf Educational Complex family. Together, let us inspire young minds, build strong character, and prepare our children for a bright and successful future.</p>
        </section>

        <LeadershipSection />

        <section className="mt-10">
          <h2>Our Vision & Mission</h2>
          <h3>Vision</h3>
          <p>To be a leader in private Education in the World by empowering our students with Godly principles and values to become productive, caring, and results-oriented leaders of the world.</p>
          <h3>Mission</h3>
          <p>We provide the highest quality education in Christ-centered principles and values so that all our students are empowered to lead productive and fulfilling lives as lifelong learners and responsible citizens of the world.</p>
        </section>

        <section className="mt-10">
          <h2>Our Core Values</h2>
          <h4>Excellence</h4>
          <p>We pursue the highest standards in academic achievement and organizational performance in the fear of God.</p>
          <h4>Integrity</h4>
          <p>We build Godly and positive relationships through honesty, respect and compassion, which enhance the self-esteem, safety, and well-being of our students, families and staff.</p>
          <h4>Equity</h4>
          <p>We foster Godly environment that serves all students and aspires to eliminate the achievement gap.</p>
          <h4>Citizenship</h4>
          <p>We honor God through diversity of our community by working as a team to ensure the educational success of all our students, and recognize that our obligations go beyond our professional responsibilities.</p>
        </section>

        <section className="mt-10">
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
        </section>
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

export default AboutUs;

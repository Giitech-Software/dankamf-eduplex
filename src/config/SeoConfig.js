﻿﻿﻿// src/config/SeoConfig.js

const baseUrl = 'https://dankamf-eduplex.web.app'; 
const siteName = 'Dankamf Educational Complex';
const siteAuthor = 'Dankamf Educational Complex';
const sitePublisher = 'Dankamf Educational Complex';

// Static Pages
const staticPages = {
  home: {
    title: siteName,
    description: 'A premier educational institution committed to excellence in learning and character development.',
    path: '/',
    url: `${baseUrl}/`,
    author: siteAuthor,
    publisher: sitePublisher,
  },
  services: {
    title: `Academics | ${siteName}`,
    description: 'Explore our comprehensive academic programs and curriculum.',
    path: '/services',
    url: `${baseUrl}/services`,
    author: siteAuthor,
    publisher: sitePublisher,
  },
  projects: {
    title: `School Life | ${siteName}`,
    description: 'Discover student activities, events, and life at Dankamf Eduplex.',
    path: '/projects',
    url: `${baseUrl}/projects`,
    author: siteAuthor,
    publisher: sitePublisher,
  },
  blog: {
    title: `News & Events | ${siteName}`,
    description: 'Latest news, announcements, and upcoming events at Dankamf Eduplex.',
    path: '/blog',
    url: `${baseUrl}/blog`,
    author: siteAuthor,
    publisher: sitePublisher,
  },
  contact: {
    title: `Contact Us | ${siteName}`,
    description: 'Get in touch with Dankamf Educational Complex for admissions and inquiries.',
    path: '/contact',
    url: `${baseUrl}/contact`,
    author: siteAuthor,
    publisher: sitePublisher,
  },
  careers: {
    title: `Admissions | ${siteName}`,
    description: 'Learn about the admission process and join the Dankamf Educational Complex family.',
    path: '/jobs',
    url: `${baseUrl}/jobs`,
    author: siteAuthor,
    publisher: sitePublisher,
  },
  clientConfidence: {
    title: `Testimonials | ${siteName}`,
    description: 'Read what parents and students say about Dankamf Educational Complex.',
    path: '/client-confidence',
    url: `${baseUrl}/client-confidence`,
    author: siteAuthor,
    publisher: sitePublisher,
  },
  faqs: {
    title: `Frequently Asked Questions | ${siteName}`,
    description: 'Find answers to common questions about Dankamf Educational Complex.',
    path: '/faqs',
    url: `${baseUrl}/faqs`,
    author: siteAuthor,
    publisher: sitePublisher,
  },
};

// Dynamic Pages
const dynamicPages = {
  blogPost: ({ title, excerpt, id }) => ({
    title: `${title} | News | ${siteName}`,
    description: excerpt,
    path: `/blog/${id}`,
    url: `${baseUrl}/blog/${id}`,
    author: siteAuthor,
    publisher: sitePublisher,
  }),
  admissionInfo: ({ title, excerpt, id }) => ({
    title: `${title} | Admissions | ${siteName}`,
    description: excerpt,
    path: `/jobs/${id}`,
    url: `${baseUrl}/jobs/${id}`,
    author: siteAuthor,
    publisher: sitePublisher,
  }),
  academicProgram: ({ title, excerpt, slug }) => ({
    title: `${title} | Academics | ${siteName}`,
    description: excerpt,
    path: `/academics/${slug}`,
    url: `${baseUrl}/academics/${slug}`,
    author: siteAuthor,
    publisher: sitePublisher,
  }),
  eventDetails: ({ title, excerpt, id }) => ({
    title: `${title} | School Life | ${siteName}`,
    description: excerpt,
    path: `/projects/${id}`,
    url: `${baseUrl}/projects/${id}`,
    author: siteAuthor,
    publisher: sitePublisher,
  }),
};

// Final Export
const SeoConfig = {
  ...staticPages,
  dynamic: dynamicPages,
};

export default SeoConfig;

// src/pages/Home.jsx
import React, { useEffect } from 'react';
import { trackSiteVisit } from '../utils/trackVisit';
import useSiteSettings from '../hooks/useSiteSettings';
import Seo from '../components/Seo';
import SeoConfig from '../config/SeoConfig';
import HeroSection from '../components/HeroSection';
import StatsBanner from '../components/StatsBanner';
import FeatureGrid from '../components/FeatureGrid';
import ServiceGrid from '../components/ServiceGrid';
import Testimonials from '../components/Testimonials';
import ProjectsPreview from '../components/ProjectsPreview';
import TrustedLogos from '../components/TrustedLogos';
import AboutSection from '../components/AboutSection';
import FAQSection from '../components/FAQSection';
import BlogPreview from '../components/BlogPreview';
import NewsletterSignup from '../components/NewsletterSignup';
import CTABanner from '../components/CTABanner';
import CareerPreview from '../components/CareerPreview';
import UpcomingEvents from '../components/UpcomingEvents';
import DownloadCenter from '../components/DownloadCenter';
import SchoolAlerts from '../components/SchoolAlerts';
import VacancyPreview from '../components/VacancyPreview';
import SocialConnect from '../components/SocialConnect';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Home() {
  useEffect(() => {
    trackSiteVisit();
  }, []);

  const { settings, loading } = useSiteSettings();
  if (loading) return <LoadingSpinner fullPage label="Loading homepage" />;

  const siteName = settings?.siteName || 'Dankamf Educational Complex';
  const tagline = settings?.tagline || 'Excellence in Learning & Character';

  return (
    <>
      <Seo {...SeoConfig.home} />
      <div className="min-h-screen bg-background text-text flex flex-col">
        <main className="homepage-content flex-grow">
          <SchoolAlerts />
          <HeroSection siteName={siteName} tagline={tagline} />
          <AboutSection />
          <StatsBanner />
          <TrustedLogos />
          <FeatureGrid />
          <ServiceGrid />
          <Testimonials />
          <ProjectsPreview />
          <BlogPreview />
          <UpcomingEvents />
          <DownloadCenter />
          <SocialConnect />
          <VacancyPreview />
          <CareerPreview />
          <FAQSection />
          <NewsletterSignup />
          <CTABanner />
        </main>
      </div>
    </>
  );
}

import React from 'react';
import { Helmet } from 'react-helmet-async';

const baseUrl = 'https://dankamf-eduplex.web.app';
const defaultImage = `${baseUrl}/og-image.png`;
const siteName = 'Dankamf Educational Complex';
const schoolDescription = 'Dankamf Educational Complex is a private school in Oyibi, Kpone-Katamanso, Greater Accra, Ghana, providing quality education and character development for children.';

export default function Seo({ title, description, image = defaultImage, path, author, publisher, faqItems = [] }) {
  const normalizedPath = path && path !== '/' ? `/${path.replace(/^\/+/, '').replace(/\/+$/, '')}` : '/';
  const fullTitle = title || `${siteName} | Private School in Oyibi, Greater Accra`;
  const fullDescription = description || schoolDescription;
  const url = `${baseUrl}${normalizedPath === '/' ? '/' : normalizedPath}`;
  const isHome = normalizedPath === '/';
  const breadcrumbItems = normalizedPath.split('/').filter(Boolean);
  const breadcrumbs = !isHome ? [{
    '@type': 'BreadcrumbList',
    '@id': `${url}#breadcrumbs`,
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${baseUrl}/` },
      ...breadcrumbItems.map((segment, index) => ({
        '@type': 'ListItem',
        position: index + 2,
        name: segment.replace(/[-_]/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase()),
        item: `${baseUrl}/${breadcrumbItems.slice(0, index + 1).join('/')}`,
      })),
    ],
  }] : [];
  const faqSchema = faqItems.length ? [{
    '@type': 'FAQPage',
    '@id': `${url}#faq`,
    mainEntity: faqItems
      .filter((faq) => faq.question && faq.answer)
      .map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: { '@type': 'Answer', text: String(faq.answer).replace(/[#*_`>-]/g, '').trim() },
      })),
  }] : [];
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['EducationalOrganization', 'School'],
        '@id': `${baseUrl}/#school`,
        name: siteName,
        alternateName: ['Dankamf Eduplex', 'Dankamf Educational Complex Oyibi'],
        url: baseUrl,
        logo: { '@type': 'ImageObject', url: `${baseUrl}/logo512.png` },
        image: defaultImage,
        description: schoolDescription,
        telephone: '+233242172216',
        email: 'dankamfeducationalcomplex2016@gmail.com',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Oyibi',
          addressLocality: 'Oyibi',
          addressRegion: 'Greater Accra',
          postalCode: '00233',
          addressCountry: 'GH',
        },
        areaServed: [
          { '@type': 'City', name: 'Oyibi' },
          { '@type': 'AdministrativeArea', name: 'Kpone-Katamanso Municipal District' },
          { '@type': 'AdministrativeArea', name: 'Greater Accra Region' },
          { '@type': 'Country', name: 'Ghana' },
        ],
        sameAs: [
          'https://www.facebook.com/share/1Bp8KYhmvn/?mibextid=wwXIfr',
          'https://www.instagram.com/dankamf_educational?utm_source=qr',
          'https://www.tiktok.com/@dankamf_16',
        ],
      },
      {
        '@type': 'WebSite',
        '@id': `${baseUrl}/#website`,
        name: 'Dankamf Educational Complex',
        url: baseUrl,
        publisher: { '@id': `${baseUrl}/#school` },
        potentialAction: {
          '@type': 'SearchAction',
          target: `${baseUrl}/search?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      },
      ...(isHome ? [{
        '@type': 'WebPage',
        '@id': `${baseUrl}/#webpage`,
        url: `${baseUrl}/`,
        name: fullTitle,
        description: fullDescription,
        isPartOf: { '@id': `${baseUrl}/#website` },
        about: { '@id': `${baseUrl}/#school` },
        primaryImageOfPage: { '@type': 'ImageObject', url: defaultImage },
      }] : []),
      ...breadcrumbs,
      ...faqSchema,
    ],
  };

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={fullDescription} />
      <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" />
      <meta name="googlebot" content="index,follow" />
      <meta name="theme-color" content="#003153" />
      <link rel="canonical" href={url} />

      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="en_GH" />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={fullDescription} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@dankamf_16" />

      {author && <meta name="author" content={author} />}
      {publisher && <meta name="publisher" content={publisher} />}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
}

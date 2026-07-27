import React from 'react';
import { Helmet } from 'react-helmet-async';

const baseUrl = 'https://dankamf-eduplex.web.app';
const defaultImage = `${baseUrl}/og-image.png`;

export default function Seo({ title, description, image = defaultImage, path, author, publisher }) {
  const fullTitle = title || 'Dankamf Educational Complex';
  const fullDescription = description || 'A premier educational institution committed to excellence in learning and character development.';
  const url = `${baseUrl}${path || ''}`;
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'EducationalOrganization',
        '@id': `${baseUrl}/#school`,
        name: 'Dankamf Educational Complex',
        url: baseUrl,
        logo: `${baseUrl}/logo192.png`,
        description: 'A premier educational institution committed to excellence in learning and character development.',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Accra',
          addressCountry: 'GH',
        },
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
    ],
  };

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={fullDescription} />

      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={fullDescription} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:card" content="summary_large_image" />

      {author && <meta name="author" content={author} />}
      {publisher && <meta name="publisher" content={publisher} />}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
}

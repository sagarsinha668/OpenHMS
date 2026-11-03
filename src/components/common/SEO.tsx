import React, { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  canonical,
  ogImage = 'https://openhrm.netlify.app/faviconV2.jpg',
}) => {
  const fullTitle = title 
    ? `${title} | OpenHMS — Open Source Hospital Management System`
    : 'OpenHMS — Open Source Hospital Management System | Integrated EMR & HMIS';

  const defaultDesc = 
    'An integrated Open Source EMR and Hospital Information System (HMIS). One of the most popular open-source electronic health records and medical practice management solutions globally, supporting scheduling, billing, clinical notes, and prescriptions.';
  const metaDesc = description || defaultDesc;

  const defaultKeywords = 
    'open source hospital management system, open source clinic management system, integrated Open Source EMR, hospital information system, HMIS, EHR, medical practice management, clinical notes, prescriptions, appointment scheduling, healthcare platform';
  const metaKeywords = keywords ? `${keywords}, ${defaultKeywords}` : defaultKeywords;

  useEffect(() => {
    // 1. Dynamic Page Title
    document.title = fullTitle;

    // Helper to set or create meta tag
    const setMeta = (attr: 'name' | 'property', key: string, content: string) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    // 2. Standard Search Meta Tags
    setMeta('name', 'description', metaDesc);
    setMeta('name', 'keywords', metaKeywords);

    // 3. Open Graph (Social Previews)
    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:description', metaDesc);
    setMeta('property', 'og:image', ogImage);
    if (canonical) {
      setMeta('property', 'og:url', canonical);
    }

    // 4. Twitter Card Previews
    setMeta('name', 'twitter:title', fullTitle);
    setMeta('name', 'twitter:description', metaDesc);
    setMeta('name', 'twitter:image', ogImage);

    // 5. Canonical Link
    if (canonical) {
      let link = document.querySelector('link[rel="canonical"]');
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        document.head.appendChild(link);
      }
      link.setAttribute('href', canonical);
    }
  }, [fullTitle, metaDesc, metaKeywords, canonical, ogImage]);

  // React 19 native document metadata tags for search engine crawlers
  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={metaDesc} />
      <meta name="keywords" content={metaKeywords} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDesc} />
    </>
  );
};

export default SEO;

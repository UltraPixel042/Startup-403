import { Helmet } from 'react-helmet-async';

export default function SEOHead({ title, description, keywords, path = '/' }) {
  const siteName = 'BrewBook';
  const fullTitle = `${title} | ${siteName} ระบบจองที่นั่งคาเฟ่`;
  const url = `https://brewbook.cafe${path}`;

  return (
    <Helmet>
      <html lang="th" />
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:image" content="https://brewbook.cafe/og-image.png" />
      <meta property="og:locale" content="th_TH" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content="https://brewbook.cafe/og-image.png" />
    </Helmet>
  );
}

import { Helmet } from 'react-helmet-async';

interface GlobalSEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  url?: string;
  image?: string;
  structuredData?: object;
}

export const GlobalSEO = ({ 
  title = "E-Info.me - Create Your Digital Profile",
  description = "Create a beautiful, unified profile to share all your work and links. The modern way to showcase your digital identity and connect with opportunities.",
  keywords = "einfo, e-info, portfolio maker, digital profile, personal website, link in bio, portfolio builder, professional profile, online presence",
  url = "https://e-info.me",
  image = "/og-image.png",
  structuredData
}: GlobalSEOProps) => {
  
  const fullImageUrl = image.startsWith('http') ? image : `https://e-info.me${image}`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:site_name" content="E-Info.me" />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={fullImageUrl} />
      
      {/* Additional SEO Meta Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="author" content="E-Info.me" />
      <meta name="language" content="EN" />
      <meta name="revisit-after" content="7 days" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />
      
      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default GlobalSEO;

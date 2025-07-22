import { Helmet } from 'react-helmet-async';

interface ProfileSEOProps {
  profile: any;
  username: string;
}

export const ProfileSEO = ({ profile, username }: ProfileSEOProps) => {
  if (!profile) return null;

  const userName = profile.user?.name || username;
  const userTitle = profile.profile?.title || 'Digital Profile';
  const userBio = profile.profile?.bio || '';
  const userLocation = profile.profile?.location || '';
  const profileImage = profile.profile?.profilePicture || '/og-image.png';
  
  // SEO optimized title for ranking
  const seoTitle = `${userName} (@${username}) - ${userTitle} | E-Info.me Profile`;
  
  // Create description that targets ranking keywords
  const seoDescription = userBio 
    ? `${userBio.slice(0, 120)} | View ${userName}'s digital profile, portfolio, and professional links on E-Info.me. Connect and discover their work.`
    : `${userName} - ${userTitle} on E-Info.me. Explore their digital portfolio, work experience, and professional links. Connect for opportunities and collaborations.`;
  
  // Keywords targeting "einfo" and related searches
  const keywordArray = [
    // Primary brand keywords
    'einfo',
    'e-info',
    'einfo profile',
    'e-info profile',
    
    // Person-specific
    userName,
    `${userName} portfolio`,
    `${userName} profile`,
    username,
    `@${username}`,
    
    // Professional keywords
    userTitle,
    'digital profile',
    'portfolio maker',
    'personal website',
    'link in bio',
    'professional profile',
    'online portfolio',
    
    // Location (if available)
    userLocation && `${userName} ${userLocation}`,
    
    // Work-related (first few experiences)
    ...((profile.experiences || []).slice(0, 2).map((exp: any) => exp.company).filter(Boolean)),
    ...((profile.experiences || []).slice(0, 2).map((exp: any) => exp.position).filter(Boolean))
  ].filter(Boolean);
  
  const keywords = [...new Set(keywordArray)].join(', ');
  const canonicalUrl = `https://e-info.me/@${username}`;
  const fullImageUrl = profileImage.startsWith('http') ? profileImage : `https://e-info.me${profileImage}`;

  // Rich structured data for search engines
  const personStructuredData: any = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": userName,
    "jobTitle": userTitle,
    "description": userBio || `Digital profile of ${userName}`,
    "url": canonicalUrl,
    "image": fullImageUrl,
    "identifier": username,
    "mainEntityOfPage": {
      "@type": "ProfilePage",
      "@id": canonicalUrl,
      "name": `${userName} - E-Info.me Profile`
    },
    "sameAs": profile.links?.map((link: any) => link.url).filter(Boolean) || [],
    "memberOf": {
      "@type": "Organization", 
      "name": "E-Info.me",
      "url": "https://e-info.me"
    }
  };

  // Add work info if available
  if (profile.experiences && profile.experiences.length > 0) {
    personStructuredData.worksFor = {
      "@type": "Organization",
      "name": profile.experiences[0].company
    };
  }

  // Add education if available
  if (profile.education && profile.education.length > 0) {
    personStructuredData.alumniOf = profile.education.map((edu: any) => ({
      "@type": "EducationalOrganization",
      "name": edu.institution
    }));
  }

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{seoTitle}</title>
      <meta name="title" content={seoTitle} />
      <meta name="description" content={seoDescription} />
      <meta name="keywords" content={keywords} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="profile" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:site_name" content="E-Info.me" />
      <meta property="profile:first_name" content={userName.split(' ')[0] || userName} />
      <meta property="profile:last_name" content={userName.split(' ').slice(1).join(' ') || ''} />
      <meta property="profile:username" content={username} />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={canonicalUrl} />
      <meta property="twitter:title" content={seoTitle} />
      <meta property="twitter:description" content={seoDescription} />
      <meta property="twitter:image" content={fullImageUrl} />
      <meta property="twitter:creator" content={`@${username}`} />
      
      {/* Additional SEO Meta Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="author" content={userName} />
      <meta name="language" content="EN" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(personStructuredData)}
      </script>
    </Helmet>
  );
};

export default ProfileSEO;

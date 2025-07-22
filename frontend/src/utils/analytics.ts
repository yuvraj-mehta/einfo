// Non-visible SEO analytics tracking utilities

// Track page views for SEO analytics
export const trackPageView = (path: string, title: string) => {
  if (typeof window !== 'undefined') {
    // Google Analytics tracking (if gtag is available)
    if ((window as any).gtag) {
      (window as any).gtag('config', 'GA_MEASUREMENT_ID', {
        page_title: title,
        page_location: window.location.href,
        page_path: path,
      });
    }
    
    // Console log for development (non-visible)
    console.log('SEO: Page view tracked', { path, title });
  }
};

// Track profile views specifically (for /@username pages)
export const trackProfileView = (username: string, profileData: any) => {
  if (typeof window !== 'undefined') {
    const eventData = {
      event: 'profile_view',
      username,
      profile_type: profileData?.profile?.title || 'Digital Profile',
      has_portfolio: (profileData?.portfolio?.length || 0) > 0,
      has_experience: (profileData?.experiences?.length || 0) > 0,
      has_education: (profileData?.education?.length || 0) > 0,
      links_count: profileData?.links?.length || 0
    };
    
    // Google Analytics event tracking
    if ((window as any).gtag) {
      (window as any).gtag('event', 'profile_view', eventData);
    }
    
    // Console log for development (non-visible)
    console.log('SEO: Profile view tracked', eventData);
  }
};

// Track social sharing events
export const trackShareEvent = (platform: string, url: string) => {
  if (typeof window !== 'undefined') {
    const eventData = {
      event: 'share',
      platform,
      shared_url: url
    };
    
    if ((window as any).gtag) {
      (window as any).gtag('event', 'share', eventData);
    }
    
    console.log('SEO: Share event tracked', eventData);
  }
};

// Track external link clicks 
export const trackLinkClick = (url: string, linkTitle: string) => {
  if (typeof window !== 'undefined') {
    const eventData = {
      event: 'click',
      link_url: url,
      link_text: linkTitle,
      event_category: 'external_link'
    };
    
    if ((window as any).gtag) {
      (window as any).gtag('event', 'click', eventData);
    }
    
    console.log('SEO: Link click tracked', eventData);
  }
};

// Define the gtag function globally
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

// Initialize Google Analytics and Google Ads tracking
export const initGA = () => {
  const gaId = import.meta.env.VITE_GA_MEASUREMENT_ID;
  const adWordsId = 'AW-697276669';

  if (!gaId) {
    console.warn('Missing required Google Analytics key: VITE_GA_MEASUREMENT_ID');
    return;
  }

  // Add Google Analytics script to the head
  const script1 = document.createElement('script');
  script1.async = true;
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
  document.head.appendChild(script1);

  // Initialize gtag with both GA and Google Ads config
  const script2 = document.createElement('script');
  script2.textContent = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${gaId}');
    gtag('config', '${adWordsId}');
  `;
  document.head.appendChild(script2);
};

// Track page views - useful for single-page applications
export const trackPageView = (url: string) => {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  const gaId = import.meta.env.VITE_GA_MEASUREMENT_ID;
  if (!gaId) return;
  
  window.gtag('config', gaId, {
    page_path: url
  });
};

// Track events
export const trackEvent = (
  action: string, 
  category?: string, 
  label?: string, 
  value?: number
) => {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};

// Specific funnel tracking functions
export const trackQuizStart = () => {
  trackEvent('quiz_start', 'engagement', 'eligibility_quiz');
};

export const trackQuizProgress = (questionNumber: number, totalQuestions: number) => {
  trackEvent('quiz_progress', 'engagement', `question_${questionNumber}_of_${totalQuestions}`, questionNumber);
};

export const trackQuizComplete = (isEligible: boolean) => {
  trackEvent('quiz_complete', 'engagement', isEligible ? 'eligible' : 'not_eligible');
};

export const trackLeadFormStart = () => {
  trackEvent('lead_form_start', 'engagement', 'contact_form');
};

export const trackLeadFormFieldInteraction = (fieldName: string) => {
  trackEvent('form_field_interaction', 'engagement', fieldName);
};

export const trackLeadFormAbandonment = () => {
  trackEvent('lead_form_abandon', 'engagement', 'contact_form');
};

// Track conversion events for Google Ads - Lead Form Submission (Click-based)
export const trackConversion = (url?: string) => {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  const callback = function () {
    if (typeof(url) != 'undefined') {
      window.location.href = url;
    }
  };
  
  window.gtag('event', 'conversion', {
    'send_to': 'AW-697276669/j015CPqU-vEaEP2xvswC',
    'event_callback': callback
  });
  
  return false;
};
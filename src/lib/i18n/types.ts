export type Locale = "en" | "hi";

export interface Dictionary {
  languageToggle: {
    english: string;
    hindi: string;
  };
  nav: {
    home: string;
    groundReports: string;
    news: string;
    interviews: string;
    podcasts: string;
    videos: string;
    about: string;
    contactUs: string;
    specialReports: string;
    categories: string;
    search: string;
    toggleMenu: string;
  };
  mobileNav: {
    home: string;
    news: string;
    videos: string;
    podcasts: string;
    search: string;
  };
  breakingTicker: {
    label: string;
  };
  searchOverlay: {
    placeholder: string;
    closeSearch: string;
    recentSearches: string;
    popularSearches: string;
    noResultsPrefix: string;
    noResultsSuffix: string;
  };
  newsletter: {
    eyebrow: string;
    heading: string;
    body: string;
    placeholder: string;
    subscribe: string;
    subscribing: string;
    subscribed: string;
  };
  floatingTip: {
    button: string;
    eyebrow: string;
    heading: string;
    description: string;
    close: string;
  };
  footer: {
    tagline: string;
    newsColumn: string;
    companyColumn: string;
    legalColumn: string;
    groundReports: string;
    interviews: string;
    videos: string;
    podcasts: string;
    specialReports: string;
    trending: string;
    aboutUs: string;
    ourTeam: string;
    contact: string;
    careers: string;
    advertiseWithUs: string;
    publicVoice: string;
    privacyPolicy: string;
    terms: string;
    disclaimer: string;
    editorialPolicy: string;
    correctionsPolicy: string;
    factCheckPolicy: string;
    rights: string;
    builtFor: string;
    sitemap: string;
  };
  common: {
    live: string;
    viewAll: string;
    readFullStory: string;
    allEpisodes: string;
    allReports: string;
    moreTopStories: string;
    groundReportTag: string;
    allFilter: string;
  };
  listingPages: {
    news: { heading: string; intro: string; noResults: string; noResultsHint: string };
    videos: { heading: string; intro: string };
    interviews: { intro: string; noResults: string };
    search: { heading: string };
    trending: { views: string };
    specialReports: { heading: string; intro: string; views: string };
    podcasts: { eyebrow: string; intro: string };
  };
  pagination: {
    pageLabel: string;
    ofLabel: string;
  };
  home: {
    fromTheGround: {
      eyebrow: string;
      quote: string;
      groundReportVideo: string;
      watchButton: string;
    };
    latestNews: { eyebrow: string; title: string };
    groundReportSection: { eyebrow: string; title: string; subtitle: string };
    topInterview: { eyebrow: string; title: string; subtitle: string };
    videos: { eyebrow: string; title: string };
    podcastSection: { eyebrow: string; latestEpisodes: string; popularEpisodes: string; featuredGuests: string; episodeAbbrev: string };
    location: { eyebrow: string; title: string; viewMap: string; storiesReported: string };
    specialReportSection: { eyebrow: string; title: string };
    trending: { eyebrow: string; title: string; views: string };
    followSection: { eyebrow: string; title: string };
    publicVoiceSection: {
      eyebrow: string;
      heading: string;
      body: string;
      newsTips: string;
      photosVideos: string;
      button: string;
    };
  };
  publicVoicePage: {
    eyebrow: string;
    heading: string;
    body: string;
    cardTipsTitle: string;
    cardTipsBody: string;
    cardMediaTitle: string;
    cardMediaBody: string;
    cardReviewTitle: string;
    cardReviewBody: string;
  };
  publicVoiceForm: {
    fullName: string;
    fullNamePlaceholder: string;
    contact: string;
    contactPlaceholder: string;
    location: string;
    locationPlaceholder: string;
    category: string;
    selectCategory: string;
    description: string;
    descriptionPlaceholder: string;
    uploadOptional: string;
    uploadHint: string;
    consent: string;
    consentLinkText: string;
    consentSuffix: string;
    submit: string;
    submitting: string;
    consentRequired: string;
    genericError: string;
    thankYouTitle: string;
    thankYouBody: string;
  };
  about: {
    eyebrow: string;
    heading: string;
    intro: string;
    whoWeAreEyebrow: string;
    whoWeAreHeading: string;
    whoWeAreP1: string;
    whoWeAreP2: string;
    missionEyebrow: string;
    visionEyebrow: string;
    visionHeading: string;
    visionBody: string;
    coverageEyebrow: string;
    coverageHeading: string;
    coverageLabels: {
      news: string;
      groundReports: string;
      interviews: string;
      podcasts: string;
      videoReports: string;
      specialReports: string;
      publicIssues: string;
      localStories: string;
      education: string;
      business: string;
      sports: string;
      entertainment: string;
    };
    groundReportingEyebrow: string;
    groundReportingHeading: string;
    groundReportingBody: string;
    journeySteps: { location: string; investigation: string; interviews: string; video: string; story: string };
    exploreGroundReports: string;
    interviewsEyebrow: string;
    interviewsHeading: string;
    interviewsBody: string;
    guestTypes: string[];
    watchInterviews: string;
    podcastEyebrow: string;
    podcastBody: string;
    explorePodcasts: string;
    editorialValuesEyebrow: string;
    editorialValuesHeading: string;
    values: { accuracyTitle: string; accuracyBody: string; transparencyTitle: string; transparencyBody: string; peopleFirstTitle: string; peopleFirstBody: string; responsibleTitle: string; responsibleBody: string };
    teamEyebrow: string;
    teamHeading: string;
    ctaHeading: string;
    ctaBody: string;
    sendNewsTip: string;
    contactUs: string;
  };
  contact: {
    eyebrow: string;
    heading: string;
    subheading: string;
    cards: { newsEditorialTitle: string; newsEditorialBody: string; interviewPodcastTitle: string; interviewPodcastBody: string; advertisingTitle: string; advertisingBody: string; careersTitle: string; careersBody: string };
    sendMessageHeading: string;
    officeLabel: string;
    workingHoursLabel: string;
    newsTipHeading: string;
    newsTipBody: string;
    sendNewsTip: string;
    findUsEyebrow: string;
    findUsHeading: string;
    getDirections: string;
    departmentsEyebrow: string;
    departmentsHeading: string;
    departmentsSubtitle: string;
    contactThisTeam: string;
    departmentsList: Record<"editorial" | "podcast" | "advertising" | "careers", { label: string; description: string }>;
    reportErrorHeading: string;
    reportErrorBody: string;
    faqEyebrow: string;
    faqHeading: string;
    faqItems: { question: string; answer: string }[];
    finalCtaHeading: string;
    finalCtaBody: string;
    sendNewsTipButton: string;
    contactOurTeam: string;
  };
  contactForm: {
    enquiryTypeLabels: Record<
      "General Enquiry" | "News Tip" | "Ground Report" | "Interview Request" | "Podcast" | "Advertising" | "Partnership" | "Careers" | "Press / Media" | "Feedback" | "Correction" | "Other",
      string
    >;
    fullName: string;
    emailAddress: string;
    phoneNumber: string;
    phoneOptional: string;
    enquiryType: string;
    subject: string;
    subjectPlaceholder: string;
    message: string;
    attachFile: string;
    attachHint: string;
    sendMessage: string;
    sending: string;
    genericError: string;
    thankYou: string;
  };
  correctionForm: {
    articleUrl: string;
    issue: string;
    issuePlaceholder: string;
    correctInfo: string;
    supportingInfo: string;
    yourEmail: string;
    submit: string;
    submitting: string;
    genericError: string;
    thankYou: string;
  };
}

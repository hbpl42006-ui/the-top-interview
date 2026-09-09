export const SITE = {
  name: "The Top Interview",
  shortName: "TTI",
  tagline: "News From The Ground. Voices That Matter.",
  mission:
    "Our mission is to bring authentic stories from the ground to the audience, give people a voice, and present news with accuracy, transparency and responsibility.",
  url: "https://thetopinterview.example.com",
  podcastBrand: "The Top Interview Podcasts",
  email: "editorial@thetopinterview.in",
  newsTipEmail: "tips@thetopinterview.in",
  phone: "+91 98765 43210",
  whatsapp: "+91 98765 43210",
  address: "4th Floor, Press Enclave, Vidhan Sabha Marg, Lucknow, Uttar Pradesh 226001, India",
  workingHours: "Monday – Saturday, 10:00 AM – 7:00 PM IST",
};

export const DEPARTMENTS = [
  {
    key: "editorial",
    label: "Editorial Team",
    description: "News, ground reports, stories, corrections and reporting.",
    department: "News Tip",
  },
  {
    key: "podcast",
    label: "Podcast Team",
    description: "Podcast guests, interviews and collaborations.",
    department: "Podcast",
  },
  {
    key: "advertising",
    label: "Advertising Team",
    description: "Advertisements, sponsorships and partnerships.",
    department: "Advertising",
  },
  {
    key: "careers",
    label: "Careers Team",
    description: "Jobs, internships and freelance opportunities.",
    department: "Careers",
  },
] as const;

export const MAIN_NAV = [
  { label: "Home", href: "/" },
  { label: "Ground Reports", href: "/ground-reports" },
  { label: "News", href: "/news" },
  { label: "Interviews", href: "/interviews" },
  { label: "Podcasts", href: "/podcasts" },
  { label: "Videos", href: "/videos" },
  { label: "About", href: "/about" },
  { label: "Contact Us", href: "/contact" },
  { label: "Special Reports", href: "/special-reports" },
  { label: "Categories", href: "/category" },
];

export const MOBILE_NAV = [
  { label: "Home", href: "/", icon: "home" },
  { label: "News", href: "/news", icon: "newspaper" },
  { label: "Videos", href: "/videos", icon: "play" },
  { label: "Podcasts", href: "/podcasts", icon: "mic" },
  { label: "Search", href: "/search", icon: "search" },
] as const;

export const CATEGORIES = [
  "Ground Reports",
  "Breaking News",
  "Local News",
  "National News",
  "Interviews",
  "Special Reports",
  "Public Issues",
  "Politics",
  "Education",
  "Technology",
  "Business",
  "Entertainment",
  "Sports",
  "Crime & Safety",
  "Social Issues",
  "Trending Stories",
] as const;

export const SOCIAL_LINKS = [
  { label: "YouTube", href: "https://youtube.com/@thetopinterview", icon: "youtube" },
  { label: "Instagram", href: "https://instagram.com/thetopinterview", icon: "instagram" },
  { label: "Facebook", href: "https://facebook.com/thetopinterview", icon: "facebook" },
  { label: "X / Twitter", href: "https://x.com/thetopinterview", icon: "twitter" },
  { label: "WhatsApp Channel", href: "https://whatsapp.com/channel/thetopinterview", icon: "whatsapp" },
  { label: "Telegram", href: "https://t.me/thetopinterview", icon: "telegram" },
];

export const PODCAST_PLATFORMS = [
  { label: "YouTube", icon: "youtube" },
  { label: "Spotify", icon: "spotify" },
  { label: "Apple Podcasts", icon: "apple" },
];

export const TIP_CATEGORIES = [
  "Local Issue",
  "Breaking News",
  "Corruption",
  "Education",
  "Road/Infrastructure",
  "Crime/Safety",
  "Public Problem",
  "Other",
] as const;

export const POPULAR_SEARCHES = [
  "Lucknow drainage",
  "Patna flyover",
  "Sugarcane payment",
  "Jaipur water tanker",
  "NEET coaching hostel",
  "Delhi Metro Phase 4",
];

export const CONTACT_DEPARTMENTS = [
  "General Enquiry",
  "News Tip",
  "Ground Report",
  "Interview Request",
  "Podcast",
  "Advertising",
  "Partnership",
  "Careers",
  "Press / Media",
  "Feedback",
  "Correction",
  "Other",
] as const;

// Frozen seed content — not typed against live @/lib/types, which can evolve independently.
import { portrait, thumb } from "@/lib/images";

export const interviews = [
  {
    slug: "dr-ashok-verma-rural-healthcare",
    guest: "Dr. Ashok Verma",
    guestDesignation: "Chief Medical Officer, Kushinagar District Hospital",
    guestPhoto: portrait("ashok-verma"),
    category: "Doctors",
    topic: "Why rural district hospitals struggle to retain specialist doctors",
    thumbnail: thumb("interview-doctor"),
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    duration: "24:10",
    excerpt:
      "Dr. Verma speaks candidly about the incentive structures, or lack thereof, that push specialist doctors away from rural postings.",
    body: [
      "In this interview, Dr. Ashok Verma discusses the staffing crisis at his hospital, where three of five sanctioned specialist posts have remained vacant for over a year.",
      "\"Doctors are willing to serve, but the system doesn't make it sustainable for a family,\" he says, pointing to a lack of housing, schooling, and career progression as key deterrents.",
    ],
    publishedAt: "2026-09-02T12:00:00+05:30",
    reporter: "rahul-kumar",
    views: 18400,
    tags: ["Healthcare", "Interview", "Uttar Pradesh"],
  },
  {
    slug: "mla-sunita-rawat-on-farmer-dues",
    guest: "Sunita Rawat",
    guestDesignation: "MLA, Kushinagar Constituency",
    guestPhoto: portrait("sunita-rawat"),
    category: "Politicians",
    topic: "On pending sugarcane payments and the state government's response",
    thumbnail: thumb("interview-mla"),
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    duration: "18:35",
    excerpt:
      "MLA Sunita Rawat responds directly to our ground report on unpaid sugarcane dues, committing to raise the issue in the next assembly session.",
    body: [
      "Confronted with our on-ground evidence of 14-month-old pending payments, Rawat acknowledges the delay and outlines the steps she says she has taken with the district administration.",
    ],
    publishedAt: "2026-09-05T10:00:00+05:30",
    reporter: "rahul-kumar",
    views: 41200,
    tags: ["Politics", "Farmers", "Interview"],
  },
  {
    slug: "startup-founder-neha-kapoor",
    guest: "Neha Kapoor",
    guestDesignation: "Founder & CEO, CredLoop",
    guestPhoto: portrait("neha-kapoor"),
    category: "Entrepreneurs",
    topic: "Building a lending startup for India's tier-2 retailers",
    thumbnail: thumb("interview-founder"),
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    duration: "31:52",
    excerpt:
      "Neha Kapoor on raising her Series B, the risks of underwriting small retailers, and why she thinks tier-2 India is fintech's next big opportunity.",
    body: [
      "Kapoor walks through the founding story of CredLoop, the risk models her team built specifically for small retail credit, and her plans for expansion into 40 new cities.",
    ],
    publishedAt: "2026-08-29T15:00:00+05:30",
    reporter: "sneha-deshmukh",
    views: 15600,
    tags: ["Business", "Startups", "Interview"],
  },
  {
    slug: "principal-geeta-nair-education-reform",
    guest: "Geeta Nair",
    guestDesignation: "Principal, Government Girls Inter College, Kanpur",
    guestPhoto: portrait("geeta-nair"),
    category: "Teachers",
    topic: "What it takes to keep girls enrolled past class 10 in small-town UP",
    thumbnail: thumb("interview-principal"),
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    duration: "22:18",
    excerpt:
      "Geeta Nair discusses dropout rates, the impact of scholarship schemes, and what still stands in the way of girls completing secondary school.",
    body: [
      "Twenty-two years into her teaching career, Nair has seen dropout patterns shift with each new scheme, but says transport and safety remain the biggest deciding factors for families.",
    ],
    publishedAt: "2026-08-21T11:30:00+05:30",
    reporter: "ananya-singh",
    views: 12900,
    tags: ["Education", "Interview", "Uttar Pradesh"],
  },
  {
    slug: "social-worker-imtiaz-ansari",
    guest: "Imtiaz Ansari",
    guestDesignation: "Founder, Muzaffarpur Flood Relief Collective",
    guestPhoto: portrait("imtiaz-ansari"),
    category: "Social Workers",
    topic: "Twelve years of organising flood relief without government backing",
    thumbnail: thumb("interview-socialworker"),
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    duration: "27:44",
    excerpt:
      "Ansari explains how his volunteer collective has grown from six people to over 200, and why he still refuses government funding.",
    body: [
      "\"The day we take government money is the day we stop being able to criticise the government,\" Ansari says, describing the collective's entirely donor-funded model.",
    ],
    publishedAt: "2026-08-15T09:00:00+05:30",
    reporter: "mohammed-imran",
    views: 22700,
    tags: ["Bihar", "Social Work", "Interview"],
  },
  {
    slug: "district-magistrate-on-encroachment",
    guest: "Rakesh Chaturvedi",
    guestDesignation: "District Magistrate, Gwalior",
    guestPhoto: portrait("rakesh-chaturvedi"),
    category: "Government Officials",
    topic: "On the heritage wall encroachment and planned action",
    thumbnail: thumb("interview-dm"),
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    duration: "16:05",
    excerpt:
      "The District Magistrate responds to our ground report on encroachment near Gwalior's fort wall, laying out a proposed survey and removal timeline.",
    body: [
      "Chaturvedi says a joint survey with the archaeology department will begin within a month, though he stops short of committing to a demolition timeline.",
    ],
    publishedAt: "2026-08-20T14:00:00+05:30",
    reporter: "priya-sharma",
    views: 9800,
    tags: ["Gwalior", "Government", "Interview"],
  },
  {
    slug: "cricket-coach-rural-talent",
    guest: "Suresh Nagar",
    guestDesignation: "Head Coach, Rajasthan State Cricket Academy",
    guestPhoto: portrait("suresh-nagar"),
    category: "Industry Experts",
    topic: "Scouting rural cricket talent overlooked by private academies",
    thumbnail: thumb("interview-coach"),
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    duration: "19:40",
    excerpt:
      "Coach Suresh Nagar on what the new state academy looks for in trials, and why he believes rural Rajasthan is an untapped talent pool.",
    body: [
      "Nagar describes the trial process across 12 districts and the specific technical gaps his coaching staff has found most common among first-time trialists.",
    ],
    publishedAt: "2026-08-26T10:15:00+05:30",
    reporter: "vikram-rathore",
    views: 14100,
    tags: ["Sports", "Cricket", "Interview"],
  },
  {
    slug: "student-voice-neet-aspirants",
    guest: "Kavya Tripathi",
    guestDesignation: "NEET Aspirant, Prayagraj",
    guestPhoto: portrait("kavya-tripathi"),
    category: "Students",
    topic: "Life inside Prayagraj's coaching hostels, in her own words",
    thumbnail: thumb("interview-student"),
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    duration: "14:52",
    excerpt:
      "A candid conversation with a second-attempt NEET aspirant about pressure, cost, and what keeps her going.",
    body: [
      "Tripathi describes a daily routine that begins at 5 AM and the financial strain her family has taken on to fund a second year of coaching.",
    ],
    publishedAt: "2026-08-10T08:45:00+05:30",
    reporter: "ananya-singh",
    views: 31800,
    tags: ["Education", "Students", "Interview"],
  },
];

export function getAllInterviews() {
  return interviews;
}

export function getInterviewBySlug(slug: string) {
  return interviews.find((i) => i.slug === slug);
}

export function getLatestInterviews(limit = 6) {
  return [...interviews]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, limit);
}

export const interviewCategories = [
  "Politicians",
  "Government Officials",
  "Entrepreneurs",
  "Teachers",
  "Doctors",
  "Students",
  "Social Workers",
  "Celebrities",
  "Experts",
  "Local Leaders",
  "Common People",
  "Industry Experts",
];

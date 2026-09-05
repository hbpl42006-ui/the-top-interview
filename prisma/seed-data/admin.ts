// Frozen seed content — not typed against live @/lib/types, which can evolve independently.
export const mockComments = [
  {
    id: "c1",
    articleSlug: "lucknow-drainage-crisis-ground-zero",
    name: "Ajay Pratap",
    message: "This has been going on for months, glad someone finally covered it on the ground.",
    createdAt: "2026-09-04T13:20:00+05:30",
    status: "approved",
  },
  {
    id: "c2",
    articleSlug: "lucknow-drainage-crisis-ground-zero",
    name: "Ritu Malhotra",
    message: "Same situation in our colony. Who do we even complain to at this point?",
    createdAt: "2026-09-04T15:05:00+05:30",
    status: "pending",
  },
  {
    id: "c3",
    articleSlug: "up-teacher-vacancies-education-crisis",
    name: "Vinod Yadav",
    message: "As a teacher myself, this matches what I see every day. Thank you for the RTI work.",
    createdAt: "2026-09-02T10:40:00+05:30",
    status: "approved",
  },
  {
    id: "c4",
    articleSlug: "patna-flyover-collapse-breaking",
    name: "Anonymous",
    message: "This is clearly sponsored propaganda against the contractor.",
    createdAt: "2026-09-05T07:10:00+05:30",
    status: "rejected",
  },
];

export const mockSubmissions = [
  {
    id: "s1",
    name: "Ramesh Chandra",
    contact: "ramesh.c@example.com",
    location: "Gorakhpur, Uttar Pradesh",
    category: "Road/Infrastructure",
    description:
      "A broken culvert on the Gorakhpur-Deoria road has caused two accidents this month. No barricades or warning signs have been put up.",
    mediaAttached: true,
    status: "pending",
    submittedAt: "2026-09-05T08:30:00+05:30",
  },
  {
    id: "s2",
    name: "Sarita Devi",
    contact: "+91 90000 11223",
    location: "Ara, Bihar",
    category: "Local Issue",
    description:
      "Our block has had no piped water supply for eleven days. The panchayat says the pump motor is under repair with no timeline.",
    mediaAttached: false,
    status: "reviewed",
    submittedAt: "2026-09-03T12:00:00+05:30",
  },
  {
    id: "s3",
    name: "Anonymous Tipster",
    contact: "hidden",
    location: "Bhopal, Madhya Pradesh",
    category: "Corruption",
    description:
      "Ration shop dealer in our ward is allegedly diverting PDS stock for resale. Have photos of unmarked bags being loaded onto a private vehicle.",
    mediaAttached: true,
    status: "pending",
    submittedAt: "2026-09-04T19:45:00+05:30",
  },
  {
    id: "s4",
    name: "Deepak Solanki",
    contact: "deepak.solanki@example.com",
    location: "Jaipur, Rajasthan",
    category: "Public Problem",
    description: "Streetlights on the main market road have been non-functional for over a month, raising safety concerns at night.",
    mediaAttached: false,
    status: "published",
    submittedAt: "2026-08-29T09:15:00+05:30",
  },
];

export const mockUsers: { id: string; name: string; email: string; role: string; joinedAt: string }[] = [
  { id: "u1", name: "Rahul Kumar", email: "rahul.kumar@thetopinterview.in", role: "REPORTER", joinedAt: "2019-03-10" },
  { id: "u2", name: "Ananya Singh", email: "ananya.singh@thetopinterview.in", role: "EDITOR", joinedAt: "2018-06-21" },
  { id: "u3", name: "Priya Sharma", email: "priya.sharma@thetopinterview.in", role: "EDITOR", joinedAt: "2020-01-14" },
  { id: "u4", name: "Admin Desk", email: "admin@thetopinterview.in", role: "SUPER_ADMIN", joinedAt: "2017-11-01" },
  { id: "u5", name: "Meera Joshi", email: "meera.joshi@thetopinterview.in", role: "PODCAST_MANAGER", joinedAt: "2022-04-18" },
  { id: "u6", name: "Karan Bedi", email: "karan.bedi@thetopinterview.in", role: "MODERATOR", joinedAt: "2023-02-09" },
];

export const analyticsSummary = {
  totalVisitors: 4820000,
  todaysVisitors: 38400,
  pageViews: 12600000,
  subscriberCount: 214300,
  trafficByDay: [
    { day: "Mon", visitors: 32000 },
    { day: "Tue", visitors: 35400 },
    { day: "Wed", visitors: 31200 },
    { day: "Thu", visitors: 41800 },
    { day: "Fri", visitors: 38900 },
    { day: "Sat", visitors: 44200 },
    { day: "Sun", visitors: 38400 },
  ],
  trafficSources: [
    { source: "Direct", value: 34 },
    { source: "Google Search", value: 28 },
    { source: "Social Media", value: 22 },
    { source: "YouTube", value: 11 },
    { source: "Other", value: 5 },
  ],
  deviceBreakdown: [
    { device: "Mobile", value: 71 },
    { device: "Desktop", value: 24 },
    { device: "Tablet", value: 5 },
  ],
  topLocations: [
    { state: "Uttar Pradesh", value: 28 },
    { state: "Delhi", value: 19 },
    { state: "Bihar", value: 15 },
    { state: "Maharashtra", value: 12 },
    { state: "Rajasthan", value: 10 },
    { state: "Madhya Pradesh", value: 9 },
    { state: "Others", value: 7 },
  ],
  searchTrends: [
    { term: "Lucknow drainage", count: 8400 },
    { term: "Sugarcane payment UP", count: 6200 },
    { term: "Patna flyover collapse", count: 21300 },
    { term: "Jaipur water tanker", count: 5100 },
    { term: "NEET coaching hostel", count: 4300 },
  ],
};

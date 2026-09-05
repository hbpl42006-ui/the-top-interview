import { thumb } from "@/lib/images";

// Frozen seed content — intentionally not typed against the live
// GroundReport interface in @/lib/types, which can evolve independently.
export const groundReports = [
  {
    slug: "kushinagar-farmers-crop-loss",
    headline: "We Visited the Location to Understand What Is Really Happening With Kushinagar's Sugarcane Farmers",
    location: "Kushinagar",
    state: "Uttar Pradesh",
    reporter: "rahul-kumar",
    category: "Ground Reports",
    image: thumb("kushinagar-farmers"),
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    excerpt:
      "Unpaid sugarcane dues from two seasons ago have pushed several farming families in Kushinagar to the edge. We spoke to them directly, in their fields.",
    body: [
      "In a small hamlet outside Kushinagar town, farmer Ram Milan Yadav walks us through rows of sugarcane he says he may not be able to afford to harvest this year.",
      "\"The mill still owes us for last season and the one before,\" he says. \"How do we pay labourers if we haven't been paid ourselves?\"",
      "The Top Interview verified payment records shared by three farmers showing dues pending for over 14 months against the local mill, which did not respond to requests for comment.",
    ],
    publishedAt: "2026-09-04T07:30:00+05:30",
    duration: "8:42",
    views: 39200,
    tags: ["Kushinagar", "Farmers", "Sugarcane", "Uttar Pradesh"],
    mapQuery: "Kushinagar, Uttar Pradesh",
  },
  {
    slug: "lucknow-drainage-crisis",
    headline: "Ground Zero: Inside Lucknow's Flooded Indira Nagar Colonies",
    location: "Indira Nagar, Lucknow",
    state: "Uttar Pradesh",
    reporter: "rahul-kumar",
    category: "Ground Reports",
    image: thumb("lucknow-drainage"),
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    excerpt:
      "Three weeks of stagnant water, a collapsed drain, and a paperwork dispute between two government departments. We went to see it for ourselves.",
    body: [
      "Full ground report also published as a news feature — read the complete story with additional reporting and official responses.",
    ],
    publishedAt: "2026-09-03T09:15:00+05:30",
    duration: "11:05",
    views: 84210,
    tags: ["Lucknow", "Infrastructure", "Uttar Pradesh"],
    mapQuery: "Indira Nagar, Lucknow, Uttar Pradesh",
  },
  {
    slug: "jaipur-tanker-mafia",
    headline: "Inside Jaipur's Illegal Water Tanker Network",
    location: "Vaishali Nagar, Jaipur",
    state: "Rajasthan",
    reporter: "vikram-rathore",
    category: "Ground Reports",
    image: thumb("jaipur-water"),
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    excerpt:
      "Three days following unlicensed water tankers through the lanes of Vaishali Nagar reveal an informal economy residents feel powerless against.",
    body: [
      "Full ground report also published as a news feature — read the complete story with additional reporting and official responses.",
    ],
    publishedAt: "2026-08-30T10:00:00+05:30",
    duration: "9:58",
    views: 47600,
    tags: ["Jaipur", "Water Crisis", "Rajasthan"],
    mapQuery: "Vaishali Nagar, Jaipur, Rajasthan",
  },
  {
    slug: "muzaffarpur-migrant-families",
    headline: "The Villages Bihar's Migrant Workers Send Money Home To",
    location: "Bariyarpur, Muzaffarpur",
    state: "Bihar",
    reporter: "mohammed-imran",
    category: "Ground Reports",
    image: thumb("bihar-migrants"),
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    excerpt:
      "Entire streets in Bariyarpur village now run on remittances. We met the families left behind.",
    body: [
      "Full ground report also published as a news feature — read the complete story with additional reporting and official responses.",
    ],
    publishedAt: "2026-08-24T09:00:00+05:30",
    duration: "10:20",
    views: 52900,
    tags: ["Bihar", "Migration", "Social Issues"],
    mapQuery: "Muzaffarpur, Bihar",
  },
  {
    slug: "gwalior-heritage-encroachment",
    headline: "Encroachment Along Gwalior's Heritage Wall: Residents and Officials Disagree on Who Is Responsible",
    location: "Gwalior",
    state: "Madhya Pradesh",
    reporter: "priya-sharma",
    category: "Ground Reports",
    image: thumb("gwalior-heritage"),
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    excerpt:
      "Shops and homes have crept up against a centuries-old fort wall. We asked residents, historians and municipal officials how it happened.",
    body: [
      "Traders near the wall say they've operated for two generations and were never stopped. The state archaeology department says the encroachment is recent and illegal. The Top Interview lays out the timeline using land records and interviews on both sides.",
    ],
    publishedAt: "2026-08-19T09:30:00+05:30",
    duration: "7:15",
    views: 21400,
    tags: ["Gwalior", "Heritage", "Madhya Pradesh"],
    mapQuery: "Gwalior Fort, Madhya Pradesh",
  },
  {
    slug: "nashik-onion-farmers-prices",
    headline: "Why Nashik's Onion Farmers Are Burning Their Own Harvest",
    location: "Lasalgaon, Nashik",
    state: "Maharashtra",
    reporter: "sneha-deshmukh",
    category: "Ground Reports",
    image: thumb("nashik-onion"),
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    excerpt:
      "Wholesale onion prices have dropped below production cost. We met farmers at Asia's largest onion market to understand why.",
    body: [
      "At Lasalgaon's wholesale market, farmers describe selling their harvest at a loss rather than paying to transport it home. The Top Interview examines the supply chain factors behind the price collapse.",
    ],
    publishedAt: "2026-08-12T08:00:00+05:30",
    duration: "9:02",
    views: 33700,
    tags: ["Nashik", "Farmers", "Maharashtra"],
    mapQuery: "Lasalgaon, Nashik, Maharashtra",
  },
  {
    slug: "varanasi-ganga-pollution",
    headline: "Ground Report: Has the Ganga Cleanup in Varanasi Actually Worked?",
    location: "Varanasi",
    state: "Uttar Pradesh",
    reporter: "rahul-kumar",
    category: "Ground Reports",
    image: thumb("varanasi-ganga"),
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    excerpt:
      "Years into the cleanup mission, we tested water quality at three ghats and spoke to boatmen who've watched the river for decades.",
    body: [
      "Independent lab results, boatmen testimonies and official monitoring data are compared in this ground investigation from three ghats along the Varanasi riverfront.",
    ],
    publishedAt: "2026-08-05T07:45:00+05:30",
    duration: "12:30",
    views: 68900,
    tags: ["Varanasi", "Environment", "Uttar Pradesh"],
    mapQuery: "Dashashwamedh Ghat, Varanasi, Uttar Pradesh",
  },
  {
    slug: "jodhpur-solar-jobs",
    headline: "Solar Parks Promised Jobs to Jodhpur's Villages — Did They Deliver?",
    location: "Jodhpur",
    state: "Rajasthan",
    reporter: "vikram-rathore",
    category: "Ground Reports",
    image: thumb("jodhpur-solar"),
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    excerpt:
      "A large solar park promised local employment when it was built. Five years on, we asked villagers whether that promise was kept.",
    body: [
      "Employment records obtained from the panchayat show a fraction of promised local hiring was realised. Company representatives cite skill mismatches; villagers cite broken promises.",
    ],
    publishedAt: "2026-07-29T08:30:00+05:30",
    duration: "10:47",
    views: 28300,
    tags: ["Jodhpur", "Solar Energy", "Employment", "Rajasthan"],
    mapQuery: "Bhadla Solar Park, Jodhpur, Rajasthan",
  },
];

export function getAllGroundReports() {
  return groundReports;
}

export function getGroundReportBySlug(slug: string) {
  return groundReports.find((g) => g.slug === slug);
}

export function getLatestGroundReports(limit = 6) {
  return [...groundReports]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, limit);
}

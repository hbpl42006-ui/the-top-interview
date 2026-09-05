// Frozen seed content — intentionally not typed against the live
// StateInfo interface in @/lib/types, which can evolve independently.
export const states = [
  {
    slug: "uttar-pradesh",
    name: "Uttar Pradesh",
    cities: ["Lucknow", "Kanpur", "Varanasi", "Kushinagar", "Noida", "Prayagraj"],
    storyCount: 412,
  },
  {
    slug: "bihar",
    name: "Bihar",
    cities: ["Patna", "Gaya", "Muzaffarpur", "Darbhanga"],
    storyCount: 268,
  },
  {
    slug: "delhi",
    name: "Delhi",
    cities: ["New Delhi", "Dwarka", "Rohini", "Karol Bagh"],
    storyCount: 355,
  },
  {
    slug: "madhya-pradesh",
    name: "Madhya Pradesh",
    cities: ["Bhopal", "Indore", "Gwalior", "Jabalpur"],
    storyCount: 197,
  },
  {
    slug: "rajasthan",
    name: "Rajasthan",
    cities: ["Jaipur", "Jodhpur", "Udaipur", "Bikaner"],
    storyCount: 231,
  },
  {
    slug: "maharashtra",
    name: "Maharashtra",
    cities: ["Mumbai", "Pune", "Nagpur", "Nashik"],
    storyCount: 289,
  },
  {
    slug: "other-states",
    name: "Other States",
    cities: ["Chandigarh", "Ahmedabad", "Kolkata", "Bengaluru"],
    storyCount: 124,
  },
];

export function getStateBySlug(slug: string) {
  return states.find((s) => s.slug === slug);
}

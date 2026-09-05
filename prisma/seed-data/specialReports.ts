// Frozen seed content — not typed against live @/lib/types, which can evolve independently.
import { thumb } from "@/lib/images";

export const specialReports = [
  {
    slug: "bundelkhand-water-crisis-investigation",
    title: "Bundelkhand's Vanishing Water: A Six-Month Investigation",
    dek: "Across seven districts, groundwater levels have fallen faster than official records admit. We spent six months documenting why — and who is being left behind.",
    image: thumb("bundelkhand-special", 1600, 900),
    location: "Bundelkhand Region, Uttar Pradesh & Madhya Pradesh",
    publishedAt: "2026-08-15T09:00:00+05:30",
    views: 112400,
    chapters: [
      {
        title: "Chapter 1: The Numbers Behind the Silence",
        body: "Official groundwater board data, obtained through RTI requests filed across seven districts, shows a decline far steeper than public statements from the state irrigation department suggest. In some blocks, water tables have dropped over 40 feet in a decade.",
      },
      {
        title: "Chapter 2: The Villages Running Dry First",
        body: "We travelled to twelve villages where hand pumps have already gone dry. Families now walk between two and five kilometres daily to fetch water, a burden that falls disproportionately on women and children who miss school to make the trip.",
      },
      {
        title: "Chapter 3: Where the Irrigation Money Went",
        body: "Cross-referencing tender documents with site visits, we found three sanctioned check-dam projects that exist only on paper, despite funds having been disbursed against them years ago.",
      },
      {
        title: "Chapter 4: What Officials Say Now",
        body: "Confronted with our findings, district officials in two of the seven districts have ordered fresh inquiries. We publish their full responses alongside our evidence.",
      },
    ],
    timeline: [
      { date: "Feb 2026", event: "First RTI applications filed across seven Bundelkhand districts." },
      { date: "Mar 2026", event: "Field visits begin in Jhansi and Chitrakoot blocks." },
      { date: "May 2026", event: "Independent water-table testing conducted with local hydrologists." },
      { date: "Jun 2026", event: "Discrepancies found in three sanctioned check-dam projects." },
      { date: "Jul 2026", event: "Right-to-reply sent to district and state irrigation officials." },
      { date: "Aug 2026", event: "Investigation published; two districts order fresh inquiries." },
    ],
  },
  {
    slug: "coaching-hostel-safety-standards",
    title: "No One Is Checking: Fire Safety in India's Coaching Hostels",
    dek: "Lakhs of students live in unregulated coaching hostels every year. We inspected fire safety compliance at 30 hostels across three cities.",
    image: thumb("hostel-special", 1600, 900),
    location: "Prayagraj, Kota-adjacent networks, Delhi NCR",
    publishedAt: "2026-07-20T09:00:00+05:30",
    views: 78600,
    chapters: [
      {
        title: "Chapter 1: Thirty Hostels, One Pattern",
        body: "Of the thirty coaching hostels we visited, only six had a valid, current fire safety clearance certificate on display. Emergency exits were blocked by storage in eleven buildings we surveyed.",
      },
      {
        title: "Chapter 2: The Regulatory Gap",
        body: "Coaching hostels frequently fall between municipal building codes and education department oversight, with neither authority claiming full responsibility for safety audits.",
      },
      {
        title: "Chapter 3: Student Voices",
        body: "Several students described being aware of the risks but having no alternative given limited affordable housing options near coaching centres.",
      },
    ],
    timeline: [
      { date: "Apr 2026", event: "Investigation begins with a survey framework built alongside a fire-safety consultant." },
      { date: "May 2026", event: "On-site inspections conducted across 30 hostels in three cities." },
      { date: "Jun 2026", event: "Findings shared with municipal and education authorities for response." },
      { date: "Jul 2026", event: "Report published alongside official responses received." },
    ],
  },
  {
    slug: "urban-flooding-drainage-audit",
    title: "The Drains That Were Never Finished: An Urban Flooding Audit",
    dek: "We tracked 18 stalled drainage projects across four cities to understand why monsoon flooding keeps getting worse in neighbourhoods that were promised a fix years ago.",
    image: thumb("drainage-special", 1600, 900),
    location: "Lucknow, Kanpur, Patna, Bhopal",
    publishedAt: "2026-06-28T09:00:00+05:30",
    views: 64200,
    chapters: [
      {
        title: "Chapter 1: Eighteen Stalled Projects",
        body: "Municipal tender records across four cities reveal eighteen drainage upgrade projects that remain incomplete despite contracted deadlines that have already passed, in some cases by over three years.",
      },
      {
        title: "Chapter 2: Who Pays the Cost",
        body: "Residents in affected neighbourhoods describe recurring property damage each monsoon, with no compensation mechanism available to them.",
      },
    ],
    timeline: [
      { date: "Mar 2026", event: "Tender record review begins across four municipal corporations." },
      { date: "Apr 2026", event: "Site visits conducted in 18 identified project locations." },
      { date: "Jun 2026", event: "Report published ahead of the monsoon season." },
    ],
  },
];

export function getAllSpecialReports() {
  return specialReports;
}

export function getSpecialReportBySlug(slug: string) {
  return specialReports.find((s) => s.slug === slug);
}

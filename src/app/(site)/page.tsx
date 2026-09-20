import { HeroSection } from "@/components/home/hero-section";
import { FromTheGroundSection } from "@/components/home/from-the-ground-section";
import { LatestNewsSection } from "@/components/home/latest-news-section";
import { GroundReportsSection } from "@/components/home/ground-reports-section";
import { TopInterviewSection } from "@/components/home/top-interview-section";
import { VideosSection } from "@/components/home/videos-section";
import { PodcastSection } from "@/components/home/podcast-section";
import { LocationSection } from "@/components/home/location-section";
import { SpecialReportsSection } from "@/components/home/special-reports-section";
import { TrendingSection } from "@/components/home/trending-section";
import { PublicVoiceSection } from "@/components/home/public-voice-section";
import { NewsletterSection } from "@/components/home/newsletter-section";
import { FollowSection } from "@/components/home/follow-section";
import { AdSlot } from "@/components/ads/ad-slot";
import { Container } from "@/components/ui/container";

export default function Home() {
  return (
    <>
      <HeroSection />
      <Suspense fallback={null}>
        <FromTheGroundSection />
      </Suspense>
      <Suspense fallback={null}>
        <LatestNewsSection />
      </Suspense>
      <Container className="py-2">
        <AdSlot size="leaderboard" />
      </Container>
      <Suspense fallback={null}>
        <GroundReportsSection />
      </Suspense>
      <Suspense fallback={null}>
        <TopInterviewSection />
      </Suspense>
      <Suspense fallback={null}>
        <VideosSection />
      </Suspense>
      <Suspense fallback={null}>
        <PodcastSection />
      </Suspense>
      <Suspense fallback={null}>
        <LocationSection />
      </Suspense>
      <Suspense fallback={null}>
        <SpecialReportsSection />
      </Suspense>
      <Suspense fallback={null}>
        <TrendingSection />
      </Suspense>
      <PublicVoiceSection />
      <NewsletterSection />
      <FollowSection />
    </>
  );
}
import { Suspense } from "react";

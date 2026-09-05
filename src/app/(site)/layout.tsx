import { Header } from "@/components/layout/header";
import { BreakingTicker } from "@/components/layout/breaking-ticker";
import { Footer } from "@/components/layout/footer";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { FloatingTipButton } from "@/components/layout/floating-tip-button";
import { StickyPlayer } from "@/components/podcast/sticky-player";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <BreakingTicker />
      <main id="main-content" className="flex-1 pb-16 lg:pb-0">
        {children}
      </main>
      <Footer />
      <MobileBottomNav />
      <FloatingTipButton />
      <StickyPlayer />
    </>
  );
}

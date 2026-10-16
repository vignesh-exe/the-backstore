import HeroSection from "@/components/home/HeroSection";
import NewDrop from "@/components/home/NewDrop";
import CollectionsSection from "@/components/home/CollectionsSection";
import BrandStatement from "@/components/home/BrandStatement";
import FinalShopCTA from "@/components/home/FinalShopCTA";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import FirstOrderPromo from "@/components/FirstOrderPromo";
import TrendingCollectibles from "@/components/home/TrendingCollectibles";
import ReviewsMarquee from "@/components/home/ReviewsMarquee";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <NewDrop />
      <TrendingCollectibles />
      <CollectionsSection />
      <BrandStatement />
      <ReviewsMarquee />
      <FinalShopCTA />

      {/* Floating WhatsApp */}
      <FloatingWhatsApp />

      <FirstOrderPromo />
    </main>
  );
}

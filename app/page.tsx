import HeroSection from "@/components/home/HeroSection";
import NewDrop from "@/components/home/NewDrop";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import FirstOrderPromo from "@/components/FirstOrderPromo";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <NewDrop />
      {/* Floating WhatsApp */}
      <FloatingWhatsApp />
      <FirstOrderPromo />
    </main>
  );
}

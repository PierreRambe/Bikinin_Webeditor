import { Navbar } from "@/components/layout/Navbar";
import { HeroSection } from "@/components/sections/HeroSection";
import { FeatureStrip, HowItWorks, PricingSection, Footer } from "@/components/sections/Sections";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <FeatureStrip />
      <HowItWorks />
      <PricingSection />
      <Footer />
    </main>
  );
}

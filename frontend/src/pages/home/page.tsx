import { useEffect } from "react";
import Header from "@/components/feature/Header";
import Footer from "@/components/feature/Footer";
import WhatsAppButton from "@/components/feature/WhatsAppButton";
import CookieBanner from "@/components/feature/CookieBanner";
import HeroSection from "./components/HeroSection";
import CategoriesSection from "./components/CategoriesSection";
import FeaturedTours from "./components/FeaturedTours";
import DestinationsSection from "./components/DestinationsSection";
import HowItWorks from "./components/HowItWorks";
import Testimonials from "./components/Testimonials";
import ProviderCTA from "./components/ProviderCTA";

export default function Home() {
  useEffect(() => {
    document.title = "Baja Tours — Tours, Transporte y Experiencias en Baja California Sur";
  }, []);

  return (
    <div className="min-h-screen bg-offwhite font-body">
      <Header />
      <main>
        <HeroSection />
        <CategoriesSection />
        <FeaturedTours />
        <DestinationsSection />
        <HowItWorks />
        <Testimonials />
        <ProviderCTA />
      </main>
      <Footer />
      <WhatsAppButton />
      <CookieBanner />
    </div>
  );
}
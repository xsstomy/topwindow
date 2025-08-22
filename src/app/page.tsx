import HeroSection from "@/components/HeroSection";
import DownloadSection from "@/components/DownloadSection";
import FeaturesSection from "@/components/FeaturesSection";
import DemoSection from "@/components/DemoSection";
import SupportSection from "@/components/SupportSection";
import PricingSection from "@/components/PricingSection";
import Footer from "@/components/Footer";

export default function HomePage() {
    return (
        <main className="min-h-screen">
            <HeroSection />
            <FeaturesSection />
            <DemoSection />
            <PricingSection />
            <SupportSection />
            <Footer />
        </main>
    );
}

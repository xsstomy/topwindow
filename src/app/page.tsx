import HeroSection from '@/components/HeroSection'
import FeaturesSection from '@/components/FeaturesSection'
import DemoSection from '@/components/DemoSection'
import TestimonialsSection from '@/components/TestimonialsSection'
import CallToActionSection from '@/components/CallToActionSection'
import Footer from '@/components/Footer'

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <DemoSection />
      <TestimonialsSection />
      <CallToActionSection />
      <Footer />
    </main>
  )
}
import { Footer } from '@/components/footer'
import { FAQSection } from '@/components/home/faq-section'
import { Hero } from '@/components/home/hero'
import { HowItWorks } from '@/components/home/how-it-works'

export default function Home() {
  return (
    <div className="overflow-hidden space-y-32">
      <Hero />
      <HowItWorks />
      <FAQSection />
      <Footer />
    </div>
  )
}

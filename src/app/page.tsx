import { Hero } from '@/components/home/hero'
import { HowItWorks } from '@/components/home/how-it-works'

export default function Home() {
  return (
    <div className="overflow-hidden">
      <Hero />
      <HowItWorks />
    </div>
  )
}

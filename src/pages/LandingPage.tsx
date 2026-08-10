import { Hero } from '../components/landing/Hero'
import { Features } from '../components/landing/Features'
import { HowItWorks } from '../components/landing/HowItWorks'
import { FAQ } from '../components/landing/FAQ'
import { CTASection } from '../components/landing/CTASection'

export function LandingPage() {
  return (
    <>
      <Hero />
      <Features />
      <HowItWorks />
      <CTASection />
      <FAQ />
    </>
  )
}

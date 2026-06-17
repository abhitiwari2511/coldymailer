import { Navbar } from "@/components/landing/navbar"
import { Hero } from "@/components/landing/hero"
import { Features } from "@/components/landing/features"
import { NoiseFilter } from "@/components/landing/noiseFilter"
import VideoBackground from "@/components/layout/appBackground"
import { Pricing } from "@/components/landing/pricing"
import { Footer } from "@/components/landing/footer"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-brand/30 font-sans overflow-x-hidden relative">
      <NoiseFilter />
      <VideoBackground />
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <Features />
        <Pricing />
      </main>
      <Footer />
    </div>
  )
}
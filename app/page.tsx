
"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

import { HeroSection } from "@/components/HeroSection"
import { AboutSection } from "@/components/AboutSection"
import { ServicesSection } from "@/components/ServicesSection"
import { CommitmentSection } from "@/components/CommitmentSection"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        <HeroSection />
        <AboutSection />
        <ServicesSection />
        <CommitmentSection />
      </main>

      <Footer />
    </div>
  )
}
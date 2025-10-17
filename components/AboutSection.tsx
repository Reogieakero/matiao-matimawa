"use client"

import { motion, Variants } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

// Explicitly apply the Framer Motion 'Variants' type to ensure TypeScript recognizes the structure.
const slideInFromLeft: Variants = {
  initial: { opacity: 0, x: -50 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } },
}

const slideInFromRight: Variants = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } },
}

export function AboutSection() {
  return (
    <section className="relative py-16 md:py-20 bg-gradient-to-b from-background via-muted/40 to-background overflow-hidden">
      {/* Background pattern - ensures all props are correctly inside string literals */}
      <div className="absolute inset-0 -z-10 opacity-5 bg-[url('/pattern-grid.svg')] bg-repeat" />
      <div className="container mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left: Image (Order 2 on LG screens - animate from left) */}
          <motion.div
            variants={slideInFromLeft} // No redline after applying Variants type
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.3 }} // Trigger when 30% of the element is visible
            className="relative h-[420px] rounded-3xl overflow-hidden group shadow-xl order-2 lg:order-1"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10 rounded-3xl" />
            <Image
              src="/barangay-hall-building-community-center.jpg"
              alt="Barangay Matiao Hall" // Correctly quoted string literal
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute bottom-6 left-6 z-20 bg-background/90 backdrop-blur-sm px-5 py-3 rounded-xl border border-border shadow-md">
              <h3 className="font-semibold text-lg text-foreground">Barangay Matiao Hall</h3>
              <p className="text-sm text-muted-foreground">
                The heart of community leadership and service
              </p>
            </div>
          </motion.div>

          {/* Right: Text (Order 1 on LG screens - animate from right) */}
          <motion.div
            variants={slideInFromRight} // No redline after applying Variants type
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.3 }}
            className="space-y-8 order-1 lg:order-2"
          >
            <div className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary tracking-wide">
              About Our Barangay
            </div>

            <h2 className="text-4xl md:text-5xl font-extrabold text-foreground leading-tight">
              A Strong, United, and <span className="text-primary">Progressive</span> Community
            </h2>

            <p className="text-lg text-muted-foreground leading-relaxed">
              Barangay Matiao stands as a thriving and dynamic community at the heart of our
              municipality. With deep cultural roots and a spirit of unity, we have transformed
              from a small settlement into one of the most progressive barangays in the region —
              committed to service, inclusivity, and innovation.
            </p>

            <div className="space-y-4 text-muted-foreground">
              <p>
                Our leadership continues to promote transparency, order, and active participation
                among residents. Through dedicated governance and citizen collaboration, Barangay
                Matiao ensures peace, development, and opportunities for all.
              </p>
              <p>
                With this online portal, we aim to bring public service closer to your fingertips
                — offering access to documents, updates, and programs that strengthen our shared
                vision of a better and more connected community.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <Button size="lg" asChild>
                <Link href="/officials">Meet Our Officials</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/announcements">See Latest Updates</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
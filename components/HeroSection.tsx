// components/HeroSection.jsx
"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import HeroBackgroundImage from "@/public/Matiao.jpg"

const HERO_BACKGROUND_URL = HeroBackgroundImage.src

export function HeroSection() {
  return (
    <section className="relative bg-primary text-primary-foreground py-20 md:py-32">
      <div
        className="absolute inset-0 opacity-10 bg-cover bg-center"
        style={{ backgroundImage: `url('${HERO_BACKGROUND_URL}')` }}
      />
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="container mx-auto px-4 relative z-10"
      >
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Welcome to Barangay Matiao 
          </h1>
          <p className="text-lg md:text-xl mb-8 text-primary-foreground/90 leading-relaxed">
            Your gateway to community services, announcements, and local government information.
            We're here to serve you better.
          </p>
          <div className="flex flex-wrap gap-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
              <Button size="lg" variant="secondary" asChild>
                <Link href="/services">Apply for Documents</Link>
              </Button>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
              <Button
                size="lg"
                variant="outline"
                className="bg-primary-foreground/10 border-primary-foreground/20 hover:bg-primary-foreground/20 text-primary-foreground"
                asChild
              >
                <Link href="/announcements">View Announcements</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
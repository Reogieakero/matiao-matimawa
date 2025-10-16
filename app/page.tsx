"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bell, FileText, Phone, Users, MessageSquare, Shield } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
// 1. Import Framer Motion
import { motion } from "framer-motion"

import HeroBackgroundImage from "@/public/Matiao.jpg"

const HERO_BACKGROUND_URL = HeroBackgroundImage.src

// 2. Define Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.2,
      staggerChildren: 0.1, // Stagger items inside the grid
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
  },
}

const slideInFromLeft = {
  initial: { opacity: 0, x: -50 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } },
}

const slideInFromRight = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } },
}

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section - Animate the main content */}
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
                Welcome to Barangay Matiao Online Portal
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

        {/* About Barangay Matiao - Use a Viewport trigger for sections below the fold */}
        <section className="relative py-16 md:py-20 bg-gradient-to-b from-background via-muted/40 to-background overflow-hidden">
          <div className="absolute inset-0 -z-10 opacity-5 bg-[url('/pattern-grid.svg')] bg-repeat" />
          <div className="container mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              
              {/* Left: Image (Order 2 on LG screens - animate from left) */}
              <motion.div
                variants={slideInFromLeft}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, amount: 0.3 }} // Trigger when 30% of the element is visible
                className="relative h-[420px] rounded-3xl overflow-hidden group shadow-xl order-2 lg:order-1"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10 rounded-3xl" />
                <Image
                  src="/barangay-hall-building-community-center.jpg"
                  alt="Barangay Matiao Hall"
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
                variants={slideInFromRight}
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

        {/* Quick Access Services - Animate as a staggered grid */}
        <section className="pt-8 pb-16 md:pt-10 md:pb-20 bg-gradient-to-b from-background to-muted/20">
          <div className="container mx-auto px-4">
            {/* Animate the heading */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-10"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-3">Quick Access Services</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Access essential barangay services with just a few clicks.
              </p>
            </motion.div>
            
            {/* Animate the card grid with stagger effects */}
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
            >
              {[
                { title: "Announcements", desc: "Stay updated with the latest news, advisories, and events.", icon: <Bell className="h-6 w-6" />, href: "/announcements" },
                { title: "Document Services", desc: "Apply for barangay clearance, certificates, and more.", icon: <FileText className="h-6 w-6" />, href: "/services" },
                { title: "Emergency Hotlines", desc: "Quick access to police, fire, and health services.", icon: <Phone className="h-6 w-6" />, href: "/hotlines" },
                { title: "Barangay Officials", desc: "Meet your local officials and check their availability.", icon: <Users className="h-6 w-6" />, href: "/officials" },
                { title: "Report Issues", desc: "Submit concerns, suggestions, or community issues.", icon: <MessageSquare className="h-6 w-6" />, href: "/contact" },
                { title: "Public Safety", desc: "Access safety guidelines and emergency procedures.", icon: <Shield className="h-6 w-6" />, href: "/announcements?category=Public+Safety" },
              ].map((service, i) => (
                <motion.div key={i} variants={itemVariants}>
                  <Card
                    className="group relative border border-border/60 bg-card/60 backdrop-blur-md hover:bg-card/80 transition-all duration-300 hover:shadow-xl rounded-2xl"
                  >
                    <CardHeader className="text-center">
                      <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                        {service.icon}
                      </div>
                      <CardTitle className="text-xl font-semibold mb-2">{service.title}</CardTitle>
                      <CardDescription className="text-base text-muted-foreground">
                        {service.desc}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-center pb-6">
                      <Button variant="secondary" className="rounded-full px-6" asChild>
                        <Link href={service.href}>Open</Link>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Our Commitment - Animate as a staggered grid */}
        <section className="relative py-20 bg-gradient-to-b from-primary/5 via-background to-muted/30 overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-[url('/pattern-grid.svg')] bg-repeat opacity-10" />
          <div className="container mx-auto px-6 lg:px-8 text-center">
            {/* Animate the commitment header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl mx-auto mb-12"
            >
              <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
                Our <span className="text-primary">Commitment</span> to the Community
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We uphold the highest standards of transparency, innovation, and community engagement.
                Our barangay strives to make every service efficient, inclusive, and accessible for all.
              </p>
            </motion.div>

            {/* Animate the commitment cards with stagger effects */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
            >
              <motion.div variants={itemVariants}>
                <Card className="group border border-border/50 hover:shadow-lg hover:border-primary/40 transition-all duration-300 rounded-2xl bg-card/70 backdrop-blur-sm">
                  <CardHeader className="text-center space-y-4">
                    <div className="flex justify-center">
                      <div className="w-14 h-14 flex items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                        <Shield className="h-7 w-7" />
                      </div>
                    </div>
                    <CardTitle className="text-xl font-semibold">Transparency & Accountability</CardTitle>
                    <CardDescription className="text-base leading-relaxed">
                      We ensure that all governance processes are open and accessible, fostering trust
                      between the barangay and its residents.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card className="group border border-border/50 hover:shadow-lg hover:border-primary/40 transition-all duration-300 rounded-2xl bg-card/70 backdrop-blur-sm">
                  <CardHeader className="text-center space-y-4">
                    <div className="flex justify-center">
                      <div className="w-14 h-14 flex items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                        <Users className="h-7 w-7" />
                      </div>
                    </div>
                    <CardTitle className="text-xl font-semibold">Community-Centered Service</CardTitle>
                    <CardDescription className="text-base leading-relaxed">
                      Every program we create is rooted in the needs of our people — ensuring that services
                      uplift and empower every Matiao resident.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card className="group border border-border/50 hover:shadow-lg hover:border-primary/40 transition-all duration-300 rounded-2xl bg-card/70 backdrop-blur-sm">
                  <CardHeader className="text-center space-y-4">
                    <div className="flex justify-center">
                      <div className="w-14 h-14 flex items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                        <MessageSquare className="h-7 w-7" />
                      </div>
                    </div>
                    <CardTitle className="text-xl font-semibold">Innovation & Accessibility</CardTitle>
                    <CardDescription className="text-base leading-relaxed">
                      Through digital transformation, we aim to make every barangay service and announcement
                      accessible — anytime, anywhere.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            </motion.div> {/* <-- THIS IS THE CORRECTLY PLACED CLOSING TAG */}

            {/* Animate the concluding paragraph */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.8 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-2xl mx-auto mt-16 text-muted-foreground text-lg leading-relaxed"
            >
              Together, we build a future where progress, peace, and participation thrive. Barangay Matiao
              remains steadfast in serving with integrity, compassion, and purpose.
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
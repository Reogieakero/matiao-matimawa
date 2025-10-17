// components/ServicesSection.jsx
"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Bell, FileText, Phone, Users, MessageSquare, Shield } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

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

const services = [
  { title: "Announcements", desc: "Stay updated with the latest news, advisories, and events.", icon: <Bell className="h-6 w-6" />, href: "/announcements" },
  { title: "Document Services", desc: "Apply for barangay clearance, certificates, and more.", icon: <FileText className="h-6 w-6" />, href: "/services" },
  { title: "Emergency Hotlines", desc: "Quick access to police, fire, and health services.", icon: <Phone className="h-6 w-6" />, href: "/hotlines" },
  { title: "Barangay Officials", desc: "Meet your local officials and check their availability.", icon: <Users className="h-6 w-6" />, href: "/officials" },
  { title: "Report Issues", desc: "Submit concerns, suggestions, or community issues.", icon: <MessageSquare className="h-6 w-6" />, href: "/contact" },
  { title: "Public Safety", desc: "Access safety guidelines and emergency procedures.", icon: <Shield className="h-6 w-6" />, href: "/announcements?category=Public+Safety" },
]

export function ServicesSection() {
  return (
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
          {services.map((service, i) => (
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
  )
}
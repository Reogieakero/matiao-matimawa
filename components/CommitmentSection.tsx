// components/CommitmentSection.jsx
"use client"

import { motion } from "framer-motion"
import { Users, MessageSquare, Shield } from "lucide-react"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.2,
      staggerChildren: 0.1,
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

const commitments = [
  { 
    icon: <Shield className="h-7 w-7" />, 
    title: "Transparency & Accountability", 
    desc: "We ensure that all governance processes are open and accessible, fostering trust between the barangay and its residents." 
  },
  { 
    icon: <Users className="h-7 w-7" />, 
    title: "Community-Centered Service", 
    desc: "Every program we create is rooted in the needs of our people — ensuring that services uplift and empower every Matiao resident." 
  },
  { 
    icon: <MessageSquare className="h-7 w-7" />, 
    title: "Innovation & Accessibility", 
    desc: "Through digital transformation, we aim to make every barangay service and announcement accessible — anytime, anywhere." 
  },
]

export function CommitmentSection() {
  return (
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
          {commitments.map((commitment, i) => (
            <motion.div key={i} variants={itemVariants}>
              <Card className="group border border-border/50 hover:shadow-lg hover:border-primary/40 transition-all duration-300 rounded-2xl bg-card/70 backdrop-blur-sm">
                <CardHeader className="text-center space-y-4">
                  <div className="flex justify-center">
                    <div className="w-14 h-14 flex items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                      {commitment.icon}
                    </div>
                  </div>
                  <CardTitle className="text-xl font-semibold">{commitment.title}</CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    {commitment.desc}
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </motion.div>

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
  )
}
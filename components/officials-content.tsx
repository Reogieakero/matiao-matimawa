// components/officials-content.tsx
"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Phone, User } from "lucide-react"
import Image from "next/image"
import { useRealtime } from "@/hooks/use-realtime"
import type { Official, OfficialStatus, OfficialCategory } from "@/lib/types"

const statusColors: Record<OfficialStatus, string> = {
  "On Duty": "bg-green-100 text-green-800",
  "On Leave": "bg-orange-100 text-orange-800",
  "On Site": "bg-blue-100 text-blue-800",
}

const officialCategories: OfficialCategory[] = ["Barangay Officials", "SK", "Staff"]

export function OfficialsContent() {
  const [officials, setOfficials] = useState<Official[]>([])
  const [loading, setLoading] = useState(true)

  const fetchOfficials = useCallback(async () => {
    try {
      const response = await fetch("/api/officials")
      const data = await response.json()
      setOfficials(data)
    } catch (error) {
      console.error("Failed to fetch officials:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchOfficials()
  }, [fetchOfficials])

  useRealtime({
    eventTypes: ["official:updated"],
    onUpdate: () => {
      console.log("Received official update, refreshing data...")
      fetchOfficials()
    },
  })

  const groupedOfficials = officialCategories.reduce(
    (acc: Record<OfficialCategory, Official[]>, category: OfficialCategory) => {
      acc[category] = officials.filter(
        (official: Official) => official.category === category,
      )
      return acc
    },
    {} as Record<OfficialCategory, Official[]>,
  )

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-16 w-16 bg-muted rounded-full mb-4" />
                <div className="h-5 bg-muted rounded w-3/4 mb-2" />
                <div className="h-4 bg-muted rounded w-1/2" />
              </CardHeader>
              <CardContent>
                <div className="h-10 bg-muted rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12 space-y-16">
      <AnimatePresence mode="wait">
        {officialCategories.map((category, catIndex) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: catIndex * 0.2, duration: 0.5 }}
            className="space-y-8"
          >
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-primary mb-2">
                {category}
              </h2>
              <p className="text-muted-foreground">
                Meet the dedicated members serving Barangay Matiao
              </p>
            </div>

            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              <AnimatePresence>
                {groupedOfficials[category]?.map((official, index) => (
                  <motion.div
                    key={official.id}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{
                      delay: index * 0.1,
                      duration: 0.4,
                      ease: "easeOut",
                    }}
                    whileHover={{ scale: 1.03 }}
                  >
                    <Card className="hover:shadow-xl transition-all duration-300 border border-gray-200 rounded-2xl overflow-hidden">
                      <CardHeader className="relative">
                        <div className="flex items-start justify-between mb-3">
                          {official.imageUrl ? (
                            <div className="relative h-20 w-20 rounded-full overflow-hidden shadow-md ring-2 ring-primary/20">
                              <Image
                                src={official.imageUrl}
                                alt={official.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary shadow-md">
                              <User className="h-10 w-10" />
                            </div>
                          )}
                          <Badge
                            className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColors[official.status]}`}
                          >
                            {official.status}
                          </Badge>
                        </div>

                        <div className="mt-2">
                          <CardTitle className="text-lg font-semibold">
                            {official.name}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {official.position}
                          </p>
                        </div>
                      </CardHeader>

                      <CardContent>
                        <Button
                          variant="outline"
                          className="w-full border-primary/20 hover:bg-primary hover:text-white transition-colors cursor-not-allowed"
                          asChild
                        >
                          <a href={`tel:${official.contact}`}>
                            <Phone className="h-4 w-4 mr-2" />
                            {official.contact}
                          </a>
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

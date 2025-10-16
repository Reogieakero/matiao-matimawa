"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Phone, User } from "lucide-react"
import type { Official, OfficialStatus, OfficialCategory } from "@/lib/types"
import { useRealtime } from "@/hooks/use-realtime"
import Image from "next/image"

const statusColors: Record<OfficialStatus, string> = {
  "On Duty": "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  "On Leave": "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  "On Site": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
}

const officialCategories: OfficialCategory[] = ["Barangay Officials", "SK", "Staff"]

export function OfficialsContent() {
  const [officials, setOfficials] = useState<Official[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOfficials()
  }, [])

  const fetchOfficials = async () => {
    try {
      const response = await fetch("/api/officials")
      const data = await response.json()
      setOfficials(data)
    } catch (error) {
      console.error("[v0] Failed to fetch officials:", error)
    } finally {
      setLoading(false)
    }
  }

  useRealtime({
    eventTypes: ["official:updated"],
    onUpdate: (data) => {
      console.log("[v0] Received official update:", data)
      fetchOfficials()
    },
  })

  const groupedOfficials = officialCategories.reduce(
    (acc, category) => {
      acc[category] = officials.filter((official) => official.category === category)
      return acc
    },
    {} as Record<OfficialCategory, Official[]>,
  )

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
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
    <div className="container mx-auto px-4 py-12 space-y-12">
      {officialCategories.map((category) => (
        <div key={category} className="space-y-6">
          <h2 className="text-2xl font-bold border-b pb-3">{category}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groupedOfficials[category].map((official) => (
              <Card key={official.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between mb-4">
                    {official.imageUrl ? (
                      <div className="relative h-16 w-16 rounded-full overflow-hidden">
                        <Image
                          src={official.imageUrl || "/placeholder.svg"}
                          alt={official.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <User className="h-8 w-8" />
                      </div>
                    )}
                    <Badge className={statusColors[official.status]}>{official.status}</Badge>
                  </div>
                  <CardTitle className="text-xl mb-1">{official.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{official.position}</p>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full bg-transparent" asChild>
                    <a href={`tel:${official.contact}`}>
                      <Phone className="h-4 w-4 mr-2" />
                      {official.contact}
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

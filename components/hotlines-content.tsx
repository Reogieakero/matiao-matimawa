"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Phone, Shield, Flame, Heart, AlertTriangle, Ambulance } from "lucide-react"
import type { Hotline, HotlineCategory } from "@/lib/types"
import { useRealtime } from "@/hooks/use-realtime"

const categoryIcons: Record<HotlineCategory, React.ReactNode> = {
  Fire: <Flame className="h-6 w-6" />,
  Police: <Shield className="h-6 w-6" />,
  Army: <AlertTriangle className="h-6 w-6" />,
  Medical: <Heart className="h-6 w-6" />,
  "Disaster Response": <Ambulance className="h-6 w-6" />,
  Other: <Phone className="h-6 w-6" />,
}

const categoryColors: Record<HotlineCategory, string> = {
  Fire: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  Police: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  Army: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  Medical: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  "Disaster Response": "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  Other: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
}

const categories: HotlineCategory[] = ["Fire", "Police", "Army", "Medical", "Disaster Response", "Other"]

export function HotlinesContent() {
  const [hotlines, setHotlines] = useState<Hotline[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<HotlineCategory | "All">("All")

  useEffect(() => {
    fetchHotlines()
  }, [])

  const fetchHotlines = async () => {
    try {
      const response = await fetch("/api/hotlines")
      const data = await response.json()
      setHotlines(data)
    } catch (error) {
      console.error("[v0] Failed to fetch hotlines:", error)
    } finally {
      setLoading(false)
    }
  }

  useRealtime({
    eventTypes: ["hotline:updated"],
    onUpdate: (data) => {
      console.log("[v0] Received hotline update:", data)
      fetchHotlines()
    },
  })

  const filteredHotlines = hotlines.filter((hotline) => {
    if (selectedCategory === "All") return true
    return hotline.category === selectedCategory
  })

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {[1, 2, 3, 4, 5].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-muted rounded w-3/4 mb-2" />
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
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-8">
          <p className="text-sm text-center">
            <strong>Emergency Notice:</strong> For life-threatening emergencies, call 911 or your local emergency number
            immediately.
          </p>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Emergency Response Teams</h2>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === "All" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("All")}
            >
              All
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredHotlines.map((hotline) => (
            <Card key={hotline.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-lg ${categoryColors[hotline.category || "Other"]} flex-shrink-0`}
                  >
                    {categoryIcons[hotline.category || "Other"]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg mb-1">{hotline.name}</CardTitle>
                    <CardDescription className="text-sm">{hotline.department}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {hotline.description && <p className="text-sm text-muted-foreground">{hotline.description}</p>}
                <Button asChild className="w-full" size="lg">
                  <a href={`tel:${hotline.number}`}>
                    <Phone className="h-4 w-4 mr-2" />
                    {hotline.number}
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Calendar, ArrowRight } from "lucide-react"
import type { Announcement, AnnouncementCategory } from "@/lib/types"
import { useRealtime } from "@/hooks/use-realtime"
import { AnnouncementDetailModal } from "./announcement-detail-modal"
import Image from "next/image"

// Import Framer Motion
import { motion } from "framer-motion"

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05, // Subtle stagger delay between cards
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
}
// --------------------------


const categories: AnnouncementCategory[] = [
  "General",
  "Health",
  "Emergency",
  "Events",
  "Public Safety",
  "Community Development",
]

const categoryColors: Record<AnnouncementCategory, string> = {
  General: "bg-muted text-muted-foreground",
  Health: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  Emergency: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  Events: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  "Public Safety": "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  "Community Development": "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
}

export function AnnouncementsContent() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<AnnouncementCategory | "All">("All")
  const [loading, setLoading] = useState(true)
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  // Fetch announcements on mount
  useEffect(() => {
    fetchAnnouncements()
  }, [])

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch("/api/announcements")
      const data = await response.json()
      // Sort by date to show latest first (assuming 'date' is a sortable field)
      const sortedData = data.sort((a: Announcement, b: Announcement) => new Date(b.date).getTime() - new Date(a.date).getTime())
      setAnnouncements(sortedData)
    } catch (error) {
      console.error("[v0] Failed to fetch announcements:", error)
    } finally {
      setLoading(false)
    }
  }

  useRealtime({
    eventTypes: ["announcement:updated"],
    onUpdate: (data) => {
      console.log("[v0] Received announcement update:", data)
      fetchAnnouncements()
    },
  })

  // Filter logic
  const filteredAnnouncements = announcements.filter((announcement) => {
    const matchesSearch =
      announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      announcement.content.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "All" || announcement.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleReadMore = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement)
    setModalOpen(true)
  }

  const truncateContent = (content: string, maxLength = 150) => {
    if (content.length <= maxLength) return content
    return content.substring(0, maxLength) + "..."
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-muted rounded" />
                  <div className="h-3 bg-muted rounded" />
                  <div className="h-3 bg-muted rounded w-5/6" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Search and Filter */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }}
        className="mb-8 space-y-4"
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search announcements..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

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
      </motion.div>

      {/* Announcements Grid - Animate the grid container */}
      {filteredAnnouncements.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          className="text-center py-12"
        >
          <p className="text-muted-foreground text-lg">No announcements found</p>
        </motion.div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          // We use `key` change on the parent motion.div to trigger re-animation on filter/search
          // The key should represent the current filter state
          animate="visible"
          key={selectedCategory + searchQuery} 
        >
          {filteredAnnouncements.map((announcement) => (
            // Animate each individual card
            <motion.div 
              key={announcement.id} 
              variants={cardVariants}
              // Add whileHover for a professional, interactive touch
              whileHover={{ scale: 1.02, boxShadow: "0 10px 15px rgba(0, 0, 0, 0.1)" }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Card className="h-full hover:border-primary/50 transition-colors flex flex-col overflow-hidden">
                {announcement.posterUrl && (
                  <div className="relative h-48 w-full">
                    <Image
                      src={announcement.posterUrl || "/placeholder.svg"}
                      alt={announcement.title}
                      fill
                      className="object-cover" // Removed rounded-t-lg since Card has overall rounded corners
                    />
                  </div>
                )}
                <CardHeader className="flex-1 space-y-3 p-5">
                  <div className="flex items-start justify-between gap-2">
                    <Badge className={categoryColors[announcement.category]}>{announcement.category}</Badge>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                      <Calendar className="h-3 w-3" />
                      {new Date(announcement.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                  <CardTitle className="text-xl leading-snug">{announcement.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-0 p-5">
                  <CardDescription className="text-sm leading-relaxed text-muted-foreground">
                    {truncateContent(announcement.content)}
                  </CardDescription>
                  {(announcement.content.length > 150 || announcement.posterUrl) && ( // Ensure the button is always at the bottom if truncated or if there is an image
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-primary hover:bg-primary/10"
                      onClick={() => handleReadMore(announcement)}
                    >
                      Read More
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}

      <AnnouncementDetailModal announcement={selectedAnnouncement} open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  )
}
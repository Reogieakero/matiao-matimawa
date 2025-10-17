// components/announcements-content.tsx
"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Loader2, Users, Megaphone } from "lucide-react"
import type { Announcement, AnnouncementCategory } from "@/lib/types"
import { useRealtime } from "@/hooks/use-realtime"
import { AnnouncementDetailModal } from "./announcement-detail-modal"
import { motion, Variants } from "framer-motion"

// --- IMPORTED COMPONENTS ---
import { FeaturedAnnouncements } from "@/components/featured-announcements" 
import { AnnouncementFilters } from "./announcement-filters"
import { AnnouncementList } from "./announcement-list"
import { CallToActionBlock } from "@/components/call-to-action-block" 
// --------------------------


// NOTE: Move these constants and variants to a shared utility file or keep them here if only used by children
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
}
// --------------------------

// --- MAIN COMPONENT ---

export function AnnouncementsContent() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<AnnouncementCategory | "All">("All")
  const [loading, setLoading] = useState(true)
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  // Data Fetching Logic
  const fetchAnnouncements = useCallback(async () => {
    try {
      const response = await fetch("/api/announcements")
      const data = await response.json()
      const sortedData = data.sort((a: Announcement, b: Announcement) => new Date(b.date).getTime() - new Date(a.date).getTime())
      setAnnouncements(sortedData)
    } catch (error) {
      console.error("[v0] Failed to fetch announcements:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAnnouncements()
  }, [fetchAnnouncements])

  // Realtime Update Hook
  useRealtime({
    eventTypes: ["announcement:updated"],
    onUpdate: fetchAnnouncements,
  })

  // Derived State (Memoized for performance)
  const featuredAnnouncements = useMemo(() => {
    return announcements.slice(0, 3);
  }, [announcements]);

  const filteredAnnouncements = useMemo(() => {
    return announcements.filter((announcement: Announcement) => {
      const isFeatured = featuredAnnouncements.some(f => f.id === announcement.id);
      if (isFeatured) return false;

      const matchesSearch =
        announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        announcement.content.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === "All" || announcement.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [announcements, featuredAnnouncements, searchQuery, selectedCategory]);

  // Handler
  const handleReadMore = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement)
    setModalOpen(true)
  }

  // Loading State UI (Shorter Version)
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="animate-pulse flex flex-col h-[300px] border-2">
              <CardHeader className="flex-1">
                <div className="h-4 bg-muted rounded w-3/4 mb-2" />
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="h-3 bg-muted rounded w-full" />
                <div className="h-8 bg-muted rounded w-full mt-4" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="flex justify-center mt-10">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      
      {/* 1. Featured Section */}
      <FeaturedAnnouncements featured={featuredAnnouncements} handleReadMore={handleReadMore} />

      {/* 2. Filters & Search */}
      <AnnouncementFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {/* 3. Main List Grid */}
      <AnnouncementList
        filteredAnnouncements={filteredAnnouncements}
        selectedCategory={selectedCategory}
        searchQuery={searchQuery}
        handleReadMore={handleReadMore}
      />

      {/* 4. Call to Action */}
      <CallToActionBlock />

      {/* 5. Modal */}
      <AnnouncementDetailModal announcement={selectedAnnouncement} open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  )
}

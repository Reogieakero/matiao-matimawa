// components/announcements-content.jsx
"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Calendar, ArrowRight, Loader2, Mail, Users, Megaphone } from "lucide-react"
import type { Announcement, AnnouncementCategory } from "@/lib/types"
import { useRealtime } from "@/hooks/use-realtime"
import { AnnouncementDetailModal } from "./announcement-detail-modal"
import Image from "next/image"
import { motion } from "framer-motion"

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
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

const featuredCardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.6,
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

// --- NEW COMPONENT: FEATURED ANNOUNCEMENTS ---

const FeaturedAnnouncements = ({ featured, handleReadMore }) => {
    if (!featured || featured.length === 0) return null;

    return (
        <section className="mb-16">
            <h2 className="text-3xl font-bold mb-6 border-b pb-2 flex items-center gap-2">
                <Megaphone className="h-7 w-7 text-primary" /> 
                Featured Updates
            </h2>
            <motion.div
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {featured.map((announcement, index) => (
                    <motion.div key={announcement.id} variants={featuredCardVariants} custom={index}>
                        <Card className="h-full border-2 border-primary/20 bg-primary/5 shadow-lg flex flex-col overflow-hidden rounded-xl">
                            {announcement.posterUrl && (
                                <div className="relative h-40 w-full">
                                    <Image
                                        src={announcement.posterUrl || "/placeholder.svg"}
                                        alt={announcement.title}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            )}
                            <CardHeader className="flex-1 space-y-2 p-5">
                                <Badge 
                                    className={`${categoryColors[announcement.category]} font-bold text-xs py-1 px-3 shadow-sm`}
                                >
                                    {announcement.category}
                                </Badge>
                                <CardTitle className="text-xl font-extrabold leading-snug">{announcement.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 pt-0 p-5">
                                <Button
                                    variant="default"
                                    size="sm"
                                    className="w-full font-semibold"
                                    onClick={() => handleReadMore(announcement)}
                                >
                                    View Full Details
                                    <ArrowRight className="h-4 w-4 ml-2" />
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </motion.div>
        </section>
    );
};

// --- NEW COMPONENT: CALL TO ACTION BLOCK ---

const CallToActionBlock = () => (
    <motion.section 
        className="mt-20 py-12 px-8 rounded-2xl bg-primary/10 border-2 border-primary/20 flex flex-col md:flex-row items-center justify-between gap-6"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
    >
        <div className="text-center md:text-left">
            <h3 className="text-2xl md:text-3xl font-bold text-primary mb-2">
                Can't Find What You Need?
            </h3>
            <p className="text-muted-foreground text-lg">
                Reach out directly to the Barangay Hall or subscribe for real-time updates.
            </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <Button size="lg" asChild className="font-semibold shadow-md">
                <a href="/contact">
                    <Users className="h-5 w-5 mr-2" />
                    Contact Officials
                </a>
            </Button>
          
        </div>
    </motion.section>
);

// --- MAIN COMPONENT ---

export function AnnouncementsContent() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<AnnouncementCategory | "All">("All")
  const [loading, setLoading] = useState(true)
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    fetchAnnouncements()
  }, [])

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch("/api/announcements")
      const data = await response.json()
      // Sort by date (latest first)
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

  // Determine featured announcements (first 3, or less if not enough)
  const featuredAnnouncements = useMemo(() => {
    return announcements.slice(0, 3);
  }, [announcements]);

  const filteredAnnouncements = announcements.filter((announcement) => {
    // Exclude featured from the main filtered list to avoid duplication
    const isFeatured = featuredAnnouncements.some(f => f.id === announcement.id);
    if (isFeatured) return false;

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
            <Card key={i} className="animate-pulse flex flex-col h-[300px] border-2">
              <CardHeader className="flex-1">
                <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="h-3 bg-muted rounded" />
                <div className="h-3 bg-muted rounded" />
                <div className="h-3 bg-muted rounded w-5/6" />
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
      
      {/* 1. NEW: FEATURED ANNOUNCEMENTS */}
      <FeaturedAnnouncements featured={featuredAnnouncements} handleReadMore={handleReadMore} />

      {/* Main Content Filters and Search */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }}
        className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between" 
      >
        <div className="max-w-md w-full">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search all announcements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 text-base shadow-sm focus-visible:ring-primary"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm font-medium text-foreground py-1">Filter:</span>
          <Button
            variant={selectedCategory === "All" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory("All")}
            className="transition-colors duration-200"
          >
            All
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="transition-colors duration-200"
            >
              {category}
            </Button>
          ))}
        </div>
      </motion.div>

      {/* Main Announcements Grid */}
      <h2 className="text-2xl font-bold mb-6 text-foreground/80 border-b pb-2">
          {selectedCategory === "All" ? "All Announcements" : `${selectedCategory} Announcements`}
      </h2>
      
      {filteredAnnouncements.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          className="text-center py-12 border border-dashed rounded-lg bg-muted/20"
        >
          <p className="text-muted-foreground text-lg">
            No announcements found matching your criteria. Try adjusting your search or filters.
          </p>
        </motion.div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          key={selectedCategory + searchQuery} 
        >
          {filteredAnnouncements.map((announcement) => (
            <motion.div 
              key={announcement.id} 
              variants={cardVariants}
              whileHover={{ 
                scale: 1.01,
                boxShadow: "0 15px 25px -5px rgba(0, 0, 0, 0.1), 0 5px 10px -5px rgba(0, 0, 0, 0.04)",
                y: -5,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <Card 
                className="h-full border border-border/70 bg-card/90 backdrop-blur-sm 
                           hover:border-primary/50 transition-all duration-300 flex flex-col overflow-hidden rounded-xl"
              >
                {announcement.posterUrl && (
                  <div className="relative h-48 w-full">
                    <div className="absolute inset-0 bg-black/10 z-[1]" /> 
                    <Image
                      src={announcement.posterUrl || "/placeholder.svg"}
                      alt={announcement.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                
                <CardHeader className="flex-1 space-y-3 p-6 pb-4">
                  <div className="flex items-start justify-between gap-2">
                    <Badge 
                      className={`${categoryColors[announcement.category]} font-semibold text-xs py-1 px-3 shadow-sm`}
                    >
                      {announcement.category}
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                      <Calendar className="h-3 w-3" />
                      {new Date(announcement.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                  <CardTitle className="text-xl font-bold leading-snug text-foreground/90">{announcement.title}</CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-4 pt-0 p-6">
                  <CardDescription className="text-sm leading-relaxed text-muted-foreground/80">
                    {truncateContent(announcement.content)}
                  </CardDescription>
                  {(announcement.content.length > 150 || announcement.posterUrl) && (
                    <Button
                      variant="link"
                      size="sm"
                      className="w-full justify-start text-primary hover:text-primary/80 px-0 pt-2 font-semibold"
                      onClick={() => handleReadMore(announcement)}
                    >
                      Read More
                      <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                    </Button>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}

      <CallToActionBlock />

      <AnnouncementDetailModal announcement={selectedAnnouncement} open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  )
}
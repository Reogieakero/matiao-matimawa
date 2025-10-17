// components/announcement-card.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, ArrowRight } from "lucide-react"
import type { Announcement, AnnouncementCategory } from "@/lib/types"
import Image from "next/image"
import { motion, Variants } from "framer-motion"

// --- Constants (copied from main file) ---
const categoryColors: Record<AnnouncementCategory, string> = {
  General: "bg-muted text-muted-foreground",
  Health: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  Emergency: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  Events: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  "Public Safety": "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  "Community Development": "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
}

// --- Animation Variants (copied from main file) ---
const cardVariants: Variants = {
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

interface AnnouncementCardProps {
  announcement: Announcement
  handleReadMore: (announcement: Announcement) => void
}

const truncateContent = (content: string, maxLength = 150) => {
  if (content.length <= maxLength) return content
  return content.substring(0, maxLength) + "..."
}

export const AnnouncementCard = ({ announcement, handleReadMore }: AnnouncementCardProps) => (
  <motion.div 
    key={announcement.id} 
    variants={cardVariants}
    whileHover={{ 
      scale: 1.01,
      boxShadow: "0 15px 25px -5px rgba(0, 0, 0, 0.1), 0 5px 10px -5px rgba(0, 0, 0, 0.04)",
      y: -5,
    }}
    transition={{ type: "spring", stiffness: 300, damping: 25 }}
    className="group" // Added group for hover effects on inner elements
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
)
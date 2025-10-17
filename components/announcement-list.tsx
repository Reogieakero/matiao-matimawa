// components/announcement-list.tsx
import type { Announcement, AnnouncementCategory } from "@/lib/types"
import { motion, Variants } from "framer-motion"
import { AnnouncementCard } from "./announcement-card"

// --- Animation Variants (copied from main file) ---
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

interface AnnouncementListProps {
  filteredAnnouncements: Announcement[]
  selectedCategory: AnnouncementCategory | "All"
  searchQuery: string
  handleReadMore: (announcement: Announcement) => void
}

export const AnnouncementList = ({
  filteredAnnouncements,
  selectedCategory,
  searchQuery,
  handleReadMore,
}: AnnouncementListProps) => (
  <>
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
          <AnnouncementCard 
            key={announcement.id} 
            announcement={announcement} 
            handleReadMore={handleReadMore} 
          />
        ))}
      </motion.div>
    )}
  </>
)
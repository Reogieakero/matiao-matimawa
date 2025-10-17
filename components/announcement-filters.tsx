// components/announcement-filters.tsx
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import type { AnnouncementCategory } from "@/lib/types"
import { motion } from "framer-motion"

// --- Constants (copied from main file) ---
const categories: AnnouncementCategory[] = [
  "General",
  "Health",
  "Emergency",
  "Events",
  "Public Safety",
  "Community Development",
]
// --------------------------

interface AnnouncementFiltersProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  selectedCategory: AnnouncementCategory | "All"
  setSelectedCategory: (category: AnnouncementCategory | "All") => void
}

export const AnnouncementFilters = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
}: AnnouncementFiltersProps) => (
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
)
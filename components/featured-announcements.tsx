// components/featured-announcements.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, Megaphone } from "lucide-react"
import type { Announcement, AnnouncementCategory } from "@/lib/types"
import Image from "next/image"
import { motion, Variants } from "framer-motion"

// --- Constants (Shared Styling) ---
const categoryColors: Record<AnnouncementCategory, string> = {
    General: "bg-muted text-muted-foreground",
    Health: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    Emergency: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    Events: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    "Public Safety": "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
    "Community Development": "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
}

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05,
        },
    },
}

const featuredCardVariants: Variants = {
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

interface FeaturedAnnouncementsProps {
    featured: Announcement[]; 
    handleReadMore: (announcement: Announcement) => void; 
}

export const FeaturedAnnouncements = ({ featured, handleReadMore }: FeaturedAnnouncementsProps) => { 
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
                {featured.map((announcement: Announcement, index) => (
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
"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "lucide-react"
import type { Announcement, AnnouncementCategory } from "@/lib/types"
import Image from "next/image"

const categoryColors: Record<AnnouncementCategory, string> = {
  General: "bg-muted text-muted-foreground",
  Health: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  Emergency: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  Events: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  "Public Safety": "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  "Community Development": "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
}

interface AnnouncementDetailModalProps {
  announcement: Announcement | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AnnouncementDetailModal({ announcement, open, onOpenChange }: AnnouncementDetailModalProps) {
  if (!announcement) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{announcement.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {announcement.posterUrl && (
            <div className="relative h-64 w-full">
              <Image
                src={announcement.posterUrl || "/placeholder.svg"}
                alt={announcement.title}
                fill
                className="object-cover rounded-lg"
              />
            </div>
          )}

          <div className="flex items-center gap-4">
            <Badge className={categoryColors[announcement.category]}>{announcement.category}</Badge>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              {new Date(announcement.date).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </div>
          </div>

          <div className="prose dark:prose-invert max-w-none">
            <p className="text-base leading-relaxed whitespace-pre-wrap">{announcement.content}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

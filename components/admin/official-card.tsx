"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { User, Edit, Trash2 } from "lucide-react"
import { motion } from "framer-motion"
import type { Official, OfficialStatus } from "@/lib/types"

interface OfficialCardProps {
  official: Official
  onEdit: (o: Official) => void
  onDelete: (o: Official) => void
}

export function OfficialCard({ official, onEdit, onDelete }: OfficialCardProps) {
  const statusColors: Record<OfficialStatus, string> = {
    "On Duty": "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    "On Leave": "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
    "On Site": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  }

  return (
    <motion.div
      whileHover={{
        scale: 1.01,
        boxShadow: "0 15px 25px -5px rgba(0, 0, 0, 0.1), 0 5px 10px -5px rgba(0, 0, 0, 0.04)",
        y: -5,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="group"
    >
      <Card className="h-full border border-border/70 bg-card/90 backdrop-blur-sm hover:border-primary/50 transition-all duration-300 flex flex-col overflow-hidden rounded-xl">
        <CardHeader>
          <div className="flex items-start gap-4">
            {official.imageUrl ? (
              <div className="relative h-16 w-16 rounded-full overflow-hidden flex-shrink-0">
                <Image src={official.imageUrl || "/placeholder.svg"} alt={official.name} fill className="object-cover" />
              </div>
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary flex-shrink-0">
                <User className="h-8 w-8" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg mb-1 line-clamp-1">{official.name}</CardTitle>
              <p className="text-sm text-muted-foreground mb-2 line-clamp-1">{official.position}</p>
              <p className="text-sm font-medium mb-2">{official.contact}</p>
              <Badge className={statusColors[official.status]}>{official.status}</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex space-x-2">
            <Button size="sm" variant="outline" onClick={() => onEdit(official)} className="flex-1">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button size="sm" variant="destructive" onClick={() => onDelete(official)} className="w-10 p-0" title={`Delete ${official.name}`}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

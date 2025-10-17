"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Phone, Edit, Trash2 } from "lucide-react"
import { motion } from "framer-motion"
import type { Hotline } from "@/lib/types"

interface HotlineCardProps {
  hotline: Hotline
  onEdit: (h: Hotline) => void
  onDelete: (h: Hotline) => void
}

export function HotlineCard({ hotline, onEdit, onDelete }: HotlineCardProps) {
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
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive flex-shrink-0">
              <Phone className="h-6 w-6" />
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg mb-1 line-clamp-1">{hotline.name}</CardTitle>
              <p className="text-sm text-muted-foreground mb-1">{hotline.department}</p>
              {hotline.category && <p className="text-xs font-medium text-primary mb-1">{hotline.category}</p>}
              <p className="text-lg font-semibold text-primary">{hotline.number}</p>
              {hotline.description && (
                <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{hotline.description}</p>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => onEdit(hotline)} className="flex-1">
              <Edit className="h-4 w-4 mr-1" /> Edit
            </Button>
            <Button size="sm" variant="destructive" onClick={() => onDelete(hotline)} className="flex-1">
              <Trash2 className="h-4 w-4 mr-1" /> Delete
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
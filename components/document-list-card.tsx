// components/document-list-card.tsx

"use client"

import React from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, DollarSign } from "lucide-react"
import type { Document } from "@/lib/service-data"

interface DocumentListCardProps {
  document: Document
  index?: number
  className?: string
}

export function DocumentListCard({ document, index = 0, className }: DocumentListCardProps) {
  return (
    <Card 
      className={`hover:shadow-lg transition-shadow flex flex-col animate-in fade-in-0 slide-in-from-top-4 duration-500 h-full ${className || ''}`}
      style={{ animationDelay: `${index * 75}ms` }}>
      <CardHeader>
        <CardTitle className="text-lg">{document.name}</CardTitle>
        <CardDescription>{document.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 space-y-4">
        <div>
          <h4 className="font-semibold text-sm mb-2">Requirements:</h4>
          <ul className="space-y-1">
            {document.requirements.map((req, idx) => (
              <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="h-4 w-4 text-green-600" />
                <span>{req}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="pt-4 border-t">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Price:</span>
            <Badge variant="secondary" className="text-base">
              <DollarSign className="h-4 w-4 mr-1" />
              {document.price === 0 ? "FREE" : `₱${document.price}`}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
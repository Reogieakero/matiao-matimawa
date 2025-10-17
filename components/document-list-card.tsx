// components/document-list-card.tsx

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DollarSign, CheckIcon } from "lucide-react"
import type { Document } from "@/lib/service-data"

interface DocumentListCardProps {
  document: Document
  index: number
}

export function DocumentListCard({ document, index }: DocumentListCardProps) {
  return (
    <Card
      key={document.id}
      // FIXED: Combined the two 'className' declarations into one.
      // The animation classes (animate-in, fade-in-0, etc.) are now correctly merged with the base styling.
      className="hover:shadow-lg transition-shadow flex flex-col 
                 animate-in fade-in-0 slide-in-from-top-4 duration-500"
      // The style attribute for staggering animation remains separate and correct.
      style={{ animationDelay: `${index * 75}ms` }}
    >
      <CardHeader>
        <CardTitle className="text-lg">{document.name}</CardTitle>
        <CardDescription>{document.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 space-y-4">
        <div>
          <h4 className="font-semibold text-sm mb-2">Requirements:</h4>
          <ul className="space-y-1">
            {document.requirements.map((req, idx) => (
              <li
                key={idx}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <CheckIcon className="h-4 w-4 text-green-600" />
                {req}
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
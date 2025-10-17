"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Hotline, HotlineCategory } from "@/lib/types"

interface HotlineFormData {
  name: string
  department: string
  number: string
  description: string
  category: HotlineCategory
}

interface HotlineFormProps {
  formData: HotlineFormData
  categories: HotlineCategory[]
  isEditing: boolean
  onSubmit: (e: React.FormEvent) => void
  onChange: (patch: Partial<HotlineFormData>) => void
  onCancel: () => void
}

export function HotlineForm({ formData, categories, isEditing, onSubmit, onChange, onCancel }: HotlineFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? "Edit Hotline" : "Create New Hotline"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input 
                id="name" 
                value={formData.name} 
                onChange={(e) => onChange({ name: e.target.value })} 
                required 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input 
                id="department" 
                value={formData.department} 
                onChange={(e) => onChange({ department: e.target.value })} 
                required 
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select 
              value={formData.category} 
              onValueChange={(value) => onChange({ category: value as HotlineCategory })}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="number">Phone Number</Label>
            <Input 
              id="number" 
              type="tel" 
              value={formData.number} 
              onChange={(e) => onChange({ number: e.target.value })} 
              required 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea 
              id="description" 
              value={formData.description} 
              onChange={(e) => onChange({ description: e.target.value })} 
              rows={3} 
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit">{isEditing ? "Update" : "Create"}</Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
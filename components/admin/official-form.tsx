"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, X } from "lucide-react"
import type { Official, OfficialCategory, OfficialStatus } from "@/lib/types"
import Image from "next/image"

interface OfficialFormData {
  name: string
  position: string
  contact: string
  status: OfficialStatus
  category: OfficialCategory
  imageUrl: string
}

interface OfficialFormProps {
  formData: OfficialFormData
  imagePreview: string
  isDragging: boolean
  officialCategories: OfficialCategory[]
  statuses: OfficialStatus[]
  onChange: (patch: Partial<OfficialFormData>) => void
  onFileChange: (file: File) => void
  onRemoveImage: () => void
  onSubmit: (e: React.FormEvent) => void
  onCancel: () => void
}

export function OfficialForm({ formData, imagePreview, isDragging, officialCategories, statuses, onChange, onFileChange, onRemoveImage, onSubmit, onCancel }: OfficialFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{formData.name ? "Edit Official" : "Add New Official"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={formData.name} onChange={(e) => onChange({ name: e.target.value })} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="position">Position</Label>
              <Input id="position" value={formData.position} onChange={(e) => onChange({ position: e.target.value })} required />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contact">Contact</Label>
              <Input id="contact" type="tel" value={formData.contact} onChange={(e) => onChange({ contact: e.target.value })} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category} onValueChange={(value) => onChange({ category: value as OfficialCategory })} required>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {officialCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => onChange({ status: value as OfficialStatus })} required>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Official Photo (Optional)</Label>
            {imagePreview ? (
              <div className="relative w-full h-48 border rounded-lg overflow-hidden">
                <Image src={imagePreview || "/placeholder.svg"} alt="Preview" fill className="object-cover" />
                <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2" onClick={onRemoveImage}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25"}`}>
                <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-2">Drag and drop an image here, or click to browse</p>
                <Input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && onFileChange(e.target.files[0])} className="hidden" id="image-upload" />
                <Button type="button" variant="outline" onClick={() => document.getElementById("image-upload")?.click()}>
                  Choose File
                </Button>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Button type="submit">{formData.name ? "Update Official" : "Add Official"}</Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

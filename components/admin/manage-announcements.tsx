"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Loader2, Upload, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { Announcement, AnnouncementCategory } from "@/lib/types"
import { addActivityLog } from "@/lib/activity-log"
import Image from "next/image"

const categories: AnnouncementCategory[] = [
  "General",
  "Health",
  "Emergency",
  "Events",
  "Public Safety",
  "Community Development",
]

const categoryColors: Record<AnnouncementCategory, string> = {
  General: "bg-muted text-muted-foreground",
  Health: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  Emergency: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  Events: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  "Public Safety": "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  "Community Development": "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
}

const handleDelete = async (id: string, title: string) => {
  // Placeholder for handleDelete logic
  console.log(`Deleting announcement with id: ${id} and title: ${title}`)
}

export function ManageAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [filterCategory, setFilterCategory] = useState<AnnouncementCategory | "All">("All")
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    title: "",
    category: "" as AnnouncementCategory,
    content: "",
    date: new Date().toISOString().split("T")[0],
    posterUrl: "",
  })
  const [posterFile, setPosterFile] = useState<File | null>(null)
  const [posterPreview, setPosterPreview] = useState<string>("")
  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    fetchAnnouncements()
  }, [])

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch("/api/announcements")
      const data = await response.json()
      setAnnouncements(data)
    } catch (error) {
      console.error("[v0] Failed to fetch announcements:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = "/api/announcements"
      const method = editingId ? "PUT" : "POST"
      const body = editingId ? { ...formData, id: editingId } : formData

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (response.ok) {
        toast({
          title: editingId ? "Announcement Updated" : "Announcement Created",
          description: "Changes saved successfully",
        })
        addActivityLog(
          editingId ? "UPDATE_ANNOUNCEMENT" : "CREATE_ANNOUNCEMENT",
          `${editingId ? "Updated" : "Created"} announcement: ${formData.title}`,
        )
        resetForm()
        fetchAnnouncements()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save announcement",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (announcement: Announcement) => {
    setFormData({
      title: announcement.title,
      category: announcement.category,
      content: announcement.content,
      date: announcement.date,
      posterUrl: announcement.posterUrl || "",
    })
    setPosterPreview(announcement.posterUrl || "")
    setPosterFile(null)
    setEditingId(announcement.id)
    setShowForm(true)
  }

  const handleFileChange = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      setPosterFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        setPosterPreview(base64String)
        setFormData({ ...formData, posterUrl: base64String })
      }
      reader.readAsDataURL(file)
    } else {
      toast({
        title: "Invalid File",
        description: "Please select an image file",
        variant: "destructive",
      })
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFileChange(file)
  }

  const handleRemovePoster = () => {
    setPosterFile(null)
    setPosterPreview("")
    setFormData({ ...formData, posterUrl: "" })
  }

  const resetForm = () => {
    setFormData({
      title: "",
      category: "" as AnnouncementCategory,
      content: "",
      date: new Date().toISOString().split("T")[0],
      posterUrl: "",
    })
    setPosterFile(null)
    setPosterPreview("")
    setEditingId(null)
    setShowForm(false)
  }

  const filteredAnnouncements = announcements.filter(
    (announcement) => filterCategory === "All" || announcement.category === filterCategory,
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Manage Announcements</h2>
          <p className="text-muted-foreground">Create, edit, and delete announcements</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-2" />
          New Announcement
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          variant={filterCategory === "All" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilterCategory("All")}
        >
          All
        </Button>
        {categories.map((category) => (
          <Button
            key={category}
            variant={filterCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterCategory(category)}
          >
            {category}
          </Button>
        ))}
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? "Edit Announcement" : "Create New Announcement"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value as AnnouncementCategory })}
                    required
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Poster Image (Optional)</Label>
                {posterPreview ? (
                  <div className="relative w-full h-64 border rounded-lg overflow-hidden">
                    <Image
                      src={posterPreview || "/placeholder.svg"}
                      alt="Poster preview"
                      fill
                      className="object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={handleRemovePoster}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                      isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25"
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Drag and drop a poster image here, or click to browse
                    </p>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
                      className="hidden"
                      id="poster-upload"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById("poster-upload")?.click()}
                    >
                      Choose File
                    </Button>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button type="submit">{editingId ? "Update" : "Create"}</Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredAnnouncements.map((announcement) => (
          <Card key={announcement.id} className="flex flex-col">
            {announcement.posterUrl && (
              <div className="relative h-48 w-full">
                <Image
                  src={announcement.posterUrl || "/placeholder.svg"}
                  alt={announcement.title}
                  fill
                  className="object-cover rounded-t-lg"
                />
              </div>
            )}
            <CardHeader className="flex-1">
              <div className="flex items-start justify-between gap-2 mb-2">
                <Badge className={categoryColors[announcement.category]}>{announcement.category}</Badge>
              </div>
              <CardTitle className="text-lg line-clamp-2">{announcement.title}</CardTitle>
              <CardDescription className="line-clamp-3">{announcement.content}</CardDescription>
              <p className="text-xs text-muted-foreground mt-2">
                Date: {new Date(announcement.date).toLocaleDateString()}
              </p>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => handleEdit(announcement)} className="flex-1">
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(announcement.id, announcement.title)}
                  className="flex-1"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

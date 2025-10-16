"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

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

export function ManageAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [filterCategory, setFilterCategory] = useState<AnnouncementCategory | "All">("All")

  const [deleting, setDeleting] = useState<Announcement | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const { toast } = useToast()

  const [formData, setFormData] = useState({
    title: "",
    category: "" as AnnouncementCategory,
    content: "",
    date: new Date().toISOString().split("T")[0],
    posterUrl: "",
  })
  const [posterFile, setPosterFile] = useState<File | null>(null)
  const [posterPreview, setPosterPreview] = useState("")
  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    fetchAnnouncements()
  }, [])

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch("/api/announcements")
      const data = await res.json()
      setAnnouncements(data)
    } catch {
      toast({ title: "Error", description: "Failed to load announcements", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const url = "/api/announcements"
    const method = editingId ? "PUT" : "POST"
    const body = editingId ? { ...formData, id: editingId } : formData

    try {
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
      if (!res.ok) throw new Error("Failed to save")

      toast({
        title: editingId ? "Announcement Updated" : "Announcement Created",
        description: "Changes saved successfully",
      })

      addActivityLog(editingId ? "UPDATE_ANNOUNCEMENT" : "CREATE_ANNOUNCEMENT", `${formData.title}`)
      resetForm()
      fetchAnnouncements()
    } catch {
      toast({ title: "Error", description: "Failed to save announcement", variant: "destructive" })
    }
  }

  const handleEdit = (a: Announcement) => {
    setFormData({
      title: a.title,
      category: a.category,
      content: a.content,
      date: a.date,
      posterUrl: a.posterUrl || "",
    })
    setPosterPreview(a.posterUrl || "")
    setPosterFile(null)
    setEditingId(a.id)
    setShowForm(true)
  }

  const handleFileChange = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64 = reader.result as string
        setPosterPreview(base64)
        setFormData({ ...formData, posterUrl: base64 })
      }
      reader.readAsDataURL(file)
    } else {
      toast({ title: "Invalid File", description: "Please select an image", variant: "destructive" })
    }
  }

  const handleConfirmDelete = async () => {
    if (!deleting) return
    setIsDeleting(true)
    try {
      const res = await fetch(`/api/announcements?id=${deleting.id}`, { method: "DELETE" })
      if (!res.ok) throw new Error()
      setAnnouncements((prev) => prev.filter((a) => a.id !== deleting.id))
      toast({ title: "Announcement Deleted", description: `${deleting.title} has been removed.` })
      addActivityLog("DELETE_ANNOUNCEMENT", deleting.title)
    } catch {
      toast({ title: "Error", description: "Failed to delete announcement", variant: "destructive" })
    } finally {
      setIsDeleting(false)
      setDeleting(null)
    }
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

  const filtered = announcements.filter((a) => filterCategory === "All" || a.category === filterCategory)

  if (loading)
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Manage Announcements</h2>
          <p className="text-muted-foreground">Create, edit, or delete announcements</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-2" /> New Announcement
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? "Edit Announcement" : "Create New Announcement"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Label>Title</Label>
              <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
              <Label>Category</Label>
              <Select
                value={formData.category}
                onValueChange={(v) => setFormData({ ...formData, category: v as AnnouncementCategory })}
                required
              >
                <SelectTrigger>
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
              <Label>Date</Label>
              <Input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
              <Label>Content</Label>
              <Textarea value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} rows={4} />
              <Label>Poster Image (Optional)</Label>
              {posterPreview ? (
                <div className="relative h-56 border rounded-lg overflow-hidden">
                  <Image src={posterPreview} alt="Poster" fill className="object-cover" />
                  <Button size="icon" variant="destructive" className="absolute top-2 right-2" onClick={() => setPosterPreview("")}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition ${
                    isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25"
                  }`}
                  onDragOver={(e) => {
                    e.preventDefault()
                    setIsDragging(true)
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault()
                    setIsDragging(false)
                    const file = e.dataTransfer.files[0]
                    if (file) handleFileChange(file)
                  }}
                >
                  <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-2">Drag & drop an image or click below</p>
                  <Input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])} />
                </div>
              )}
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

      {/* Confirmation Dialog */}
      <AlertDialog open={!!deleting} onOpenChange={() => setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete <b>{deleting?.title}</b>. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} disabled={isDeleting} className="bg-destructive text-white">
              {isDeleting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Trash2 className="h-4 w-4 mr-2" />}
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((a) => (
          <Card key={a.id} className="flex flex-col">
            {a.posterUrl && (
              <div className="relative h-48 w-full">
                <Image src={a.posterUrl} alt={a.title} fill className="object-cover rounded-t-lg" />
              </div>
            )}
            <CardHeader className="flex-1">
              <Badge className={categoryColors[a.category]}>{a.category}</Badge>
              <CardTitle className="mt-2">{a.title}</CardTitle>
              <CardDescription>{a.content}</CardDescription>
              <p className="text-xs text-muted-foreground mt-2">Date: {new Date(a.date).toLocaleDateString()}</p>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => handleEdit(a)} className="flex-1">
                  <Edit className="h-4 w-4 mr-1" /> Edit
                </Button>
                <Button size="sm" variant="destructive" onClick={() => setDeleting(a)} className="flex-1">
                  <Trash2 className="h-4 w-4 mr-1" /> Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit, Trash2, Loader2, Phone } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { Hotline, HotlineCategory } from "@/lib/types"
import { addActivityLog } from "@/lib/activity-log"

// Confirmation Dialog imports
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

const categories: HotlineCategory[] = ["Fire", "Police", "Army", "Medical", "Disaster Response", "Other"]

export function ManageHotlines() {
  const [hotlines, setHotlines] = useState<Hotline[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<Hotline | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: "",
    department: "",
    number: "",
    description: "",
    category: "Other" as HotlineCategory,
  })

  useEffect(() => {
    fetchHotlines()
  }, [])

  const fetchHotlines = async () => {
    try {
      const response = await fetch("/api/hotlines")
      const data = await response.json()
      setHotlines(data)
    } catch (error) {
      console.error("[v0] Failed to fetch hotlines:", error)
      toast({ title: "Error", description: "Failed to load hotlines", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = "/api/hotlines"
      const method = editingId ? "PUT" : "POST"
      const body = editingId ? { ...formData, id: editingId } : formData

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (response.ok) {
        toast({
          title: editingId ? "Hotline Updated" : "Hotline Created",
          description: "Changes saved successfully",
        })
        addActivityLog(
          editingId ? "UPDATE_HOTLINE" : "CREATE_HOTLINE",
          `${editingId ? "Updated" : "Created"} hotline: ${formData.name}`,
        )
        resetForm()
        fetchHotlines()
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to save hotline", variant: "destructive" })
    }
  }

  const handleEdit = (hotline: Hotline) => {
    setFormData({
      name: hotline.name,
      department: hotline.department,
      number: hotline.number,
      description: hotline.description || "",
      category: hotline.category || "Other",
    })
    setEditingId(hotline.id)
    setShowForm(true)
  }

  const handleConfirmDelete = async () => {
    if (!deleting) return
    setIsDeleting(true)

    try {
      const response = await fetch(`/api/hotlines?id=${deleting.id}`, { method: "DELETE" })
      if (!response.ok) throw new Error("Failed to delete hotline")

      toast({
        title: "Hotline Deleted",
        description: `${deleting.name} has been successfully removed.`,
      })
      addActivityLog("DELETE_HOTLINE", `Deleted hotline: ${deleting.name}`)
      setHotlines(hotlines.filter((h) => h.id !== deleting.id))
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete hotline",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setDeleting(null)
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      department: "",
      number: "",
      description: "",
      category: "Other",
    })
    setEditingId(null)
    setShowForm(false)
  }

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
          <h2 className="text-2xl font-bold">Manage Hotlines</h2>
          <p className="text-muted-foreground">Add, edit, and delete emergency hotlines</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-2" />
          New Hotline
        </Button>
      </div>

      {/* Hotline Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? "Edit Hotline" : "Create New Hotline"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Input id="department" value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value as HotlineCategory })}>
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
                <Input id="number" type="tel" value={formData.number} onChange={(e) => setFormData({ ...formData, number: e.target.value })} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} />
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleting} onOpenChange={() => setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. It will permanently delete the hotline{" "}
              <span className="font-semibold text-primary">{deleting?.name}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90 text-white"
            >
              {isDeleting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Trash2 className="h-4 w-4 mr-2" />}
              {isDeleting ? "Deleting..." : "Delete Hotline"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Hotline List */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {hotlines.map((hotline) => (
          <Card key={hotline.id} className="hover:shadow-lg transition-shadow">
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
                <Button size="sm" variant="outline" onClick={() => handleEdit(hotline)} className="flex-1">
                  <Edit className="h-4 w-4 mr-1" /> Edit
                </Button>
                <Button size="sm" variant="destructive" onClick={() => setDeleting(hotline)} className="flex-1">
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

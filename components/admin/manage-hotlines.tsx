"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { Hotline, HotlineCategory } from "@/lib/types"
import { addActivityLog } from "@/lib/activity-log"
import { HotlineCard } from "@/components/admin/hotline-card"
import { HotlineForm } from "@/components/admin/hotline-form"
import { HotlineDeleteDialog } from "@/components/admin/hotline-delete-dialog"

const categories: HotlineCategory[] = ["Fire", "Police", "Army", "Medical", "Disaster Response", "Other"]

export function ManageHotlines() {
  const [hotlines, setHotlines] = useState<Hotline[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deletingHotline, setDeletingHotline] = useState<Hotline | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState<{
    name: string
    department: string
    number: string
    description: string
    category: HotlineCategory
  }>({
    name: "",
    department: "",
    number: "",
    description: "",
    category: "Other",
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
    if (!deletingHotline) return
    setIsDeleting(true)

    try {
      const response = await fetch(`/api/hotlines?id=${deletingHotline.id}`, { method: "DELETE" })
      if (!response.ok) throw new Error("Failed to delete hotline")

      toast({
        title: "Hotline Deleted",
        description: `${deletingHotline.name} has been successfully removed.`,
      })
      addActivityLog("DELETE_HOTLINE", `Deleted hotline: ${deletingHotline.name}`)
      setHotlines(hotlines.filter((h) => h.id !== deletingHotline.id))
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete hotline",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setDeletingHotline(null)
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
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-2" />
          New Hotline
        </Button>
      </div>

      {/* Hotline Form */}
      {showForm && (
        <HotlineForm
          formData={formData}
          categories={categories}
          isEditing={!!editingId}
          onSubmit={handleSubmit}
          onChange={(patch) => setFormData((prev) => ({ ...prev, ...patch }))}
          onCancel={resetForm}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <HotlineDeleteDialog
        openHotline={deletingHotline}
        isDeleting={isDeleting}
        onClose={() => setDeletingHotline(null)}
        onConfirm={handleConfirmDelete}
      />

      {/* Hotline List */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {hotlines.map((hotline) => (
          <HotlineCard
            key={hotline.id}
            hotline={hotline}
            onEdit={handleEdit}
            onDelete={setDeletingHotline}
          />
        ))}
      </div>
    </div>
  )
}

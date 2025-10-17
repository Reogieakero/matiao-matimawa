
"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, Plus, X } from "lucide-react"
import { OfficialCard } from "@/components/admin/official-card"
import { OfficialForm } from "@/components/admin/official-form"
import { OfficialDeleteDialog } from "@/components/admin/official-delete-dialog"
import { useToast } from "@/hooks/use-toast"
import type { Official, OfficialStatus, OfficialCategory } from "@/lib/types"
import { addActivityLog } from "@/lib/activity-log"
// (Dialog and form moved to dedicated components)


const statuses: OfficialStatus[] = ["On Duty", "On Leave", "On Site"]
const officialCategories: OfficialCategory[] = ["Barangay Officials", "SK", "Staff"]

// statusColors moved into OfficialCard for consistency

export function ManageOfficials() {
  const [officials, setOfficials] = useState<Official[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  
  // New State for Deletion
  const [deletingOfficial, setDeletingOfficial] = useState<Official | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  
  const { toast } = useToast()

  const [formData, setFormData] = useState<{
    name: string
    position: string
    contact: string
    status: OfficialStatus
    category: OfficialCategory
    imageUrl: string
  }>({
    name: "",
    position: "",
    contact: "",
    status: "On Duty",  // Set a default value
    category: "Barangay Officials",  // Set a default value
    imageUrl: "",
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    fetchOfficials()
  }, [])

  const fetchOfficials = async () => {
    try {
      const response = await fetch("/api/officials")
      if (!response.ok) throw new Error("Failed to fetch officials")
      const data = await response.json()
      setOfficials(data)
    } catch (error) {
      console.error("[v0] Failed to fetch officials:", error)
      toast({
        title: "Error",
        description: "Failed to load officials data.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddNew = () => {
    resetForm()
    setShowForm(true)
  }

  const handleEdit = (official: Official) => {
    setFormData({
      name: official.name,
      position: official.position,
      contact: official.contact,
      status: official.status,
      category: official.category,
      imageUrl: official.imageUrl || "",
    })
    setImagePreview(official.imageUrl || "")
    setImageFile(null)
    setEditingId(official.id)
    setShowForm(true)
  }

  // --- Image Handling functions (remain the same) ---
  const handleFileChange = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        setImagePreview(base64String)
        setFormData({ ...formData, imageUrl: base64String })
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

  const handleRemoveImage = () => {
    setImageFile(null)
    setImagePreview("")
    setFormData({ ...formData, imageUrl: "" })
  }
  // --- End Image Handling ---

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const isEditing = editingId !== null
      const response = await fetch("/api/officials", {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(isEditing ? { ...formData, id: editingId } : formData),
      })

      if (!response.ok) {
        // Log the error and throw to trigger the catch block
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }))
        console.error("API Response Error:", errorData);
        throw new Error(errorData.error || `Request failed with status ${response.status}`)
      }

      toast({
        title: isEditing ? "Official Updated" : "Official Added",
        description: isEditing ? "Changes saved successfully" : "New official added successfully",
      })
      
      addActivityLog(
        isEditing ? "UPDATE_OFFICIAL" : "CREATE_OFFICIAL",
        `${isEditing ? "Updated" : "Added"} official: ${formData.name}`,
      )
      
      resetForm()
      fetchOfficials() // Re-fetch data to reflect the change
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${editingId ? "update" : "add"} official.`,
        variant: "destructive",
      })
    }
  }

  // --- New Delete Handler Functions ---
  const handleDeleteClick = (official: Official) => {
    setDeletingOfficial(official) // Open the confirmation dialog
  }

  const handleConfirmDelete = async () => {
    if (!deletingOfficial) return

    setIsDeleting(true)
    try {
      // DELETE route uses 'id' as a query parameter
      const response = await fetch(`/api/officials?id=${deletingOfficial.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Request failed with status ${response.status}`)
      }

      toast({
        title: "Official Deleted",
        description: `${deletingOfficial.name} has been successfully removed.`,
      })
      
      addActivityLog("DELETE_OFFICIAL", `Deleted official: ${deletingOfficial.name}`)
      
      // Optimistically update the local state without a full re-fetch
      setOfficials(officials.filter((o) => o.id !== deletingOfficial.id))
      
      // If the deleted official was currently being edited, close the form
      if (editingId === deletingOfficial.id) {
        resetForm()
      }

    } catch (error) {
      console.error("Failed to delete official:", error)
      toast({
        title: "Error",
        description: "Failed to delete official. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setDeletingOfficial(null) // Close the dialog
    }
  }
  // --- End Delete Handler Functions ---

  const resetForm = () => {
    setFormData({
      name: "",
      position: "",
      contact: "",
      status: "On Duty",  // Reset to default value
      category: "Barangay Officials",  // Reset to default value
      imageUrl: "",
    })
    setImageFile(null)
    setImagePreview("")
    setEditingId(null)
    setShowForm(false)
  }

  const groupedOfficials = officialCategories.reduce<Record<OfficialCategory, Official[]>>(
    (acc, category) => {
      acc[category] = officials.filter((official) => official.category === category)
      return acc
    },
    {
      "Barangay Officials": [],
      "SK": [],
      "Staff": [],
    }
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Manage Officials</h2>
        </div>
        <Button onClick={() => (showForm ? resetForm() : handleAddNew())}>
          {showForm ? (
            <>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </>
          ) : (
            <>
              <Plus className="h-4 w-4 mr-2" />
              Add New Official
            </>
          )}
        </Button>
      </div>

      {showForm && (
        <OfficialForm
          formData={formData}
          imagePreview={imagePreview}
          isDragging={isDragging}
          officialCategories={officialCategories}
          statuses={statuses}
          onChange={(patch) => setFormData((s) => ({ ...s, ...patch }))}
          onFileChange={handleFileChange}
          onRemoveImage={handleRemoveImage}
          onSubmit={handleSubmit}
          onCancel={resetForm}
        />
      )}

      {/* Confirmation Dialog for Deletion */}
      <OfficialDeleteDialog openOfficial={deletingOfficial} isDeleting={isDeleting} onClose={() => setDeletingOfficial(null)} onConfirm={handleConfirmDelete} />

      {/* Display Officials */}
      {officialCategories.map((category) => (
        <div key={category} className="space-y-4">
          <h3 className="text-xl font-semibold border-b pb-2">{category}</h3>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {groupedOfficials[category].map((official) => (
              <OfficialCard key={official.id} official={official} onEdit={handleEdit} onDelete={handleDeleteClick} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
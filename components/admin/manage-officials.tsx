// "use client"

// import type React from "react"

// import { useState, useEffect } from "react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Badge } from "@/components/ui/badge"
// import { Edit, Loader2, User, Plus, Upload, X } from "lucide-react"
// import { useToast } from "@/hooks/use-toast"
// import type { Official, OfficialStatus, OfficialCategory } from "@/lib/types"
// import { addActivityLog } from "@/lib/activity-log"
// import Image from "next/image"

// const statuses: OfficialStatus[] = ["On Duty", "On Leave", "On Site"]
// const officialCategories: OfficialCategory[] = ["Barangay Officials", "SK", "Staff"]

// const statusColors: Record<OfficialStatus, string> = {
//   "On Duty": "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
//   "On Leave": "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
//   "On Site": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
// }

// export function ManageOfficials() {
//   const [officials, setOfficials] = useState<Official[]>([])
//   const [loading, setLoading] = useState(true)
//   const [showForm, setShowForm] = useState(false)
//   const [editingId, setEditingId] = useState<string | null>(null)
//   const { toast } = useToast()

//   const [formData, setFormData] = useState({
//     name: "",
//     position: "",
//     contact: "",
//     status: "" as OfficialStatus,
//     category: "" as OfficialCategory,
//     imageUrl: "",
//   })
//   const [imageFile, setImageFile] = useState<File | null>(null)
//   const [imagePreview, setImagePreview] = useState<string>("")
//   const [isDragging, setIsDragging] = useState(false)

//   useEffect(() => {
//     fetchOfficials()
//   }, [])

//   const fetchOfficials = async () => {
//     try {
//       const response = await fetch("/api/officials")
//       const data = await response.json()
//       setOfficials(data)
//     } catch (error) {
//       console.error("[v0] Failed to fetch officials:", error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleAddNew = () => {
//     resetForm()
//     setShowForm(true)
//   }

//   const handleEdit = (official: Official) => {
//     setFormData({
//       name: official.name,
//       position: official.position,
//       contact: official.contact,
//       status: official.status,
//       category: official.category,
//       imageUrl: official.imageUrl || "",
//     })
//     setImagePreview(official.imageUrl || "")
//     setImageFile(null)
//     setEditingId(official.id)
//     setShowForm(true)
//   }

//   const handleFileChange = (file: File) => {
//     if (file && file.type.startsWith("image/")) {
//       setImageFile(file)
//       const reader = new FileReader()
//       reader.onloadend = () => {
//         const base64String = reader.result as string
//         setImagePreview(base64String)
//         setFormData({ ...formData, imageUrl: base64String })
//       }
//       reader.readAsDataURL(file)
//     } else {
//       toast({
//         title: "Invalid File",
//         description: "Please select an image file",
//         variant: "destructive",
//       })
//     }
//   }

//   const handleDragOver = (e: React.DragEvent) => {
//     e.preventDefault()
//     setIsDragging(true)
//   }

//   const handleDragLeave = (e: React.DragEvent) => {
//     e.preventDefault()
//     setIsDragging(false)
//   }

//   const handleDrop = (e: React.DragEvent) => {
//     e.preventDefault()
//     setIsDragging(false)
//     const file = e.dataTransfer.files[0]
//     if (file) handleFileChange(file)
//   }

//   const handleRemoveImage = () => {
//     setImageFile(null)
//     setImagePreview("")
//     setFormData({ ...formData, imageUrl: "" })
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()

//     try {
//       const isEditing = editingId !== null
//       const response = await fetch("/api/officials", {
//         method: isEditing ? "PUT" : "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(isEditing ? { ...formData, id: editingId } : formData),
//       })

//       if (response.ok) {
//         toast({
//           title: isEditing ? "Official Updated" : "Official Added",
//           description: isEditing ? "Changes saved successfully" : "New official added successfully",
//         })
//         addActivityLog(
//           isEditing ? "UPDATE_OFFICIAL" : "CREATE_OFFICIAL",
//           `${isEditing ? "Updated" : "Added"} official: ${formData.name}`,
//         )
//         resetForm()
//         fetchOfficials()
//       }
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: `Failed to ${editingId ? "update" : "add"} official`,
//         variant: "destructive",
//       })
//     }
//   }

//   const resetForm = () => {
//     setFormData({
//       name: "",
//       position: "",
//       contact: "",
//       status: "" as OfficialStatus,
//       category: "" as OfficialCategory,
//       imageUrl: "",
//     })
//     setImageFile(null)
//     setImagePreview("")
//     setEditingId(null)
//     setShowForm(false)
//   }

//   const groupedOfficials = officialCategories.reduce(
//     (acc, category) => {
//       acc[category] = officials.filter((official) => official.category === category)
//       return acc
//     },
//     {} as Record<OfficialCategory, Official[]>,
//   )

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center py-12">
//         <Loader2 className="h-8 w-8 animate-spin text-primary" />
//       </div>
//     )
//   }

//   return (
//     <div className="space-y-8">
//       <div className="flex items-center justify-between">
//         <div>
//           <h2 className="text-2xl font-bold">Manage Officials</h2>
//           <p className="text-muted-foreground">Add new officials or update existing information</p>
//         </div>
//         <Button onClick={() => (showForm ? resetForm() : handleAddNew())}>
//           {showForm ? (
//             <>
//               <X className="h-4 w-4 mr-2" />
//               Cancel
//             </>
//           ) : (
//             <>
//               <Plus className="h-4 w-4 mr-2" />
//               Add New Official
//             </>
//           )}
//         </Button>
//       </div>

//       {showForm && (
//         <Card>
//           <CardHeader>
//             <CardTitle>{editingId ? "Edit Official" : "Add New Official"}</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="name">Name</Label>
//                   <Input
//                     id="name"
//                     value={formData.name}
//                     onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                     required
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="position">Position</Label>
//                   <Input
//                     id="position"
//                     value={formData.position}
//                     onChange={(e) => setFormData({ ...formData, position: e.target.value })}
//                     required
//                   />
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="contact">Contact</Label>
//                   <Input
//                     id="contact"
//                     type="tel"
//                     value={formData.contact}
//                     onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
//                     required
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="category">Category</Label>
//                   <Select
//                     value={formData.category}
//                     onValueChange={(value) => setFormData({ ...formData, category: value as OfficialCategory })}
//                     required
//                   >
//                     <SelectTrigger id="category">
//                       <SelectValue placeholder="Select category" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {officialCategories.map((category) => (
//                         <SelectItem key={category} value={category}>
//                           {category}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="status">Status</Label>
//                   <Select
//                     value={formData.status}
//                     onValueChange={(value) => setFormData({ ...formData, status: value as OfficialStatus })}
//                     required
//                   >
//                     <SelectTrigger id="status">
//                       <SelectValue placeholder="Select status" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {statuses.map((status) => (
//                         <SelectItem key={status} value={status}>
//                           {status}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <Label>Official Photo (Optional)</Label>
//                 {imagePreview ? (
//                   <div className="relative w-full h-48 border rounded-lg overflow-hidden">
//                     <Image src={imagePreview || "/placeholder.svg"} alt="Preview" fill className="object-cover" />
//                     <Button
//                       type="button"
//                       variant="destructive"
//                       size="icon"
//                       className="absolute top-2 right-2"
//                       onClick={handleRemoveImage}
//                     >
//                       <X className="h-4 w-4" />
//                     </Button>
//                   </div>
//                 ) : (
//                   <div
//                     className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
//                       isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25"
//                     }`}
//                     onDragOver={handleDragOver}
//                     onDragLeave={handleDragLeave}
//                     onDrop={handleDrop}
//                   >
//                     <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
//                     <p className="text-sm text-muted-foreground mb-2">
//                       Drag and drop an image here, or click to browse
//                     </p>
//                     <Input
//                       type="file"
//                       accept="image/*"
//                       onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
//                       className="hidden"
//                       id="image-upload"
//                     />
//                     <Button
//                       type="button"
//                       variant="outline"
//                       onClick={() => document.getElementById("image-upload")?.click()}
//                     >
//                       Choose File
//                     </Button>
//                   </div>
//                 )}
//               </div>

//               <div className="flex gap-2">
//                 <Button type="submit">{editingId ? "Update Official" : "Add Official"}</Button>
//                 <Button type="button" variant="outline" onClick={resetForm}>
//                   Cancel
//                 </Button>
//               </div>
//             </form>
//           </CardContent>
//         </Card>
//       )}

//       {officialCategories.map((category) => (
//         <div key={category} className="space-y-4">
//           <h3 className="text-xl font-semibold border-b pb-2">{category}</h3>
//           <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//             {groupedOfficials[category].map((official) => (
//               <Card key={official.id} className="hover:shadow-lg transition-shadow">
//                 <CardHeader>
//                   <div className="flex items-start gap-4">
//                     {official.imageUrl ? (
//                       <div className="relative h-16 w-16 rounded-full overflow-hidden flex-shrink-0">
//                         <Image
//                           src={official.imageUrl || "/placeholder.svg"}
//                           alt={official.name}
//                           fill
//                           className="object-cover"
//                         />
//                       </div>
//                     ) : (
//                       <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary flex-shrink-0">
//                         <User className="h-8 w-8" />
//                       </div>
//                     )}
//                     <div className="flex-1 min-w-0">
//                       <CardTitle className="text-lg mb-1 line-clamp-1">{official.name}</CardTitle>
//                       <p className="text-sm text-muted-foreground mb-2 line-clamp-1">{official.position}</p>
//                       <p className="text-sm font-medium mb-2">{official.contact}</p>
//                       <Badge className={statusColors[official.status]}>{official.status}</Badge>
//                     </div>
//                   </div>
//                 </CardHeader>
//                 <CardContent className="pt-0">
//                   <Button size="sm" variant="outline" onClick={() => handleEdit(official)} className="w-full">
//                     <Edit className="h-4 w-4 mr-2" />
//                     Edit
//                   </Button>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </div>
//       ))}
//     </div>
//   )
// }

// admin official page (e.g., components/manage-officials.tsx)
"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Edit, Loader2, User, Plus, Upload, X, Trash2 } from "lucide-react" // Added Trash2
import { useToast } from "@/hooks/use-toast"
import type { Official, OfficialStatus, OfficialCategory } from "@/lib/types"
import { addActivityLog } from "@/lib/activity-log"
import Image from "next/image"

// Imports for the Confirmation Dialog
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


const statuses: OfficialStatus[] = ["On Duty", "On Leave", "On Site"]
const officialCategories: OfficialCategory[] = ["Barangay Officials", "SK", "Staff"]

const statusColors: Record<OfficialStatus, string> = {
  "On Duty": "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  "On Leave": "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  "On Site": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
}

export function ManageOfficials() {
  const [officials, setOfficials] = useState<Official[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  
  // New State for Deletion
  const [deletingOfficial, setDeletingOfficial] = useState<Official | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: "",
    position: "",
    contact: "",
    status: "" as OfficialStatus,
    category: "" as OfficialCategory,
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
      status: "" as OfficialStatus,
      category: "" as OfficialCategory,
      imageUrl: "",
    })
    setImageFile(null)
    setImagePreview("")
    setEditingId(null)
    setShowForm(false)
  }

  const groupedOfficials = officialCategories.reduce(
    (acc, category) => {
      acc[category] = officials.filter((official) => official.category === category)
      return acc
    },
    {} as Record<OfficialCategory, Official[]>,
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
          <p className="text-muted-foreground">Add new officials or update existing information</p>
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
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? "Edit Official" : "Add New Official"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="position">Position</Label>
                  <Input
                    id="position"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contact">Contact</Label>
                  <Input
                    id="contact"
                    type="tel"
                    value={formData.contact}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value as OfficialCategory })}
                    required
                  >
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
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value as OfficialStatus })}
                    required
                  >
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
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={handleRemoveImage}
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
                      Drag and drop an image here, or click to browse
                    </p>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
                      className="hidden"
                      id="image-upload"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById("image-upload")?.click()}
                    >
                      Choose File
                    </Button>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button type="submit">{editingId ? "Update Official" : "Add Official"}</Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Confirmation Dialog for Deletion */}
      <AlertDialog open={!!deletingOfficial} onOpenChange={() => setDeletingOfficial(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the official{" "}
              <span className="font-semibold text-primary">{deletingOfficial?.name}</span> and remove their data from the records.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} disabled={isDeleting} className="bg-destructive hover:bg-destructive/90">
              {isDeleting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4 mr-2" />
              )}
              {isDeleting ? "Deleting..." : "Delete Official"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Display Officials */}
      {officialCategories.map((category) => (
        <div key={category} className="space-y-4">
          <h3 className="text-xl font-semibold border-b pb-2">{category}</h3>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {groupedOfficials[category].map((official) => (
              <Card key={official.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    {official.imageUrl ? (
                      <div className="relative h-16 w-16 rounded-full overflow-hidden flex-shrink-0">
                        <Image
                          src={official.imageUrl || "/placeholder.svg"}
                          alt={official.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary flex-shrink-0">
                        <User className="h-8 w-8" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg mb-1 line-clamp-1">{official.name}</CardTitle>
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-1">{official.position}</p>
                      <p className="text-sm font-medium mb-2">{official.contact}</p>
                      <Badge className={statusColors[official.status]}>{official.status}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(official)} className="flex-1">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    {/* Delete Button - Triggers Confirmation Dialog */}
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteClick(official)}
                      className="w-10 p-0"
                      title={`Delete ${official.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
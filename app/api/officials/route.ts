// import { NextResponse } from "next/server"
// import { persistentStore } from "@/lib/persistent-store"
// import { broadcastEvent } from "@/lib/event-broadcaster"

// export async function GET() {
//   const officials = await persistentStore.getOfficials()
//   return NextResponse.json(officials)
// }

// export async function POST(request: Request) {
//   try {
//     const body = await request.json()
//     const officials = await persistentStore.getOfficials()
//     const newOfficial = {
//       id: Date.now().toString(),
//       ...body,
//     }
//     officials.push(newOfficial)
//     await persistentStore.setOfficials(officials)
//     await broadcastEvent("officials", {
//       action: "created",
//       data: newOfficial,
//     })
//     return NextResponse.json(newOfficial, { status: 201 })
//   } catch (error) {
//     return NextResponse.json({ error: "Failed to create official" }, { status: 500 })
//   }
// }

// export async function PUT(request: Request) {
//   try {
//     const body = await request.json()
//     const officials = await persistentStore.getOfficials()
//     const index = officials.findIndex((o) => o.id === body.id)
//     if (index === -1) {
//       return NextResponse.json({ error: "Official not found" }, { status: 404 })
//     }
//     officials[index] = { ...officials[index], ...body }
//     await persistentStore.setOfficials(officials)
//     await broadcastEvent("officials", {
//       action: "updated",
//       data: officials[index],
//     })
//     return NextResponse.json(officials[index])
//   } catch (error) {
//     return NextResponse.json({ error: "Failed to update official" }, { status: 500 })
//   }
// }

// export async function DELETE(request: Request) {
//   try {
//     const { searchParams } = new URL(request.url)
//     const id = searchParams.get("id")
//     if (!id) {
//       return NextResponse.json({ error: "ID required" }, { status: 400 })
//     }
//     const officials = await persistentStore.getOfficials()
//     const index = officials.findIndex((o) => o.id === id)
//     if (index === -1) {
//       return NextResponse.json({ error: "Official not found" }, { status: 404 })
//     }
//     officials.splice(index, 1)
//     await persistentStore.setOfficials(officials)
//     await broadcastEvent("officials", {
//       action: "deleted",
//       id,
//     })
//     return NextResponse.json({ success: true })
//   } catch (error) {
//     return NextResponse.json({ error: "Failed to delete official" }, { status: 500 })
//   }
// }


// official route (e.g., app/api/officials/route.ts)
import { NextResponse } from "next/server"
import { persistentStore } from "@/lib/persistent-store"
import { broadcastEvent } from "@/lib/event-broadcaster"

// GET: Retrieve all officials
export async function GET() {
  try {
    const officials = await persistentStore.getOfficials()
    return NextResponse.json(officials)
  } catch (error) {
    console.error("GET Officials Error:", error)
    return NextResponse.json({ error: "Failed to fetch officials" }, { status: 500 })
  }
}

// POST: Create a new official
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const officials = await persistentStore.getOfficials()
    const newOfficial = {
      id: Date.now().toString(),
      ...body,
    }
    officials.push(newOfficial)
    await persistentStore.setOfficials(officials)
    await broadcastEvent("officials", {
      action: "created",
      data: newOfficial,
    })
    return NextResponse.json(newOfficial, { status: 201 })
  } catch (error) {
    console.error("POST Official Error:", error)
    return NextResponse.json({ error: "Failed to create official" }, { status: 500 })
  }
}

// PUT: Update an existing official
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const officials = await persistentStore.getOfficials()
    const index = officials.findIndex((o) => o.id === body.id)
    
    if (index === -1) {
      return NextResponse.json({ error: "Official not found" }, { status: 404 })
    }
    
    // Merge existing data with new data
    officials[index] = { ...officials[index], ...body }
    
    await persistentStore.setOfficials(officials)
    await broadcastEvent("officials", {
      action: "updated",
      data: officials[index],
    })
    
    return NextResponse.json(officials[index])
  } catch (error) {
    console.error("PUT Official Error:", error)
    return NextResponse.json({ error: "Failed to update official" }, { status: 500 })
  }
}

// DELETE: Delete an official
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    
    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 })
    }
    
    const officials = await persistentStore.getOfficials()
    const index = officials.findIndex((o) => o.id === id)
    
    if (index === -1) {
      return NextResponse.json({ error: "Official not found" }, { status: 404 })
    }
    
    // Remove the official from the array
    const [deletedOfficial] = officials.splice(index, 1)
    
    await persistentStore.setOfficials(officials)
    await broadcastEvent("officials", {
      action: "deleted",
      id,
    })
    
    return NextResponse.json({ success: true, deletedId: id })
  } catch (error) {
    console.error("DELETE Official Error:", error)
    return NextResponse.json({ error: "Failed to delete official" }, { status: 500 })
  }
}
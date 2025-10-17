import { NextResponse } from "next/server"
import { persistentStore } from "@/lib/persistent-store"
import { broadcastEvent } from "@/lib/event-broadcaster"

// GET: Fetch all hotlines
export async function GET() {
  const hotlines = await persistentStore.getHotlines()
  return NextResponse.json(hotlines)
}

// POST: Create a new hotline
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const hotlines = await persistentStore.getHotlines()
    const newHotline = {
      id: Date.now().toString(),
      ...body,
    }
    hotlines.push(newHotline)
    await persistentStore.setHotlines(hotlines)
    await broadcastEvent("hotlines", {
      action: "created",
      data: newHotline,
    })
    return NextResponse.json(newHotline, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create hotline" }, { status: 500 })
  }
}

// PUT: Update an existing hotline
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const hotlines = await persistentStore.getHotlines()
    const index = hotlines.findIndex((h: any) => h.id === body.id)
    if (index === -1) {
      return NextResponse.json({ error: "Hotline not found" }, { status: 404 })
    }
    // Note: Assuming 'body' contains the fields to update, including 'category'
    hotlines[index] = { ...hotlines[index], ...body }
    await persistentStore.setHotlines(hotlines)
    await broadcastEvent("hotlines", {
      action: "updated",
      data: hotlines[index],
    })
    return NextResponse.json(hotlines[index])
  } catch (error) {
    return NextResponse.json({ error: "Failed to update hotline" }, { status: 500 })
  }
}

// DELETE: Delete a hotline by ID
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 })
    }
    const hotlines = await persistentStore.getHotlines()
    const index = hotlines.findIndex((h: any) => h.id === id)
    if (index === -1) {
      return NextResponse.json({ error: "Hotline not found" }, { status: 404 })
    }
    hotlines.splice(index, 1)
    await persistentStore.setHotlines(hotlines)
    await broadcastEvent("hotlines", {
      action: "deleted",
      id,
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete hotline" }, { status: 500 })
  }
}
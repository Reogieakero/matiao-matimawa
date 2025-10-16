import { NextResponse } from "next/server"
import { persistentStore } from "@/lib/persistent-store"
import { broadcastEvent } from "@/lib/event-broadcaster"

export async function GET() {
  const announcements = await persistentStore.getAnnouncements()
  return NextResponse.json(announcements)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const announcements = await persistentStore.getAnnouncements()
    const newAnnouncement = {
      id: Date.now().toString(),
      ...body,
      createdAt: new Date().toISOString(),
    }
    announcements.unshift(newAnnouncement)
    await persistentStore.setAnnouncements(announcements)
    await broadcastEvent("announcements", {
      action: "created",
      data: newAnnouncement,
    })
    return NextResponse.json(newAnnouncement, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create announcement" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const announcements = await persistentStore.getAnnouncements()
    const index = announcements.findIndex((a) => a.id === body.id)
    if (index === -1) {
      return NextResponse.json({ error: "Announcement not found" }, { status: 404 })
    }
    announcements[index] = { ...announcements[index], ...body }
    await persistentStore.setAnnouncements(announcements)
    await broadcastEvent("announcements", {
      action: "updated",
      data: announcements[index],
    })
    return NextResponse.json(announcements[index])
  } catch (error) {
    return NextResponse.json({ error: "Failed to update announcement" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 })
    }
    const announcements = await persistentStore.getAnnouncements()
    const index = announcements.findIndex((a) => a.id === id)
    if (index === -1) {
      return NextResponse.json({ error: "Announcement not found" }, { status: 404 })
    }
    announcements.splice(index, 1)
    await persistentStore.setAnnouncements(announcements)
    await broadcastEvent("announcements", {
      action: "deleted",
      id,
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete announcement" }, { status: 500 })
  }
}

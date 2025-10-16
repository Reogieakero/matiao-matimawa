import { NextResponse } from "next/server"
import { persistentStore } from "@/lib/persistent-store"
import { broadcastEvent } from "@/lib/event-broadcaster"

export async function GET() {
  const applications = await persistentStore.getApplications()
  return NextResponse.json(applications)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const applications = await persistentStore.getApplications()
    const newApplication = {
      id: Date.now().toString(),
      ...body,
      status: "Pending" as const,
      submittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    applications.push(newApplication)
    await persistentStore.setApplications(applications)
    await broadcastEvent("applications", {
      action: "created",
      data: newApplication,
    })
    return NextResponse.json(newApplication, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create application" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const applications = await persistentStore.getApplications()
    const index = applications.findIndex((a) => a.id === body.id)
    if (index === -1) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 })
    }
    applications[index] = {
      ...applications[index],
      ...body,
      updatedAt: new Date().toISOString(),
    }
    await persistentStore.setApplications(applications)
    await broadcastEvent("applications", {
      action: "updated",
      data: applications[index],
    })
    return NextResponse.json(applications[index])
  } catch (error) {
    return NextResponse.json({ error: "Failed to update application" }, { status: 500 })
  }
}

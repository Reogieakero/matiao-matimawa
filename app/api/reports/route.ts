import { NextResponse } from "next/server"
import { persistentStore } from "@/lib/persistent-store"
import { broadcastEvent } from "@/lib/event-broadcaster"

export async function GET() {
  const reports = await persistentStore.getReports()
  return NextResponse.json(reports)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const reports = await persistentStore.getReports()
    const newReport = {
      id: Date.now().toString(),
      ...body,
      status: "Pending" as const,
      submittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    reports.push(newReport)
    await persistentStore.setReports(reports)
    await broadcastEvent("reports", {
      action: "created",
      data: newReport,
    })
    return NextResponse.json(newReport, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create report" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const reports = await persistentStore.getReports()
    const index = reports.findIndex((r) => r.id === body.id)
    if (index === -1) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 })
    }
    reports[index] = {
      ...reports[index],
      ...body,
      updatedAt: new Date().toISOString(),
    }
    await persistentStore.setReports(reports)
    await broadcastEvent("reports", {
      action: "updated",
      data: reports[index],
    })
    return NextResponse.json(reports[index])
  } catch (error) {
    return NextResponse.json({ error: "Failed to update report" }, { status: 500 })
  }
}

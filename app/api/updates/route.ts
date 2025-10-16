import { NextResponse } from "next/server"
import { getRedisClient, isRedisAvailable } from "@/lib/redis-client"

export const dynamic = "force-dynamic"

// Store last update timestamps in memory
const lastUpdates: Record<string, number> = {
  announcements: Date.now(),
  hotlines: Date.now(),
  officials: Date.now(),
  applications: Date.now(),
  reports: Date.now(),
}

export async function GET() {
  try {
    // If Redis is available, get timestamps from there
    if (isRedisAvailable()) {
      const redis = getRedisClient()
      if (redis) {
        const types = ["announcements", "hotlines", "officials", "applications", "reports"]
        for (const type of types) {
          try {
            const timestamp = await redis.get(`barangay:${type}:last_update`)
            if (timestamp) {
              lastUpdates[type] = Number(timestamp)
            }
          } catch (error) {
            console.error(`[v0] Error getting timestamp for ${type}:`, error)
          }
        }
      }
    }

    return NextResponse.json(lastUpdates)
  } catch (error) {
    console.error("[v0] Error in updates endpoint:", error)
    return NextResponse.json(lastUpdates)
  }
}

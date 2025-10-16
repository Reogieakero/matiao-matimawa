import { getRedisClient, isRedisAvailable } from "./redis-client"

export type EventType = "announcements" | "hotlines" | "officials" | "applications" | "reports"

export async function broadcastEvent(eventType: EventType, data?: any) {
  console.log("[v0] Broadcasting event:", eventType)

  const timestamp = Date.now()

  // If Redis is available, store the timestamp
  if (isRedisAvailable()) {
    try {
      const redis = getRedisClient()
      if (redis) {
        await redis.set(`barangay:${eventType}:last_update`, timestamp.toString())
        console.log("[v0] Updated timestamp in Redis for:", eventType)
      }
    } catch (error) {
      console.error("[v0] Redis update error:", error)
    }
  }
}

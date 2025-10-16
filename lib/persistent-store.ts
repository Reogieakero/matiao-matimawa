import { getRedisClient, isRedisAvailable } from "./redis-client"
import { dataStore } from "./data-store"
import type { Announcement, Hotline, Official, DocumentApplication, Report } from "./types"

// Helper function to safely parse Redis data
function safeJsonParse<T>(data: unknown, fallback: T): T {
  if (!data) return fallback

  if (typeof data === "object") {
    return data as T
  }

  // If it's a string, try to parse it
  if (typeof data === "string") {
    try {
      return JSON.parse(data) as T
    } catch (error) {
      console.error("[v0] JSON parse error:", error)
      return fallback
    }
  }

  return fallback
}

// Persistent store using Redis with in-memory fallback
export const persistentStore = {
  // Announcements
  async getAnnouncements(): Promise<Announcement[]> {
    if (isRedisAvailable()) {
      try {
        const redis = getRedisClient()
        const data = await redis?.get("announcements")
        return safeJsonParse(data, dataStore.announcements)
      } catch (error) {
        console.error("[v0] Redis error fetching announcements:", error)
        return dataStore.announcements
      }
    }
    return dataStore.announcements
  },

  async setAnnouncements(announcements: Announcement[]): Promise<void> {
    dataStore.announcements = announcements
    if (isRedisAvailable()) {
      try {
        const redis = getRedisClient()
        await redis?.set("announcements", JSON.stringify(announcements))
      } catch (error) {
        console.error("[v0] Redis error saving announcements:", error)
      }
    }
  },

  // Hotlines
  async getHotlines(): Promise<Hotline[]> {
    if (isRedisAvailable()) {
      try {
        const redis = getRedisClient()
        const data = await redis?.get("hotlines")
        return safeJsonParse(data, dataStore.hotlines)
      } catch (error) {
        console.error("[v0] Redis error fetching hotlines:", error)
        return dataStore.hotlines
      }
    }
    return dataStore.hotlines
  },

  async setHotlines(hotlines: Hotline[]): Promise<void> {
    dataStore.hotlines = hotlines
    if (isRedisAvailable()) {
      try {
        const redis = getRedisClient()
        await redis?.set("hotlines", JSON.stringify(hotlines))
      } catch (error) {
        console.error("[v0] Redis error saving hotlines:", error)
      }
    }
  },

  // Officials
  async getOfficials(): Promise<Official[]> {
    if (isRedisAvailable()) {
      try {
        const redis = getRedisClient()
        const data = await redis?.get("officials")
        return safeJsonParse(data, dataStore.officials)
      } catch (error) {
        console.error("[v0] Redis error fetching officials:", error)
        return dataStore.officials
      }
    }
    return dataStore.officials
  },

  async setOfficials(officials: Official[]): Promise<void> {
    dataStore.officials = officials
    if (isRedisAvailable()) {
      try {
        const redis = getRedisClient()
        await redis?.set("officials", JSON.stringify(officials))
      } catch (error) {
        console.error("[v0] Redis error saving officials:", error)
      }
    }
  },

  // Document Applications
  async getApplications(): Promise<DocumentApplication[]> {
    if (isRedisAvailable()) {
      try {
        const redis = getRedisClient()
        const data = await redis?.get("applications")
        return safeJsonParse(data, dataStore.documentApplications)
      } catch (error) {
        console.error("[v0] Redis error fetching applications:", error)
        return dataStore.documentApplications
      }
    }
    return dataStore.documentApplications
  },

  async setApplications(applications: DocumentApplication[]): Promise<void> {
    dataStore.documentApplications = applications
    if (isRedisAvailable()) {
      try {
        const redis = getRedisClient()
        await redis?.set("applications", JSON.stringify(applications))
      } catch (error) {
        console.error("[v0] Redis error saving applications:", error)
      }
    }
  },

  // Reports
  async getReports(): Promise<Report[]> {
    if (isRedisAvailable()) {
      try {
        const redis = getRedisClient()
        const data = await redis?.get("reports")
        return safeJsonParse(data, dataStore.reports)
      } catch (error) {
        console.error("[v0] Redis error fetching reports:", error)
        return dataStore.reports
      }
    }
    return dataStore.reports
  },

  async setReports(reports: Report[]): Promise<void> {
    dataStore.reports = reports
    if (isRedisAvailable()) {
      try {
        const redis = getRedisClient()
        await redis?.set("reports", JSON.stringify(reports))
      } catch (error) {
        console.error("[v0] Redis error saving reports:", error)
      }
    }
  },
}

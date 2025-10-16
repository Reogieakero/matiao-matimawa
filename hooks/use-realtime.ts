"use client"

import { useEffect, useRef } from "react"

interface RealtimeOptions {
  onUpdate?: () => void
  eventTypes?: string[]
  pollInterval?: number
}

export function useRealtime({ onUpdate, eventTypes, pollInterval = 3000 }: RealtimeOptions = {}) {
  const lastTimestampsRef = useRef<Record<string, number>>({})
  const intervalRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    const checkForUpdates = async () => {
      try {
        const response = await fetch("/api/updates")
        if (!response.ok) return

        const timestamps: Record<string, number> = await response.json()

        // Check if any relevant event types have been updated
        let hasUpdates = false
        const typesToCheck = eventTypes || Object.keys(timestamps)

        for (const type of typesToCheck) {
          const newTimestamp = timestamps[type]
          const oldTimestamp = lastTimestampsRef.current[type]

          if (oldTimestamp && newTimestamp > oldTimestamp) {
            hasUpdates = true
          }

          lastTimestampsRef.current[type] = newTimestamp
        }

        if (hasUpdates) {
          console.log("[v0] Updates detected, refreshing data...")
          onUpdate?.()
        }
      } catch (error) {
        console.error("[v0] Error checking for updates:", error)
      }
    }

    // Initial check
    checkForUpdates()

    // Poll for updates
    intervalRef.current = setInterval(checkForUpdates, pollInterval)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [onUpdate, eventTypes, pollInterval])

  return {}
}

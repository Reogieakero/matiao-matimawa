// hooks/use-realtime.ts
"use client"

import { useEffect, useRef } from "react"

interface RealtimeOptions {
  // onUpdate expects no arguments, matching its use: onUpdate?.()
  onUpdate?: () => void
  eventTypes?: string[]
  pollInterval?: number
}

export function useRealtime({ onUpdate, eventTypes, pollInterval = 3000 }: RealtimeOptions = {}) {
  const lastTimestampsRef = useRef<Record<string, number>>({})
  
  // FIX: Initialize useRef with null or undefined to satisfy NodeJS.Timeout type
  const intervalRef = useRef<NodeJS.Timeout | undefined>(undefined)

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
          console.log("Updates detected, refreshing data...")
          onUpdate?.()
        }
      } catch (error) {
        console.error("Error checking for updates:", error)
      }
    }

    // Initial check
    checkForUpdates()

    intervalRef.current = setInterval(checkForUpdates, pollInterval) as unknown as NodeJS.Timeout 

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [onUpdate, eventTypes, pollInterval])

  return {}
}
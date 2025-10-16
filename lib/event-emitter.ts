// Simple event emitter for broadcasting updates
type EventCallback = (data: any) => void

class EventEmitter {
  private listeners: Map<string, Set<EventCallback>> = new Map()

  on(event: string, callback: EventCallback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set())
    }
    this.listeners.get(event)!.add(callback)
  }

  off(event: string, callback: EventCallback) {
    const callbacks = this.listeners.get(event)
    if (callbacks) {
      callbacks.delete(callback)
    }
  }

  emit(event: string, data?: any) {
    const callbacks = this.listeners.get(event)
    if (callbacks) {
      callbacks.forEach((callback) => callback(data))
    }
  }

  removeAllListeners(event?: string) {
    if (event) {
      this.listeners.delete(event)
    } else {
      this.listeners.clear()
    }
  }
}

export const eventEmitter = new EventEmitter()

// Event types
export const EVENTS = {
  ANNOUNCEMENT_UPDATED: "announcement:updated",
  HOTLINE_UPDATED: "hotline:updated",
  OFFICIAL_UPDATED: "official:updated",
  APPLICATION_UPDATED: "application:updated",
  REPORT_UPDATED: "report:updated",
}

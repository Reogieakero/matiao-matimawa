import { Redis } from "@upstash/redis"

let redis: Redis | null = null

export function getRedisClient() {
  if (!redis && process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    redis = new Redis({
      url: process.env.KV_REST_API_URL,
      token: process.env.KV_REST_API_TOKEN,
    })
  }
  return redis
}

export function isRedisAvailable() {
  return !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN)
}

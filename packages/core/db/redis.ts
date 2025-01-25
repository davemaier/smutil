import Redis from "ioredis";

if (!process.env.REDIS_URL) {
  throw new Error("Redis URL environment variable not set");
}

export const redisClient = new Redis(process.env.REDIS_URL);

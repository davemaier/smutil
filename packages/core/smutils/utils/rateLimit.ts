import { Redis } from "ioredis";

const FREE_MAX_REQUESTS = parseInt(process.env.FREE_MAX_REQUESTS || "10");
const FREE_WINDOW_SIZE_IN_SECONDS = parseInt(
  process.env.WINDOW_SIZE_IN_SECONDS || "60",
);

export async function isRateLimitAllowed(
  ipAddress: string,
  redisClient: Redis,
): Promise<boolean> {
  if (process.env.NODE_ENV !== "production") {
    return true;
  }
  const key = `rate_limit:${ipAddress}`;
  const now = Date.now();
  const windowStart = now - FREE_WINDOW_SIZE_IN_SECONDS * 1000;

  // Remove timestamps that are older than the rolling window
  await redisClient.zremrangebyscore(key, 0, windowStart);

  // Get the count of requests within the current rolling window
  const currentCount = await redisClient.zcard(key);

  if (currentCount < FREE_MAX_REQUESTS) {
    // Add the current timestamp to the sorted set
    await redisClient.zadd(key, now, now.toString());

    // Set the expiration of the key to ensure cleanup of old data
    await redisClient.expire(key, FREE_WINDOW_SIZE_IN_SECONDS);

    return true;
  }

  return false;
}

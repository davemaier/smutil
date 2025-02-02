import type { RateLimitData, RateLimitStore } from ".";

export class InMemoryStore implements RateLimitStore {
  private storage: Map<string, RateLimitData>;
  private windowMs: number;

  constructor(windowMs: number) {
    this.windowMs = windowMs;
    this.storage = new Map();
  }

  async increment(key: string): Promise<RateLimitData> {
    const currentTime = Date.now();
    const entry = this.storage.get(key);

    if (entry) {
      if (currentTime > entry.resetTimestamp) {
        // Reset the counter for the new window
        const newEntry = {
          count: 1,
          resetTimestamp: currentTime + this.windowMs,
        };
        this.storage.set(key, newEntry);
        return newEntry;
      } else {
        // Increment the counter
        const newEntry = {
          count: entry.count + 1,
          resetTimestamp: entry.resetTimestamp,
        };
        this.storage.set(key, newEntry);
        return newEntry;
      }
    }

    // Create new entry
    const newEntry = {
      count: 1,
      resetTimestamp: currentTime + this.windowMs,
    };
    this.storage.set(key, newEntry);
    return newEntry;
  }
}

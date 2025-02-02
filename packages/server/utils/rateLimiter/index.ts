import { InMemoryStore } from "./inMemoryStore";

export interface RateLimitData {
  count: number;
  resetTimestamp: number;
}

export interface RateLimitStore {
  increment(key: string): Promise<RateLimitData>;
}

export class RateLimiter {
  private store: RateLimitStore;
  private limit: number;

  constructor(store: RateLimitStore, limit: number) {
    this.store = store;
    this.limit = limit;
  }

  async handleRequest(ip: string): Promise<boolean> {
    const { count } = await this.store.increment(ip);
    return count <= this.limit;
  }
}

const store = new InMemoryStore(60 * 1000);
const rateLimiter = new RateLimiter(store, 100);

export async function isAllowed(ip: string): Promise<boolean> {
  return rateLimiter.handleRequest(ip);
}

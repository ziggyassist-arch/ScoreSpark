interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

const MAX_CACHE_SIZE = 200;

const store = new Map<string, CacheEntry<unknown>>();

/** Purge all expired entries */
function purgeExpired(): void {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (now > entry.expiresAt) {
      store.delete(key);
    }
  }
}

export function cacheGet<T>(key: string): T | null {
  const entry = store.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    store.delete(key);
    return null;
  }
  return entry.data as T;
}

export function cacheSet<T>(key: string, data: T, ttlMs: number): void {
  // Evict expired entries when cache is getting large
  if (store.size >= MAX_CACHE_SIZE) {
    purgeExpired();
  }
  // If still over limit after purge, drop oldest entries
  if (store.size >= MAX_CACHE_SIZE) {
    const keysToDelete = Array.from(store.keys()).slice(0, store.size - MAX_CACHE_SIZE + 1);
    for (const k of keysToDelete) {
      store.delete(k);
    }
  }
  store.set(key, { data, expiresAt: Date.now() + ttlMs });
}

export function cacheInvalidate(prefix: string): void {
  for (const key of store.keys()) {
    if (key.startsWith(prefix)) {
      store.delete(key);
    }
  }
}

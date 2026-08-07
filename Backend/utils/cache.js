/**
 * Simple in-memory cache with TTL expiration.
 * Keys are strings, values are any JSON-serializable data.
 */
class MemoryCache {
    constructor() {
        this.store = new Map();
    }

    /**
     * Get a cached value by key.
     * Returns null if the key doesn't exist or has expired.
     */
    get(key) {
        const entry = this.store.get(key);
        if (!entry) return null;

        if (Date.now() > entry.expiresAt) {
            this.store.delete(key);
            return null;
        }

        return entry.value;
    }

    /**
     * Set a value in the cache.
     * @param {string} key
     * @param {*} value
     * @param {number} ttlMs - Time to live in milliseconds
     */
    set(key, value, ttlMs) {
        this.store.set(key, {
            value,
            expiresAt: Date.now() + ttlMs
        });
    }

    /**
     * Check if a non-expired entry exists.
     */
    has(key) {
        return this.get(key) !== null;
    }

    /**
     * Delete a specific key.
     */
    delete(key) {
        this.store.delete(key);
    }

    /**
     * Clear all cached entries.
     */
    clear() {
        this.store.clear();
    }

    /**
     * Get the number of active (non-expired) entries.
     */
    get size() {
        // Lazy cleanup: remove expired on access
        for (const [key, entry] of this.store) {
            if (Date.now() > entry.expiresAt) {
                this.store.delete(key);
            }
        }
        return this.store.size;
    }
}

// Singleton instance shared across the backend
const cache = new MemoryCache();

export default cache;

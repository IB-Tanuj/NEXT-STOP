import supabase from '../config/supabase.js';

/**
 * AsyncCache backed by Supabase.
 * Keys are strings, values are any JSON-serializable data.
 */
export class AsyncCache {
    constructor(tableName) {
        this.tableName = tableName;
    }

    /**
     * Get a cached value by key.
     * Returns null if the key doesn't exist or has expired.
     */
    async get(key) {
        try {
            const { data, error } = await supabase
                .from(this.tableName)
                .select('value, expires_at')
                .eq('id', key)
                .single();

            if (error || !data) return null;

            if (Date.now() > data.expires_at) {
                // Delete expired entry in background (fire and forget)
                this.delete(key);
                return null;
            }

            return data.value;
        } catch (err) {
            console.error(`[Cache Error] Failed to GET from ${this.tableName}:`, err.message);
            return null;
        }
    }

    /**
     * Set a value in the cache.
     * @param {string} key
     * @param {*} value
     * @param {number} ttlMs - Time to live in milliseconds
     */
    async set(key, value, ttlMs) {
        try {
            const expiresAt = Date.now() + ttlMs;
            
            const { error } = await supabase
                .from(this.tableName)
                .upsert({
                    id: key,
                    value: value,
                    expires_at: expiresAt
                }, { onConflict: 'id' });

            if (error) {
                console.error(`[Cache Error] Failed to SET in ${this.tableName}:`, error.message);
            }
        } catch (err) {
            console.error(`[Cache Error] Failed to SET in ${this.tableName}:`, err.message);
        }
    }

    /**
     * Delete a specific key.
     */
    async delete(key) {
        try {
            await supabase
                .from(this.tableName)
                .delete()
                .eq('id', key);
        } catch (err) {
            console.error(`[Cache Error] Failed to DELETE in ${this.tableName}:`, err.message);
        }
    }

    /**
     * Clear all cached entries (Truncate).
     */
    async clear() {
        // Warning: This deletes everything in the table.
        try {
            await supabase
                .from(this.tableName)
                .delete()
                .neq('id', 'dummy_condition_to_delete_all'); // Supabase requires a condition to delete multiple
        } catch (err) {
            console.error(`[Cache Error] Failed to CLEAR in ${this.tableName}:`, err.message);
        }
    }
}

// Default instance for flixbus (backward compatibility, though we should transition it)
const cache = new AsyncCache('cache_flixbus');
export default cache;

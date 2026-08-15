/**
 * In-memory cache for AI-generated itineraries.
 * No TTL — entries persist for the lifetime of the server process.
 * 
 * Cache keys are budget-bucketed composite strings so that small
 * budget changes (e.g. switching a ₹200 cheaper hotel) don't bust
 * the cache and waste Groq tokens.
 */

const BUCKET_SIZE = 500; // ₹500 increments

const cache = new Map();
let hits = 0;
let misses = 0;

/**
 * Round a budget value to the nearest bucket.
 * e.g. 4800 → 5000, 5100 → 5000, 5300 → 5500
 */
export const bucketize = (budget) => {
  return Math.round(budget / BUCKET_SIZE) * BUCKET_SIZE;
};

/**
 * Build a deterministic cache key from itinerary parameters.
 * Activities and festivals are sorted to ensure consistent keys
 * regardless of selection order.
 */
export const buildCacheKey = ({ location, days, budget, stayType, transport, selectedActivities, selectedFestivals }) => {
  const loc = (location || '').toLowerCase().trim();
  const d = days || 3;
  const stay = (stayType || 'budget').toLowerCase();
  const trans = (transport || 'train').toLowerCase();

  // Sort activities/festivals for deterministic keys
  const actNames = (selectedActivities || [])
    .map(a => (typeof a === 'string' ? a : a.name || ''))
    .filter(Boolean)
    .sort()
    .join('+');

  const festNames = (selectedFestivals || [])
    .map(f => (typeof f === 'string' ? f : f.name || ''))
    .filter(Boolean)
    .sort()
    .join('+');

  const bucket = bucketize(Number(budget) || 0);

  return `itinerary:${loc}:${d}:${stay}:${trans}:act_${actNames || 'none'}:fest_${festNames || 'none'}:bucket_${bucket}`;
};

/**
 * Get a cached itinerary result by key.
 * Returns the cached data or undefined.
 */
export const get = (key) => {
  if (cache.has(key)) {
    hits++;
    return cache.get(key);
  }
  misses++;
  return undefined;
};

/**
 * Store an itinerary result in the cache.
 */
export const set = (key, value) => {
  cache.set(key, value);
};

/**
 * Get cache statistics for debugging / DevAdmin.
 */
export const getStats = () => ({
  size: cache.size,
  hits,
  misses,
  hitRate: hits + misses > 0 ? ((hits / (hits + misses)) * 100).toFixed(1) + '%' : 'N/A',
});

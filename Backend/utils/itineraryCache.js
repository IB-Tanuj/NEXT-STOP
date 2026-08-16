/**
 * In-memory cache for AI-generated itineraries.
 * No TTL — entries persist for the lifetime of the server process.
 * 
 * Cache keys are budget-bucketed composite strings so that small
 * budget changes (e.g. switching a ₹200 cheaper hotel) don't bust
 * the cache and waste Groq tokens.
 */

import { AsyncCache } from './cache.js';

const BUCKET_SIZE = 500; // ₹500 increments

// Global cache for AI-generated itineraries (long TTL)
const cache = new AsyncCache('cache_itineraries');
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
export const get = async (key) => {
  const data = await cache.get(key);
  if (data) {
    hits++;
    return data;
  }
  misses++;
  return undefined;
};

/**
 * Store an itinerary result in the cache.
 */
export const set = (key, value) => {
  // Save with a very long TTL (e.g. 30 days)
  cache.set(key, value, 30 * 24 * 60 * 60 * 1000);
};

/**
 * Get cache statistics for debugging / DevAdmin.
 */
export const getStats = () => ({
  size: 'N/A (Global Cache)',
  hits,
  misses,
  hitRate: hits + misses > 0 ? ((hits / (hits + misses)) * 100).toFixed(1) + '%' : 'N/A',
});

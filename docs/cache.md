# 🗄️ Cache Features — Complete Reference

> Every caching mechanism in the codebase, documented in one place.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Backend — Shared MemoryCache Utility](#1-backend--shared-memorycache-utility)
3. [Backend — FlixBus API Service Cache](#2-backend--flixbus-api-service-cache)
4. [Backend — Train Controller Cache](#3-backend--train-controller-cache)
5. [Backend — Flight Controller Cache](#4-backend--flight-controller-cache)
6. [Backend — Bus Controller Cache](#5-backend--bus-controller-cache)
7. [Backend — Live Data Controller (Stay Search) Cache](#6-backend--live-data-controller-stay-search-cache)
8. [Backend — Image Routes Cache](#7-backend--image-routes-cache)
9. [Frontend — Image Cache (localStorage)](#8-frontend--image-cache-localstorage)
10. [Summary Table](#summary-table)

---

## Architecture Overview

The project uses **in-memory caching** on the backend and **localStorage-based caching** on the frontend. There is **no Redis or external cache layer** — all caches live in process memory or the browser.

Two caching patterns are used:

| Pattern | Description | Used In |
|---------|-------------|---------|
| **Shared `MemoryCache` class** | Singleton `Map`-backed store with TTL per entry and lazy expiration | FlixBus API Service |
| **Inline `Map` / plain object** | Module-scoped `Map()` or `{}` with manual timestamp comparison | Train, Flight, Bus, Stay, Image controllers |

Three controllers also implement **request deduplication** (coalescing concurrent identical requests into a single API call):

- `flightController.js` → `pendingFlightRequests`
- `busController.js` → `pendingBusRequests`
- `liveDataController.js` → `pendingStayRequests`

---

## 1. Backend — Shared MemoryCache Utility

**File:** [`Backend/utils/cache.js`](file:///c:/Users/91928/trip-website/Backend/utils/cache.js)

A reusable, singleton `MemoryCache` class exported as a default instance.

### Class API

| Method | Signature | Description |
|--------|-----------|-------------|
| `get` | `get(key): any \| null` | Returns the cached value, or `null` if missing/expired. Auto-deletes expired entries on access. |
| `set` | `set(key, value, ttlMs)` | Stores a value with an absolute `expiresAt` timestamp. |
| `has` | `has(key): boolean` | Returns `true` if a non-expired entry exists. |
| `delete` | `delete(key)` | Removes a specific key. |
| `clear` | `clear()` | Wipes the entire store. |
| `size` | `get size(): number` | Returns count of active entries (runs lazy cleanup first). |

### Implementation Details

- **Storage:** `Map` (via `this.store`)
- **Expiration:** Lazy — expired entries are cleaned on `get()` and `size` access, not on a timer.
- **Scope:** Singleton — one instance shared across all backend modules that import it.

```js
// Usage
import cache from '../utils/cache.js';
cache.set('myKey', data, 60_000); // 1 minute TTL
const val = cache.get('myKey');     // null if expired
```

---

## 2. Backend — FlixBus API Service Cache

**File:** [`Backend/services/flixbusApiService.js`](file:///c:/Users/91928/trip-website/Backend/services/flixbusApiService.js)

Uses the shared `MemoryCache` singleton from `utils/cache.js`.

### Cached Endpoints

| Function | Cache Key Pattern | TTL | Purpose |
|----------|-------------------|-----|---------|
| `searchTrips` | `search:{fromId}:{toId}:{date}` | **10 minutes** | Trip search results between two cities |
| `getReachableCities` | `reachable:{cityId}` | **24 hours** | List of reachable cities from a given city |
| `getTimetable` | `timetable:{cityId}:{date}` | **10 minutes** | Timetable for a city on a specific date |

### TTL Constants

```js
const TTL_REACHABLE = 24 * 60 * 60 * 1000;  // 24 hours
const TTL_SEARCH    = 10 * 60 * 1000;        // 10 minutes
const TTL_TIMETABLE = 10 * 60 * 1000;        // 10 minutes
```

### Logging

Logs `[CACHE HIT]` and `[CACHE SET]` with the key and TTL to the console on every cache interaction.

---

## 3. Backend — Train Controller Cache

**File:** [`Backend/controllers/trainController.js`](file:///c:/Users/91928/trip-website/Backend/controllers/trainController.js)

### Implementation

- **Storage:** Plain object (`const cache = {}`)
- **TTL:** **3 hours** (`3 * 60 * 60 * 1000`)
- **Cache Key:** `{fromStation}-{toStation}` (e.g., `NDLS-MAO`)
- **Cached Function:** `searchTrains`

### Flow

1. Build key from `from` and resolved `toCode`.
2. Check if `cache[key]` exists and `Date.now() - timestamp < CACHE_DURATION`.
3. On hit → return `cache[key].data` immediately.
4. On miss → call RapidAPI, store `{ timestamp, data }` in cache, then respond.

### Logging

Logs `🚂 Serving from cache: {from} → {to}` on hits.

### ⚠️ No Request Deduplication

Unlike Flight/Bus/Stay, this controller does **not** coalesce concurrent requests.

---

## 4. Backend — Flight Controller Cache

**File:** [`Backend/controllers/flightController.js`](file:///c:/Users/91928/trip-website/Backend/controllers/flightController.js)

### Implementation

- **Storage:** `Map` (`flightCache`)
- **TTL:** **3 hours** (`3 * 60 * 60 * 1000`)
- **Cache Key:** `{fromCode}_{toCode}_{date|'default'}`
- **Cached Function:** `searchFlights`

### Request Deduplication

Uses `pendingFlightRequests` (`Map`) to prevent duplicate in-flight API calls:

```
1. Check flightCache → return on hit
2. Check pendingFlightRequests → await existing promise if in-flight
3. On miss → create fetch promise, store in pendingFlightRequests
4. On completion → store in flightCache, delete from pendingFlightRequests
```

### Logging

- `✈️ [Cache Hit]` — served from cache
- `✈️ [Cache Pending]` — waiting for an already in-flight request

---

## 5. Backend — Bus Controller Cache

**File:** [`Backend/controllers/busController.js`](file:///c:/Users/91928/trip-website/Backend/controllers/busController.js)

### Implementation

- **Storage:** `Map` (`busCache`)
- **TTL:** **30 minutes** (`30 * 60 * 1000`)
- **Cache Key:** `{from.toLowerCase()}_{to.toLowerCase()}`
- **Cached Function:** `searchBuses`

### Request Deduplication

Uses `pendingBusRequests` (`Map`) — same pattern as Flight:

```
1. Check busCache → return on hit
2. Check pendingBusRequests → await if in-flight
3. On miss → fetch, store promise, then cache result
```

### Logging

- `[Cache Hit]` — served from cache
- `[Cache Pending]` — awaiting existing request
- `[Cache Miss]` — making a new API call

---

## 6. Backend — Live Data Controller (Stay Search) Cache

**File:** [`Backend/controllers/liveDataController.js`](file:///c:/Users/91928/trip-website/Backend/controllers/liveDataController.js)

### Implementation

- **Storage:** `Map` (`stayCache`)
- **TTL:** **30 minutes** (`30 * 60 * 1000`)
- **Cache Key:** `{location.toLowerCase()}_{stayType.toLowerCase()}`
- **Cached Function:** `searchStays`

### Request Deduplication

Uses `pendingStayRequests` (`Map`) — identical coalescing pattern:

```
1. Check stayCache → return on hit
2. Check pendingStayRequests → await if in-flight
3. On miss → fetch, store promise, then cache result
```

### ⚠️ Not Cached

The following endpoints in this controller do **NOT** have caching:

| Function | Endpoint | Why |
|----------|----------|-----|
| `getActivityPrice` | `POST /api/live/activity-price` | Prices are highly time-sensitive |
| `verifyRestaurant` | `POST /api/live/verify-restaurant` | Verification data changes frequently |
| `getStayPrice` | `POST /api/live/stay-price` | Individual stay price lookups |

### Logging

- `[Cache Hit]` — served from cache
- `[Cache Pending]` — awaiting existing request
- `[Cache Miss]` — making a new API call

---

## 7. Backend — Image Routes Cache

**File:** [`Backend/routes/imageRoutes.js`](file:///c:/Users/91928/trip-website/Backend/routes/imageRoutes.js)

### Implementation

- **Storage:** `Map` (`imageCache`)
- **TTL:** **24 hours** (`1000 * 60 * 60 * 24`)
- **Cache Key:** `{query.toLowerCase().trim()}_{limit}`
- **Cached Endpoint:** `GET /api/images/search`

### Flow

1. Normalize query string, build cache key.
2. Check `imageCache.get(key)` — compare `Date.now() - timestamp` against TTL.
3. On hit → respond with `{ images, cached: true }`.
4. On miss → call RapidAPI Google Images, store `{ images, timestamp }`, respond with `{ images, cached: false }`.

### Response Shape

The response includes a `cached: boolean` flag so the client knows whether the result came from cache.

---

## 8. Frontend — Image Cache (localStorage)

**File:** [`src/utils/imageCache.js`](file:///c:/Users/91928/trip-website/src/utils/imageCache.js)

### Implementation

- **Storage:** `localStorage` under key `"trip_images_cache"`
- **TTL:** **None** — entries persist until the browser storage is cleared
- **Structure:** JSON object `{ [query]: string[] }` mapping search queries to arrays of image URLs

### Exported Functions

| Function | Description |
|----------|-------------|
| `getCachedImages(query)` | Reads from localStorage, returns `string[] \| null` |
| `setCachedImages(query, urls)` | Writes to localStorage (overwrites per query) |
| `fetchImagesWithCache(query, limit)` | Checks cache → falls back to `/api/images/search` → saves to cache |

### Used By

| Component | File |
|-----------|------|
| `TripPage` | [`src/components/TripPage.jsx`](file:///c:/Users/91928/trip-website/src/components/TripPage.jsx) |
| `SeasonSection` | [`src/components/SeasonSection.jsx`](file:///c:/Users/91928/trip-website/src/components/SeasonSection.jsx) |
| `LocationSpotlight` | [`src/components/LocationSpotlight.jsx`](file:///c:/Users/91928/trip-website/src/components/LocationSpotlight.jsx) |

### ⚠️ No Expiration

This cache has **no TTL**. Once an image query is stored, it stays until the user clears their browser data. This is intentional — images rarely change and this saves API quota.

---

## Summary Table

| # | Layer | File | Storage Type | TTL | Dedup | Cache Key Pattern |
|---|-------|------|-------------|-----|-------|-------------------|
| 1 | Backend Utility | `utils/cache.js` | `Map` (singleton class) | Per-entry | — | Depends on consumer |
| 2 | Backend Service | `services/flixbusApiService.js` | Shared `MemoryCache` | 10 min / 24 hr | ❌ | `search:`, `reachable:`, `timetable:` |
| 3 | Backend Controller | `controllers/trainController.js` | Plain `{}` | 3 hours | ❌ | `{from}-{to}` |
| 4 | Backend Controller | `controllers/flightController.js` | `Map` | 3 hours | ✅ | `{from}_{to}_{date}` |
| 5 | Backend Controller | `controllers/busController.js` | `Map` | 30 minutes | ✅ | `{from}_{to}` |
| 6 | Backend Controller | `controllers/liveDataController.js` | `Map` | 30 minutes | ✅ | `{location}_{stayType}` |
| 7 | Backend Route | `routes/imageRoutes.js` | `Map` | 24 hours | ❌ | `{query}_{limit}` |
| 8 | Frontend Utility | `src/utils/imageCache.js` | `localStorage` | ♾️ Never | ❌ | `{query}` |

---

*Last updated: 2026-08-08*

const CACHE_KEY = "trip_images_cache"

export const getCachedImages = (query) => {
  try {
    const cache = JSON.parse(localStorage.getItem(CACHE_KEY) || "{}")
    return cache[query] || null
  } catch {
    return null
  }
}

export const setCachedImages = (query, urls) => {
  try {
    const cache = JSON.parse(localStorage.getItem(CACHE_KEY) || "{}")
    cache[query] = urls
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache))
  } catch (e) {
    console.error("Failed to save images to cache", e)
  }
}

export const fetchImagesWithCache = async (query, limit = 4) => {
  // 1. Check persistent cache
  const cached = getCachedImages(query)
  if (cached && cached.length > 0) {
    return cached.slice(0, limit) // return instantly
  }
  
  // 2. Fetch from API if not cached
  const res = await fetch(`/api/images/search?q=${encodeURIComponent(query)}&limit=${limit}`)
  if (!res.ok) throw new Error("Image search failed")
  
  const data = await res.json()
  const urls = (data.images || []).map(img => img.thumbnail || img.url).filter(Boolean)
  
  // 3. Save to persistent cache
  if (urls.length > 0) {
    setCachedImages(query, urls)
  }
  
  return urls.slice(0, limit)
}

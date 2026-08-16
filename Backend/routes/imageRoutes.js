import express from "express";
import axios from "axios";
import { runWithKeyRotation } from "../utils/rapidApiKeyManager.js";

import { AsyncCache } from "../utils/cache.js";

const router = express.Router();

// Global cache to avoid burning API quota on repeated queries
const imageCache = new AsyncCache('cache_images');
// Images don't change, store them effectively forever (10 years)
const CACHE_TTL = 10 * 365 * 24 * 60 * 60 * 1000;

/**
 * GET /api/images/search?q=Baga+Beach+Goa&limit=4
 * Returns real images from Google via RapidAPI
 */
router.get("/search", async (req, res) => {
  try {
    const { q, limit = 4 } = req.query;

    if (!q) {
      return res.status(400).json({ error: "Missing 'q' query parameter" });
    }

    // Check cache first
    const cacheKey = `${q.toLowerCase().trim()}_${limit}`;
    const cached = await imageCache.get(cacheKey);
    if (cached) {
      return res.json({ images: cached.images, cached: true });
    }

    const response = await runWithKeyRotation(process.env.RAPIDAPI_IMAGES_HOST, async (apiKey) => {
      return await axios.get(
        `https://${process.env.RAPIDAPI_IMAGES_HOST}/search`,
        {
          params: {
            query: q,
            limit: parseInt(limit),
            size: "medium",
            color: "any",
            type: "photo",
            time: "any",
            usage_rights: "any",
            file_type: "any",
            aspect_ratio: "any",
            safe_search: "off",
            region: "in", // India-focused results
          },
          headers: {
            "x-rapidapi-key": apiKey,
            "x-rapidapi-host": process.env.RAPIDAPI_IMAGES_HOST,
            "Content-Type": "application/json",
          },
          timeout: 15000,
        }
      );
    });

    // Extract image URLs from response
    const results = response.data?.data || response.data?.results || [];
    const images = results.map((item) => ({
      url: item.url || item.original || item.image?.url,
      thumbnail: item.thumbnail?.url || item.thumbnail || item.url,
      title: item.title || "",
      source: item.source?.url || item.source || "",
      width: item.width || item.image?.width,
      height: item.height || item.image?.height,
    }));

    // Cache the results (fire and forget)
    imageCache.set(cacheKey, { images }, CACHE_TTL);

    return res.json({ images, cached: false });
  } catch (err) {
    console.error("Image search error:", err.message);
    if (err.response) {
      console.error("  Status:", err.response.status);
      console.error("  Data:", JSON.stringify(err.response.data).slice(0, 500));
    }
    if (!process.env.RAPIDAPI_IMAGES_HOST) {
      console.error("  ⚠️  RAPIDAPI_IMAGES_HOST is not set in .env!");
    }
    if (!process.env.RAPIDAPI_KEY) {
      console.error("  ⚠️  RAPIDAPI_KEY is not set in .env!");
    }

    // If API fails, return empty array (frontend will show fallback)
    return res.status(500).json({
      error: "Image search failed",
      message: err.message,
      images: [],
    });
  }
});

export default router;

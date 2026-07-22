import axios from 'axios';

const TINYFISH_SEARCH_URL = "https://api.search.tinyfish.ai";
const TINYFISH_FETCH_URL = "https://api.fetch.tinyfish.ai";

/**
 * Step 2: Search the web using TinyFish Search API (FREE)
 * Returns top search results with titles, URLs, and snippets
 */
export async function searchWeb(query) {
    const apiKey = process.env.TINYFISH_API_KEY;
    if (!apiKey) {
        throw new Error("TINYFISH_API_KEY is not defined in environment variables.");
    }

    const response = await axios.get(TINYFISH_SEARCH_URL, {
        params: { query },
        headers: { "X-API-Key": apiKey },
        timeout: 10000, // 10s timeout
    });

    const results = response.data?.results || response.data?.organic || response.data || [];
    // Only return top 3 results to keep things fast
    return Array.isArray(results) ? results.slice(0, 3) : [];
}

/**
 * Step 3: Fetch clean content from a URL using TinyFish Fetch API (FREE)
 * Returns clean markdown text — no ads, no scripts, no cookie banners
 */
export async function fetchUrl(url) {
    const apiKey = process.env.TINYFISH_API_KEY;
    if (!apiKey) {
        throw new Error("TINYFISH_API_KEY is not defined in environment variables.");
    }

    const response = await axios.post(TINYFISH_FETCH_URL, {
        urls: [url],
        format: "markdown"
    }, {
        headers: {
            "X-API-Key": apiKey,
            "Content-Type": "application/json",
        },
        timeout: 15000, // 15s timeout — page rendering can be slow
    });

    // Extract the text content from the response
    const data = response.data;

    // TinyFish may return content in different formats depending on version
    if (typeof data === 'string') return data;
    if (Array.isArray(data) && data.length > 0) {
        return data[0]?.content || data[0]?.markdown || data[0]?.text || JSON.stringify(data[0]);
    }
    if (data?.content) return data.content;
    if (data?.markdown) return data.markdown;
    if (data?.text) return data.text;
    if (data?.results && Array.isArray(data.results)) {
        return data.results[0]?.content || data.results[0]?.markdown || data.results[0]?.text || JSON.stringify(data.results[0]);
    }

    return JSON.stringify(data);
}

/**
 * Combined: Search + Fetch the top result in one call
 * This is the main helper used by liveDataController for single-item lookups
 */
export async function searchAndFetch(query) {
    // Step 2: Search
    const searchResults = await searchWeb(query);

    if (!searchResults || searchResults.length === 0) {
        throw new Error("No search results found for query: " + query);
    }

    // Pick the first result URL
    const topUrl = searchResults[0]?.url || searchResults[0]?.link || searchResults[0]?.href;
    if (!topUrl) {
        // If no URL, return snippets as fallback
        const snippets = searchResults.map(r => r.snippet || r.description || r.title || "").join("\n");
        return { text: snippets, source: "search_snippets" };
    }

    // Step 3: Fetch the page content
    try {
        const content = await fetchUrl(topUrl);
        return { text: content, source: "fetched_page" };
    } catch (fetchError) {
        // If fetch fails, fall back to search snippets
        console.warn("Fetch failed, falling back to snippets:", fetchError.message);
        const snippets = searchResults.map(r => r.snippet || r.description || r.title || "").join("\n");
        return { text: snippets, source: "search_snippets_fallback" };
    }
}

/**
 * Combined: Search + Fetch the top 2 results and combine text.
 * Used for stay searches where more data = better name extraction.
 * Returns combined text from multiple pages for richer extraction.
 */
export async function searchAndFetchMultiple(query) {
    // Step 2: Search
    const searchResults = await searchWeb(query);

    if (!searchResults || searchResults.length === 0) {
        throw new Error("No search results found for query: " + query);
    }

    // Collect URLs from top 2 results
    const urls = searchResults
        .slice(0, 2)
        .map(r => r.url || r.link || r.href)
        .filter(Boolean);

    if (urls.length === 0) {
        // No URLs — return all snippets combined
        const snippets = searchResults.map(r => r.snippet || r.description || r.title || "").join("\n\n");
        return { text: snippets, source: "search_snippets" };
    }

    // Step 3: Fetch both pages in parallel
    const fetchPromises = urls.map(url =>
        fetchUrl(url).catch(err => {
            console.warn(`Fetch failed for ${url}:`, err.message);
            return null;
        })
    );

    const pages = await Promise.all(fetchPromises);
    const validPages = pages.filter(Boolean);

    if (validPages.length === 0) {
        // All fetches failed — use snippets
        const snippets = searchResults.map(r => r.snippet || r.description || r.title || "").join("\n\n");
        return { text: snippets, source: "search_snippets_fallback" };
    }

    // Combine text from all fetched pages
    const combined = validPages.join("\n\n--- Next Page ---\n\n");
    return { text: combined, source: `fetched_${validPages.length}_pages` };
}

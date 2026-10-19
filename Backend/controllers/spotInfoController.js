import { AsyncCache } from '../utils/cache.js';
import { createGeminiClient, getGeminiApiKeys, getGeminiModel } from '../services/geminiConfig.js';
import { parseGeminiJson } from '../services/geminiResponse.js';

// Cache for 90 days (3 months)
const CACHE_TTL = 90 * 24 * 60 * 60 * 1000;
const spotCache = new AsyncCache('cache_spot_info');
const CHUNK_TIMEOUT_MS = 60000;

const findSpotData = (parsedData, spotName) => {
    if (!parsedData || typeof parsedData !== 'object') return null;
    if (parsedData[spotName]) return parsedData[spotName];
    const cleanTarget = spotName.trim().toLowerCase();
    for (const [key, val] of Object.entries(parsedData)) {
        if (key.trim().toLowerCase() === cleanTarget) return val;
    }
    const alphaTarget = cleanTarget.replace(/[^a-z0-9]/g, '');
    for (const [key, val] of Object.entries(parsedData)) {
        if (key.trim().toLowerCase().replace(/[^a-z0-9]/g, '') === alphaTarget) return val;
    }
    return null;
};

export const getSpotInfoBatch = async (req, res) => {
    try {
        const { spots, locationName } = req.body;

        if (!Array.isArray(spots) || spots.length === 0 || !locationName) {
            return res.status(400).json({ error: "spots (array) and locationName are required." });
        }

        const cleanLoc = locationName.toLowerCase().replace(/[^a-z0-9]+/g, '_');
        const results = {};
        const missingSpots = [];

        // 1. Check cache for all spots
        for (const spot of spots) {
            const cleanSpot = spot.toLowerCase().replace(/[^a-z0-9]+/g, '_');
            const cacheKey = `spotinfo:${cleanSpot}:${cleanLoc}`;
            const cached = await spotCache.get(cacheKey);
            
            if (cached) {
                results[spot] = cached;
            } else {
                missingSpots.push(spot);
            }
        }

        console.log(`[Spot Info Batch] Requested: ${spots.length} | Cached: ${Object.keys(results).length} | Missing: ${missingSpots.length}`);

        // 2. If all are cached, return immediately
        if (missingSpots.length === 0) {
            res.setHeader('X-Cache', 'HIT');
            return res.json(results);
        }

        // 3. Call Gemini for the missing spots in chunks
        console.log(`[Spot Info Batch] Calling Gemini for missing spots: ${missingSpots.join(', ')}`);

        const apiKeys = getGeminiApiKeys();
        if (apiKeys.length === 0) {
            return res.status(503).json({ error: "No Gemini API keys configured." });
        }

        const primaryModel = getGeminiModel();
        const candidateModels = [primaryModel, 'gemini-3.6-flash', 'gemini-flash-latest']
            .filter((m, i, arr) => Boolean(m) && arr.indexOf(m) === i);

        const chunkSize = 2;
        const chunks = [];
        for (let i = 0; i < missingSpots.length; i += chunkSize) {
            chunks.push(missingSpots.slice(i, i + chunkSize));
        }

        const fetchChunk = async (chunkSpots, apiKey, model) => {
            const client = createGeminiClient(apiKey);
            const prompt = `Provide concise, accurate visitor information for the following tourist spots located in ${locationName}, India:
${chunkSpots.map((s, i) => `${i + 1}. ${s}`).join('\n')}

Format requirement (valid JSON, keys MUST be the exact spot names):
{
  "<Spot Name>": {
    "entryPrice": { "adult": number or null, "child": number or null, "free": boolean },
    "openingHours": { "open": "HH:MM", "close": "HH:MM", "closedOn": string or null, "note": string or null },
    "rules": ["rule 1", "rule 2"],
    "permit": { "required": boolean, "details": string or null, "cost": number or null },
    "ageRestrictions": { "hasRestriction": boolean, "details": string or null },
    "recommendedDuration": "1-2 hours",
    "photographyPolicy": { "allowed": boolean, "fee": number or null, "dronesAllowed": boolean },
    "accessibility": "brief notes",
    "tips": ["tip 1", "tip 2"]
  }
}`;

            const response = await Promise.race([
                client.models.generateContent({
                    model,
                    contents: prompt,
                    config: {
                        temperature: 0.2,
                        responseMimeType: 'application/json',
                        systemInstruction: 'You are an Indian travel data expert. Output strictly valid JSON matching the requested schema. Keep descriptions concise.',
                    }
                }),
                new Promise((_, reject) => setTimeout(() => reject(new Error('TIMEOUT_ERROR')), CHUNK_TIMEOUT_MS))
            ]);

            return parseGeminiJson(response.text);
        };

        const fetchChunkWithRetry = async (chunkSpots, startIndex) => {
            let lastError = null;
            for (const model of candidateModels) {
                for (let attempt = 0; attempt < apiKeys.length; attempt++) {
                    const keyIndex = (startIndex + attempt) % apiKeys.length;
                    const apiKey = apiKeys[keyIndex];
                    try {
                        return await fetchChunk(chunkSpots, apiKey, model);
                    } catch (err) {
                        lastError = err;
                        console.warn(`[Spot Info Batch] Chunk [${chunkSpots.join(', ')}] attempt failed (model=${model}, keyIndex=${keyIndex}): ${err.message}`);
                    }
                }
            }
            throw lastError || new Error('All Gemini generation attempts failed for chunk.');
        };

        const chunkPromises = chunks.map((chunkSpots, index) => {
            return fetchChunkWithRetry(chunkSpots, index).catch(err => {
                console.error(`[Spot Info Batch] Error fetching chunk ${index} (${chunkSpots.join(', ')}):`, err.message);
                return { error: true, message: err.message };
            });
        });

        const chunkResults = await Promise.all(chunkPromises);

        // 4. Merge results and cache successful spots
        chunkResults.forEach((parsedData, index) => {
            const chunkSpots = chunks[index];
            if (parsedData && !parsedData.error) {
                for (const spot of chunkSpots) {
                    const spotData = findSpotData(parsedData, spot);
                    if (spotData) {
                        results[spot] = spotData;
                    } else {
                        results[spot] = { error: true, reason: "Not found in Gemini response" };
                    }
                }
            } else {
                for (const spot of chunkSpots) {
                    results[spot] = { 
                        error: true, 
                        reason: parsedData?.message === 'TIMEOUT_ERROR' 
                            ? "Gemini API timed out" 
                            : (parsedData?.message || "Fetch failed for this chunk") 
                    };
                }
            }
        });

        for (const spot of missingSpots) {
            const data = results[spot];
            if (data && !data.error) {
                const cleanSpot = spot.toLowerCase().replace(/[^a-z0-9]+/g, '_');
                const cacheKey = `spotinfo:${cleanSpot}:${cleanLoc}`;
                await spotCache.set(cacheKey, data, CACHE_TTL);
            }
        }

        // If all requested missing spots failed, return error status so client is aware
        const allFailed = missingSpots.length > 0 && missingSpots.every(s => results[s]?.error);
        if (allFailed && Object.keys(results).length === missingSpots.length) {
            const hasTimeout = missingSpots.some(s => results[s]?.reason?.includes('timed out'));
            res.setHeader('X-Cache', 'MISS');
            return res.status(hasTimeout ? 504 : 503).json({
                error: hasTimeout ? "Gemini API timed out fetching spot information." : "Failed to fetch spot information from Gemini AI.",
                results
            });
        }

        res.setHeader('X-Cache', 'MISS');
        res.json(results);
    } catch (error) {
        console.error("Error fetching spot info batch:", error.message);
        res.status(500).json({ error: "Failed to fetch spot info", details: error.message });
    }
};

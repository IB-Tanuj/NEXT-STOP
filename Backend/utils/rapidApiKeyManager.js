import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure the data directory exists
const DATA_DIR = path.join(__dirname, '..', 'data');
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DEAD_KEYS_FILE = path.join(DATA_DIR, 'dead_keys.json');
const DEAD_DURATION_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

/**
 * Load dead keys from the JSON file
 */
const loadDeadKeys = () => {
    try {
        if (fs.existsSync(DEAD_KEYS_FILE)) {
            const data = fs.readFileSync(DEAD_KEYS_FILE, 'utf8');
            return JSON.parse(data);
        }
    } catch (err) {
        console.error('[RapidAPI Manager] Failed to load dead keys file:', err.message);
    }
    return {};
};

/**
 * Save dead keys to the JSON file
 */
const saveDeadKeys = (deadKeys) => {
    try {
        fs.writeFileSync(DEAD_KEYS_FILE, JSON.stringify(deadKeys, null, 2), 'utf8');
    } catch (err) {
        console.error('[RapidAPI Manager] Failed to save dead keys file:', err.message);
    }
};

/**
 * Get all RapidAPI keys from environment variables.
 * Assumes keys start with RAPIDAPI_KEY and are not HOST variables.
 */
export const getAllKeys = () => {
    const keys = [];
    for (const [keyName, value] of Object.entries(process.env)) {
        if (keyName.startsWith('RAPIDAPI_KEY') && value) {
            keys.push(value);
        }
    }
    // Sort or just return as is
    return keys;
};

/**
 * Get an available RapidAPI key that is not dead,
 * or whose dead duration has expired.
 */
export const getAvailableKey = () => {
    const allKeys = getAllKeys();
    if (allKeys.length === 0) return null;

    const deadKeys = loadDeadKeys();
    const now = Date.now();

    for (const key of allKeys) {
        const deadInfo = deadKeys[key];
        if (!deadInfo) {
            return key; // Key is alive
        }

        // Check if the dead duration has expired
        if (now - deadInfo.diedAt > DEAD_DURATION_MS) {
            console.log(`[RapidAPI Manager] Resurrecting key ${key.substring(0, 5)}... (30 days passed)`);
            delete deadKeys[key];
            saveDeadKeys(deadKeys);
            return key;
        }
    }

    return null; // All keys are dead
};

/**
 * Mark a specific key as dead due to rate limits
 */
export const markKeyAsDead = (key) => {
    if (!key) return;
    const deadKeys = loadDeadKeys();
    
    // Only mark it if it's not already marked recently
    if (!deadKeys[key]) {
        deadKeys[key] = { diedAt: Date.now() };
        saveDeadKeys(deadKeys);
        console.warn(`[RapidAPI Manager] Marked key ${key.substring(0, 5)}... as DEAD.`);
    }
};

/**
 * Wrapper to automatically run an API call and rotate keys on 429/503 errors.
 * 
 * @param {Function} taskFn - An async function that takes (apiKey) and returns a Promise.
 * @returns {Promise<any>}
 */
export const runWithKeyRotation = async (taskFn) => {
    const allKeysCount = getAllKeys().length;
    let attempts = 0;
    
    while (attempts <= allKeysCount) {
        const apiKey = getAvailableKey();
        
        if (!apiKey) {
            throw new Error("No RapidAPI keys available (all are rate-limited or exhausted).");
        }

        try {
            return await taskFn(apiKey);
        } catch (error) {
            // Determine the HTTP status code depending on the error format (axios vs fetch)
            const status = error.response?.status || error.status || (error.message && (error.message.includes('429') || error.message.includes('403')) ? (error.message.includes('429') ? 429 : 403) : null);
            
            // Note: 403 can also be an authentication/quota issue from RapidAPI.
            if (status === 429 || status === 503 || status === 403) {
                console.warn(`[RapidAPI Manager] Key ${apiKey.substring(0, 5)}... hit rate limit/forbidden (Status ${status}). Marking as dead and retrying.`);
                markKeyAsDead(apiKey);
                attempts++;
            } else {
                // Not a rate limit issue, bubble it up
                throw error;
            }
        }
    }

    throw new Error("All available RapidAPI keys failed with rate limits during this request.");
};

import supabase from '../config/supabase.js';

/**
 * Retrieves a cached Gemini API result from the `gemini_results` table based on a unique lookup key.
 *
 * @param {string} lookupKey - Normalized key for dedup lookups
 * @returns {Promise<object|null>} The cached result row or null if not found
 */
export async function getGeminiResult(lookupKey) {
    if (!lookupKey) return null;

    try {
        const { data, error } = await supabase
            .from('gemini_results')
            .select('*')
            .eq('lookup_key', lookupKey)
            .limit(1)
            .maybeSingle();

        if (error) {
            console.error('[GeminiCache] Error fetching result:', error.message);
            return null;
        }

        if (data) {
            console.log(`[GeminiCache] HIT for key: ${lookupKey}`);
        } else {
            console.log(`[GeminiCache] MISS for key: ${lookupKey}`);
        }
        return data;
    } catch (error) {
        console.error('[GeminiCache] Exception fetching result:', error.message);
        return null;
    }
}

/**
 * Permanently saves every Gemini API result to the `gemini_results` table.
 * Runs fire-and-forget so it never blocks or slows down the API response.
 *
 * @param {string} requestType - e.g. 'trip_plan', 'itinerary', 'search_query', 'web_cleaning'
 * @param {string} inputPrompt - the prompt sent to Gemini
 * @param {object|null} outputResult - parsed JSON result (null for plain text outputs)
 * @param {string|null} outputText - plain text result (null for JSON outputs)
 * @param {object} metadata - any extra context (location, budget, stayType, etc.)
 * @param {string|null} lookupKey - the key used for retrieving it later (optional)
 */
export function saveGeminiResult(requestType, inputPrompt, outputResult, outputText, metadata = {}, lookupKey = null) {
    // Fire-and-forget — don't await, don't block
    supabase
        .from('gemini_results')
        .upsert({
            request_type: requestType,
            model: 'gemini-3.6-flash',
            input_prompt: inputPrompt,
            output_result: outputResult,
            output_text: outputText,
            metadata,
            lookup_key: lookupKey
        }, { onConflict: 'lookup_key' })
        .then(({ error }) => {
            if (error) {
                console.error('[GeminiLog] Failed to save result:', error.message);
            } else {
                console.log(`[GeminiLog] Saved ${requestType} result${lookupKey ? ` with key: ${lookupKey}` : ''}`);
            }
        });
}

import supabase from '../config/supabase.js';

/**
 * Permanently saves every Gemini API result to the `gemini_results` table.
 * Runs fire-and-forget so it never blocks or slows down the API response.
 *
 * @param {string} requestType - e.g. 'trip_plan', 'itinerary', 'search_query', 'web_cleaning'
 * @param {string} inputPrompt - the prompt sent to Gemini
 * @param {object|null} outputResult - parsed JSON result (null for plain text outputs)
 * @param {string|null} outputText - plain text result (null for JSON outputs)
 * @param {object} metadata - any extra context (location, budget, stayType, etc.)
 */
export function saveGeminiResult(requestType, inputPrompt, outputResult, outputText, metadata = {}) {
    // Fire-and-forget — don't await, don't block
    supabase
        .from('gemini_results')
        .insert({
            request_type: requestType,
            model: 'gemini-3.6-flash',
            input_prompt: inputPrompt,
            output_result: outputResult,
            output_text: outputText,
            metadata,
        })
        .then(({ error }) => {
            if (error) {
                console.error('[GeminiLog] Failed to save result:', error.message);
            } else {
                console.log(`[GeminiLog] Saved ${requestType} result`);
            }
        });
}

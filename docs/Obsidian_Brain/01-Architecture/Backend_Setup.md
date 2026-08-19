# Backend Setup & API Strategy

## Environment
We built a robust Express backend to safely wrap external API calls to Groq and Google Gemini, keeping our API keys hidden from the client.

## AI API Integrations
1. **Groq (Llama 3)**: Used for rapid itinerary generation (`tripController.js`). Groq is extremely fast, which is critical for complex JSON generation.
2. **Gemini (Google GenAI)**: Used for precise, real-time spot info scraping (`spotInfoController.js`).

## Optimization Strategies
- **Parallelization**: Instead of sending a single batch prompt to Gemini for 10 tourist spots (which causes timeout errors because LLMs generate token-by-token), we mapped the array of spots into concurrent `Promise.all` requests. This reduced fetch time from >15s down to <4s.
- **Timeout Wrappers**: LLMs can hang. We wrapped all API calls in explicit `15000ms` timeouts using `Promise.race()` (for Gemini) and Axios `timeout` config (for Groq) to ensure the UI fails fast.
- **Caching Layer**: We implemented an aggressive caching layer (`AsyncCache` and `itineraryCache.js`) using localized cache keys. Budget inputs were bucketized into ₹500 increments to maximize cache hits across similar user requests.

Tags: #backend #express #ai #optimization #caching
Links: [[Agent_Directives]], [[Known_Errors_and_Fixes]]

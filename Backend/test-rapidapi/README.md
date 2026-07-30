# RapidAPI Flight Testing Suite

This folder contains lightweight, standalone Node.js test scripts to test different Flight APIs on RapidAPI before hooking them into `flightController.js`.

## How to test an API:

### 1. Skyscanner / Flight Search API
Run:
```bash
node test-flight-skyscanner.js
```
*(Uses `RAPIDAPI_KEY` and `RAPIDAPI_FLIGHT_HOST` from your `.env` file)*

### 2. Generic Flight API Test
Run:
```bash
node test-flight-generic.js
```

---

## What to look for in the output:
- **Status Code 200**: Indicates valid API Key and Host.
- **Flight Prices & Airlines**: Look at the structure of `data` or `itineraries` to see if ticket prices, airlines, and durations are easily accessible.

### 3. FlixBus API
Run:
```bash
node test-flixbus.js
```
*(Uses the provided Flixbus RapidAPI key)*

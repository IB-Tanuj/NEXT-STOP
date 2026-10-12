# NEXT-STOP

NEXT-STOP is a React/Vite trip-planning application with an Express backend. It helps users explore Indian destinations, compare transport and stay options, create itineraries, collaborate on saved trips, and track group travel savings.

## Local development

Install dependencies in both workspaces:

```bash
npm install
npm --prefix Backend install
```

Start the frontend and API in separate terminals:

```bash
npm run dev
npm run dev:backend
```

Vite proxies `/api` requests to the local backend. If the browser reports `ECONNREFUSED 127.0.0.1:5000`, make sure the backend terminal is running on port 5000.

## Environment variables

Create a local `.env` file from the values used by your development Supabase/API accounts. Keep it out of source control.

### Backend

| Variable | Purpose |
| --- | --- |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only Supabase service-role key |
| `GEMINI_API_KEY` / provider-specific keys | AI generation and validation |
| RapidAPI/TinyFish variables | Optional live transport and hotel providers |

### Frontend

| Variable | Purpose |
| --- | --- |
| `VITE_SUPABASE_URL` | Browser Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Browser-safe Supabase anon key |
| `VITE_API_URL` | Optional API origin; leave empty for the local Vite proxy |

The exact optional provider names are read in `Backend/services` and the relevant controllers. Never put a service-role key in a `VITE_*` variable.

## Database setup order

Run these files in the Supabase SQL editor in order:

1. `Backend/database/setup_profiles.sql`
2. `Backend/database/setup_saved_trips.sql`
3. `Backend/database/setup_wallet_transactions.sql`
4. The remaining feature migrations required by the feature you are testing, such as `setup_today_trip_plans.sql`, `setup_friendships.sql`, and `setup_flixbus.sql`.

The saved-trip wallet migration installs signed ledger constraints and atomic RPCs. Wallet balance changes must go through those RPCs so a balance and its transaction history cannot diverge.

## API areas

The local API includes routes for:

- destination, spot, image, best-time, train, flight, bus, hotel, vehicle, and live search data;
- authenticated saved trips, group membership, today plans, and wallet accounting;
- authenticated profiles and friend requests;
- Flixbus seat maps and booking flows.

Protected routes require `Authorization: Bearer <Supabase access token>`.

## Tests and quality checks

Run the same checks locally as the development CI workflow:

```bash
npm run lint
npm test
npm run build
```

Backend tests can be run directly, or in watch mode while developing:

```bash
npm run test:backend
npm --prefix Backend run test:watch
```

The automated suite covers authenticated middleware behavior, quota RPC calls, Today-plan generation and recovery, persisted generation inputs, saved-trip membership authorization, wallet input/RPC behavior, and AI validation utilities.

## Development notes and known limitations

- Live hotel, transport, image, and AI providers require their development credentials. The UI contains fallback/mock paths for local exploration.
- Some large destination and planning components still contain several domain concerns; new work should extract API clients, state transitions, and reusable UI sections rather than expanding those files.
- Interactive UI controls should use native buttons or links, expose expanded/selected state where applicable, and preserve keyboard focus behavior in dialogs.
- Profile searches and friend/member lookups are served through backend projections. Direct browser reads of the full `profiles` table are restricted by RLS.
- Run database migrations in a development Supabase project before exercising database-backed features.

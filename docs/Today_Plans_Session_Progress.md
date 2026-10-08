# Today Plans Feature — Session Progress

**Checkpoint date:** 2026-10-08  
**Project:** NEXT STOP / `trip-website`  
**Status:** Application integration and automated regression checks are complete. The Supabase migration is still pending and must be applied before the feature can be used against the connected project.

## 1. User-requested product direction

The app should have a dedicated navigation item placed immediately before **Explore**:

```text
Today · 5/5
```

The number represents the user's remaining AI planning credits in the current planning day:

```text
Today · 5/5  → no credits used
Today · 4/5  → one credit used
Today · 3/5  → two credits used
```

The Today area is intended to be a temporary planning desk for trips created during the current daily window. Saved Trips remains the permanent trip library.

Each Today card should provide:

1. **View** — show the stored overview snapshot without silently generating another plan.
2. **Save** — save the plan to Saved Trips; if already saved, show `Already saved`.
3. **Rename** — let the user give the Today card a custom title.

Sharing was intentionally postponed for a later feature.

## 2. Quota policy decisions

### Daily window

The original implementation used five rolling slots per 24 hours. The proposed feature changes this to a fixed daily window:

```text
05:30 AM IST → next day 05:30 AM IST
```

The backend/database must own this time calculation using `Asia/Kolkata`. The browser must not be trusted to decide when credits reset.

At reset time:

- the available credit count returns to `5/5`;
- Today lists only plans in the new planning window;
- old unsaved records remain retained by the database unless a later cleanup policy is introduced;
- Saved Trips are not removed.

### Failed AI generation recovery

The user should not pay another credit when the system failed to generate AI output.

The planned behavior is:

- creating a Today card claims one credit;
- the summary and itinerary share that same credit;
- a server-recorded failed summary or itinerary can be retried for free;
- a retry cannot change the original stored inputs or manually mark a successful generation as failed;
- the server decides whether a retry is a legitimate recovery;
- saving a trip must not silently start an AI request.

### Duplicate request protection

The planning screen gets a stable client-generated plan ID. The backend also uses generation tokens and a short generation lease. This is intended to protect against:

- React Strict Mode effect replay during development;
- double-clicks;
- concurrent browser tabs;
- network retries;
- multiple backend instances.

Intentional regeneration behavior still needs a final product decision. The current work prioritizes preventing accidental duplicate charges and making failed recovery free.

## 3. Existing quota logic that was inspected

Before this feature work, the quota was implemented in:

- `Backend/database/setup_trip_generation_quota.sql`
- `Backend/utils/tripQuota.js`
- `Backend/middleware/tripQuotaMiddleware.js`
- `Backend/routes/tripRoutes.js`
- `src/utils/tripPlanUtils.js`
- `src/components/TripPlan.jsx`

The old flow was:

```text
POST /api/trip/generate
  → requireAuth
  → enforceTripQuota
  → generateTripPlan
```

The old database function claimed a slot before cache/provider work. It used a rolling 24-hour window and returned `allowed`, `remaining`, and `reset_at`.

The frontend already parsed `TRIP_QUOTA_EXCEEDED`, `remaining`, and `resetAt`, but it only displayed a basic warning and did not expose a quota meter or reset countdown.

The existing quota unit tests were run before the new Today work:

```text
node --test Backend/tests/tripQuota.test.js
2 tests passed
```

## 4. Files added or changed during this work

### Database migration added

#### `Backend/database/setup_today_trip_plans.sql`

This migration currently contains the planned database foundation for Today:

- additive `member_ids` support for installations whose older Saved Trips script omitted it;
- `today_trip_plans` table;
- links from a Today plan to `saved_trips`;
- plan statuses for summary and itinerary generation;
- generation tokens and timestamps;
- current 05:30 IST planning-window calculation;
- RPC for reading Today state and quota;
- RPC for idempotent Today plan creation;
- RPC for beginning summary/itinerary generation;
- RPC for finishing a generation with token verification;
- RPC for saving a Today plan and creating its wallets atomically;
- RPC for linking an older Saved Trip to a Today record;
- service-role-only access to the tables and functions.

Important: this SQL has **not** been executed against Supabase in this session and still needs a database review/test before deployment.

### Backend services/controllers/routes added or changed

#### `Backend/services/tripAiService.js`

Extracted AI summary and itinerary generation into reusable functions. The service also adds basic output validation so incomplete JSON is treated as a failed generation and can receive free recovery.

#### `Backend/services/todayPlanService.js`

Added helpers for:

- UUID validation;
- safe RPC calls;
- owner-scoped Today plan lookup;
- resolving a Saved Trip into a Today plan;
- building AI inputs from server-stored plan data;
- beginning/finishing generation through the Today RPCs;
- resolving group member IDs.

#### `Backend/controllers/tripController.js`

Replaced the previous controller with a shared generation handler for:

- `/api/trip/generate` — summary/details generation;
- `/api/trip/generate-itinerary` — itinerary generation.

Both now use the persisted Today plan workflow rather than the old quota middleware directly.

The responses include quota headers and Today plan state. A failed provider/validation request is recorded server-side as a failed section and returns a recovery message.

#### `Backend/controllers/todayPlanController.js`

Added handlers for:

- reading the current Today list and quota;
- creating an idempotent Today plan;
- reading one owner-scoped Today plan;
- renaming a plan;
- updating the current budget snapshot;
- saving a Today plan to Saved Trips.

#### `Backend/routes/todayPlanRoutes.js`

Added authenticated routes:

```text
GET    /api/today-plans
POST   /api/today-plans
GET    /api/today-plans/:id
GET    /api/today-plans/saved-trip/:id
PATCH  /api/today-plans/:id
PUT    /api/today-plans/:id
POST   /api/today-plans/:id/save
```

#### `Backend/routes/tripRoutes.js`

The old `enforceTripQuota` middleware was removed from the two generation routes because Today plan RPCs now own the credit claim and recovery behavior.

#### `Backend/index.js`

Registered:

```text
/api/today-plans
```

### Frontend utilities added or changed

#### `src/utils/todayPlanUtils.js`

Added authenticated client functions for:

- loading Today state;
- creating/updating a plan;
- renaming a plan;
- saving a plan;
- stable client plan-ID creation.

#### `src/utils/tripPlanUtils.js`

Updated generation calls to:

- send `todayPlanId` or `savedTripId`;
- expose returned quota information;
- expose the returned Today plan;
- carry server-recorded AI failure details;
- poll a Today plan after a concurrent request returns HTTP `202`.

### Planning components changed

#### `src/components/BudgetResult.jsx`

The budget result screen now has the early structure for:

- creating a stable Today plan ID;
- syncing the current budget/transport/stay snapshot to Today;
- saving through the Today plan endpoint;
- removing the previous silent background AI generation after Save;
- passing the Today plan ID into the full plan screen.

#### `src/components/TripPlan.jsx`

Updated the full plan screen to:

- accept a Today plan ID or Saved Trip ID;
- pass those IDs to generation;
- avoid duplicate effect requests for the same generation key during Strict Mode replay;
- report the returned plan and quota to its parent;
- show a specific message for server-recorded AI failure;
- pass Today/Saved Trip references to itinerary generation.

#### `src/components/TripPlan/ItineraryView.jsx`

Updated itinerary requests to use the Today/Saved Trip reference and preserve the returned plan state. It accepts `autoGenerate` and stored initial data so read-only/snapshot views never trigger a request.

It also accepts an initial stored itinerary, so opening an already-generated Today plan does not silently issue another AI request.

#### `src/components/Dashboard/TripDetailsTab.jsx`

Updated the saved-trip itinerary request to pass `savedTripId`, allowing the backend to link old Saved Trips into the Today recovery model.

### Today UI components added

#### `src/components/TodaySidebar.jsx`

Added the initial sidebar UI structure for:

- quota count and five-segment meter;
- 05:30 AM IST countdown;
- Today plan list;
- empty state;
- View, Save, and Rename buttons;
- already-saved state;
- opening the plan viewer.

#### `src/components/TodayPlanViewer.jsx`

Added the initial read-only viewer structure for:

- stored `TripOverviewTab` rendering;
- Save to Saved Trips;
- explicit AI-details generation;
- free recovery messaging after a recorded failure;
- itinerary generation after saving;
- plan-state updates after summary/itinerary responses.

## 5. Work still remaining

### A. Navigation integration — complete

`TodaySidebar` is wired into the main app navigation.

Completed changes:

- `onToday` is exposed by `src/components/Navbar.jsx`;
- `Today · n/5` appears immediately before `Explore` on desktop and mobile;
- `showToday` state and the sidebar render are in `src/App.jsx`;
- Today closes when another overlay navigation item is selected;
- Today uses a higher drawer layer than `ExploreSidebar` and a mobile-safe width.

### B. Complete and review the database migration

Before using the feature:

1. Review PostgreSQL syntax and function return shapes.
2. Run `Backend/database/setup_today_trip_plans.sql` in Supabase SQL Editor.
3. Confirm `member_ids` exists on `saved_trips` and has the expected type.
4. Confirm `gen_random_uuid()` is available in the project.
5. Confirm service-role permissions and RLS behavior.
6. Test the 05:30 IST boundary around midnight UTC.
7. Test concurrent RPC calls for one user.
8. Test old Saved Trips with no Today record.

### C. Backend regression tests — unit coverage complete, database coverage pending

The service tests now cover:

- free recovery after a recorded generation failure;
- duplicate in-progress protection;
- quota exhaustion before provider work;
- generation inputs coming from the persisted snapshot;
- lease removal from public responses;
- actionable behavior when the migration is missing;
- saved-trip owner/member access checks;
- summary and itinerary output validation;
- the existing atomic quota helper.

The SQL/RPC concurrency, reset-boundary, save-idempotency, and wallet tests still require a Supabase test project after the migration is applied.

### D. Frontend/backend checks

Passed after the current changes:

```text
npm run lint
npm run build
npm --prefix Backend test
```

The backend test script now targets `Backend/tests/*.test.js`, so live provider diagnostic scripts are not accidentally run as unit tests. The production build and the Today integration-file ESLint pass are clean. The repository-wide ESLint command still reports legacy issues, including existing warnings/errors in the large `BudgetResult.jsx` flow and unrelated files.

### E. Generation behavior — reviewed and corrected

Completed behavior work:

- provider and validation failures reach `finish_today_trip_generation` as server-owned failures;
- generation leases expire after three minutes and token checks prevent stale workers from overwriting retries;
- the HTTP `202` polling path supports both `todayPlanId` and member-accessible `savedTripId` polling;
- Today View uses stored overview/itinerary snapshots and does not silently generate missing AI details;
- pending unsaved Today cards require Save before explicit AI detail/itinerary generation;
- quota exhaustion, free recovery, setup-required, and temporary backend errors have separate API codes/messages.

### F. Verify Saved Trips compatibility

The previous Save flow directly inserted into `/api/saved-trips` and then silently started summary generation. The new Budget Result flow now saves through Today.

Still verify:

- wallets are created correctly through the new save RPC;
- group member IDs are preserved;
- `trip_data.title` and `todayPlanId` do not break Dashboard rendering;
- old Saved Trips still open normally;
- members can generate a missing itinerary without gaining access to another user's Today list;
- deleting a Saved Trip leaves the Today record usable because `saved_trip_id` is `ON DELETE SET NULL`.

### G. Product/UI polish

After integration and tests:

- match Today sidebar placement and visual language to the reference screenshot;
- add accessible button labels and keyboard focus states;
- make the quota wording consistently say `AI plans` or `AI credits`;
- add a visible warning near the planning action when one credit will be used;
- add a “Save before the daily reset” hint for unsaved cards;
- decide whether Today cards should show a local time/created-at label;
- add a loading state while the sidebar refreshes after Save/Rename;
- add a retry button for failed itinerary rendering without remounting the whole viewer.

### H. Documentation follow-up

Updated during this session:

- `docs/Security_and_DB_Management.md` replaces the old rolling-window description;
- `docs/AppFlow.md` documents Today → View/Save/Rename;
- `docs/cache.md` documents persisted Today itinerary snapshots.

Still required before release:

- apply and review `Backend/database/setup_today_trip_plans.sql` in Supabase;
- record the migration step in the deployment README/runbook.

## 6. Important implementation cautions

- Do not deploy the new frontend before running the SQL migration; the new routes depend on its RPCs and table.
- Do not remove the old quota files until the new flow has passed production-like tests; they are currently unused by `tripRoutes.js` but still contain the old tested helper.
- Do not expose service-role credentials to the browser.
- Do not trust client-provided `remaining`, `resetAt`, `charged`, or failure status; those values must come from the backend/database.
- The Today record should retain the budget snapshot, while AI output remains server-owned and is merged through the generation-finish RPC.

## 7. Resume point

The remaining release steps are:

1. Run the SQL migration in the Supabase SQL Editor.
2. Verify the 05:30 IST boundary, concurrent claims, save idempotency, wallets, and legacy Saved Trips in that project.
3. Start the backend alongside Vite during local development (`npm --prefix Backend run dev` and `npm run dev`).

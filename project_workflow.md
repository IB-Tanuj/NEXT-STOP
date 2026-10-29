# Next-Stop — Project Workflow

Built from the real code: [App.jsx](file:///c:/Users/91928/trip-website/src/App.jsx), [Backend/index.js](file:///c:/Users/91928/trip-website/Backend/index.js), the `routes/`, `controllers/` and `services/` folders.

---

## 1. System Architecture (big picture)

```mermaid
flowchart LR
    U["👤 User (Browser)"]

    subgraph FE["Frontend — React + Vite"]
        LP["Landing Pages<br/>/ , /monsoon"]
        AUTH["AuthContext<br/>(Supabase Auth)"]
        APP["/app — Search Home"]
        TRIP["/trip/:locationId"]
        DASH["/dashboard/:section"]
        OVL["Overlays: Today, Explore,<br/>Budget, Plan Trip, Bus Lovers, About"]
    end

    subgraph BE["Backend — Express (Vercel /api)"]
        MW["requireAuth<br/>(JWT check)"]
        R["15 route groups<br/>/api/*"]
        C["Controllers"]
        S["Services"]
        CACHE["Caches<br/>AsyncCache, itineraryCache,<br/>gemini_results"]
    end

    subgraph EXT["External Services"]
        DAHL["Dahl AI (primary)"]
        GEM["Google Gemini (fallback)"]
        RAPID["RapidAPI<br/>Trains, Hotels, Flights"]
        FLIX["FlixBus API"]
        TINY["TinyFish<br/>web search + fetch"]
    end

    DB[("Supabase Postgres<br/>+ RLS + RPCs")]

    U --> LP --> AUTH
    AUTH -->|logged in| APP
    APP --> TRIP
    APP --> OVL
    APP --> DASH
    TRIP & OVL & DASH -->|"fetch + Bearer JWT"| MW
    MW --> R --> C --> S
    C --> CACHE
    S --> DAHL
    S -.->|"if Dahl fails"| GEM
    C --> RAPID
    S --> FLIX
    S --> TINY
    C & S --> DB
    AUTH <--> DB
```

**Deployment:** [api/index.js](file:///c:/Users/91928/trip-website/api/index.js) re-exports the Express app so Vercel runs it as a serverless function. Locally it listens on port `5000`.

---

## 2. Frontend Routing & User Journey

```mermaid
flowchart TD
    START(["User opens site"]) --> L["/ — NewLandingPage"]
    L -->|"Sign in / Sign up"| DRAWER["LandingAuthDrawer<br/>(?auth=login)"]
    DRAWER --> CHECK{"Logged in?<br/>ProtectedRoute"}
    CHECK -->|No| L
    CHECK -->|Yes| VERIFY{"Email verified?"}
    VERIFY -->|No| BANNER["Show verification banner<br/>+ Resend button"]
    VERIFY -->|Yes| HOME
    BANNER --> HOME["/app — Navbar + Hero + SeasonSection"]

    HOME --> SEARCH["Type in Hero search"]
    HOME --> SEASON["Click seasonal card"]
    HOME --> NAV["Navbar buttons"]

    SEARCH --> RESOLVE["handleExplore()<br/>resolve location"]
    SEASON --> RESOLVE
    RESOLVE -->|"city found"| TRIPPAGE["/trip/:locationId<br/>TripPage"]
    RESOLVE -->|"state matched"| STATELIST["Show cities in that state"]
    RESOLVE -->|"not found"| ERR["Return false → show error"]

    NAV --> TODAY["Today sidebar (n/5 credits)"]
    NAV --> EXPLORE["Explore sidebar"]
    NAV --> BUDGET["Budget overlay"]
    NAV --> PLAN["Plan Trip overlay"]
    NAV --> BUS["Bus Lovers overlay"]
    NAV --> ABOUT["About modal"]
    NAV --> DASHB["/dashboard/profile"]

    EXPLORE -->|"pick location"| TRIPPAGE
    BUDGET -->|"pick location"| TRIPPAGE
    TRIPPAGE -->|"Back"| HOME
```

### Search resolution order (`handleExplore` in App.jsx)

```mermaid
flowchart LR
    Q["User input"] --> A{"Exact locationKey?"}
    A -->|yes| OK
    A -->|no| B{"Exact city name?"}
    B -->|yes| OK
    B -->|no| C{"Exact state name?"}
    C -->|yes| ST["Return state + cities"]
    C -->|no| D{"Starts with city/state?<br/>(3+ chars)"}
    D -->|city| OK
    D -->|state| ST
    D -->|no| E{"Contains city/state?"}
    E -->|city| OK
    E -->|state| ST
    E -->|no| F{"Known alias?<br/>up, tn, kashmir…"}
    F -->|yes| OK
    F -->|no| FAIL["Not found"]
    OK["Set theme +<br/>navigate /trip/key"]
```

---

## 3. AI Trip Generation (core flow)

This is the most important flow. A plan's **first** AI request uses 1 of 5 daily credits; repeats and retries after a server-side failure are free.

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant FE as TripPage / Today
    participant API as /api/trip/generate
    participant Auth as requireAuth
    participant Svc as todayPlanService
    participant DB as Supabase RPC
    participant AI as tripAiService
    participant Cache as gemini_results / itineraryCache
    participant LLM as Dahl → Gemini

    User->>FE: Choose days, budget, stay, transport, activities
    FE->>API: POST (Bearer JWT, planId)
    API->>Auth: Verify JWT
    Auth-->>API: req.user
    API->>Svc: runPlanGeneration()
    Svc->>DB: begin_today_trip_generation
    alt quota_exceeded
        DB-->>FE: 429 "Used all 5 plans, resets 5:30 AM IST"
    else in_progress / cached
        DB-->>FE: 202 / 200 existing plan (no charge)
    else generate
        Svc->>AI: generateSummaryData / generateItineraryData
        AI->>Cache: Lookup cache key
        alt Cache HIT
            Cache-->>AI: Stored JSON
        else Cache MISS
            AI->>LLM: Prompt (JSON only)
            LLM-->>AI: JSON response
            AI->>AI: validateSummary / validateItinerary
            AI->>Cache: Save result
        end
        alt success
            Svc->>DB: finish_today_trip_generation(output)
            DB-->>FE: 200 plan + quota
        else AI failed
            Svc->>DB: finish_today_trip_generation(null)
            DB-->>FE: 502 "Try again for free"
        end
    end
```

### AI provider fallback chain

```mermaid
flowchart LR
    P["askAi(prompt)"] --> D{"Dahl configured?"}
    D -->|yes| DA["askDahl (90s timeout)"]
    DA -->|ok| OUT["Parsed JSON"]
    DA -->|error| G
    D -->|no| G["askGemini"]
    G --> M1["Primary model × each API key"]
    M1 -->|fail| M2["gemini-3.6-flash × each key"]
    M2 -->|fail| M3["gemini-flash-latest × each key"]
    M1 & M2 & M3 -->|ok| OUT
    M3 -->|all fail| ERR["Throw last error"]
```

---

## 4. Today Planning Desk — Plan Lifecycle

Planning window: **05:30 AM IST → next day 05:30 AM IST**, 5 credits per window.

```mermaid
stateDiagram-v2
    [*] --> Created: POST /api/today-plans<br/>(stable client plan ID = idempotent)
    Created --> Generating: First AI request<br/>claims 1 credit
    Generating --> Ready: AI success
    Generating --> Failed: AI error (server-recorded)
    Failed --> Generating: Retry (free)
    Ready --> Ready: View (stored snapshot, no AI)
    Ready --> Ready: Rename (PATCH /:id)
    Ready --> Saved: Save (POST /:id/save)<br/>creates Saved Trip + wallets
    Saved --> Saved: Save again → "Already saved"
    Ready --> Previous: Window ends at 5:30 AM IST
    Previous --> Saved: Save from Previous Plans
    Saved --> [*]
```

---

## 5. Saved Trips, Wallets & Friends (Dashboard)

```mermaid
flowchart TD
    DASH["/dashboard/:section"] --> PROF["Profile tab<br/>GET /api/user/profile"]
    DASH --> TRIPS["Trip Details tab<br/>GET /api/saved-trips"]
    DASH --> SAVE["Savings Planner tab"]
    DASH --> FR["Friend Requests tab"]

    FR --> SEARCHF["Search by username"]
    SEARCHF --> REQ["POST /api/friends/request"]
    REQ --> PEND["GET /api/friends/requests"]
    PEND --> ACC["PUT /accept"]
    PEND --> REJ["PUT /reject"]
    ACC --> FRIENDS["GET /api/friends"]
    FRIENDS --> UNF["DELETE /remove<br/>(also removes from shared trips)"]

    TRIPS --> MEM["GET /:id/members"]
    TRIPS --> KICK["POST /:id/kick (owner)"]
    TRIPS --> LEAVE["POST /:id/leave (member)"]
    TRIPS --> DEL["DELETE /:id"]
    TRIPS --> UPD["PUT /:id update data"]

    SAVE --> ADD["POST /savings (add money)"]
    SAVE --> REM["POST /savings/remove"]
    SAVE --> OWN["POST /:id/remove-owner-funds"]
    ADD & REM & OWN --> WALLET["walletService → wallet RPCs<br/>trip_wallets + wallet_transactions"]

    FRIENDS -.->|"friends can be<br/>trip members"| MEM
```

---

## 6. Live Data & Transport Lookups

```mermaid
flowchart LR
    subgraph Trip["TripPage tabs: Overview, Activities, Booking, Emergency"]
        BK["Booking tab"]
        ACT["Activities tab"]
        OV["Overview tab"]
    end

    BK --> TR["/api/trains<br/>search, status/:trainNo"]
    BK --> FL["/api/flights<br/>search, airports"]
    BK --> HO["/api/hotels/search"]
    BK --> FX["/api/flixbus<br/>cities, search, seatmap, book"]
    BK --> VE["/api/vehicle/calculate<br/>own-vehicle cost"]

    ACT --> LIVE["/api/live<br/>activity-price, verify-restaurant,<br/>stay-price, search-stays"]
    OV --> SP["/api/spots/info-batch"]
    OV --> BT["/api/best-time/:location"]
    OV --> IMG["/api/images/search"]

    TR & FL & HO -->|"key rotation"| RAPID["RapidAPI"]
    FX --> FLIX["FlixBus API"]
    LIVE --> QR["queryRouterService<br/>builds search query"]
    QR --> TINY["TinyFish search + fetch"]
    TINY --> CLEAN["Gemini cleans<br/>raw web text → JSON"]
    SP --> GEM["Gemini"]
    BT --> DB[("Supabase")]

    TR & HO & LIVE & SP -.-> AC["AsyncCache<br/>(in-memory)"]
```

---

## 7. Data Model (Supabase tables)

From the SQL files in [Backend/database](file:///c:/Users/91928/trip-website/Backend/database). Relationships are inferred from how the controllers query them.

```mermaid
erDiagram
    PROFILES ||--o{ FRIENDSHIPS : "sends / receives"
    PROFILES ||--o{ SAVED_TRIPS : "owns"
    PROFILES }o--o{ SAVED_TRIPS : "member_ids"
    PROFILES ||--o{ TODAY_TRIP_PLANS : "creates"
    TODAY_TRIP_PLANS |o--o| SAVED_TRIPS : "Save creates"
    SAVED_TRIPS ||--o{ TRIP_WALLETS : "has"
    TRIP_WALLETS ||--o{ WALLET_TRANSACTIONS : "records"
    PROFILES ||--o{ TRIP_GENERATION_QUOTA : "5 credits per day"

    PROFILES {
        uuid id
        string unique_id
        string username
        json preferences
    }
    TODAY_TRIP_PLANS {
        uuid id
        uuid user_id
        string title
        string destination
        json ai_data
    }
    SAVED_TRIPS {
        uuid id
        uuid user_id
        uuid_array member_ids
    }
    GEMINI_RESULTS {
        string cache_key
        json output_result
    }
```

---

## How the pieces connect — summary

| Layer | Main files | Job |
| :-- | :-- | :-- |
| Routing (FE) | `App.jsx` | Landing → auth → `/app`, `/trip`, `/dashboard` |
| Auth | `AuthContext.jsx`, `authMiddleware.js` | Supabase login in browser; JWT checked on the server |
| AI planning | `tripController` → `todayPlanService` → `tripAiService` | Credit claim, cache, Dahl/Gemini, validation |
| Today desk | `todayPlanController`, `TodaySidebar.jsx` | Daily plans, rename, save, history |
| Social + money | `savedTripController`, `friendController`, `walletService` | Group trips, friends, shared savings |
| Live data | `liveDataController`, `tinyfishService`, `queryRouterService` | Web search → AI cleanup → prices |
| Transport | train / flight / hotel / flixbus / vehicle controllers | RapidAPI + FlixBus with key rotation and caching |

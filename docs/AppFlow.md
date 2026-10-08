# App Flow — Navigation & User Journey Map

**Pages List** = 
- `/` (Home)
- `/trip` (Trip Details Page - dynamic)
- `About` (Modal/Overlay)
- `Explore` (Sidebar)
- `Budget` (Overlay)
- `Plan Trip` (Overlay)
- `Today · n/5` (Planning desk sidebar)

**Navigation Type** = Top navbar containing links to main features, left sidebar for Explore, overlays/modals for secondary actions.

**First Screen** = A vibrant Hero section displaying a search bar, seasonal recommendations, and dynamic background based on theme.

**Auth Flow** = 

**Core User Journey 1** = Step-by-step: User wants to explore a specific location. They go to Home -> enter a location in the search bar or click a suggested card -> they are redirected to the Trip Page where they can view detailed location  and maps.

**Core User Journey 2** = Step-by-step: User wants to estimate trip costs. They go to Home -> click "Budget" in the Navbar -> fill out the budget calculation form in the overlay -> view their estimated expenses.

## Today planning desk

Today appears immediately before Explore for authenticated users. It shows the plans created in the current `05:30 AM IST → next-day 05:30 AM IST` planning window and the remaining AI planning credits.

Each card supports:

1. **View** — opens the stored overview snapshot without silently generating AI output.
2. **Save** — atomically creates the Saved Trip and wallets; repeated saves show `Already saved`.
3. **Rename** — updates the Today card title without changing its stored trip inputs.

The stable client plan ID makes a repeated create request idempotent. AI summary and itinerary generation share the credit claimed when the Today card is created. A server-recorded failed section can be retried for free. Share is intentionally deferred.


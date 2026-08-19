# Frontend Patterns

## Architecture: Orchestrator / Delegator
The core design pattern we adopted is the **Orchestrator/Delegator Pattern** for major features like the `BudgetResult` and `TripPlan`.

- **Orchestrator Components** (e.g., `BudgetResult.jsx`, `TripPlan.jsx`): These act as pure state managers. They handle all the API interactions, manage complex state (like `preferences`, `planData`), and pass props down.
- **Delegator Components** (e.g., `StayCard.jsx`, `EntryTicketsCard.jsx`, `TripOverviewTab.jsx`): These are completely dumb/stateless presentational components. They receive props and render UI. 
- **Benefit**: This decoupled state from UI, drastically reducing file size (e.g., separating `BudgetResult` into 6 sub-components) and making maintenance easier.

## Performance: React Code-Splitting
To handle large chunk warnings from Vite, we utilized React's `lazy` and `Suspense`.
By wrapping large modal components (like `AboutPage`, `PlanTripPage`, `TripPage`) in dynamic imports (`React.lazy(() => import('./...'))`), we reduced our initial `index.js` bundle size from ~800kB to ~390kB.

## Rendering Optimization
All delegator components are wrapped in `React.memo()`. This ensures that when the Orchestrator's state changes (like selecting a new train), completely unrelated components (like `StayCard` or `EntryTicketsCard`) do not needlessly re-render.

Tags: #react #architecture #performance #code-splitting
Links: [[UI_UX_Principles]], [[Known_Errors_and_Fixes]]

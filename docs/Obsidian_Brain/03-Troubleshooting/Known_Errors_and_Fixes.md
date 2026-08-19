# Known Errors & Fixes

## 1. Vite Chunk Size Limits
- **Error**: Vite warned about chunks exceeding 500kB.
- **Root Cause**: `TripPage` and `BudgetResult` were importing every sub-component statically, bloating `index.js`.
- **Fix**: Wrapped heavy components in `React.lazy()` and removed ineffective dynamic imports (e.g., importing static JSON data lazily instead of statically). See [[Frontend_Patterns]].

## 2. Gemini API 504 Gateway Timeout
- **Error**: Fetching entry tickets caused infinite loading. The backend was hitting a 60-second Axios default timeout.
- **Root Cause**: Batch-prompting Gemini for 10 spots took longer than the Vercel/Hosting timeout.
- **Fix**: Implemented **Parallel Execution** using `Promise.all` and enforced strict 15-second timeouts. See [[Backend_Setup]].

## 3. React.memo Syntax Bugs
- **Error**: Blank white screen after refactoring.
- **Root Cause**: Incorrectly wrapped exports with `React.memo` (missing parentheses or arrow function issues).
- **Fix**: Safely destructured props inside the memoized function `export const Comp = React.memo(({ prop1 }) => { ... })`.

Tags: #errors #debugging #vite #react
Links: [[Agent_Directives]]

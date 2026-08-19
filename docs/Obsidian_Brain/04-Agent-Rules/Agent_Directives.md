# Agent Directives & Preferences

These are the core rules the AI Agent must follow for future extensions of this project (or new projects):

1. **Iterative Polish over Big Bang**: The user prefers to tackle features one-by-one in explicit phases (Phase 1, Phase 2, etc.) rather than massive simultaneous pull requests.
2. **Component Separation**: Keep distinct features separated. (e.g., Do NOT merge `TripPlan/SharedUI` and `BudgetResult/SharedUI` just to save 10 lines of code; keeping them isolated prevents coupling).
3. **No Placeholders**: When building new features, do not leave "TODO" comments. Build fully robust solutions.
4. **Resilient APIs**: All external API calls MUST be wrapped in explicit timeouts (e.g. 15s) and must fail gracefully with human-readable UI states or retry buttons.
5. **Modern Aesthetics**: Always push for premium UI design—use shimmer skeletons instead of text loaders, add subtle hover micro-animations, and utilize cubic-bezier transitions.

Tags: #ai #rules #preferences

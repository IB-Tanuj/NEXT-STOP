# UI & UX Principles

## CSS-in-JS vs Global Classes
We relied heavily on CSS-in-JS (inline styles) powered by a central `theme` object. This allowed us to dynamically switch themes and keep components self-contained. 
However, for global interactions, we extracted common utilities into `index.css`.

## Core Interactions
1. **Micro-Animations (`.hover-card`)**: 
   We added a satisfying tactile feel to our UI by adding `.hover-card` to all interactive components. It uses a custom cubic-bezier transition (`transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)`) to lift the card and deepen the shadow on hover.
2. **Skeleton Loaders (`ShimmerSkeleton`)**:
   Instead of static text like "Loading...", we used `shimmer` keyframe animations to create beautiful grey placeholder blocks (`.skeleton-box`). This reduces perceived latency.

## Error Handling UX
When external APIs fail, the user should never see a raw error dump.
- **Graceful Fallbacks**: If AI fails to fetch activities, we show a beautiful "Coming Soon" placeholder card.
- **Retry Mechanisms**: If the Gemini API returns a temporary `503` or `504` error, we render a sleek "🔄 Try Again" button rather than outright failing.

Tags: #ux #ui #css #animations
Links: [[Frontend_Patterns]]

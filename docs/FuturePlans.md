# Future Plans & Features

This document outlines the planned features, enhancements, and tasks that we have discussed and intend to implement in future versions of **NEXT-STOP**.

### 1. UI/UX Design Brief
- Create a comprehensive UI/UX design brief to define the visual language, color palettes, typography, and micro-animations for the application.

### 2. Backend Schema & Real User Integration
- Design and implement the complete database schema in PostgreSQL (via Supabase) once we are ready to onboard real users.
- Set up tables for users, saved trips, budgets, and application settings.

### 3. User Authentication
- Implement a secure login and signup flow (e.g., using Supabase Auth or Google OAuth).
- Create personalized user profiles where users can manage their preferences and view their history.

### 4. Advanced Trip Planning & Saved Itineraries
- Allow users to save their customized itineraries.
- Add features for sharing trips with friends and family.

### 5. Live Integrations
- **Train Status & Booking**: Complete the backend integration for fetching live train status and potentially redirecting to booking portals.
- **Weather Updates**: Show real-time weather forecasts for the selected destinations to help users pack and plan accordingly.

### 6. Edge Cases & Document Updates
- Fill out the empty columns in the PRD, TRD, and App Flow documents (e.g., Error States, Redirects, Empty States) as they are developed.
- Keep all documentation updated as new features are added.

### 7. Mobile App / Deployment Enhancements
- Discuss strategies for pausing/saving project state effectively across environments.
- Ensure 100% responsiveness on all mobile devices and consider a React Native port if mobile usage is high.

### 8. Supabase Migration Architecture
As the application scales, we plan to shift more backend responsibility to Supabase to reduce server load and token costs:
- **Persistent API Caching**: Migrate the in-memory Node.js cache (for buses, stays, and trains) to a Supabase `api_cache` table. This will prevent data loss on server restarts and scale perfectly across multiple backend instances.
- **Background Pre-fetching**: Implement Supabase Scheduled Edge Functions to proactively scrape and cache the top 20 most popular routes (e.g., Delhi to Manali) every morning. This drastically reduces the 10-second wait time for users making common searches.

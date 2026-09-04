# Security & Database Management

This document tracks all security configurations, database management decisions, and pending action items for the NEXT STOP project.

---

## 🔐 Authentication System

### Current Stack
- **Provider:** Supabase Auth (Email/Password)
- **Password Storage:** bcrypt hashed — raw passwords are never stored
- **Session Management:** Supabase JWT tokens with automatic refresh
- **Frontend Key:** `VITE_SUPABASE_ANON_KEY` (publishable, safe for browsers)
- **Backend Key:** `SUPABASE_SERVICE_ROLE_KEY` (secret, server-only, bypasses RLS)

### Email Verification
- **Status:** ✅ Enabled
- **Behaviour:** Users must verify email before they can log in. Prevents fake email signups.
- **Flow:** Sign up → receive verification email → click link → log in
- **Rate Limit:** Supabase free tier allows ~3-4 verification emails/hour

### Auth Methods
| Method | Status | Notes |
|---|---|---|
| Email/Password | ✅ Live | Core auth method |
| Google OAuth | ❌ Deferred | Blocked by GCP billing ("prepayment required" on project YATRA). `signInWithGoogle()` is scaffolded in AuthContext, ready to wire up. |
| Microsoft | ❌ Removed | Not planned |
| Phone OTP | ❌ Removed | Not planned |
| SSO | ❌ Removed | Not planned |

---

## 🛡️ Row Level Security (RLS)

### Current State: ✅ All tables locked down

RLS is enabled on **all** public tables with **zero public policies**. This means:
- ✅ Backend (`service_role_key`) → full access (bypasses RLS)
- 🚫 Anon key (frontend/public) → **blocked from everything**
- ✅ `auth.users` → always protected internally by Supabase regardless of RLS

### Protected Tables

| Table | Purpose | RLS |
|---|---|---|
| `cache_flights` | Flight search cache | ✅ Enabled |
| `cache_buses` | Bus search cache | ✅ Enabled |
| `cache_trains` | Train search cache | ✅ Enabled |
| `cache_hotels` | Hotel search cache | ✅ Enabled |
| `cache_stays` | Live stay data cache | ✅ Enabled |
| `cache_images` | Image search cache | ✅ Enabled |
| `cache_itineraries` | AI itinerary cache | ✅ Enabled |
| `cache_flixbus` | Flixbus route cache | ✅ Enabled |
| `best_time_to_visit` | Best time data | ✅ Enabled |
| `flixbus_cities` | Flixbus city list | ✅ Enabled |
| `bus_layouts` | Bus seat layout templates | ✅ Enabled |
| `seat_templates` | Seat grid data | ✅ Enabled |
| `trip_bookings` | Booking records | ✅ Enabled |
| `booked_seats` | Booked seat tracking | ✅ Enabled |

### Auto-RLS for Future Tables
- **Status:** Pending — PostgreSQL event trigger (`trg_auto_enable_rls`) needs to be run once in SQL Editor
- **Effect:** Any new table created in the `public` schema will automatically have RLS enabled
- **SQL File:** `Backend/database/enable_rls.sql`

---

## 🤖 Bot Protection

| Layer | Status | Details |
|---|---|---|
| Email verification | ✅ Active | Prevents bots from using the app |
| Supabase rate limiting | ✅ Built-in | Limits signup spam (~3-4 emails/hour on free tier) |
| Cloudflare Turnstile (CAPTCHA) | ❌ Pre-launch | Free, invisible CAPTCHA. Add before public launch. |

---

## ⚠️ Pre-Launch Action Items

### 🔴 Critical (Before Launch)

- [ ] **Set up custom SMTP provider** — Supabase's built-in email sender has a strict rate limit (~3-4/hour). Add a free SMTP provider to remove this limit:
  - **Resend** — 100 emails/day free → [resend.com](https://resend.com)
  - **Brevo** — 300 emails/day free → [brevo.com](https://brevo.com)
  - **Where:** Supabase Dashboard → Project Settings → Authentication → SMTP Settings

- [ ] **Run the auto-RLS event trigger** — Paste and run the PostgreSQL event trigger in SQL Editor so all future tables get RLS automatically

- [ ] **Add Cloudflare Turnstile** — Invisible bot protection on the signup form
  - Get free site key from [Cloudflare Turnstile](https://dash.cloudflare.com/sign-up?to=/:account/turnstile)
  - Configure in Supabase Dashboard → Authentication → Bot Protection
  - Add `<Turnstile>` widget to auth drawer

### 🟡 Post-Launch

- [ ] **Enable Google OAuth** — Sort GCP billing on project YATRA, create OAuth Web Client credentials, paste Client ID + Secret into Supabase Google provider settings
- [ ] **Wire up backend auth middleware** — `Backend/middleware/authMiddleware.js` is scaffolded. Apply to user-specific routes when saved trips / user profiles are built
- [ ] **Add rate limiting to Express backend** — Use `express-rate-limit` to throttle API abuse

---

## 📝 Change Log

| Date | Change | Decision |
|---|---|---|
| 2026-09-04 | Auth system built | Email/Password via Supabase Auth. Replaced mocked localStorage auth. |
| 2026-09-04 | Google OAuth deferred | GCP project YATRA requires billing. `signInWithGoogle()` scaffolded for later. |
| 2026-09-04 | Email verification enabled | Turned ON in Supabase to prevent fake email signups. |
| 2026-09-04 | RLS enabled on all tables | All 14 public tables locked down. Zero public policies = anon key fully blocked. |
| 2026-09-04 | SMTP reminder logged | Must add custom SMTP (Resend/Brevo) before launch to remove email rate limits. |
| 2026-09-04 | Bot protection planned | Cloudflare Turnstile to be added pre-launch. Email verification covers beta phase. |

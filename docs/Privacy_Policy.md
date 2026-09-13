# Privacy Policy

**Last Updated:** September 13, 2026

**NEXT STOP** ("we," "us," "our") operates the NEXT STOP travel planning platform (the "Service"). This Privacy Policy explains how we collect, use, store, and protect your personal information.

---

## 1. Information We Collect

### 1.1 Information You Provide
When you create an account or use our Service, we collect:

| Data | Purpose | Required |
|---|---|---|
| **Email address** | Account creation, login, verification emails | Yes |
| **Name / Username** | Display name across the platform | Yes |
| **Password** | Account authentication (stored as bcrypt hash — we never see your raw password) | Yes |
| **Date of Birth** | Age verification, personalized recommendations | Yes |
| **Gender** | Travel safety recommendations, personalized suggestions | Optional |
| **Bio** | Public profile display | Optional |
| **Profile picture** | Public profile display | Optional |
| **Interest tags** | Personalized travel recommendations | Optional |

### 1.2 Information We Collect Automatically
When you use the Service, we automatically collect:
- **Search queries** — destinations, travel dates, and preferences you enter (used to generate trip plans and cached to improve performance)
- **Device information** — browser type, screen size (used for responsive design only)
- **Usage data** — pages visited, features used (for improving the Service)

### 1.3 Information We Do NOT Collect
- We do **not** track your real-time GPS location
- We do **not** sell or share your data with advertisers
- We do **not** store your payment information (we do not process payments)

---

## 2. How We Use Your Information

We use your information to:
- **Provide the Service** — generate AI trip plans, show flight/train/bus/hotel results, and personalize recommendations
- **Authenticate you** — verify your identity via email and maintain your login session
- **Improve the Service** — analyze usage patterns to fix bugs and build better features
- **Communicate with you** — send verification emails and important service updates (no marketing spam)

---

## 3. Data Storage & Security

### 3.1 Where Your Data Is Stored
- Your account data (email, name, password hash) is stored securely in **Supabase** (hosted on cloud infrastructure)
- Cached search results (flights, trains, hotels) are stored in our Supabase database with automatic expiration
- AI-generated trip plans are cached permanently to improve response times

### 3.2 How We Protect Your Data
- **Passwords** are hashed using bcrypt — we never store or see your raw password
- **Sessions** use JWT tokens with automatic expiration (1 hour access token, 7 day refresh token)
- **Row Level Security (RLS)** is enabled on all database tables — your data cannot be accessed through the public API
- **HTTPS** encryption is used for all data in transit

### 3.3 Data Retention
- **Account data** is retained as long as your account is active
- **Cached search data** expires automatically based on data type (10 minutes to 90 days)
- **AI trip plans** are cached permanently but contain no personal information (only destination-based)
- You can request deletion of your account and all associated data at any time

---

## 4. Third-Party Services

We use the following third-party services to provide our features:

| Service | Purpose | Data Shared |
|---|---|---|
| **Supabase** | Authentication, database | Email, name, password hash |
| **Google Gemini AI** | Trip plan & itinerary generation | Search queries (destination, budget, preferences) — no personal data |
| **RapidAPI** (various providers) | Flight, train, bus, hotel search | Search queries only — no personal data |
| **Unsplash** | Destination images | None |

We do **not** share your personal information (email, name, DOB, etc.) with any third-party API. Only anonymized search queries (e.g., "flights from Delhi to Goa") are sent to external services.

---

## 5. Your Rights

You have the right to:
- **Access** your personal data — view what we store about you
- **Update** your personal data — edit your profile at any time
- **Delete** your account — request complete deletion of your account and all associated data
- **Export** your data — request a copy of your personal data

To exercise any of these rights, contact us at the email listed below.

---

## 6. Children's Privacy

Our Service is not intended for children under the age of **13**. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal data, please contact us and we will delete it.

---

## 7. Future Features

We plan to introduce the following features which will involve additional data collection:

| Feature | Additional Data | Purpose |
|---|---|---|
| **Phone number login** | Phone number | Alternative authentication method |
| **Wanderlog posts** | Text, photos, location tags | User-generated travel content |
| **Wanderlog saves** | Saved post IDs | Bookmarking favorite content |

This Privacy Policy will be updated before these features launch. You will be notified of any material changes.

---

## 8. Changes to This Policy

We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the updated policy on this page and updating the "Last Updated" date. Your continued use of the Service after changes constitutes acceptance of the updated policy.

---

## 9. Contact Us

If you have any questions about this Privacy Policy or your personal data, please contact us at:

**Email:** t.adhikari.feb.2006@gmail.com

---

*This Privacy Policy is effective as of September 13, 2026.*

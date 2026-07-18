# Technical Requirement Document (TRD)

**Frontend** = React 19 (via Vite) with standard CSS
**Backend** = Node.js / Express
**Database** = PostgreSQL via Supabase
**Auth** = 
**Hosting** = Vercel (Frontend), Backend hosting to be determined
**Third-party APIs** = 
- Supabase (Backend database and services, free tier)
- Leaflet / React-Leaflet (Interactive mapping, free)
**Key Libraries** = React (UI), Express (API), Axios (HTTP Client), Dotenv (Environment management), Cors (Cross-Origin Resource Sharing)
**Environment Variables** = 
- Frontend: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
- Backend: `PORT`, `SUPABASE_URL`, `SUPABASE_KEY`
**Constraints** = Must work responsively on mobile, fast load times, and leverage free tiers for third-party services.

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
=======
# NEXT-STOP

## Local development

Run the frontend and API in separate terminals so Vite's `/api` proxy has a backend target:

```bash
npm run dev
npm --prefix Backend run dev
```

If Vite reports `proxy error: /api/... ECONNREFUSED 127.0.0.1:5000`, the backend terminal is not running or is using another port.

Before testing the Today planning desk, run `Backend/database/setup_today_trip_plans.sql` in the Supabase SQL Editor after the Saved Trips tables exist. The migration adds the fixed 05:30 AM IST planning window, Today RPCs, generation leases, and atomic Today-to-Saved-Trips persistence.


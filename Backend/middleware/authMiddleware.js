import supabase from '../config/supabase.js';
import { createRequireAuth } from './authFactory.js';

/**
 * Auth Middleware — Verifies Supabase JWT tokens on protected API routes.
 * 
 * Usage (when you need it later for user-specific features):
 *   import { requireAuth } from './middleware/authMiddleware.js';
 *   app.get('/api/saved-trips', requireAuth, savedTripsController);
 * 
 * The verified user is attached to req.user.
 */
export const requireAuth = createRequireAuth(supabase);

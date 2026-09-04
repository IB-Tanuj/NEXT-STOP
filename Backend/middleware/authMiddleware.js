import supabase from '../config/supabase.js';

/**
 * Auth Middleware — Verifies Supabase JWT tokens on protected API routes.
 * 
 * Usage (when you need it later for user-specific features):
 *   import { requireAuth } from './middleware/authMiddleware.js';
 *   app.get('/api/saved-trips', requireAuth, savedTripsController);
 * 
 * The verified user is attached to req.user.
 */
export const requireAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Missing or invalid Authorization header',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid or expired token',
      });
    }

    // Attach user to the request object for downstream handlers
    req.user = user;
    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to verify authentication',
    });
  }
};

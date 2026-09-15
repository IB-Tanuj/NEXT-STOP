import express from 'express';
import { getProfile, searchByUsername } from '../controllers/userController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get current user's profile
router.get('/profile', requireAuth, getProfile);

// Search for a user by Username
router.get('/search/:username', requireAuth, searchByUsername);

export default router;

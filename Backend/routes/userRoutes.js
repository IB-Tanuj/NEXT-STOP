import express from 'express';
import { getProfile, searchByUniqueId } from '../controllers/userController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get current user's profile
router.get('/profile', requireAuth, getProfile);

// Search for a user by Unique ID
router.get('/search/:uid', requireAuth, searchByUniqueId);

export default router;

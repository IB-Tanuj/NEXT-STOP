import express from 'express';
import { getActivityPrice, verifyRestaurant, getStayPrice } from '../controllers/liveDataController.js';

const router = express.Router();

// POST /api/live/activity-price — Get live pricing for an activity
router.post('/activity-price', getActivityPrice);

// POST /api/live/verify-restaurant — Verify a restaurant exists and get live info
router.post('/verify-restaurant', verifyRestaurant);

// POST /api/live/stay-price — Get current room rates for a stay
router.post('/stay-price', getStayPrice);

export default router;

import express from 'express';
import { generateTripPlan, generateItinerary } from '../controllers/tripController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { enforceTripQuota } from '../middleware/tripQuotaMiddleware.js';

const router = express.Router();

router.use(requireAuth);

// POST /api/trip/generate — Generate trip plan using Groq AI
router.post('/generate', enforceTripQuota, generateTripPlan);

// POST /api/trip/generate-itinerary - Generate detailed itinerary
router.post('/generate-itinerary', generateItinerary);

export default router;

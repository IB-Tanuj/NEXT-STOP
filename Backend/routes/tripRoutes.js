import express from 'express';
import { generateTripPlan, generateItinerary } from '../controllers/tripController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(requireAuth);

// Both sections belong to a persisted plan. Its first AI request claims one
// credit atomically; duplicate requests and recovery reuse that original credit.
router.post('/generate', generateTripPlan);

// POST /api/trip/generate-itinerary - Generate detailed itinerary
router.post('/generate-itinerary', generateItinerary);

export default router;

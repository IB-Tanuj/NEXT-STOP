import express from 'express';
import { generateTripPlan, generateItinerary } from '../controllers/tripController.js';

const router = express.Router();

// POST /api/trip/generate — Generate trip plan using Groq AI
router.post('/generate', generateTripPlan);

// POST /api/trip/generate-itinerary - Generate detailed itinerary
router.post('/generate-itinerary', generateItinerary);

export default router;

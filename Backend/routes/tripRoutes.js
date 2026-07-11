import express from 'express';
import { generateTripPlan } from '../controllers/tripController.js';

const router = express.Router();

// POST /api/trip/generate — Generate trip plan using Groq AI
router.post('/generate', generateTripPlan);

export default router;

import express from 'express';
import { searchFlights, listAirports } from '../controllers/flightController.js';

const router = express.Router();

// GET /api/flights/search?from=DEL&to=GOI or ?from=DEL&destination=goa
router.get('/search', searchFlights);

// GET /api/flights/airports?query=delhi
router.get('/airports', listAirports);

export default router;

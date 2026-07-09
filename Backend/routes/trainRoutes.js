import express from 'express';
import { getTrainStatus, searchTrains } from '../controllers/trainController.js';

const router = express.Router();

// GET /api/trains/status/:trainNo — Get info for a specific train
router.get('/status/:trainNo', getTrainStatus);

// GET /api/trains/search?from=NDLS&to=MAO — Search trains between stations
// Also supports: ?from=NDLS&destination=goa (auto-resolves station code)
router.get('/search', searchTrains);

export default router;

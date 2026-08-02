import express from 'express';
import { searchBuses, getReachable, getSeatMap, bookSeats } from '../controllers/flixbusController.js';

const router = express.Router();

router.post('/search', searchBuses);
router.get('/reachable/:name', getReachable);
router.get('/seatmap/:tripId', getSeatMap);
router.post('/book', bookSeats);

export default router;

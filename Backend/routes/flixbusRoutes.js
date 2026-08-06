import express from 'express';
import { getCities, searchBuses, searchMonth, getReachable, getSeatMap, bookSeats } from '../controllers/flixbusController.js';

const router = express.Router();

router.get('/cities', getCities);
router.post('/search', searchBuses);
router.post('/search-month', searchMonth);
router.get('/reachable/:name', getReachable);
router.get('/seatmap/:tripId', getSeatMap);
router.post('/book', bookSeats);

export default router;

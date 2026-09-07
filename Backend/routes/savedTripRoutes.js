import express from 'express';
import { saveTrip, getTrips, updateTripData, addSavings } from '../controllers/savedTripController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(requireAuth);

router.post('/', saveTrip);
router.get('/', getTrips);
router.put('/:id', updateTripData);
router.post('/savings', addSavings);

export default router;

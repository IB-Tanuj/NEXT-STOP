import express from 'express';
import { saveTrip, getTrips, updateTripData, addSavings, deleteTrip } from '../controllers/savedTripController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(requireAuth);

router.post('/', saveTrip);
router.get('/', getTrips);
router.put('/:id', updateTripData);
router.post('/savings', addSavings);
router.delete('/:id', deleteTrip);
router.post('/:id/leave', leaveTrip);

export default router;

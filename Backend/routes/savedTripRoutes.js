import express from 'express';
import { saveTrip, getTrips, updateTripData, addSavings, removeSavings, kickMember, deleteTrip, leaveTrip, getTripMembers } from '../controllers/savedTripController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(requireAuth);

router.post('/', saveTrip);
router.get('/', getTrips);
router.put('/:id', updateTripData);
router.post('/savings', addSavings);
router.post('/:id/remove-owner-funds', requireAuth, removeOwnerFunds);
router.delete('/:id', deleteTrip);
router.post('/:id/leave', leaveTrip);
router.post('/:id/kick', kickMember);
router.get('/:id/members', getTripMembers);

export default router;

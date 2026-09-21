import express from 'express';
import { saveTrip, getTrips, updateTripData, addSavings, removeSavings, removeOwnerFunds, kickMember, deleteTrip, leaveTrip, getTripMembers } from '../controllers/savedTripController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(requireAuth);

router.post('/', saveTrip);
router.get('/', getTrips);
router.put('/:id', updateTripData);
router.post('/savings', addSavings);
router.post('/savings/remove', removeSavings);
router.post('/:id/remove-owner-funds', removeOwnerFunds);
router.delete('/:id', deleteTrip);
router.post('/:id/leave', leaveTrip);
router.post('/:id/kick', kickMember);
router.get('/:id/members', getTripMembers);

export default router;

import express from 'express';
import { 
    sendFriendRequest, 
    acceptFriendRequest, 
    rejectFriendRequest, 
    removeFriend, 
    getPendingRequests, 
    getAcceptedFriends,
    getSharedTripsCount
} from '../controllers/friendController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(requireAuth);

router.post('/request', sendFriendRequest);
router.put('/accept', acceptFriendRequest);
router.put('/reject', rejectFriendRequest);
router.delete('/remove', removeFriend);
router.get('/requests', getPendingRequests);
router.get('/', getAcceptedFriends);
router.get('/:id/shared-trips-count', getSharedTripsCount);

export default router;

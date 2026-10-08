import express from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import { createTodayPlan, getSavedPlanGeneration, getTodayPlan, getTodayPlans, renameTodayPlan, saveTodayPlan, updateTodayPlan } from '../controllers/todayPlanController.js';

const router = express.Router();
router.use(requireAuth);
router.get('/', getTodayPlans);
router.post('/', createTodayPlan);
router.get('/saved-trip/:id', getSavedPlanGeneration);
router.get('/:id', getTodayPlan);
router.patch('/:id', renameTodayPlan);
router.put('/:id', updateTodayPlan);
router.post('/:id/save', saveTodayPlan);

export default router;

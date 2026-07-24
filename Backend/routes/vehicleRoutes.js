import express from 'express';
import { calculateVehicleCost } from '../controllers/vehicleController.js';

const router = express.Router();

// POST /api/vehicle/calculate — Calculate personal vehicle trip expenses
router.post('/calculate', calculateVehicleCost);

// GET /api/vehicle/estimate — Query parameter based estimation
router.get('/estimate', calculateVehicleCost);

export default router;

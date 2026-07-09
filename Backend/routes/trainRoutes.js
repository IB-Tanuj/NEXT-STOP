import express from 'express';
import { getTrainStatus } from '../controllers/trainController.js';

const router = express.Router();

// GET /api/trains/status/:trainNo
router.get('/status/:trainNo', getTrainStatus);

export default router;

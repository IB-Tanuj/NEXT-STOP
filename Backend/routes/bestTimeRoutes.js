import express from 'express';
import { getBestTimeByLocation } from '../controllers/bestTimeController.js';

const router = express.Router();

router.get('/:location', getBestTimeByLocation);

export default router;

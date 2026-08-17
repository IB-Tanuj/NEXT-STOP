import express from 'express';
import { getSpotInfoBatch } from '../controllers/spotInfoController.js';

const router = express.Router();

router.post('/info-batch', getSpotInfoBatch);

export default router;

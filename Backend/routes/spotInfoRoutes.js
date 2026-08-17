import express from 'express';
import { getSpotInfo } from '../controllers/spotInfoController.js';

const router = express.Router();

router.post('/info', getSpotInfo);

export default router;

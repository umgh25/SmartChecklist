import express from 'express';
import { generateChecklist } from '../controllers/checklistController';

const router = express.Router();

router.post('/generate', generateChecklist);

export default router;
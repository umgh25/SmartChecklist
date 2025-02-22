import { Router } from 'express';
import { generateChecklist } from '../controllers/checklistController';

const router = Router();

router.post('/generate', generateChecklist);

export default router;
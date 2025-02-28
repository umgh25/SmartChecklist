import { Router } from 'express';
import { createChecklist, getChecklists, updateChecklist } from '../controllers/checklist.controller';
import { generateChecklist } from '../controllers/checklistController';

const router = Router();

router.post('/', createChecklist);
router.get('/', getChecklists);
router.put('/:id', updateChecklist);
router.post('/generate', generateChecklist);

export default router;

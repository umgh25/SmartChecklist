import { Router } from 'express';
import { createChecklist, getChecklists, updateChecklist } from '../controllers/checklist.controller';  

const router = Router();

router.post('/', createChecklist);
router.get('/', getChecklists);
router.put('/:id', updateChecklist);  

export default router;
import { Router } from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import {
  createTemplate,
  getTemplates,
  updateTemplate,
  deleteTemplate
} from '../controllers/templateController.js';

const router = Router();

router.post('/', protect, createTemplate);
router.get('/', protect, getTemplates);
router.put('/:id', protect, updateTemplate);
router.delete('/:id', protect, deleteTemplate);

export default router;

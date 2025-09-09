import { Router } from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import { generateTemplate } from '../controllers/generateAITempController.js';

const router = Router();
router.post('/generate-template', generateTemplate);

export default router;
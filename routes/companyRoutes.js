import { Router } from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import { getCompanies } from '../controllers/companyController.js';

const router = Router();

router.get('/companies', protect, getCompanies);

export default router;
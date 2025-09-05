import { Router } from 'express';
import { loginUser, registerUser, updateSmtp } from '../controllers/userController.js';
import { getDashboardStats } from '../controllers/dashboardController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/smtp', protect, updateSmtp);
router.get('/dashboard', protect, getDashboardStats);

export default router;

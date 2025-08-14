import { Router } from 'express';
import { loginUser, registerUser, updateSmtp } from '../controllers/userController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/smtp', protect, updateSmtp);

export default router;

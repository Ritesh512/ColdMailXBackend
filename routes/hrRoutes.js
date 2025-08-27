import { Router } from 'express';
import multer from 'multer';
import {
  uploadHrBulk,
  getAllHrs,
  getGlobalHrs,
  getUserHrs,
  addHr,
  updateHr,
  deleteHr,
  verifyEmails,
  getHrsByCompany,
} from '../controllers/hrController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload-bulk', protect, upload.single('file'), uploadHrBulk);
router.get('/', protect, getAllHrs);
router.get('/global', protect, getGlobalHrs);
router.get('/user', protect, getUserHrs);
router.post('/', protect, addHr);
router.put('/:id', protect, updateHr);
router.delete('/:id', protect, deleteHr);
router.post('/verify-emails', protect, verifyEmails);
router.get('/by-company', protect, getHrsByCompany);


export default router;

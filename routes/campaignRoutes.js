import { Router } from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import {
  createCampaign,
  getCampaigns,
  getCampaignById,
  previewTemplate,
  sendCampaign,
  editCampaign
} from '../controllers/campaignController.js';

const router = Router();

router.post('/', protect, createCampaign);
router.get('/', protect, getCampaigns);
router.get('/:id', protect, getCampaignById);
router.post('/preview', protect, previewTemplate);
router.post('/:campaignId/send', protect, sendCampaign);
router.put('/:campaignId', protect, editCampaign);


export default router;

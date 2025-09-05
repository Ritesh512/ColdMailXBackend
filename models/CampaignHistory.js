import mongoose from 'mongoose';

const campaignHistorySchema = new mongoose.Schema({
  campaign: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  hrList: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Hr' }],
  sentTo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Hr' }], // HRs actually sent to
  sentCount: { type: Number, default: 0 },
  sentAt: { type: Date, default: Date.now }
}, { timestamps: true });

export const CampaignHistory = mongoose.model('CampaignHistory', campaignHistorySchema);
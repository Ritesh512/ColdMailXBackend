// models/Campaign.js
import mongoose from 'mongoose';

const campaignSchema = new mongoose.Schema({
  campaignName: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  company: String,
  hrList: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Hr' }],
  template: { type: mongoose.Schema.Types.ObjectId, ref: 'Template' },
  placeholders: [
    {
      key: { type: String, required: true },
      value: { type: String, required: true }
    }
  ],
  status: { type: String, enum: ['Pending', 'Sent', 'Failed'], default: 'Pending' },
  sentTo: [{
    hr: { type: mongoose.Schema.Types.ObjectId, ref: 'Hr' },
    status: String,
    error: String,
  }],
}, { timestamps: true });

export const Campaign = mongoose.model('Campaign', campaignSchema);

// models/Campaign.js
import mongoose from 'mongoose';

const campaignSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  company: String,
  hrList: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Hr' }],
  template: { type: mongoose.Schema.Types.ObjectId, ref: 'Template' },
  resumeUrl: String,
  jobId: String,
  status: { type: String, enum: ['Pending', 'Sent', 'Failed'], default: 'Pending' },
  sentTo: [{
    hr: { type: mongoose.Schema.Types.ObjectId, ref: 'Hr' },
    status: String,
    error: String,
  }],
}, { timestamps: true });

export const Campaign = mongoose.model('Campaign', campaignSchema);

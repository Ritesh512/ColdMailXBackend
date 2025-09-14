// models/Hr.js
import mongoose from 'mongoose';
import { type } from 'os';

const hrSchema = new mongoose.Schema({
  name: String,
  email: {type: String, required: true},
  company: String,
  title: String,
  mobileNo: String,
  isVerified: { type: Boolean, default: false },
  isGlobal: { type: Boolean, default: false },
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

export const Hr = mongoose.model('Hr', hrSchema);

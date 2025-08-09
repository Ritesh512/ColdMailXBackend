// models/Template.js
import mongoose from 'mongoose';

const templateSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  subject: { type: String, required: true },
  body: { type: String, required: true },
  placeholders: [String],
  isGlobal: { type: Boolean, default: false },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

export const Template = mongoose.model('Template', templateSchema);

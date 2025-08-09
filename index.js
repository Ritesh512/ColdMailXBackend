// app.js
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import hrRoutes from './routes/hrRoutes.js';
import userRoutes from './routes/userRoutes.js';
import templateRoutes from './routes/templateRoutes.js';
import campaignRoutes from './routes/campaignRoutes.js';

dotenv.config();

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

app.use('/api/hr', hrRoutes);
app.use('/api/users', userRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/campaigns', campaignRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

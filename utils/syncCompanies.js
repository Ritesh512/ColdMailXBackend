import mongoose from 'mongoose';
import { Hr } from '../models/Hr.js';
import { Company } from '../models/company.js';
import dotenv from 'dotenv';
dotenv.config();

// TODO: Replace with your actual MongoDB connection string
const MONGO_URI = process.env.MONGO_URI;

async function syncCompanies() {
  await mongoose.connect(MONGO_URI);

  // Get all unique company names from HRs
  const companies = await Hr.distinct('company');
  console.log(`Found ${companies.length} unique companies.`);

  // Upsert each company name into Company collection
  await Promise.all(
    companies.map(name =>
      Company.findOneAndUpdate(
        { name },
        { name },
        { upsert: true, new: true }
      )
    )
  );

  console.log('Company sync complete.');
  await mongoose.disconnect();
}

syncCompanies().catch(err => {
  console.error('Error syncing companies:', err);
  mongoose.disconnect();
});
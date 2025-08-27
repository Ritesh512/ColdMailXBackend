import { Company } from '../models/company.js';

// Get all companies
export const getCompanies = async (req, res) => {
  try {
    const companies = await Company.find().select('name -_id');
    res.status(200).json(companies);
  } catch (err) {
    console.error('Get companies error:', err);
    res.status(500).json({ error: 'Failed to fetch companies' });
  }
};
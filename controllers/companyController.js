import { User } from '../models/User.js';

// Get companies for logged-in user
export const getCompanies = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find user and return only companyNames field
    const user = await User.findById(userId).select('companyNames -_id');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ companies: user.companyNames || [] });
  } catch (err) {
    console.error('Get companies error:', err);
    res.status(500).json({ error: 'Failed to fetch companies' });
  }
};

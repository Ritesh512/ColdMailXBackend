import { User } from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) return res.status(400).json({ message: 'User already exists' });

  const user = await User.create({ name, email, password });
  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id),
  });
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id),
  });
};


export const updateSmtp = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'SMTP email and password are required.' });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { smtp: { email, password } },
      { new: true }
    ).select('-password'); // Don't return password

    res.status(200).json({ smtp: user.smtp });
  } catch (err) {
    console.error('Update SMTP error:', err);
    res.status(500).json({ error: 'Failed to update SMTP settings.' });
  }
};

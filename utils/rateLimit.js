import { User } from '../models/User.js';

function isSameDay(date1, date2) {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

export async function checkEmailVerificationLimit(userId) {
  const user = await User.findById(userId);

  const now = new Date();
  const lastReset = user.emailVerificationLastReset || now;

  // Reset counter if it's a new day
  if (!isSameDay(now, lastReset)) {
    user.emailVerificationCount = 0;
    user.emailVerificationLastReset = now;
  }

  if (user.emailVerificationCount >= 2) {
    return { allowed: false, message: "Daily email verification limit reached" };
  }

  // Increment and save
  user.emailVerificationCount += 1;
  await user.save();

  return { allowed: true };
}

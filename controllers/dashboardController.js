import { Campaign } from '../models/Campaign.js';
import { Hr } from '../models/Hr.js';
import { User } from '../models/User.js';
import { CampaignHistory } from '../models/CampaignHistory.js';

export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;

    // 1. Campaign history
    const totalCampaigns = await Campaign.countDocuments({ user: userId });
    const successfulCampaigns = await Campaign.countDocuments({ user: userId, status: 'Sent' });
    const failedCampaigns = await Campaign.countDocuments({ user: userId, status: 'Failed' });

    // 2. Count of emails sent by the user (all time)
    const allHistory = await CampaignHistory.find({ user: userId });
    const emailsSent = allHistory.reduce((sum, h) => sum + (h.sentCount || 0), 0);

    // 2a. Emails sent today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const historyToday = await CampaignHistory.find({
      user: userId,
      sentAt: { $gte: today, $lt: tomorrow }
    });
    const emailsSentToday = historyToday.reduce((sum, h) => sum + (h.sentCount || 0), 0);

    // 2b. Emails sent for last 5 days (including today)
    const emailsSentLast5Days = [];
    for (let i = 0; i < 5; i++) {
      const dayStart = new Date();
      dayStart.setUTCHours(0, 0, 0, 0);
      dayStart.setUTCDate(dayStart.getUTCDate() - (4 - i)); // 4 days ago to today
      const dayEnd = new Date(dayStart);
      dayEnd.setUTCDate(dayEnd.getUTCDate() + 1);

      const historyDay = await CampaignHistory.find({
        user: userId,
        sentAt: { $gte: dayStart, $lt: dayEnd }
      });
      const count = historyDay.reduce((sum, h) => sum + (h.sentCount || 0), 0);

      emailsSentLast5Days.push({
        date: dayStart.toISOString().slice(0, 10),
        count
      });
    }

    // 3. HRs added by the user as global
    const globalHrCount = await Hr.countDocuments({ addedBy: userId, isGlobal: true });

    // 4. SMTP email and password (last 4 chars, masked)
    const user = await User.findById(userId).select('smtp');
    const smtpEmail = user.smtp?.email
      ? user.smtp.email
      : null;
    const smtpPassword = user.smtp?.password
      ? '****' + user.smtp.password.slice(-4)
      : null;

    // 5. Top 5 companies with highest global HR count
    const topCompaniesAgg = await Hr.aggregate([
      { $match: { isGlobal: true } },
      { $group: { _id: '$company', hrCount: { $sum: 1 } } },
      { $sort: { hrCount: -1 } },
      { $limit: 5 }
    ]);
    const topCompanies = topCompaniesAgg.map(c => ({
      company: c._id,
      hrCount: c.hrCount
    }));

    // 6. Recent 3 campaigns sent
    const recentCampaigns = await Campaign.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(3)
      .populate({
        path: 'template',
        select: 'name subject'
      })
      .populate({
        path: 'hrList',
        select: '_id'
      })
      .select('campaignName template company hrList createdAt');

    const recentCampaignsFormatted = recentCampaigns.map(camp => ({
      campaignName: camp.campaignName,
      templateName: camp.template?.name || '',
      templateSubject: camp.template?.subject || '',
      company: camp.company,
      hrCount: camp.hrList?.length || 0,
      sendDate: camp.createdAt
    }));

    res.status(200).json({
      campaigns: {
        total: totalCampaigns,
        successful: successfulCampaigns,
        failed: failedCampaigns
      },
      emailsSent,
      emailsSentToday,
      emailsSentLast5Days,
      globalHrCount,
      smtp: {
        email: smtpEmail,
        password: smtpPassword
      },
      topCompanies,
      recentCampaigns: recentCampaignsFormatted
    });
  } catch (err) {
    console.error('Dashboard stats error:', err);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
};
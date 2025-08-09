import { Campaign } from '../models/Campaign.js';
import { Hr } from '../models/Hr.js';
import { Template } from '../models/Template.js';
import nodemailer from 'nodemailer';
import handlebars from 'handlebars';

export const previewTemplate = async (req, res) => {
  try {
    const { templateId, previewData } = req.body;
    const template = await Template.findById(templateId);
    if (!template) return res.status(404).json({ error: 'Template not found' });

    const subjectCompiled = handlebars.compile(template.subject);
    const bodyCompiled = handlebars.compile(template.body);

    const subject = subjectCompiled(previewData);
    const html = bodyCompiled(previewData);

    res.status(200).json({ subject, html });
  } catch (err) {
    console.error('Preview error:', err);
    res.status(500).json({ error: 'Failed to preview template' });
  }
};

export const sendCampaign = async (req, res) => {
  try {
    const { campaignId } = req.params;
    const campaign = await Campaign.findById(campaignId).populate('hrList template');
    if (!campaign) return res.status(404).json({ error: 'Campaign not found' });
    if (!campaign.user.equals(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Configure nodemailer with user's SMTP credentials
    const transporter = nodemailer.createTransport({
      service: 'gmail', // or as per user config
      auth: {
        user: req.user.smtp.email,
        pass: req.user.smtp.password,
      },
    });
    await transporter.verify();

    const subjectTpl = handlebars.compile(campaign.template.subject);
    const bodyTpl = handlebars.compile(campaign.template.body);

    const sentResults = [];

    for (const hr of campaign.hrList) {
      const data = {
        userName: req.user.name,
        userEmail: req.user.email,
        resumeLink: campaign.resumeUrl,
        jobId: campaign.jobId || '',
        hrName: hr.name,
        company: hr.company,
      };

      const mailOptions = {
        from: req.user.smtp.email,
        to: hr.email,
        subject: subjectTpl(data),
        html: bodyTpl(data),
      };

      try {
        await transporter.sendMail(mailOptions);
        sentResults.push({ hr: hr._id, status: 'Sent' });
      } catch (err) {
        console.error(`Email send error to ${hr.email}:`, err);
        sentResults.push({ hr: hr._id, status: 'Failed', error: err.message });
      }
    }

    campaign.sentTo = sentResults;
    campaign.status = sentResults.every(r => r.status === 'Sent') ? 'Sent' : 'Failed';
    await campaign.save();

    res.status(200).json({ message: 'Campaign processed', sentResults });
  } catch (err) {
    console.error('Send campaign error:', err);
    res.status(500).json({ error: 'Failed to send campaign' });
  }
};


export const createCampaign = async (req, res) => {
  try {
    const { company, hrList, template, resumeUrl, jobId } = req.body;

    const campaign = await Campaign.create({
      user: req.user._id,
      company,
      hrList,
      template,
      resumeUrl,
      jobId,
      status: 'Pending',
      sentTo: [],
    });

    res.status(201).json(campaign);
  } catch (err) {
    console.error('Create campaign error:', err);
    res.status(500).json({ error: 'Failed to create campaign' });
  }
};

export const getCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find({ user: req.user._id })
      .populate('hrList')
      .populate('template');

    res.status(200).json(campaigns);
  } catch (err) {
    console.error('Get campaigns error:', err);
    res.status(500).json({ error: 'Failed to fetch campaigns' });
  }
};

export const getCampaignById = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id)
      .populate('hrList')
      .populate('template');

    if (!campaign) return res.status(404).json({ error: 'Campaign not found' });
    if (!campaign.user.equals(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    res.status(200).json(campaign);
  } catch (err) {
    console.error('Get campaign by ID error:', err);
    res.status(500).json({ error: 'Failed to fetch campaign' });
  }
};

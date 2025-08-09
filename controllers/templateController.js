import { Template } from '../models/Template.js';

export const createTemplate = async (req, res) => {
  try {
    const { name, subject, body, placeholders = [], isGlobal = false } = req.body;

    const template = await Template.create({
      name,
      subject,
      body,
      placeholders,
      isGlobal,
      createdBy: req.user._id
    });

    res.status(201).json(template);
  } catch (err) {
    console.error('Create template error:', err);
    res.status(500).json({ error: 'Failed to create template' });
  }
};

export const getTemplates = async (req, res) => {
  try {
    const templates = await Template.find({
      $or: [{ isGlobal: true }, { createdBy: req.user._id }]
    });

    res.status(200).json(templates);
  } catch (err) {
    console.error('Get templates error:', err);
    res.status(500).json({ error: 'Failed to fetch templates' });
  }
};

export const updateTemplate = async (req, res) => {
  try {
    const template = await Template.findById(req.params.id);

    if (!template) return res.status(404).json({ error: 'Template not found' });
    if (!template.createdBy.equals(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized to update this template' });
    }

    const updated = await Template.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updated);
  } catch (err) {
    console.error('Update template error:', err);
    res.status(500).json({ error: 'Failed to update template' });
  }
};

export const deleteTemplate = async (req, res) => {
  try {
    const template = await Template.findById(req.params.id);

    if (!template) return res.status(404).json({ error: 'Template not found' });
    if (!template.createdBy.equals(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized to delete this template' });
    }

    await Template.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Template deleted' });
  } catch (err) {
    console.error('Delete template error:', err);
    res.status(500).json({ error: 'Failed to delete template' });
  }
};

// controllers/hrController.js
import { Hr } from "../models/Hr.js";
import { parseExcelOrCsv } from "../utils/parseFile.js";
import fs from "fs";
import axios from "axios";
import { checkEmailVerificationLimit } from "../utils/rateLimit.js";
import { Company } from "../models/company.js";

export const uploadHrBulk = async (req, res) => {
  try {
    const addedBy = req.user._id; // assuming user is authenticated

    const file = req.file;
    const ext = file.originalname.split(".").pop();

    // parseExcelOrCsv must be updated to handle Buffers instead of file paths
    const data = await parseExcelOrCsv(file.buffer, ext);

    // Filter out invalid rows
    const rawData = data.filter((d) => d.email && d.name && d.company);

    // Add companies if not present
    await Promise.all(
      rawData.map((hr) =>
        Company.findOneAndUpdate(
          { name: hr.company },
          { name: hr.company },
          { upsert: true, new: true }
        )
      )
    );

    // Get emails from file
    const emails = rawData.map((hr) => hr.email.toLowerCase());

    // Find existing HRs by email
    const existing = await Hr.find({ email: { $in: emails } }).select("email");
    const existingEmails = new Set(
      existing.map((hr) => hr.email.toLowerCase())
    );

    // Filter only new HRs
    const newHrs = rawData
      .filter((hr) => !existingEmails.has(hr.email.toLowerCase()))
      .map((hr) => ({
        name: hr.name,
        email: hr.email,
        company: hr.company,
        title: hr.title || "",
        mobileNo: hr.mobileNo || "",
        addedBy,
        isVerified: false,
        isGlobal: false,
      }));

    if (newHrs.length > 0) {
      await Hr.insertMany(newHrs);
    }

    // fs.unlinkSync(file.path); // Clean up uploaded file

    res.status(200).json({
      message: "Bulk HR upload completed",
      added: newHrs.length,
      skipped: rawData.length - newHrs.length,
    });
  } catch (err) {
    console.error("Error uploading HR bulk:", err);
    res.status(500).json({ error: err.message });
  }
};

export const getAllHrs = async (req, res) => {
  try {
    const userId = req.user._id;
    const hrs = await Hr.find({
      $or: [{ isGlobal: true }, { addedBy: userId }],
    });
    res.status(200).json(hrs);
  } catch (err) {
    console.error("Get all HRs error:", err);
    res.status(500).json({ error: "Failed to fetch HRs" });
  }
};

export const getGlobalHrs = async (req, res) => {
  try {
    const hrs = await Hr.find({ isGlobal: true });
    res.status(200).json(hrs);
  } catch (err) {
    console.error("Get global HRs error:", err);
    res.status(500).json({ error: "Failed to fetch global HRs" });
  }
};

export const getUserHrs = async (req, res) => {
  try {
    const hrs = await Hr.find({ addedBy: req.user._id });
    res.status(200).json(hrs);
  } catch (err) {
    console.error("Get user HRs error:", err);
    res.status(500).json({ error: "Failed to fetch user HRs" });
  }
};

export const addHr = async (req, res) => {
  try {
    const {
      name,
      email,
      company,
      title,
      mobileNo,
      isGlobal = false,
      isVerified = false,
    } = req.body;

    if (!name || !email || !company) {
      return res
        .status(400)
        .json({ error: "Name, Email, and Company are required." });
    }

    const exists = await Hr.findOne({ email });
    if (exists) {
      return res
        .status(409)
        .json({ error: "HR with this email already exists" });
    }

    // Add company if not present
    await Company.findOneAndUpdate(
      { name: company },
      { name: company },
      { upsert: true, new: true }
    );

    const hr = await Hr.create({
      name,
      email,
      company,
      title,
      mobileNo,
      isGlobal,
      isVerified,
      addedBy: req.user._id,
    });

    res.status(201).json(hr);
  } catch (err) {
    console.error("Add HR error:", err);
    res.status(500).json({ error: "Failed to add HR" });
  }
};

export const updateHr = async (req, res) => {
  try {
    const hr = await Hr.findById(req.params.id);

    if (!hr) {
      return res.status(404).json({ error: "HR not found" });
    }

    if (
      hr.addedBy.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ error: "Unauthorized to update this HR" });
    }

    // If company is being updated, add it if not present
    if (req.body.company) {
      await Company.findOneAndUpdate(
        { name: req.body.company },
        { name: req.body.company },
        { upsert: true, new: true }
      );
    }

    const updatedHr = await Hr.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(updatedHr);
  } catch (err) {
    console.error("Update HR error:", err);
    res.status(500).json({ error: "Failed to update HR" });
  }
};

export const deleteHr = async (req, res) => {
  try {
    const hr = await Hr.findById(req.params.id);

    if (!hr) {
      return res.status(404).json({ error: "HR not found" });
    }

    if (
      hr.addedBy.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ error: "Unauthorized to delete this HR" });
    }

    await Hr.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "HR deleted successfully" });
  } catch (err) {
    console.error("Delete HR error:", err);
    res.status(500).json({ error: "Failed to delete HR" });
  }
};

export const verifyEmails = async (req, res) => {
  try {
    const { allowed, message } = await checkEmailVerificationLimit(
      req.user._id
    );

    if (!allowed) {
      return res.status(429).json({ error: message, status: 429 });
    }

    const { emails } = req.body; // expects: { emails: ["email1@example.com", "email2@example.com"] }
    if (!Array.isArray(emails) || emails.length === 0) {
      return res
        .status(400)
        .json({ error: "Please provide an array of emails.", status: 400 });
    }

    const results = await Promise.all(
      emails.map(async (email) => {
        try {
          const response = await axios.get(
            `https://api.hunter.io/v2/email-verifier`,
            {
              params: {
                email,
                api_key: process.env.HUNTER_API_KEY,
              },
            }
          );
          return {
            email,
            status: response.data.data.status,
          };
        } catch (err) {
          return {
            email,
            status: "error",
            error: err.response?.data?.errors || err.message,
          };
        }
      })
    );

    res.status(200).json({ results });
  } catch (err) {
    console.error("Email verification error:", err);
    res.status(500).json({ error: "Failed to verify emails", status: 500 });
  }
};

export const getHrsByCompany = async (req, res) => {
  try {
    const { company } = req.query;
    if (!company) {
      return res
        .status(400)
        .json({ error: "Company name is required in query." });
    }

    console.log("Fetching HRs for company:", company);
    console.log("Request made by user ID:", req.user._id);

    const hrs = await Hr.find({
      company,
      $or: [{ isGlobal: true }, { addedBy: req.user._id }],
    }).select("name email _id isVerified isGlobal");

    res.status(200).json(hrs);
  } catch (err) {
    console.error("Get HRs by company error:", err);
    res.status(500).json({ error: "Failed to fetch HRs" });
  }
};

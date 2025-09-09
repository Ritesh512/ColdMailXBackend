// app.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import hrRoutes from "./routes/hrRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import templateRoutes from "./routes/templateRoutes.js";
import campaignRoutes from "./routes/campaignRoutes.js";
import companyRoutes from "./routes/companyRoutes.js";
import aitemplateRoutes from "./routes/aitemplateRoutes.js";
import { connectToDB } from "./utils/db.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();

const app = express();
app.use(express.static(path.resolve(__dirname, "dist")));
app.use(express.json());
app.use(cors());

await connectToDB();
console.log("MongoDB connected");

app.use("/api/hr", hrRoutes);
app.use("/api/users", userRoutes);
app.use("/api/templates", templateRoutes);
app.use("/api/campaigns", campaignRoutes);
app.use("/api/hr", companyRoutes);
app.use("/api/aitemplate", aitemplateRoutes);

app.get(/.*/, (req, res) => {
  res.sendFile(path.resolve(__dirname, "dist", "index.html"));
});

// const PORT = process.env.PORT || 8080;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;

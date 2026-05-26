import mongoose from "mongoose";

const LeadSchema = new mongoose.Schema({
  email:     { type: String, required: true },
  company:   { type: String, default: "" },
  role:      { type: String, default: "" },
  auditId:   { type: String, required: true },
  savings:   { type: Number, default: 0 },
  createdAt: { type: Date,   default: Date.now },
});

export default mongoose.models.Lead || mongoose.model("Lead", LeadSchema);
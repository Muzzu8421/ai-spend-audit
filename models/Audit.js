import mongoose from "mongoose";

const AuditSchema = new mongoose.Schema({
  auditId:             { type: String, required: true, unique: true },
  entries:             { type: Array,  required: true },
  teamSize:            { type: Number, required: true },
  useCase:             { type: String, required: true },
  results:             { type: Array,  required: true },
  totalMonthlySavings: { type: Number, required: true },
  totalAnnualSavings:  { type: Number, required: true },
  summary:             { type: String, default: "" },
  createdAt:           { type: Date,   default: Date.now },
});

export default mongoose.models.Audit || mongoose.model("Audit", AuditSchema);
import mongoose from "mongoose";

const caseSchema = new mongoose.Schema(
  {
    caseNumber: {
      type: String,
      required: true, // Official case number shown in court records.
      unique: true,
      trim: true,
    },
    title: {
      type: String, // Short description of the dispute.
      required: true,
      trim: true,
    },
    caseType: {
      type: String, // Broad Indian-court classification for the case.
      required: true,
      enum: ["Civil", "Criminal", "Family", "Writ"],
    },
    plaintiff: {
      type: String, // Person or organisation bringing the case.
      required: true,
      trim: true,
    },
    defendant: {
      type: String, // Person or organisation responding to the case.
      required: true,
      trim: true,
    },
    court: {
      type: String, // Seeded court identifier shared by the assigned users.
      required: true,
      trim: true,
    },
    judge: {
      type: mongoose.Schema.Types.ObjectId, // Judge assigned to hear the case.
      ref: "User",
      required: true,
    },
    status: {
      type: String, // Current case disposition.
      enum: ["pending", "disposed"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Case", caseSchema);

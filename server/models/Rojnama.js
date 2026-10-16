import mongoose from "mongoose";

const remarkSchema = new mongoose.Schema(
  {
    text: {
      type: String, // Text recorded as a remark on the Rojnama.
      required: true,
    },
    by: {
      type: mongoose.Schema.Types.ObjectId, // User who added the remark.
      ref: "User",
      required: true,
    },
    createdAt: {
      type: Date, // Time at which the remark was added.
      default: Date.now,
    },
  },
  { _id: false },
);

const rojnamaSchema = new mongoose.Schema(
  {
    caseId: {
      type: mongoose.Schema.Types.ObjectId, // Case covered by this Rojnama.
      ref: "Case",
      required: true,
    },
    hearingDate: {
      type: Date, // Date of the hearing recorded in the Rojnama.
    },
    purpose: {
      type: String, // Purpose of the hearing.
    },
    business: {
      type: String, // Business conducted during the hearing.
    },
    orderDirections: {
      type: String, // Orders or directions issued by the court.
    },
    nextHearingDate: {
      type: Date, // Date scheduled for the next hearing.
    },
    status: {
      type: String, // Current review state of the Rojnama.
      enum: ["draft", "submitted", "needs_correction", "approved"],
      default: "draft",
    },
    remarks: {
      type: [remarkSchema], // Review remarks attached to the Rojnama.
      default: [],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId, // User who created the Rojnama.
      ref: "User",
      required: true,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId, // User who approved the Rojnama.
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Rojnama", rojnamaSchema);

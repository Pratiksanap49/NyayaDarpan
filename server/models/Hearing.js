import mongoose from "mongoose";

const hearingSchema = new mongoose.Schema(
  {
    caseId: {
      type: mongoose.Schema.Types.ObjectId, // Case scheduled for this hearing.
      ref: "Case",
      required: true,
    },
    hearingDate: {
      type: Date, // Calendar day of the hearing, stored at its start.
      required: true,
    },
    time: {
      type: String, // Display time for the hearing, such as 10:30 AM.
      required: true,
      trim: true,
    },
    status: {
      type: String, // Current status of the hearing.
      enum: ["Upcoming", "Ongoing", "Scheduled", "Completed"],
      default: "Scheduled",
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Hearing", hearingSchema);

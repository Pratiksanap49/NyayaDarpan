import mongoose from "mongoose";
import Case from "../models/Case.js";
import Rojnama from "../models/Rojnama.js";

const editableFields = [
  "hearingDate",
  "purpose",
  "business",
  "orderDirections",
  "nextHearingDate",
];

// Return whether a case belongs to the authenticated user's court.
const caseIsInUserCourt = (caseRecord, user) =>
  caseRecord && caseRecord.court === user.courtId;

const hasInvalidObjectId = (id) => !mongoose.isValidObjectId(id);

const applyEditableFields = (rojnama, body) => {
  for (const field of editableFields) {
    if (body[field] !== undefined) {
      rojnama[field] = body[field];
    }
  }
};

const invalidImmutableFields = (body) =>
  ["status", "caseId", "createdBy", "remarks"].filter(
    (field) => body[field] !== undefined,
  );

// Create a draft Rojnama for a case in the stenographer's court.
const createRojnama = async (req, res) => {
  try {
    const { caseId } = req.body;

    if (!caseId || hasInvalidObjectId(caseId)) {
      return res.status(400).json({ message: "A valid caseId is required" });
    }

    const caseRecord = await Case.findById(caseId);

    if (!caseIsInUserCourt(caseRecord, req.user)) {
      return res.status(404).json({ message: "Case not found" });
    }

    const rojnama = new Rojnama({
      caseId,
      createdBy: req.user._id,
      status: "draft",
    });
    applyEditableFields(rojnama, req.body);
    await rojnama.save();

    return res.status(201).json(rojnama);
  } catch (error) {
    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({ message: "Invalid Rojnama data" });
    }

    return res.status(500).json({ message: "Failed to create Rojnama" });
  }
};

// Update a creator's draft or correction-needed Rojnama.
const updateRojnama = async (req, res) => {
  try {
    if (hasInvalidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid Rojnama id" });
    }

    const immutableFields = invalidImmutableFields(req.body);

    if (immutableFields.length > 0) {
      return res.status(400).json({
        message: `Cannot update immutable fields: ${immutableFields.join(", ")}`,
      });
    }

    const rojnama = await Rojnama.findById(req.params.id);

    if (!rojnama) {
      return res.status(404).json({ message: "Rojnama not found" });
    }

    if (!rojnama.createdBy.equals(req.user._id)) {
      return res.status(403).json({ message: "Only the creator can edit this Rojnama" });
    }

    if (!["draft", "needs_correction"].includes(rojnama.status)) {
      return res.status(400).json({
        message: "Only draft or needs_correction Rojnamas can be edited",
      });
    }

    applyEditableFields(rojnama, req.body);
    await rojnama.save();

    return res.json(rojnama);
  } catch (error) {
    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({ message: "Invalid Rojnama data" });
    }

    return res.status(500).json({ message: "Failed to update Rojnama" });
  }
};

// Submit a creator's complete draft for review.
const submitRojnama = async (req, res) => {
  try {
    if (hasInvalidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid Rojnama id" });
    }

    const rojnama = await Rojnama.findById(req.params.id);

    if (!rojnama) {
      return res.status(404).json({ message: "Rojnama not found" });
    }

    if (!rojnama.createdBy.equals(req.user._id)) {
      return res.status(403).json({ message: "Only the creator can submit this Rojnama" });
    }

    if (rojnama.status !== "draft") {
      return res.status(400).json({
        message: "Only draft Rojnamas can be submitted",
      });
    }

    const requiredFields = [
      ["hearingDate", rojnama.hearingDate],
      ["purpose", rojnama.purpose],
      ["business", rojnama.business],
      ["orderDirections", rojnama.orderDirections],
    ];
    const missingFields = requiredFields
      .filter(([, value]) => value === undefined || value === null || String(value).trim() === "")
      .map(([field]) => field);

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    rojnama.status = "submitted";
    await rojnama.save();

    return res.json(rojnama);
  } catch (error) {
    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({ message: "Invalid Rojnama data" });
    }

    return res.status(500).json({ message: "Failed to submit Rojnama" });
  }
};

// Return a Rojnama to its creator or an authorized same-court reviewer.
const getRojnama = async (req, res) => {
  try {
    if (hasInvalidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid Rojnama id" });
    }

    const rojnama = await Rojnama.findById(req.params.id)
      .populate("caseId", "_id caseNumber title")
      .lean();

    if (!rojnama) {
      return res.status(404).json({ message: "Rojnama not found" });
    }

    const isCreator = rojnama.createdBy.toString() === req.user._id.toString();
    const isSameCourtReviewer =
      ["clerk", "judge"].includes(req.user.role) &&
      rojnama.caseId &&
      (await Case.exists({
        _id: rojnama.caseId._id,
        court: req.user.courtId,
      }));

    if (!isCreator && !isSameCourtReviewer) {
      return res.status(403).json({ message: "Access denied for this Rojnama" });
    }

    return res.json(rojnama);
  } catch (error) {
    return res.status(500).json({ message: "Failed to load Rojnama" });
  }
};

export { createRojnama, getRojnama, submitRojnama, updateRojnama };

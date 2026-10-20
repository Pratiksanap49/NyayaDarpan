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

// Return the Rojnama filter allowed for the authenticated user's role.
const getRecordsVisibility = (user) => {
  if (user.role === "stenographer") {
    return { createdBy: user._id };
  }

  if (user.role === "clerk") {
    return { status: { $ne: "draft" } };
  }

  return { status: "approved" };
};

const hasInvalidObjectId = (id) => !mongoose.isValidObjectId(id);

// Normalize date input to the server's local start of day.
const toLocalStartOfDay = (value) => {
  if (value === "" || value === null || value === undefined) {
    return value;
  }

  if (typeof value === "string") {
    const dateOnlyMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);

    if (dateOnlyMatch) {
      return new Date(
        Number(dateOnlyMatch[1]),
        Number(dateOnlyMatch[2]) - 1,
        Number(dateOnlyMatch[3]),
      );
    }
  }

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

const applyEditableFields = (rojnama, body) => {
  for (const field of editableFields) {
    if (body[field] !== undefined) {
      rojnama[field] = ["hearingDate", "nextHearingDate"].includes(field)
        ? toLocalStartOfDay(body[field])
        : body[field];
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

// Return the visible Rojnama records for a case in the user's court.
const listCaseRojnamas = async (req, res) => {
  try {
    const { caseId } = req.params;

    if (hasInvalidObjectId(caseId)) {
      return res.status(400).json({ message: "Invalid case id" });
    }

    const caseRecord = await Case.findById(caseId).select(
      "_id caseNumber title caseType court",
    );

    if (!caseIsInUserCourt(caseRecord, req.user)) {
      return res.status(404).json({ message: "Case not found" });
    }

    const records = await Rojnama.find({
      caseId,
      ...getRecordsVisibility(req.user),
    })
      .select("_id hearingDate purpose status nextHearingDate updatedAt")
      .sort({ hearingDate: -1, updatedAt: -1 })
      .lean();

    return res.json({
      case: {
        id: caseRecord._id,
        caseNumber: caseRecord.caseNumber,
        title: caseRecord.title,
        caseType: caseRecord.caseType,
      },
      rojnamas: records.map(
        ({
          _id,
          hearingDate,
          purpose,
          status,
          nextHearingDate,
          updatedAt,
        }) => ({
          id: _id,
          hearingDate,
          purpose,
          status,
          nextHearingDate,
          updatedAt,
        }),
      ),
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to load case Rojnamas" });
  }
};

// Return submitted Rojnamas for clerk review, oldest first.
const listPendingRojnamas = async (req, res) => {
  try {
    const records = await Rojnama.find({ status: "submitted" })
      .populate({
        path: "caseId",
        select: "_id caseNumber title",
        match: { court: req.user.courtId },
      })
      .sort({ createdAt: 1 })
      .lean();

    return res.json(records.filter((record) => record.caseId));
  } catch (error) {
    return res.status(500).json({ message: "Failed to load pending Rojnamas" });
  }
};

// Add a clerk's correction remark to a submitted Rojnama.
const addRemark = async (req, res) => {
  try {
    if (hasInvalidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid Rojnama id" });
    }

    const text = typeof req.body.text === "string" ? req.body.text.trim() : "";

    if (!text) {
      return res.status(400).json({ message: "Remark text is required" });
    }

    const rojnama = await Rojnama.findById(req.params.id);

    if (!rojnama) {
      return res.status(404).json({ message: "Rojnama not found" });
    }

    if (rojnama.status !== "submitted") {
      return res.status(400).json({
        message: "Remarks can only be added to submitted Rojnamas",
      });
    }

    rojnama.remarks.push({
      text,
      author: req.user._id,
      createdAt: new Date(),
    });
    rojnama.status = "needs_correction";
    await rojnama.save();

    return res.json(rojnama);
  } catch (error) {
    return res.status(500).json({ message: "Failed to add Rojnama remark" });
  }
};

// Approve a submitted Rojnama as a clerk.
const approveRojnama = async (req, res) => {
  try {
    if (hasInvalidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid Rojnama id" });
    }

    const rojnama = await Rojnama.findById(req.params.id);

    if (!rojnama) {
      return res.status(404).json({ message: "Rojnama not found" });
    }

    if (rojnama.status !== "submitted") {
      return res.status(400).json({
        message: "Only submitted Rojnamas can be approved",
      });
    }

    rojnama.status = "approved";
    rojnama.approvedBy = req.user._id;
    await rojnama.save();

    return res.json(rojnama);
  } catch (error) {
    return res.status(500).json({ message: "Failed to approve Rojnama" });
  }
};

export {
  addRemark,
  approveRojnama,
  createRojnama,
  getRojnama,
  listPendingRojnamas,
  listCaseRojnamas,
  submitRojnama,
  updateRojnama,
};

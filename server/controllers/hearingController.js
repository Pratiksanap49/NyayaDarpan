import Case from "../models/Case.js";
import Hearing from "../models/Hearing.js";

// Return the cases visible to the authenticated user.
const getScopedCases = (user) => {
  const filter =
    user.role === "judge" ? { judge: user._id } : { court: user.courtId };

  return Case.find(filter).select(
    "_id caseNumber title caseType plaintiff defendant status",
  );
};

// Convert a display time such as "10:30 AM" into minutes after midnight.
const timeToMinutes = (time) => {
  const match = time.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);

  if (!match) {
    return Number.MAX_SAFE_INTEGER;
  }

  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const period = match[3].toUpperCase();

  if (hours === 12) {
    hours = 0;
  }

  if (period === "PM") {
    hours += 12;
  }

  return hours * 60 + minutes;
};

// Return the local start of today and the exclusive start of tomorrow.
const getTodayRange = () => {
  const now = new Date();
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );
  const startOfTomorrow = new Date(startOfToday);
  startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);

  return { startOfToday, startOfTomorrow };
};

// Return today's hearings in chronological display-time order.
const getTodaySchedule = async (req, res) => {
  try {
    const [scopedCases, { startOfToday, startOfTomorrow }] = await Promise.all([
      getScopedCases(req.user),
      Promise.resolve(getTodayRange()),
    ]);
    const caseIds = scopedCases.map(({ _id }) => _id);
    const hearings = await Hearing.find({
      caseId: { $in: caseIds },
      hearingDate: { $gte: startOfToday, $lt: startOfTomorrow },
    })
      .populate(
        "caseId",
        "_id caseNumber title caseType plaintiff defendant",
      )
      .lean();

    hearings.sort((first, second) =>
      timeToMinutes(first.time) - timeToMinutes(second.time),
    );

    return res.json(
      hearings.map(({ _id, time, status, caseId }) => ({
        id: _id,
        time,
        status,
        case: {
          id: caseId._id,
          caseNumber: caseId.caseNumber,
          title: caseId.title,
          caseType: caseId.caseType,
          plaintiff: caseId.plaintiff,
          defendant: caseId.defendant,
        },
      })),
    );
  } catch (error) {
    return res.status(500).json({ message: "Failed to load today's schedule" });
  }
};

// Return today's hearing status counts and the user's pending-case count.
const getTodayStats = async (req, res) => {
  try {
    const [scopedCases, { startOfToday, startOfTomorrow }] = await Promise.all([
      getScopedCases(req.user),
      Promise.resolve(getTodayRange()),
    ]);
    const caseIds = scopedCases.map(({ _id }) => _id);
    const [hearings, pendingCases] = await Promise.all([
      Hearing.find({
        caseId: { $in: caseIds },
        hearingDate: { $gte: startOfToday, $lt: startOfTomorrow },
      })
        .select("status")
        .lean(),
      Promise.resolve(
        scopedCases.filter(({ status }) => status === "pending").length,
      ),
    ]);

    const stats = {
      totalToday: hearings.length,
      completed: hearings.filter(({ status }) => status === "Completed").length,
      ongoing: hearings.filter(({ status }) => status === "Ongoing").length,
      upcoming: hearings.filter(({ status }) => status === "Upcoming").length,
      scheduled: hearings.filter(({ status }) => status === "Scheduled").length,
      pendingCases,
    };

    return res.json(stats);
  } catch (error) {
    return res.status(500).json({ message: "Failed to load today's stats" });
  }
};

export { getTodaySchedule, getTodayStats };

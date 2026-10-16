import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "./config/db.js";
import Case from "./models/Case.js";
import Hearing from "./models/Hearing.js";
import User from "./models/User.js";

dotenv.config();

// Development-only identities; these will later come from the High Court.
const DEV_COURT_ID = "100001";
const DEV_CLERK_ROLE_ID = "200001";
const DEV_JUDGE_ROLE_ID = "300001";
const DEV_STENOGRAPHER_ROLE_ID = "400001";
const DEV_PASSWORD = "password123";

const startOfDay = (date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

const formatDate = (date) =>
  [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");

const seed = async () => {
  try {
    await connectDB();
    // Clear dependent data first so every seed run recreates exactly the sample set.
    await Hearing.deleteMany({});
    await Case.deleteMany({});
    await User.deleteMany({});

    const users = await User.create([
      {
        name: "Clerk One",
        role: "clerk",
        courtId: DEV_COURT_ID,
        roleId: DEV_CLERK_ROLE_ID,
        password: DEV_PASSWORD,
      },
      {
        name: "Judge Sharma",
        role: "judge",
        courtId: DEV_COURT_ID,
        roleId: DEV_JUDGE_ROLE_ID,
        password: DEV_PASSWORD,
      },
      {
        name: "Steno One",
        role: "stenographer",
        courtId: DEV_COURT_ID,
        roleId: DEV_STENOGRAPHER_ROLE_ID,
        password: DEV_PASSWORD,
      },
    ]);

    const judge = users.find(({ role }) => role === "judge");
    const cases = await Case.create([
      {
        caseNumber: "CS/101/2026",
        title: "Dispute over ancestral agricultural land",
        caseType: "Civil",
        plaintiff: "Anita Devi",
        defendant: "Rajesh Kumar",
        court: DEV_COURT_ID,
        judge: judge._id,
      },
      {
        caseNumber: "CR/202/2026",
        title: "State v. Mohan Lal for alleged house trespass",
        caseType: "Criminal",
        plaintiff: "State of Maharashtra",
        defendant: "Mohan Lal",
        court: DEV_COURT_ID,
        judge: judge._id,
      },
      {
        caseNumber: "FA/303/2026",
        title: "Petition for dissolution of marriage",
        caseType: "Family",
        plaintiff: "Priya Sharma",
        defendant: "Amit Sharma",
        court: DEV_COURT_ID,
        judge: judge._id,
      },
      {
        caseNumber: "WP/404/2026",
        title: "Challenge to municipal demolition notice",
        caseType: "Writ",
        plaintiff: "Narmada Traders",
        defendant: "Municipal Corporation of Indore",
        court: DEV_COURT_ID,
        judge: judge._id,
      },
      {
        caseNumber: "CS/105/2026",
        title: "Recovery of unpaid construction contract dues",
        caseType: "Civil",
        plaintiff: "Mehta Infrastructure Pvt. Ltd.",
        defendant: "R.K. Builders",
        court: DEV_COURT_ID,
        judge: judge._id,
      },
      {
        caseNumber: "CR/206/2026",
        title: "State v. Farah Begum under theft allegations",
        caseType: "Criminal",
        plaintiff: "State of Uttar Pradesh",
        defendant: "Farah Begum",
        court: DEV_COURT_ID,
        judge: judge._id,
      },
      {
        caseNumber: "FA/307/2026",
        title: "Petition for maintenance under family law",
        caseType: "Family",
        plaintiff: "Kavita Singh",
        defendant: "Suresh Singh",
        court: DEV_COURT_ID,
        judge: judge._id,
      },
      {
        caseNumber: "WP/408/2026",
        title: "Challenge to suspension of government employee",
        caseType: "Writ",
        plaintiff: "Vikram Patel",
        defendant: "State of Gujarat",
        court: DEV_COURT_ID,
        judge: judge._id,
        status: "disposed",
      },
    ]);

    const today = startOfDay(new Date());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const pendingCases = cases.filter(({ status }) => status === "pending");
    const hearings = await Hearing.create([
      {
        caseId: pendingCases[0]._id,
        hearingDate: today,
        time: "10:00 AM",
        status: "Completed",
      },
      {
        caseId: pendingCases[1]._id,
        hearingDate: today,
        time: "11:00 AM",
        status: "Ongoing",
      },
      {
        caseId: pendingCases[2]._id,
        hearingDate: today,
        time: "12:30 PM",
        status: "Upcoming",
      },
      {
        caseId: pendingCases[3]._id,
        hearingDate: today,
        time: "2:00 PM",
        status: "Upcoming",
      },
      {
        caseId: pendingCases[4]._id,
        hearingDate: today,
        time: "3:30 PM",
        status: "Scheduled",
      },
      {
        caseId: pendingCases[5]._id,
        hearingDate: today,
        time: "1:30 PM",
        status: "Scheduled",
      },
      {
        caseId: pendingCases[0]._id,
        hearingDate: tomorrow,
        time: "10:30 AM",
        status: "Scheduled",
      },
      {
        caseId: pendingCases[1]._id,
        hearingDate: tomorrow,
        time: "2:30 PM",
        status: "Scheduled",
      },
    ]);

    const caseById = new Map(
      cases.map((caseRecord) => [caseRecord._id.toString(), caseRecord]),
    );
    console.log("Seed summary:", {
      users: users.length,
      cases: cases.length,
      hearings: hearings.length,
      roleIds: {
        clerk: DEV_CLERK_ROLE_ID,
        judge: DEV_JUDGE_ROLE_ID,
        stenographer: DEV_STENOGRAPHER_ROLE_ID,
      },
    });
    console.table(
      hearings.map(({ caseId, hearingDate, time, status }) => ({
        caseNumber: caseById.get(caseId.toString()).caseNumber,
        date: formatDate(hearingDate),
        time,
        status,
      })),
    );
    console.log('Development password for all users: "password123"');
  } catch (error) {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

seed();

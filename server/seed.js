import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "./config/db.js";
import Case from "./models/Case.js";
import Hearing from "./models/Hearing.js";
import Rojnama from "./models/Rojnama.js";
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
    await Rojnama.deleteMany({});
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
    const clerk = users.find(({ role }) => role === "clerk");
    const stenographer = users.find(({ role }) => role === "stenographer");
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

    const rojnamaDates = [
      new Date(today.getFullYear(), today.getMonth(), today.getDate() - 4),
      new Date(today.getFullYear(), today.getMonth(), today.getDate() - 3),
      new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2),
      new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1),
    ];
    await Rojnama.create([
      {
        caseId: pendingCases[0]._id,
        hearingDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 4),
        purpose: "Evidence recording and examination of the plaintiff witness.",
        business: "Plaintiff witness was present and affidavit was taken on record.",
        orderDirections: "List the matter for cross-examination of the plaintiff witness.",
        nextHearingDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7),
        status: "submitted",
        createdBy: stenographer._id,
        createdAt: rojnamaDates[0],
      },
      {
        caseId: pendingCases[1]._id,
        hearingDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 3),
        purpose: "Consideration of the charge-sheet and submissions of both sides.",
        business: "The prosecutor and defence counsel addressed the court on the charge-sheet.",
        orderDirections: "Defence counsel shall file written submissions before the next date.",
        nextHearingDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 10),
        status: "submitted",
        createdBy: stenographer._id,
        createdAt: rojnamaDates[1],
      },
      {
        caseId: pendingCases[2]._id,
        hearingDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2),
        purpose: "Hearing on the interim maintenance application.",
        business: "Counsel for both parties completed oral submissions on interim relief.",
        orderDirections: "Provide a copy of the income affidavit to the opposite party.",
        nextHearingDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 14),
        status: "needs_correction",
        remarks: [
          {
            text: "Please record the exhibit numbers for the income affidavits.",
            author: clerk._id,
            createdAt: rojnamaDates[2],
          },
        ],
        revisions: [
          {
            version: 1,
            hearingDate: new Date(
              today.getFullYear(),
              today.getMonth(),
              today.getDate() - 2,
            ),
            purpose: "Hearing on the interim maintenance application.",
            business:
              "Counsel for both parties completed oral submissions on interim relief.",
            orderDirections:
              "Provide a copy of the income affidavit to the opposite party.",
            nextHearingDate: new Date(
              today.getFullYear(),
              today.getMonth(),
              today.getDate() + 14,
            ),
            returnedRemark:
              "Please record the exhibit numbers for the income affidavits.",
            savedAt: rojnamaDates[2],
          },
        ],
        createdBy: stenographer._id,
        createdAt: rojnamaDates[2],
      },
      {
        caseId: pendingCases[3]._id,
        hearingDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1),
        purpose: "Hearing on the petition challenging the demolition notice.",
        business: "The municipal corporation produced the demolition inspection report.",
        orderDirections: "The respondent shall file a reply with supporting records.",
        nextHearingDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 21),
        status: "approved",
        createdBy: stenographer._id,
        approvedBy: clerk._id,
        createdAt: rojnamaDates[3],
      },
    ]);

    const caseById = new Map(
      cases.map((caseRecord) => [caseRecord._id.toString(), caseRecord]),
    );
    console.log("Seed summary:", {
      users: users.length,
      cases: cases.length,
      hearings: hearings.length,
      rojnamas: 4,
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

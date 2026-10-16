import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "./config/db.js";
import Case from "./models/Case.js";
import User from "./models/User.js";

dotenv.config();

const randomSixDigitNumber = () =>
  String(Math.floor(100000 + Math.random() * 900000));

const createUniqueRoleIds = (count) => {
  const roleIds = new Set();

  while (roleIds.size < count) {
    roleIds.add(randomSixDigitNumber());
  }

  return [...roleIds];
};

const seed = async () => {
  try {
    await connectDB();
    // Clear cases first so every seed run recreates exactly the sample set.
    await Case.deleteMany({});
    await User.deleteMany({});

    const [clerkRoleId, judgeRoleId, stenographerRoleId] =
      createUniqueRoleIds(3);
    const courtId = randomSixDigitNumber();
    const password = "password123";

    const users = await User.create([
      {
        name: "Clerk One",
        role: "clerk",
        courtId,
        roleId: clerkRoleId,
        password,
      },
      {
        name: "Judge Sharma",
        role: "judge",
        courtId,
        roleId: judgeRoleId,
        password,
      },
      {
        name: "Steno One",
        role: "stenographer",
        courtId,
        roleId: stenographerRoleId,
        password,
      },
    ]);

    const judge = users.find(({ role }) => role === "judge");
    await Case.create([
      {
        caseNumber: "CS/101/2026",
        title: "Dispute over ancestral agricultural land",
        caseType: "Civil",
        plaintiff: "Anita Devi",
        defendant: "Rajesh Kumar",
        court: courtId,
        judge: judge._id,
      },
      {
        caseNumber: "CR/202/2026",
        title: "State v. Mohan Lal for alleged house trespass",
        caseType: "Criminal",
        plaintiff: "State of Maharashtra",
        defendant: "Mohan Lal",
        court: courtId,
        judge: judge._id,
      },
      {
        caseNumber: "FA/303/2026",
        title: "Petition for dissolution of marriage",
        caseType: "Family",
        plaintiff: "Priya Sharma",
        defendant: "Amit Sharma",
        court: courtId,
        judge: judge._id,
      },
      {
        caseNumber: "WP/404/2026",
        title: "Challenge to municipal demolition notice",
        caseType: "Writ",
        plaintiff: "Narmada Traders",
        defendant: "Municipal Corporation of Indore",
        court: courtId,
        judge: judge._id,
      },
      {
        caseNumber: "CS/105/2026",
        title: "Recovery of unpaid construction contract dues",
        caseType: "Civil",
        plaintiff: "Mehta Infrastructure Pvt. Ltd.",
        defendant: "R.K. Builders",
        court: courtId,
        judge: judge._id,
      },
      {
        caseNumber: "CR/206/2026",
        title: "State v. Farah Begum under theft allegations",
        caseType: "Criminal",
        plaintiff: "State of Uttar Pradesh",
        defendant: "Farah Begum",
        court: courtId,
        judge: judge._id,
      },
      {
        caseNumber: "FA/307/2026",
        title: "Petition for maintenance under family law",
        caseType: "Family",
        plaintiff: "Kavita Singh",
        defendant: "Suresh Singh",
        court: courtId,
        judge: judge._id,
      },
      {
        caseNumber: "WP/408/2026",
        title: "Challenge to suspension of government employee",
        caseType: "Writ",
        plaintiff: "Vikram Patel",
        defendant: "State of Gujarat",
        court: courtId,
        judge: judge._id,
        status: "disposed",
      },
    ]);

    console.table(
      users.map(({ name, role, roleId, courtId: userCourtId }) => ({
        name,
        role,
        roleId,
        courtId: userCourtId,
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

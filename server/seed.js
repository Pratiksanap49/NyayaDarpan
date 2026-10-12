import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "./config/db.js";
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

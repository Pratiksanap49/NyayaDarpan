import jwt from "jsonwebtoken";
import User from "../models/User.js";

const login = async (req, res) => {
  try {
    const { role, roleId, password } = req.body;

    if (!role || !roleId || !password) {
      return res.status(400).json({
        message: "Role, ID and password are required",
      });
    }

    const user = await User.findOne({ role, roleId });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        courtId: user.courtId,
        roleId: user.roleId,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
    });
  }
};

const getMe = (req, res) => {
  res.json(req.user);
};

export { getMe, login };

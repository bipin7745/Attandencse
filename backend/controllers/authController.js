import User from "../models/User.js";
import bcrypt from "bcryptjs";
import IpAddress from "../models/IPAddress.js";
import { generateToken } from "../utils/generateToken.js";
import { getClientIp } from "../utils/getClientIp.js";
import { generatePassword } from "../utils/generatePassword.js";
// Register user
export const registerUser = async (req, res) => {
  try {
    const { username, email, password, role, autoPassword } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // ✅ password sirf backend me generate hoga
    const finalPassword = autoPassword ? "" : password;

    const hashedPassword = await bcrypt.hash(finalPassword, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role,
    });

    return res.status(201).json({
      message: "User registered successfully",
      generatedPassword: autoPassword ? finalPassword : null,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};



// Login user

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check user existence
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: " Email Invalid" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: " Password Invalid" });
    }
   

    const clientIp = await getClientIp(req);
    console.log("User Login IP:", clientIp);

    
    if (user.role !== "admin")
    {
      const ipRecords = await IpAddress.find();
      const authorizedIP = ipRecords.some((record) => record.ip === clientIp);

      if (!authorizedIP)
      {
        return res
          .status(400)
          .json({ message: "Email and Password Invalid" });
      }
    }
 
    const token = generateToken(user._id);
    return res.status(200).json({
      message: "Login Successfully",
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        token,
      },
      ip: clientIp,
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// Get profile (Only id, username, email)
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("username email");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({
      id: user._id,
      username: user.username,
      email: user.email,
    });
  } catch (error) {
    console.error("Profile error:", error);
    return res.status(500).json({ message: error.message });
  }
};

/* GET ALL USERS */
export const getNonAdminUsers = async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: "admin" } }).select(
      "-password"
    );
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* UPDATE USER */
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedUser = await User.findByIdAndUpdate(id, req.body, {
      new: true,
    }).select("-password");

    res.json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* DELETE USER */
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* Chanage Password*/
export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Verify old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: "Old password is incorrect" });

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (err) {
    console.error("Change Password Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

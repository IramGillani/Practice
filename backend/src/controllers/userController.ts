import { Request, Response } from "express";
import User from "../models/User";
import fs from "fs/promises";

export const updateInfo = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      if (req.file) {
        await fs.unlink(req.file.path);
      }
      return res.status(404).json({ message: "User not found" });
    }

    const { name, currentPassword, newPassword } = req.body;

    if (currentPassword && newPassword) {
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch)
        return res.status(400).json({ message: "Current password incorrect" });
      user.password = newPassword;
    }
    if (name) user.name = name;

    if (req.file) {
      user.profile = `/profile/${req.file.filename}`;
    }
    await user.save();

    return res.status(200).json({
      message: "Profile updated successfully",
      user: user,
    });
  } catch (err) {
    console.log("update user info error", err);
    return res.status(500).json({ message: "Error updating user info" });
  }
};

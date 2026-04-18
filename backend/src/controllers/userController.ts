import { Request, Response } from "express";
import User from "../models/User";

export const updatePassword = async (req: Request, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Both fields are required" });
    }

    const user = await User.findById(req.user._id);

    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch)
      return res.status(400).json({ message: "Current password incorrect" });

    user.password = newPassword;
    await user.save();
    console.log("The user with updated password", user);

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error updating password" });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const updates = { ...req.body };
    console.log("Request", req.body);

    if (req.file) {
      updates.profile = `/public/${req.file.filename}`;
    }
    console.log("The updates", updates);

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true },
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const userResponse = updatedUser.toObject({ virtuals: true });

    console.log(" updated user", updatedUser);
    res.json(userResponse);
    console.log("userResponse", userResponse);
  } catch (err) {
    console.error("Update Error:", err);
    res.status(500).json({ message: "Error updating profile" });
  }
};

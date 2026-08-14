import * as UserService from "../services/userService";
import { asyncHandler } from "../utils/asyncHandler";

export const updateInfo = asyncHandler(async (req, res) => {
  const user = await UserService.updateInfo({
    userId: req.user._id,
    name: req.body.name,
    currentPassword: req.body.currentPassword,
    newPassword: req.body.newPassword,
    file: req.file,
  });

  return res.status(200).json({
    message: "Profile updated successfully",
    user,
  });
});

export const getProfile = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const userProfile = await UserService.getUser(userId);
  console.log("the user we got on update", userProfile);

  res.status(200).json(userProfile);
});

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

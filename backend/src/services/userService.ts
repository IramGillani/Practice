import * as userRepo from "../repositories/userRepo";
import { AppError } from "../utils/customErrorHandler";
import { UpdateInfoProps } from "../types";
export const updateInfo = async ({
  userId,
  name,
  currentPassword,
  newPassword,
  file,
}: UpdateInfoProps) => {
  const user = await userRepo.findById(userId);

  if (!user) {
    if (file) {
      await userRepo.deleteFile(file.path);
    }

    throw new AppError(404, "User not found");
  }

  try {
    if (currentPassword || newPassword) {
      if (!currentPassword || !newPassword) {
        throw new AppError(
          400,
          "Both current password and new password are required.",
        );
      }

      const isMatch = await user.comparePassword(currentPassword);

      if (!isMatch) {
        throw new AppError(400, "Current password incorrect");
      }

      user.password = newPassword;
    }

    if (name?.trim()) {
      user.name = name.trim();
    }

    if (file) {
      user.profile = `/profile/${file.filename}`;
    }

    await user.save();

    return user;
  } catch (error) {
    if (file) {
      await userRepo.deleteFile(file.path);
    }

    throw error;
  }
};

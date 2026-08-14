import * as UserRepo from "../repositories/userRepo";
import { AppError } from "../utils/customErrorHandler";
import { UpdateInfoProps } from "../types";
export const updateInfo = async ({
  userId,
  name,
  currentPassword,
  newPassword,
  file,
}: UpdateInfoProps) => {
  const user = await UserRepo.findByIdBasic(userId);

  if (!user) {
    if (file) {
      await UserRepo.deleteFile(file.path);
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
      await UserRepo.deleteFile(file.path);
    }

    throw error;
  }
};

export const getUser = async (userId: string) => {
  const user = await UserRepo.findById(userId);

  if (!user) {
    throw new AppError(404, "User not found");
  }
  return user;
};

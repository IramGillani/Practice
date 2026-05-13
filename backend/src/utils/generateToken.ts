import jwt from "jsonwebtoken";

export const generateTokens = (_id: string, role: string) => {
  const accessSecret = process.env.JWT_ACCESS_SECRET!;
  const refreshSecret = process.env.JWT_REFRESH_SECRET!;

  return {
    accessToken: jwt.sign({ _id, role }, accessSecret, { expiresIn: "7d" }),
    refreshToken: jwt.sign({ _id }, refreshSecret, { expiresIn: "30d" }),
  };
};

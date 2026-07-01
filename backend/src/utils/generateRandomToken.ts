import crypto from "crypto";

export const cryptoUtil = {
  generateRandomToken: (): string => {
    return crypto.randomBytes(32).toString("hex");
  },

  hashToken: (token: string): string => {
    return crypto.createHash("sha256").update(token).digest("hex");
  },
};

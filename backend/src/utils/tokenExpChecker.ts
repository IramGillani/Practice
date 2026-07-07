export const isTokenExpired = (
  createdAt: Date,
  expiryMs: number
) => Date.now() - createdAt.getTime() > expiryMs;
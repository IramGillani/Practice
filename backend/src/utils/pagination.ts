import { PaginationParams } from "../types";

export const getPaginationParams = (
  queryPage?: unknown,
  queryLimit?: unknown,
): PaginationParams => {
  const page = Math.max(Number(queryPage) || 1, 1);
  const limit = Math.max(Number(queryLimit) || 10, 1);
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

export const formatPagination = (
  currentPage: number,
  limit: number,
  totalItems: number,
) => ({
  currentPage,
  totalPages: Math.ceil(totalItems / limit),
  totalItems,
});

export interface PaginatedListProps {
  page: number;
  limit: number;
  search: string;
  skip: number;
}
export interface PaginationParams {
  page: number;
  limit: number;
  skip: number;
}

export interface PaginationResult {
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

import type { Pagination } from "@/types";

export const PaginationControls = ({
  pagination,
  onPageChange,
}: {
  pagination: Pagination;
  onPageChange: (newPage: number) => void;
}) => (
  <div className="flex justify-end items-center gap-2 p-4">
    <button
      disabled={pagination.currentPage === 1}
      onClick={() => onPageChange(pagination.currentPage - 1)}
      className="px-3 py-1 border rounded disabled:opacity-50"
    >
      Prev
    </button>

    <span className="text-sm">
      Page {pagination.currentPage} of {pagination.totalPages}
    </span>

    <button
      disabled={pagination.currentPage === pagination.totalPages}
      onClick={() => onPageChange(pagination.currentPage + 1)}
      className="px-3 py-1 border rounded disabled:opacity-50"
    >
      Next
    </button>
  </div>
);

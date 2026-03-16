interface PaginationProps {
  page: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, totalPages, hasNext, hasPrev, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="pagination">
      <button
        className="page-button"
        disabled={!hasPrev}
        onClick={() => onPageChange(page - 1)}
      >
        &larr; Previous
      </button>
      <span className="page-info">
        Page {page} of {totalPages}
      </span>
      <button
        className="page-button"
        disabled={!hasNext}
        onClick={() => onPageChange(page + 1)}
      >
        Next &rarr;
      </button>
    </div>
  );
}

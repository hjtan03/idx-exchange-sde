import './Pagination.css';

// Generates the page-number list shown in the pagination bar, collapsing long
// ranges with an ellipsis so the control stays a fixed, readable width even at
// thousands of pages. There are four cases:
//   1. totalPages <= 7 — short enough to show every page number, no ellipsis needed
//   2. currentPage near the start (<= 4) — show pages 1-5, then "...", then the last page
//   3. currentPage near the end (>= totalPages - 3) — mirror image of case 2
//   4. currentPage in the middle — show first page, "...", a small window around
//      the current page, "...", and the last page
// The thresholds (4, totalPages - 3) are chosen so the "middle" case's window
// (currentPage - 1 to currentPage + 1, 3 numbers) plus both ellipses and both end
// pages always adds up to a consistent 7 visible items — this is also the exact
// logic responsible for a duplicate-last-page bug if the boundary conditions are
// off by one, so any change here should be re-tested against pages near both ends.
export function getPageNumbers(currentPage, totalPages) {
  const pages = [];

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
    return pages;
  }

  if (currentPage <= 4) {
    for (let i = 1; i <= 5; i++) pages.push(i);
    pages.push('...');
    pages.push(totalPages);
    return pages;
  }

  if (currentPage >= totalPages - 3) {
    pages.push(1);
    pages.push('...');
    for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
    return pages;
  }

  pages.push(1);
  pages.push('...');
  for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
  pages.push('...');
  pages.push(totalPages);
  return pages;
}

function Pagination({ currentPage, totalItems, itemsPerPage, onPageChange }) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages <= 1) return null;

  const pageNumbers = getPageNumbers(currentPage, totalPages);

  return (
    <div className="pagination">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </button>

      {pageNumbers.map((num, idx) =>
        num === '...' ? (
          <span key={`ellipsis-${idx}`}>...</span>
        ) : (
          <button
            key={num}
            onClick={() => onPageChange(num)}
            className={num === currentPage ? 'active' : ''}
          >
            {num}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
}

export default Pagination;
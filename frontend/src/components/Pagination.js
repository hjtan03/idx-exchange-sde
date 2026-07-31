import './Pagination.css';

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
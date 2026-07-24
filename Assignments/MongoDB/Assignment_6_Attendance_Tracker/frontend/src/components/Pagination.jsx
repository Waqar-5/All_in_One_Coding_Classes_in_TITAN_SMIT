import React from 'react';

/**
 * Simple, reusable pagination control.
 * Shows first/prev, numbered pages (windowed around current), next/last.
 */
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = [];
  const windowSize = 1;
  const start = Math.max(1, currentPage - windowSize);
  const end = Math.min(totalPages, currentPage + windowSize);

  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <nav aria-label="Attendance pagination" className="no-print d-flex justify-content-center mt-4">
      <ul className="pagination mb-0">
        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
          <button className="page-link" onClick={() => onPageChange(1)}>
            «
          </button>
        </li>
        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
          <button className="page-link" onClick={() => onPageChange(currentPage - 1)}>
            ‹
          </button>
        </li>

        {start > 1 && <li className="page-item disabled"><span className="page-link">…</span></li>}

        {pages.map((p) => (
          <li key={p} className={`page-item ${p === currentPage ? 'active' : ''}`}>
            <button className="page-link" onClick={() => onPageChange(p)}>
              {p}
            </button>
          </li>
        ))}

        {end < totalPages && <li className="page-item disabled"><span className="page-link">…</span></li>}

        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
          <button className="page-link" onClick={() => onPageChange(currentPage + 1)}>
            ›
          </button>
        </li>
        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
          <button className="page-link" onClick={() => onPageChange(totalPages)}>
            »
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;

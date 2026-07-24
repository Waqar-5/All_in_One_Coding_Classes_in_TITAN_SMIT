import React from 'react';
import { FaSearch, FaFilter, FaFilePdf, FaFileExcel, FaPrint, FaTimes } from 'react-icons/fa';

/**
 * Toolbar containing live search, status filter, date filter and
 * export/print actions for the attendance table.
 */
const FilterBar = ({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  dateFilter,
  onDateFilterChange,
  onClearFilters,
  onExportPDF,
  onExportExcel,
  onPrint,
}) => {
  const hasActiveFilters = search || statusFilter || dateFilter;

  return (
    <div className="glass-panel filter-bar mb-4 no-print">
      <div className="row g-3 align-items-end">
        <div className="col-12 col-md-4">
          <label className="form-label small text-uppercase fw-semibold" style={{ color: 'var(--text-secondary)' }}>
            Live Search
          </label>
          <div className="search-input-wrap">
            <FaSearch className="search-icon" />
            <input
              type="text"
              className="form-control"
              placeholder="Search by student name..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>

        <div className="col-6 col-md-2">
          <label className="form-label small text-uppercase fw-semibold" style={{ color: 'var(--text-secondary)' }}>
            <FaFilter className="me-1" /> Status
          </label>
          <select
            className="form-select"
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
          >
            <option value="">All</option>
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
          </select>
        </div>

        <div className="col-6 col-md-3">
          <label className="form-label small text-uppercase fw-semibold" style={{ color: 'var(--text-secondary)' }}>
            Filter by Date
          </label>
          <input
            type="date"
            className="form-control"
            value={dateFilter}
            onChange={(e) => onDateFilterChange(e.target.value)}
          />
        </div>

        <div className="col-12 col-md-3">
          <div className="d-flex flex-wrap gap-2 justify-content-md-end">
            {hasActiveFilters && (
              <button className="btn btn-outline-soft btn-sm" onClick={onClearFilters} title="Clear filters">
                <FaTimes className="me-1" /> Clear
              </button>
            )}
            <button className="btn btn-outline-soft btn-sm" onClick={onExportPDF} title="Export to PDF">
              <FaFilePdf className="me-1" /> PDF
            </button>
            <button className="btn btn-outline-soft btn-sm" onClick={onExportExcel} title="Export to Excel">
              <FaFileExcel className="me-1" /> Excel
            </button>
            <button className="btn btn-outline-soft btn-sm" onClick={onPrint} title="Print attendance">
              <FaPrint className="me-1" /> Print
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;

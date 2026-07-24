import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEdit, FaTrash, FaCheckCircle, FaTimesCircle, FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import EmptyState from './EmptyState.jsx';

/**
 * Renders the sortable attendance table with status badges and
 * edit/delete row actions. Sorting state (sortBy/order) is controlled
 * by the parent so it can be sent to the backend as query params.
 */
const AttendanceTable = ({ records, sortBy, order, onSort, onEdit, onDelete }) => {
  const getInitials = (name = '') =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

  const renderSortIcon = (field) => {
    if (sortBy !== field) return <FaSort className="ms-1 opacity-50" size={12} />;
    return order === 'asc' ? <FaSortUp className="ms-1" size={12} /> : <FaSortDown className="ms-1" size={12} />;
  };

  const formatDate = (isoDate) => {
    if (!isoDate) return '-';
    const d = new Date(isoDate);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const formatDateTime = (isoDate) => {
    if (!isoDate) return '-';
    const d = new Date(isoDate);
    return d.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!records || records.length === 0) {
    return (
      <div className="glass-panel table-card">
        <EmptyState />
      </div>
    );
  }

  return (
    <div className="glass-panel table-card p-0">
      <div className="table-responsive">
        <table className="table attendance-table mb-0" id="attendance-print-table">
          <thead>
            <tr>
              <th onClick={() => onSort('studentName')}>
                Student Name {renderSortIcon('studentName')}
              </th>
              <th onClick={() => onSort('date')}>Date {renderSortIcon('date')}</th>
              <th onClick={() => onSort('status')}>Status {renderSortIcon('status')}</th>
              <th onClick={() => onSort('createdAt')}>Created At {renderSortIcon('createdAt')}</th>
              <th className="no-print">Actions</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {records.map((record) => (
                <motion.tr
                  key={record._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <td data-label="Student Name">
                    <span className="student-avatar">{getInitials(record.studentName)}</span>
                    <span className="fw-semibold">{record.studentName}</span>
                  </td>
                  <td data-label="Date">{formatDate(record.date)}</td>
                  <td data-label="Status">
                    {record.status === 'Present' ? (
                      <span className="badge-status badge-present">
                        <FaCheckCircle /> Present
                      </span>
                    ) : (
                      <span className="badge-status badge-absent">
                        <FaTimesCircle /> Absent
                      </span>
                    )}
                  </td>
                  <td data-label="Created At">{formatDateTime(record.createdAt)}</td>
                  <td data-label="Actions" className="no-print">
                    <div className="d-flex gap-2">
                      <button
                        className="btn-icon-action btn-icon-edit"
                        onClick={() => onEdit(record)}
                        title="Edit record"
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="btn-icon-action btn-icon-delete"
                        onClick={() => onDelete(record)}
                        title="Delete record"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceTable;

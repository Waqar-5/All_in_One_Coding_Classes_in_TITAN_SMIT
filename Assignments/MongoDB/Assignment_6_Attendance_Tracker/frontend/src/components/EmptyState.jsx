import React from 'react';
import { FaInbox } from 'react-icons/fa';

/**
 * Displayed when there are no attendance records matching the current
 * search/filter criteria (or none exist yet).
 */
const EmptyState = ({
  title = 'No attendance records found',
  subtitle = 'Try adjusting your search or filters, or add a new attendance record.',
}) => {
  return (
    <div className="empty-state">
      <div className="empty-icon">
        <FaInbox />
      </div>
      <h5 className="mb-2" style={{ color: 'var(--text-primary)' }}>
        {title}
      </h5>
      <p className="mb-0">{subtitle}</p>
    </div>
  );
};

export default EmptyState;

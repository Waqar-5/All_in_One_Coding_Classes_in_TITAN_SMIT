import React from 'react';
import { motion } from 'framer-motion';
import { FaHistory } from 'react-icons/fa';

/**
 * Displays the most recently created/updated attendance records
 * as a compact activity timeline on the dashboard.
 */
const RecentActivity = ({ records }) => {
  const recent = [...(records || [])]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const timeAgo = (dateStr) => {
    const diffMs = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diffMs / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <motion.div
      className="glass-panel h-100"
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.45 }}
    >
      <h6 className="mb-3 d-flex align-items-center gap-2">
        <FaHistory /> Recent Activity
      </h6>

      {recent.length === 0 ? (
        <p className="text-muted small mb-0">No recent activity yet.</p>
      ) : (
        recent.map((r) => (
          <div className="activity-item" key={r._id}>
            <span className={`activity-dot ${r.status === 'Present' ? 'present' : 'absent'}`} />
            <div className="flex-grow-1">
              <div className="small fw-semibold" style={{ color: 'var(--text-primary)' }}>
                {r.studentName}
              </div>
              <div className="small" style={{ color: 'var(--text-muted)' }}>
                Marked <strong>{r.status}</strong> • {timeAgo(r.createdAt)}
              </div>
            </div>
          </div>
        ))
      )}
    </motion.div>
  );
};

export default RecentActivity;

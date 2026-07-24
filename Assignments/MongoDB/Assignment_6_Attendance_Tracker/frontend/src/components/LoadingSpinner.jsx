import React from 'react';

/**
 * Reusable premium loading spinner shown while async data is being fetched.
 */
const LoadingSpinner = ({ label = 'Loading data...' }) => {
  return (
    <div className="loading-spinner-wrap flex-column">
      <div className="premium-spinner mb-3" role="status" aria-label="Loading" />
      <p style={{ color: 'var(--text-muted)', fontWeight: 500 }}>{label}</p>
    </div>
  );
};

export default LoadingSpinner;

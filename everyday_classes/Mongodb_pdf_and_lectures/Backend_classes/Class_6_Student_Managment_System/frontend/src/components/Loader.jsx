/**
 * Skeleton rows shown inside the table card while users are being fetched,
 * and a full-page loader used once, before any data has ever arrived.
 */
export function TableSkeleton({ rows = 3 }) {
  return (
    <div className="skeleton-table" role="status" aria-label="Loading users">
      {Array.from({ length: rows }).map((_, i) => (
        <div className="skeleton-row" key={i}>
          <span className="skeleton-avatar shimmer" />
          <span className="skeleton-lines">
            <span className="skeleton-line shimmer" style={{ width: "38%" }} />
            <span className="skeleton-line shimmer" style={{ width: "62%" }} />
          </span>
          <span className="skeleton-pill shimmer" />
          <span className="skeleton-pill shimmer short" />
        </div>
      ))}
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="page-loader">
      <div className="page-loader-ring">
        <span />
        <span />
        <span />
      </div>
      <p>Loading dashboard…</p>
    </div>
  );
}

export default TableSkeleton;

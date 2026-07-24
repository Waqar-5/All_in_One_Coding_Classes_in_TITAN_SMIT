const COLORS = ["#3F6B4F", "#B8863B", "#9C4221", "#4A5A52", "#C9974C", "#7E9587", "#98692C", "#274332", "#B25330"];

/**
 * Small, dependency-free donut chart. Renders a ring built from stacked
 * SVG arc segments, plus a legend — no charting library needed for this
 * one screen.
 */
export default function CategoryDonut({ data }) {
  const total = data.reduce((sum, d) => sum + d.count, 0);
  if (total === 0) return null;

  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center">
      <svg viewBox="0 0 160 160" className="h-40 w-40 shrink-0 -rotate-90">
        <circle cx="80" cy="80" r={radius} fill="none" stroke="currentColor" strokeWidth="18" className="text-ink-100 dark:text-paper-400/10" />
        {data.map((d, i) => {
          const fraction = d.count / total;
          const dash = fraction * circumference;
          const segment = (
            <circle
              key={d.category}
              cx="80"
              cy="80"
              r={radius}
              fill="none"
              stroke={COLORS[i % COLORS.length]}
              strokeWidth="18"
              strokeDasharray={`${dash} ${circumference - dash}`}
              strokeDashoffset={-offset}
              strokeLinecap="butt"
            />
          );
          offset += dash;
          return segment;
        })}
      </svg>

      <ul className="flex flex-1 flex-col gap-2">
        {data.map((d, i) => (
          <li key={d.category} className="flex items-center justify-between gap-3 text-sm">
            <span className="flex items-center gap-2 text-ink-600 dark:text-paper-200">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ background: COLORS[i % COLORS.length] }}
              />
              {d.category}
            </span>
            <span className="font-mono text-xs text-ink-400 dark:text-paper-300">{d.count}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

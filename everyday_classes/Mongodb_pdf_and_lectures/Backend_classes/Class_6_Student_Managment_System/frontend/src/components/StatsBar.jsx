import { motion } from "framer-motion";
import { FaUsers, FaCalendarDay, FaUserClock } from "react-icons/fa";

function isToday(dateStr) {
  const d = new Date(dateStr);
  const now = new Date();
  return (
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear()
  );
}

function StatsBar({ users, loading }) {
  const total = users.length;
  const todayCount = users.filter((u) => isToday(u.createdAt)).length;
  const last = [...users].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  )[0];

  const stats = [
    {
      label: "Total Users",
      value: total,
      icon: <FaUsers />,
      tone: "tone-indigo",
    },
    {
      label: "Registered Today",
      value: todayCount,
      icon: <FaCalendarDay />,
      tone: "tone-purple",
    },
    {
      label: "Last Registered",
      value: last ? last.name : "No users yet",
      icon: <FaUserClock />,
      tone: "tone-blue",
      isText: true,
    },
  ];

  return (
    <div className="stats-grid">
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          className={`stat-card ${s.tone}`}
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: i * 0.08, ease: "easeOut" }}
          whileHover={{ y: -6 }}
        >
          <span className="stat-icon">{s.icon}</span>
          <span className="stat-body">
            <span className="stat-label">{s.label}</span>
            <span className={`stat-value ${s.isText ? "stat-value-text" : ""}`}>
              {loading ? "…" : s.value}
            </span>
          </span>
        </motion.div>
      ))}
    </div>
  );
}

export default StatsBar;

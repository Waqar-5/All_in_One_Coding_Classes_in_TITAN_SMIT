import React from 'react';
import { motion } from 'framer-motion';
import { FaUsers, FaCheckCircle, FaTimesCircle, FaChartPie } from 'react-icons/fa';

// Animation variants for staggered card entrance
const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12 },
  },
};

const item = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: 'easeOut' } },
};

/**
 * Displays the four key dashboard statistic cards:
 * Total Students, Present, Absent, and Attendance Percentage.
 */
const DashboardCards = ({ stats }) => {
  const { total = 0, present = 0, absent = 0, percentage = 0 } = stats || {};

  const cards = [
    {
      key: 'total',
      className: 'total',
      label: 'Total Records',
      value: total,
      icon: <FaUsers />,
      progress: 100,
    },
    {
      key: 'present',
      className: 'present',
      label: 'Present',
      value: present,
      icon: <FaCheckCircle />,
      progress: total > 0 ? (present / total) * 100 : 0,
    },
    {
      key: 'absent',
      className: 'absent',
      label: 'Absent',
      value: absent,
      icon: <FaTimesCircle />,
      progress: total > 0 ? (absent / total) * 100 : 0,
    },
    {
      key: 'percentage',
      className: 'percentage',
      label: 'Attendance Rate',
      value: `${percentage}%`,
      icon: <FaChartPie />,
      progress: percentage,
    },
  ];

  return (
    <motion.div className="row g-3 g-md-4 mb-4" variants={container} initial="hidden" animate="show">
      {cards.map((card) => (
        <motion.div className="col-6 col-lg-3" key={card.key} variants={item}>
          <div className={`stat-card ${card.className}`}>
            <div className="d-flex align-items-center justify-content-between">
              <span className="stat-icon">{card.icon}</span>
            </div>
            <div>
              <div className="stat-value">{card.value}</div>
              <div className="stat-label">{card.label}</div>
              <div className="stat-progress-track">
                <div
                  className="stat-progress-fill"
                  style={{ width: `${Math.min(card.progress, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default DashboardCards;

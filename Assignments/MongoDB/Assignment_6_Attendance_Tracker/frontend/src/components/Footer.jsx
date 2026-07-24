import React from 'react';
import { FaHeart } from 'react-icons/fa';

/**
 * Professional footer displayed at the bottom of every page.
 */
const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="app-footer no-print">
      <div className="container-fluid">
        <p className="mb-1">
          © {year} <a href="/">AttendancePro</a> — Premium Attendance Management System
        </p>
        <p className="mb-0" style={{ fontSize: '0.8rem', opacity: 0.8 }}>
          Built with <FaHeart style={{ color: '#f43f5e' }} /> using the MERN Stack
        </p>
      </div>
    </footer>
  );
};

export default Footer;

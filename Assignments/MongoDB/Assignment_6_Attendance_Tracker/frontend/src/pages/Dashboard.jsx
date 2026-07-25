import React, { useCallback, useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';

import DashboardCards from '../components/DashboardCards.jsx';
import AttendanceForm from '../components/AttendanceForm.jsx';
import FilterBar from '../components/FilterBar.jsx';
import AttendanceTable from '../components/AttendanceTable.jsx';
import Pagination from '../components/Pagination.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import RecentActivity from '../components/RecentActivity.jsx';

import {
  fetchAttendanceRecords,
  fetchAttendanceStats,
  createAttendanceRecord,
  updateAttendanceRecord,
  deleteAttendanceRecord,
} from '../services/attendanceService.js';

import { exportToPDF, exportToExcel, printAttendance } from '../utils/exportUtils.js';

// Small helper to show a consistent toast notification (top-right, auto-dismiss)
const showToast = (icon, title) => {
  Swal.fire({
    toast: true,
    position: 'top-end',
    icon,
    title,
    showConfirmButton: false,
    timer: 2500,
    timerProgressBar: true,
  });
};

const Dashboard = () => {
  const [records, setRecords] = useState([]);
  const [stats, setStats] = useState({ total: 0, present: 0, absent: 0, percentage: 0 });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [editingRecord, setEditingRecord] = useState(null);

  // Search / filter / sort / pagination state
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [order, setOrder] = useState('desc');
  const [page, setPage] = useState(1);
  const [limit] = useState(8);
  const [totalPages, setTotalPages] = useState(1);

  /** Fetch attendance records from the API using current filters/sort/pagination */
  const loadRecords = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchAttendanceRecords({
        search,
        status: statusFilter,
        date: dateFilter,
        sortBy,
        order,
        page,
        limit,
      });
      setRecords(res.data);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      showToast('error', err.message || 'Failed to load attendance records');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, dateFilter, sortBy, order, page, limit]);

  /** Fetch dashboard statistics (independent of table filters) */
  const loadStats = useCallback(async () => {
    try {
      const res = await fetchAttendanceStats();
      setStats(res.data);
    } catch (err) {
      showToast('error', err.message || 'Failed to load statistics');
    }
  }, []);

  useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  // Debounce live search input to avoid firing a request on every keystroke
  useEffect(() => {
    const handle = setTimeout(() => setPage(1), 400);
    return () => clearTimeout(handle);
  }, [search, statusFilter, dateFilter]);

  /** Handles both create and update submissions from AttendanceForm */
  const handleFormSubmit = async (formData) => {
    setSubmitting(true);
    try {
      if (editingRecord) {
        await updateAttendanceRecord(editingRecord._id, formData);
        showToast('success', 'Attendance updated successfully');
        setEditingRecord(null);
      } else {
        await createAttendanceRecord(formData);
        showToast('success', 'Attendance added successfully');
      }
      await Promise.all([loadRecords(), loadStats()]);
    } catch (err) {
      showToast('error', err.message || 'Failed to save attendance record');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => setEditingRecord(null);

  const handleDelete = async (record) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      html: `You are about to delete the attendance record for <strong>${record.studentName}</strong>. This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#f43f5e',
      cancelButtonColor: '#6366f1',
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      await deleteAttendanceRecord(record._id);
      showToast('success', 'Attendance record deleted');
      // If the last item on a page is removed, step back a page if needed
      if (records.length === 1 && page > 1) {
        setPage((p) => p - 1);
      } else {
        await loadRecords();
      }
      await loadStats();
    } catch (err) {
      showToast('error', err.message || 'Failed to delete attendance record');
    }
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setOrder('asc');
    }
  };

  const handleClearFilters = () => {
    setSearch('');
    setStatusFilter('');
    setDateFilter('');
    setPage(1);
  };

  const handleExportPDF = () => {
    if (records.length === 0) {
      showToast('info', 'No records to export');
      return;
    }
    exportToPDF(records);
    showToast('success', 'PDF exported successfully');
  };

  const handleExportExcel = () => {
    if (records.length === 0) {
      showToast('info', 'No records to export');
      return;
    }
    exportToExcel(records);
    showToast('success', 'Excel file exported successfully');
  };

  return (
    <div className="main-content">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-4"
      >
        <h2 className="mb-1" style={{ color: '#fff' }}>
          Welcome back 👋
        </h2>
        <p className="mb-0" style={{ color: 'rgba(255,255,255,0.85)' }}>
          Here's an overview of the attendance records you've marked.
        </p>
      </motion.div>

      <DashboardCards stats={stats} />

      <div className="row g-4">
        <div className="col-12 col-lg-8">
          <AttendanceForm
            editingRecord={editingRecord}
            onSubmit={handleFormSubmit}
            onCancelEdit={handleCancelEdit}
            submitting={submitting}
          />

          <FilterBar
            search={search}
            onSearchChange={setSearch}
            statusFilter={statusFilter}
            onStatusFilterChange={(v) => {
              setStatusFilter(v);
            }}
            dateFilter={dateFilter}
            onDateFilterChange={(v) => {
              setDateFilter(v);
            }}
            onClearFilters={handleClearFilters}
            onExportPDF={handleExportPDF}
            onExportExcel={handleExportExcel}
            onPrint={printAttendance}
          />

          {loading ? (
            <div className="glass-panel">
              <LoadingSpinner label="Fetching attendance records..." />
            </div>
          ) : (
            <>
              <AttendanceTable
                records={records}
                sortBy={sortBy}
                order={order}
                onSort={handleSort}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
              <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
            </>
          )}
        </div>

        <div className="col-12 col-lg-4">
          <RecentActivity records={records} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

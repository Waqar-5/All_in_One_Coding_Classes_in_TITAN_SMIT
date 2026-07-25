import React, { useCallback, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import { FaArrowLeft, FaUserCircle, FaEnvelope, FaCalendarAlt, FaLock } from 'react-icons/fa';

import DashboardCards from '../components/DashboardCards.jsx';
import AttendanceForm from '../components/AttendanceForm.jsx';
import FilterBar from '../components/FilterBar.jsx';
import AttendanceTable from '../components/AttendanceTable.jsx';
import Pagination from '../components/Pagination.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

import { fetchUserById } from '../services/adminService.js';
import {
  fetchAttendanceRecords,
  fetchAttendanceStats,
  updateAttendanceRecord,
  deleteAttendanceRecord,
} from '../services/attendanceService.js';
import { exportToPDF, exportToExcel, printAttendance } from '../utils/exportUtils.js';

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

/**
 * Admin-only page: shows everything ONE specific user has marked —
 * reached by clicking a user from the Admin Panel's user list
 * (`/admin/users/:id`). Reuses the same stat cards, filter bar, and
 * table used on the normal Dashboard, but scoped entirely to this one
 * user via the `viewUserId` query param (only admins are allowed to use it —
 * enforced server-side).
 *
 * Admins can still edit or delete this user's records here (useful for
 * correcting mistakes), but there's no "Add" form — creating a new record
 * always belongs to whoever is logged in, so adding on someone else's
 * behalf would misattribute the record. Click "Edit" on a row to update it.
 */
const AdminUserDetail = () => {
  const { id } = useParams();

  const [targetUser, setTargetUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);

  const [records, setRecords] = useState([]);
  const [stats, setStats] = useState({ total: 0, present: 0, absent: 0, percentage: 0, limitInfo: null });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [order, setOrder] = useState('desc');
  const [page, setPage] = useState(1);
  const [limit] = useState(8);
  const [totalPages, setTotalPages] = useState(1);

  const loadTargetUser = useCallback(async () => {
    setUserLoading(true);
    try {
      const res = await fetchUserById(id);
      setTargetUser(res.data);
    } catch (err) {
      showToast('error', err.message || 'Failed to load user');
    } finally {
      setUserLoading(false);
    }
  }, [id]);

  const loadRecords = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchAttendanceRecords({
        viewUserId: id,
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
  }, [id, search, statusFilter, dateFilter, sortBy, order, page, limit]);

  const loadStats = useCallback(async () => {
    try {
      const res = await fetchAttendanceStats({ viewUserId: id });
      setStats(res.data);
    } catch (err) {
      showToast('error', err.message || 'Failed to load statistics');
    }
  }, [id]);

  useEffect(() => {
    loadTargetUser();
  }, [loadTargetUser]);

  useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  useEffect(() => {
    const handle = setTimeout(() => setPage(1), 400);
    return () => clearTimeout(handle);
  }, [search, statusFilter, dateFilter]);

  const handleUpdateSubmit = async (formData) => {
    if (!editingRecord) return;
    setSubmitting(true);
    try {
      await updateAttendanceRecord(editingRecord._id, formData);
      showToast('success', 'Attendance record updated');
      setEditingRecord(null);
      await Promise.all([loadRecords(), loadStats(), loadTargetUser()]);
    } catch (err) {
      showToast('error', err.message || 'Failed to update record');
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
      if (records.length === 1 && page > 1) {
        setPage((p) => p - 1);
      } else {
        await loadRecords();
      }
      await Promise.all([loadStats(), loadTargetUser()]);
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
      <Link to="/admin/users" className="btn btn-outline-soft btn-sm mb-3 no-print">
        <FaArrowLeft className="me-2" /> Back to Admin Panel
      </Link>

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="glass-panel mb-4 d-flex flex-wrap align-items-center gap-3"
      >
        {userLoading ? (
          <LoadingSpinner label="Loading user..." />
        ) : targetUser ? (
          <>
            <span className="student-avatar" style={{ width: 56, height: 56, fontSize: '1.1rem' }}>
              {targetUser.name
                ?.split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2)
                .toUpperCase()}
            </span>
            <div>
              <h4 className="mb-1 d-flex align-items-center gap-2">
                {targetUser.name}
                {targetUser.isSuperAdmin && (
                  <span className="badge-status badge-absent">
                    <FaLock size={10} /> Protected
                  </span>
                )}
              </h4>
              <div className="d-flex flex-wrap gap-3 small" style={{ color: 'var(--text-muted)' }}>
                <span>
                  <FaEnvelope className="me-1" /> {targetUser.email}
                </span>
                <span className="text-capitalize">Role: {targetUser.role}</span>
                <span>
                  <FaCalendarAlt className="me-1" />
                  Joined{' '}
                  {new Date(targetUser.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
                {targetUser.role !== 'admin' && (
                  <span>
                    Limit: {targetUser.attendanceLimit === 0 ? 'Unlimited' : targetUser.attendanceLimit}
                  </span>
                )}
              </div>
            </div>
          </>
        ) : (
          <p className="mb-0">User not found.</p>
        )}
      </motion.div>

      <DashboardCards stats={stats} />

      {stats.limitInfo && stats.limitInfo.limit > 0 && (
        <div
          className="glass-panel mb-4 py-3"
          style={{ borderLeft: `4px solid ${stats.limitInfo.remaining === 0 ? 'var(--danger)' : 'var(--grad-1)'}` }}
        >
          <strong>Attendance limit:</strong> {stats.limitInfo.used} / {stats.limitInfo.limit} records used
        </div>
      )}

      {editingRecord && (
        <AttendanceForm
          editingRecord={editingRecord}
          onSubmit={handleUpdateSubmit}
          onCancelEdit={handleCancelEdit}
          submitting={submitting}
        />
      )}

      <FilterBar
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        dateFilter={dateFilter}
        onDateFilterChange={setDateFilter}
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
  );
};

export default AdminUserDetail;

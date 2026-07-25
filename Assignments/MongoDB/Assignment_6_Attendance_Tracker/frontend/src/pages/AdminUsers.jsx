import React, { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import { FaUserShield, FaBan, FaCheckCircle, FaClipboardList } from 'react-icons/fa';

import { fetchAllUsers, blockUser, unblockUser } from '../services/adminService.js';
import { useAuth } from '../context/AuthContext.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import EmptyState from '../components/EmptyState.jsx';

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
 * Admin-only page: lists every registered user, how many attendance
 * records each has personally marked, and lets an admin block/unblock
 * any account (blocked users are immediately signed out and can no
 * longer log back in).
 */
const AdminUsers = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actioningId, setActioningId] = useState(null);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchAllUsers();
      setUsers(res.data);
    } catch (err) {
      showToast('error', err.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleToggleBlock = async (targetUser) => {
    const willBlock = !targetUser.isBlocked;

    const result = await Swal.fire({
      title: willBlock ? 'Block this user?' : 'Unblock this user?',
      html: willBlock
        ? `<strong>${targetUser.email}</strong> will be signed out immediately and won't be able to log in again until you unblock them.`
        : `<strong>${targetUser.email}</strong> will be able to log in again.`,
      icon: willBlock ? 'warning' : 'question',
      showCancelButton: true,
      confirmButtonText: willBlock ? 'Yes, block' : 'Yes, unblock',
      cancelButtonText: 'Cancel',
      confirmButtonColor: willBlock ? '#f43f5e' : '#10b981',
      cancelButtonColor: '#6366f1',
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    setActioningId(targetUser._id);
    try {
      if (willBlock) {
        await blockUser(targetUser._id);
        showToast('success', `${targetUser.email} has been blocked`);
      } else {
        await unblockUser(targetUser._id);
        showToast('success', `${targetUser.email} has been unblocked`);
      }
      await loadUsers();
    } catch (err) {
      showToast('error', err.message || 'Action failed');
    } finally {
      setActioningId(null);
    }
  };

  const totalRecords = users.reduce((sum, u) => sum + (u.recordsMarked || 0), 0);

  return (
    <div className="main-content">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-4"
      >
        <h2 className="mb-1 d-flex align-items-center gap-2" style={{ color: '#fff' }}>
          <FaUserShield /> Admin Panel — Manage Users
        </h2>
        <p className="mb-0" style={{ color: 'rgba(255,255,255,0.85)' }}>
          {users.length} registered user{users.length !== 1 ? 's' : ''} • {totalRecords} attendance
          records marked in total
        </p>
      </motion.div>

      {loading ? (
        <div className="glass-panel">
          <LoadingSpinner label="Loading users..." />
        </div>
      ) : users.length === 0 ? (
        <div className="glass-panel">
          <EmptyState title="No users found" subtitle="No accounts have been registered yet." />
        </div>
      ) : (
        <div className="glass-panel table-card p-0">
          <div className="table-responsive">
            <table className="table attendance-table mb-0">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>
                    <FaClipboardList className="me-1" /> Records Marked
                  </th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th className="no-print">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    <td data-label="Name">
                      <span className="student-avatar">
                        {u.name
                          ?.split(' ')
                          .map((n) => n[0])
                          .join('')
                          .slice(0, 2)
                          .toUpperCase()}
                      </span>
                      <span className="fw-semibold">{u.name}</span>
                      {u._id === currentUser?._id && (
                        <span className="badge-status badge-present ms-2">You</span>
                      )}
                    </td>
                    <td data-label="Email">{u.email}</td>
                    <td data-label="Role">
                      <span className="text-capitalize fw-semibold">{u.role}</span>
                    </td>
                    <td data-label="Records Marked">{u.recordsMarked}</td>
                    <td data-label="Status">
                      {u.isBlocked ? (
                        <span className="badge-status badge-absent">
                          <FaBan /> Blocked
                        </span>
                      ) : (
                        <span className="badge-status badge-present">
                          <FaCheckCircle /> Active
                        </span>
                      )}
                    </td>
                    <td data-label="Joined">
                      {new Date(u.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td data-label="Actions" className="no-print">
                      {u._id === currentUser?._id ? (
                        <span className="small text-muted">—</span>
                      ) : (
                        <button
                          className={`btn btn-sm ${u.isBlocked ? 'btn-gradient-success' : 'btn-outline-soft'}`}
                          onClick={() => handleToggleBlock(u)}
                          disabled={actioningId === u._id}
                        >
                          {u.isBlocked ? <FaCheckCircle className="me-1" /> : <FaBan className="me-1" />}
                          {actioningId === u._id ? 'Please wait...' : u.isBlocked ? 'Unblock' : 'Block'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;

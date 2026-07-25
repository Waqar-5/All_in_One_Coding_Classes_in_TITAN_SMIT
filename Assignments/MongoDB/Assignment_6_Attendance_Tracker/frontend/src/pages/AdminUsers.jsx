import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import {
  FaUserShield,
  FaBan,
  FaCheckCircle,
  FaClipboardList,
  FaLock,
  FaArrowUp,
  FaArrowDown,
  FaSave,
  FaInfinity,
  FaEye,
} from 'react-icons/fa';

import {
  fetchAllUsers,
  blockUser,
  unblockUser,
  changeUserRole,
  setUserLimit,
} from '../services/adminService.js';
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
 * records each has personally marked, and lets an admin:
 *   - Block / unblock any account (blocked users are signed out immediately
 *     and can no longer log back in)
 *   - Promote a "teacher" to "admin", or demote an "admin" back to "teacher"
 *   - Set how many attendance records a "teacher" is allowed to create in
 *     total (0 = unlimited). Admins always bypass this limit entirely.
 *
 * The permanent super admin account (configured via SUPER_ADMIN_EMAIL on
 * the backend) is shown with a "Protected" badge and cannot be blocked or
 * have its role changed by anyone, including other admins.
 */
const AdminUsers = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actioningId, setActioningId] = useState(null);
  // Local draft values for the limit input fields, keyed by user ID
  const [limitDrafts, setLimitDrafts] = useState({});

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchAllUsers();
      setUsers(res.data);
      // Seed the draft inputs with each user's current limit
      const drafts = {};
      res.data.forEach((u) => {
        drafts[u._id] = u.attendanceLimit ?? 0;
      });
      setLimitDrafts(drafts);
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

  const handleToggleRole = async (targetUser) => {
    const newRole = targetUser.role === 'admin' ? 'teacher' : 'admin';
    const isPromoting = newRole === 'admin';

    const result = await Swal.fire({
      title: isPromoting ? 'Make this user an admin?' : 'Demote this admin to teacher?',
      html: isPromoting
        ? `<strong>${targetUser.email}</strong> will be able to see and manage <u>every</u> user's attendance records, and access this Admin Panel.`
        : `<strong>${targetUser.email}</strong> will lose admin access and only see their own records.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: isPromoting ? 'Yes, make admin' : 'Yes, demote',
      cancelButtonText: 'Cancel',
      confirmButtonColor: isPromoting ? '#6366f1' : '#f59e0b',
      cancelButtonColor: '#8b87a0',
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    setActioningId(targetUser._id);
    try {
      await changeUserRole(targetUser._id, newRole);
      showToast('success', `${targetUser.email} is now ${isPromoting ? 'an admin' : 'a teacher'}`);
      await loadUsers();
    } catch (err) {
      showToast('error', err.message || 'Failed to change role');
    } finally {
      setActioningId(null);
    }
  };

  const handleLimitDraftChange = (userId, value) => {
    setLimitDrafts((prev) => ({ ...prev, [userId]: value }));
  };

  const handleSaveLimit = async (targetUser) => {
    const draftValue = limitDrafts[targetUser._id];
    const parsed = Number(draftValue);

    if (Number.isNaN(parsed) || parsed < 0) {
      showToast('error', 'Limit must be 0 or a positive number');
      return;
    }

    setActioningId(targetUser._id);
    try {
      await setUserLimit(targetUser._id, parsed);
      showToast(
        'success',
        parsed === 0
          ? `${targetUser.email} now has unlimited attendance records`
          : `${targetUser.email}'s limit is now ${parsed}`
      );
      await loadUsers();
    } catch (err) {
      showToast('error', err.message || 'Failed to update limit');
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
                  <th>Record Limit</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th className="no-print">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  const isSelf = u._id === currentUser?._id;
                  const isProtected = u.isSuperAdmin;
                  const isBusy = actioningId === u._id;
                  const isAdminRole = u.role === 'admin';

                  return (
                    <tr key={u._id}>
                      <td data-label="Name">
                        <div className="admin-user-cell">
                          <span className="student-avatar admin-user-avatar">
                            {u.name
                              ?.split(' ')
                              .map((n) => n[0])
                              .join('')
                              .slice(0, 2)
                              .toUpperCase()}
                          </span>
                          <div className="admin-user-meta">
                            <Link
                              to={`/admin/users/${u._id}`}
                              className="admin-user-name"
                              title="View this user's full attendance history"
                            >
                              {u.name}
                            </Link>
                            {(isSelf || isProtected) && (
                              <div className="admin-user-badges">
                                {isSelf && <span className="badge-status badge-present">You</span>}
                                {isProtected && (
                                  <span
                                    className="badge-status badge-absent"
                                    title="This account is protected and cannot be blocked or demoted"
                                  >
                                    <FaLock size={10} /> Protected
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td data-label="Email">{u.email}</td>
                      <td data-label="Role">
                        <span className="text-capitalize fw-semibold">{u.role}</span>
                      </td>
                      <td data-label="Records Marked">{u.recordsMarked}</td>
                      <td data-label="Record Limit">
                        {isAdminRole ? (
                          <span className="small text-muted d-flex align-items-center gap-1">
                            <FaInfinity /> Unlimited (admin)
                          </span>
                        ) : (
                          <div className="d-flex align-items-center gap-2">
                            <input
                              type="number"
                              min="0"
                              className="form-control form-control-sm"
                              style={{ width: 90 }}
                              value={limitDrafts[u._id] ?? 0}
                              onChange={(e) => handleLimitDraftChange(u._id, e.target.value)}
                            />
                            <button
                              className="btn-icon-action btn-icon-edit"
                              title="Save limit (0 = unlimited)"
                              onClick={() => handleSaveLimit(u)}
                              disabled={isBusy || Number(limitDrafts[u._id]) === (u.attendanceLimit ?? 0)}
                            >
                              <FaSave size={13} />
                            </button>
                          </div>
                        )}
                      </td>
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
                        <div className="d-flex flex-column flex-sm-row gap-2">
                          <Link to={`/admin/users/${u._id}`} className="btn btn-sm btn-outline-soft">
                            <FaEye className="me-1" /> View
                          </Link>
                          {!isProtected && (
                            <>
                              <button
                                className={`btn btn-sm ${u.isBlocked ? 'btn-gradient-success' : 'btn-outline-soft'}`}
                                onClick={() => handleToggleBlock(u)}
                                disabled={isBusy || isSelf}
                                title={isSelf ? "You can't block yourself" : undefined}
                              >
                                {u.isBlocked ? <FaCheckCircle className="me-1" /> : <FaBan className="me-1" />}
                                {u.isBlocked ? 'Unblock' : 'Block'}
                              </button>
                              <button
                                className="btn btn-sm btn-outline-soft"
                                onClick={() => handleToggleRole(u)}
                                disabled={isBusy || (isSelf && u.role === 'admin')}
                                title={isSelf && u.role === 'admin' ? "You can't demote yourself" : undefined}
                              >
                                {u.role === 'admin' ? (
                                  <>
                                    <FaArrowDown className="me-1" /> Demote
                                  </>
                                ) : (
                                  <>
                                    <FaArrowUp className="me-1" /> Make Admin
                                  </>
                                )}
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;

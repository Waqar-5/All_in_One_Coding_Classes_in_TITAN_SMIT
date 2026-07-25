import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import { FaEnvelope, FaLock, FaSignInAlt, FaClipboardCheck } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext.jsx';

/**
 * Login page. On success, redirects the user to the page they originally
 * tried to visit (if redirected here by ProtectedRoute), or to the dashboard.
 */
const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await login(formData);
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Logged in successfully',
        showConfirmButton: false,
        timer: 2000,
      });
      navigate(from, { replace: true });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Login failed',
        text: err.message || 'Invalid email or password',
        confirmButtonColor: '#6366f1',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <motion.div
        className="glass-panel auth-card"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <div className="text-center mb-4">
          <span className="brand-icon-wrap mx-auto mb-3">
            <FaClipboardCheck />
          </span>
          <h3 className="mb-1">Welcome Back</h3>
          <p style={{ color: 'var(--text-muted)' }}>Log in to manage attendance</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label className="form-label">
              <FaEnvelope className="me-1" /> Email
            </label>
            <input
              type="email"
              name="email"
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
          </div>

          <div className="mb-4">
            <label className="form-label">
              <FaLock className="me-1" /> Password
            </label>
            <input
              type="password"
              name="password"
              className={`form-control ${errors.password ? 'is-invalid' : ''}`}
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && <div className="invalid-feedback">{errors.password}</div>}
          </div>

          <button type="submit" className="btn btn-gradient-primary w-100" disabled={submitting}>
            <FaSignInAlt className="me-2" />
            {submitting ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <p className="text-center mt-4 mb-0" style={{ color: 'var(--text-muted)' }}>
          Don't have an account? <Link to="/register">Create one</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;

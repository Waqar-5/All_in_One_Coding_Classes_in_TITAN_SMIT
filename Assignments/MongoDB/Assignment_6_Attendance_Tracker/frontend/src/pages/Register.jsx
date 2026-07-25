import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import { FaUser, FaEnvelope, FaLock, FaUserPlus, FaClipboardCheck } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext.jsx';

/**
 * Registration page for creating a new teacher/admin account.
 */
const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    }
    if (!formData.password || formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Account created successfully',
        showConfirmButton: false,
        timer: 2000,
      });
      navigate('/', { replace: true });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Registration failed',
        text: err.message || 'Something went wrong. Please try again.',
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
          <h3 className="mb-1">Create an Account</h3>
          <p style={{ color: 'var(--text-muted)' }}>Start managing attendance in minutes</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label className="form-label">
              <FaUser className="me-1" /> Full Name
            </label>
            <input
              type="text"
              name="name"
              className={`form-control ${errors.name ? 'is-invalid' : ''}`}
              placeholder="Jane Doe"
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && <div className="invalid-feedback">{errors.name}</div>}
          </div>

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

          <div className="mb-3">
            <label className="form-label">
              <FaLock className="me-1" /> Password
            </label>
            <input
              type="password"
              name="password"
              className={`form-control ${errors.password ? 'is-invalid' : ''}`}
              placeholder="At least 6 characters"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && <div className="invalid-feedback">{errors.password}</div>}
          </div>

          <div className="mb-4">
            <label className="form-label">
              <FaLock className="me-1" /> Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
              placeholder="Re-enter your password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
          </div>

          <button type="submit" className="btn btn-gradient-primary w-100" disabled={submitting}>
            <FaUserPlus className="me-2" />
            {submitting ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center mt-4 mb-0" style={{ color: 'var(--text-muted)' }}>
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;

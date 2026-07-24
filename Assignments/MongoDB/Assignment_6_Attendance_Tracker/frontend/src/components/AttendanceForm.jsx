import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaUserPlus, FaSyncAlt, FaSave, FaUser, FaCalendarAlt, FaListAlt } from 'react-icons/fa';

const emptyForm = {
  studentName: '',
  date: new Date().toISOString().slice(0, 10),
  status: 'Present',
};

/**
 * Form used to create a new attendance record or update an existing one.
 * When `editingRecord` is provided, the form switches into "update" mode
 * and pre-fills the fields.
 */
const AttendanceForm = ({ editingRecord, onSubmit, onCancelEdit, submitting }) => {
  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  // Populate form when an existing record is selected for editing
  useEffect(() => {
    if (editingRecord) {
      setFormData({
        studentName: editingRecord.studentName || '',
        date: editingRecord.date ? editingRecord.date.slice(0, 10) : emptyForm.date,
        status: editingRecord.status || 'Present',
      });
      setErrors({});
    }
  }, [editingRecord]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.studentName.trim()) {
      newErrors.studentName = 'Student name is required';
    } else if (formData.studentName.trim().length < 2) {
      newErrors.studentName = 'Name must be at least 2 characters';
    }
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    if (!formData.status) {
      newErrors.status = 'Status is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({ ...formData, studentName: formData.studentName.trim() });
  };

  const handleReset = () => {
    setFormData(emptyForm);
    setErrors({});
    if (editingRecord && onCancelEdit) onCancelEdit();
  };

  return (
    <motion.div
      className="glass-panel form-card mb-4"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h5 className="mb-3 d-flex align-items-center gap-2">
        {editingRecord ? <FaSave /> : <FaUserPlus />}
        {editingRecord ? 'Update Attendance Record' : 'Add New Attendance'}
      </h5>

      <form onSubmit={handleSubmit} noValidate>
        <div className="row g-3">
          <div className="col-12 col-md-5">
            <label className="form-label">
              <FaUser className="me-1" /> Student Name
            </label>
            <input
              type="text"
              name="studentName"
              className={`form-control ${errors.studentName ? 'is-invalid' : ''}`}
              placeholder="e.g. John Carter"
              value={formData.studentName}
              onChange={handleChange}
            />
            {errors.studentName && <div className="invalid-feedback">{errors.studentName}</div>}
          </div>

          <div className="col-12 col-md-4">
            <label className="form-label">
              <FaCalendarAlt className="me-1" /> Date
            </label>
            <input
              type="date"
              name="date"
              className={`form-control ${errors.date ? 'is-invalid' : ''}`}
              value={formData.date}
              onChange={handleChange}
            />
            {errors.date && <div className="invalid-feedback">{errors.date}</div>}
          </div>

          <div className="col-12 col-md-3">
            <label className="form-label">
              <FaListAlt className="me-1" /> Status
            </label>
            <select
              name="status"
              className={`form-select ${errors.status ? 'is-invalid' : ''}`}
              value={formData.status}
              onChange={handleChange}
            >
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
            </select>
            {errors.status && <div className="invalid-feedback">{errors.status}</div>}
          </div>
        </div>

        <div className="d-flex flex-wrap gap-2 mt-4">
          <button
            type="submit"
            className={`btn ${editingRecord ? 'btn-gradient-success' : 'btn-gradient-primary'}`}
            disabled={submitting}
          >
            {editingRecord ? <FaSave className="me-2" /> : <FaUserPlus className="me-2" />}
            {submitting
              ? 'Saving...'
              : editingRecord
              ? 'Update Attendance'
              : 'Add Attendance'}
          </button>
          <button type="button" className="btn btn-outline-soft" onClick={handleReset}>
            <FaSyncAlt className="me-2" />
            Reset
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default AttendanceForm;

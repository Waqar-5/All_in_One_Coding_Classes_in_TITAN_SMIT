import { useState, useEffect } from "react";
import {
  FaEye,
  FaEyeSlash,
  FaUserPlus,
  FaEdit,
  FaTimes,
  FaUser,
  FaEnvelope,
  FaLock,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import API from "../services/api";
import { toast } from "react-toastify";

function UserForm({ selectedUser, setSelectedUser, reloadUsers }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fill form when Edit button is clicked
  useEffect(() => {
    if (selectedUser) {
      setFormData({
        name: selectedUser.name,
        email: selectedUser.email,
        password: selectedUser.password,
      });
    }
  }, [selectedUser]);

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Register / Update
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.password.trim()
    ) {
      toast.warning("Please fill all fields.");
      return;
    }

    try {
      setLoading(true);

      if (selectedUser) {
        const res = await API.put(`/users/${selectedUser._id}`, formData);
        toast.success(res.data.message);
      } else {
        const res = await API.post("/register", formData);
        toast.success(res.data.message);
      }

      setFormData({ name: "", email: "", password: "" });
      setSelectedUser(null);
      reloadUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  // Cancel Edit
  const cancelEdit = () => {
    setSelectedUser(null);
    setFormData({ name: "", email: "", password: "" });
  };

  return (
    <motion.div
      className="form-card"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.05 }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedUser ? "edit" : "create"}
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 12 }}
          transition={{ duration: 0.25 }}
          className="form-heading"
        >
          <span className={`form-badge ${selectedUser ? "badge-edit" : ""}`}>
            {selectedUser ? "Editing" : "New"}
          </span>
          <h2>{selectedUser ? "Update User" : "Register New User"}</h2>
          <p>
            {selectedUser
              ? "Modify the selected student's record"
              : "Add a student to the system"}
          </p>
        </motion.div>
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="premium-form">
        <label className="input-group">
          <FaUser className="input-icon" />
          <input
            type="text"
            name="name"
            placeholder="Full name"
            value={formData.name}
            onChange={handleChange}
            autoComplete="off"
          />
        </label>

        <label className="input-group">
          <FaEnvelope className="input-icon" />
          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
            autoComplete="off"
          />
        </label>

        <label className="input-group password-box">
          <FaLock className="input-icon" />
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            autoComplete="off"
          />
          <button
            type="button"
            className="eye-btn"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={showPassword ? "hide" : "show"}
                initial={{ opacity: 0, rotate: -60, scale: 0.6 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 60, scale: 0.6 }}
                transition={{ duration: 0.2 }}
                className="eye-icon-wrap"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </motion.span>
            </AnimatePresence>
          </button>
        </label>

        <motion.button
          type="submit"
          disabled={loading}
          className="submit-btn"
          whileHover={loading ? {} : { scale: 1.02 }}
          whileTap={loading ? {} : { scale: 0.97 }}
        >
          {loading ? (
            <span className="btn-spinner" />
          ) : selectedUser ? (
            <>
              <FaEdit /> Update User
            </>
          ) : (
            <>
              <FaUserPlus /> Register User
            </>
          )}
        </motion.button>

        <AnimatePresence>
          {selectedUser && (
            <motion.button
              type="button"
              onClick={cancelEdit}
              className="cancel-btn"
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: "auto", marginTop: 4 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.25 }}
            >
              <FaTimes /> Cancel
            </motion.button>
          )}
        </AnimatePresence>
      </form>
    </motion.div>
  );
}

export default UserForm;

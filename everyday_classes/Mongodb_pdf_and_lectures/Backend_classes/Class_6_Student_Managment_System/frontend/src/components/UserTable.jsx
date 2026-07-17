import { toast } from "react-toastify";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import {
  FaEdit,
  FaTrash,
  FaUsers,
  FaSearch,
  FaSortAmountDown,
  FaSortAmountUp,
  FaInbox,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import API from "../services/api";
import { TableSkeleton } from "./Loader";

const AVATAR_TONES = ["av-1", "av-2", "av-3", "av-4", "av-5"];

function getInitials(name = "") {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
}

function getTone(name = "") {
  const sum = [...name].reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return AVATAR_TONES[sum % AVATAR_TONES.length];
}

const SORT_FIELDS = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "createdAt", label: "Created Date" },
];

function UserTable({ users, loading, setSelectedUser, reloadUsers }) {
  const [visibleUsers, setVisibleUsers] = useState(3);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("createdAt");
  const [sortDir, setSortDir] = useState("desc");
  const [deletingId, setDeletingId] = useState(null);
  const [revealed, setRevealed] = useState({});

  const toggleReveal = (id) =>
    setRevealed((r) => ({ ...r, [id]: !r[id] }));

  // Delete User
  const deleteUser = async (id, name) => {
    const result = await Swal.fire({
      title: "Delete this user?",
      html: `This will permanently remove <b>${name}</b> from the system.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      focusCancel: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6366f1",
      customClass: { popup: "swal-premium" },
    });

    if (!result.isConfirmed) return;

    try {
      setDeletingId(id);

      const res = await API.delete(`/users/${id}`);

      toast.success(res.data.message);

      reloadUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setDeletingId(null);
    }
  };

  // Edit User
  const editUser = (user) => {
    setSelectedUser(user);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const filteredSorted = useMemo(() => {
    const q = search.trim().toLowerCase();

    let list = users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    );

    list = [...list].sort((a, b) => {
      let av = a[sortField];
      let bv = b[sortField];

      if (sortField === "createdAt") {
        av = new Date(av).getTime();
        bv = new Date(bv).getTime();
      } else {
        av = (av || "").toLowerCase();
        bv = (bv || "").toLowerCase();
      }

      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

    return list;
  }, [users, search, sortField, sortDir]);

  const visible = filteredSorted.slice(0, visibleUsers);
  const SortIcon = sortDir === "asc" ? FaSortAmountUp : FaSortAmountDown;

  return (
    <motion.div
      className="table-card"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
    >
      <div className="table-header">
        <h2>
          <FaUsers /> All Users
          <span className="user-count">{filteredSorted.length}</span>
        </h2>

        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setVisibleUsers(3);
            }}
          />
        </div>
      </div>

      <div className="sort-bar">
        <span className="sort-label">Sort by</span>
        {SORT_FIELDS.map((f) => (
          <button
            key={f.key}
            className={`sort-chip ${sortField === f.key ? "active" : ""}`}
            onClick={() => toggleSort(f.key)}
            type="button"
          >
            {f.label}
            {sortField === f.key && <SortIcon className="sort-chip-icon" />}
          </button>
        ))}
      </div>

      <div className="table-wrap">
        {loading ? (
          <TableSkeleton rows={3} />
        ) : filteredSorted.length === 0 ? (
          <motion.div
            className="empty-state"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35 }}
          >
            <div className="empty-icon">
              <FaInbox />
            </div>
            <h3>{search ? "No matches found" : "No users yet"}</h3>
            <p>
              {search
                ? "Try a different name or email."
                : "Register your first user to see data here."}
            </p>
          </motion.div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>User</th>
                <th>Email</th>
                <th>Password</th>
                <th>Created At</th>
                <th className="actions-col">Actions</th>
              </tr>
            </thead>

            <tbody>
              <AnimatePresence initial={false}>
                {visible.map((user, index) => (
                  <motion.tr
                    key={user._id}
                    layout
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -30, transition: { duration: 0.25 } }}
                    transition={{ duration: 0.3, delay: index * 0.04 }}
                    className={deletingId === user._id ? "row-deleting" : ""}
                  >
                    <td data-label="#">{index + 1}</td>

                    <td data-label="User">
                      <div className="user-cell">
                        <span className={`avatar ${getTone(user.name)}`}>
                          {getInitials(user.name)}
                        </span>
                        <span>{user.name}</span>
                      </div>
                    </td>

                    <td data-label="Email">{user.email}</td>

                    <td data-label="Password">
                      <div className="password-cell">
                        <span>
                          {revealed[user._id] ? user.password : "••••••••"}
                        </span>
                        <button
                          type="button"
                          className="reveal-btn"
                          onClick={() => toggleReveal(user._id)}
                          aria-label="Toggle password visibility"
                        >
                          {revealed[user._id] ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                    </td>

                    <td data-label="Created At">
                      {new Date(user.createdAt).toLocaleString()}
                    </td>

                    <td data-label="Actions">
                      <div className="action-btns">
                        <button
                          className="icon-btn edit-btn"
                          onClick={() => editUser(user)}
                          title="Edit"
                          type="button"
                        >
                          <FaEdit />
                        </button>

                        <button
                          className="icon-btn delete-btn"
                          onClick={() => deleteUser(user._id, user.name)}
                          disabled={deletingId === user._id}
                          title="Delete"
                          type="button"
                        >
                          {deletingId === user._id ? (
                            <span className="mini-spinner" />
                          ) : (
                            <FaTrash />
                          )}
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        )}
      </div>

      {/* See More / See Less */}
      {!loading && filteredSorted.length > 3 && (
        <div className="load-more-container">
          {filteredSorted.length > visibleUsers ? (
            <button
              className="load-btn"
              onClick={() => setVisibleUsers((prev) => prev + 5)}
              type="button"
            >
              See More
            </button>
          ) : (
            <button
              className="load-btn less"
              onClick={() => setVisibleUsers(3)}
              type="button"
            >
              See Less
            </button>
          )}
        </div>
      )}
    </motion.div>
  );
}

export default UserTable;

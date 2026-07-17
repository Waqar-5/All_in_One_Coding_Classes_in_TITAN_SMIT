import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import {
  FaEdit,
  FaTrash,
  FaUsers,
  FaSpinner,
} from "react-icons/fa";
import API from "../services/api";

function UserTable({
  setSelectedUser,
  refresh,
  reloadUsers,
}) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Initially show only 3 users
  const [visibleUsers, setVisibleUsers] = useState(3);

  useEffect(() => {
    getUsers();
  }, [refresh]);

  // Get All Users
  const getUsers = async () => {
    try {
      setLoading(true);

      const res = await API.get("/users");

      setUsers(res.data);
    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  // Delete User
  const deleteUser = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmDelete) return;

    try {
      setLoading(true);

      const res = await API.delete(`/users/${id}`);

      toast.success(res.data.message);

      reloadUsers();
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message
      );
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <div className="loader-container">
        <FaSpinner className="loader-icon" />
        <h2>Loading Users...</h2>
      </div>
    );
  }

  return (
    <div className="table-section">
      <div className="table-header">
        <h2>
          <FaUsers /> All Users
        </h2>

        <div className="user-count">
          Total Users : {users.length}
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Password</th>
            <th>Created At</th>
            <th width="150">Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="6">
                <div className="empty-state">
                  <h3>No Users Found</h3>
                  <p>
                    Register your first user to see data here.
                  </p>
                </div>
              </td>
            </tr>
          ) : (
            users
              .slice(0, visibleUsers)
              .map((user, index) => (
                <tr key={user._id}>
                  <td>{index + 1}</td>

                  <td>{user.name}</td>

                  <td>{user.email}</td>

                  <td>{user.password}</td>

                  <td>
                    {new Date(
                      user.createdAt
                    ).toLocaleString()}
                  </td>

                  <td>
                    <button
                      className="edit-btn"
                      onClick={() => editUser(user)}
                    >
                      <FaEdit />
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() =>
                        deleteUser(user._id)
                      }
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
          )}
        </tbody>
      </table>
            {/* See More / See Less */}

      <div className="load-more-container">

        {users.length > visibleUsers ? (

          <button
            className="load-btn"
            onClick={() =>
              setVisibleUsers((prev) => prev + 5)
            }
          >
            See More
          </button>

        ) : users.length > 3 ? (

          <button
            className="load-btn less"
            onClick={() => setVisibleUsers(3)}
          >
            See Less
          </button>

        ) : null}

      </div>

    </div>
  );
}

export default UserTable;
// jsx
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
      // alert(error.response?.data?.message || error.message);
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

      // alert(res.data.message);
      toast.success(res.data.message);

      reloadUsers();
    } catch (error) {
      alert(error.response?.data?.message || error.message);
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
            users.map((user, index) => (
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
                    title="Edit User"
                  >
                    <FaEdit />
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() =>
                      deleteUser(user._id)
                    }
                    title="Delete User"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default UserTable;




// // page 3

// import { useEffect, useState } from "react";
// import API from "../services/api";

// function UserTable({ setSelectedUser, refresh, reloadUsers }) {
//   const [users, setUsers] = useState([]);

//   useEffect(() => {
//     getUsers();
//   }, [refresh]);


//   // Get All Users
//   const getUsers = async () => {
//     try {
//       const res = await API.get("/users");
//       setUsers(res.data);
//     } catch (error) {
//       console.log(error);
//       alert(error.response?.data?.message || error.message);
//     }
//   };


//   // Delete User
//   const deleteUser = async (id) => {
//     const confirmDelete = window.confirm(
//       "Are you sure you want to delete this user?"
//     );

//     if (!confirmDelete) return;

//     try {
//       const res = await API.delete(`/users/${id}`);

//       alert(res.data.message);

//       reloadUsers();
//     } catch (error) {
//       alert(error.response?.data?.message || error.message);
//     }
//   };


//   // Edit User
//   const editUser = (user) => {
//     setSelectedUser(user);
//   };

//   return (
//     <div style={{ marginTop: "20px" }}>
//       <h2>All Users</h2>

//       <table
//         border="1"
//         cellPadding="10"
//         cellSpacing="0"
//         width="100%"
//       >
//         <thead>
//           <tr>
//             <th>#</th>
//             <th>Name</th>
//             <th>Email</th>
//             <th>Password</th>
//             <th>Created At</th>
//             <th>Actions</th>
//           </tr>
//         </thead>

//         <tbody>
//           {users.length === 0 ? (
//             <tr>
//               <td colSpan="6" align="center">
//                 No Users Found
//               </td>
//             </tr>
//           ) : (
//             users.map((user, index) => (
//               <tr key={user._id}>
//                 <td>{index + 1}</td>

//                 <td>{user.name}</td>

//                 <td>{user.email}</td>

//                 <td>{user.password}</td>

//                 <td>
//                   {new Date(user.createdAt).toLocaleString()}
//                 </td>

//                 <td>
//                   <button
//                     onClick={() => editUser(user)}
//                     style={{ marginRight: "10px" }}
//                   >
//                     Edit
//                   </button>

//                   <button
//                     onClick={() => deleteUser(user._id)}
//                   >
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// export default UserTable;
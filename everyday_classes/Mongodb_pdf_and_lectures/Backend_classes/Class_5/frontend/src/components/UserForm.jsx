import { useState, useEffect } from "react";
import { FaSpinner,FaEye, FaEyeSlash, FaUserPlus, FaEdit, FaTimes } from "react-icons/fa";
import API from "../services/api";
import { toast } from "react-toastify";
function UserForm({
  selectedUser,
  setSelectedUser,
  reloadUsers,
}) {
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
  }, [selectedUser])

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
      // return alert("Please fill all fields.");
    //  return toast.success(res.data.message);
    toast.warning("Please fill all fields.");
    return;
    }

    try {
      setLoading(true);

      if (selectedUser) {
        const res = await API.put(
          `/users/${selectedUser._id}`,
          formData
        );

        // alert(res.data.message);
        toast.success(res.data.message);
      } else {
        const res = await API.post(
          "/register",
          formData
        );

        // alert(res.data.message);
        toast.success(res.data.message);
      }

      setFormData({
        name: "",
        email: "",
        password: "",
      });

      setSelectedUser(null);

      reloadUsers();
    } catch (error) {
      // alert(error.response?.data?.message || error.message);
      toast.error(
  error.response?.data?.message || error.message
);
    } finally {
      setLoading(false);
    }
  };

  // Cancel Edit
  const cancelEdit = () => {
    setSelectedUser(null);

    setFormData({
      name: "",
      email: "",
      password: "",
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        placeholder="👤 Enter Name"
        value={formData.name}
        onChange={handleChange}
      />

      <input
        type="email"
        name="email"
        placeholder="📧 Enter Email"
        value={formData.email}
        onChange={handleChange}
      />

      <div className="password-box">
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="🔒 Enter Password"
          value={formData.password}
          onChange={handleChange}
        />

        <button
          type="button"
          className="eye-btn"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>

      <button type="submit" disabled={loading}>
        {loading ? (
          "Please Wait..."
        ) : selectedUser ? (
          <>
            <FaEdit /> Update User
          </>
        ) : (
          <>
            <FaUserPlus /> Register User
          </>
        )}
      </button>

      {selectedUser && (
        <button
          type="button"
          onClick={cancelEdit}
          className="cancel-btn"
        >
          <FaTimes /> Cancel
        </button>
      )}
    </form>
  );
}

export default UserForm;


// // page 2
// import { useState, useEffect } from "react";
// import API from "../services/api";
// function UserForm({
//   selectedUser,
//   setSelectedUser,
//   reloadUsers,
// }) {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//   });

//   // Edit button click hone par form fill hoga
//   useEffect(() => {
//     if (selectedUser) {
//       setFormData({
//         name: selectedUser.name,
//         email: selectedUser.email,
//         password: selectedUser.password,
//       });
//     }
//   }, [selectedUser]);

//   // Input change
//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };
//   // e  means event

//   // Register / Update
//   const handleSubmit = async (e) => {
//     e.preventDefault();

    

//     try {
//       if (selectedUser) {
//         // UPDATE
//         const res = await API.put(
//           `/users/${selectedUser._id}`,
//           formData
//         );
//         alert(res.data.message);

//       } else {
//         // REGISTER
//         const res = await API.post(
//           "/register",
//           formData
//         );
//         alert(res.data.message);
//       }

//       // Clear Form
//       setFormData({
//         name: "",
//         email: "",
//         password: "",
//       });

//       // Exit Edit Mode
//       setSelectedUser(null);

//       // Refresh Table
//       reloadUsers();

//     } catch (error) {
//       alert(error.response?.data?.message || error.message);
//       //  ? means optional yes or no
//     }
//   };


//   // Cancel Edit
//   const cancelEdit = () => {
//     setSelectedUser(null);

//     setFormData({
//       name: "",
//       email: "",
//       password: "",
//     });
//   };


//   return (
//     <form onSubmit={handleSubmit}>

//       <input
//         type="text"
//         name="name"
//         placeholder="Enter Name"
//         value={formData.name}
//         onChange={handleChange}
//       />

//       <input
//         type="email"
//         name="email"
//         placeholder="Enter Email"
//         value={formData.email}
//         onChange={handleChange}
//       />

      

//       <input
//         type="password"
//         name="password"
//         placeholder="Enter Password"
//         value={formData.password}
//         onChange={handleChange}
//       />

      

//       <button type="submit">
//         {selectedUser ? "Update User" : "Register User"}
//       </button>

//       {selectedUser && (
//         <button
//           type="button"
//           onClick={cancelEdit}
//           style={{ marginLeft: "10px" }}
//         >
//           Cancel
//         </button>
//       )}

//     </form>
//   );
// }

// export default UserForm;
import { useState } from "react";
import UserForm from "./components/UserForm";
import UserTable from "./components/UserTable";
import "./App.css";

function App() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [refresh, setRefresh] = useState(false);

  const reloadUsers = () => {
    setRefresh((prev) => !prev);
  };

  return (
    <div className="app">
      <h1>🎓 Student Management System</h1>

      <div className="container">
        <UserForm
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
          reloadUsers={reloadUsers}
        />

        <UserTable
          setSelectedUser={setSelectedUser}
          refresh={refresh}
          reloadUsers={reloadUsers}
        />
      </div>
    </div>
  );
}

export default App;


// // parent page 

// // npm create vite@latest
// // npm install axios react-bootstrap bootstrap
// import { useState } from "react";
// import UserForm from "./components/UserForm";
// import UserTable from "./components/UserTable";
// import "./App.css";
// function App() {

//   // Selected user for editing
//   const [selectedUser, setSelectedUser] = useState(null);

//   // Refresh table after add/update
//   const [refresh, setRefresh] = useState(false);

//   const reloadUsers = () => {
//     setRefresh(!refresh);
//   };

//   return (
//     <div style={{ width: "80%", margin: "20px auto" }}>

//       <h1 style={{ textAlign: "center" }}>
//         Student Managment System
//       </h1>

//       <UserForm
//         selectedUser={selectedUser}
//         setSelectedUser={setSelectedUser}
//         reloadUsers={reloadUsers}
//       />

//       <hr />

//       <UserTable
//         setSelectedUser={setSelectedUser}
//         refresh={refresh}
//         reloadUsers={reloadUsers}
//       />

//     </div>
//   );
// }

// export default App;
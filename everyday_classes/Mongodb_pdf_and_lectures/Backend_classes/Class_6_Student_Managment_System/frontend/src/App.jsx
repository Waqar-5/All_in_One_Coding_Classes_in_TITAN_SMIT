import { useState } from "react";
import { motion } from "framer-motion";
import { FaGraduationCap } from "react-icons/fa";
import UserForm from "./components/UserForm";
import UserTable from "./components/UserTable";
import StatsBar from "./components/StatsBar";
import useUsers from "./hooks/useUsers";
import "./App.css";

function App() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [refresh, setRefresh] = useState(false);

  const reloadUsers = () => setRefresh((prev) => !prev);
  const { users, loading } = useUsers(refresh);

  return (
    <div className="app-shell">
      <div className="aurora aurora-1" aria-hidden="true" />
      <div className="aurora aurora-2" aria-hidden="true" />
      <div className="aurora aurora-3" aria-hidden="true" />

      <motion.header
        className="topbar"
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
      >
        <div className="brand">
          <span className="brand-icon">
            <FaGraduationCap />
          </span>
          <div className="brand-text">
            <h1>Student Management System</h1>
            <p>Manage student records in one place</p>
          </div>
        </div>
      </motion.header>

      <main className="dashboard">
        <StatsBar users={users} loading={loading} />

        <div className="workspace">
          <UserForm
            selectedUser={selectedUser}
            setSelectedUser={setSelectedUser}
            reloadUsers={reloadUsers}
          />

          <UserTable
            users={users}
            loading={loading}
            setSelectedUser={setSelectedUser}
            reloadUsers={reloadUsers}
          />
        </div>
      </main>
    </div>
  );
}

export default App;

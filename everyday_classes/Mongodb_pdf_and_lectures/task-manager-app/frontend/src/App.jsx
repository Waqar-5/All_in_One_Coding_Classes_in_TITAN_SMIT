import { useEffect, useState } from "react";
import { API } from "./api";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [editId, setEditId] = useState(null);

  // GET TASKS
  const fetchTasks = async () => {
    const res = await API.get("/");
    setTasks(res.data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // ADD / UPDATE TASK
  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error("⚠️ Please enter a task first!");
      return;
    }

    if (editId) {
      await API.put(`/${editId}`, { title });
      toast.success("Task updated!");
      setEditId(null);
    } else {
      await API.post("/", { title });
      toast.success("Task added!");
    }

    setTitle("");
    fetchTasks();
  };

  // DELETE
  const deleteTask = async (id) => {
    await API.delete(`/${id}`);
    toast.success("Task deleted!");
    fetchTasks();
  };

  // TOGGLE COMPLETE
  const toggleComplete = async (task) => {
    await API.put(`/${task._id}`, {
      completed: !task.completed,
    });
    fetchTasks();
  };

  // EDIT
  const startEdit = (task) => {
    setTitle(task.title);
    setEditId(task._id);
  };

  return (
    <div style={styles.body}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={styles.container}
      >
        <h1 style={styles.title}>🔥 Task Manager</h1>

        {/* INPUT */}
        <div style={styles.inputBox}>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter task..."
            style={styles.input}
          />

          <button onClick={handleSubmit} style={styles.addBtn}>
            {editId ? "Update" : "Add"}
          </button>
        </div>

        {/* TASKS */}
        <div>
          {tasks.map((task) => (
            <motion.div
              key={task._id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                ...styles.card,
                background: task.completed
                  ? "#d1fae5"
                  : "rgba(255,255,255,0.9)",
              }}
            >
              <span
                style={{
                  ...styles.text,
                  textDecoration: task.completed ? "line-through" : "none",
                  color: task.completed ? "green" : "#111",
                }}
              >
                {task.title}
              </span>

              <div style={styles.actions}>
                <button
                  onClick={() => toggleComplete(task)}
                  style={styles.completeBtn}
                >
                  {task.completed ? "Undo" : "Done"}
                </button>

                <button
                  onClick={() => startEdit(task)}
                  style={styles.editBtn}
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteTask(task._id)}
                  style={styles.deleteBtn}
                >
                  Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

/* 🎨 RESPONSIVE STYLES */
const styles = {
  body: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    background: "linear-gradient(135deg,#667eea,#764ba2)",
    fontFamily: "Arial",
  },

  container: {
    width: "100%",
    maxWidth: "450px",
    background: "rgba(255,255,255,0.2)",
    backdropFilter: "blur(10px)",
    padding: "20px",
    borderRadius: "15px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
  },

  title: {
    textAlign: "center",
    color: "white",
    marginBottom: "20px",
  },

  inputBox: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
    flexWrap: "wrap",
  },

  input: {
    flex: 1,
    minWidth: "200px",
    padding: "10px",
    borderRadius: "8px",
    border: "none",
    outline: "none",
  },

  addBtn: {
    padding: "10px 15px",
    background: "#4ade80",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    minWidth: "80px",
  },

  card: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "10px",
    padding: "12px",
    marginBottom: "10px",
    borderRadius: "10px",
    transition: "0.3s",
  },

  text: {
    fontWeight: "bold",
  },

  actions: {
    display: "flex",
    gap: "5px",
    flexWrap: "wrap",
  },

  completeBtn: {
    background: "#22c55e",
    border: "none",
    color: "white",
    padding: "5px 8px",
    borderRadius: "6px",
    cursor: "pointer",
  },

  editBtn: {
    background: "#3b82f6",
    border: "none",
    color: "white",
    padding: "5px 8px",
    borderRadius: "6px",
    cursor: "pointer",
  },

  deleteBtn: {
    background: "#ef4444",
    border: "none",
    color: "white",
    padding: "5px 8px",
    borderRadius: "6px",
    cursor: "pointer",
  },
};
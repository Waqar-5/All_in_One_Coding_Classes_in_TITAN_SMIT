import { useState } from "react";

export default function TaskForm({ onAdd }) {
  const [title, setTitle] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAdd(title);
    setTitle("");
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter task..."
        style={styles.input}
      />

      <button style={styles.button}>Add</button>
    </form>
  );
}

const styles = {
  form: { display: "flex", gap: "10px", marginBottom: "20px" },
  input: { flex: 1, padding: "10px" },
  button: { padding: "10px 15px", cursor: "pointer" },
};
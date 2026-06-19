export default function TaskItem({ task, onDelete }) {
  return (
    <li style={styles.item}>
      <span>{task.title}</span>

      <button onClick={() => onDelete(task._id)} style={styles.btn}>
        ❌
      </button>
    </li>
  );
}

const styles = {
  item: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px",
    border: "1px solid #ddd",
    marginBottom: "10px",
  },
  btn: {
    cursor: "pointer",
  },
};
import TaskItem from "./TaskItem";

export default function TaskList({ tasks, onDelete }) {
  return (
    <ul style={{ listStyle: "none", padding: 0 }}>
      {tasks.map((task) => (
        <TaskItem key={task._id} task={task} onDelete={onDelete} />
      ))}
    </ul>
  );
}
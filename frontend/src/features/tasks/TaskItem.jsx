import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTask, deleteTask } from "./tasksApi";

const TaskItem = ({ task }) => {
  const qc = useQueryClient();

  const toggleMut = useMutation({
    mutationFn: () => updateTask(task.id, { is_completed: !task.is_completed }),
    onSuccess: () => qc.invalidateQueries(["tasks"]),
  });

  const deleteMut = useMutation({
    mutationFn: () => deleteTask(task.id),
    onSuccess: () => qc.invalidateQueries(["tasks"]),
  });

  const toggle = () => toggleMut.mutate();

  const remove = () => {
    if (!confirm("Delete task?")) return;

    deleteMut.mutate();
  };

  return (
    <li className="flex items-center justify-between py-2">
      <label>
        <input type="checkbox" checked={task.is_completed} onChange={toggle} />
        <span className={`ml-2 ${task.is_completed ? "line-through" : ""}`}>
          {task.title}
        </span>
      </label>
      <button onClick={remove} className="text-red-600">
        Delete
      </button>
    </li>
  );
};

export default TaskItem;

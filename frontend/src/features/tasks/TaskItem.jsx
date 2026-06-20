import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTask, deleteTask } from "./tasksApi";

const TaskItem = ({ task }) => {
  const qc = useQueryClient();

  const {
    mutate: toggleMutate,
    isPending: isTogglePending,
    isError: isToggleError,
    error: toggleError,
  } = useMutation({
    mutationFn: () => updateTask(task.id, { is_completed: !task.is_completed }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tasks"] }),
  });

  const {
    mutate: deleteMutate,
    isPending: isDeletePending,
    isError: isDeleteError,
    error: deleteError,
  } = useMutation({
    mutationFn: () => deleteTask(task.id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tasks"] }),
  });

  const toggle = () => toggleMutate();

  const remove = () => {
    if (!confirm("Delete task?")) return;

    deleteMutate();
  };

  return (
    <li className="flex items-center justify-between py-2">
      <label>
        <input
          type="checkbox"
          checked={task.is_completed}
          onChange={toggle}
          disabled={isTogglePending}
        />
        <span className={`ml-2 ${task.is_completed ? "line-through" : ""}`}>
          {task.title}
        </span>
      </label>
      <div className="flex items-center gap-2">
        <button
          onClick={remove}
          className="text-red-600"
          disabled={isDeletePending}
        >
          {isDeletePending ? "Deleting..." : "Delete"}
        </button>
        {(isToggleError || isDeleteError) && (
          <p className="text-red-600">
            {toggleError?.response?.data?.detail ||
              deleteError?.response?.data?.detail ||
              "Action failed"}
          </p>
        )}
      </div>
    </li>
  );
};

export default TaskItem;

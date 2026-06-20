import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTask, deleteTask } from "./tasksApi";
import { formatError } from "../../utils/formatError";

const TaskItem = ({ task }) => {
  const qc = useQueryClient();

  const {
    mutate: toggleMutate,
    isPending: isTogglePending,
    isError: isToggleError,
    error: toggleError,
  } = useMutation({
    mutationFn: updateTask,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tasks"] }),
  });

  const {
    mutate: deleteMutate,
    isPending: isDeletePending,
    isError: isDeleteError,
    error: deleteError,
  } = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tasks"] }),
  });

  const remove = () => {
    if (!confirm("Delete task?")) return;

    deleteMutate(task.id);
  };

  return (
    <li className="flex items-center justify-between py-2">
      <label>
        <input
          type="checkbox"
          checked={task.is_completed}
          onChange={() =>
            toggleMutate({
              id: task.id,
              payload: { is_completed: !task.is_completed },
            })
          }
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
            {formatError(toggleError, "Failed to update task")}
            {formatError(deleteError, "Failed to delete task")}
          </p>
        )}
      </div>
    </li>
  );
};

export default TaskItem;

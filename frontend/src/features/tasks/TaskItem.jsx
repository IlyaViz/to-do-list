import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updateTask, deleteTask } from "./tasksApi";
import { formatError } from "../../utils/formatError";
import TaskForm from "./TaskForm";

const TaskItem = ({ task, allTasks }) => {
  const [isAddingSubtask, setIsAddingSubtask] = useState(false);

  const qc = useQueryClient();

  const { mutate: toggleMutate, isPending: isTogglePending } = useMutation({
    mutationFn: updateTask,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tasks"] }),
    onError: (error) => {
      toast.error(formatError(error, "Failed to update task"));
    },
  });

  const { mutate: deleteMutate, isPending: isDeletePending } = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tasks"] }),
    onError: (error) => {
      toast.error(formatError(error, "Failed to delete task"));
    },
  });

  const remove = () => {
    if (!confirm("Delete task?")) return;

    deleteMutate(task.id);
  };

  return (
    <li className="flex flex-col items-center justify-between py-2">
      <div className="flex items-center justify-between w-full">
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
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAddingSubtask(!isAddingSubtask)}
              className="text-gray-400 hover:text-blue-600 text-xl leading-none"
              title="Додати підзадачу"
            >
              {isAddingSubtask ? "×" : "+"}
            </button>

            <button
              onClick={remove}
              className="text-red-400 hover:text-red-600 text-sm"
              disabled={isDeletePending}
            >
              {isDeletePending ? "..." : "Видалити"}
            </button>
          </div>
        </div>
      </div>

      {isAddingSubtask && (
        <div className="mt-2 w-full">
          <TaskForm parentId={task.id} />
        </div>
      )}

      <ul className="mt-2 w-full ml-4 border-l border-gray-300 pl-4">
        {allTasks
          .filter((t) => t.parent_task === task.id)
          .map((subtask) => (
            <TaskItem key={subtask.id} task={subtask} allTasks={allTasks} />
          ))}
      </ul>
    </li>
  );
};

export default TaskItem;

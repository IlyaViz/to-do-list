import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updateTask, deleteTask } from "./tasksApi";
import { formatError } from "../../utils/formatError";
import TaskForm from "./TaskForm";

const TaskItem = ({ task, allTasks }) => {
  const [isAddingSubtask, setIsAddingSubtask] = useState(false);
  const [isTaskEditing, setIsTaskEditing] = useState(false);

  const qc = useQueryClient();

  const { mutate: updateMutate, isPending: isTogglePending } = useMutation({
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

  const onTitleUnFocus = (e) => {
    const newTitle = e.target.value.trim();

    if (newTitle && newTitle !== task.title) {
      updateMutate({ id: task.id, payload: { title: newTitle } });
    }

    setIsTaskEditing(false);
  };

  return (
    <li className="flex flex-col items-center justify-between py-2">
      <div className="flex items-center justify-between w-full gap-2">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={task.is_completed}
            onChange={() =>
              updateMutate({
                id: task.id,
                payload: { is_completed: !task.is_completed },
              })
            }
            disabled={isTogglePending}
          />

          {isTaskEditing ? (
            <input
              type="text"
              defaultValue={task.title}
              onBlur={onTitleUnFocus}
              onKeyDown={(e) => e.key === "Enter" && e.target.blur()}
              className="border border-gray-300 rounded px-1 py-0.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          ) : (
            <span
              onClick={() => setIsTaskEditing(true)}
              className="cursor-pointer inline-block max-w-[125px] truncate"
            >
              {task.title}
            </span>
          )}
        </div>

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

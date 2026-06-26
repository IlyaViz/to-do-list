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

  const onEditUnFocus = (e) => {
    const isTitleChange = e.target.type === "text";
    const isDueDateChange = e.target.type === "datetime-local";

    if (isTitleChange && e.target.value.trim() !== "") {
      updateMutate({ id: task.id, payload: { title: e.target.value.trim() } });
    }

    if (isDueDateChange) {
      const newDueDate = e.target.value
        ? new Date(e.target.value).toISOString()
        : null;

      updateMutate({ id: task.id, payload: { due_at: newDueDate } });
    }

    setIsTaskEditing(false);
  };

  const formatDateForInput = (dateObj) => {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    const hours = String(dateObj.getHours()).padStart(2, "0");
    const minutes = String(dateObj.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const taskDate = task.due_at ? new Date(task.due_at) : null;
  const now = new Date();

  let dateBadgeClass = "text-gray-500 text-xs";
  let dateLabel = "Due";

  if (taskDate && !task.is_completed) {
    const timeDiff = taskDate.getTime() - now.getTime();

    if (timeDiff < 0) {
      dateBadgeClass =
        "text-red-600 text-xs font-bold bg-red-100 px-2 py-0.5 rounded";
      dateLabel = "Overdue";
    } else if (timeDiff <= 86400000) {
      dateBadgeClass =
        "text-orange-600 text-xs font-medium bg-orange-100 px-2 py-0.5 rounded";
      dateLabel = "Due soon";
    }
  }

  return (
    <li className="flex flex-col py-1">
      <div className="flex items-center justify-between w-full gap-4 bg-white p-3 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center gap-3 flex-1 min-w-0">
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
            className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
          />

          {isTaskEditing ? (
            <div className="flex flex-wrap gap-2 flex-1">
              <input
                type="text"
                defaultValue={task.title}
                onKeyDown={(e) => e.key === "Enter" && onEditUnFocus(e)}
                onBlur={onEditUnFocus}
                className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                autoFocus
              />
              <input
                type="datetime-local"
                defaultValue={taskDate && formatDateForInput(taskDate)}
                onKeyDown={(e) => e.key === "Enter" && onEditUnFocus(e)}
                onBlur={onEditUnFocus}
                className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          ) : (
            <div className="flex flex-col min-w-0 flex-1">
              <span
                onClick={() => setIsTaskEditing(true)}
                className={`cursor-pointer truncate font-medium ${
                  task.is_completed
                    ? "line-through text-gray-400"
                    : "text-gray-800"
                }`}
              >
                {task.title}
              </span>

              {taskDate && (
                <span className={`mt-1 w-fit inline-block ${dateBadgeClass}`}>
                  {dateLabel}: {taskDate.toLocaleString()}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 opacity-60 hover:opacity-100 transition-opacity">
          <button
            onClick={() => setIsAddingSubtask(!isAddingSubtask)}
            className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-md transition-colors font-bold text-lg leading-none"
            title="Add subtask"
          >
            {isAddingSubtask ? "×" : "+"}
          </button>

          <button
            onClick={remove}
            className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors"
            disabled={isDeletePending}
            title="Delete task"
          >
            🗑
          </button>
        </div>
      </div>

      {isAddingSubtask && (
        <div className="mt-2 ml-8">
          <TaskForm parentId={task.id} />
        </div>
      )}

      {allTasks.filter((t) => t.parent_task === task.id).length > 0 && (
        <ul className="mt-2 ml-6 pl-4 border-l-2 border-blue-200 space-y-2">
          {allTasks
            .filter((t) => t.parent_task === task.id)
            .map((subtask) => (
              <TaskItem key={subtask.id} task={subtask} allTasks={allTasks} />
            ))}
        </ul>
      )}
    </li>
  );
};

export default TaskItem;

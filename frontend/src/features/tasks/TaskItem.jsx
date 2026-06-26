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
            <>
              <input
                type="text"
                defaultValue={task.title}
                onKeyDown={(e) => e.key === "Enter" && onEditUnFocus(e)}
                onBlur={onEditUnFocus}
                className="border border-gray-300 rounded px-1 py-0.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />

              <input
                type="datetime-local"
                defaultValue={taskDate && formatDateForInput(taskDate)}
                onKeyDown={(e) => e.key === "Enter" && onEditUnFocus(e)}
                onBlur={onEditUnFocus}
                className="border border-gray-300 rounded px-1 py-0.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </>
          ) : (
            <>
              <span
                onClick={() => setIsTaskEditing(true)}
                className="cursor-pointer inline-block max-w-[125px] truncate"
              >
                {task.title}
              </span>

              {taskDate && (
                <span className="text-gray-500 text-xs">
                  Due: {taskDate.toLocaleString()}
                </span>
              )}
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAddingSubtask(!isAddingSubtask)}
              className="text-gray-400 hover:text-blue-600 text-xl leading-none"
            >
              {isAddingSubtask ? "×" : "+"}
            </button>

            <button
              onClick={remove}
              className="text-red-400 hover:text-red-600 text-sm"
              disabled={isDeletePending}
            >
              {isDeletePending ? "Deleting..." : "Delete"}
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
